import { inngest } from "../client";
import { MIN_POOL_DEPTH } from "@/constants/tiers";

// Pool depth monitor — runs every hour
// Alerts if any tier drops below MIN_POOL_DEPTH cards
export const poolMonitor = inngest.createFunction(
  { id: "pool-monitor", name: "Pool Depth Monitor", triggers: [{ cron: "0 * * * *" }] },
  async ({ step }) => {
    const alerts = await step.run("check-pool-depths", async () => {
      // In production: query cards table grouped by tier where in_pool = true
      // Compare each tier's count against MIN_POOL_DEPTH
      // If below threshold, send alert via email/Slack webhook

      const tierNames = ["Base", "Mid-Low", "Mid", "High", "Legendary"];
      const lowTiers: string[] = [];

      // Placeholder — in production reads from DB
      for (const name of tierNames) {
        const count = 0; // Would query: SELECT COUNT(*) FROM cards WHERE tier = X AND in_pool = true
        if (count < MIN_POOL_DEPTH) {
          lowTiers.push(`${name}: ${count} cards (min: ${MIN_POOL_DEPTH})`);
        }
      }

      return lowTiers;
    });

    if (alerts.length > 0) {
      await step.run("send-alerts", async () => {
        console.warn("POOL DEPTH ALERT:", alerts);
        // In production: send Slack webhook or email notification
      });
    }

    return { alertsTriggered: alerts.length };
  }
);
