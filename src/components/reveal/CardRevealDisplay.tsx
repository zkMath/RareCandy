"use client";

import { TierBadge } from "@/components/cards/TierBadge";
import { Tier } from "@/types";
import type { TierConfig } from "@/constants/tiers";

interface CardRevealDisplayProps {
  tokenId: string;
  cardName: string;
  tier: Tier;
  tierConfig: TierConfig;
  fmvUsd: number;
  tokenURI: string | undefined;
}

export function CardRevealDisplay({
  tokenId,
  cardName,
  tier,
  tierConfig,
  fmvUsd,
  tokenURI,
}: CardRevealDisplayProps) {
  return (
    <div className="text-center">
      {/* Card image with tier glow */}
      <div className="relative inline-block mb-6">
        <div
          className="absolute -inset-4 rounded-3xl blur-xl opacity-60"
          style={{ backgroundColor: tierConfig.color }}
        />
        <div
          className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 shadow-2xl flex items-center justify-center bg-gray-100"
          style={{ borderColor: tierConfig.color }}
        >
          {tokenURI ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
              alt={cardName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${tierConfig.color}20` }}
              >
                <span className="text-2xl font-bold" style={{ color: tierConfig.color }}>
                  #{tokenId}
                </span>
              </div>
              <p className="text-sm text-gray-500">Loading image...</p>
            </div>
          )}
        </div>
      </div>

      {/* Card info */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{cardName}</h2>
      <div className="flex items-center justify-center gap-3 mb-4">
        <TierBadge tier={tier} />
        <span className="text-sm text-gray-500">Token #{tokenId}</span>
      </div>

      <div className="inline-flex items-center gap-2 bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
        <span className="text-sm text-gray-500">Fair Market Value</span>
        <span className="text-lg font-bold text-gray-900">${fmvUsd.toFixed(2)}</span>
      </div>
    </div>
  );
}
