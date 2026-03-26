"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PullButton } from "@/components/gacha/PullButton";
import { PullCountSelector } from "@/components/gacha/PullCountSelector";
import { VRFPendingAnimation } from "@/components/gacha/VRFPendingAnimation";
import { PoolDepthBars } from "@/components/gacha/PoolDepthBars";
import { PullInfo } from "@/components/gacha/PullInfo";
import { CooldownModal } from "@/components/gacha/CooldownModal";
import { OddsTable } from "@/components/pool/OddsTable";
import { useGachaMachine } from "@/hooks/contracts/useGachaMachine";
import { useUSDCApproval } from "@/hooks/contracts/useUSDCApproval";
import { useUSDCBalance } from "@/hooks/useUSDCBalance";
import { useAuth } from "@/hooks/useAuth";
import { PullState, Tier } from "@/types";
import { PULL_PRICE_USDC6, PULL_PRICE_USD } from "@/constants/tiers";
import { GACHA_MACHINE_ADDRESS } from "@/constants/addresses";
import { trackPullInitiated } from "@/lib/analytics";

const COOLDOWN_THRESHOLD = 10;

export default function GachaPage() {
  const router = useRouter();
  const { login, authenticated } = usePrivy();
  const { walletAddress } = useAuth();
  const { balance } = useUSDCBalance();
  const {
    pullState,
    setPullState,
    pull,
    tierPoolLengths,
    revealedTokenId,
    error,
    reset,
  } = useGachaMachine();
  const { allowance, approve, isPending: isApproving } = useUSDCApproval(GACHA_MACHINE_ADDRESS);

  const [pullCount, setPullCount] = useState(1);
  const [pullsInSession, setPullsInSession] = useState(0);
  const [showCooldown, setShowCooldown] = useState(false);
  const [showOdds, setShowOdds] = useState(false);

  const requiredAllowance = PULL_PRICE_USDC6 * BigInt(pullCount);
  const hasBalance = balance >= requiredAllowance;
  const needsApproval = allowance < requiredAllowance;

  // Navigate to reveal on success
  useEffect(() => {
    if (pullState === PullState.Revealed && revealedTokenId !== null) {
      router.push(`/reveal/${revealedTokenId.toString()}`);
    }
  }, [pullState, revealedTokenId, router]);

  const handlePull = useCallback(async () => {
    if (!authenticated) {
      login();
      return;
    }

    // Cooldown check
    if (pullsInSession >= COOLDOWN_THRESHOLD && !showCooldown) {
      setShowCooldown(true);
      return;
    }

    // Approval flow
    if (needsApproval) {
      setPullState(PullState.Approving);
      try {
        await approve(requiredAllowance);
      } catch {
        setPullState(PullState.Error);
        return;
      }
    }

    // Pull
    trackPullInitiated(pullCount);
    pull();
    setPullsInSession((n) => n + pullCount);
  }, [
    authenticated,
    login,
    pullsInSession,
    showCooldown,
    needsApproval,
    requiredAllowance,
    approve,
    pull,
    pullCount,
    setPullState,
  ]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
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

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Pull a <span className="text-plum-600">PSA 10</span> Card
          </h1>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Every pull is backed by a real card in the vault. Chainlink VRF ensures fair randomness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main pull area */}
          <div className="md:col-span-2">
            <div
              className="rounded-[28px] border border-white/60 backdrop-blur-md p-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
              }}
            >
              {pullState === PullState.AwaitingVRF ? (
                <VRFPendingAnimation />
              ) : (
                <>
                  {/* Machine visualization */}
                  <div className="flex items-center justify-center py-8">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-plum-400/10 animate-breathe-outer" />
                      <div className="absolute inset-6 rounded-full bg-plum-500/15 animate-breathe-mid" />
                      <div className="absolute inset-12 rounded-full bg-gradient-to-br from-plum-500 to-plum-700 animate-breathe shadow-xl shadow-plum-500/30 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Pull count selector */}
                  <div className="flex items-center justify-center mb-6">
                    <PullCountSelector
                      count={pullCount}
                      onChange={setPullCount}
                      disabled={pullState !== PullState.Idle && pullState !== PullState.Error}
                    />
                  </div>

                  {/* Pull button */}
                  <PullButton
                    pullState={pullState}
                    onPull={handlePull}
                    isApproving={isApproving}
                    hasBalance={hasBalance}
                    isAuthenticated={authenticated}
                    onLogin={login}
                    pullCount={pullCount}
                  />

                  {/* Error display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{error}</p>
                      <button
                        onClick={reset}
                        className="mt-2 text-xs text-red-500 underline hover:text-red-700"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pull info cards */}
            <div className="mt-6">
              <PullInfo />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pool depth */}
            <div
              className="rounded-2xl border border-white/60 backdrop-blur-md p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
              }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Pool Depth</h3>
              <PoolDepthBars tierPoolLengths={tierPoolLengths} />
              <p className="text-xs text-gray-400 mt-3">
                {tierPoolLengths.reduce((s, n) => s + n, 0)} cards in pool
              </p>
            </div>

            {/* Odds disclosure */}
            <button
              onClick={() => setShowOdds(!showOdds)}
              className="w-full text-left rounded-2xl border border-white/60 backdrop-blur-md p-5 hover:bg-white/20 transition-colors"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Full Odds Table</h3>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${showOdds ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showOdds && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
                <OddsTable tierData={[Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary].map((tier, i) => ({
                  tier,
                  cardCount: tierPoolLengths[i],
                  effectiveOdds: tierPoolLengths[i],
                }))} />
              </div>
            )}

            {/* Session counter */}
            {pullsInSession > 0 && (
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 text-center">
                <span className="text-lg font-bold text-gray-900">{pullsInSession}</span>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                  Pulls this session
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Cooldown modal */}
      {showCooldown && (
        <CooldownModal
          pullsInSession={pullsInSession}
          onContinue={() => {
            setShowCooldown(false);
            handlePull();
          }}
          onStop={() => {
            setShowCooldown(false);
          }}
        />
      )}
    </div>
  );
}
