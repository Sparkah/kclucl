"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { Onboarding } from "@/components/onboarding";
import { MarketTable } from "@/components/market-table";
import { TradePanel } from "@/components/trade-panel";
import { Portfolio } from "@/components/portfolio";
import { PlayerStats } from "@/components/player-stats";
import { PriceChart } from "@/components/price-chart";
import { X } from "lucide-react";

export default function Home() {
  const {
    onboardingComplete,
    tutorialComplete,
    completeTutorial,
    selectedAssetId,
    tickPrices,
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(tickPrices, 2000);
    return () => clearInterval(interval);
  }, [tickPrices]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  const showGuide = !tutorialComplete;
  const atStepTwo = !!selectedAssetId;

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        {showGuide && (
          <div className="mb-4 glass-card rounded-xl border border-neon-blue/25 px-4 py-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-neon-blue mb-1">Quick Tutorial</div>
              {!atStepTwo ? (
                <p className="text-sm text-white/75">Step 1/2: Select an asset from the Markets list.</p>
              ) : (
                <p className="text-sm text-white/75">Step 2/2: Tap <span className="text-neon-purple">AI Analysis</span> in the trade panel.</p>
              )}
            </div>
            <button
              onClick={completeTutorial}
              className="text-white/40 hover:text-white/70 transition-colors"
              aria-label="Dismiss tutorial"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-3">
            <div>
              <PlayerStats />
            </div>
            <div>
              <MarketTable />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div>
              <PriceChart />
            </div>
            <div>
              <TradePanel onAiAnalysisStart={atStepTwo && showGuide ? completeTutorial : undefined} />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div>
              <Portfolio />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
