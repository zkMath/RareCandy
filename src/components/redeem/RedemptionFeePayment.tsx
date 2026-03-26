"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { USDC_ADDRESS, USDC_ABI, ADMIN_WALLET_ADDRESS } from "@/constants";
import { useEffect } from "react";

interface RedemptionFeePaymentProps {
  feeUsd: number;
  onPaymentComplete: (txHash: string) => void;
  onBack: () => void;
}

export function RedemptionFeePayment({ feeUsd, onPaymentComplete, onBack }: RedemptionFeePaymentProps) {
  const feeUsd6 = BigInt(Math.round(feeUsd * 1_000_000));

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess && txHash) {
      onPaymentComplete(txHash);
    }
  }, [isSuccess, txHash, onPaymentComplete]);

  const handlePay = () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [ADMIN_WALLET_ADDRESS, feeUsd6],
    });
  };

  return (
    <div
      className="rounded-[28px] border border-white/60 backdrop-blur-md p-6 md:p-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
      }}
    >
      <h2 className="text-lg font-bold text-gray-900 mb-2">Redemption Fee</h2>
      <p className="text-sm text-gray-500 mb-6">
        A ${feeUsd} USDC fee covers secure packaging and insured shipping of your PSA 10 card.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Redemption Fee</span>
          <span className="text-lg font-bold text-gray-900">${feeUsd} USDC</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">Transaction failed. Please try again.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handlePay}
          disabled={isPending || isConfirming}
          className="flex-1 px-6 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors disabled:opacity-50"
        >
          {isPending
            ? "Confirm in Wallet..."
            : isConfirming
            ? "Processing..."
            : `Pay $${feeUsd} USDC`}
        </button>
      </div>
    </div>
  );
}
