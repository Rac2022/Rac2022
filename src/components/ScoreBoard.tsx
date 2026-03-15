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

export default function ScoreBoard({
  score,
  difficulty,
  operatorMode,
  winner,
}: ScoreBoardProps) {
  const statusText = winner
    ? `Team ${winner} Wins!`
    : "Playing";

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
      <div className="flex items-center gap-3 text-gray-400">
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {DIFFICULTY_LABELS[difficulty]}
        </span>
        <span className="hidden sm:inline px-2 py-0.5 rounded bg-gray-800 text-xs font-medium">
          {OPERATOR_LABELS[operatorMode]}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            winner
              ? winner === 1
                ? "bg-blue-600/30 text-blue-300"
                : "bg-red-600/30 text-red-300"
              : "bg-green-600/30 text-green-300"
          }`}
        >
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
