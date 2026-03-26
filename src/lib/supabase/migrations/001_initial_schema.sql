-- RareCandy Initial Schema
-- Run via Supabase SQL Editor

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id INTEGER UNIQUE NOT NULL,
  psa_cert TEXT NOT NULL,
  card_name TEXT NOT NULL,
  set_code TEXT NOT NULL,
  tier SMALLINT NOT NULL CHECK (tier >= 0 AND tier <= 4),
  fmv_usd_cents INTEGER NOT NULL,
  acquisition_cost_usd_cents INTEGER NOT NULL DEFAULT 0,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  in_pool BOOLEAN NOT NULL DEFAULT TRUE,
  ipfs_metadata_uri TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pulls table
CREATE TABLE IF NOT EXISTS pulls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE NOT NULL,
  user_address TEXT NOT NULL,
  token_id INTEGER NOT NULL REFERENCES cards(token_id),
  pull_price_usd_cents INTEGER NOT NULL,
  card_fmv_at_pull INTEGER NOT NULL,
  tier SMALLINT NOT NULL CHECK (tier >= 0 AND tier <= 4),
  outcome TEXT NOT NULL CHECK (outcome IN ('kept', 'sold_back', 'listed', 'redeemed')),
  pulled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Buybacks table
CREATE TABLE IF NOT EXISTS buybacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE NOT NULL,
  token_id INTEGER NOT NULL REFERENCES cards(token_id),
  user_address TEXT NOT NULL,
  buyback_amount_usd_cents INTEGER NOT NULL,
  fmv_at_buyback INTEGER NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Oracle prices table
CREATE TABLE IF NOT EXISTS oracle_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type_key TEXT NOT NULL,
  fmv_usd_cents INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('ebay', 'alt', 'manual')),
  confidence TEXT NOT NULL CHECK (confidence IN ('HIGH', 'MEDIUM', 'LOW')),
  sample_size INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Redemptions table
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id INTEGER NOT NULL REFERENCES cards(token_id),
  user_address TEXT NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  fee_tx_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'dispatched', 'delivered')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ
);

-- Revenue snapshots table
CREATE TABLE IF NOT EXISTS revenue_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  gross_pull_revenue INTEGER NOT NULL DEFAULT 0,
  buyback_payouts INTEGER NOT NULL DEFAULT 0,
  cash_revenue INTEGER NOT NULL DEFAULT 0,
  restock_cost INTEGER NOT NULL DEFAULT 0,
  gross_profit INTEGER NOT NULL DEFAULT 0,
  marketplace_fees INTEGER NOT NULL DEFAULT 0,
  redemption_fees INTEGER NOT NULL DEFAULT 0,
  total_revenue INTEGER NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pulls_user_address ON pulls(user_address);
CREATE INDEX IF NOT EXISTS idx_pulls_pulled_at ON pulls(pulled_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_tier ON cards(tier);
CREATE INDEX IF NOT EXISTS idx_cards_in_pool ON cards(in_pool);
CREATE INDEX IF NOT EXISTS idx_oracle_prices_card_type_key ON oracle_prices(card_type_key);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON redemptions(status);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_address ON redemptions(user_address);

-- Updated_at trigger for cards
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
