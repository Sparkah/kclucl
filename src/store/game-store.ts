import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Asset = {
  id: string;
  name: string;
  symbol: string;
  emoji: string;
  price: number;
  priceHistory: number[];
  change24h: number;
  sector: string;
};

export type Position = {
  assetId: string;
  quantity: number;
  avgPrice: number;
  openedAt: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: number;
};

const DUST_THRESHOLD = 0.001;

type GameState = {
  // Player
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  credits: number;
  startingCredits: number;

  // Portfolio
  positions: Position[];
  tradeHistory: { assetId: string; type: "buy" | "sell"; quantity: number; price: number; time: number }[];

  // Market
  assets: Asset[];
  selectedAssetId: string | null;

  // Gamification
  achievements: Achievement[];
  streak: number;
  totalTrades: number;

  // Patronus
  patronus: string | null;

  // Onboarding
  onboardingStep: number;
  onboardingComplete: boolean;

  // Tutorial
  tutorialStep: number;
  tutorialComplete: boolean;

  // Actions
  setName: (name: string) => void;
  setPatronus: (id: string) => void;
  completeOnboarding: () => void;
  advanceOnboarding: () => void;
  advanceTutorial: () => void;
  completeTutorial: () => void;
  selectAsset: (id: string) => void;
  buyAsset: (assetId: string, quantity: number) => void;
  sellAsset: (assetId: string, quantity: number) => void;
  tickPrices: () => void;
  addXp: (amount: number) => void;
  unlockAchievement: (id: string) => void;
};

const INITIAL_ASSETS: Asset[] = [
  { id: "sol-energy", name: "SolarGrid Corp", symbol: "SOLG", emoji: "☀️", price: 142.5, priceHistory: [], change24h: 2.3, sector: "Energy" },
  { id: "neuralink-ai", name: "NeuraAI Systems", symbol: "NRAI", emoji: "🧠", price: 891.2, priceHistory: [], change24h: -1.2, sector: "AI" },
  { id: "aqua-farm", name: "AquaFarm Global", symbol: "AQUA", emoji: "🌊", price: 67.8, priceHistory: [], change24h: 5.1, sector: "Food" },
  { id: "orbit-log", name: "Orbit Logistics", symbol: "ORBT", emoji: "🚀", price: 234.0, priceHistory: [], change24h: 0.8, sector: "Space" },
  { id: "med-nano", name: "MedNano Health", symbol: "MNHL", emoji: "💊", price: 456.3, priceHistory: [], change24h: -0.5, sector: "Health" },
  { id: "robo-build", name: "RoboBuild Inc", symbol: "ROBO", emoji: "🤖", price: 178.9, priceHistory: [], change24h: 3.7, sector: "Robotics" },
  { id: "quantum-sec", name: "QuantumShield", symbol: "QSHD", emoji: "🔐", price: 312.4, priceHistory: [], change24h: 1.9, sector: "Security" },
  { id: "green-mat", name: "GreenMatter Labs", symbol: "GRML", emoji: "🧬", price: 89.6, priceHistory: [], change24h: -2.8, sector: "BioTech" },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "first-trade", title: "First Steps", description: "Complete your first trade", emoji: "👶" },
  { id: "profit-10", title: "Making Moves", description: "Earn 10% profit on a trade", emoji: "📈" },
  { id: "diversify", title: "Diversified", description: "Hold 3 different assets", emoji: "🎯" },
  { id: "ten-trades", title: "Active Trader", description: "Complete 10 trades", emoji: "⚡" },
  { id: "double-up", title: "Double Up", description: "Double your starting credits", emoji: "🏆" },
  { id: "loss-lesson", title: "Learning Experience", description: "Sell at a loss (it happens!)", emoji: "📚" },
];

function initAssetHistories(assets: Asset[]) {
  assets.forEach((asset) => {
    if (asset.priceHistory.length > 0) return;
    const history: number[] = [];
    let p = asset.price * 0.9;
    for (let i = 0; i < 30; i++) {
      p += (Math.random() - 0.48) * p * 0.03;
      history.push(Number(p.toFixed(2)));
    }
    history.push(asset.price);
    asset.priceHistory = history;
  });
}

// Initialize price histories
initAssetHistories(INITIAL_ASSETS);

