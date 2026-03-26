"use client";

import { useAuth } from "./useAuth";
import { ADMIN_WALLET_ADDRESS } from "@/constants";

export function useIsAdmin() {
  const { walletAddress, isAuthenticated } = useAuth();

  const isAdmin =
    isAuthenticated &&
    !!walletAddress &&
    walletAddress.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase();

  return isAdmin;
}
