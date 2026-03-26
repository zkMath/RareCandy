"use client";

import { useState } from "react";
import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";

interface CardImageProps {
  imageUri?: string;
  cardName: string;
  tier: Tier;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-32 h-44",
  md: "w-48 h-64",
  lg: "w-64 h-88",
};

export function CardImage({ imageUri, cardName, tier, className = "", size = "md" }: CardImageProps) {
  const [loaded, setLoaded] = useState(false);
  const config = TIER_CONFIG[tier];
  const gateway = imageUri?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${sizeMap[size]} ${className}`}
      style={{ boxShadow: `0 4px 20px ${config.color}30` }}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
      )}
      {gateway ? (
        <img
          src={gateway}
          alt={cardName}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs text-center px-2">{cardName}</span>
        </div>
      )}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: `2px solid ${config.color}40` }}
      />
    </div>
  );
}
