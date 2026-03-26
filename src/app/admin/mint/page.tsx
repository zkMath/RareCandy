"use client";

import { useState } from "react";
import { Tier } from "@/types";
import { TIER_CONFIG } from "@/constants/tiers";

const tiers = [Tier.Base, Tier.MidLow, Tier.Mid, Tier.High, Tier.Legendary];

export default function AdminMintPage() {
  const [psaCert, setPsaCert] = useState("");
  const [cardName, setCardName] = useState("");
  const [setCode, setSetCode] = useState("");
  const [tier, setTier] = useState<Tier>(Tier.Base);
  const [fmvUsd, setFmvUsd] = useState("");
  const [metadataCID, setMetadataCID] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          psaCert,
          cardName,
          setCode,
          tier,
          fmvUsdCents: Math.round(parseFloat(fmvUsd) * 100),
          metadataCID,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult({ success: true, message: `Card minted! Token ID: ${data.tokenId}` });
        setPsaCert("");
        setCardName("");
        setSetCode("");
        setFmvUsd("");
        setMetadataCID("");
      } else {
        const err = await res.json();
        setResult({ success: false, message: err.error || "Mint failed" });
      }
    } catch {
      setResult({ success: false, message: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mint New Card</h1>

      <div
        className="rounded-[28px] border border-white/60 backdrop-blur-md p-6 md:p-8 max-w-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 100%)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PSA Cert #</label>
              <input
                type="text"
                value={psaCert}
                onChange={(e) => setPsaCert(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Set Code</label>
              <input
                type="text"
                value={setCode}
                onChange={(e) => setSetCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
                placeholder="e.g. SWSH-001"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              placeholder="e.g. Charizard VMAX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(Number(e.target.value) as Tier)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              >
                {tiers.map((t) => (
                  <option key={t} value={t}>{TIER_CONFIG[t].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FMV (USD)</label>
              <input
                type="number"
                value={fmvUsd}
                onChange={(e) => setFmvUsd(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
                placeholder="e.g. 75.00"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metadata IPFS CID</label>
            <input
              type="text"
              value={metadataCID}
              onChange={(e) => setMetadataCID(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-500 focus:border-plum-500"
              placeholder="QmXyz..."
              required
            />
          </div>

          {result && (
            <div
              className={`p-3 rounded-xl border ${
                result.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-plum-600 text-white text-sm font-semibold rounded-xl hover:bg-plum-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Minting..." : "Mint Card to Pool"}
          </button>
        </form>
      </div>
    </div>
  );
}
