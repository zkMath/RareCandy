"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuybackVault } from "@/hooks/contracts/useBuybackVault";
import { useMarketplace } from "@/hooks/contracts/useMarketplace";
import { Countdown } from "@/components/shared/Countdown";
import { BUYBACK_WINDOW_HOURS } from "@/constants/tiers";
import { trackBuybackExecuted, trackCardListed } from "@/lib/analytics";

interface RevealActionsProps {
  tokenId: bigint;
  fmvUsd: number;
  buybackUsd: number;
  isAbovePullPrice: boolean;
}

export function RevealActions({
  tokenId,
  fmvUsd,
  buybackUsd,
  isAbovePullPrice,
}: RevealActionsProps) {
  const router = useRouter();
  const { executeBuyback, isPending: isExecuting } = useBuybackVault(tokenId);
  const { listCard, isListPending: isListing } = useMarketplace();
  const [showListForm, setShowListForm] = useState(false);
  const [listPrice, setListPrice] = useState(Math.round(fmvUsd).toString());

  const buybackDeadlineTs = Math.floor(Date.now() / 1000) + BUYBACK_WINDOW_HOURS * 3600;

  const handleBuyback = async () => {
    trackBuybackExecuted(tokenId.toString(), buybackUsd);
    await executeBuyback(tokenId);
    router.push("/collection");
  };

  const handleList = async () => {
    const priceNum = parseFloat(listPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;
    trackCardListed(tokenId.toString(), priceNum);
    await listCard(tokenId, BigInt(Math.round(priceNum * 1_000_000))); // USDC 6 decimals
    router.push("/marketplace");
  };

  return (
    <div
      className="rounded-[28px] border border-white/60 backdrop-blur-md p-6 md:p-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      {isAbovePullPrice && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <span className="text-sm font-semibold text-emerald-700">
            Worth more than your pull price!
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buyback */}
        <button
          onClick={handleBuyback}
          disabled={isExecuting}
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-plum-300 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Sell Back</span>
          </div>
          <span className="text-lg font-bold text-plum-600">
            ${buybackUsd.toFixed(2)} USDC
          </span>
          <div className="mt-2">
            <Countdown targetTimestamp={buybackDeadlineTs} />
          </div>
        </button>

        {/* Keep */}
        <button
          onClick={() => router.push("/collection")}
          className="p-4 bg-white rounded-xl border border-gray-200 hover:border-plum-300 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Keep Card</span>
          </div>
          <span className="text-sm text-gray-500">
            Add to your collection. Redeem the physical card later.
          </span>
        </button>

        {/* List */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          {!showListForm ? (
            <button
              onClick={() => setShowListForm(true)}
              className="w-full text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">List on Market</span>
              </div>
              <span className="text-sm text-gray-500">
                Set your price and sell to other collectors.
              </span>
            </button>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-gray-900">List Price</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
                  placeholder="USD"
                  min="1"
                />
                <button
                  onClick={handleList}
                  disabled={isListing}
                  className="px-4 py-2 bg-plum-600 text-white text-sm font-semibold rounded-lg hover:bg-plum-700 transition-colors disabled:opacity-50"
                >
                  {isListing ? "..." : "List"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
