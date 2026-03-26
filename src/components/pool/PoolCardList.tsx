"use client";

import { useReadContracts } from "wagmi";
import { GACHA_CARD_ADDRESS, GACHA_CARD_ABI } from "@/constants";
import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";
import { TierBadge } from "@/components/cards/TierBadge";

interface PoolCardListProps {
  tier: Tier;
  tokenIds: bigint[];
}

export function PoolCardList({ tier, tokenIds }: PoolCardListProps) {
  const config = TIER_CONFIG[tier];

  // Batch read card data for all token IDs
  const contracts = tokenIds.map((tokenId) => ({
    address: GACHA_CARD_ADDRESS,
    abi: GACHA_CARD_ABI,
    functionName: "cards" as const,
    args: [tokenId] as const,
  }));

  const { data: results, isLoading } = useReadContracts({
    contracts,
    query: { enabled: tokenIds.length > 0 },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white/40 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = tokenIds.map((tokenId, i) => {
    const result = results?.[i];
    if (result?.status === "success") {
      const data = result.result as [string, string, number, bigint, bigint, boolean];
      return {
        tokenId,
        psaCert: data[0],
        cardName: data[1],
        fmvAtMint: Number(data[3]) / 100,
      };
    }
    return { tokenId, psaCert: "", cardName: `Token #${tokenId}`, fmvAtMint: 0 };
  });

  return (
    <div
      className="rounded-2xl border border-white/60 backdrop-blur-md overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} />
          <span className="text-sm text-gray-500">
            {cards.length} card{cards.length !== 1 ? "s" : ""}
          </span>
        </div>
        <a
          href={`https://basescan.org/address/${GACHA_CARD_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-plum-600 hover:text-plum-700 font-medium"
        >
          Verify on Basescan
        </a>
      </div>

      <div className="divide-y divide-gray-100">
        {cards.map((card) => (
          <div key={card.tokenId.toString()} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${config.color}15`, color: config.color }}
              >
                #{card.tokenId.toString()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{card.cardName}</p>
                {card.psaCert && (
                  <p className="text-xs text-gray-400">PSA {card.psaCert}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              ${card.fmvAtMint.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
