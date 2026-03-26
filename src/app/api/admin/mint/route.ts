export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { verifyAdmin } from "@/lib/api/admin";
import { mintSchema } from "@/lib/api/validation";

export async function POST(req: NextRequest) {
  try {
    const { authorized: isAdmin } = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = mintSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const { psaCert, cardName, setCode, tier, fmvUsdCents, metadataCID } = parsed.data;
    const supabase = getSupabaseClient();

    // Get next token_id
    const { data: maxCard } = await supabase
      .from("cards")
      .select("token_id")
      .order("token_id", { ascending: false })
      .limit(1)
      .single();

    const nextTokenId = maxCard ? maxCard.token_id + 1 : 1;

    const { data: card, error } = await supabase
      .from("cards")
      .insert({
        token_id: nextTokenId,
        psa_cert: psaCert,
        card_name: cardName,
        set_code: setCode,
        tier,
        fmv_usd_cents: fmvUsdCents,
        acquisition_cost_usd_cents: fmvUsdCents,
        in_pool: true,
        ipfs_metadata_uri: `ipfs://${metadataCID}`,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Note: Actual on-chain minting (calling GachaCard.mintCard()) would happen here
    // via a server-side viem walletClient using the oracle operator key.
    // For now, we create the DB record and the admin triggers the on-chain tx separately.

    return NextResponse.json({ tokenId: nextTokenId, card }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
