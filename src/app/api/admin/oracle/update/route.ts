export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/api/admin";

export async function POST(req: NextRequest) {
  try {
    const { authorized: isAdmin } = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const cardTypeKeys: string[] = body.cardTypeKeys || [];

    // Trigger Inngest oracle refresh event
    // In production, this would call inngest.send() to trigger the oracle-refresh function
    // For now, return success and log the request
    console.log("Oracle refresh triggered for:", cardTypeKeys.length ? cardTypeKeys : "all cards");

    return NextResponse.json({
      message: "Oracle refresh triggered",
      cardTypeKeys: cardTypeKeys.length ? cardTypeKeys : "all",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
