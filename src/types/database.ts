import { OracleConfidence, PullOutcome, RedemptionStatus, Tier } from "./enums";

export interface CardRow {
  id: string;
  token_id: number;
  psa_cert: string;
  card_name: string;
  set_code: string;
  tier: Tier;
  fmv_usd_cents: number;
  acquisition_cost_usd_cents: number;
  acquired_at: string;
  in_pool: boolean;
  ipfs_metadata_uri: string;
  created_at: string;
  updated_at: string;
}

export interface PullRow {
  id: string;
  tx_hash: string;
  user_address: string;
  token_id: number;
  pull_price_usd_cents: number;
  card_fmv_at_pull: number;
  tier: Tier;
  outcome: PullOutcome;
  pulled_at: string;
}

export interface BuybackRow {
  id: string;
  tx_hash: string;
  token_id: number;
  user_address: string;
  buyback_amount_usd_cents: number;
  fmv_at_buyback: number;
  executed_at: string;
}

export interface OraclePriceRow {
  id: string;
  card_type_key: string;
  fmv_usd_cents: number;
  source: "ebay" | "alt" | "manual";
  confidence: OracleConfidence;
  sample_size: number;
  updated_at: string;
}

export interface RedemptionRow {
  id: string;
  token_id: number;
  user_address: string;
  shipping_name: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  fee_tx_hash: string;
  status: RedemptionStatus;
  created_at: string;
  dispatched_at: string | null;
}

export interface RevenueSnapshotRow {
  id: string;
  date: string;
  gross_pull_revenue: number;
  buyback_payouts: number;
  cash_revenue: number;
  restock_cost: number;
  gross_profit: number;
  marketplace_fees: number;
  redemption_fees: number;
  total_revenue: number;
}
