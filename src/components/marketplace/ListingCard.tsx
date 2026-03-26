"use client";

import Link from "next/link";
import { Tier } from "@/types";
import { CardImage } from "@/components/cards/CardImage";
import { TierBadge } from "@/components/cards/TierBadge";

interface ListingData {
  tokenId: number;
  cardName: string;
  tier: Tier;
  currentFmv: number;
  imageUri: string;
}

interface ListingCardProps {
  listing: ListingData;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/card/${listing.tokenId}`}
      className="group bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-lg hover:border-plum-200 transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <CardImage
          imageUri={listing.imageUri}
          cardName={listing.cardName}
          tier={listing.tier as Tier}
          size="sm"
          className="!w-full !h-full !rounded-none"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-plum-600 transition-colors">
          {listing.cardName}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <TierBadge tier={listing.tier as Tier} />
          <span className="text-sm font-bold text-plum-600">
            ${listing.currentFmv.toFixed(0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
