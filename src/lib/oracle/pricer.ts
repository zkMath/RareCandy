/**
 * Gacha Platform FMV Oracle — Core Pricing Algorithm
 *
 * Pipeline (in order):
 *   1. Staleness filter       — drop sales older than 30 days
 *   2. Winsorization          — remove statistical outliers (2.5 σ from median)
 *   3. Hard bounds            — circuit breaker vs last known price (±50%)
 *   4. Source-weighted avg    — trust-weight by source quality + exponential recency decay
 *   5. 24h TWAP               — time-weighted average over rolling 24-hour window
 *   6. Blend                  — 60% TWAP + 40% weighted avg (manipulation-resistant + responsive)
 *   7. Max-move clamp         — single-update price cannot move >20% from last published price
 *   8. Confidence scoring     — HIGH / MEDIUM / LOW based on data quality
 */

export interface RawSale {
  source: DataSource;
  price: number;       // USD
  timestamp: number;   // unix ms
  volume: number;      // number of sales this data point represents
  saleId?: string;     // optional external ID for deduplication
}

export type DataSource = "poketrace" | "ppt" | "pwcc" | "alt" | "manual";
export type Confidence = "HIGH" | "MEDIUM" | "LOW" | "FROZEN";

export interface OracleResult {
  cardTypeKey: string;
  fmvUsd: number;               // final computed FMV in USD
  fmvUsdCents: number;          // for onchain / DB storage (×100)
  confidence: Confidence;
  salesUsed: number;
  sourceCount: number;
  mostRecentSaleAgeHours: number;
  priceSpreadPct: number;
  twap24h: number;
  weightedAvg: number;
  rawSalesCount: number;
  outliersRejected: number;
  computedAt: number;           // unix ms
  flags: OracleFlag[];
}

export type OracleFlag =
  | "STALE_DATA"           // most recent sale > 24h ago
  | "LOW_VOLUME"           // fewer than 3 sales used
  | "HIGH_SPREAD"          // price spread > 15%
  | "MAX_MOVE_HIT"         // blended price was clamped by ±20% limit
  | "SINGLE_SOURCE"        // only one data source available
  | "FALLBACK_USED"        // fell back to last known price (no valid sales)
  | "FROZEN"               // oracle manually frozen by admin

// ── SOURCE TRUST WEIGHTS (0–1) ───────────────────────────────────────────────
// Higher = more trusted. Reflects data quality, volume, and manipulation risk.
const SOURCE_WEIGHTS: Record<DataSource, number> = {
  poketrace: 1.00,   // eBay + CardMarket sold data, real-time
  ppt:       0.90,   // PokemonPriceTracker, eBay sold, daily updates
  alt:       0.85,   // ALT marketplace, curated dealer pricing
  pwcc:      0.70,   // PWCC/Fanatics historical, less frequent
  manual:    0.50,   // Admin override, lowest trust
};

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const STALENESS_WINDOW_MS   = 30  * 24 * 3600 * 1000; // 30 days
const TWAP_WINDOW_MS        = 24  * 3600 * 1000;      // 24 hours
const RECENCY_HALF_LIFE_H   = 12;                     // exponential decay half-life
const WINSOR_SIGMA          = 2.5;                    // std dev multiplier for outlier rejection
const HARD_BOUND_PCT        = 0.50;                   // ±50% of last known = circuit breaker
const MAX_MOVE_PCT          = 0.20;                   // ±20% max single-update move
const BLEND_TWAP_WEIGHT     = 0.60;                   // 60% TWAP
const BLEND_RECENT_WEIGHT   = 0.40;                   // 40% weighted avg

// Confidence thresholds
const CONF_HIGH_MIN_SALES   = 5;
const CONF_HIGH_MAX_AGE_H   = 24;
const CONF_HIGH_MAX_SPREAD  = 0.10;  // 10%
const CONF_MED_MIN_SALES    = 3;
const CONF_MED_MAX_AGE_H    = 48;
const CONF_MED_MAX_SPREAD   = 0.20;  // 20%

