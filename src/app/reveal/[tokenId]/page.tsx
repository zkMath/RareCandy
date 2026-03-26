"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealAnimation } from "@/components/reveal/RevealAnimation";
import { CardRevealDisplay } from "@/components/reveal/CardRevealDisplay";
import { RevealActions } from "@/components/reveal/RevealActions";
import { useGachaCard } from "@/hooks/contracts/useGachaCard";
import { TIER_CONFIG, BUYBACK_BPS } from "@/constants/tiers";
import { Tier } from "@/types";

export default function RevealPage({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = use(params);
  const tokenIdNum = BigInt(tokenId);
  const [revealed, setRevealed] = useState(false);

  const { card, tokenURI } = useGachaCard(tokenIdNum);

  const fmvUsd = card ? Number(card.fmvAtMint) / 100 : 0;
  const buybackUsd = fmvUsd * (BUYBACK_BPS / 10000);
  const tier = (card?.tier ?? Tier.Base) as Tier;
  const tierConfig = TIER_CONFIG[tier];

  // Auto-reveal after mount delay
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
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

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {!revealed ? (
          <RevealAnimation tierColor={tierConfig.color} />
        ) : (
          <div className="space-y-8">
            <CardRevealDisplay
              tokenId={tokenId}
              cardName={card?.cardName ?? "Loading..."}
              tier={tier}
              tierConfig={tierConfig}
              fmvUsd={fmvUsd}
              tokenURI={tokenURI}
            />

            <RevealActions
              tokenId={tokenIdNum}
              fmvUsd={fmvUsd}
              buybackUsd={buybackUsd}
              isAbovePullPrice={fmvUsd > 100}
            />

            <div className="text-center">
              <Link
                href="/gacha"
                className="text-sm text-plum-600 hover:text-plum-700 font-medium"
              >
                Pull again
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
