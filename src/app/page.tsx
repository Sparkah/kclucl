"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { Onboarding } from "@/components/onboarding";
import { MarketTable } from "@/components/market-table";
import { TradePanel } from "@/components/trade-panel";
import { Portfolio } from "@/components/portfolio";
import { PlayerStats } from "@/components/player-stats";
import { PriceChart } from "@/components/price-chart";
import { DashboardTutorial } from "@/components/dashboard-tutorial";
import { Zap } from "lucide-react";

export default function Home() {
  const { onboardingComplete, tutorialComplete, tickPrices } = useGameStore();

  // Tick prices every 2 seconds
  useEffect(() => {
    const interval = setInterval(tickPrices, 2000);
    return () => clearInterval(interval);
  }, [tickPrices]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-dark-900 p-4 lg:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="text-neon-blue" size={24} />
          <h1 className="text-xl font-bold">
            Trade<span className="text-neon-blue">Quest</span>{" "}
            <span className="text-white/30 text-sm font-normal">2036</span>
          </h1>
        </div>
        <div className="text-xs text-white/30 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          Markets Live
        </div>
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left sidebar — Markets */}
        <div className="lg:col-span-3 space-y-4">
          <div data-tutorial="player-stats">
            <PlayerStats />
          </div>
          <div data-tutorial="market-table">
            <MarketTable />
          </div>
        </div>

        {/* Center — Chart & Trading */}
        <div className="lg:col-span-5 space-y-4">
          <div data-tutorial="price-chart">
            <PriceChart />
          </div>
          <div data-tutorial="trade-panel">
            <TradePanel />
          </div>
        </div>

        {/* Right sidebar — Portfolio & Achievements */}
        <div className="lg:col-span-4 space-y-4">
          <div data-tutorial="portfolio">
            <Portfolio />
          </div>
        </div>
      </div>

      {/* Tutorial overlay */}
      {!tutorialComplete && <DashboardTutorial />}
    </div>
  );
}
