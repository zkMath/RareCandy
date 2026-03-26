"use client";

import { useAuth } from "@/hooks/useAuth";

export function AdminTopBar() {
  const { walletAddress } = useAuth();
  const short = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "";

  return (
    <div
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 lg:px-8 border-b border-gray-200/40"
      style={{
        backgroundColor: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <h2 className="text-sm font-semibold text-gray-900">Admin Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 font-mono">{short}</span>
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
