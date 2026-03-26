"use client";

import { useReadContract } from "wagmi";
import { FMV_ORACLE_ADDRESS, FMV_ORACLE_ABI } from "@/constants";

export function useFMVOracle(cardType?: string) {
  const { data: priceData } = useReadContract({
    address: FMV_ORACLE_ADDRESS,
    abi: FMV_ORACLE_ABI,
    functionName: "prices",
    args: cardType ? [cardType] : undefined,
    query: { enabled: !!cardType },
  });

  const { data: price } = useReadContract({
    address: FMV_ORACLE_ADDRESS,
    abi: FMV_ORACLE_ABI,
    functionName: "getPrice",
    args: cardType ? [cardType] : undefined,
    query: { enabled: !!cardType },
  });

  const oraclePrice = priceData
    ? {
        fmvUsd6: (priceData as [bigint, bigint, bigint])[0],
        updatedAt: (priceData as [bigint, bigint, bigint])[1],
        confidence: (priceData as [bigint, bigint, bigint])[2],
      }
    : null;

  return {
    oraclePrice,
    price: price ?? BigInt(0),
  };
}
