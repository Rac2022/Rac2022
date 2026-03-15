"use client";

import type { VictoryOverlayProps } from "@/types/game";

export default function VictoryOverlay({
  winner,
  onPlayAgain,
  onResetScores,
}: VictoryOverlayProps) {
  const isTeam1 = winner === 1;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Radial glow behind the card */}
      <div
        className={`absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl ${
          isTeam1 ? "bg-blue-500" : "bg-red-500"
        }`}
      />

      <div
        className={`relative text-center p-8 sm:p-10 rounded-3xl shadow-2xl border ${
          isTeam1
            ? "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400/30"
            : "bg-gradient-to-br from-red-600 to-red-800 border-red-400/30"
        } animate-[bounceIn_0.5s_ease-out]`}
      >
        {/* Trophy icon */}
        <div className="text-6xl sm:text-7xl mb-3">
          &#127942;
        </div>

        <p className="text-5xl sm:text-7xl font-extrabold text-white mb-1 drop-shadow-lg">
          {isTeam1 ? "TEAM 1" : "TEAM 2"}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white/80 mb-8">
          WINS THE ROUND!
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-white text-gray-900 font-bold text-lg sm:text-xl
              px-8 py-3 rounded-xl active:scale-95 transition-transform shadow-lg
              hover:bg-gray-100"
          >
            Play Again
          </button>
          <button
            onClick={onResetScores}
            className="bg-white/20 text-white font-bold text-lg sm:text-xl
              px-8 py-3 rounded-xl active:scale-95 transition-transform shadow-lg
              hover:bg-white/30 border border-white/20"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
