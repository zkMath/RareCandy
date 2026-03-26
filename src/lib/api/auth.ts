import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID || "",
  process.env.PRIVY_APP_SECRET || ""
);

export async function verifyPrivyToken(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const claims = await privy.verifyAuthToken(token);
    return claims;
  } catch {
    return null;
  }
}

export async function getWalletFromToken(req: Request): Promise<string | null> {
  const claims = await verifyPrivyToken(req);
  if (!claims) return null;

  try {
    const user = await privy.getUser(claims.userId);
    const wallet = user.wallet?.address || user.linkedAccounts?.find(
      (a: { type: string }) => a.type === "wallet"
    );
    return typeof wallet === "string" ? wallet : (wallet as { address?: string })?.address || null;
  } catch {
    return null;
  }
}
