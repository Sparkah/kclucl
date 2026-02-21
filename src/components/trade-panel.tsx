"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { ArrowUpRight, ArrowDownRight, Info, Settings2, BrainCircuit, Loader2, Send, ChevronDown, ChevronUp } from "lucide-react";
import { PatronusSprite, PATRONUS_LIST } from "./patronus-sprites";

const ORDER_SIZES = [25, 50, 100, 250];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type TradePanelProps = {
  onAiAnalysisStart?: () => void;
};

export function TradePanel({ onAiAnalysisStart }: TradePanelProps) {
  const { assets, selectedAssetId, credits, positions, buyAsset, sellAsset, patronus, name } = useGameStore();
  const [orderSize, setOrderSize] = useState(50);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [flashBuy, setFlashBuy] = useState(false);
  const [flashSell, setFlashSell] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const asset = assets.find((a) => a.id === selectedAssetId);
  const position = positions.find((p) => p.assetId === selectedAssetId);
  const patronusName = useMemo(
    () => PATRONUS_LIST.find((p) => p.id === patronus)?.name || "Patronus",
    [patronus]
  );

  useEffect(() => {
    if (!asset) return;
    setChatMessages([]);
    setChatInput("");
    setChatOpen(false);
    setAnalysisLoading(false);
  }, [asset?.id]);

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

  const handleAnalyse = async () => {
    if (analysisLoading) return;
    onAiAnalysisStart?.();
    setAnalysisLoading(true);
    setChatOpen(true);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "analysis",
          patronus,
          playerName: name,
          symbol: asset.symbol,
          name: asset.name,
          sector: asset.sector,
          price: asset.price,
          change24h: asset.change24h,
          priceHistory: asset.priceHistory.slice(-10),
          hasPosition: !!position,
          pnl: position ? pnl : null,
        }),
      });
      const data = await res.json();
      const assistantMessage = data.analysis || data.reply || "Analysis unavailable.";
      setChatMessages([{ role: "assistant", content: assistantMessage }]);
    } catch {
      setChatMessages([{ role: "assistant", content: "Failed to get analysis. Check your connection." }]);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSendChat = async (e: FormEvent) => {
    e.preventDefault();
    const prompt = chatInput.trim();
    if (!prompt || analysisLoading) return;

    const outgoingMessages: ChatMessage[] = [...chatMessages, { role: "user", content: prompt }];
    setChatMessages(outgoingMessages);
    setChatInput("");
    setAnalysisLoading(true);
    setChatOpen(true);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          patronus,
          playerName: name,
          messages: outgoingMessages,
          symbol: asset.symbol,
          name: asset.name,
          sector: asset.sector,
          price: asset.price,
          change24h: asset.change24h,
          priceHistory: asset.priceHistory.slice(-10),
          hasPosition: !!position,
          pnl: position ? pnl : null,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.analysis || "No reply.";
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "Chat request failed. Please try again." }]);
    } finally {
      setAnalysisLoading(false);
    }
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
            <span className="font-mono">{position.quantity.toFixed(3)} shares</span>
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

      {/* AI Analyse button */}
      <button
        onClick={handleAnalyse}
        disabled={analysisLoading}
        className="w-full mt-3 py-3 rounded-xl font-semibold text-sm transition-all bg-neon-purple/15 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {analysisLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <BrainCircuit size={16} />
        )}
        {analysisLoading ? "Analysing..." : "AI Analysis"}
      </button>
      <p className="mt-1.5 text-[11px] text-white/35 text-center">
        Tip: Ask short questions like "buy now?" or "explain this move".
      </p>

      {/* Patronus chat */}
      {chatOpen && (
        <div className="mt-3 bg-dark-700 border border-neon-purple/20 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3 text-xs text-neon-purple uppercase tracking-wider">
            <div className="flex items-center gap-2 min-w-0">
              {patronus ? <PatronusSprite id={patronus} size={20} /> : <BrainCircuit size={12} />}
              <span className="truncate">{patronusName} Patronus</span>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="inline-flex items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
              aria-label="Hide patronus chat"
            >
              Hide
              <ChevronUp size={14} />
            </button>
          </div>

          <div className="max-h-52 sm:max-h-56 overflow-y-auto space-y-2 pr-1 min-w-0">
            {chatMessages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  message.role === "assistant"
                    ? "bg-neon-purple/10 text-white/80"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.content}
              </div>
            ))}

            {analysisLoading && (
              <div className="flex items-center gap-2 text-sm text-white/40 py-1">
                <Loader2 size={14} className="animate-spin" />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2 min-w-0">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Ask ${patronusName} anything...`}
              className="flex-1 min-w-0 bg-dark-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-purple/60"
              disabled={analysisLoading}
            />
            <button
              type="submit"
              disabled={analysisLoading || !chatInput.trim()}
              className="shrink-0 h-9 px-3 rounded-lg bg-neon-purple/20 border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {!chatOpen && chatMessages.length > 0 && (
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="w-full mt-3 py-2.5 rounded-xl font-medium text-xs transition-all bg-dark-700 text-white/70 border border-white/10 hover:text-white hover:border-white/20 flex items-center justify-center gap-1.5"
        >
          Reopen {patronusName} Chat
          <ChevronDown size={14} />
        </button>
      )}
    </div>
  );
}
