"use client";

import { useState, useCallback } from "react";
import type { TeamPanelProps } from "@/types/game";

function getStreakLabel(streak: number): string | null {
  if (streak >= 5) return "Unstoppable!";
  if (streak >= 3) return "Hot streak!";
  if (streak >= 2) return "Nice!";
  return null;
}

export default function TeamPanel({
  team,
  question,
  onCorrectAnswer,
  onWrongAnswer,
  onKeypadTap,
  disabled,
  score,
  streak,
  colors,
  teamIcon,
  allowNegatives = false,
}: TeamPanelProps) {
  const [input, setInput] = useState("");
  const [isNegative, setIsNegative] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);

  const streakLabel = getStreakLabel(streak);

  const handleNumber = useCallback(
    (num: string) => {
      if (disabled) return;
      onKeypadTap();
      setInput((prev) => {
        if (prev.length >= 4) return prev;
        return prev + num;
      });
    },
    [disabled, onKeypadTap]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setIsNegative(false);
  }, []);

  const handleNegativeToggle = useCallback(() => {
    setIsNegative((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(() => {
    if (disabled || input === "") return;
    const value = parseInt(input, 10);
    const answer = isNegative ? -value : value;
    if (answer === question.answer) {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
      setInput("");
      setIsNegative(false);
      onCorrectAnswer();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput("");
      setIsNegative(false);
      onWrongAnswer();
    }
  }, [disabled, input, isNegative, question.answer, onCorrectAnswer, onWrongAnswer]);

  const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const displayValue = input ? (isNegative ? `-${input}` : input) : "";

  return (
    <div
      className={`flex flex-col items-center justify-between h-full p-3 sm:p-4 ${colors.bg} ${
        flash ? "animate-pulse" : ""
      }`}
    >
      {/* Team header + score */}
      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{teamIcon}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
            {colors.label}
          </h2>
        </div>
        <div className={`mt-1 inline-block px-4 py-1 rounded-full ${colors.accent}`}>
          <span className="text-white text-lg sm:text-xl font-bold">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Question display */}
      <div
        className={`w-full max-w-xs mx-auto ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        <div className={`${colors.accent} rounded-2xl p-4 sm:p-5 text-center shadow-lg relative`}>
          <p className={`text-lg ${colors.text} font-medium mb-1`}>Solve:</p>
          <p className="text-4xl sm:text-5xl font-extrabold text-white">
            {question.display}
          </p>

          {/* Streak badge */}
          {streakLabel && (
            <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-extrabold shadow-md animate-bounce">
              {streak >= 5 ? "\u{1F525}" : streak >= 3 ? "\u{1F525}" : "\u{2B50}"}{" "}
              {streakLabel}
            </div>
          )}
        </div>

        {/* Answer input */}
        <div className="mt-3 bg-white rounded-xl p-3 text-center shadow-inner">
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 min-h-[2.5rem]">
            {displayValue || <span className="text-gray-300">?</span>}
          </p>
        </div>
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {keypadNumbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumber(num)}
              disabled={disabled}
              className={`${colors.bgLight} ${colors.hover} text-white text-2xl sm:text-3xl font-bold
                rounded-xl py-3 sm:py-4 active:scale-95 transition-transform duration-100
                disabled:opacity-40 shadow-md select-none
                ${num === "0" ? "col-start-2" : ""}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className={`grid gap-2 mt-2 ${allowNegatives ? "grid-cols-3" : "grid-cols-2"}`}>
          {allowNegatives && (
            <button
              onClick={handleNegativeToggle}
              disabled={disabled}
              className={`text-xl sm:text-2xl font-bold rounded-xl py-3 sm:py-4
                active:scale-95 transition-all duration-100 disabled:opacity-40 shadow-md select-none ${
                isNegative
                  ? "bg-amber-400 text-gray-800"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              +/&minus;
            </button>
          )}
          <button
            onClick={handleClear}
            disabled={disabled}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl sm:text-2xl font-bold
              rounded-xl py-3 sm:py-4 active:scale-95 transition-transform duration-100
              disabled:opacity-40 shadow-md select-none"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={disabled || input === ""}
            className="bg-green-500 hover:bg-green-400 text-white text-xl sm:text-2xl font-bold
              rounded-xl py-3 sm:py-4 active:scale-95 transition-transform duration-100
              disabled:opacity-40 shadow-md select-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
