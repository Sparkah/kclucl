"use client";

import { useGameStore, Asset } from "@/store/game-store";
import { TrendingUp, TrendingDown } from "lucide-react";

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#39ff14" : "#ff2d55"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AssetRow({ asset }: { asset: Asset }) {
  const { selectedAssetId, selectAsset } = useGameStore();
  const isSelected = selectedAssetId === asset.id;
  const positive = asset.change24h >= 0;

  return (
    <button
      onClick={() => selectAsset(asset.id)}
      className={`w-full min-w-0 overflow-hidden flex items-center gap-2 px-3 py-3 rounded-xl border transition-all ${
        isSelected
          ? "bg-white/10 border-neon-blue/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          : "bg-dark-800/45 border-white/5 hover:bg-white/5 hover:border-white/15"
      }`}
    >
      <span className="text-xl">{asset.emoji}</span>
      <div className="flex-1 min-w-0 text-left">
        <div className="font-semibold">{asset.symbol}</div>
        <div className="text-xs text-white/45">{asset.name}</div>
      </div>
      <div className="hidden md:block">
        <MiniChart data={asset.priceHistory.slice(-15)} positive={positive} />
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-sm font-semibold">₮{asset.price.toFixed(2)}</div>
        <div className={`flex items-center justify-end gap-1 text-xs ${positive ? "text-profit" : "text-loss"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}
          {asset.change24h.toFixed(2)}%
        </div>
      </div>
    </button>
  );
}

export function MarketTable() {
  const assets = useGameStore((s) => s.assets);

  return (
    <div className="glass-card rounded-2xl p-4 overflow-hidden">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-1 px-4">
        Markets
      </h3>
      <p className="text-[11px] text-white/35 px-4 mb-3">
        2036 AI board: the five most traded frontier model companies.
      </p>
      <div className="space-y-1">
        {assets.map((asset) => (
          <AssetRow key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
