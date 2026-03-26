import { Tier } from "@/types";
import { TIER_CONFIG, MIN_POOL_DEPTH } from "@/constants/tiers";

interface TierDepthBarProps {
  tier: Tier;
  count: number;
  maxCount?: number;
}

export function TierDepthBar({ tier, count, maxCount = 200 }: TierDepthBarProps) {
  const config = TIER_CONFIG[tier];
  const percentage = Math.min((count / maxCount) * 100, 100);
  const isLow = count < MIN_POOL_DEPTH;

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold w-16 ${config.textColor}`}>{config.name}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: isLow ? "#ef4444" : config.color,
          }}
        />
      </div>
      <span className={`text-xs font-medium w-10 text-right ${isLow ? "text-red-500" : "text-gray-500"}`}>
        {count}
      </span>
    </div>
  );
}
