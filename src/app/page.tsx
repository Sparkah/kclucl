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

export default function Home() {
  const { onboardingComplete, tutorialComplete, tickPrices } = useGameStore();

  useEffect(() => {
    const interval = setInterval(tickPrices, 2000);
    return () => clearInterval(interval);
  }, [tickPrices]);

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-3">
            <div data-tutorial="player-stats">
              <PlayerStats />
            </div>
            <div data-tutorial="market-table">
              <MarketTable />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div data-tutorial="price-chart">
              <PriceChart />
            </div>
            <div data-tutorial="trade-panel">
              <TradePanel />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div data-tutorial="portfolio">
              <Portfolio />
            </div>
          </div>
        </div>

        {!tutorialComplete && <DashboardTutorial />}
      </div>
    </div>
  );
}
