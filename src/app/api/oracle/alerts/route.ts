export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";
import { createOracleService } from "@/lib/oracle/schema";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/oracle/alerts — unresolved alerts (admin only)
export async function GET(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createAdminClient();
  const db = createOracleService(supabase);
  const alerts = await db.getUnresolvedAlerts();

  return NextResponse.json({ alerts });
}
