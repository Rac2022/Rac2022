"use client";

import type { VictoryOverlayProps } from "@/types/game";

export default function VictoryOverlay({
  result,
  onPlayAgain,
  onResetScores,
}: VictoryOverlayProps) {
  const isTie = result === "tie";
  const isTeam1 = result === 1;

  // Derive colors and text based on result
  let glowColor: string;
  let cardGradient: string;
  let borderColor: string;
  let titleText: string;
  let subtitleText: string;
  let icon: string;

  if (isTie) {
    glowColor = "bg-amber-500";
    cardGradient = "bg-gradient-to-br from-amber-600 to-amber-800";
    borderColor = "border-amber-400/30";
    titleText = "IT\u2019S A TIE!";
    subtitleText = "Neither team pulled ahead.";
    icon = "\u{1F91D}"; // handshake
  } else if (isTeam1) {
    glowColor = "bg-blue-500";
    cardGradient = "bg-gradient-to-br from-blue-600 to-blue-800";
    borderColor = "border-blue-400/30";
    titleText = "TEAM 1";
    subtitleText = "WINS THE ROUND!";
    icon = "\u{1F3C6}"; // trophy
  } else {
    glowColor = "bg-red-500";
    cardGradient = "bg-gradient-to-br from-red-600 to-red-800";
    borderColor = "border-red-400/30";
    titleText = "TEAM 2";
    subtitleText = "WINS THE ROUND!";
    icon = "\u{1F3C6}"; // trophy
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Radial glow behind the card */}
      <div
        className={`absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl ${glowColor}`}
      />

      <div
        className={`relative text-center p-8 sm:p-10 rounded-3xl shadow-2xl border ${cardGradient} ${borderColor} animate-[bounceIn_0.5s_ease-out]`}
      >
        {/* Icon */}
        <div className="text-6xl sm:text-7xl mb-3">{icon}</div>

        <p className="text-5xl sm:text-7xl font-extrabold text-white mb-1 drop-shadow-lg">
          {titleText}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white/80 mb-8">
          {subtitleText}
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
