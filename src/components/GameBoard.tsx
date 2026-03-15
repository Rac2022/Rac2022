"use client";

import { useState, useCallback, useEffect } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import { generateQuestion } from "@/utils/generateQuestion";
import type { TeamId, TeamQuestions, GameScore, Difficulty, OperatorMode, QuestionConfig } from "@/types/game";

const WIN_ZONE = 5; // steps to win from center
const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
  { value: 'mixed',  label: 'Mixed' },
];
const OPERATOR_OPTIONS: { value: OperatorMode; label: string }[] = [
  { value: 'mixed', label: 'All' },
  { value: '+',     label: '+' },
  { value: '-',     label: '−' },
  { value: '×',     label: '×' },
  { value: '÷',     label: '÷' },
];

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [operatorMode, setOperatorMode] = useState<OperatorMode>('mixed');
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });

  const config: QuestionConfig = { difficulty, operatorMode };
  const [questions, setQuestions] = useState<TeamQuestions>({
    team1: generateQuestion(config),
    team2: generateQuestion(config),
  });
  const [winner, setWinner] = useState<TeamId | null>(null);
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
    setQuestions((prev) => ({ ...prev, team1: generateQuestion({ difficulty, operatorMode }) }));
  }, [difficulty, operatorMode]);

  const handleTeam2Correct = useCallback(() => {
    setPosition((prev) => prev + 1);
    setQuestions((prev) => ({ ...prev, team2: generateQuestion({ difficulty, operatorMode }) }));
  }, [difficulty, operatorMode]);

  const resetRound = useCallback(() => {
    setPosition(0);
    setWinner(null);
    setShowWinBanner(false);
    setQuestions({
      team1: generateQuestion({ difficulty, operatorMode }),
      team2: generateQuestion({ difficulty, operatorMode }),
    });
  }, [difficulty, operatorMode]);

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

      {/* Bottom bar with difficulty + reset */}
      <div className="bg-gray-800 py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
        {/* Difficulty selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-xs sm:text-sm font-medium mr-1">Difficulty:</span>
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors
                active:scale-95 ${
                  difficulty === opt.value
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-600 hidden sm:block" />

        {/* Operator selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-xs sm:text-sm font-medium mr-1">Operator:</span>
          {OPERATOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setOperatorMode(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors
                active:scale-95 ${
                  operatorMode === opt.value
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-600 hidden sm:block" />

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
