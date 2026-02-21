"use client";

import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import { ArrowUpRight, ArrowDownRight, Info, Settings2 } from "lucide-react";

const ORDER_SIZES = [25, 50, 100, 250];

export function TradePanel() {
  const { assets, selectedAssetId, credits, positions, buyAsset, sellAsset } = useGameStore();
  const [orderSize, setOrderSize] = useState(50);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [flashBuy, setFlashBuy] = useState(false);
  const [flashSell, setFlashSell] = useState(false);

  const asset = assets.find((a) => a.id === selectedAssetId);
  const position = positions.find((p) => p.assetId === selectedAssetId);

  if (!asset) {
    return (
      <div className="glass-card rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center text-white/30">
          <Info size={32} className="mx-auto mb-2" />
          <p>Select an asset to start trading</p>
        </div>
      </div>
    );
  }

  const qty = orderSize / asset.price;
  const canBuy = orderSize <= credits;
  const canSell = position ? position.quantity >= qty : false;

  const pnl = position
    ? ((asset.price - position.avgPrice) / position.avgPrice) * 100
    : 0;

  const handleBuy = () => {
    if (!canBuy) return;
    const units = orderSize / asset.price;
    buyAsset(asset.id, Number(units.toFixed(6)));
    setFlashBuy(true);
    setTimeout(() => setFlashBuy(false), 400);
  };

  const handleSell = () => {
    if (!canSell) return;
    const units = orderSize / asset.price;
    sellAsset(asset.id, Number(units.toFixed(6)));
    setFlashSell(true);
    setTimeout(() => setFlashSell(false), 400);
  };

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
            <span className="font-mono">{position.quantity.toFixed(4)} units</span>
          </div>
          <div>
            <span className="text-white/40">P&L: </span>
            <span className={`font-mono ${pnl >= 0 ? "text-profit" : "text-loss"}`}>
              {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Order size selector */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40 uppercase tracking-wider">Market Order</span>
        <button
          onClick={() => setShowSizeSelector(!showSizeSelector)}
          className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          <Settings2 size={14} />
          ₮{orderSize} per trade
        </button>
      </div>

      {showSizeSelector && (
        <div className="flex gap-2 mb-3">
          {ORDER_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => { setOrderSize(size); setShowSizeSelector(false); }}
              className={`flex-1 py-2 rounded-lg text-sm font-mono transition-colors ${
                orderSize === size
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/40"
                  : "bg-dark-700 text-white/50 hover:text-white/70"
              }`}
            >
              ₮{size}
            </button>
          ))}
        </div>
      )}

      {/* BUY / SELL buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleBuy}
          disabled={!canBuy}
          className={`relative py-5 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-profit/15 text-profit border border-profit/30 hover:bg-profit/25 active:scale-95 ${
            flashBuy ? "ring-2 ring-profit" : ""
          }`}
        >
          <ArrowUpRight size={20} className="mx-auto mb-1" />
          BUY
          <div className="text-xs font-normal opacity-60 mt-0.5">Market Order</div>
        </button>
        <button
          onClick={handleSell}
          disabled={!canSell}
          className={`relative py-5 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-loss/15 text-loss border border-loss/30 hover:bg-loss/25 active:scale-95 ${
            flashSell ? "ring-2 ring-loss" : ""
          }`}
        >
          <ArrowDownRight size={20} className="mx-auto mb-1" />
          SELL
          <div className="text-xs font-normal opacity-60 mt-0.5">Market Order</div>
        </button>
      </div>
    </div>
  );
}
