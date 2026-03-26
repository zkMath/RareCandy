"use client";

import { useReadContract } from "wagmi";
import { USDC_ADDRESS, USDC_ABI } from "@/constants";
import { useAuth } from "./useAuth";
import { formatUnits } from "viem";

export function useUSDCBalance() {
  const { walletAddress } = useAuth();

  const { data: rawBalance, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: walletAddress ? [walletAddress] : undefined,
    query: { enabled: !!walletAddress },
  });

  const balance = rawBalance ? Number(formatUnits(rawBalance, 6)) : 0;

  return {
    balance,
    rawBalance: rawBalance ?? BigInt(0),
    isLoading,
    refetch,
  };
}
