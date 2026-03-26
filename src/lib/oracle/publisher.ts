/**
 * Onchain Publisher
 * Pushes FMV prices to FMVOracle.sol on Base using the oracle operator wallet.
 */

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { FMV_ORACLE_ABI } from "@/constants/abis/FMVOracle";
import type { OnchainPublisher } from "./runner";

export function createOnchainPublisher(
  oracleAddress: string,
  operatorPrivateKey: string
): OnchainPublisher {
  const account = privateKeyToAccount(operatorPrivateKey as `0x${string}`);
  const client = createWalletClient({
    account,
    chain: base,
    transport: http(process.env.ALCHEMY_RPC_URL),
  });

  return {
    async batchUpdatePrices(
      cardTypeKeys: string[],
      fmvUsdCents: number[]
    ): Promise<string> {
      if (cardTypeKeys.length !== fmvUsdCents.length) {
        throw new Error("keys and prices arrays must have same length");
      }

      // Chunk into batches of 50 to avoid block gas limit
      const BATCH_SIZE = 50;
      const hashes: string[] = [];

      for (let i = 0; i < cardTypeKeys.length; i += BATCH_SIZE) {
        const keysBatch   = cardTypeKeys.slice(i, i + BATCH_SIZE);
        const pricesBatch = fmvUsdCents.slice(i, i + BATCH_SIZE);

        const hash = await client.writeContract({
          address: oracleAddress as `0x${string}`,
          abi: FMV_ORACLE_ABI,
          functionName: "batchUpdatePrices",
          args: [keysBatch, pricesBatch.map(p => BigInt(p))],
        });

        hashes.push(hash);
        console.log(`[oracle/onchain] Batch ${Math.floor(i/BATCH_SIZE)+1}: ${hash}`);

        // Brief pause between batches to avoid nonce issues
        if (i + BATCH_SIZE < cardTypeKeys.length) {
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      return hashes[hashes.length - 1]; // return last tx hash
    }
  };
}
