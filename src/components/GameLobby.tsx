"use client";

import { useState } from "react";
import { PRESETS, PRESET_IDS } from "@/utils/presets";
import { THEMES } from "@/utils/themes";
import { buildShareUrl } from "@/utils/urlConfig";
import { getTheme } from "@/utils/themes";
import PlayerProgress from "./PlayerProgress";
import type {
  GameSettings,
  PresetId,
  ThemeId,
  GameMode,
  PlayerProfile,
  DailyChallenge,
  DailyChallengeState,
} from "@/types/game";

const MODE_OPTIONS: { value: GameMode; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "rush-30", label: "30s Rush" },
  { value: "rush-60", label: "60s Rush" },
];

const THEME_LIST = (
  Object.values(THEMES) as { id: ThemeId; label: string; icon: string; team1Icon: string; team2Icon: string }[]
);

interface GameLobbyProps {
  settings: GameSettings;
  onSettingsChange: (s: GameSettings) => void;
  onStartGame: () => void;
  onQuickStart: () => void;
  onOpenSetup: () => void;
  onStartPractice: () => void;
  profile: PlayerProfile;
  dailyChallenge: DailyChallenge;
  dailyProgress: DailyChallengeState;
}

export default function GameLobby({
  settings,
  onSettingsChange,
  onStartGame,
  onQuickStart,
  onOpenSetup,
  onStartPractice,
  profile,
  dailyChallenge,
  dailyProgress,
}: GameLobbyProps) {
  const [copied, setCopied] = useState(false);
  const theme = getTheme(settings.themeId);

  const handlePresetChange = (id: PresetId) => {
    const p = PRESETS[id];
    onSettingsChange({
      ...settings,
      presetId: id,
      difficulty: p.difficulty,
      operatorMode: p.operatorMode,
      gameMode: p.gameMode,
      winZone: p.winZone,
      themeId: p.themeId,
    });
  };

  const handleThemeChange = (id: ThemeId) => {
    onSettingsChange({ ...settings, themeId: id });
  };

  const handleModeChange = (mode: GameMode) => {
    onSettingsChange({ ...settings, gameMode: mode });
  };

  const handleCopyLink = async () => {
    const url = buildShareUrl(settings);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select-and-copy not critical
    }
  };

  return (
    <div className={`h-dvh w-full flex flex-col items-center ${theme.appBg} overflow-y-auto select-none p-4`}>
      {/* Title */}
      <div className="text-center mb-4 mt-4" style={{ animation: "lobby-float 3s ease-in-out infinite" }}>
        <div className="text-5xl sm:text-6xl mb-2">
          {theme.team1Icon} {theme.winIcon} {theme.team2Icon}
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Classroom Clash
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 font-medium mt-1">
          Tug of War Math
        </p>
      </div>

      {/* Player Progress */}
      <div className="mb-4">
        <PlayerProgress
          profile={profile}
          dailyChallenge={dailyChallenge}
          dailyProgress={dailyProgress}
        />
      </div>

      {/* Preset cards */}
      <div className="w-full max-w-2xl mb-5">
        <p className="text-gray-400 text-sm font-bold mb-2 text-center uppercase tracking-wide">
          Choose a Preset
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_IDS.map((id) => {
            const p = PRESETS[id];
            const active = settings.presetId === id;
            return (
              <button
                key={id}
                onClick={() => handlePresetChange(id)}
                className={`p-3 rounded-xl text-left transition-all active:scale-95 border-2 ${
                  active
                    ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20"
                    : "bg-gray-800/60 border-gray-700 hover:border-gray-500"
                }`}
              >
                <p className={`font-bold text-sm sm:text-base ${active ? "text-amber-300" : "text-white"}`}>
                  {p.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme + Mode row */}
      <div className="w-full max-w-2xl flex flex-wrap gap-4 justify-center mb-6">
        {/* Theme selector */}
        <div>
          <p className="text-gray-400 text-xs font-bold mb-1.5 text-center uppercase tracking-wide">
            Theme
          </p>
          <div className="flex gap-1.5">
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
                  settings.themeId === t.id
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode selector */}
        <div>
          <p className="text-gray-400 text-xs font-bold mb-1.5 text-center uppercase tracking-wide">
            Mode
          </p>
          <div className="flex gap-1.5">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleModeChange(opt.value)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
                  settings.gameMode === opt.value
                    ? "bg-amber-500 text-gray-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <button
          onClick={onStartGame}
          className="w-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-extrabold text-xl
            px-8 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-amber-500/30"
        >
          Start Battle!
        </button>
        <div className="flex gap-3 w-full">
          <button
            onClick={onQuickStart}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold text-base
              px-4 py-3 rounded-xl active:scale-95 transition-transform"
          >
            Quick Start
          </button>
          <button
            onClick={onStartPractice}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold text-base
              px-4 py-3 rounded-xl active:scale-95 transition-transform shadow-lg shadow-violet-600/30"
          >
            Practice
          </button>
        </div>

        {/* Multiplayer buttons */}
        <div className="w-full border-t border-gray-700/50 pt-3 mt-1">
          <p className="text-gray-500 text-xs font-bold text-center uppercase tracking-wide mb-2">
            Online Multiplayer
          </p>
          <div className="flex gap-3 w-full">
            <a
              href="/host"
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold text-base
                px-4 py-3 rounded-xl active:scale-95 transition-transform text-center
                shadow-lg shadow-green-600/20"
            >
              Host Match
            </a>
            <a
              href="/join"
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-base
                px-4 py-3 rounded-xl active:scale-95 transition-transform text-center
                shadow-lg shadow-cyan-600/20"
            >
              Join Game
            </a>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex gap-3 mt-5 mb-4">
        <button
          onClick={onOpenSetup}
          className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2
            rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Teacher Setup
        </button>
        <button
          onClick={handleCopyLink}
          className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2
            rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          {copied ? "Copied!" : "Share Link"}
        </button>
      </div>
    </div>
  );
}
