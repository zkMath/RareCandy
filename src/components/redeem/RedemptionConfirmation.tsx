interface RedemptionConfirmationProps {
  cardName: string;
  feeTxHash: string | null;
  onViewCollection: () => void;
}

export function RedemptionConfirmation({
  cardName,
  feeTxHash,
  onViewCollection,
}: RedemptionConfirmationProps) {
  return (
    <div
      className="rounded-[28px] border border-white/60 backdrop-blur-md p-8 text-center"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Redemption Submitted!</h2>
      <p className="text-gray-500 mb-6">
        Your <span className="font-medium">{cardName}</span> will be securely packaged and shipped.
        You&apos;ll receive tracking information once dispatched.
      </p>

      {feeTxHash && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">Fee Transaction</p>
          <a
            href={`https://basescan.org/tx/${feeTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-plum-600 hover:text-plum-700 font-mono break-all"
          >
            {feeTxHash.slice(0, 10)}...{feeTxHash.slice(-8)}
          </a>
        </div>
      )}

      <button
        onClick={onViewCollection}
        className="px-8 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
      >
        View Collection
      </button>
    </div>
  );
}