// ── HELPERS ──────────────────────────────────────────────────────────────────
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function stddev(values: number[], mean: number): number {
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function recencyWeight(timestampMs: number, nowMs: number): number {
  const ageHours = (nowMs - timestampMs) / 3600000;
  // Exponential decay: weight = e^(-λt) where λ = ln(2) / half-life
  return Math.exp((-Math.LN2 * ageHours) / RECENCY_HALF_LIFE_H);
}

// ── MAIN ALGORITHM ───────────────────────────────────────────────────────────
export function computeFMV(
  cardTypeKey: string,
  rawSales: RawSale[],
  lastKnownPrice: number,
  frozen: boolean = false,
  now: number = Date.now()
): OracleResult {
  const flags: OracleFlag[] = [];

  // Admin freeze: return last known price immediately
  if (frozen) {
    flags.push("FROZEN");
    return buildResult(cardTypeKey, lastKnownPrice, lastKnownPrice, lastKnownPrice,
      0, 0, 0, 0, 0, rawSales.length, flags, now);
  }

  // ── STEP 1: STALENESS FILTER ──────────────────────────────────────────────
  const fresh = rawSales.filter(s => (now - s.timestamp) < STALENESS_WINDOW_MS);

  if (fresh.length === 0) {
    // No recent sales at all: freeze at last known
    flags.push("STALE_DATA", "FALLBACK_USED");
    return buildResult(cardTypeKey, lastKnownPrice, lastKnownPrice, lastKnownPrice,
      0, 0, Infinity, 0, 0, rawSales.length, flags, now);
  }

  const rawPrices = fresh.map(s => s.price);

  // ── STEP 2: WINSORIZATION ─────────────────────────────────────────────────
  const med = median(rawPrices);
  const priceMean = rawPrices.reduce((s, p) => s + p, 0) / rawPrices.length;
  const sd = stddev(rawPrices, priceMean);
  const winsorized = fresh.filter(s => Math.abs(s.price - med) <= WINSOR_SIGMA * sd);
  const outliersRejected = fresh.length - winsorized.length;

  if (winsorized.length === 0) {
    flags.push("FALLBACK_USED");
    return buildResult(cardTypeKey, lastKnownPrice, lastKnownPrice, lastKnownPrice,
      0, 0, Infinity, outliersRejected, fresh.length - outliersRejected, rawSales.length, flags, now);
  }

  // ── STEP 3: HARD BOUNDS (circuit breaker #1) ──────────────────────────────
  const lowerBound = lastKnownPrice * (1 - HARD_BOUND_PCT);
  const upperBound = lastKnownPrice * (1 + HARD_BOUND_PCT);
  const bounded = winsorized.filter(s => s.price >= lowerBound && s.price <= upperBound);

  if (bounded.length === 0) {
    // All sales are outside hard bounds — strong signal of either error or extreme market move
    // Use median of winsorized (most conservative) but flag heavily
    flags.push("FALLBACK_USED");
    const fallback = median(winsorized.map(s => s.price));
    const clamped = Math.max(lowerBound, Math.min(upperBound, fallback));
    flags.push("MAX_MOVE_HIT");
    return buildResult(cardTypeKey, clamped, clamped, clamped,
      0, 0, Infinity, outliersRejected, 0, rawSales.length, flags, now);
  }

  // ── STEP 4: SOURCE-WEIGHTED AVERAGE ──────────────────────────────────────
  let weightedSum = 0;
  let totalWeight = 0;
  for (const sale of bounded) {
    const sourceW = SOURCE_WEIGHTS[sale.source] ?? 0.5;
    const recencyW = recencyWeight(sale.timestamp, now);
    const w = sourceW * recencyW * sale.volume;
    weightedSum += sale.price * w;
    totalWeight += w;
  }
  const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : median(bounded.map(s => s.price));

  // ── STEP 5: 24h TWAP ──────────────────────────────────────────────────────
  const windowStart = now - TWAP_WINDOW_MS;
  const inWindow = bounded.filter(s => s.timestamp >= windowStart);

  let twap24h: number;
  if (inWindow.length === 0) {
    // No sales in last 24h: use weighted avg as TWAP approximation
    twap24h = weightedAvg;
    flags.push("STALE_DATA");
  } else {
    const sortedByTime = [...inWindow].sort((a, b) => a.timestamp - b.timestamp);
    let twapSum = 0;
    let twapTotalTime = 0;
    for (let i = 0; i < sortedByTime.length; i++) {
      const sale = sortedByTime[i];
      const segStart = i === 0 ? Math.max(windowStart, sale.timestamp) : sale.timestamp;
      const segEnd = i < sortedByTime.length - 1 ? sortedByTime[i + 1].timestamp : now;
      const duration = segEnd - segStart;
      if (duration > 0) {
        twapSum += sale.price * duration;
        twapTotalTime += duration;
      }
    }
    twap24h = twapTotalTime > 0 ? twapSum / twapTotalTime : weightedAvg;
  }

  // ── STEP 6: BLEND ─────────────────────────────────────────────────────────
  const blended = BLEND_TWAP_WEIGHT * twap24h + BLEND_RECENT_WEIGHT * weightedAvg;

  // ── STEP 7: MAX-MOVE CLAMP (circuit breaker #2) ───────────────────────────
  const maxMoveDown = lastKnownPrice * (1 - MAX_MOVE_PCT);
  const maxMoveUp   = lastKnownPrice * (1 + MAX_MOVE_PCT);
  let finalPrice = blended;
  if (blended < maxMoveDown || blended > maxMoveUp) {
    flags.push("MAX_MOVE_HIT");
    finalPrice = Math.max(maxMoveDown, Math.min(maxMoveUp, blended));
  }

  // ── STEP 8: CONFIDENCE SCORE ──────────────────────────────────────────────
  const salesUsed = bounded.length;
  const sourceCount = new Set(bounded.map(s => s.source)).size;
  const mostRecentAgeH = Math.min(...bounded.map(s => (now - s.timestamp))) / 3600000;
  const boundedPrices = bounded.map(s => s.price);
  const spread = (Math.max(...boundedPrices) - Math.min(...boundedPrices)) / finalPrice;

  if (salesUsed < CONF_MED_MIN_SALES) flags.push("LOW_VOLUME");
  if (mostRecentAgeH > 24) flags.push("STALE_DATA");
  if (spread > CONF_HIGH_MAX_SPREAD) flags.push("HIGH_SPREAD");
  if (sourceCount === 1) flags.push("SINGLE_SOURCE");

  return buildResult(
    cardTypeKey, finalPrice, twap24h, weightedAvg,
    salesUsed, sourceCount, mostRecentAgeH,
    outliersRejected, bounded.length, rawSales.length, flags, now,
    spread
  );
}

function buildResult(
  cardTypeKey: string,
  fmvUsd: number,
  twap24h: number,
  weightedAvg: number,
  salesUsed: number,
  sourceCount: number,
  mostRecentSaleAgeHours: number,
  outliersRejected: number,
  salesAfterFiltering: number,
  rawSalesCount: number,
  flags: OracleFlag[],
  computedAt: number,
  spread: number = 0,
): OracleResult {
  const price = Math.round(fmvUsd * 100) / 100; // round to cents

  let confidence: Confidence = "HIGH";
  if (flags.includes("FROZEN")) {
    confidence = "FROZEN";
  } else if (
    flags.includes("FALLBACK_USED") ||
    salesUsed < CONF_MED_MIN_SALES ||
    mostRecentSaleAgeHours > CONF_MED_MAX_AGE_H ||
    spread > CONF_MED_MAX_SPREAD ||
    sourceCount < 2
  ) {
    confidence = "LOW";
  } else if (
    salesUsed < CONF_HIGH_MIN_SALES ||
    mostRecentSaleAgeHours > CONF_HIGH_MAX_AGE_H ||
    spread > CONF_HIGH_MAX_SPREAD
  ) {
    confidence = "MEDIUM";
  }

  return {
    cardTypeKey,
    fmvUsd: price,
    fmvUsdCents: Math.round(price * 100),
    confidence,
    salesUsed,
    sourceCount,
    mostRecentSaleAgeHours,
    priceSpreadPct: spread,
    twap24h: Math.round(twap24h * 100) / 100,
    weightedAvg: Math.round(weightedAvg * 100) / 100,
    rawSalesCount,
    outliersRejected,
    computedAt,
    flags,
  };
}
