"use client";

import { useGameStore } from "@/store/game-store";
import { useEffect, useState, useCallback } from "react";
import { ChevronRight, Sparkles, MousePointerClick } from "lucide-react";

const TUTORIAL_STEPS = [
  {
    target: "player-stats",
    icon: "👤",
    title: "Your Profile",
    description: "Track your level, XP, and trading stats here. Level up by making smart trades!",
  },
  {
    target: "market-table",
    icon: "📊",
    title: "The Markets",
    description: "These are the markets. Tap any asset to select it for trading.",
  },
  {
    target: "price-chart",
    icon: "📈",
    title: "Price Chart",
    description: "This chart shows the price history of your selected asset. Watch for trends!",
  },
  {
    target: "trade-panel",
    icon: "💰",
    title: "Trade Panel",
    description: "Buy and sell assets here. Try buying your first asset!",
  },
  {
    target: "portfolio",
    icon: "💼",
    title: "Your Portfolio",
    description: "Your portfolio shows your holdings and total value. Track your profits here.",
  },
  {
    target: "achievements",
    icon: "🏆",
    title: "Achievements",
    description: "Complete challenges to unlock badges and earn bonus XP!",
  },
  {
    target: "market-table",
    icon: "👆",
    title: "Now You Try!",
    description: "Select any asset from the market list to get started. Tap one now!",
    isFinal: true,
  },
];

type BoxPosition = {
  top: number;
  left: number;
  placement: "right" | "bottom" | "left";
};

export function DashboardTutorial() {
  const { tutorialStep, tutorialComplete, selectedAssetId, advanceTutorial, completeTutorial } =
    useGameStore();
  const [boxPos, setBoxPos] = useState<BoxPosition | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TUTORIAL_STEPS[tutorialStep] as (typeof TUTORIAL_STEPS)[number] | undefined;
  const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;
  const isFinal = step && "isFinal" in step && step.isFinal;

  // Auto-complete when user selects an asset on the final step
  useEffect(() => {
    if (isFinal && selectedAssetId) {
      completeTutorial();
    }
  }, [isFinal, selectedAssetId, completeTutorial]);

  const updatePosition = useCallback(() => {
    if (tutorialComplete || !step) return;

    const el = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const boxW = 340;
    const boxH = 180;
    const gap = 16;

    // Try right, then left, then bottom
    if (rect.right + gap + boxW < vw) {
      setBoxPos({
        top: rect.top + rect.height / 2 - boxH / 2,
        left: rect.right + gap,
        placement: "right",
      });
    } else if (rect.left - gap - boxW > 0) {
      setBoxPos({
        top: rect.top + rect.height / 2 - boxH / 2,
        left: rect.left - gap - boxW,
        placement: "left",
      });
    } else {
      setBoxPos({
        top: Math.min(rect.bottom + gap, vh - boxH - 16),
        left: Math.max(16, rect.left + rect.width / 2 - boxW / 2),
        placement: "bottom",
      });
    }
  }, [tutorialStep, tutorialComplete, step]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (tutorialComplete || !step) return null;

  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      advanceTutorial();
    }
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Dark backdrop with cutout — on final step, use clipPath so clicks pass through */}
      {isFinal && targetRect ? (
        <>
          {/* Top */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: 0, left: 0, right: 0, height: targetRect.top - 8 }}
          />
          {/* Bottom */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: targetRect.bottom + 8, left: 0, right: 0, bottom: 0 }}
          />
          {/* Left */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: targetRect.top - 8, left: 0, width: targetRect.left - 8, height: targetRect.height + 16 }}
          />
          {/* Right */}
          <div
            className="absolute bg-black/65 pointer-events-auto"
            style={{ top: targetRect.top - 8, left: targetRect.right + 8, right: 0, height: targetRect.height + 16 }}
          />
        </>
      ) : (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          onClick={handleNext}
        >
          <defs>
            <mask id="tutorial-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#tutorial-mask)"
          />
        </svg>
      )}

      {/* Glow ring around target */}
      {targetRect && (
        <div
          className="absolute rounded-xl ring-2 ring-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)] pointer-events-none transition-all duration-300"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Helper message box */}
      {boxPos && (
        <div
          className="absolute z-50 pointer-events-auto transition-all duration-300"
          style={{
            top: boxPos.top,
            left: boxPos.left,
            width: 340,
          }}
        >
          <div className="bg-[#0d1117] border border-[#00f0ff]/30 rounded-xl p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            {/* Step icon + title */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{step.icon}</span>
              <h3 className="text-white font-bold text-lg">{step.title}</h3>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm leading-relaxed mb-4">{step.description}</p>

            {/* Footer: step counter + next button */}
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-xs">
                {tutorialStep + 1} of {TUTORIAL_STEPS.length}
              </span>
              {isFinal ? (
                <span className="flex items-center gap-1.5 text-[#00f0ff] text-sm font-medium animate-pulse">
                  <MousePointerClick size={14} />
                  Tap an asset
                </span>
              ) : isLast ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-semibold text-sm rounded-lg transition-colors"
                >
                  <Sparkles size={14} />
                  Start Trading
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-semibold text-sm rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
