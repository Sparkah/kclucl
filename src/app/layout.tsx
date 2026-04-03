import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeQuest 2036 — Learn to Trade in the Age of Automation",
  description: "It's 2036. AI companies own everything. All you can do is trade their stocks. TradeQuest is a gamified paper-trading simulator that teaches Gen Z market fundamentals through XP, levels, achievements, and an AI patronus companion — no real money, no risk, just skill.",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "TradeQuest 2036",
    description: "AI owns the world. Learn to trade what's left. Gamified paper-trading with XP, levels, and your own AI patronus.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
