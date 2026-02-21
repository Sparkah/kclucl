"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { Rocket, TrendingUp, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { PatronusSprite, PATRONUS_LIST } from "./patronus-sprites";

const steps = [
  {
    icon: Rocket,
    title: "Welcome to 2036",
    subtitle: "The world has changed. Machines do the work. Humans do the thinking.",
    description:
      "In this new era, trading isn't just for Wall Street — it's for everyone. Your job? Learn to spot opportunities, manage risk, and grow your wealth.",
    color: "neon-blue",
  },
  {
    icon: TrendingUp,
    title: "Paper Trading, Real Skills",
    subtitle: "You start with ₮10,000 in credits. No real money at risk.",
    description:
      "Buy and sell futuristic assets — from solar energy grids to quantum security firms. Watch prices move in real-time and learn how markets work.",
    color: "neon-green",
  },
  {
    icon: Trophy,
    title: "Level Up & Earn",
    subtitle: "Every trade earns XP. Hit milestones. Unlock achievements.",
    description:
      "The more you trade, the more you learn. Diversify your portfolio, spot trends, and climb the ranks from Rookie to Market Master.",
    color: "neon-purple",
  },
];

export function Onboarding() {
  const { onboardingStep, advanceOnboarding, completeOnboarding, setName, setPatronus } = useGameStore();
  const [nameInput, setNameInput] = useState("");
  const [phase, setPhase] = useState<"name" | "patronus">("name");
  const [selectedPatronus, setSelectedPatronus] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [onboardingStep]);

  // Reset visibility on step/phase change for transition
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [onboardingStep, phase]);

  if (onboardingStep >= steps.length) {
    // Patronus selection phase
    if (phase === "patronus") {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900">
          <div
            className={`glass-card rounded-2xl p-10 max-w-xl w-full mx-4 text-center transition-all duration-500 ${
              visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Sparkles className="mx-auto mb-4 text-neon-purple" size={48} />
            <h2 className="text-3xl font-bold mb-2">Choose Your Patronus</h2>
            <p className="text-white/50 mb-6">Pick a companion for your trading journey</p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {PATRONUS_LIST.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatronus(p.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedPatronus === p.id
                      ? "border-neon-purple bg-neon-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "border-white/10 bg-dark-700 hover:border-white/30"
                  }`}
                >
                  <PatronusSprite id={p.id} size={40} />
                  <span className="text-xs font-medium">{p.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (selectedPatronus) {
                  setPatronus(selectedPatronus);
                  completeOnboarding();
                }
              }}
              disabled={!selectedPatronus}
              className="w-full bg-neon-purple/20 border border-neon-purple text-neon-purple rounded-xl px-6 py-3 font-semibold hover:bg-neon-purple/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Start Trading
            </button>
          </div>
        </div>
      );
    }

    // Name entry phase
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900">
        <div
          className={`glass-card rounded-2xl p-10 max-w-md w-full mx-4 text-center transition-all duration-500 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Sparkles className="mx-auto mb-4 text-neon-orange" size={48} />
          <h2 className="text-3xl font-bold mb-2">What should we call you?</h2>
          <p className="text-white/50 mb-6">Choose your trader name</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nameInput.trim()) {
                setName(nameInput.trim());
                setPhase("patronus");
              }
            }}
            placeholder="Enter your name..."
            className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:border-neon-blue transition-colors mb-4"
            autoFocus
          />
          <button
            onClick={() => {
              if (nameInput.trim()) {
                setName(nameInput.trim());
                setPhase("patronus");
              }
            }}
            disabled={!nameInput.trim()}
            className="w-full bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-xl px-6 py-3 font-semibold hover:bg-neon-blue/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>
    );
  }

  const step = steps[onboardingStep];
  const Icon = step.icon;
  const colorMap: Record<string, string> = {
    "neon-blue": "text-neon-blue border-neon-blue bg-neon-blue/20",
    "neon-green": "text-neon-green border-neon-green bg-neon-green/20",
    "neon-purple": "text-neon-purple border-neon-purple bg-neon-purple/20",
  };
  const colors = colorMap[step.color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900">
      {/* Progress dots */}
      <div className="absolute top-8 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= onboardingStep ? "bg-neon-blue" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      <div
        className={`glass-card rounded-2xl p-10 max-w-lg w-full mx-4 text-center transition-all duration-400 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className={`inline-flex p-4 rounded-2xl mb-6 ${colors}`}>
          <Icon size={48} />
        </div>

        <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
        <p className={`text-lg mb-4 ${colors.split(" ")[0]}`}>{step.subtitle}</p>
        <p className="text-white/60 mb-8 leading-relaxed">{step.description}</p>

        <button
          onClick={advanceOnboarding}
          className={`inline-flex items-center gap-2 border rounded-xl px-8 py-3 font-semibold hover:opacity-80 transition-opacity ${colors}`}
        >
          {onboardingStep === steps.length - 1 ? "Let's Go" : "Next"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
