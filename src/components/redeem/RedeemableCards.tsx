"use client";

import { useState, useEffect } from "react";
import { CollectionItem } from "@/types/api";
import { CardImage } from "@/components/cards/CardImage";
import { TierBadge } from "@/components/cards/TierBadge";
import { Tier } from "@/types";

interface RedeemableCardsProps {
  walletAddress: string;
  onSelect: (tokenId: string) => void;
}

export function RedeemableCards({ walletAddress, onSelect }: RedeemableCardsProps) {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/user/${walletAddress}/collection`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        // Only show cards that aren't already in redemption
        setItems((data.nfts || []).filter((n: CollectionItem) => !n.redemptionStatus));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-white/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No cards available for redemption.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Select a card to redeem:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.tokenId}
            onClick={() => onSelect(item.tokenId.toString())}
            className="group text-left bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-lg hover:border-plum-200 transition-all"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <CardImage
                imageUri={item.imageUri}
                cardName={item.cardName}
                tier={item.tier as Tier}
                size="sm"
                className="!w-full !h-full !rounded-none"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-plum-600">
                {item.cardName}
              </p>
              <TierBadge tier={item.tier as Tier} className="mt-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
