export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data: pulls, error } = await supabase
      .from("pulls")
      .select("token_id, user_address, tier, pulled_at, cards(card_name)")
      .order("pulled_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = (pulls || []).map((p: Record<string, unknown>) => {
      const cards = p.cards as { card_name: string } | null;
      return {
        cardName: cards?.card_name || "Unknown Card",
        tier: p.tier,
        pulledAt: p.pulled_at,
        address: `${(p.user_address as string).slice(0, 6)}...${(p.user_address as string).slice(-4)}`,
      };
    });

    return NextResponse.json({ pulls: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
