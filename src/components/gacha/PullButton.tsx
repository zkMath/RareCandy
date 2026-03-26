"use client";

import { PullState } from "@/types";

interface PullButtonProps {
  pullState: PullState;
  onPull: () => void;
  isApproving: boolean;
  hasBalance: boolean;
  isAuthenticated: boolean;
  onLogin: () => void;
  pullCount: number;
}

export function PullButton({
  pullState,
  onPull,
  isApproving,
  hasBalance,
  isAuthenticated,
  onLogin,
  pullCount,
}: PullButtonProps) {
  if (!isAuthenticated) {
    return (
      <button
        onClick={onLogin}
        className="w-full px-8 py-4 bg-plum-600 text-white text-base font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
      >
        Connect Wallet to Pull
      </button>
    );
  }

  if (!hasBalance) {
    return (
      <button
        disabled
        className="w-full px-8 py-4 bg-gray-300 text-gray-500 text-base font-semibold rounded-xl cursor-not-allowed"
      >
        Insufficient USDC Balance
      </button>
    );
  }

  const stateConfig: Record<PullState, { label: string; disabled: boolean; animate: boolean }> = {
    [PullState.Idle]: {
      label: `Pull ${pullCount}x for $${pullCount * 100} USDC`,
      disabled: false,
      animate: false,
    },
    [PullState.CheckingBalance]: {
      label: "Checking balance...",
      disabled: true,
      animate: true,
    },
    [PullState.Approving]: {
      label: "Approving USDC...",
      disabled: true,
      animate: true,
    },
    [PullState.Pulling]: {
      label: "Sending Pull Transaction...",
      disabled: true,
      animate: true,
    },
    [PullState.AwaitingVRF]: {
      label: "Waiting for VRF...",
      disabled: true,
      animate: true,
    },
    [PullState.Revealed]: {
      label: "Revealed!",
      disabled: true,
      animate: false,
    },
    [PullState.Error]: {
      label: "Retry Pull",
      disabled: false,
      animate: false,
    },
  };

  const config = stateConfig[pullState];

  return (
    <button
      onClick={onPull}
      disabled={config.disabled || isApproving}
      className={`w-full px-8 py-4 text-base font-semibold rounded-xl transition-all shadow-lg ${
        config.disabled
          ? "bg-plum-400 text-white/80 cursor-wait"
          : pullState === PullState.Error
          ? "bg-red-500 text-white hover:bg-red-600 shadow-red-300/30"
          : "bg-plum-600 text-white hover:bg-plum-700 shadow-plum-300/30"
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {config.animate && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {config.label}
      </span>
    </button>
  );
}
