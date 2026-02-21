"use client";

import { useGameStore } from "@/store/game-store";

export function Achievements() {
  const achievements = useGameStore((s) => s.achievements);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
        Achievements
      </h3>
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
  );
}
