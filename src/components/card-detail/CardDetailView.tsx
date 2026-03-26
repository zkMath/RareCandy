"use client";

import { TierBadge } from "@/components/cards/TierBadge";
import { Tier } from "@/types";
import type { TierConfig } from "@/constants/tiers";

interface CardDetailViewProps {
  tokenId: string;
  cardName: string;
  psaCert: string;
  tier: Tier;
  tierConfig: TierConfig;
  fmvUsd: number;
  tokenURI: string | undefined;
  owner: `0x${string}` | undefined;
  redeemed: boolean;
  mintedAt: number;
}

export function CardDetailView({
  tokenId,
  cardName,
  psaCert,
  tier,
  tierConfig,
  fmvUsd,
  tokenURI,
  owner,
  redeemed,
  mintedAt,
}: CardDetailViewProps) {
  const gateway = tokenURI?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  const mintDate = mintedAt > 0 ? new Date(mintedAt * 1000).toLocaleDateString() : "—";
  const shortOwner = owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : "—";

  return (
    <div>
      {/* Card image with tier glow */}
      <div className="relative mb-6">
        <div
          className="absolute -inset-3 rounded-3xl blur-xl opacity-40"
          style={{ backgroundColor: tierConfig.color }}
        />
        <div
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 shadow-2xl bg-gray-100"
          style={{ borderColor: tierConfig.color }}
        >
          {gateway ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gateway}
              alt={cardName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-4">
                <span
                  className="text-4xl font-bold"
                  style={{ color: tierConfig.color }}
                >
                  #{tokenId}
                </span>
                <p className="text-sm text-gray-500 mt-2">Loading image...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card info */}
      <h1 className="text-2xl font-bold text-gray-900 mb-3">{cardName}</h1>

      <div className="flex items-center gap-3 mb-6">
        <TierBadge tier={tier} />
        <span className="text-sm text-gray-500">Token #{tokenId}</span>
        {redeemed && (
          <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">
            Redeemed
          </span>
        )}
      </div>

      {/* Details table */}
      <div
        className="rounded-2xl border border-white/60 backdrop-blur-md overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <div className="divide-y divide-gray-100">
          <DetailRow label="Fair Market Value" value={`$${fmvUsd.toFixed(2)}`} />
          <DetailRow label="PSA Certificate" value={psaCert || "—"} />
          <DetailRow label="Owner" value={shortOwner} />
          <DetailRow label="Minted" value={mintDate} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
