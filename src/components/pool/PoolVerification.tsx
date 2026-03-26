import { GACHA_MACHINE_ADDRESS, GACHA_CARD_ADDRESS } from "@/constants/addresses";

export function PoolVerification() {
  return (
    <div
      className="rounded-2xl border border-white/60 backdrop-blur-md p-5"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            On-Chain Verification
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            All data on this page is read directly from smart contracts on Base L2.
            No backend or database is used. Verify independently on Basescan.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://basescan.org/address/${GACHA_MACHINE_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-plum-600 hover:text-plum-700 font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              GachaMachine Contract
            </a>
            <a
              href={`https://basescan.org/address/${GACHA_CARD_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-plum-600 hover:text-plum-700 font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              GachaCard Contract
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
