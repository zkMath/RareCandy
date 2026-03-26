export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createOracleService } from "@/lib/oracle/schema";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/oracle/prices/[key] — single card FMV
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const supabase = createAdminClient();
  const db = createOracleService(supabase);
  const price = await db.getCurrentPrice(key);

  if (!price) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const ageH = (Date.now() - price.computedAt.getTime()) / 3600000;
  const stale = ageH > 12;

  return NextResponse.json({
    cardTypeKey: price.cardTypeKey,
    fmvUsd: price.fmvUsdCents / 100,
    buybackUsd: (price.fmvUsdCents / 100) * 0.85,
    confidence: price.confidence,
    flags: price.flags,
    stale,
    updatedAt: price.computedAt.toISOString(),
  });
}
