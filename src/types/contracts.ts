import { Tier } from "./enums";

export interface CardData {
  psaCert: string;
  cardName: string;
  tier: Tier;
  fmvAtMint: bigint;
  mintedAt: bigint;
  redeemed: boolean;
}

export interface PullRecord {
  tokenId: bigint;
  pullPrice: bigint;
  cardFmv: bigint;
  tier: Tier;
  timestamp: bigint;
}

export interface Listing {
  listingId: bigint;
  tokenId: bigint;
  seller: `0x${string}`;
  priceUsd6: bigint;
  active: boolean;
}

export interface OraclePrice {
  fmvUsd6: bigint;
  updatedAt: bigint;
  confidence: bigint;
}

export interface BuybackInfo {
  eligible: boolean;
  amount: bigint;
  expiresAt: bigint;
}

export interface PoolTierData {
  tier: Tier;
  cardCount: number;
  odds: number;
  effectiveOdds: number;
  tokenIds: readonly bigint[];
}

export interface PoolState {
  tiers: PoolTierData[];
  totalCards: number;
  weightedAvgFmv: number;
}
