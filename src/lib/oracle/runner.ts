/**
 * Oracle Job Runner
 *
 * Three Inngest jobs:
 *   1. oracle/refresh.all       — runs every 6h, refreshes ALL cards in pool
 *   2. oracle/refresh.single    — triggered on-demand for a specific card (e.g. post-pull)
 *   3. oracle/publish.onchain   — pushes updated prices to FMVOracle.sol on Base
 *
 * Alert thresholds:
 *   SPIKE  — new price > last price * 1.15 (15% up in one cycle)
 *   CRASH  — new price < last price * 0.85 (15% down in one cycle)
 *   STALE  — most recent sale > 48h
 *   LOW_CONF  — confidence = LOW
 *   MAX_MOVE  — max-move clamp was triggered
 */

import { computeFMV } from "./pricer";
import { fetchAllSales, type CardIdentifiers } from "./adapters";
import type { OracleService } from "./schema";
import type { RawSale } from "./pricer";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ALERT_SPIKE_PCT  = 0.15;   // alert if price rises  >15% in one cycle
const ALERT_CRASH_PCT  = 0.15;   // alert if price falls  >15% in one cycle
const STALE_ALERT_H    = 48;     // alert if most recent sale > 48h old

// ── MAIN REFRESH LOGIC ───────────────────────────────────────────────────────
export async function refreshCard(
  card: CardIdentifiers,
  db: OracleService,
  config: { poketraceKey: string; pptKey: string }
): Promise<void> {
  console.log(`[oracle] Refreshing ${card.cardTypeKey}`);

  // 1. Get last known price from DB
  const current = await db.getCurrentPrice(card.cardTypeKey);
  const lastKnownPrice = current ? current.fmvUsdCents / 100 : 0;

  if (lastKnownPrice <= 0) {
    console.warn(`[oracle] No last known price for ${card.cardTypeKey} — skipping (need manual seed)`);
    return;
  }

  // 2. Check if admin froze this card
  const frozen = await db.isFrozen(card.cardTypeKey);

  // 3. Fetch raw sales from all sources
  const rawSales: RawSale[] = await fetchAllSales(card, config);

  // 4. Check for active manual override — inject as highest-weighted sale
  const overrideCents = await db.getActiveOverride(card.cardTypeKey);
  if (overrideCents && overrideCents > 0) {
    rawSales.push({
      source: "manual",
      price: overrideCents / 100,
      timestamp: Date.now(),
      volume: 3,  // higher volume gives manual override more weight
      saleId: `manual-override-${Date.now()}`,
    });
    console.log(`[oracle] Manual override active for ${card.cardTypeKey}: $${overrideCents / 100}`);
  }

  // 5. Run the pricing algorithm
  const result = computeFMV(
    card.cardTypeKey,
    rawSales,
    lastKnownPrice,
    frozen
  );

  console.log(
    `[oracle] ${card.cardTypeKey}: $${result.fmvUsd} ` +
    `(was $${lastKnownPrice}) confidence=${result.confidence} ` +
    `flags=[${result.flags.join(",")}]`
  );

  // 6. Alert detection
  if (current && lastKnownPrice > 0) {
    const changeRatio = result.fmvUsd / lastKnownPrice;

    if (changeRatio > (1 + ALERT_SPIKE_PCT)) {
      const msg = `PRICE SPIKE: ${card.cardTypeKey} moved +${((changeRatio-1)*100).toFixed(1)}% from $${lastKnownPrice} to $${result.fmvUsd}`;
      console.warn(`[oracle] ALERT: ${msg}`);
      await db.createAlert(card.cardTypeKey, "SPIKE", current.fmvUsdCents, result.fmvUsdCents, msg);
    }

    if (changeRatio < (1 - ALERT_CRASH_PCT)) {
      const msg = `PRICE CRASH: ${card.cardTypeKey} moved ${((changeRatio-1)*100).toFixed(1)}% from $${lastKnownPrice} to $${result.fmvUsd}`;
      console.warn(`[oracle] ALERT: ${msg}`);
      await db.createAlert(card.cardTypeKey, "CRASH", current.fmvUsdCents, result.fmvUsdCents, msg);
    }
  }

  if (result.mostRecentSaleAgeHours > STALE_ALERT_H) {
    await db.createAlert(card.cardTypeKey, "STALE", null, result.fmvUsdCents,
      `Most recent sale is ${result.mostRecentSaleAgeHours.toFixed(0)}h old for ${card.cardTypeKey}`);
  }

  if (result.confidence === "LOW") {
    await db.createAlert(card.cardTypeKey, "LOW_CONF", null, result.fmvUsdCents,
      `Low confidence oracle for ${card.cardTypeKey}: salesUsed=${result.salesUsed}, sources=${result.sourceCount}`);
  }

  if (result.flags.includes("MAX_MOVE_HIT")) {
    await db.createAlert(card.cardTypeKey, "MAX_MOVE", current?.fmvUsdCents ?? null, result.fmvUsdCents,
      `Max-move clamp triggered for ${card.cardTypeKey}: blended price was clamped to ±20% limit`);
  }

  // 7. Persist result to DB
  await db.upsertPrice(result);
}

