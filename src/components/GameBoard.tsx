"use client";

import { useState, useCallback, useEffect } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import { generateQuestion, type MathQuestion } from "@/utils/generateQuestion";

const WIN_ZONE = 5; // steps to win from center

export default function GameBoard() {
  const [position, setPosition] = useState(0); // negative = Team1 leading, positive = Team2 leading
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [questions, setQuestions] = useState<{ team1: MathQuestion; team2: MathQuestion }>({
    team1: generateQuestion(),
    team2: generateQuestion(),
  });
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [showWinBanner, setShowWinBanner] = useState(false);

  // Check win condition whenever position changes
  useEffect(() => {
    if (position <= -WIN_ZONE && !winner) {
      setWinner(1);
      setShowWinBanner(true);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position >= WIN_ZONE && !winner) {
      setWinner(2);
      setShowWinBanner(true);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    }
  }, [position, winner]);

  const handleTeam1Correct = useCallback(() => {
    setPosition((prev) => prev - 1);
    setQuestions((prev) => ({ ...prev, team1: generateQuestion() }));
  }, []);

  const handleTeam2Correct = useCallback(() => {
    setPosition((prev) => prev + 1);
    setQuestions((prev) => ({ ...prev, team2: generateQuestion() }));
  }, []);

  const resetRound = useCallback(() => {
    setPosition(0);
    setWinner(null);
    setShowWinBanner(false);
    setQuestions({ team1: generateQuestion(), team2: generateQuestion() });
  }, []);

  const resetAll = useCallback(() => {
    resetRound();
    setScore({ team1: 0, team2: 0 });
  }, [resetRound]);

  return (
    <div className="h-dvh w-full flex flex-col bg-gray-900 overflow-hidden select-none">
      {/* Main game area */}
      <div className="flex-1 flex flex-row min-h-0">
        {/* Team 1 (left) */}
        <div className="flex-1 min-w-0">
          <TeamPanel
            team={1}
            question={questions.team1}
            onCorrectAnswer={handleTeam1Correct}
            disabled={winner !== null}
            score={score.team1}
          />
        </div>

        {/* Tug arena (center) */}
        <div className="w-20 sm:w-28 md:w-36 shrink-0">
          <TugArena position={position} winZone={WIN_ZONE} />
        </div>

        {/* Team 2 (right) */}
        <div className="flex-1 min-w-0">
          <TeamPanel
            team={2}
            question={questions.team2}
            onCorrectAnswer={handleTeam2Correct}
            disabled={winner !== null}
            score={score.team2}
          />
        </div>
      </div>

      {/* Bottom bar with reset */}
      <div className="bg-gray-800 py-2 px-4 flex items-center justify-center gap-4">
        <button
          onClick={resetRound}
          className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-sm sm:text-base
            px-5 py-2 rounded-lg active:scale-95 transition-transform shadow-md"
        >
          New Round
        </button>
        <button
          onClick={resetAll}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold text-sm sm:text-base
            px-5 py-2 rounded-lg active:scale-95 transition-transform shadow-md"
        >
          Reset All
        </button>
      </div>

      {/* Win overlay */}
      {showWinBanner && winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={`text-center p-8 rounded-3xl shadow-2xl ${
              winner === 1
                ? "bg-blue-600"
                : "bg-red-600"
            } animate-[bounceIn_0.5s_ease-out]`}
          >
            <p className="text-5xl sm:text-7xl font-extrabold text-white mb-2">
              {winner === 1 ? "TEAM 1" : "TEAM 2"}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white/90 mb-6">
              WINS THE ROUND!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetRound}
                className="bg-white text-gray-900 font-bold text-lg sm:text-xl
                  px-8 py-3 rounded-xl active:scale-95 transition-transform shadow-lg"
              >
                Play Again
              </button>
              <button
                onClick={resetAll}
                className="bg-white/20 text-white font-bold text-lg sm:text-xl
                  px-8 py-3 rounded-xl active:scale-95 transition-transform shadow-lg"
              >
                Reset Scores
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
