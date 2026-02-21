"use client";

import React from "react";

type PatronusSpriteProps = {
  id: string;
  size?: number;
};

export const PATRONUS_LIST = [
  { id: "batman", name: "Batman" },
  { id: "nyan-cat", name: "Nyan Cat" },
  { id: "doge", name: "Doge" },
  { id: "flappy-bird", name: "Flappy Bird" },
  { id: "pepe", name: "Pepe" },
  { id: "capybara", name: "Capybara" },
  { id: "chad", name: "Chad" },
] as const;

export function PatronusSprite({ id, size = 48 }: PatronusSpriteProps) {
  const sprites: Record<string, React.ReactNode> = {
    batman: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Bat silhouette */}
        <path
          d="M24 8 C20 8 12 14 4 22 C8 20 12 20 14 22 C14 26 16 30 20 32 L20 38 L18 42 L22 40 L24 44 L26 40 L30 42 L28 38 L28 32 C32 30 34 26 34 22 C36 20 40 20 44 22 C36 14 28 8 24 8Z"
          fill="#a855f7"
        />
        <circle cx="20" cy="20" r="2" fill="#e0e7ff" />
        <circle cx="28" cy="20" r="2" fill="#e0e7ff" />
      </svg>
    ),
    "nyan-cat": (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Rainbow trail */}
        <rect x="2" y="10" width="20" height="3" rx="1" fill="#ff0000" />
        <rect x="2" y="14" width="20" height="3" rx="1" fill="#ff8800" />
        <rect x="2" y="18" width="20" height="3" rx="1" fill="#ffff00" />
        <rect x="2" y="22" width="20" height="3" rx="1" fill="#00ff88" />
        <rect x="2" y="26" width="20" height="3" rx="1" fill="#00ccff" />
        <rect x="2" y="30" width="20" height="3" rx="1" fill="#cc66ff" />
        {/* Body (pop-tart) */}
        <rect x="18" y="10" width="24" height="26" rx="4" fill="#f472b6" />
        <rect x="22" y="14" width="16" height="18" rx="2" fill="#fbbf24" />
        {/* Sprinkles */}
        <circle cx="26" cy="18" r="1" fill="#f43f5e" />
        <circle cx="32" cy="22" r="1" fill="#06b6d4" />
        <circle cx="28" cy="26" r="1" fill="#a855f7" />
        <circle cx="34" cy="18" r="1" fill="#22c55e" />
        {/* Face */}
        <circle cx="28" cy="38" r="1.5" fill="#1e1e2e" />
        <circle cx="34" cy="38" r="1.5" fill="#1e1e2e" />
        <path d="M30 40 Q31 42 32 40" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    doge: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Face */}
        <ellipse cx="24" cy="26" rx="16" ry="18" fill="#fbbf24" />
        {/* Inner face */}
        <ellipse cx="24" cy="30" rx="10" ry="10" fill="#fde68a" />
        {/* Ears */}
        <ellipse cx="12" cy="12" rx="5" ry="8" fill="#f59e0b" transform="rotate(-15 12 12)" />
        <ellipse cx="36" cy="12" rx="5" ry="8" fill="#f59e0b" transform="rotate(15 36 12)" />
        {/* Eyes */}
        <circle cx="18" cy="24" r="3" fill="#1e1e2e" />
        <circle cx="30" cy="24" r="3" fill="#1e1e2e" />
        <circle cx="19" cy="23" r="1" fill="white" />
        <circle cx="31" cy="23" r="1" fill="white" />
        {/* Nose */}
        <ellipse cx="24" cy="30" rx="3" ry="2" fill="#1e1e2e" />
        {/* Mouth */}
        <path d="M21 33 Q24 36 27 33" stroke="#1e1e2e" strokeWidth="1.5" fill="none" />
        {/* Eyebrows (much wow) */}
        <path d="M15 20 L21 19" stroke="#d97706" strokeWidth="1.5" />
        <path d="M27 19 L33 20" stroke="#d97706" strokeWidth="1.5" />
      </svg>
    ),
    "flappy-bird": (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Body */}
        <rect x="12" y="14" width="22" height="18" rx="4" fill="#fbbf24" />
        {/* Wing */}
        <rect x="6" y="18" width="12" height="10" rx="3" fill="#22c55e" />
        <rect x="8" y="20" width="8" height="6" rx="2" fill="#16a34a" />
        {/* Eye (white) */}
        <circle cx="30" cy="20" r="5" fill="white" />
        <circle cx="32" cy="20" r="3" fill="#1e1e2e" />
        <circle cx="33" cy="19" r="1" fill="white" />
        {/* Beak */}
        <rect x="34" y="22" width="10" height="4" rx="1" fill="#f97316" />
        <rect x="34" y="26" width="8" height="3" rx="1" fill="#ea580c" />
        {/* Tail */}
        <rect x="8" y="14" width="6" height="4" rx="1" fill="#ef4444" />
      </svg>
    ),
    pepe: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Head */}
        <ellipse cx="24" cy="24" rx="18" ry="16" fill="#22c55e" />
        {/* Eyes (big bulging) */}
        <ellipse cx="16" cy="18" rx="7" ry="8" fill="white" />
        <ellipse cx="32" cy="18" rx="7" ry="8" fill="white" />
        <circle cx="18" cy="20" r="3" fill="#1e1e2e" />
        <circle cx="34" cy="20" r="3" fill="#1e1e2e" />
        {/* Mouth */}
        <path d="M10 30 Q24 38 38 30" stroke="#15803d" strokeWidth="2" fill="#16a34a" />
        {/* Lips */}
        <path d="M12 30 Q24 36 36 30" stroke="#dc2626" strokeWidth="2" fill="none" />
      </svg>
    ),
    capybara: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Body */}
        <ellipse cx="24" cy="28" rx="18" ry="14" fill="#a16207" />
        {/* Head */}
        <ellipse cx="24" cy="22" rx="14" ry="12" fill="#ca8a04" />
        {/* Ears */}
        <ellipse cx="12" cy="14" rx="4" ry="3" fill="#a16207" />
        <ellipse cx="36" cy="14" rx="4" ry="3" fill="#a16207" />
        {/* Snout */}
        <ellipse cx="24" cy="28" rx="8" ry="5" fill="#d4a054" />
        {/* Nose */}
        <ellipse cx="24" cy="26" rx="3" ry="2" fill="#1e1e2e" />
        {/* Eyes (chill half-closed) */}
        <path d="M17 20 Q19 18 21 20" stroke="#1e1e2e" strokeWidth="2" fill="none" />
        <path d="M27 20 Q29 18 31 20" stroke="#1e1e2e" strokeWidth="2" fill="none" />
        {/* Mouth (content smile) */}
        <path d="M20 30 Q24 33 28 30" stroke="#1e1e2e" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    chad: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        {/* Head shape (strong jaw) */}
        <path
          d="M14 10 L34 10 L38 18 L36 34 L30 42 L18 42 L12 34 L10 18 Z"
          fill="#f59e0b"
        />
        {/* Hair */}
        <path d="M14 10 L34 10 L36 6 L32 8 L28 4 L24 8 L20 4 L16 8 L12 6 Z" fill="#1e1e2e" />
        {/* Jawline shadow */}
        <path d="M12 34 L18 42 L30 42 L36 34" stroke="#d97706" strokeWidth="2" fill="none" />
        {/* Eyes (determined) */}
        <rect x="16" y="18" width="6" height="3" rx="1" fill="#1e1e2e" />
        <rect x="26" y="18" width="6" height="3" rx="1" fill="#1e1e2e" />
        {/* Eyebrows (thick) */}
        <rect x="15" y="15" width="8" height="2" rx="1" fill="#1e1e2e" />
        <rect x="25" y="15" width="8" height="2" rx="1" fill="#1e1e2e" />
        {/* Nose */}
        <path d="M23 22 L24 28 L26 28" stroke="#d97706" strokeWidth="1.5" fill="none" />
        {/* Beard/chin */}
        <rect x="18" y="34" width="12" height="4" rx="2" fill="#78350f" />
        {/* Smirk */}
        <path d="M20 32 Q24 34 28 31" stroke="#1e1e2e" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  };

  return sprites[id] || null;
}
