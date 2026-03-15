"use client";

import type { ScoreBoardProps } from "@/types/game";

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  mixed: "Mixed",
};

const OPERATOR_LABELS: Record<string, string> = {
  mixed: "All Ops",
  "+": "Addition",
  "-": "Subtraction",
  "\u00d7": "Multiplication",
  "\u00f7": "Division",
};

const MODE_LABELS: Record<string, string> = {
  classic: "Classic",
  "rush-30": "30s Rush",
  "rush-60": "60s Rush",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ScoreBoard({
  score,
  presetLabel,
  difficulty,
  operatorMode,
  gameMode,
  roundResult,
  timeLeft,
  theme,
}: ScoreBoardProps) {
  const t1 = theme.team1;
  const t2 = theme.team2;

  let statusText: string;
  let statusClass: string;

  if (roundResult === "tie") {
    statusText = "It\u2019s a Tie!";
    statusClass = "bg-amber-600/30 text-amber-300";
  } else if (roundResult === 1) {
    statusText = `${t1.label} Wins!`;
    statusClass = `${t1.statusBg} ${t1.statusText}`;
  } else if (roundResult === 2) {
    statusText = `${t2.label} Wins!`;
    statusClass = `${t2.statusBg} ${t2.statusText}`;
  } else {
    statusText = "Playing";
    statusClass = "bg-green-600/30 text-green-300";
  }

  const isRush = gameMode !== "classic";
  const timerUrgent = timeLeft !== null && timeLeft <= 5;

  return (
    <div className={`${theme.scoreboardBg} backdrop-blur-sm px-4 py-1.5 flex items-center justify-between gap-4 text-sm border-b border-gray-700/50`}>
      {/* Team 1 score */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${t1.dot}`} />
        <span className={`${t1.scoreLabel} font-bold`}>{t1.label}</span>
        <span className="text-white font-extrabold text-lg tabular-nums">
          {score.team1}
        </span>
      </div>

      {/* Center info cluster */}
      <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
        <span className="px-2 py-0.5 rounded bg-amber-700/30 text-amber-300 text-xs font-bold">
          {presetLabel}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {MODE_LABELS[gameMode]}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {OPERATOR_LABELS[operatorMode]}
        </span>

        {isRush && timeLeft !== null && (
          <span
            className={`px-2.5 py-0.5 rounded font-bold tabular-nums text-sm ${
              timerUrgent
                ? "bg-red-600/40 text-red-200 animate-pulse"
                : "bg-gray-700 text-white"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        )}

        {isRush && timeLeft === 0 && roundResult !== null && (
          <span className="px-2 py-0.5 rounded bg-red-700/40 text-red-300 text-xs font-bold">
            Time Up
          </span>
        )}

        <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusClass}`}>
          {statusText}
        </span>
      </div>

      {/* Team 2 score */}
      <div className="flex items-center gap-2">
        <span className="text-white font-extrabold text-lg tabular-nums">
          {score.team2}
        </span>
        <span className={`${t2.scoreLabel} font-bold`}>{t2.label}</span>
        <div className={`w-3 h-3 rounded-full ${t2.dot}`} />
      </div>
    </div>
  );
}
