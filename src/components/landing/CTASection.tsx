"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export function CTASection() {
  const { login, authenticated } = usePrivy();

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-br from-plum-600 to-plum-800 rounded-[28px] p-10 md:p-16 text-center relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-6 right-12 w-24 h-24 rounded-full bg-plum-500/30 blur-xl" />
        <div className="absolute bottom-8 left-16 w-32 h-32 rounded-full bg-plum-400/20 blur-xl" />

        <h2 className="relative text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          Ready to pull your first card?
        </h2>
        <p className="relative text-plum-200 max-w-lg mx-auto mb-8">
          60 unique PSA 10 Pokemon cards in the pool. Umbreon VMAX Alt Art,
          Charizard VSTAR, and more. Every pull could be legendary.
        </p>

        <div className="relative flex items-center justify-center gap-4">
          {authenticated ? (
            <Link
              href="/gacha"
              className="px-8 py-3.5 bg-white text-plum-700 text-sm font-semibold rounded-xl hover:bg-plum-50 transition-colors shadow-lg"
            >
              Start Pulling
            </Link>
          ) : (
            <button
              onClick={login}
              className="px-8 py-3.5 bg-white text-plum-700 text-sm font-semibold rounded-xl hover:bg-plum-50 transition-colors shadow-lg"
            >
              Connect Wallet
            </button>
          )}
          <Link
            href="/pool"
            className="px-8 py-3.5 bg-transparent text-white text-sm font-semibold rounded-xl border-2 border-white/30 hover:border-white/60 transition-all"
          >
            View Pool
          </Link>
        </div>
      </div>
    </section>
  );
}
