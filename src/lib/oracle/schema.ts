/**
 * Oracle DB Layer (Supabase / PostgreSQL)
 *
 * Tables:
 *   oracle_prices       — published FMV per card type (current + history)
 *   oracle_sales_cache  — raw sales data cached from external sources
 *   oracle_overrides    — admin manual overrides
 *   oracle_alerts       — triggered alerts for admin review
 */

// ── SQL MIGRATIONS ────────────────────────────────────────────────────────────
// Run these once against your Supabase instance.

export const ORACLE_MIGRATIONS = `

-- Current and historical FMV per card type
CREATE TABLE IF NOT EXISTS oracle_prices (
  id                        BIGSERIAL PRIMARY KEY,
  card_type_key             TEXT NOT NULL,
  fmv_usd_cents             INTEGER NOT NULL,          -- price in cents ($95000 = $950.00)
  confidence                TEXT NOT NULL,             -- HIGH | MEDIUM | LOW | FROZEN
  twap_24h_cents            INTEGER NOT NULL,
  weighted_avg_cents        INTEGER NOT NULL,
  sales_used                INTEGER NOT NULL,
  source_count              INTEGER NOT NULL,
  most_recent_sale_age_h    NUMERIC NOT NULL,
  price_spread_pct          NUMERIC NOT NULL,
  outliers_rejected         INTEGER NOT NULL,
  raw_sales_count           INTEGER NOT NULL,
  flags                     TEXT[] NOT NULL DEFAULT '{}',
  computed_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_current                BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_confidence CHECK (confidence IN ('HIGH','MEDIUM','LOW','FROZEN')),
  CONSTRAINT chk_fmv_positive CHECK (fmv_usd_cents > 0)
);

CREATE INDEX IF NOT EXISTS idx_oracle_prices_key_current
  ON oracle_prices (card_type_key, is_current);
CREATE INDEX IF NOT EXISTS idx_oracle_prices_computed_at
  ON oracle_prices (computed_at DESC);

-- Raw sales cache from external APIs (deduped by source + saleId)
CREATE TABLE IF NOT EXISTS oracle_sales_cache (
  id            BIGSERIAL PRIMARY KEY,
  card_type_key TEXT NOT NULL,
  source        TEXT NOT NULL,
  sale_id       TEXT,
  price_cents   INTEGER NOT NULL,
  sold_at       TIMESTAMPTZ NOT NULL,
  volume        INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, sale_id)
);

CREATE INDEX IF NOT EXISTS idx_sales_cache_key_sold
  ON oracle_sales_cache (card_type_key, sold_at DESC);

-- Admin overrides: inject a manual price into the algorithm
CREATE TABLE IF NOT EXISTS oracle_overrides (
  id            BIGSERIAL PRIMARY KEY,
  card_type_key TEXT NOT NULL,
  price_cents   INTEGER NOT NULL,
  reason        TEXT NOT NULL,
  admin_address TEXT NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ
);

-- Alert log: price spikes, low confidence, staleness, etc.
CREATE TABLE IF NOT EXISTS oracle_alerts (
  id            BIGSERIAL PRIMARY KEY,
  card_type_key TEXT NOT NULL,
  alert_type    TEXT NOT NULL,  -- SPIKE | CRASH | STALE | LOW_CONF | MAX_MOVE | FROZEN
  old_price     INTEGER,
  new_price     INTEGER,
  threshold     NUMERIC,
  message       TEXT NOT NULL,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_unresolved
  ON oracle_alerts (resolved, created_at DESC);
`;

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────

export interface OraclePriceRow {
  id: number;
  cardTypeKey: string;
  fmvUsdCents: number;
  confidence: string;
  twap24hCents: number;
  weightedAvgCents: number;
  salesUsed: number;
  sourceCount: number;
  mostRecentSaleAgeH: number;
  priceSpreadPct: number;
  outliersRejected: number;
  rawSalesCount: number;
  flags: string[];
  computedAt: Date;
  isCurrent: boolean;
}

