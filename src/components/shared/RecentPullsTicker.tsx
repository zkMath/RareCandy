"use client";

import { useEffect, useState } from "react";
import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

interface TickerPull {
  cardName: string;
  tier: Tier;
  pulledAt: string;
  address: string;
}

export function RecentPullsTicker() {
  const [pulls, setPulls] = useState<TickerPull[]>([]);

  useEffect(() => {
    async function fetchPulls() {
      try {
        const res = await fetch("/api/pulls/recent");
        if (res.ok) {
          const data = await res.json();
          setPulls(data.pulls || []);
        }
      } catch {
        // Silently fail — ticker is non-critical
      }
    }
    fetchPulls();
    const interval = setInterval(fetchPulls, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (pulls.length === 0) return null;

  const doubled = [...pulls, ...pulls];

  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-12 animate-scroll-left w-max">
        {doubled.map((pull, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0 px-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: TIER_CONFIG[pull.tier]?.color || "#8b5cf6" }}
            />
            <span className="text-sm font-medium text-gray-700">{pull.cardName}</span>
            <span className="text-xs text-gray-400">{pull.address}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
