"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CardDetailView } from "@/components/card-detail/CardDetailView";
import { CardActions } from "@/components/card-detail/CardActions";
import { useGachaCard } from "@/hooks/contracts/useGachaCard";
import { useBuybackVault } from "@/hooks/contracts/useBuybackVault";
import { TIER_CONFIG, BUYBACK_BPS } from "@/constants/tiers";
import { Tier } from "@/types";

export default function CardDetailPage({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = use(params);
  const tokenIdNum = BigInt(tokenId);

  const { card, tokenURI, owner } = useGachaCard(tokenIdNum);
  const { eligible, buybackAmount, expiresAt } = useBuybackVault(tokenIdNum);

  const tier = (card?.tier ?? Tier.Base) as Tier;
  const tierConfig = TIER_CONFIG[tier];
  const fmvUsd = card ? Number(card.fmvAtMint) / 100 : 0;
  const buybackUsd = Number(buybackAmount) / 1_000_000;
  const expiresAtTs = Number(expiresAt);

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

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link
            href="/collection"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-plum-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collection
          </Link>
        </div>

        {card ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CardDetailView
              tokenId={tokenId}
              cardName={card.cardName}
              psaCert={card.psaCert}
              tier={tier}
              tierConfig={tierConfig}
              fmvUsd={fmvUsd}
              tokenURI={tokenURI}
              owner={owner}
              redeemed={card.redeemed}
              mintedAt={Number(card.mintedAt)}
            />

            <CardActions
              tokenId={tokenIdNum}
              fmvUsd={fmvUsd}
              buybackEligible={eligible}
              buybackUsd={buybackUsd}
              buybackExpiresAt={expiresAtTs}
              redeemed={card.redeemed}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full bg-plum-100 animate-pulse" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
