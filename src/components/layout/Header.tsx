"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import { ConnectButton } from "@/components/auth/ConnectButton";
import { WalletInfo } from "@/components/auth/WalletInfo";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { balance } = useUSDCBalance();

  return (
    <nav className="relative z-10 max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-plum-500 to-plum-700 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-sm">RC</span>
        </div>
        <span className="text-lg font-semibold text-gray-900 hidden sm:inline">RareCandy</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/gacha" className="hover:text-plum-700 transition-colors">
          Pull
        </Link>
        <Link href="/marketplace" className="hover:text-plum-700 transition-colors">
          Marketplace
        </Link>
        <Link href="/pool" className="hover:text-plum-700 transition-colors">
          Pool
        </Link>
        {isAuthenticated && (
          <Link href="/collection" className="hover:text-plum-700 transition-colors">
            Collection
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <WalletInfo balance={balance} />
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
}
