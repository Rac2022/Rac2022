"use client";

import { useState, useCallback } from "react";
import type { TeamPanelProps } from "@/types/game";

const TEAM_COLORS = {
  1: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-500",
    hover: "hover:bg-blue-400",
    accent: "bg-blue-700",
    ring: "ring-blue-300",
    text: "text-blue-100",
    label: "TEAM 1",
  },
  2: {
    bg: "bg-red-600",
    bgLight: "bg-red-500",
    hover: "hover:bg-red-400",
    accent: "bg-red-700",
    ring: "ring-red-300",
    text: "text-red-100",
    label: "TEAM 2",
  },
} as const;

export default function TeamPanel({
  team,
  question,
  onCorrectAnswer,
  disabled,
  score,
}: TeamPanelProps) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const colors = TEAM_COLORS[team];

  const handleNumber = useCallback(
    (num: string) => {
      if (disabled) return;
      setInput((prev) => {
        if (prev.length >= 4) return prev;
        return prev + num;
      });
    },
    [disabled]
  );

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (disabled || input === "") return;
    const answer = parseInt(input, 10);
    if (answer === question.answer) {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
      setInput("");
      onCorrectAnswer();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput("");
    }
  }, [disabled, input, question.answer, onCorrectAnswer]);

  const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div
      className={`flex flex-col items-center justify-between h-full p-3 sm:p-4 ${colors.bg} ${
        flash ? "animate-pulse" : ""
      }`}
    >
      {/* Team header + score */}
      <div className="text-center w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider">
          {colors.label}
        </h2>
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
        <div className={`${colors.accent} rounded-2xl p-4 sm:p-5 text-center shadow-lg`}>
          <p className={`text-lg ${colors.text} font-medium mb-1`}>Solve:</p>
          <p className="text-4xl sm:text-5xl font-extrabold text-white">
            {question.display}
          </p>
        </div>

        {/* Answer input */}
        <div className="mt-3 bg-white rounded-xl p-3 text-center shadow-inner">
          <p className="text-3xl sm:text-4xl font-bold text-gray-800 min-h-[2.5rem]">
            {input || <span className="text-gray-300">?</span>}
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
        <div className="grid grid-cols-2 gap-2 mt-2">
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
