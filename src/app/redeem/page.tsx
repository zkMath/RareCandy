"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RedeemableCards } from "@/components/redeem/RedeemableCards";
import { ShippingForm } from "@/components/redeem/ShippingForm";
import { RedemptionFeePayment } from "@/components/redeem/RedemptionFeePayment";
import { RedemptionConfirmation } from "@/components/redeem/RedemptionConfirmation";
import { useAuth } from "@/hooks/useAuth";
import { useGachaCard } from "@/hooks/contracts/useGachaCard";
import { Tier } from "@/types";
import { TIER_CONFIG, REDEMPTION_FEE_USD } from "@/constants/tiers";

type Step = "select" | "shipping" | "payment" | "confirmation";

interface ShippingData {
  shippingName: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
}

export default function RedeemPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { walletAddress, isAuthenticated } = useAuth();
  const preselectedTokenId = searchParams.get("tokenId");

  const [step, setStep] = useState<Step>(preselectedTokenId ? "shipping" : "select");
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(preselectedTokenId);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [feeTxHash, setFeeTxHash] = useState<string | null>(null);

  const tokenIdNum = selectedTokenId ? BigInt(selectedTokenId) : undefined;
  const { card } = useGachaCard(tokenIdNum);
  const tier = (card?.tier ?? Tier.Base) as Tier;
  const tierConfig = TIER_CONFIG[tier];

  const handleCardSelect = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setStep("shipping");
  };

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setStep("payment");
  };

  const handlePaymentComplete = async (txHash: string) => {
    setFeeTxHash(txHash);

    if (!shippingData || !selectedTokenId) return;

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: parseInt(selectedTokenId),
          ...shippingData,
          feeTxHash: txHash,
        }),
      });

      if (!res.ok) {
        throw new Error("Redemption failed");
      }

      setStep("confirmation");
    } catch {
      // Payment went through but API failed — still show confirmation
      // Admin can match via feeTxHash
      setStep("confirmation");
    }
  };

  if (!isAuthenticated) {
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
        </div>
        <Header />
        <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-gray-500">Connect your wallet to redeem cards.</p>
        </main>
        <Footer />
      </div>
    );
  }

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

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Redeem Physical Card
          </h1>
          <p className="mt-2 text-gray-500">
            Get the real PSA 10 card shipped to you. ${REDEMPTION_FEE_USD} USDC redemption fee.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {(["select", "shipping", "payment", "confirmation"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? "bg-plum-600 text-white"
                    : i < ["select", "shipping", "payment", "confirmation"].indexOf(step)
                    ? "bg-plum-100 text-plum-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        {step === "select" && (
          <RedeemableCards
            walletAddress={walletAddress!}
            onSelect={handleCardSelect}
          />
        )}

        {step === "shipping" && selectedTokenId && (
          <ShippingForm
            cardName={card?.cardName ?? "Loading..."}
            onSubmit={handleShippingSubmit}
            onBack={() => setStep("select")}
          />
        )}

        {step === "payment" && (
          <RedemptionFeePayment
            feeUsd={REDEMPTION_FEE_USD}
            onPaymentComplete={handlePaymentComplete}
            onBack={() => setStep("shipping")}
          />
        )}

        {step === "confirmation" && (
          <RedemptionConfirmation
            cardName={card?.cardName ?? ""}
            feeTxHash={feeTxHash}
            onViewCollection={() => router.push("/collection")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
