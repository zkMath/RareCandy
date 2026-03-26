"use client";

interface PullCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
  disabled: boolean;
}

const COUNTS = [1, 2, 3, 5];

export function PullCountSelector({ count, onChange, disabled }: PullCountSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {COUNTS.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            count === n
              ? "bg-plum-600 text-white shadow-md shadow-plum-300/30"
              : "bg-white text-gray-600 border border-gray-200 hover:border-plum-300 hover:text-plum-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {n}x
        </button>
      ))}
    </div>
  );
}