const STARTING_CREDITS = 10000;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      name: "",
      level: 1,
      xp: 0,
      xpToNext: 100,
      credits: STARTING_CREDITS,
      startingCredits: STARTING_CREDITS,
      positions: [],
      tradeHistory: [],
      assets: INITIAL_ASSETS,
      selectedAssetId: null,
      achievements: ACHIEVEMENTS,
      streak: 0,
      totalTrades: 0,
      patronus: null,
      onboardingStep: 0,
      onboardingComplete: false,
      tutorialStep: 0,
      tutorialComplete: false,

      setName: (name) => set({ name }),

      setPatronus: (id) => set({ patronus: id }),

      completeOnboarding: () => set({ onboardingComplete: true }),

      advanceOnboarding: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),

      advanceTutorial: () => set((s) => ({ tutorialStep: s.tutorialStep + 1 })),
      completeTutorial: () => set({ tutorialComplete: true }),

      selectAsset: (id) => set({ selectedAssetId: id }),

      buyAsset: (assetId, quantity) => {
        const state = get();
        const asset = state.assets.find((a) => a.id === assetId);
        if (!asset) return;

        const cost = asset.price * quantity;
        if (cost > state.credits) return;

        const existing = state.positions.find((p) => p.assetId === assetId);
        let newPositions: Position[];

        if (existing) {
          const totalQty = existing.quantity + quantity;
          const newAvg = (existing.avgPrice * existing.quantity + asset.price * quantity) / totalQty;
          newPositions = state.positions.map((p) =>
            p.assetId === assetId ? { ...p, quantity: totalQty, avgPrice: newAvg } : p
          );
        } else {
          newPositions = [...state.positions, { assetId, quantity, avgPrice: asset.price, openedAt: Date.now() }];
        }

        const newTrades = state.totalTrades + 1;

        set({
          credits: state.credits - cost,
          positions: newPositions,
          tradeHistory: [...state.tradeHistory, { assetId, type: "buy", quantity, price: asset.price, time: Date.now() }],
          totalTrades: newTrades,
        });

        // Achievement checks
        if (state.totalTrades === 0) get().unlockAchievement("first-trade");
        if (newTrades >= 10) get().unlockAchievement("ten-trades");
        if (newPositions.filter((p) => p.quantity > DUST_THRESHOLD).length >= 3) get().unlockAchievement("diversify");

        get().addXp(15);
      },

      sellAsset: (assetId, quantity) => {
        const state = get();
        const asset = state.assets.find((a) => a.id === assetId);
        const position = state.positions.find((p) => p.assetId === assetId);
        if (!asset || !position || quantity > position.quantity) return;

        const revenue = asset.price * quantity;
        const profitPct = ((asset.price - position.avgPrice) / position.avgPrice) * 100;

        const newPositions = state.positions
          .map((p) => (p.assetId === assetId ? { ...p, quantity: p.quantity - quantity } : p))
          .filter((p) => p.quantity > DUST_THRESHOLD);

        // Streak: profitable sell increments, loss resets
        const newStreak = profitPct > 0 ? state.streak + 1 : 0;

        set({
          credits: state.credits + revenue,
          positions: newPositions,
          tradeHistory: [...state.tradeHistory, { assetId, type: "sell", quantity, price: asset.price, time: Date.now() }],
          totalTrades: state.totalTrades + 1,
          streak: newStreak,
        });

        // Achievement checks
        if (profitPct >= 10) get().unlockAchievement("profit-10");
        if (profitPct < 0) get().unlockAchievement("loss-lesson");
        if (state.credits + revenue >= state.startingCredits * 2) get().unlockAchievement("double-up");

        get().addXp(profitPct > 0 ? 25 : 10);
      },

      tickPrices: () => {
        set((state) => ({
          assets: state.assets.map((asset) => {
            const volatility = 0.008 + Math.random() * 0.012;
            const trend = asset.change24h > 0 ? 0.001 : -0.001;
            const change = (Math.random() - 0.49 + trend) * volatility;
            const newPrice = Number((asset.price * (1 + change)).toFixed(2));
            const newHistory = [...asset.priceHistory.slice(-30), newPrice];
            const oldPrice = newHistory[0];
            const change24h = Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(2));
            return { ...asset, price: newPrice, priceHistory: newHistory, change24h };
          }),
        }));
      },

      addXp: (amount) => {
        set((state) => {
          let newXp = state.xp + amount;
          let newLevel = state.level;
          let newXpToNext = state.xpToNext;

          while (newXp >= newXpToNext) {
            newXp -= newXpToNext;
            newLevel++;
            newXpToNext = Math.floor(newXpToNext * 1.5);
          }

          return { xp: newXp, level: newLevel, xpToNext: newXpToNext };
        });
      },

      unlockAchievement: (id) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
          ),
        }));
      },
    }),
    {
      name: "tradequest-2036",
      partialize: (state) => ({
        name: state.name,
        patronus: state.patronus,
        level: state.level,
        xp: state.xp,
        xpToNext: state.xpToNext,
        credits: state.credits,
        startingCredits: state.startingCredits,
        positions: state.positions,
        tradeHistory: state.tradeHistory,
        achievements: state.achievements,
        streak: state.streak,
        totalTrades: state.totalTrades,
        onboardingStep: state.onboardingStep,
        onboardingComplete: state.onboardingComplete,
        tutorialStep: state.tutorialStep,
        tutorialComplete: state.tutorialComplete,
      }),
    }
  )
);
