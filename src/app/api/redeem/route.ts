export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getWalletFromToken } from "@/lib/api/auth";
import { redeemSchema } from "@/lib/api/validation";

export async function POST(req: NextRequest) {
  try {
    const wallet = await getWalletFromToken(req);
    if (!wallet) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = redeemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const { tokenId, shippingName, shippingAddress, feeTxHash } = parsed.data;
    const supabase = getSupabaseClient();

    // Check card exists
    const { data: card } = await supabase
      .from("cards")
      .select("token_id")
      .eq("token_id", tokenId)
      .single();

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check not already in redemption
    const { data: existing } = await supabase
      .from("redemptions")
      .select("id")
      .eq("token_id", tokenId)
      .neq("status", "delivered")
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Card already has pending redemption" }, { status: 409 });
    }

    // Create redemption record
    const { data: redemption, error } = await supabase
      .from("redemptions")
      .insert({
        token_id: tokenId,
        user_address: wallet.toLowerCase(),
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        fee_tx_hash: feeTxHash,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ redemption }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
