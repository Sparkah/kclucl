"use client";

import { useGameStore } from "@/store/game-store";

export function PriceChart() {
  const { assets, selectedAssetId } = useGameStore();
  const asset = assets.find((a) => a.id === selectedAssetId);

  if (!asset) {
    return (
      <div className="glass-card rounded-2xl p-6 flex items-center justify-center h-[200px] text-white/20 text-sm">
        Select an asset to view its chart
      </div>
    );
  }

  const data = asset.priceHistory;
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 600;
  const h = 160;
  const padding = 8;

  const positive = data[data.length - 1] >= data[0];
  const color = positive ? "#39ff14" : "#ff2d55";

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = padding + (1 - (v - min) / range) * (h - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding},${h}`,
    ...points,
    `${w - padding},${h}`,
  ].join(" ");

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2 px-2">
        <span className="text-lg">{asset.emoji}</span>
        <span className="font-semibold">{asset.symbol}</span>
        <span className="text-white/30 text-sm">{asset.name}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[160px]">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#chartGrad)" />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current price dot */}
        <circle
          cx={Number(points[points.length - 1].split(",")[0])}
          cy={Number(points[points.length - 1].split(",")[1])}
          r="4"
          fill={color}
        >
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="flex justify-between text-xs text-white/30 px-2 mt-1">
        <span>₮{min.toFixed(2)}</span>
        <span>₮{max.toFixed(2)}</span>
      </div>
    </div>
  );
}