// ── BATCH REFRESH ALL CARDS ───────────────────────────────────────────────────
export async function refreshAllCards(
  cards: CardIdentifiers[],
  db: OracleService,
  config: { poketraceKey: string; pptKey: string },
  onchainPublisher?: OnchainPublisher
): Promise<void> {
  console.log(`[oracle] Starting batch refresh for ${cards.length} cards`);

  const results = await Promise.allSettled(
    cards.map(card => refreshCard(card, db, config))
  );

  let ok = 0, failed = 0;
  results.forEach((r, i) => {
    if (r.status === "fulfilled") ok++;
    else {
      failed++;
      console.error(`[oracle] Failed to refresh ${cards[i].cardTypeKey}:`, r.reason?.message);
    }
  });

  console.log(`[oracle] Batch refresh complete: ${ok} ok, ${failed} failed`);

  // Push updated prices onchain
  if (onchainPublisher) {
    await publishOnchain(cards, db, onchainPublisher);
  }
}

// ── ONCHAIN PUBLISHING ────────────────────────────────────────────────────────
// Pushes FMV prices to FMVOracle.sol on Base.
// Only publishes if confidence >= MEDIUM.

export interface OnchainPublisher {
  batchUpdatePrices(
    cardTypeKeys: string[],
    fmvUsdCents: number[]
  ): Promise<string>; // returns tx hash
}

export async function publishOnchain(
  cards: CardIdentifiers[],
  db: OracleService,
  publisher: OnchainPublisher
): Promise<void> {
  const allPrices = await db.getAllCurrentPrices();
  const publishable = allPrices.filter(p =>
    p.confidence !== "LOW" && p.confidence !== "FROZEN" &&
    cards.some(c => c.cardTypeKey === p.cardTypeKey)
  );

  if (publishable.length === 0) {
    console.log("[oracle] Nothing to publish onchain");
    return;
  }

  const keys  = publishable.map(p => p.cardTypeKey);
  const cents = publishable.map(p => p.fmvUsdCents);

  try {
    const txHash = await publisher.batchUpdatePrices(keys, cents);
    console.log(`[oracle] Published ${publishable.length} prices onchain: ${txHash}`);
  } catch (err: any) {
    console.error("[oracle] Onchain publish failed:", err.message);
    // Don't throw: failure to publish onchain should not break the oracle cycle
    // The DB always has the latest price; onchain is secondary
  }
}

// ── INNGEST JOB DEFINITIONS ───────────────────────────────────────────────────

export const INNGEST_EVENTS = {
  REFRESH_ALL:    "oracle/refresh.all",
  REFRESH_SINGLE: "oracle/refresh.single",
  PUBLISH:        "oracle/publish.onchain",
} as const;
