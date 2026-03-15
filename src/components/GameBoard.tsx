"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import VictoryOverlay from "./VictoryOverlay";
import { generateQuestion } from "@/utils/generateQuestion";
import type {
  TeamId,
  TeamQuestions,
  GameScore,
  Difficulty,
  OperatorMode,
  GameMode,
  RoundResult,
} from "@/types/game";

const WIN_ZONE = 5;

/** Duration in seconds for each rush mode */
const RUSH_DURATIONS: Record<GameMode, number | null> = {
  classic: null,
  "rush-30": 30,
  "rush-60": 60,
};

function makeQuestions(difficulty: Difficulty, operatorMode: OperatorMode): TeamQuestions {
  return {
    team1: generateQuestion({ difficulty, operatorMode }),
    team2: generateQuestion({ difficulty, operatorMode }),
  };
}

export default function GameBoard() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [operatorMode, setOperatorMode] = useState<OperatorMode>("mixed");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [questions, setQuestions] = useState<TeamQuestions>(
    makeQuestions("easy", "mixed")
  );
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const roundOver = roundResult !== null;

  // ── Timer management ──────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer();
      setTimeLeft(seconds);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer]
  );

  // Clean up interval on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // ── Rush timeout: resolve round when timer hits 0 ─────────────────
  useEffect(() => {
    if (timeLeft !== 0 || roundOver) return;
    // Timer just expired — determine winner by position
    if (position < 0) {
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position > 0) {
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    } else {
      setRoundResult("tie");
    }
  }, [timeLeft, position, roundOver]);

  // ── Classic win detection ─────────────────────────────────────────
  useEffect(() => {
    if (gameMode !== "classic" || roundOver) return;
    if (position <= -WIN_ZONE) {
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position >= WIN_ZONE) {
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    }
  }, [position, gameMode, roundOver]);

  // ── Rush win-zone early finish ────────────────────────────────────
  useEffect(() => {
    if (gameMode === "classic" || roundOver) return;
    if (position <= -WIN_ZONE) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
    } else if (position >= WIN_ZONE) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
    }
  }, [position, gameMode, roundOver, clearTimer]);

  // ── Handlers ──────────────────────────────────────────────────────
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
    clearTimer();
    setPosition(0);
    setRoundResult(null);
    setQuestions(makeQuestions(difficulty, operatorMode));

    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) {
      startTimer(duration);
    } else {
      setTimeLeft(null);
    }
  }, [difficulty, operatorMode, gameMode, clearTimer, startTimer]);

  const resetAll = useCallback(() => {
    resetRound();
    setScore({ team1: 0, team2: 0 });
  }, [resetRound]);

  // When game mode changes mid-session, restart the round
  const handleGameModeChange = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      clearTimer();
      setPosition(0);
      setRoundResult(null);
      setQuestions(makeQuestions(difficulty, operatorMode));

      const duration = RUSH_DURATIONS[mode];
      if (duration !== null) {
        startTimer(duration);
      } else {
        setTimeLeft(null);
      }
    },
    [difficulty, operatorMode, clearTimer, startTimer]
  );

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="h-dvh w-full flex flex-col bg-gray-900 overflow-hidden select-none">
      <ScoreBoard
        score={score}
        difficulty={difficulty}
        operatorMode={operatorMode}
        gameMode={gameMode}
        roundResult={roundResult}
        timeLeft={timeLeft}
      />

      <div className="flex-1 flex flex-row min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel
            team={1}
            question={questions.team1}
            onCorrectAnswer={handleTeam1Correct}
            disabled={roundOver}
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
            disabled={roundOver}
            score={score.team2}
          />
        </div>
      </div>

      <GameControls
        difficulty={difficulty}
        operatorMode={operatorMode}
        gameMode={gameMode}
        onDifficultyChange={setDifficulty}
        onOperatorModeChange={setOperatorMode}
        onGameModeChange={handleGameModeChange}
        onNewRound={resetRound}
        onResetAll={resetAll}
      />

      {roundResult !== null && (
        <VictoryOverlay
          result={roundResult}
          onPlayAgain={resetRound}
          onResetScores={resetAll}
        />
      )}
    </div>
  );
}
