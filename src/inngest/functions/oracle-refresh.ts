import { inngest } from "../client";
import { refreshAllCards, refreshCard } from "@/lib/oracle/runner";
import { CARD_REGISTRY, REGISTRY_MAP } from "@/lib/oracle/registry";
import { createOracleService } from "@/lib/oracle/schema";
import { createAdminClient } from "@/lib/supabase/admin";

function getOracleConfig() {
  return {
    poketraceKey: process.env.POKETRACE_API_KEY!,
    pptKey: process.env.PPT_API_KEY!,
  };
}

function getOracleService() {
  const supabase = createAdminClient();
  return createOracleService(supabase);
}

// Oracle: Refresh All Cards — runs every 6 hours
export const oracleRefreshAll = inngest.createFunction(
  { id: "oracle-refresh-all", name: "Oracle: Refresh All Cards", triggers: [{ cron: "0 */6 * * *" }] },
  async ({ step }) => {
    const db = getOracleService();
    const config = getOracleConfig();

    await step.run("refresh-all-cards", async () => {
      await refreshAllCards(CARD_REGISTRY, db, config);
    });

    return { refreshed: CARD_REGISTRY.length };
  }
);

// Oracle: Refresh Single Card — triggered on-demand (e.g. post-pull)
export const oracleRefreshSingle = inngest.createFunction(
  { id: "oracle-refresh-single", name: "Oracle: Refresh Single Card", triggers: [{ event: "oracle/refresh.single" }] },
  async ({ event, step }) => {
    const db = getOracleService();
    const config = getOracleConfig();
    const cardTypeKey = event.data.cardTypeKey as string;

    const card = REGISTRY_MAP.get(cardTypeKey);
    if (!card) throw new Error(`Unknown card type: ${cardTypeKey}`);

    await step.run("refresh-card", async () => {
      await refreshCard(card, db, config);
    });

    return { refreshed: cardTypeKey };
  }
);
