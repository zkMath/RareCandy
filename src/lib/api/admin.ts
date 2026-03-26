import { getWalletFromToken } from "./auth";

export async function verifyAdmin(req: Request): Promise<boolean> {
  const wallet = await getWalletFromToken(req);
  if (!wallet) return false;

  const adminAddress = process.env.ADMIN_WALLET_ADDRESS || "";
  return wallet.toLowerCase() === adminAddress.toLowerCase();
}
