"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Wallet, ChevronDown } from "lucide-react";

interface WalletInfoProps {
  balance: number;
}

export function WalletInfo({ balance }: WalletInfoProps) {
  const { walletAddress, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!walletAddress) return null;

  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/50 backdrop-blur-md text-sm font-medium text-gray-700 hover:bg-plum-50 transition-colors"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.55) 100%)",
        }}
      >
        <Wallet className="w-4 h-4 text-plum-500" />
        <span>${balance.toFixed(2)}</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-500">{shortAddress}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/60 backdrop-blur-md shadow-lg z-50 p-2"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 100%)",
            }}
          >
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-sm font-semibold text-gray-900">${balance.toFixed(2)} USDC</p>
            </div>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-plum-600 hover:bg-plum-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
