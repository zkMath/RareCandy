"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PoolTierBreakdown } from "@/components/pool/PoolTierBreakdown";
import { PoolCardList } from "@/components/pool/PoolCardList";
import { PoolVerification } from "@/components/pool/PoolVerification";
import { usePoolExplorer } from "@/hooks/usePoolExplorer";
import { Tier } from "@/types";
import { useState } from "react";

export default function PoolPage() {
  const { tierData, loading } = usePoolExplorer();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  const totalCards = tierData.reduce((sum, t) => sum + t.tokenIds.length, 0);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top right, #ebe4f3 0%, #f0ecf5 35%, #f6f3f0 65%, #faf6f3 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pool Explorer
          </h1>
          <p className="mt-2 text-gray-500">
            All data read directly from on-chain smart contracts. Independently verifiable on Basescan.
          </p>
        </div>

        <PoolVerification />

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Summary stat */}
            <div className="mt-6 mb-8">
              <div className="inline-flex items-center gap-2 bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
                <span className="text-sm text-gray-500">Total Cards in Pool</span>
                <span className="text-lg font-bold text-gray-900">{totalCards}</span>
              </div>
            </div>

            {/* Tier breakdown */}
            <PoolTierBreakdown
              tierData={tierData}
              totalCards={totalCards}
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
            />

            {/* Card list for selected tier */}
            {selectedTier !== null && (
              <div className="mt-8">
                <PoolCardList
                  tier={selectedTier}
                  tokenIds={tierData.find((t) => t.tier === selectedTier)?.tokenIds ?? []}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
