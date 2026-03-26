export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/oracle/alerts/[id]/resolve — resolve an alert (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("oracle_alerts")
    .update({ resolved: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to resolve alert" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
