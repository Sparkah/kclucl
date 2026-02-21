"use client";

import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

export function TradePanel() {
  const { assets, selectedAssetId, credits, positions, buyAsset, sellAsset } = useGameStore();
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");

  const asset = assets.find((a) => a.id === selectedAssetId);
  const position = positions.find((p) => p.assetId === selectedAssetId);

  if (!asset) {
    return (
      <div className="glass-card rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-white/30">
          <Info size={32} className="mx-auto mb-2" />
          <p>Select an asset to start trading</p>
        </div>
      </div>
    );
  }

  const qty = Number(quantity) || 0;
  const total = qty * asset.price;
  const canBuy = mode === "buy" && qty > 0 && total <= credits;
  const canSell = mode === "sell" && qty > 0 && position && qty <= position.quantity;
  const canExecute = mode === "buy" ? canBuy : canSell;

  const handleTrade = () => {
    if (!canExecute) return;
    if (mode === "buy") {
      buyAsset(asset.id, qty);
    } else {
      sellAsset(asset.id, qty);
    }
    setQuantity("");
  };

  const maxBuy = Math.floor(credits / asset.price);
  const maxSell = position?.quantity || 0;

  const pnl = position
    ? ((asset.price - position.avgPrice) / position.avgPrice) * 100
    : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Asset header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{asset.emoji}</span>
        <div>
          <h3 className="text-xl font-bold">{asset.symbol}</h3>
          <p className="text-sm text-white/40">{asset.name}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-mono font-bold">₮{asset.price.toFixed(2)}</div>
          <div className={`text-sm ${asset.change24h >= 0 ? "text-profit" : "text-loss"}`}>
            {asset.change24h >= 0 ? "+" : ""}
            {asset.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Position info */}
      {position && (
        <div className="bg-dark-700 rounded-xl p-3 mb-4 flex justify-between text-sm">
          <div>
            <span className="text-white/40">Holding: </span>
            <span className="font-mono">{position.quantity} shares</span>
          </div>
          <div>
            <span className="text-white/40">P&L: </span>
            <span className={`font-mono ${pnl >= 0 ? "text-profit" : "text-loss"}`}>
              {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Buy/Sell toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("buy")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-colors ${
            mode === "buy"
              ? "bg-profit/20 text-profit border border-profit/40"
              : "bg-dark-700 text-white/40 hover:text-white/60"
          }`}
        >
          <ArrowUpRight size={16} /> Buy
        </button>
        <button
          onClick={() => setMode("sell")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-colors ${
            mode === "sell"
              ? "bg-loss/20 text-loss border border-loss/40"
              : "bg-dark-700 text-white/40 hover:text-white/60"
          }`}
        >
          <ArrowDownRight size={16} /> Sell
        </button>
      </div>

      {/* Quantity input */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-white/40">Quantity</span>
          <button
            onClick={() => setQuantity(String(mode === "buy" ? maxBuy : maxSell))}
            className="text-neon-blue text-xs hover:underline"
          >
            Max: {mode === "buy" ? maxBuy : maxSell}
          </button>
        </div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTrade()}
          placeholder="0"
          min="0"
          className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:border-neon-blue transition-colors"
        />
      </div>

      {/* Total */}
      <div className="flex justify-between text-sm mb-4 px-1">
        <span className="text-white/40">Total cost</span>
        <span className="font-mono">₮{total.toFixed(2)}</span>
      </div>

      {/* Execute button */}
      <button
        onClick={handleTrade}
        disabled={!canExecute}
        className={`w-full py-3 rounded-xl font-bold text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          mode === "buy"
            ? "bg-profit text-dark-900 hover:bg-profit/90"
            : "bg-loss text-white hover:bg-loss/90"
        }`}
      >
        {mode === "buy" ? "Buy" : "Sell"} {asset.symbol}
      </button>
    </div>
  );
}
