"use client";

interface USDCAmountProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
}

export function USDCAmount({ amount, className = "", showSymbol = true }: USDCAmountProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <span className={className}>
      {formatted}
      {showSymbol && <span className="text-gray-400 ml-1 text-xs">USDC</span>}
    </span>
  );
}
