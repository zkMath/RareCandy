"use client";

import { useReadContracts } from "wagmi";
import { GACHA_MACHINE_ADDRESS, GACHA_MACHINE_ABI } from "@/constants";
import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";
import { useMemo } from "react";

const TIERS = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

interface PoolTierInfo {
  tier: Tier;
  tokenIds: bigint[];
  odds: number;
}

export function usePoolExplorer() {
  // Step 1: Read pool lengths for all 5 tiers
  const lengthContracts = TIERS.map((tier) => ({
    address: GACHA_MACHINE_ADDRESS,
    abi: GACHA_MACHINE_ABI,
    functionName: "getTierPoolLength" as const,
    args: [tier] as const,
  }));

  const { data: lengthResults, isLoading: lengthsLoading } = useReadContracts({
    contracts: lengthContracts,
  });

  const tierLengths = TIERS.map((_, i) => {
    const result = lengthResults?.[i];
    return result?.status === "success" ? Number(result.result as bigint) : 0;
  });

  // Step 2: Build batch calls for all token IDs across all tiers
  const tokenIdContracts = useMemo(() => {
    const calls: { address: typeof GACHA_MACHINE_ADDRESS; abi: typeof GACHA_MACHINE_ABI; functionName: "getTierPoolTokenId"; args: readonly [number, bigint] }[] = [];
    TIERS.forEach((tier, tierIdx) => {
      const len = tierLengths[tierIdx];
      for (let i = 0; i < len; i++) {
        calls.push({
          address: GACHA_MACHINE_ADDRESS,
          abi: GACHA_MACHINE_ABI,
          functionName: "getTierPoolTokenId",
          args: [tier, BigInt(i)] as const,
        });
      }
    });
    return calls;
  }, [tierLengths]);

  const { data: tokenIdResults, isLoading: tokenIdsLoading } = useReadContracts({
    contracts: tokenIdContracts,
    query: { enabled: tokenIdContracts.length > 0 && !lengthsLoading },
  });

  // Step 3: Reconstruct per-tier token ID arrays
  const tierData: PoolTierInfo[] = useMemo(() => {
    let offset = 0;
    return TIERS.map((tier, tierIdx) => {
      const len = tierLengths[tierIdx];
      const tokenIds: bigint[] = [];
      for (let i = 0; i < len; i++) {
        const result = tokenIdResults?.[offset + i];
        if (result?.status === "success") {
          tokenIds.push(result.result as bigint);
        }
        offset++;
      }
      // Skip offset if no results yet
      if (!tokenIdResults) offset = 0;

      return {
        tier,
        tokenIds,
        odds: TIER_CONFIG[tier].odds,
      };
    });
  }, [tierLengths, tokenIdResults]);

  return {
    tierData,
    loading: lengthsLoading || tokenIdsLoading,
  };
}
