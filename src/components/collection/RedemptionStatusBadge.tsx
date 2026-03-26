import { RedemptionStatus } from "@/types";

interface RedemptionStatusBadgeProps {
  status: RedemptionStatus;
}

const statusStyles: Record<RedemptionStatus, { bg: string; text: string; label: string }> = {
  [RedemptionStatus.Pending]: {
    bg: "bg-amber-500",
    text: "text-white",
    label: "Pending",
  },
  [RedemptionStatus.Dispatched]: {
    bg: "bg-blue-500",
    text: "text-white",
    label: "Shipped",
  },
  [RedemptionStatus.Delivered]: {
    bg: "bg-emerald-500",
    text: "text-white",
    label: "Delivered",
  },
};

export function RedemptionStatusBadge({ status }: RedemptionStatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-lg ${style.bg} ${style.text} text-[10px] font-semibold uppercase tracking-wider shadow-sm`}
    >
      {style.label}
    </span>
  );
}
