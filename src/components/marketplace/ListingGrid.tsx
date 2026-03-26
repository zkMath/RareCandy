"use client";

import { Tier } from "@/types";
import { ListingCard } from "./ListingCard";

interface ListingData {
  tokenId: number;
  cardName: string;
  tier: Tier;
  currentFmv: number;
  imageUri: string;
}

interface ListingGridProps {
  listings: ListingData[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.tokenId} listing={listing} />
      ))}
    </div>
  );
}
