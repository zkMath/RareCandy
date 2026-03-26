"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { USDC_ADDRESS, USDC_ABI } from "@/constants";
import { useAuth } from "../useAuth";

export function useUSDCApproval(spender: `0x${string}`) {
  const { walletAddress } = useAuth();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "allowance",
    args: walletAddress ? [walletAddress, spender] : undefined,
    query: { enabled: !!walletAddress },
  });

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function approve(amount: bigint) {
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "approve",
      args: [spender, amount],
    });
  }

  return {
    allowance: allowance ?? BigInt(0),
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    refetchAllowance,
    txHash,
  };
}
