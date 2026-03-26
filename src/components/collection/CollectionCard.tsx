"use client";

import { CollectionItem } from "@/types/api";
import { CardImage } from "@/components/cards/CardImage";
import { TierBadge } from "@/components/cards/TierBadge";
import { BuybackEligibilityBadge } from "./BuybackEligibilityBadge";
import { RedemptionStatusBadge } from "./RedemptionStatusBadge";
import { Tier } from "@/types";

interface CollectionCardProps {
  item: CollectionItem;
  onClick: () => void;
}

export function CollectionCard({ item, onClick }: CollectionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-lg hover:border-plum-200 transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <CardImage
          imageUri={item.imageUri}
          cardName={item.cardName}
          tier={item.tier as Tier}
          size="sm"
          className="!w-full !h-full !rounded-none"
        />
        {item.buybackEligible && (
          <div className="absolute top-2 right-2">
            <BuybackEligibilityBadge />
          </div>
        )}
        {item.redemptionStatus && (
          <div className="absolute top-2 left-2">
            <RedemptionStatusBadge status={item.redemptionStatus} />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-plum-600 transition-colors">
          {item.cardName}
        </p>
        <div className="flex items-center justify-between mt-1.5">
          <TierBadge tier={item.tier as Tier} />
          <span className="text-xs font-medium text-gray-500">
            ${item.currentFmv.toFixed(0)}
          </span>
        </div>
      </div>
    </button>
  );
}
