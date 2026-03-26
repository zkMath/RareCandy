"use client";

import { useState, useEffect } from "react";
import { AnalyticsResponse } from "@/types/api";
import { useGachaMachine } from "@/hooks/contracts/useGachaMachine";
import { TIER_CONFIG } from "@/constants/tiers";
import { Tier } from "@/types";

const tiers = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { tierPoolLengths } = useGachaMachine();

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const totalPool = tierPoolLengths.reduce((s, n) => s + n, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Daily Pulls"
          value={loading ? "—" : (analytics?.pullVolume.daily ?? 0).toString()}
        />
        <StatCard
          label="Weekly Pulls"
          value={loading ? "—" : (analytics?.pullVolume.weekly ?? 0).toString()}
        />
        <StatCard
          label="Buyback Rate"
          value={loading ? "—" : `${analytics?.buybackRate ?? 0}%`}
        />
        <StatCard
          label="Cards in Pool"
          value={totalPool.toString()}
        />
      </div>

      {/* Pool health */}
      <div
        className="rounded-2xl border border-white/60 backdrop-blur-md p-6 mb-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Pool Health</h2>
        <div className="space-y-3">
          {tiers.map((tier, i) => {
            const config = TIER_CONFIG[tier];
            const count = tierPoolLengths[i];
            const pct = totalPool > 0 ? (count / totalPool) * 100 : 0;

            return (
              <div key={tier} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-20">{config.name}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(pct, 2)}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oracle status */}
      {analytics?.oracleStatus && analytics.oracleStatus.length > 0 && (
        <div
          className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
          }}
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Oracle Prices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Card</th>
                  <th className="text-right py-2 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">FMV</th>
                  <th className="text-right py-2 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Confidence</th>
                  <th className="text-right py-2 px-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody>
                {analytics.oracleStatus.slice(0, 20).map((o) => (
                  <tr key={o.cardTypeKey} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-2 text-gray-900 font-medium truncate max-w-[200px]">{o.cardTypeKey}</td>
                    <td className="py-2 px-2 text-right text-gray-900">${o.fmv.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">
                      <ConfidenceBadge confidence={o.confidence} />
                    </td>
                    <td className="py-2 px-2 text-right text-gray-500 text-xs">
                      {new Date(o.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
      <span className="text-lg font-bold text-gray-900">{value}</span>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const styles = {
    HIGH: "bg-emerald-50 text-emerald-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    LOW: "bg-red-50 text-red-700",
  };
  const style = styles[confidence as keyof typeof styles] || styles.LOW;
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${style}`}>
      {confidence}
    </span>
  );
}
