"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BUYBACK_VAULT_ADDRESS, BUYBACK_VAULT_ABI } from "@/constants";

export function useBuybackVault(tokenId?: bigint) {
  const { data: eligibility } = useReadContract({
    address: BUYBACK_VAULT_ADDRESS,
    abi: BUYBACK_VAULT_ABI,
    functionName: "checkEligibility",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const { data: expiry } = useReadContract({
    address: BUYBACK_VAULT_ADDRESS,
    abi: BUYBACK_VAULT_ABI,
    functionName: "buybackExpiry",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  function executeBuyback(id: bigint) {
    writeContract({
      address: BUYBACK_VAULT_ADDRESS,
      abi: BUYBACK_VAULT_ABI,
      functionName: "executeBuyback",
      args: [id],
    });
  }

  return {
    eligible: eligibility ? (eligibility as [boolean, bigint])[0] : false,
    buybackAmount: eligibility ? (eligibility as [boolean, bigint])[1] : BigInt(0),
    expiresAt: expiry ?? BigInt(0),
    executeBuyback,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
  };
}
