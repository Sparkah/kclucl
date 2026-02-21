# TradeQuest 2036

Gamified paper-trading simulator set in 2036. Teaches market fundamentals through XP, levels, achievements, and a cyberpunk UI. Built for a hackathon in ~20h.

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:3000
npm run build        # production check
```

Requires `.env.local` with `ANTHROPIC_API_KEY=sk-ant-...` for the AI analysis feature.

## Stack

- **Next.js 15** (App Router), React 19, TypeScript
- **Tailwind CSS 4** — cyberpunk neon theme (globals.css)
- **Zustand 5** — state + localStorage persistence (`tradequest-2036` key)
- **Lucide React** — icons
- **Claude API** — server-side route for AI market analysis

No blockchain contracts. Entirely client-side game logic.

## File Map

```
src/
├── app/
│   ├── layout.tsx              # Root HTML shell, dark theme
│   ├── page.tsx                # Main entry: Onboarding OR Dashboard
│   ├── globals.css             # Tailwind theme, neon colors, glass-card, flash anims
│   └── api/analyse/route.ts    # POST → Claude API for AI trading commentary
│
├── store/
│   └── game-store.ts           # Zustand store: all game state + actions + persist
│
└── components/
    ├── onboarding.tsx           # 3 intro slides → name input → patronus selection → dashboard
    ├── patronus-sprites.tsx     # 7 inline SVG mascots (batman, nyan-cat, doge, flappy-bird, pepe, capybara, chad)
    ├── dashboard-tutorial.tsx   # 6-step interactive overlay highlighting each UI section
    ├── player-stats.tsx         # Avatar, name, level, XP bar, trades/streak/badges stats
    ├── market-table.tsx         # 8 assets list with sparklines + 24h change, click to select
    ├── price-chart.tsx          # SVG area chart, 31-candle history for selected asset
    ├── trade-panel.tsx          # BUY/SELL buttons, quantity presets, AI analysis trigger
    ├── portfolio.tsx            # Total value, P&L, cash, holdings breakdown, liquidate
    └── achievements.tsx         # 6 achievement cards (shown via Badges button in player-stats)
```

## Dashboard Layout (lg)

```
┌──────────┬──────────────┬──────────┐
│ col-3    │ col-5        │ col-4    │
│          │              │          │
│ Player   │ Price Chart  │ Portfolio│
│ Stats    │              │          │
│          │ Trade Panel  │          │
│ Market   │              │          │
│ Table    │              │          │
└──────────┴──────────────┴──────────┘
```

Achievements panel is hidden — toggled by clicking "Badges" in PlayerStats.

## Game State (game-store.ts)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Player name, set during onboarding |
| `patronus` | string \| null | Chosen mascot ID, shown as avatar |
| `level` | number | Starts at 1, XP threshold scales 1.5x per level |
| `xp` / `xpToNext` | number | Buy = +15 XP, profitable sell = +25, loss sell = +10 |
| `credits` | number | Starts at 10,000. Currency symbol: ₮ |
| `positions` | Position[] | `{ assetId, quantity, avgPrice, openedAt }` |
| `tradeHistory` | Trade[] | Full buy/sell log with timestamps |
| `assets` | Asset[] | 8 futuristic companies, prices tick every 2s |
| `streak` | number | Consecutive profitable sells (resets on loss) |
| `totalTrades` | number | Lifetime trade count |
| `achievements` | Achievement[] | 6 badges, `unlockedAt` timestamp when earned |
| `onboardingComplete` | boolean | Gates dashboard access |
| `tutorialComplete` | boolean | Gates tutorial overlay |

All persisted to localStorage under key `tradequest-2036`.

## Assets

| Symbol | Name | Sector | Starting Price |
|--------|------|--------|---------------|
| SOLG | SolarGrid Corp | Energy | ₮142.50 |
| NRAI | NeuraAI Systems | AI | ₮891.20 |
| AQUA | AquaFarm Global | Food | ₮67.80 |
| ORBT | Orbit Logistics | Space | ₮234.00 |
| MNHL | MedNano Health | Health | ₮456.30 |
| ROBO | RoboBuild Inc | Robotics | ₮178.90 |
| QSHD | QuantumShield | Security | ₮312.40 |
| GRML | GreenMatter Labs | BioTech | ₮89.60 |

Prices update every 2s with ±0.8–2.0% random walk + trend bias.

## Achievements

| ID | Title | Trigger |
|----|-------|---------|
| first-trade | First Steps | Complete 1 trade |
| profit-10 | Making Moves | 10%+ profit on a sell |
| diversify | Diversified | Hold 3+ different assets |
| ten-trades | Active Trader | 10 total trades |
| double-up | Double Up | Credits reach ₮20,000 |
| loss-lesson | Learning Experience | Sell at a loss |

## User Flow

1. **Onboarding** — 3 slides (Welcome, Paper Trading, Gamification) → Name → Patronus → Dashboard
2. **Tutorial** — 6-step guided overlay (PlayerStats → Markets → Chart → TradePanel → Portfolio → "Try it")
3. **Trading** — Select asset → BUY/SELL → Watch portfolio → Earn XP → Level up
4. **AI Analysis** — Button in TradePanel calls `/api/analyse` → Claude returns market commentary

## Design Tokens

```
neon-green:  #39ff14    neon-blue:   #00f0ff
neon-purple: #b44aff    neon-pink:   #ff2d95
neon-orange: #ff6b2b    dark-900:    #0a0a0f
dark-800:    #12121a    dark-700:    #1a1a2e
```

Glass cards use `backdrop-blur-xl` + `bg-dark-800/80` + `border border-white/5`.

## Dev Notes

- `rm -rf .next` before `npm run dev` if you see unstyled pages — stale cache issue
- Clear `localStorage.removeItem('tradequest-2036')` to reset game state
- Price history initializes with 30 synthetic candles on first load
- Tutorial auto-completes on the final step when user selects any asset
