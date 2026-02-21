"use client";

import { useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Star, Flame, Award, X } from "lucide-react";
import { PatronusSprite } from "./patronus-sprites";

const LEVEL_TITLES = [
  "", "Rookie", "Apprentice", "Analyst", "Trader", "Strategist",
  "Expert", "Master", "Legend", "Oracle", "Titan",
];

export function PlayerStats() {
  const { name, level, xp, xpToNext, totalTrades, achievements, streak, patronus } = useGameStore();
  const [showBadges, setShowBadges] = useState(false);
  const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
  const xpPct = (xp / xpToNext) * 100;
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <>
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
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="bg-dark-700 rounded-xl p-2.5 hover:bg-dark-600 transition-colors"
          >
            <Award size={14} className="mx-auto mb-1 text-neon-green" />
            <div className="font-mono text-sm font-semibold">{unlockedCount}/{achievements.length}</div>
            <div className="text-[10px] text-white/30">Badges</div>
          </button>
        </div>
      </div>

      {/* Achievements panel — toggled by Badges button */}
      {showBadges && (
        <div className="glass-card rounded-2xl p-6 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
              Achievements
            </h3>
            <button onClick={() => setShowBadges(false)} className="text-white/30 hover:text-white/60 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a) => {
              const unlocked = !!a.unlockedAt;
              return (
                <div
                  key={a.id}
                  className={`rounded-xl p-3 transition-colors ${
                    unlocked
                      ? "bg-neon-green/10 border border-neon-green/20"
                      : "bg-dark-700 opacity-40"
                  }`}
                >
                  <div className="text-xl mb-1">{a.emoji}</div>
                  <div className="text-xs font-semibold">{a.title}</div>
                  <div className="text-[10px] text-white/40">{a.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
