"use client";

interface RevealAnimationProps {
  tierColor: string;
}

export function RevealAnimation({ tierColor }: RevealAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      {/* Capsule opening animation */}
      <div className="relative w-48 h-48 mb-8">
        <div
          className="absolute inset-0 rounded-full animate-breathe-outer"
          style={{ backgroundColor: `${tierColor}20` }}
        />
        <div
          className="absolute inset-4 rounded-full animate-breathe-mid"
          style={{ backgroundColor: `${tierColor}30` }}
        />
        <div
          className="absolute inset-8 rounded-full animate-capsule-shake shadow-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${tierColor} 0%, ${tierColor}dd 100%)`,
            boxShadow: `0 20px 60px ${tierColor}40`,
          }}
        >
          <div className="w-full h-0.5 bg-white/30 absolute" />
          <div className="text-white font-bold text-4xl animate-pulse">?</div>
        </div>
      </div>

      <p className="text-xl font-bold text-gray-900 animate-pulse">
        Revealing your card...
      </p>
    </div>
  );
}
