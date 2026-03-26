import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

export function DashboardPreview() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16">
      {/* Outer glass border */}
      <div
        className="rounded-[28px] p-4 border border-white/60 bg-white/20 backdrop-blur-md shadow-2xl shadow-plum-200/20"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Mock browser bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <div className="flex-1 mx-4">
              <div className="w-48 h-5 bg-gray-200 rounded-full mx-auto" />
            </div>
          </div>

          <div className="flex min-h-[340px]">
            {/* Sidebar mock */}
            <div className="w-52 border-r border-gray-100 p-4 hidden sm:block">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-gradient-to-br from-plum-500 to-plum-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">RC</span>
                </div>
                <span className="text-sm font-bold text-gray-900">RareCandy</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 px-2.5 py-2 bg-plum-50 rounded-lg">
                  <div className="w-4 h-4 rounded bg-plum-300" />
                  <span className="text-xs font-medium text-plum-700">Pull</span>
                </div>
                {["Collection", "Marketplace", "Pool", "Redeem"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg"
                  >
                    <div className="w-4 h-4 rounded bg-gray-200" />
                    <span className="text-xs text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content mock */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-gray-900">
                  Pool Overview
                </span>
                <div className="w-14 h-6 bg-gray-100 rounded text-[9px] flex items-center justify-center text-gray-400">
                  Live
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-plum-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-gray-900">300</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Cards in Pool
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-gray-900">$107.86</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Avg Value
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-base font-bold text-gray-900">+7.9%</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Expected Value
                  </span>
                </div>
              </div>

              {/* Tier bars */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Tier Distribution
                </span>
                <div className="mt-3 space-y-2">
                  {[
                    { tier: Tier.Base, count: 147 },
                    { tier: Tier.MidLow, count: 70 },
                    { tier: Tier.Mid, count: 69 },
                    { tier: Tier.High, count: 12 },
                    { tier: Tier.Legendary, count: 2 },
                  ].map(({ tier, count }) => {
                    const cfg = TIER_CONFIG[tier];
                    const pct = (count / 300) * 100;
                    return (
                      <div key={tier} className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 w-16 text-right">
                          {cfg.name}
                        </span>
                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: cfg.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
