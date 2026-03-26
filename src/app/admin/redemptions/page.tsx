"use client";

import { useState, useEffect } from "react";

interface Redemption {
  id: number;
  token_id: number;
  user_address: string;
  shipping_name: string;
  status: string;
  created_at: string;
}

export default function AdminRedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from admin analytics which includes all data
    // In production, this would be a dedicated admin redemptions endpoint
    setLoading(false);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Redemption Manager</h1>

      <div
        className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : redemptions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No pending redemptions. Redemptions submitted by users will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {redemptions.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Token #{r.token_id} — {r.shipping_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.user_address.slice(0, 6)}...{r.user_address.slice(-4)} ·{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    dispatched: "bg-blue-50 text-blue-700",
    delivered: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${styles[status] || "bg-gray-50 text-gray-700"}`}>
      {status}
    </span>
  );
}