export interface OracleService {
  getCurrentPrice(cardTypeKey: string): Promise<OraclePriceRow | null>;
  getAllCurrentPrices(): Promise<OraclePriceRow[]>;
  upsertPrice(result: import("./pricer").OracleResult): Promise<void>;
  getActiveOverride(cardTypeKey: string): Promise<number | null>;
  createAlert(cardTypeKey: string, type: string, oldPrice: number | null, newPrice: number, message: string): Promise<void>;
  getUnresolvedAlerts(): Promise<any[]>;
  isFrozen(cardTypeKey: string): Promise<boolean>;
}

// ── SUPABASE IMPLEMENTATION ───────────────────────────────────────────────────
// Pass your Supabase client in. Compatible with @supabase/supabase-js v2.

import type { OracleResult } from "./pricer";

export function createOracleService(supabase: any): OracleService {
  return {
    async getCurrentPrice(cardTypeKey) {
      const { data, error } = await supabase
        .from("oracle_prices")
        .select("*")
        .eq("card_type_key", cardTypeKey)
        .eq("is_current", true)
        .single();

      if (error || !data) return null;
      return rowToModel(data);
    },

    async getAllCurrentPrices() {
      const { data, error } = await supabase
        .from("oracle_prices")
        .select("*")
        .eq("is_current", true)
        .order("card_type_key");

      if (error) throw error;
      return (data ?? []).map(rowToModel);
    },

    async upsertPrice(result) {
      // Mark old current row as historical
      await supabase
        .from("oracle_prices")
        .update({ is_current: false })
        .eq("card_type_key", result.cardTypeKey)
        .eq("is_current", true);

      // Insert new current row
      await supabase.from("oracle_prices").insert({
        card_type_key:             result.cardTypeKey,
        fmv_usd_cents:             result.fmvUsdCents,
        confidence:                result.confidence,
        twap_24h_cents:            Math.round(result.twap24h * 100),
        weighted_avg_cents:        Math.round(result.weightedAvg * 100),
        sales_used:                result.salesUsed,
        source_count:              result.sourceCount,
        most_recent_sale_age_h:    result.mostRecentSaleAgeHours,
        price_spread_pct:          result.priceSpreadPct,
        outliers_rejected:         result.outliersRejected,
        raw_sales_count:           result.rawSalesCount,
        flags:                     result.flags,
        computed_at:               new Date(result.computedAt).toISOString(),
        is_current:                true,
      });
    },

    async getActiveOverride(cardTypeKey) {
      const { data } = await supabase
        .from("oracle_overrides")
        .select("price_cents")
        .eq("card_type_key", cardTypeKey)
        .eq("active", true)
        .or("expires_at.is.null,expires_at.gt.now()")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return data?.price_cents ?? null;
    },

    async createAlert(cardTypeKey, alertType, oldPrice, newPrice, message) {
      await supabase.from("oracle_alerts").insert({
        card_type_key: cardTypeKey,
        alert_type:    alertType,
        old_price:     oldPrice,
        new_price:     newPrice,
        message,
      });
    },

    async getUnresolvedAlerts() {
      const { data } = await supabase
        .from("oracle_alerts")
        .select("*")
        .eq("resolved", false)
        .order("created_at", { ascending: false });
      return data ?? [];
    },

    async isFrozen(cardTypeKey) {
      const { data } = await supabase
        .from("oracle_overrides")
        .select("id")
        .eq("card_type_key", cardTypeKey)
        .eq("active", true)
        .eq("price_cents", -1)  // -1 is the freeze sentinel value
        .limit(1)
        .single();
      return !!data;
    },
  };
}

function rowToModel(row: any): OraclePriceRow {
  return {
    id:                   row.id,
    cardTypeKey:          row.card_type_key,
    fmvUsdCents:          row.fmv_usd_cents,
    confidence:           row.confidence,
    twap24hCents:         row.twap_24h_cents,
    weightedAvgCents:     row.weighted_avg_cents,
    salesUsed:            row.sales_used,
    sourceCount:          row.source_count,
    mostRecentSaleAgeH:   Number(row.most_recent_sale_age_h),
    priceSpreadPct:       Number(row.price_spread_pct),
    outliersRejected:     row.outliers_rejected,
    rawSalesCount:        row.raw_sales_count,
    flags:                row.flags ?? [],
    computedAt:           new Date(row.computed_at),
    isCurrent:            row.is_current,
  };
}
