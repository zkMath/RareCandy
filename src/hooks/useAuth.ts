"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";

export function useAuth() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const wallet = wallets[0];
  const walletAddress = wallet?.address as `0x${string}` | undefined;
  const walletType = wallet?.walletClientType; // "privy" for embedded, "metamask" etc for external

  return {
    ready,
    isAuthenticated: ready && authenticated,
    user,
    login,
    logout,
    walletAddress,
    walletType,
    isEmbeddedWallet: walletType === "privy",
  };
}
