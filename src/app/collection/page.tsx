"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CollectionGrid } from "@/components/collection/CollectionGrid";
import { EmptyCollection } from "@/components/collection/EmptyCollection";
import { useAuth } from "@/hooks/useAuth";
import { CollectionItem } from "@/types/api";

type FilterTab = "all" | "buyback" | "collection" | "redemption";

export default function CollectionPage() {
  const router = useRouter();
  const { walletAddress, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    if (!isAuthenticated || !walletAddress) {
      setLoading(false);
      return;
    }

    async function fetchCollection() {
      try {
        const res = await fetch(`/api/user/${walletAddress}/collection`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setItems(data.nfts || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [walletAddress, isAuthenticated]);

  const filtered = items.filter((item) => {
    if (activeTab === "buyback") return item.buybackEligible;
    if (activeTab === "collection") return !item.buybackEligible && !item.redemptionStatus;
    if (activeTab === "redemption") return !!item.redemptionStatus;
    return true;
  });

  const buybackCount = items.filter((i) => i.buybackEligible).length;
  const redemptionCount = items.filter((i) => !!i.redemptionStatus).length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All Cards", count: items.length },
    { key: "buyback", label: "Buyback Available", count: buybackCount },
    { key: "collection", label: "In Collection" },
    { key: "redemption", label: "Pending Redemption", count: redemptionCount },
  ];

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
            My Collection
          </h1>
          <p className="mt-2 text-gray-500">
            {items.length} card{items.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-plum-600 text-white shadow-lg shadow-plum-300/30"
                  : "bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200/60"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-md text-xs ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-white/40 animate-pulse border border-gray-200/40"
              />
            ))}
          </div>
        ) : !isAuthenticated ? (
          <EmptyCollection message="Connect your wallet to view your collection" />
        ) : filtered.length === 0 ? (
          <EmptyCollection
            message={
              activeTab === "all"
                ? "No cards yet. Pull your first card!"
                : `No cards in this category`
            }
            showPullButton={activeTab === "all" && items.length === 0}
          />
        ) : (
          <CollectionGrid
            items={filtered}
            onCardClick={(tokenId) => router.push(`/card/${tokenId}`)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
