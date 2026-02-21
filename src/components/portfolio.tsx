"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Wallet, PieChart } from "lucide-react";
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer } from "recharts";

export function Portfolio() {
  const { credits, positions, assets, startingCredits } = useGameStore();
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const holdingsValue = positions.reduce((sum, pos) => {
    const asset = assets.find((a) => a.id === pos.assetId);
    return sum + (asset ? asset.price * pos.quantity : 0);
  }, 0);

  const totalValue = credits + holdingsValue;
  const totalPnl = ((totalValue - startingCredits) / startingCredits) * 100;
  const holdings = useMemo(
    () =>
      positions
        .map((pos) => {
          const asset = assets.find((a) => a.id === pos.assetId);
          if (!asset) return null;
          const value = asset.price * pos.quantity;
          return {
            id: pos.assetId,
            symbol: asset.symbol,
            emoji: asset.emoji,
            value,
          };
        })
        .filter((h): h is { id: string; symbol: string; emoji: string; value: number } => !!h && h.value > 0),
    [assets, positions]
  );

  const pieColors = ["#00f0ff", "#39ff14", "#b44aff", "#ff6b2b", "#ff2d95", "#62dbff"];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Wallet size={14} /> Portfolio
      </h3>

      {/* Total value */}
      <div className="mb-4">
        <div className="text-3xl font-mono font-bold">₮{totalValue.toFixed(2)}</div>
        <div className={`text-sm ${totalPnl >= 0 ? "text-profit" : "text-loss"}`}>
          {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)}% all time
        </div>
      </div>

      {/* Cash */}
      <div className="flex justify-between text-sm py-2 border-b border-white/5">
        <span className="text-white/40">Available Cash</span>
        <span className="font-mono">₮{credits.toFixed(2)}</span>
      </div>

      {/* Holdings */}
      {positions.length > 0 ? (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-white/30 uppercase tracking-wider flex items-center gap-1">
            <PieChart size={10} /> Holdings
          </div>
          {holdings.length > 0 && (
            <div className="h-40 rounded-xl bg-dark-700/60 border border-white/5 p-2 relative">
              <div className="absolute left-2 top-2 rounded-md bg-dark-800/90 border border-white/10 px-2 py-1 text-[11px] text-white/80 z-10">
                {activeSlice !== null && holdings[activeSlice]
                  ? `${holdings[activeSlice].emoji} ${holdings[activeSlice].symbol} · ₮${holdings[activeSlice].value.toFixed(2)}`
                  : "Hover a slice"}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={holdings}
                    dataKey="value"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={62}
                    paddingAngle={2}
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                    onMouseLeave={() => setActiveSlice(null)}
                  >
                    {holdings.map((entry, idx) => (
                      <Cell key={entry.id} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}
          {positions.map((pos) => {
            const asset = assets.find((a) => a.id === pos.assetId);
            if (!asset) return null;
            const value = asset.price * pos.quantity;
            const pnl = ((asset.price - pos.avgPrice) / pos.avgPrice) * 100;
            return (
              <div key={pos.assetId} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span>{asset.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold">{asset.symbol}</div>
                    <div className="text-xs text-white/30">{pos.quantity.toFixed(3)} shares</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">₮{value.toFixed(2)}</div>
                  <div className={`text-xs ${pnl >= 0 ? "text-profit" : "text-loss"}`}>
                    {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 text-center text-white/20 text-sm py-4">
          No holdings yet — buy your first asset!
        </div>
      )}
    </div>
  );
}
