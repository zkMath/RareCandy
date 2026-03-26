import { inngest } from "../client";

// Event indexer — runs every 5 minutes
// Indexes on-chain events (CardPulled, CardReturned, Listings) into the database
export const indexEvents = inngest.createFunction(
  { id: "index-events", name: "Contract Event Indexer", triggers: [{ cron: "*/5 * * * *" }] },
  async ({ step }) => {
    const indexed = await step.run("index-contract-events", async () => {
      // In production:
      // 1. Read last processed block from a cursor table
      // 2. Use viem's getContractEvents to fetch CardPulled, CardReturnedToPool,
      //    CardRedeemed, ListingCreated, ListingFilled, ListingCancelled events
      // 3. For each event, upsert into the appropriate DB table (pulls, buybacks, etc.)
      // 4. Update the block cursor

      return { pullsIndexed: 0, buybacksIndexed: 0, listingsIndexed: 0 };
    });

    return indexed;
  }
);
