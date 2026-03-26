"use client";

import { useReadContract } from "wagmi";
import { GACHA_MACHINE_ADDRESS, GACHA_MACHINE_ABI } from "@/constants";
import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";

export function usePoolData() {
  const tiers = [0, 1, 2, 3, 4] as const;

  const poolLengths = tiers.map((tier) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReadContract({
      address: GACHA_MACHINE_ADDRESS,
      abi: GACHA_MACHINE_ABI,
      functionName: "getTierPoolLength",
      args: [tier],
    })
  );

  const tierOdds = tiers.map((tier) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReadContract({
      address: GACHA_MACHINE_ADDRESS,
      abi: GACHA_MACHINE_ABI,
      functionName: "tierOdds",
      args: [BigInt(tier)],
    })
  );

  const counts = poolLengths.map((r) => Number(r.data ?? 0));
  const totalCards = counts.reduce((sum, c) => sum + c, 0);
  const isLoading = poolLengths.some((r) => r.isLoading);

  const tierData = tiers.map((tier) => ({
    tier: tier as Tier,
    name: TIER_CONFIG[tier as Tier].name,
    cardCount: counts[tier],
    configuredOdds: Number(tierOdds[tier]?.data ?? TIER_CONFIG[tier as Tier].odds),
    effectiveOdds: totalCards > 0 ? (counts[tier] / totalCards) * 10000 : 0,
  }));

  return {
    tierData,
    totalCards,
    isLoading,
    refetch: () => poolLengths.forEach((r) => r.refetch()),
  };
}
