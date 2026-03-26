export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data: cards, error } = await supabase
      .from("cards")
      .select("tier, fmv_usd_cents")
      .eq("in_pool", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tierCounts: Record<number, { count: number; totalFmv: number }> = {};
    for (let i = 0; i <= 4; i++) {
      tierCounts[i] = { count: 0, totalFmv: 0 };
    }

    for (const card of cards || []) {
      tierCounts[card.tier].count++;
      tierCounts[card.tier].totalFmv += card.fmv_usd_cents;
    }

    const totalCards = Object.values(tierCounts).reduce((s, t) => s + t.count, 0);
    const totalFmv = Object.values(tierCounts).reduce((s, t) => s + t.totalFmv, 0);

    const tiers = Object.entries(tierCounts).map(([tier, data]) => {
      const t = Number(tier) as Tier;
      const config = TIER_CONFIG[t];
      return {
        tier: t,
        name: config.name,
        cardCount: data.count,
        odds: totalCards > 0 ? (data.count / totalCards) * 100 : config.odds / 100,
        valueRangeLow: config.valueRangeLow,
        valueRangeHigh: config.valueRangeHigh,
      };
    });

    return NextResponse.json({
      tiers,
      totalCards,
      weightedAvgFmv: totalCards > 0 ? totalFmv / totalCards / 100 : 107.86,
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
