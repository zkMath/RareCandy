"use client";

import { useReadContract } from "wagmi";
import { GACHA_CARD_ADDRESS, GACHA_CARD_ABI } from "@/constants";

export function useGachaCard(tokenId?: bigint) {
  const { data: cardData } = useReadContract({
    address: GACHA_CARD_ADDRESS,
    abi: GACHA_CARD_ABI,
    functionName: "cards",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const { data: owner } = useReadContract({
    address: GACHA_CARD_ADDRESS,
    abi: GACHA_CARD_ABI,
    functionName: "ownerOf",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const { data: tokenURI } = useReadContract({
    address: GACHA_CARD_ADDRESS,
    abi: GACHA_CARD_ABI,
    functionName: "tokenURI",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const { data: inPool } = useReadContract({
    address: GACHA_CARD_ADDRESS,
    abi: GACHA_CARD_ABI,
    functionName: "inPool",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: tokenId !== undefined },
  });

  const card = cardData
    ? {
        psaCert: (cardData as [string, string, number, bigint, bigint, boolean])[0],
        cardName: (cardData as [string, string, number, bigint, bigint, boolean])[1],
        tier: (cardData as [string, string, number, bigint, bigint, boolean])[2],
        fmvAtMint: (cardData as [string, string, number, bigint, bigint, boolean])[3],
        mintedAt: (cardData as [string, string, number, bigint, bigint, boolean])[4],
        redeemed: (cardData as [string, string, number, bigint, bigint, boolean])[5],
      }
    : null;

  return {
    card,
    owner: owner as `0x${string}` | undefined,
    tokenURI: tokenURI as string | undefined,
    inPool: inPool as boolean | undefined,
  };
}
