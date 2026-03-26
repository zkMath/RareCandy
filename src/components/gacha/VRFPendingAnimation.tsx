"use client";

export function VRFPendingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated capsule */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full bg-plum-400/20 animate-breathe-outer" />
        <div className="absolute inset-3 rounded-full bg-plum-500/30 animate-breathe-mid" />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-plum-500 to-plum-700 animate-capsule-shake shadow-xl shadow-plum-500/40 overflow-hidden">
          <div
            className="absolute inset-0 rounded-full animate-orb-swirl"
            style={{
              background:
                "radial-gradient(circle at 60% 60%, rgba(139,92,246,0.8) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(109,40,217,0.6) 0%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">?</span>
          </div>
        </div>
      </div>

      <p className="text-lg font-semibold text-gray-900 mb-2">
        Generating your card...
      </p>
      <p className="text-sm text-gray-500 max-w-xs text-center">
        Chainlink VRF is selecting your card. This takes 10-30 seconds.
      </p>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-plum-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
