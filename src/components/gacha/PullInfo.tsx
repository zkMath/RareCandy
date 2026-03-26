import { PULL_PRICE_USD, POOL_EV_USD, BUYBACK_BPS } from "@/constants/tiers";

export function PullInfo() {
  const buybackPct = BUYBACK_BPS / 100;
  const evAdvantage = ((POOL_EV_USD - PULL_PRICE_USD) / PULL_PRICE_USD * 100).toFixed(1);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-center">
        <span className="text-base font-bold text-gray-900">${PULL_PRICE_USD}</span>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Pull Price</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-center">
        <span className="text-base font-bold text-gray-900">${POOL_EV_USD}</span>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Avg Value (+{evAdvantage}%)</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-center">
        <span className="text-base font-bold text-gray-900">{buybackPct}%</span>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Buyback</p>
      </div>
    </div>
  );
}
