"use client";

import { CollectionItem } from "@/types/api";
import { CollectionCard } from "./CollectionCard";

interface CollectionGridProps {
  items: CollectionItem[];
  onCardClick: (tokenId: number) => void;
}

export function CollectionGrid({ items, onCardClick }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <CollectionCard
          key={item.tokenId}
          item={item}
          onClick={() => onCardClick(item.tokenId)}
        />
      ))}
    </div>
  );
}
