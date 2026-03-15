"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import TeamPanel from "./TeamPanel";
import TugArena from "./TugArena";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import VictoryOverlay from "./VictoryOverlay";
import TeacherSetup from "./TeacherSetup";
import { generateQuestion } from "@/utils/generateQuestion";
import { getTheme } from "@/utils/themes";
import { getPreset } from "@/utils/presets";
import { parseCustomQuestions, customToMathQuestion, shuffle } from "@/utils/parseCustomQuestions";
import { saveSettings } from "@/utils/storage";
import { calculateBattleRewards } from "@/utils/rewards";
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
  GameSettings,
  CustomQuestion,
  MathQuestion,
  RoundRewards,
  PlayerProfile,
  RoundCompleteData,
} from "@/types/game";

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

interface GameBoardProps {
  initialSettings: GameSettings;
  profile: PlayerProfile;
  onBackToLobby: () => void;
  onSettingsChanged: (s: GameSettings) => void;
  onRoundComplete: (data: RoundCompleteData, rewards: RoundRewards) => void;
}

export default function GameBoard({
  initialSettings,
  profile,
  onBackToLobby,
  onSettingsChanged,
  onRoundComplete,
}: GameBoardProps) {
  // ── Settings state ────────────────────────────────────────────────
  const [presetId, setPresetId] = useState<PresetId>(initialSettings.presetId);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialSettings.difficulty);
  const [operatorMode, setOperatorMode] = useState<OperatorMode>(initialSettings.operatorMode);
  const [gameMode, setGameMode] = useState<GameMode>(initialSettings.gameMode);
  const [themeId, setThemeId] = useState<ThemeId>(initialSettings.themeId);
  const [winZone, setWinZone] = useState(initialSettings.winZone);
  const [soundEnabled, setSoundEnabled] = useState(initialSettings.soundEnabled);
  const [customQuestionsText, setCustomQuestionsText] = useState(initialSettings.customQuestionsText);

  // ── Derived ───────────────────────────────────────────────────────
  const preset = getPreset(presetId);
  const theme = getTheme(themeId);
  const questionRules = preset.questionRules;
  const customQuestions = parseCustomQuestions(customQuestionsText);
  const useCustom = customQuestions.length > 0;

  // ── Custom question pool ──────────────────────────────────────────
  const customPoolRef = useRef<CustomQuestion[]>([]);
  const customIdxRef = useRef({ team1: 0, team2: 0 });

  const refreshCustomPool = useCallback(() => {
    const parsed = parseCustomQuestions(customQuestionsText);
    if (parsed.length > 0) {
      customPoolRef.current = shuffle(parsed);
      customIdxRef.current = { team1: 0, team2: 0 };
    }
  }, [customQuestionsText]);

  const nextCustomQuestion = useCallback((teamKey: "team1" | "team2"): MathQuestion => {
    const pool = customPoolRef.current;
    if (pool.length === 0) {
      return generateQuestion({ difficulty, operatorMode, rules: questionRules });
    }
    const idx = customIdxRef.current[teamKey];
    const q = pool[idx % pool.length];
    customIdxRef.current[teamKey] = idx + 1;
    if (
      customIdxRef.current.team1 >= pool.length &&
      customIdxRef.current.team2 >= pool.length
    ) {
      customPoolRef.current = shuffle(pool);
      customIdxRef.current = { team1: 0, team2: 0 };
    }
    return customToMathQuestion(q);
  }, [difficulty, operatorMode, questionRules]);

  // ── Game state ────────────────────────────────────────────────────
  const getInitialQuestions = (): TeamQuestions => {
    if (useCustom) {
      refreshCustomPool();
      return {
        team1: nextCustomQuestion("team1"),
        team2: nextCustomQuestion("team2"),
      };
    }
    return makeQuestions(difficulty, operatorMode, questionRules);
  };

  const [position, setPosition] = useState(0);
  const [score, setScore] = useState<GameScore>({ team1: 0, team2: 0 });
  const [streaks, setStreaks] = useState<Streaks>(ZERO_STREAKS);
  const [questions, setQuestions] = useState<TeamQuestions>(() => getInitialQuestions());
  const [roundResult, setRoundResult] = useState<RoundResult>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [setupOpen, setSetupOpen] = useState(false);
  const [roundRewards, setRoundRewards] = useState<RoundRewards | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;

  // ── Round tracking for rewards ────────────────────────────────────
  const roundCorrectRef = useRef(0);
  const roundMaxStreakRef = useRef(0);
  const roundReportedRef = useRef(false);

  const roundOver = roundResult !== null;

  // ── Report round completion ───────────────────────────────────────
  useEffect(() => {
    if (!roundOver || roundReportedRef.current) return;
    roundReportedRef.current = true;

    const data: RoundCompleteData = {
      won: roundResult === 1 || roundResult === 2,
      tied: roundResult === "tie",
      correctCount: roundCorrectRef.current,
      maxStreak: roundMaxStreakRef.current,
      isRush: gameMode !== "classic",
    };
    const rewards = calculateBattleRewards(data, profile);
    setRoundRewards(rewards);
    onRoundComplete(data, rewards);
  }, [roundOver, roundResult, gameMode, profile, onRoundComplete]);

  // ── Sync settings back to parent ──────────────────────────────────
  const buildSettings = useCallback((): GameSettings => ({
    presetId, themeId, gameMode, difficulty, operatorMode,
    winZone, soundEnabled, customQuestionsText,
  }), [presetId, themeId, gameMode, difficulty, operatorMode, winZone, soundEnabled, customQuestionsText]);

  useEffect(() => {
    const s = buildSettings();
    onSettingsChanged(s);
    saveSettings(s);
  }, [buildSettings, onSettingsChanged]);

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

  useEffect(() => {
    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) startTimer(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Warning sound at <=5 seconds ──────────────────────────────────
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
  const getNextQuestion = useCallback(
    (teamKey: "team1" | "team2"): MathQuestion => {
      if (useCustom) return nextCustomQuestion(teamKey);
      return generateQuestion({ difficulty, operatorMode, rules: questionRules });
    },
    [useCustom, nextCustomQuestion, difficulty, operatorMode, questionRules]
  );

  const handleCorrect = useCallback(
    (team: TeamId) => {
      sfx(playCorrect);
      sfx(playPull);
      roundCorrectRef.current += 1;
      const key = team === 1 ? "team1" : "team2";
      setStreaks((prev) => {
        const next = prev[key] + 1;
        roundMaxStreakRef.current = Math.max(roundMaxStreakRef.current, next);
        return { ...prev, [key]: next };
      });
      if (team === 1) {
        setPosition((prev) => prev - 1);
        setQuestions((prev) => ({ ...prev, team1: getNextQuestion("team1") }));
      } else {
        setPosition((prev) => prev + 1);
        setQuestions((prev) => ({ ...prev, team2: getNextQuestion("team2") }));
      }
    },
    [sfx, getNextQuestion]
  );

  const handleWrong = useCallback(
    (team: TeamId) => {
      sfx(playWrong);
      const key = team === 1 ? "team1" : "team2";
      setStreaks((prev) => ({ ...prev, [key]: 0 }));
    },
    [sfx]
  );

  const handleKeypadTap = useCallback(() => { sfx(playTap); }, [sfx]);

  const handleTeam1Correct = useCallback(() => handleCorrect(1), [handleCorrect]);
  const handleTeam2Correct = useCallback(() => handleCorrect(2), [handleCorrect]);
  const handleTeam1Wrong = useCallback(() => handleWrong(1), [handleWrong]);
  const handleTeam2Wrong = useCallback(() => handleWrong(2), [handleWrong]);

  const resetRound = useCallback(() => {
    clearTimer();
    setPosition(0);
    setRoundResult(null);
    setStreaks(ZERO_STREAKS);
    setRoundRewards(null);
    roundCorrectRef.current = 0;
    roundMaxStreakRef.current = 0;
    roundReportedRef.current = false;

    if (useCustom) {
      refreshCustomPool();
      setQuestions({
        team1: nextCustomQuestion("team1"),
        team2: nextCustomQuestion("team2"),
      });
    } else {
      setQuestions(makeQuestions(difficulty, operatorMode, questionRules));
    }

    const duration = RUSH_DURATIONS[gameMode];
    if (duration !== null) {
      startTimer(duration);
    } else {
      setTimeLeft(null);
    }
  }, [difficulty, operatorMode, questionRules, gameMode, useCustom, refreshCustomPool, nextCustomQuestion, clearTimer, startTimer]);

  const resetAll = useCallback(() => {
    resetRound();
    setScore({ team1: 0, team2: 0 });
  }, [resetRound]);

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const handleSetupSettingsChange = useCallback((s: GameSettings) => {
    setPresetId(s.presetId);
    setDifficulty(s.difficulty);
    setOperatorMode(s.operatorMode);
    setGameMode(s.gameMode);
    setThemeId(s.themeId);
    setWinZone(s.winZone);
    setSoundEnabled(s.soundEnabled);
    setCustomQuestionsText(s.customQuestionsText);
  }, []);

  // ── Render ────────────────────────────────────────────────────────
  const allowNegatives = preset.questionRules.allowNegatives;

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
            teamIcon={theme.team1Icon}
            allowNegatives={allowNegatives}
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
            teamIcon={theme.team2Icon}
            allowNegatives={allowNegatives}
          />
        </div>
      </div>

      <GameControls
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        onNewRound={resetRound}
        onResetAll={resetAll}
        onOpenSetup={() => setSetupOpen(true)}
        onBackToLobby={onBackToLobby}
      />

      {roundResult !== null && (
        <VictoryOverlay
          result={roundResult}
          onPlayAgain={resetRound}
          onResetScores={resetAll}
          theme={theme}
          rewards={roundRewards ?? undefined}
        />
      )}

      <TeacherSetup
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        settings={buildSettings()}
        onSettingsChange={handleSetupSettingsChange}
      />
    </div>
  );
}
