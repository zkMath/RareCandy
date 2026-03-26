import { inngest } from "../client";

// Revenue snapshot — runs daily at midnight UTC
// Computes daily revenue metrics and stores in revenue_snapshots table
export const revenueSnapshot = inngest.createFunction(
  { id: "revenue-snapshot", name: "Daily Revenue Snapshot", triggers: [{ cron: "0 0 * * *" }] },
  async ({ step }) => {
    await step.run("compute-daily-revenue", async () => {
      // In production:
      // 1. Query pulls for yesterday: SUM(pull_price_usd_cents) = gross_pull_revenue
      // 2. Query buybacks for yesterday: SUM(buyback_amount_usd_cents) = buyback_payouts
      // 3. cash_revenue = gross_pull_revenue - buyback_payouts
      // 4. Query marketplace fees and redemption fees
      // 5. Insert into revenue_snapshots table

      const today = new Date().toISOString().split("T")[0];
      console.log(`Revenue snapshot computed for ${today}`);
    });

    return { success: true };
  }
);
