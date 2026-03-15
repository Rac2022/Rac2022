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
  difficulty,
  operatorMode,
  gameMode,
  roundResult,
  timeLeft,
}: ScoreBoardProps) {
  // Status text
  let statusText: string;
  let statusClass: string;

  if (roundResult === "tie") {
    statusText = "It\u2019s a Tie!";
    statusClass = "bg-amber-600/30 text-amber-300";
  } else if (roundResult === 1) {
    statusText = "Team 1 Wins!";
    statusClass = "bg-blue-600/30 text-blue-300";
  } else if (roundResult === 2) {
    statusText = "Team 2 Wins!";
    statusClass = "bg-red-600/30 text-red-300";
  } else {
    statusText = "Playing";
    statusClass = "bg-green-600/30 text-green-300";
  }

  // Timer display
  const isRush = gameMode !== "classic";
  const timerUrgent = timeLeft !== null && timeLeft <= 5;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-1.5 flex items-center justify-between gap-4 text-sm border-b border-gray-700/50">
      {/* Team 1 score */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-blue-300 font-bold">T1</span>
        <span className="text-white font-extrabold text-lg tabular-nums">
          {score.team1}
        </span>
      </div>

      {/* Center info cluster */}
      <div className="flex items-center gap-2 sm:gap-3 text-gray-400">
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {MODE_LABELS[gameMode]}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {OPERATOR_LABELS[operatorMode]}
        </span>

        {/* Timer pill — only shown in rush modes */}
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

        {/* Time-up badge (timer expired but still showing overlay) */}
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
        <span className="text-red-300 font-bold">T2</span>
        <div className="w-3 h-3 rounded-full bg-red-500" />
      </div>
    </div>
  );
}
