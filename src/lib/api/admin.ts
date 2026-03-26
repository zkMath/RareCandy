import { getWalletFromToken } from "./auth";

interface AdminCheckResult {
  authorized: boolean;
  walletAddress: string;
}

export async function verifyAdmin(req: Request): Promise<AdminCheckResult> {
  const wallet = await getWalletFromToken(req);
  if (!wallet) return { authorized: false, walletAddress: "" };

  const adminAddress = process.env.ADMIN_WALLET_ADDRESS || "";
  const isAdmin = wallet.toLowerCase() === adminAddress.toLowerCase();
  return { authorized: isAdmin, walletAddress: wallet };
}
