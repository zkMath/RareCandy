"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "@/constants";

export function useMarketplace() {
  const { writeContract: writeList, data: listTxHash, isPending: isListPending } = useWriteContract();
  const { writeContract: writeBuy, data: buyTxHash, isPending: isBuyPending } = useWriteContract();
  const { writeContract: writeCancel, data: cancelTxHash, isPending: isCancelPending } = useWriteContract();

  const { isLoading: isListConfirming, isSuccess: isListSuccess } = useWaitForTransactionReceipt({
    hash: listTxHash,
  });
  const { isLoading: isBuyConfirming, isSuccess: isBuySuccess } = useWaitForTransactionReceipt({
    hash: buyTxHash,
  });
  const { isLoading: isCancelConfirming, isSuccess: isCancelSuccess } = useWaitForTransactionReceipt({
    hash: cancelTxHash,
  });

  function listCard(tokenId: bigint, priceUsd6: bigint) {
    writeList({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "listCard",
      args: [tokenId, priceUsd6],
    });
  }

  function buyCard(listingId: bigint) {
    writeBuy({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "buyCard",
      args: [listingId],
    });
  }

  function cancelListing(listingId: bigint) {
    writeCancel({
      address: MARKETPLACE_ADDRESS,
      abi: MARKETPLACE_ABI,
      functionName: "cancelListing",
      args: [listingId],
    });
  }

  return {
    listCard,
    isListPending,
    isListConfirming,
    isListSuccess,
    buyCard,
    isBuyPending,
    isBuyConfirming,
    isBuySuccess,
    cancelListing,
    isCancelPending,
    isCancelConfirming,
    isCancelSuccess,
  };
}
