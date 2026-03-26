"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

export function Hero() {
  const { login, authenticated } = usePrivy();

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
        Own real <span className="text-plum-600">PSA 10</span> Pokemon cards
      </h1>
      <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
        Onchain gacha meets real collectibles. Every NFT is backed 1:1 by a physical
        PSA 10 graded Pokemon card vaulted in the USA. Pull, collect, trade, or
        redeem the real thing.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        {authenticated ? (
          <Link
            href="/gacha"
            className="px-8 py-3.5 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
          >
            Start Pulling
          </Link>
        ) : (
          <button
            onClick={login}
            className="px-8 py-3.5 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
          >
            Get Started
          </button>
        )}
        <Link
          href="/pool"
          className="px-8 py-3.5 bg-white text-gray-800 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:border-plum-300 hover:text-plum-700 transition-all shadow-sm"
        >
          Explore Pool
        </Link>
      </div>

      {/* Breathing orb */}
      <div className="mt-16 mb-1 flex items-center justify-center">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-plum-400/20 animate-breathe-outer" />
          <div className="absolute inset-4 rounded-full bg-plum-500/30 animate-breathe-mid" />
          <div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-plum-500 to-plum-700 animate-breathe shadow-lg shadow-plum-500/40 overflow-hidden"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3) 0%, transparent 50%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-orb-swirl"
              style={{
                background:
                  "radial-gradient(circle at 60% 60%, rgba(139,92,246,0.8) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(109,40,217,0.6) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(196,181,253,0.4) 0%, transparent 45%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll ticker */}
      <div className="overflow-hidden mt-12">
        <div className="flex items-center gap-16 animate-scroll-left w-max">
          {Array(2)
            .fill([
              "Charizard",
              "Pikachu",
              "Umbreon",
              "Mewtwo",
              "Eevee",
              "Gengar",
              "Rayquaza",
              "Giratina",
              "Lugia",
              "Mew",
            ])
            .flat()
            .map((name, i) => (
              <span
                key={i}
                className="text-sm font-semibold text-gray-500 flex-shrink-0 px-4"
              >
                {name}
              </span>
            ))}
        </div>
      </div>

      {/* Scroll chevron */}
      <a
        href="#how-it-works"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("how-it-works")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-[3.25rem] flex justify-center animate-bounce"
      >
        <svg
          className="w-8 h-8 text-plum-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </a>
    </section>
  );
}
