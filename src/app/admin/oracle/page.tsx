"use client";

import { useState, useEffect } from "react";

interface OracleAlert {
  id: number;
  card_type_key: string;
  alert_type: string;
  message: string;
  created_at: string;
}

export default function AdminOraclePage() {
  const [alerts, setAlerts] = useState<OracleAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const res = await fetch("/api/oracle/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // ignore
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetch("/api/oracle/refresh", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }

  async function resolveAlert(id: number) {
    try {
      await fetch(`/api/oracle/alerts/${id}/resolve`, { method: "POST" });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Oracle Management</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh All Prices"}
        </button>
      </div>

      {/* Alerts */}
      <div
        className="rounded-2xl border border-white/60 backdrop-blur-md p-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Unresolved Alerts ({alerts.length})
        </h2>

        {alerts.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No unresolved alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTypeBadge type={alert.alert_type} />
                    <span className="text-sm font-medium text-gray-900">{alert.card_type_key}</span>
                  </div>
                  <p className="text-xs text-gray-500">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-3 py-1.5 text-xs font-medium text-plum-600 hover:bg-plum-50 rounded-lg transition-colors"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    spike: "bg-red-50 text-red-700",
    crash: "bg-red-50 text-red-700",
    stale: "bg-amber-50 text-amber-700",
    low_confidence: "bg-amber-50 text-amber-700",
    max_move_clamp: "bg-blue-50 text-blue-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${styles[type] || "bg-gray-50 text-gray-700"}`}>
      {type.replace("_", " ")}
    </span>
  );
}
