"use client";

import Confetti from "./Confetti";
import RewardSummary from "./RewardSummary";
import type { VictoryOverlayProps } from "@/types/game";

export default function VictoryOverlay({
  result,
  onPlayAgain,
  onResetScores,
  theme,
  rewards,
}: VictoryOverlayProps) {
  const isTie = result === "tie";
  const isTeam1 = result === 1;

  let glowColor: string;
  let cardGradient: string;
  let borderColor: string;
  let titleText: string;
  let subtitleText: string;
  let icon: string;
  let teamIcon: string;
  let confettiColor: string | undefined;

  if (isTie) {
    glowColor = theme.tieGlow;
    cardGradient = theme.tieGradient;
    borderColor = theme.tieBorder;
    titleText = theme.tieTitle;
    subtitleText = theme.tieSubtitle;
    icon = theme.tieIcon;
    teamIcon = "";
    confettiColor = undefined;
  } else if (isTeam1) {
    glowColor = theme.team1.victoryGlow;
    cardGradient = theme.team1.victoryGradient;
    borderColor = theme.team1.victoryBorder;
    titleText = theme.team1WinLabel;
    subtitleText = theme.winSubtitle;
    icon = theme.winIcon;
    teamIcon = theme.team1Icon;
    confettiColor = theme.team1.knotRgb;
  } else {
    glowColor = theme.team2.victoryGlow;
    cardGradient = theme.team2.victoryGradient;
    borderColor = theme.team2.victoryBorder;
    titleText = theme.team2WinLabel;
    subtitleText = theme.winSubtitle;
    icon = theme.winIcon;
    teamIcon = theme.team2Icon;
    confettiColor = theme.team2.knotRgb;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Celebration effect */}
      <Confetti type={isTie ? "tie" : "win"} teamColor={confettiColor} />

      <div
        className={`absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl ${glowColor}`}
      />

      <div
        className={`relative text-center p-8 sm:p-10 rounded-3xl shadow-2xl border ${cardGradient} ${borderColor} animate-[bounceIn_0.5s_ease-out] z-10`}
      >
        <div className="text-6xl sm:text-7xl mb-3">
          {teamIcon && <span className="mr-2">{teamIcon}</span>}
          {icon}
        </div>

        <p className="text-5xl sm:text-7xl font-extrabold text-white mb-1 drop-shadow-lg">
          {titleText}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-white/80 mb-8">
          {subtitleText}
        </p>

        {rewards && <RewardSummary rewards={rewards} />}

        <div className="flex gap-4 justify-center mt-6">
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
