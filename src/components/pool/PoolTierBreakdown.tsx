"use client";

import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";
import { TierBadge } from "@/components/cards/TierBadge";

interface PoolTierInfo {
  tier: Tier;
  tokenIds: bigint[];
  odds: number;
}

interface PoolTierBreakdownProps {
  tierData: PoolTierInfo[];
  totalCards: number;
  selectedTier: Tier | null;
  onSelectTier: (tier: Tier | null) => void;
}

export function PoolTierBreakdown({
  tierData,
  totalCards,
  selectedTier,
  onSelectTier,
}: PoolTierBreakdownProps) {
  return (
    <div className="space-y-3">
      {tierData.map(({ tier, tokenIds, odds }) => {
        const config = TIER_CONFIG[tier];
        const count = tokenIds.length;
        const pct = totalCards > 0 ? (count / totalCards) * 100 : 0;
        const isSelected = selectedTier === tier;

        return (
          <button
            key={tier}
            onClick={() => onSelectTier(isSelected ? null : tier)}
            className={`w-full text-left rounded-2xl border backdrop-blur-md p-5 transition-all ${
              isSelected
                ? "border-plum-300 shadow-md"
                : "border-white/60 hover:border-plum-200 hover:shadow-sm"
            }`}
            style={{
              background: isSelected
                ? "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TierBadge tier={tier} />
                <span className="text-sm font-medium text-gray-500">
                  {count} card{count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {(odds / 100).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400 ml-1">odds</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(pct, 1)}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">
                ${config.valueRangeLow}–${config.valueRangeHigh} range
              </span>
              <span className="text-xs text-gray-400">
                {pct.toFixed(1)}% of pool
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
