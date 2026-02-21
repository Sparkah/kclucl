import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeQuest 2036 — Learn to Trade in the Age of Automation",
  description: "A gamified trading simulator for the next generation. Master markets, earn XP, level up.",
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
