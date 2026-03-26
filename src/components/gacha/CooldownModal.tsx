"use client";

interface CooldownModalProps {
  pullsInSession: number;
  onContinue: () => void;
  onStop: () => void;
}

export function CooldownModal({ pullsInSession, onContinue, onStop }: CooldownModalProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="max-w-sm w-full mx-4 rounded-2xl border border-white/60 p-8 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        }}
      >
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          Take a break?
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          You&apos;ve pulled {pullsInSession} times this session. Consider taking a moment before continuing.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onStop}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            I&apos;ll stop
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
