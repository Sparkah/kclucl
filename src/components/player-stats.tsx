"use client";

import { useGameStore } from "@/store/game-store";
import { Star, Flame, Award } from "lucide-react";
import { PatronusSprite } from "./patronus-sprites";

const LEVEL_TITLES = [
  "", "Rookie", "Apprentice", "Analyst", "Trader", "Strategist",
  "Expert", "Master", "Legend", "Oracle", "Titan",
];

export function PlayerStats() {
  const { name, level, xp, xpToNext, totalTrades, achievements, streak, patronus } = useGameStore();
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
  const xpPct = (xp / xpToNext) * 100;
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Player header */}
      <div className="flex items-center gap-3 mb-4">
        {patronus ? (
          <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
            <PatronusSprite id={patronus} size={32} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-lg font-bold">
            {name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div>
          <div className="font-semibold">{name || "Trader"}</div>
          <div className="text-xs text-neon-blue">{title} — Level {level}</div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/40">XP</span>
          <span className="text-white/40">{xp}/{xpToNext}</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-dark-700 rounded-xl p-2.5">
          <Star size={14} className="mx-auto mb-1 text-neon-orange" />
          <div className="font-mono text-sm font-semibold">{totalTrades}</div>
          <div className="text-[10px] text-white/30">Trades</div>
        </div>
        <div className="bg-dark-700 rounded-xl p-2.5">
          <Flame size={14} className="mx-auto mb-1 text-neon-pink" />
          <div className="font-mono text-sm font-semibold">{streak}</div>
          <div className="text-[10px] text-white/30">Streak</div>
        </div>
        <div className="bg-dark-700 rounded-xl p-2.5">
          <Award size={14} className="mx-auto mb-1 text-neon-green" />
          <div className="font-mono text-sm font-semibold">{unlockedCount}/{achievements.length}</div>
          <div className="text-[10px] text-white/30">Badges</div>
        </div>
      </div>
    </div>
  );
}
