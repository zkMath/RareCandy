import { Tier, OracleConfidence, RedemptionStatus } from "./enums";

// GET /api/pool
export interface PoolResponse {
  tiers: {
    tier: Tier;
    name: string;
    cardCount: number;
    odds: number;
    valueRangeLow: number;
    valueRangeHigh: number;
  }[];
  totalCards: number;
  weightedAvgFmv: number;
  lastUpdated: string;
}

// GET /api/card/[tokenId]
export interface CardDetailResponse {
  tokenId: number;
  cardName: string;
  psaCert: string;
  setCode: string;
  tier: Tier;
  currentFmv: number;
  imageUri: string;
  metadataUri: string;
  inPool: boolean;
  redeemed: boolean;
  pullHistory: {
    userAddress: string;
    pullPrice: number;
    fmvAtPull: number;
    pulledAt: string;
  }[];
}

// GET /api/pulls/recent
export interface RecentPull {
  cardName: string;
  tier: Tier;
  pulledAt: string;
  address: string; // anonymised: first4...last4
}

// GET /api/user/[address]/collection
export interface CollectionItem {
  tokenId: number;
  cardName: string;
  tier: Tier;
  currentFmv: number;
  imageUri: string;
  buybackEligible: boolean;
  buybackExpiry: string | null;
  buybackAmount: number | null;
  redemptionStatus: RedemptionStatus | null;
}

// GET /api/marketplace/listings
export interface MarketplaceListing {
  listingId: number;
  tokenId: number;
  cardName: string;
  tier: Tier;
  price: number;
  currentFmv: number;
  sellerAddress: string;
  imageUri: string;
  listedAt: string;
}

// POST /api/redeem
export interface RedeemRequest {
  tokenId: number;
  shippingName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  feeTxHash: string;
}

// POST /api/admin/mint
export interface MintRequest {
  psaCert: string;
  cardName: string;
  setCode: string;
  tier: Tier;
  fmvUsdCents: number;
  metadataCID: string;
}

// GET /api/admin/analytics
export interface AnalyticsResponse {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  pullVolume: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  buybackRate: number;
  vaultBalance: number;
  oracleStatus: {
    cardTypeKey: string;
    fmv: number;
    confidence: OracleConfidence;
    lastUpdated: string;
  }[];
}
