"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBuybackVault } from "@/hooks/contracts/useBuybackVault";
import { useMarketplace } from "@/hooks/contracts/useMarketplace";
import { Countdown } from "@/components/shared/Countdown";
import Link from "next/link";

interface CardActionsProps {
  tokenId: bigint;
  fmvUsd: number;
  buybackEligible: boolean;
  buybackUsd: number;
  buybackExpiresAt: number;
  redeemed: boolean;
}

export function CardActions({
  tokenId,
  fmvUsd,
  buybackEligible,
  buybackUsd,
  buybackExpiresAt,
  redeemed,
}: CardActionsProps) {
  const router = useRouter();
  const { executeBuyback, isPending: isBuybackPending } = useBuybackVault(tokenId);
  const { listCard, isListPending } = useMarketplace();
  const [showListForm, setShowListForm] = useState(false);
  const [listPrice, setListPrice] = useState(Math.round(fmvUsd).toString());

  const handleBuyback = () => {
    executeBuyback(tokenId);
  };

  const handleList = () => {
    const priceNum = parseFloat(listPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;
    listCard(tokenId, BigInt(Math.round(priceNum * 1_000_000)));
  };

  return (
    <div className="space-y-4">
      {/* Buyback */}
      {buybackEligible && !redeemed && (
        <div
          className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">Buyback Available</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mb-2">
            ${buybackUsd.toFixed(2)} USDC
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Expires in</span>
            <Countdown targetTimestamp={buybackExpiresAt} className="text-amber-600 font-medium" />
          </div>
          <button
            onClick={handleBuyback}
            disabled={isBuybackPending}
            className="w-full px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isBuybackPending ? "Processing..." : "Sell Back"}
          </button>
        </div>
      )}

      {/* List on marketplace */}
      {!redeemed && (
        <div
          className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">List on Marketplace</h3>
          </div>

          {!showListForm ? (
            <button
              onClick={() => setShowListForm(true)}
              className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-plum-300 hover:shadow-md transition-all"
            >
              Set Price & List
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
                  placeholder="Price in USD"
                  min="1"
                />
                <button
                  onClick={handleList}
                  disabled={isListPending}
                  className="px-6 py-2 bg-plum-600 text-white text-sm font-semibold rounded-lg hover:bg-plum-700 transition-colors disabled:opacity-50"
                >
                  {isListPending ? "..." : "List"}
                </button>
              </div>
              <button
                onClick={() => setShowListForm(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Redeem physical card */}
      {!redeemed && (
        <div
          className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-plum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-900">Redeem Physical Card</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Get the real PSA 10 card shipped to you. $20 USDC redemption fee.
          </p>
          <Link
            href={`/redeem?tokenId=${tokenId.toString()}`}
            className="block w-full px-4 py-3 bg-plum-600 text-white text-center font-semibold rounded-xl hover:bg-plum-700 transition-colors"
          >
            Redeem Card
          </Link>
        </div>
      )}

      {redeemed && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-semibold text-emerald-700">This card has been redeemed</p>
          <p className="text-xs text-emerald-600 mt-1">The physical card has been shipped.</p>
        </div>
      )}
    </div>
  );
}
