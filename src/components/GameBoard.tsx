"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import VictoryOverlay from "./VictoryOverlay";
import { generateQuestion } from "@/utils/generateQuestion";
import { getTheme } from "@/utils/themes";
import {
  playTap,
  playCorrect,
  playWrong,
  playPull,
  playWarning,
  playWin,
  playTie,
} from "@/utils/sounds";
import type {
  TeamId,
  TeamQuestions,
  GameScore,
  Streaks,
  Difficulty,
  OperatorMode,
  GameMode,
  RoundResult,
  ThemeId,
} from "@/types/game";

const WIN_ZONE = 5;

const RUSH_DURATIONS: Record<GameMode, number | null> = {
  classic: null,
  "rush-30": 30,
  "rush-60": 60,
};

const ZERO_STREAKS: Streaks = { team1: 0, team2: 0 };

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
  const [themeId, setThemeId] = useState<ThemeId>("classic");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [streaks, setStreaks] = useState<Streaks>(ZERO_STREAKS);
  const [questions, setQuestions] = useState<TeamQuestions>(
    makeQuestions("easy", "mixed")
  );
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const theme = getTheme(themeId);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warnedRef = useRef(false);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  const roundOver = roundResult !== null;

  // ── Sound helper ──────────────────────────────────────────────────
  const sfx = useCallback((fn: () => void) => {
    if (soundRef.current) fn();
  }, []);

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
      warnedRef.current = false;
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

  useEffect(() => clearTimer, [clearTimer]);

  // ── Warning sound at <=5 seconds ─────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || timeLeft > 5 || timeLeft === 0 || roundOver) return;
    sfx(playWarning);
  }, [timeLeft, roundOver, sfx]);

  // ── Rush timeout ──────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft !== 0 || roundOver) return;
    if (position < 0) {
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
    } else if (position > 0) {
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
    } else {
      setRoundResult("tie");
      sfx(playTie);
    }
    setStreaks(ZERO_STREAKS);
  }, [timeLeft, position, roundOver, sfx]);

  // ── Classic win detection ─────────────────────────────────────────
  useEffect(() => {
    if (gameMode !== "classic" || roundOver) return;
    if (position <= -WIN_ZONE) {
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    } else if (position >= WIN_ZONE) {
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    }
  }, [position, gameMode, roundOver, sfx]);

  // ── Rush win-zone early finish ────────────────────────────────────
  useEffect(() => {
    if (gameMode === "classic" || roundOver) return;
    if (position <= -WIN_ZONE) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    } else if (position >= WIN_ZONE) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    }
  }, [position, gameMode, roundOver, clearTimer, sfx]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleCorrect = useCallback(
    (team: TeamId) => {
      sfx(playCorrect);
      sfx(playPull);
      const key = team === 1 ? "team1" : "team2";
      setStreaks((prev) => ({ ...prev, [key]: prev[key] + 1 }));
      if (team === 1) {
        setPosition((prev) => prev - 1);
        setQuestions((prev) => ({
          ...prev,
          team1: generateQuestion({ difficulty, operatorMode }),
        }));
      } else {
        setPosition((prev) => prev + 1);
        setQuestions((prev) => ({
          ...prev,
          team2: generateQuestion({ difficulty, operatorMode }),
        }));
      }
    },
    [difficulty, operatorMode, sfx]
  );

  const handleWrong = useCallback(
    (team: TeamId) => {
      sfx(playWrong);
      const key = team === 1 ? "team1" : "team2";
      setStreaks((prev) => ({ ...prev, [key]: 0 }));
    },
    [sfx]
  );

  const handleKeypadTap = useCallback(() => {
    sfx(playTap);
  }, [sfx]);

  const handleTeam1Correct = useCallback(() => handleCorrect(1), [handleCorrect]);
  const handleTeam2Correct = useCallback(() => handleCorrect(2), [handleCorrect]);
  const handleTeam1Wrong = useCallback(() => handleWrong(1), [handleWrong]);
  const handleTeam2Wrong = useCallback(() => handleWrong(2), [handleWrong]);

  const resetRound = useCallback(() => {
    clearTimer();
    setPosition(0);
    setRoundResult(null);
    setStreaks(ZERO_STREAKS);
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

  const handleGameModeChange = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      clearTimer();
      setPosition(0);
      setRoundResult(null);
      setStreaks(ZERO_STREAKS);
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

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={`h-dvh w-full flex flex-col ${theme.appBg} overflow-hidden select-none`}>
      <ScoreBoard
        score={score}
        difficulty={difficulty}
        operatorMode={operatorMode}
        gameMode={gameMode}
        roundResult={roundResult}
        timeLeft={timeLeft}
        theme={theme}
      />

      <div className="flex-1 flex flex-row min-h-0">
        <div className="flex-1 min-w-0">
          <TeamPanel
            team={1}
            question={questions.team1}
            onCorrectAnswer={handleTeam1Correct}
            onWrongAnswer={handleTeam1Wrong}
            onKeypadTap={handleKeypadTap}
            disabled={roundOver}
            score={score.team1}
            streak={streaks.team1}
            colors={theme.team1}
          />
        </div>

        <div className="w-20 sm:w-28 md:w-36 shrink-0">
          <TugArena position={position} winZone={WIN_ZONE} theme={theme} />
        </div>

        <div className="flex-1 min-w-0">
          <TeamPanel
            team={2}
            question={questions.team2}
            onCorrectAnswer={handleTeam2Correct}
            onWrongAnswer={handleTeam2Wrong}
            onKeypadTap={handleKeypadTap}
            disabled={roundOver}
            score={score.team2}
            streak={streaks.team2}
            colors={theme.team2}
          />
        </div>
      </div>

      <GameControls
        difficulty={difficulty}
        operatorMode={operatorMode}
        gameMode={gameMode}
        themeId={themeId}
        soundEnabled={soundEnabled}
        onDifficultyChange={setDifficulty}
        onOperatorModeChange={setOperatorMode}
        onGameModeChange={handleGameModeChange}
        onThemeChange={setThemeId}
        onSoundToggle={handleSoundToggle}
        onNewRound={resetRound}
        onResetAll={resetAll}
      />

      {roundResult !== null && (
        <VictoryOverlay
          result={roundResult}
          onPlayAgain={resetRound}
          onResetScores={resetAll}
          theme={theme}
        />
      )}
    </div>
  );
}
