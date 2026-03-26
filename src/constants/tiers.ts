import { Tier } from "@/types";

export interface TierConfig {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  odds: number; // basis points out of 10000
  valueRangeLow: number;
  valueRangeHigh: number;
  keepRate: number;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  [Tier.Base]: {
    name: "Base",
    color: "#8b5cf6",
    bgColor: "bg-plum-100",
    textColor: "text-plum-700",
    odds: 4900,
    valueRangeLow: 60,
    valueRangeHigh: 80,
    keepRate: 0.02,
  },
  [Tier.MidLow]: {
    name: "Mid-Low",
    color: "#22c55e",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    odds: 2340,
    valueRangeLow: 80,
    valueRangeHigh: 100,
    keepRate: 0.05,
  },
  [Tier.Mid]: {
    name: "Mid",
    color: "#eab308",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    odds: 2300,
    valueRangeLow: 100,
    valueRangeHigh: 200,
    keepRate: 0.15,
  },
  [Tier.High]: {
    name: "High",
    color: "#f97316",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    odds: 400,
    valueRangeLow: 200,
    valueRangeHigh: 400,
    keepRate: 0.4,
  },
  [Tier.Legendary]: {
    name: "Legendary",
    color: "#a855f7",
    bgColor: "bg-violet-100",
    textColor: "text-violet-700",
    odds: 60,
    valueRangeLow: 400,
    valueRangeHigh: 1600,
    keepRate: 0.8,
  },
};

export const PULL_PRICE_USD = 100;
export const PULL_PRICE_USDC6 = BigInt(100_000_000); // 100 USDC (6 decimals)
export const BUYBACK_BPS = 8500; // 85%
export const MARKETPLACE_FEE_BPS = 200; // 2%
export const REDEMPTION_FEE_USD = 20;
export const BUYBACK_WINDOW_HOURS = 72;
export const POOL_EV_USD = 107.86;
export const MIN_POOL_DEPTH = 20;
