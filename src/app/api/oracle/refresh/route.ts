export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";
import { inngest } from "@/inngest/client";
import { REGISTRY_MAP } from "@/lib/oracle/registry";

// POST /api/oracle/refresh — trigger manual price refresh (admin only)
export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request);
  if (!adminCheck.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { cardTypeKey } = body;

  if (cardTypeKey) {
    const card = REGISTRY_MAP.get(cardTypeKey);
    if (!card) {
      return NextResponse.json({ error: "Unknown card type" }, { status: 400 });
    }
    await inngest.send({ name: "oracle/refresh.single", data: { cardTypeKey } });
  } else {
    await inngest.send({ name: "oracle/refresh.all", data: {} });
  }

  return NextResponse.json({ ok: true, message: "Refresh queued" });
}
