export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { inngest } from "@/inngest/client";

// POST /api/oracle/freeze — freeze or unfreeze a card's price (admin only)
export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { cardTypeKey, reason, action } = await request.json();

  if (!cardTypeKey) {
    return NextResponse.json({ error: "Missing cardTypeKey" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (action === "unfreeze") {
    // Deactivate freeze sentinel
    await supabase
      .from("oracle_overrides")
      .update({ active: false })
      .eq("card_type_key", cardTypeKey)
      .eq("price_cents", -1)
      .eq("active", true);

    // Trigger immediate refresh
    await inngest.send({ name: "oracle/refresh.single", data: { cardTypeKey } });

    return NextResponse.json({ ok: true, message: `${cardTypeKey} unfrozen` });
  }

  // Default: freeze
  if (!reason) {
    return NextResponse.json({ error: "Missing reason for freeze" }, { status: 400 });
  }

  await supabase.from("oracle_overrides").insert({
    card_type_key: cardTypeKey,
    price_cents: -1, // freeze sentinel
    reason: `FREEZE: ${reason}`,
    admin_address: adminCheck.walletAddress,
    active: true,
  });

  return NextResponse.json({ ok: true, message: `${cardTypeKey} price frozen` });
}
