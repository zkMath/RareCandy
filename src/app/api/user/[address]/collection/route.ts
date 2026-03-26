export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getWalletFromToken } from "@/lib/api/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const wallet = await getWalletFromToken(req);
    if (!wallet || wallet.toLowerCase() !== params.address.toLowerCase()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Get pulls for this user to find their cards
    const { data: pulls } = await supabase
      .from("pulls")
      .select("token_id, outcome, pulled_at")
      .eq("user_address", params.address.toLowerCase())
      .order("pulled_at", { ascending: false });

    if (!pulls || pulls.length === 0) {
      return NextResponse.json({ nfts: [] });
    }

    // Get kept cards (not sold back or redeemed)
    const keptTokenIds = pulls
      .filter((p) => p.outcome === "kept" || p.outcome === "listed")
      .map((p) => p.token_id);

    if (keptTokenIds.length === 0) {
      return NextResponse.json({ nfts: [] });
    }

    const { data: cards } = await supabase
      .from("cards")
      .select("*")
      .in("token_id", keptTokenIds);

    // Get redemptions
    const { data: redemptions } = await supabase
      .from("redemptions")
      .select("token_id, status")
      .eq("user_address", params.address.toLowerCase());

    const redemptionMap = new Map(
      (redemptions || []).map((r) => [r.token_id, r.status])
    );

    return NextResponse.json({
      nfts: (cards || []).map((c) => ({
        tokenId: c.token_id,
        cardName: c.card_name,
        tier: c.tier,
        currentFmv: c.fmv_usd_cents / 100,
        imageUri: c.ipfs_metadata_uri,
        buybackEligible: false, // Determined client-side from contract
        buybackExpiry: null,
        buybackAmount: null,
        redemptionStatus: redemptionMap.get(c.token_id) || null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
