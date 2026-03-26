"use client";

import { Loader2, Check, X } from "lucide-react";

interface TxStatusProps {
  status: "pending" | "confirming" | "success" | "error";
  txHash?: string;
  className?: string;
}

export function TxStatus({ status, txHash, className = "" }: TxStatusProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {status === "pending" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-plum-500" />
          <span className="text-gray-500">Waiting for signature...</span>
        </>
      )}
      {status === "confirming" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-plum-500" />
          <span className="text-gray-500">Confirming transaction...</span>
        </>
      )}
      {status === "success" && (
        <>
          <Check className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-600">Transaction confirmed</span>
        </>
      )}
      {status === "error" && (
        <>
          <X className="w-4 h-4 text-red-500" />
          <span className="text-red-600">Transaction failed</span>
        </>
      )}
      {txHash && (
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-plum-500 hover:text-plum-600 underline"
        >
          View
        </a>
      )}
    </div>
  );
}
