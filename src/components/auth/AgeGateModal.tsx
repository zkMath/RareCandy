"use client";

import { useAgeGate } from "@/hooks/useAgeGate";

export function AgeGateModal() {
  const { showAgeGate, isLoading, confirmAge } = useAgeGate();

  if (isLoading || !showAgeGate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="max-w-md w-full mx-4 rounded-2xl border border-white/60 p-8 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-plum-500 to-plum-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">RC</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Age Verification
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          You must be 18 years or older to access RareCandy.
          This platform involves purchasing digital collectibles backed by physical trading cards.
        </p>

        <button
          onClick={confirmAge}
          className="w-full px-6 py-3.5 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
        >
          I confirm I am 18 or older
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          By continuing, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
}
