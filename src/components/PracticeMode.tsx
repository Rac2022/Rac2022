"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { generateQuestion } from "@/utils/generateQuestion";
import { getTheme } from "@/utils/themes";
import { getPreset } from "@/utils/presets";
import { parseCustomQuestions, customToMathQuestion, shuffle } from "@/utils/parseCustomQuestions";
import {
  playTap,
  playCorrect,
  playWrong,
} from "@/utils/sounds";
import type {
  GameSettings,
  MathQuestion,
  PracticeResult,
  CustomQuestion,
} from "@/types/game";

interface PracticeModeProps {
  settings: GameSettings;
  onFinish: (result: PracticeResult) => void;
  onBackToLobby: () => void;
  soundEnabled: boolean;
}

export default function PracticeMode({
  settings,
  onFinish,
  onBackToLobby,
  soundEnabled,
}: PracticeModeProps) {
  const preset = getPreset(settings.presetId);
  const theme = getTheme(settings.themeId);
  const rules = preset.questionRules;
  const customQuestions = parseCustomQuestions(settings.customQuestionsText);
  const useCustom = customQuestions.length > 0;

  // Custom question pool
  const customPoolRef = useRef<CustomQuestion[]>([]);
  const customIdxRef = useRef(0);

  const getNext = useCallback((): MathQuestion => {
    if (useCustom) {
      const pool = customPoolRef.current;
      if (pool.length === 0) {
        customPoolRef.current = shuffle(customQuestions);
        customIdxRef.current = 0;
      }
      const q = customPoolRef.current[customIdxRef.current % customPoolRef.current.length];
      customIdxRef.current++;
      if (customIdxRef.current >= customPoolRef.current.length) {
        customPoolRef.current = shuffle(customQuestions);
        customIdxRef.current = 0;
      }
      return customToMathQuestion(q);
    }
    return generateQuestion({
      difficulty: settings.difficulty,
      operatorMode: settings.operatorMode,
      rules,
    });
  }, [useCustom, customQuestions, settings.difficulty, settings.operatorMode, rules]);

  // State
  const [question, setQuestion] = useState<MathQuestion>(() => {
    if (useCustom) {
      customPoolRef.current = shuffle(customQuestions);
      customIdxRef.current = 0;
      const q = customPoolRef.current[0];
      customIdxRef.current = 1;
      return customToMathQuestion(q);
    }
    return generateQuestion({ difficulty: settings.difficulty, operatorMode: settings.operatorMode, rules });
  });
  const [input, setInput] = useState("");
  const [isNegative, setIsNegative] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  // Timer (optional 60s)
  const [timerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const sfx = useCallback((fn: () => void) => {
    if (soundRef.current) fn();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerEnabled) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerEnabled]);

  const handleNumber = useCallback(
    (num: string) => {
      if (finished) return;
      sfx(playTap);
      setInput((prev) => (prev.length >= 4 ? prev : prev + num));
    },
    [finished, sfx]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setIsNegative(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (finished || input === "") return;
    const value = parseInt(input, 10);
    const answer = isNegative ? -value : value;

    if (answer === question.answer) {
      sfx(playCorrect);
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((ms) => Math.max(ms, next));
        return next;
      });
      setQuestion(getNext());
    } else {
      sfx(playWrong);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setWrongCount((prev) => prev + 1);
      setStreak(0);
    }
    setInput("");
    setIsNegative(false);
  }, [finished, input, isNegative, question.answer, sfx, getNext]);

  const handleFinish = useCallback(() => {
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onFinish({
      correctCount,
      maxStreak,
      totalAttempted: correctCount + wrongCount,
    });
  }, [correctCount, maxStreak, wrongCount, onFinish]);

  // Auto-report on finish
  useEffect(() => {
    if (finished && correctCount > 0) {
      onFinish({
        correctCount,
        maxStreak,
        totalAttempted: correctCount + wrongCount,
      });
    }
    // Only trigger when finished changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const displayValue = input ? (isNegative ? `-${input}` : input) : "";
  const allowNeg = rules.allowNegatives;

  return (
    <div className={`h-dvh w-full flex flex-col ${theme.appBg} overflow-hidden select-none`}>
      {/* Top bar */}
      <div className={`${theme.scoreboardBg} backdrop-blur-sm px-4 py-2 flex items-center justify-between border-b border-gray-700/50`}>
        <button
          onClick={finished ? onBackToLobby : handleFinish}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-bold text-sm
            px-3 py-1.5 rounded-lg active:scale-95 transition-all"
        >
          &larr; {finished ? "Lobby" : "Finish"}
        </button>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-violet-700/30 text-violet-300 text-xs font-bold">
            Practice
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-700/30 text-amber-300 text-xs font-bold">
            {preset.label}
          </span>
          {timerEnabled && (
            <span className={`px-2 py-0.5 rounded font-bold tabular-nums text-sm ${
              timeLeft <= 5 ? "bg-red-600/40 text-red-200 animate-pulse" : "bg-gray-700 text-white"
            }`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          )}
        </div>
        <div />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-2 bg-gray-800/50">
        <div className="text-center">
          <p className="text-green-400 text-2xl sm:text-3xl font-extrabold tabular-nums">{correctCount}</p>
          <p className="text-gray-500 text-xs font-bold uppercase">Correct</p>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div className="text-center">
          <p className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${streak >= 3 ? "text-amber-400" : "text-white"}`}>
            {streak >= 3 ? `\u{1F525} ${streak}` : streak}
          </p>
          <p className="text-gray-500 text-xs font-bold uppercase">Streak</p>
        </div>
        <div className="w-px h-8 bg-gray-700" />
        <div className="text-center">
          <p className="text-purple-400 text-2xl sm:text-3xl font-extrabold tabular-nums">{maxStreak}</p>
          <p className="text-gray-500 text-xs font-bold uppercase">Best</p>
        </div>
        {wrongCount > 0 && (
          <>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <p className="text-red-400 text-2xl sm:text-3xl font-extrabold tabular-nums">{wrongCount}</p>
              <p className="text-gray-500 text-xs font-bold uppercase">Wrong</p>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
        {finished ? (
          /* Results */
          <div className="text-center" style={{ animation: "bounceIn 0.5s ease-out" }}>
            <p className="text-5xl sm:text-6xl mb-3">{correctCount >= 10 ? "\u{1F31F}" : "\u{1F44D}"}</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Practice Complete!</p>
            <p className="text-lg text-gray-400 mb-6">
              {correctCount} correct out of {correctCount + wrongCount} &bull; Best streak: {maxStreak}
            </p>
            <button
              onClick={onBackToLobby}
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-extrabold text-lg
                px-8 py-3 rounded-xl active:scale-95 transition-transform shadow-lg"
            >
              Back to Lobby
            </button>
          </div>
        ) : (
          /* Question + Keypad */
          <div className="w-full max-w-sm">
            <div className={shake ? "animate-[shake_0.5s_ease-in-out]" : ""}>
              <div className={`${theme.team1.accent} rounded-2xl p-5 sm:p-6 text-center shadow-lg ${flash ? "animate-pulse" : ""}`}>
                <p className="text-gray-300 text-base font-medium mb-1">Solve:</p>
                <p className="text-5xl sm:text-6xl font-extrabold text-white">
                  {question.display}
                </p>
              </div>

              <div className="mt-3 bg-white rounded-xl p-3 text-center shadow-inner">
                <p className="text-3xl sm:text-4xl font-bold text-gray-800 min-h-[2.5rem]">
                  {displayValue || <span className="text-gray-300">?</span>}
                </p>
              </div>
            </div>

            {/* Keypad */}
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {["1","2","3","4","5","6","7","8","9","0"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumber(num)}
                    disabled={finished}
                    className={`${theme.team1.bgLight} ${theme.team1.hover} text-white text-2xl sm:text-3xl font-bold
                      rounded-xl py-3 sm:py-4 active:scale-95 transition-transform duration-100
                      disabled:opacity-40 shadow-md select-none
                      ${num === "0" ? "col-start-2" : ""}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className={`grid gap-2 mt-2 ${allowNeg ? "grid-cols-3" : "grid-cols-2"}`}>
                {allowNeg && (
                  <button
                    onClick={() => setIsNegative((p) => !p)}
                    disabled={finished}
                    className={`text-xl font-bold rounded-xl py-3 active:scale-95 transition-all
                      disabled:opacity-40 shadow-md select-none ${
                      isNegative ? "bg-amber-400 text-gray-800" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    +/&minus;
                  </button>
                )}
                <button
                  onClick={handleClear}
                  disabled={finished}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold
                    rounded-xl py-3 active:scale-95 transition-transform disabled:opacity-40 shadow-md select-none"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={finished || input === ""}
                  className="bg-green-500 hover:bg-green-400 text-white text-xl font-bold
                    rounded-xl py-3 active:scale-95 transition-transform disabled:opacity-40 shadow-md select-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
