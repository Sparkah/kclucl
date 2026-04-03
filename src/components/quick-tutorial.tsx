"use client";

import { useCallback, useEffect, useState } from "react";
import { MousePointerClick, X } from "lucide-react";

type QuickTutorialProps = {
  step: 1 | 2;
  onDismiss: () => void;
};

export function QuickTutorial({ step, onDismiss }: QuickTutorialProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const targetId = step === 1 ? "market-table" : "ai-analysis-btn";
  const title = step === 1 ? "Step 1/2" : "Step 2/2";
  const description =
    step === 1
      ? "Select any asset in Markets."
      : "Tap AI Analysis to get patronus guidance.";

  const updatePosition = useCallback(() => {
    const el = document.querySelector(`[data-tutorial="${targetId}"]`);
    if (!el) {
      setTargetRect(null);
      return;
    }
    setTargetRect(el.getBoundingClientRect());
  }, [targetId]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  if (!targetRect) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div
        className="absolute bg-black/65 pointer-events-auto"
        style={{ top: 0, left: 0, right: 0, height: targetRect.top - 8 }}
      />
      <div
        className="absolute bg-black/65 pointer-events-auto"
        style={{ top: targetRect.bottom + 8, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="absolute bg-black/65 pointer-events-auto"
        style={{ top: targetRect.top - 8, left: 0, width: targetRect.left - 8, height: targetRect.height + 16 }}
      />
      <div
        className="absolute bg-black/65 pointer-events-auto"
        style={{ top: targetRect.top - 8, left: targetRect.right + 8, right: 0, height: targetRect.height + 16 }}
      />

      <div
        className="absolute rounded-xl ring-2 ring-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)] pointer-events-none transition-all duration-300"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
      />

      <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-50 pointer-events-auto w-[min(94vw,440px)]">
        <div className="bg-[#0d1117] border border-[#00f0ff]/30 rounded-xl px-4 py-3 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#00f0ff] mb-1">{title}</div>
              <div className="text-sm text-white/85">{description}</div>
            </div>
            <button
              onClick={onDismiss}
              className="text-white/40 hover:text-white/70 transition-colors"
              aria-label="Dismiss tutorial"
            >
              <X size={14} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#00f0ff]">
            <MousePointerClick size={12} />
            {step === 1 ? "Tap an asset to continue" : "Tap AI Analysis to finish"}
          </div>
        </div>
      </div>
    </div>
  );
}
