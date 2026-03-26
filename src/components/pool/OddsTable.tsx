import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";
import { TierBadge } from "@/components/cards/TierBadge";

interface OddsTableProps {
  tierData?: {
    tier: Tier;
    cardCount: number;
    effectiveOdds: number;
  }[];
}

export function OddsTable({ tierData }: OddsTableProps) {
  const tiers = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Tier</th>
            <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Odds</th>
            <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Value Range</th>
            <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Keep Rate</th>
            <th className="text-right py-3 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Cards</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => {
            const config = TIER_CONFIG[tier];
            const data = tierData?.find((t) => t.tier === tier);
            const odds = data ? data.effectiveOdds / 100 : config.odds / 100;

            return (
              <tr key={tier} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-2">
                  <TierBadge tier={tier} />
                </td>
                <td className="py-3 px-2 text-right font-medium text-gray-900">
                  {odds.toFixed(1)}%
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  ${config.valueRangeLow}–${config.valueRangeHigh}
                </td>
                <td className="py-3 px-2 text-right text-gray-600">
                  {(config.keepRate * 100).toFixed(0)}%
                </td>
                <td className="py-3 px-2 text-right font-medium text-gray-900">
                  {data?.cardCount ?? "–"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
