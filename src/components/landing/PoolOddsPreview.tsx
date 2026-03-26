import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

export function PoolOddsPreview() {
  const tiers = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <div
        className="rounded-[28px] border border-white/60 backdrop-blur-md p-8 md:p-12"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <div className="flex flex-col md:flex-row md:gap-16">
          <div className="md:w-1/3 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transparent odds, always on-chain
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Every pull probability is determined by real pool contents, verifiable
              directly on Base. No hidden manipulation.
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">$100 USDC</span> per pull
              <br />
              <span className="font-semibold text-gray-900">$107.86</span> avg item value
              <br />
              <span className="font-semibold text-gray-900">85%</span> buyback guarantee
            </div>

            {/* Floating orbs */}
            <div className="hidden md:block relative w-full h-40 mt-8">
              <div className="absolute w-14 h-14 rounded-full bg-plum-600/80 blur-[1px] animate-float-1" style={{ top: "10%", left: "30%" }} />
              <div className="absolute w-9 h-9 rounded-full bg-plum-400/60 blur-[1px] animate-float-2" style={{ top: "55%", left: "10%" }} />
              <div className="absolute w-11 h-11 rounded-full bg-plum-500/70 blur-[1px] animate-float-3" style={{ top: "30%", left: "65%" }} />
              <div className="absolute w-7 h-7 rounded-full bg-plum-300/50 blur-[1px] animate-float-4" style={{ top: "70%", left: "55%" }} />
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Pool Odds</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Live</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Tier</th>
                    <th className="text-right px-5 py-3 font-medium">Odds</th>
                    <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Value Range</th>
                    <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Keep Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier) => {
                    const cfg = TIER_CONFIG[tier];
                    return (
                      <tr key={tier} className="border-t border-gray-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cfg.color }}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {cfg.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-sm font-semibold text-gray-700">
                          {(cfg.odds / 100).toFixed(1)}%
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                          ${cfg.valueRangeLow}–${cfg.valueRangeHigh}
                        </td>
                        <td className="px-5 py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                          {Math.round(cfg.keepRate * 100)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
