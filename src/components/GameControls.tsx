"use client";

import type { GameControlsProps } from "@/types/game";

export default function GameControls({
  soundEnabled,
  onSoundToggle,
  onNewRound,
  onResetAll,
  onOpenSetup,
  onBackToLobby,
}: GameControlsProps) {
  return (
    <div className="bg-gray-800 py-2 px-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      {/* Back to lobby */}
      <button
        onClick={onBackToLobby}
        className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-bold text-sm
          px-3 py-2 rounded-lg active:scale-95 transition-all"
        aria-label="Back to lobby"
      >
        &larr; Lobby
      </button>

      <div className="w-px h-6 bg-gray-600 hidden sm:block" />

      {/* Setup */}
      <button
        onClick={onOpenSetup}
        className="bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-bold text-sm
          px-3 py-2 rounded-lg active:scale-95 transition-all"
        aria-label="Open teacher setup"
      >
        Setup
      </button>

      <div className="w-px h-6 bg-gray-600 hidden sm:block" />

      {/* Sound toggle */}
      <button
        onClick={onSoundToggle}
        className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
          soundEnabled
            ? "bg-amber-500 text-gray-900"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
        aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? "\u{1F50A}" : "\u{1F507}"}
      </button>

      <div className="w-px h-6 bg-gray-600 hidden sm:block" />

      {/* Game actions */}
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
