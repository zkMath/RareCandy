export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { inngest } from "@/inngest/client";

// POST /api/oracle/override — set manual price override (admin only)
export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { cardTypeKey, priceUsd, reason, expiresInHours } = await request.json();

  if (!cardTypeKey || !priceUsd || !reason) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (priceUsd < 1 || priceUsd > 100000) {
    return NextResponse.json({ error: "Price out of allowed range" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await supabase.from("oracle_overrides").insert({
    card_type_key: cardTypeKey,
    price_cents: Math.round(priceUsd * 100),
    reason,
    admin_address: adminCheck.walletAddress,
    active: true,
    expires_at: expiresInHours
      ? new Date(Date.now() + expiresInHours * 3600000).toISOString()
      : null,
  });

  // Trigger immediate refresh so override takes effect
  await inngest.send({ name: "oracle/refresh.single", data: { cardTypeKey } });

  return NextResponse.json({ ok: true });
}
