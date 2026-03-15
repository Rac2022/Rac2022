"use client";

import type { GameControlsProps, Difficulty, OperatorMode } from "@/types/game";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "mixed", label: "Mixed" },
];

const OPERATOR_OPTIONS: { value: OperatorMode; label: string }[] = [
  { value: "mixed", label: "All" },
  { value: "+", label: "+" },
  { value: "-", label: "\u2212" },
  { value: "\u00d7", label: "\u00d7" },
  { value: "\u00f7", label: "\u00f7" },
];

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400 text-xs sm:text-sm font-medium mr-1">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors
            active:scale-95 ${
              value === opt.value
                ? "bg-amber-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function GameControls({
  difficulty,
  operatorMode,
  onDifficultyChange,
  onOperatorModeChange,
  onNewRound,
  onResetAll,
}: GameControlsProps) {
  return (
    <div className="bg-gray-800 py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
      <ToggleGroup
        label="Difficulty"
        options={DIFFICULTY_OPTIONS}
        value={difficulty}
        onChange={onDifficultyChange}
      />

      <div className="w-px h-6 bg-gray-600 hidden sm:block" />

      <ToggleGroup
        label="Operator"
        options={OPERATOR_OPTIONS}
        value={operatorMode}
        onChange={onOperatorModeChange}
      />

      <div className="w-px h-6 bg-gray-600 hidden sm:block" />

      {/* Placeholder for future sound toggle */}
      {/* <SoundToggle enabled={soundOn} onToggle={setSoundOn} /> */}

      <button
        onClick={onNewRound}
        className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold text-sm sm:text-base
          px-5 py-2 rounded-lg active:scale-95 transition-transform shadow-md"
      >
        New Round
      </button>
      <button
        onClick={onResetAll}
        className="bg-gray-600 hover:bg-gray-500 text-white font-bold text-sm sm:text-base
          px-5 py-2 rounded-lg active:scale-95 transition-transform shadow-md"
      >
        Reset All
      </button>
    </div>
  );
}
