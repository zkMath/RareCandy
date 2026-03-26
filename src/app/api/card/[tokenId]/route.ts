export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { tokenId: string } }
) {
  try {
    const tokenId = parseInt(params.tokenId, 10);
    if (isNaN(tokenId)) {
      return NextResponse.json({ error: "Invalid tokenId" }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const { data: card, error: cardError } = await supabase
      .from("cards")
      .select("*")
      .eq("token_id", tokenId)
      .single();

    if (cardError || !card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const { data: pullHistory } = await supabase
      .from("pulls")
      .select("user_address, pull_price_usd_cents, card_fmv_at_pull, pulled_at")
      .eq("token_id", tokenId)
      .order("pulled_at", { ascending: false });

    const { data: oraclePrice } = await supabase
      .from("oracle_prices")
      .select("fmv_usd_cents, updated_at")
      .eq("card_type_key", `${card.set_code}_${card.card_name}`)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      tokenId: card.token_id,
      cardName: card.card_name,
      psaCert: card.psa_cert,
      setCode: card.set_code,
      tier: card.tier,
      currentFmv: oraclePrice ? oraclePrice.fmv_usd_cents / 100 : card.fmv_usd_cents / 100,
      imageUri: card.ipfs_metadata_uri,
      metadataUri: card.ipfs_metadata_uri,
      inPool: card.in_pool,
      pullHistory: (pullHistory || []).map((p) => ({
        userAddress: `${p.user_address.slice(0, 6)}...${p.user_address.slice(-4)}`,
        pullPrice: p.pull_price_usd_cents / 100,
        fmvAtPull: p.card_fmv_at_pull / 100,
        pulledAt: p.pulled_at,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
