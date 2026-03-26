export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tier = searchParams.get("tier");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "newest";

    const supabase = getSupabaseClient();
    let query = supabase
      .from("cards")
      .select("token_id, card_name, tier, fmv_usd_cents, ipfs_metadata_uri")
      .eq("in_pool", false);

    if (tier !== null) {
      query = query.eq("tier", parseInt(tier, 10));
    }
    if (minPrice) {
      query = query.gte("fmv_usd_cents", parseInt(minPrice, 10) * 100);
    }
    if (maxPrice) {
      query = query.lte("fmv_usd_cents", parseInt(maxPrice, 10) * 100);
    }

    if (sort === "price_asc") {
      query = query.order("fmv_usd_cents", { ascending: true });
    } else if (sort === "price_desc") {
      query = query.order("fmv_usd_cents", { ascending: false });
    } else {
      query = query.order("updated_at", { ascending: false });
    }

    const { data: cards, error } = await query.limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      listings: (cards || []).map((c) => ({
        tokenId: c.token_id,
        cardName: c.card_name,
        tier: c.tier,
        currentFmv: c.fmv_usd_cents / 100,
        imageUri: c.ipfs_metadata_uri,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
