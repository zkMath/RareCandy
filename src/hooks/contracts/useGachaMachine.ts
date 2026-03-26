"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from "wagmi";
import { GACHA_MACHINE_ADDRESS, GACHA_MACHINE_ABI, GACHA_CARD_ABI, GACHA_CARD_ADDRESS } from "@/constants";
import { useAuth } from "../useAuth";
import { useState, useCallback } from "react";
import { PullState, Tier } from "@/types";

export function useGachaMachine() {
  const { walletAddress } = useAuth();
  const [pullState, setPullState] = useState<PullState>(PullState.Idle);
  const [revealedTokenId, setRevealedTokenId] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read pull price
  const { data: pullPrice } = useReadContract({
    address: GACHA_MACHINE_ADDRESS,
    abi: GACHA_MACHINE_ABI,
    functionName: "pullPrice",
  });

  // Read tier odds
  const tierOddsResults = [0, 1, 2, 3, 4].map((i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReadContract({
      address: GACHA_MACHINE_ADDRESS,
      abi: GACHA_MACHINE_ABI,
      functionName: "tierOdds",
      args: [BigInt(i)],
    })
  );

  // Read tier pool lengths
  const tierPoolLengths = [0, 1, 2, 3, 4].map((i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useReadContract({
      address: GACHA_MACHINE_ADDRESS,
      abi: GACHA_MACHINE_ABI,
      functionName: "getTierPoolLength",
      args: [i as Tier],
    })
  );

  // Write: pull
  const { writeContract, data: pullTxHash, isPending: isPullPending } = useWriteContract();

  const { isLoading: isPullConfirming } = useWaitForTransactionReceipt({
    hash: pullTxHash,
  });

  // Watch for PullCompleted events
  useWatchContractEvent({
    address: GACHA_MACHINE_ADDRESS,
    abi: GACHA_MACHINE_ABI,
    eventName: "PullCompleted",
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.user?.toLowerCase() === walletAddress?.toLowerCase()) {
          setRevealedTokenId(log.args.tokenId ?? null);
          setPullState(PullState.Revealed);
        }
      }
    },
    enabled: pullState === PullState.AwaitingVRF,
  });

  const pull = useCallback(() => {
    setError(null);
    setPullState(PullState.Pulling);
    try {
      writeContract(
        {
          address: GACHA_MACHINE_ADDRESS,
          abi: GACHA_MACHINE_ABI,
          functionName: "pull",
        },
        {
          onSuccess: () => {
            setPullState(PullState.AwaitingVRF);
          },
          onError: (err) => {
            setError(err.message);
            setPullState(PullState.Error);
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pull failed");
      setPullState(PullState.Error);
    }
  }, [writeContract]);

  const reset = useCallback(() => {
    setPullState(PullState.Idle);
    setRevealedTokenId(null);
    setError(null);
  }, []);

  return {
    pullPrice: pullPrice ?? BigInt(0),
    tierOdds: tierOddsResults.map((r) => Number(r.data ?? 0)),
    tierPoolLengths: tierPoolLengths.map((r) => Number(r.data ?? 0)),
    pull,
    pullState,
    setPullState,
    isPullPending,
    isPullConfirming,
    revealedTokenId,
    error,
    reset,
    pullTxHash,
  };
}
