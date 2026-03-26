"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { Tier } from "@/types";

interface ListingData {
  tokenId: number;
  cardName: string;
  tier: Tier;
  currentFmv: number;
  imageUri: string;
}

type SortOption = "newest" | "price_asc" | "price_desc";

export default function MarketplacePage() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<Tier | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tierFilter !== null) params.set("tier", tierFilter.toString());
      if (priceRange[0] !== null) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] !== null) params.set("maxPrice", priceRange[1].toString());
      params.set("sort", sort);

      const res = await fetch(`/api/marketplace/listings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setListings(data.listings || []);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [tierFilter, sort, priceRange]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top right, #ebe4f3 0%, #f0ecf5 35%, #f6f3f0 65%, #faf6f3 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Marketplace
          </h1>
          <p className="mt-2 text-gray-500">
            Buy and sell PSA 10 Pokemon cards from other collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="lg:col-span-1">
            <MarketplaceFilters
              tierFilter={tierFilter}
              onTierChange={setTierFilter}
              sort={sort}
              onSortChange={setSort}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-2xl bg-white/40 animate-pulse border border-gray-200/40"
                  />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-plum-50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-plum-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No listings found</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  {listings.length} listing{listings.length !== 1 ? "s" : ""}
                </p>
                <ListingGrid listings={listings} />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
