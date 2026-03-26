import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { oracleRefreshAll, oracleRefreshSingle } from "@/inngest/functions/oracle-refresh";
import { poolMonitor } from "@/inngest/functions/pool-monitor";
import { indexEvents } from "@/inngest/functions/index-events";
import { revenueSnapshot } from "@/inngest/functions/revenue-snapshot";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [oracleRefreshAll, oracleRefreshSingle, poolMonitor, indexEvents, revenueSnapshot],
});
