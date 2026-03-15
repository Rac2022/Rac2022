"use client";

import { useState, useCallback, useEffect } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import VictoryOverlay from "./VictoryOverlay";
import { generateQuestion } from "@/utils/generateQuestion";
import type { TeamId, TeamQuestions, GameScore, Difficulty, OperatorMode } from "@/types/game";

const WIN_ZONE = 5;

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [operatorMode, setOperatorMode] = useState<OperatorMode>("mixed");
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [questions, setQuestions] = useState<TeamQuestions>({
    team1: generateQuestion({ difficulty: "easy", operatorMode: "mixed" }),
    team2: generateQuestion({ difficulty: "easy", operatorMode: "mixed" }),
  });
  const [winner, setWinner] = useState<TeamId | null>(null);

  // Win detection
  useEffect(() => {
    if (position <= -WIN_ZONE && !winner) {
      setWinner(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position >= WIN_ZONE && !winner) {
      setWinner(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    }
  }, [position, winner]);

  const handleTeam1Correct = useCallback(() => {
    setPosition((prev) => prev - 1);
    setQuestions((prev) => ({
      ...prev,
      team1: generateQuestion({ difficulty, operatorMode }),
    }));
  }, [difficulty, operatorMode]);

  const handleTeam2Correct = useCallback(() => {
    setPosition((prev) => prev + 1);
    setQuestions((prev) => ({
      ...prev,
      team2: generateQuestion({ difficulty, operatorMode }),
    }));
  }, [difficulty, operatorMode]);

  const resetRound = useCallback(() => {
    setPosition(0);
    setWinner(null);
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
      {/* Top scoreboard */}
      <ScoreBoard
        score={score}
        difficulty={difficulty}
        operatorMode={operatorMode}
        winner={winner}
      />

      {/* Main game area */}
      <div className="flex-1 flex flex-row min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel
            team={1}
            question={questions.team1}
            onCorrectAnswer={handleTeam1Correct}
            disabled={winner !== null}
            score={score.team1}
          />
        </div>

        <div className="w-20 sm:w-28 md:w-36 shrink-0">
          <TugArena position={position} winZone={WIN_ZONE} />
        </div>

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

      {/* Bottom controls */}
      <GameControls
        difficulty={difficulty}
        operatorMode={operatorMode}
        onDifficultyChange={setDifficulty}
        onOperatorModeChange={setOperatorMode}
        onNewRound={resetRound}
        onResetAll={resetAll}
      />

      {/* Victory overlay */}
      {winner && (
        <VictoryOverlay
          winner={winner}
          onPlayAgain={resetRound}
          onResetScores={resetAll}
        />
      )}
    </div>
  );
}
