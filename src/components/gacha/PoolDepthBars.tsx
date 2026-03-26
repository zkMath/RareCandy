import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

interface PoolDepthBarsProps {
  tierPoolLengths: number[];
}

const TIERS = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

export function PoolDepthBars({ tierPoolLengths }: PoolDepthBarsProps) {
  const total = tierPoolLengths.reduce((s, n) => s + n, 0) || 1;

  return (
    <div className="space-y-2.5">
      {TIERS.map((tier, i) => {
        const cfg = TIER_CONFIG[tier];
        const count = tierPoolLengths[i] ?? 0;
        const pct = (count / total) * 100;
        return (
          <div key={tier} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-16 text-right font-medium">
              {cfg.name}
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(pct, 1)}%`,
                  backgroundColor: cfg.color,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 font-medium">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
