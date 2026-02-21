"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { Sparkles } from "lucide-react";
import { PatronusSprite, PATRONUS_LIST } from "./patronus-sprites";

export function Onboarding() {
  const { setName, setPatronus, completeOnboarding } = useGameStore();
  const [nameInput, setNameInput] = useState("");
  const [selectedPatronus, setSelectedPatronus] = useState<string | null>(null);

  const canStart = useMemo(
    () => nameInput.trim().length > 0 && !!selectedPatronus,
    [nameInput, selectedPatronus]
  );

  const handleStart = () => {
    if (!canStart || !selectedPatronus) return;
    setName(nameInput.trim());
    setPatronus(selectedPatronus);
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/95 p-4">
      <div className="glass-card w-full max-w-xl rounded-2xl p-6 sm:p-8">
        <div className="mb-5 text-center">
          <Sparkles className="mx-auto mb-2 text-neon-blue" size={28} />
          <h2 className="text-2xl sm:text-3xl font-bold">Quick Start</h2>
          <p className="mt-1 text-sm text-white/55">Pick a name and patronus. You are in within 5 seconds.</p>
        </div>

        <label className="block text-xs uppercase tracking-wider text-white/45 mb-2">Trader Name</label>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
          placeholder="Enter your name..."
          className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-neon-blue transition-colors mb-5"
          autoFocus
        />

        <div className="text-xs uppercase tracking-wider text-white/45 mb-2">Choose Patronus</div>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {PATRONUS_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatronus(p.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                selectedPatronus === p.id
                  ? "border-neon-purple bg-neon-purple/20 shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                  : "border-white/10 bg-dark-700 hover:border-white/30"
              }`}
            >
              <PatronusSprite id={p.id} size={34} />
              <span className="text-[11px] leading-none text-white/85">{p.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full rounded-xl border border-neon-blue bg-neon-blue/20 px-6 py-3 font-semibold text-neon-blue hover:bg-neon-blue/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Start Trading
        </button>
      </div>
    </div>
  );
}
