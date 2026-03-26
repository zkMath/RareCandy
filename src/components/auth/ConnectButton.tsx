"use client";

import { useAuth } from "@/hooks/useAuth";

export function ConnectButton() {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="px-5 py-2.5 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors shadow-lg shadow-plum-300/30"
    >
      Connect Wallet
    </button>
  );
}
