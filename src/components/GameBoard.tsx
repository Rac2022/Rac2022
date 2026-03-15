"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import VictoryOverlay from "./VictoryOverlay";
import { generateQuestion } from "@/utils/generateQuestion";
import { getTheme } from "@/utils/themes";
import { getPreset } from "@/utils/presets";
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
  PresetId,
  QuestionRules,
} from "@/types/game";

const DEFAULT_PRESET: PresetId = "grade2-warmup";

const RUSH_DURATIONS: Record<GameMode, number | null> = {
  classic: null,
  "rush-30": 30,
  "rush-60": 60,
};

const ZERO_STREAKS: Streaks = { team1: 0, team2: 0 };

function makeQuestions(
  difficulty: Difficulty,
  operatorMode: OperatorMode,
  rules?: QuestionRules
): TeamQuestions {
  return {
    team1: generateQuestion({ difficulty, operatorMode, rules }),
    team2: generateQuestion({ difficulty, operatorMode, rules }),
  };
}

export default function GameBoard() {
  const [presetId, setPresetId] = useState<PresetId>(DEFAULT_PRESET);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [operatorMode, setOperatorMode] = useState<OperatorMode>("mixed");
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [themeId, setThemeId] = useState<ThemeId>("dino");
  const [winZone, setWinZone] = useState(5);
  const [questionRules, setQuestionRules] = useState<QuestionRules | undefined>(
    getPreset(DEFAULT_PRESET).questionRules
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [streaks, setStreaks] = useState<Streaks>(ZERO_STREAKS);
  const [questions, setQuestions] = useState<TeamQuestions>(
    makeQuestions("easy", "mixed", getPreset(DEFAULT_PRESET).questionRules)
  );
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const theme = getTheme(themeId);
  const preset = getPreset(presetId);

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
    if (position <= -winZone) {
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    } else if (position >= winZone) {
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    }
  }, [position, gameMode, winZone, roundOver, sfx]);

  // ── Rush win-zone early finish ────────────────────────────────────
  useEffect(() => {
    if (gameMode === "classic" || roundOver) return;
    if (position <= -winZone) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(1);
      setScore((prev) => ({ ...prev, team1: prev.team1 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    } else if (position >= winZone) {
      clearTimer();
      setTimeLeft(null);
      setRoundResult(2);
      setScore((prev) => ({ ...prev, team2: prev.team2 + 1 }));
      sfx(playWin);
      setStreaks(ZERO_STREAKS);
    }
  }, [position, gameMode, winZone, roundOver, clearTimer, sfx]);

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
          team1: generateQuestion({ difficulty, operatorMode, rules: questionRules }),
        }));
      } else {
        setPosition((prev) => prev + 1);
        setQuestions((prev) => ({
          ...prev,
          team2: generateQuestion({ difficulty, operatorMode, rules: questionRules }),
        }));
      }
    },
    [difficulty, operatorMode, questionRules, sfx]
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
    setQuestions(makeQuestions(difficulty, operatorMode, questionRules));

    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) {
      startTimer(duration);
    } else {
      setTimeLeft(null);
    }
  }, [difficulty, operatorMode, questionRules, gameMode, clearTimer, startTimer]);

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
      setQuestions(makeQuestions(difficulty, operatorMode, questionRules));

      const duration = RUSH_DURATIONS[mode];
      if (duration !== null) {
        startTimer(duration);
      } else {
        setTimeLeft(null);
      }
    },
    [difficulty, operatorMode, questionRules, clearTimer, startTimer]
  );

  const handlePresetChange = useCallback(
    (id: PresetId) => {
      const p = getPreset(id);
      setPresetId(id);
      setDifficulty(p.difficulty);
      setOperatorMode(p.operatorMode);
      setGameMode(p.gameMode);
      setThemeId(p.themeId);
      setWinZone(p.winZone);
      setQuestionRules(p.questionRules);

      // Reset round with new preset settings
      clearTimer();
      setPosition(0);
      setRoundResult(null);
      setStreaks(ZERO_STREAKS);
      setQuestions(makeQuestions(p.difficulty, p.operatorMode, p.questionRules));

      const duration = RUSH_DURATIONS[p.gameMode];
      if (duration !== null) {
        startTimer(duration);
      } else {
        setTimeLeft(null);
      }
    },
    [clearTimer, startTimer]
  );

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className={`h-dvh w-full flex flex-col ${theme.appBg} overflow-hidden select-none`}>
      <ScoreBoard
        score={score}
        presetLabel={preset.label}
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
          <TugArena position={position} winZone={winZone} theme={theme} />

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
        presetId={presetId}
        difficulty={difficulty}
        operatorMode={operatorMode}
        gameMode={gameMode}
        themeId={themeId}
        soundEnabled={soundEnabled}
        onPresetChange={handlePresetChange}
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
