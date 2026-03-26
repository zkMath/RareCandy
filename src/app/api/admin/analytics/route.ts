export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { verifyAdmin } from "@/lib/api/admin";

export async function GET(req: NextRequest) {
  try {
    const { authorized: isAdmin } = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseClient();
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Pull volumes
    const [dailyPulls, weeklyPulls, monthlyPulls] = await Promise.all([
      supabase.from("pulls").select("id", { count: "exact" }).gte("pulled_at", dayAgo),
      supabase.from("pulls").select("id", { count: "exact" }).gte("pulled_at", weekAgo),
      supabase.from("pulls").select("id", { count: "exact" }).gte("pulled_at", monthAgo),
    ]);

    // Buyback rate (last 30 days)
    const { data: recentPulls } = await supabase
      .from("pulls")
      .select("outcome")
      .gte("pulled_at", monthAgo);

    const totalPulls = recentPulls?.length || 0;
    const buybacks = recentPulls?.filter((p) => p.outcome === "sold_back").length || 0;
    const buybackRate = totalPulls > 0 ? buybacks / totalPulls : 0;

    // Revenue from recent snapshot
    const { data: latestSnapshot } = await supabase
      .from("revenue_snapshots")
      .select("*")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    // Oracle status
    const { data: oraclePrices } = await supabase
      .from("oracle_prices")
      .select("card_type_key, fmv_usd_cents, confidence, updated_at")
      .order("updated_at", { ascending: false });

    return NextResponse.json({
      revenue: {
        daily: latestSnapshot?.total_revenue || 0,
        weekly: (latestSnapshot?.total_revenue || 0) * 7,
        monthly: (latestSnapshot?.total_revenue || 0) * 30,
      },
      pullVolume: {
        daily: dailyPulls.count || 0,
        weekly: weeklyPulls.count || 0,
        monthly: monthlyPulls.count || 0,
      },
      buybackRate: Math.round(buybackRate * 100),
      vaultBalance: 0, // Read from contract client-side
      oracleStatus: (oraclePrices || []).map((o) => ({
        cardTypeKey: o.card_type_key,
        fmv: o.fmv_usd_cents / 100,
        confidence: o.confidence,
        lastUpdated: o.updated_at,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
