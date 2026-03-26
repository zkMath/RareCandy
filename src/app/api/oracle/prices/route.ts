import { NextResponse } from "next/server";
import { createOracleService } from "@/lib/oracle/schema";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/oracle/prices — all current FMV prices (public, cached at edge)
export async function GET() {
  const supabase = createAdminClient();
  const db = createOracleService(supabase);
  const prices = await db.getAllCurrentPrices();

  return NextResponse.json(
    {
      prices: prices.map((p) => ({
        cardTypeKey: p.cardTypeKey,
        fmvUsd: p.fmvUsdCents / 100,
        confidence: p.confidence,
        flags: p.flags,
        updatedAt: p.computedAt.toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}
