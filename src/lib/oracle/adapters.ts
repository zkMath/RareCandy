/**
 * Data Source Adapters
 * Each adapter fetches raw sales data for a given card type key
 * and normalises it into the standard RawSale format.
 *
 * Card type key format: "SET_NUMBER-CARD_NAME-GRADE"
 * Example: "EVS-215-UMBREON_VMAX_ALT-PSA10"
 */

import type { RawSale, DataSource } from "./pricer";

// ── CARD TYPE KEY REGISTRY ────────────────────────────────────────────────────
// Maps our internal cardTypeKey to each source's identifier format.
// This is how we avoid brittle string matching across sources.

export interface CardIdentifiers {
  cardTypeKey: string;         // our internal key
  poketraceId?: string;        // PokeTrace card ID (their format)
  pptTcgPlayerId?: string;     // PokemonPriceTracker TCGPlayer ID
  ebaySearchQuery?: string;    // fallback eBay search string (exact title match)
  pwccSlug?: string;           // PWCC/Fanatics card slug
}

// ── SOURCE: POKETRACE ────────────────────────────────────────────────────────
// Primary source. eBay + CardMarket sold data. Real-time.
// Docs: https://poketrace.com/developers

export async function fetchFromPokeTrace(
  card: CardIdentifiers,
  apiKey: string
): Promise<RawSale[]> {
  if (!card.poketraceId) return [];

  const url = `https://api.poketrace.com/v1/cards/${card.poketraceId}/sales` +
    `?grade=PSA10&market=US&limit=50&sort=soldAt:desc`;

  const res = await fetchWithRetry(url, {
    headers: { "X-API-Key": apiKey },
    timeout: 8000,
  });

  if (!res.ok) {
    console.warn(`[PokeTrace] ${res.status} for ${card.cardTypeKey}`);
    return [];
  }

  const data = await res.json();
  const sales: RawSale[] = [];

  for (const item of (data.sales ?? [])) {
    const price = parseFloat(item.salePrice);
    const ts = new Date(item.soldAt).getTime();
    if (isNaN(price) || isNaN(ts) || price <= 0) continue;

    sales.push({
      source: "poketrace",
      price,
      timestamp: ts,
      volume: 1,
      saleId: `poketrace-${item.saleId ?? ts}`,
    });
  }

  return sales;
}

// ── SOURCE: POKEMON PRICE TRACKER ────────────────────────────────────────────
// Secondary source. eBay sold data, daily updated.
// Docs: https://www.pokemonpricetracker.com/api-reference
// Note: PSA10 data available on Business plan ($99/mo) — commercial licence required

export async function fetchFromPPT(
  card: CardIdentifiers,
  apiKey: string
): Promise<RawSale[]> {
  if (!card.pptTcgPlayerId) return [];

  const url = `https://www.pokemonpricetracker.com/api/v2/cards` +
    `?tcgPlayerId=${card.pptTcgPlayerId}&includeHistory=true&days=30`;

  const res = await fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    timeout: 8000,
  });

  if (!res.ok) {
    console.warn(`[PPT] ${res.status} for ${card.cardTypeKey}`);
    return [];
  }

  const data = await res.json();
  const psa10Data = data.data?.[0]?.ebay?.psa10;
  if (!psa10Data) return [];

  const sales: RawSale[] = [];

  // PPT returns aggregated data per day, not individual sales
  // We treat each day's avg as one data point with volume = saleCount
  for (const point of (psa10Data.history ?? [])) {
    const price = parseFloat(point.avg ?? point.price);
    const ts = new Date(point.date).getTime();
    if (isNaN(price) || isNaN(ts) || price <= 0) continue;

    sales.push({
      source: "ppt",
      price,
      timestamp: ts,
      volume: point.count ?? 1,
      saleId: `ppt-${card.pptTcgPlayerId}-${point.date}`,
    });
  }

  // Also include today's spot price if available
  if (psa10Data.avg && psa10Data.avg > 0) {
    sales.push({
      source: "ppt",
      price: parseFloat(psa10Data.avg),
      timestamp: Date.now() - 3600000, // treat as 1h ago
      volume: 1,
      saleId: `ppt-spot-${card.cardTypeKey}`,
    });
  }

  return sales;
}

// ── SOURCE: PSA PUBLIC API (cert verification only, no prices) ────────────────
// PSA API provides cert data but not market prices.
// We use it to verify cert numbers when minting cards, not for pricing.
// Docs: https://www.psacard.com/publicapi/documentation

export async function verifyCert(
  certNumber: string,
  authToken: string
): Promise<{ valid: boolean; grade?: string; cardName?: string }> {
  const url = `https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}`;

  const res = await fetchWithRetry(url, {
    headers: { authorization: `bearer ${authToken}` },
    timeout: 10000,
  });

  if (!res.ok) return { valid: false };

  const data = await res.json();
  const cert = data.PSACert ?? data;

  return {
    valid: cert?.IsDualCert === false || cert?.CertNumber !== undefined,
    grade: cert?.CardGrade,
    cardName: cert?.Subject,
  };
}

// ── SOURCE: MANUAL OVERRIDE ───────────────────────────────────────────────────
// Admin-entered price override. Lowest trust weight (0.5).
// Stored in DB, surfaced here as a RawSale for consistency.

export function buildManualSale(price: number, adminNote: string): RawSale {
  return {
    source: "manual",
    price,
    timestamp: Date.now(),
    volume: 1,
    saleId: `manual-${Date.now()}-${adminNote.slice(0, 20)}`,
  };
}

// ── AGGREGATOR ────────────────────────────────────────────────────────────────
// Fetches from all sources, deduplicates, returns combined list.

export async function fetchAllSales(
  card: CardIdentifiers,
  config: { poketraceKey: string; pptKey: string },
  manualOverrides: RawSale[] = []
): Promise<RawSale[]> {
  const results = await Promise.allSettled([
    fetchFromPokeTrace(card, config.poketraceKey),
    fetchFromPPT(card, config.pptKey),
  ]);

  const allSales: RawSale[] = [...manualOverrides];

  for (const r of results) {
    if (r.status === "fulfilled") {
      allSales.push(...r.value);
    } else {
      console.error("[oracle] Source fetch failed:", r.reason?.message);
    }
  }

  // Deduplicate by saleId
  const seen = new Set<string>();
  return allSales.filter(s => {
    if (!s.saleId) return true;
    if (seen.has(s.saleId)) return false;
    seen.add(s.saleId);
    return true;
  });
}

// ── FETCH WITH RETRY ──────────────────────────────────────────────────────────
async function fetchWithRetry(
  url: string,
  options: RequestInit & { timeout?: number },
  retries = 2
): Promise<Response> {
  const { timeout = 8000, ...fetchOptions } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
      clearTimeout(timer);
      if (res.status === 429 && attempt < retries) {
        // Rate limited: back off exponentially
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      return res;
    } catch (err: any) {
      clearTimeout(timer);
      if (attempt === retries) throw err;
      await sleep(500 * 2 ** attempt);
    }
  }

  throw new Error(`fetchWithRetry exhausted all attempts for ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
