"use client";

import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";

type SortOption = "newest" | "price_asc" | "price_desc";

interface MarketplaceFiltersProps {
  tierFilter: Tier | null;
  onTierChange: (tier: Tier | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  priceRange: [number | null, number | null];
  onPriceRangeChange: (range: [number | null, number | null]) => void;
}

const tiers = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

export function MarketplaceFilters({
  tierFilter,
  onTierChange,
  sort,
  onSortChange,
  priceRange,
  onPriceRangeChange,
}: MarketplaceFiltersProps) {
  return (
    <div
      className="rounded-2xl border border-white/60 backdrop-blur-md p-5 space-y-6 sticky top-24"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      {/* Sort */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Sort By
        </h3>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Tier filter */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Tier
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onTierChange(null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              tierFilter === null
                ? "bg-plum-50 text-plum-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Tiers
          </button>
          {tiers.map((tier) => {
            const config = TIER_CONFIG[tier];
            return (
              <button
                key={tier}
                onClick={() => onTierChange(tier)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                  tierFilter === tier
                    ? "bg-plum-50 text-plum-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {config.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0] ?? ""}
            onChange={(e) =>
              onPriceRangeChange([
                e.target.value ? parseInt(e.target.value) : null,
                priceRange[1],
              ])
            }
            className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1] ?? ""}
            onChange={(e) =>
              onPriceRangeChange([
                priceRange[0],
                e.target.value ? parseInt(e.target.value) : null,
              ])
            }
            className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
          />
        </div>
      </div>

      {/* Clear filters */}
      {(tierFilter !== null || priceRange[0] !== null || priceRange[1] !== null) && (
        <button
          onClick={() => {
            onTierChange(null);
            onPriceRangeChange([null, null]);
          }}
          className="w-full text-sm text-plum-600 hover:text-plum-700 font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
