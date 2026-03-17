"use client";

import { PRESETS, PRESET_IDS } from "@/utils/presets";
import { THEMES } from "@/utils/themes";
import type {
  RoomPlayer,
  GameSettings,
  PresetId,
  ThemeId,
  GameMode,
  TeamId,
} from "@/types/game";

const MODE_OPTIONS: { value: GameMode; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "rush-30", label: "30s Rush" },
  { value: "rush-60", label: "60s Rush" },
];

const THEME_LIST = Object.values(THEMES) as {
  id: ThemeId;
  label: string;
  icon: string;
}[];

interface HostLobbyProps {
  roomCode: string;
  players: RoomPlayer[];
  settings: GameSettings;
  onSettingsChange: (s: GameSettings) => void;
  onSwapTeam: (playerId: string, newTeam: TeamId) => void;
  onStartMatch: () => void;
  onClose: () => void;
}

export default function HostLobby({
  roomCode,
  players,
  settings,
  onSettingsChange,
  onSwapTeam,
  onStartMatch,
  onClose,
}: HostLobbyProps) {
  const team1Players = players.filter((p) => p.team === 1);
  const team2Players = players.filter((p) => p.team === 2);
  const canStart = team1Players.length > 0 && team2Players.length > 0;

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

  return (
    <div className="h-dvh w-full flex flex-col items-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 overflow-y-auto select-none p-4">
      {/* Header */}
      <div className="text-center mb-4 mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Host a Match
        </h1>
        <p className="text-gray-400 mt-1">
          Share this code with players to join
        </p>
      </div>

      {/* Room Code Display */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-6 text-center border-2 border-amber-500/50 shadow-lg shadow-amber-500/10">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-wide mb-1">
          Room Code
        </p>
        <p className="text-5xl sm:text-6xl font-extrabold text-amber-400 tracking-[0.3em] font-mono">
          {roomCode}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Go to <span className="text-amber-300 font-bold">/join</span> on your
          device
        </p>
      </div>

      {/* Connected Players */}
      <div className="w-full max-w-lg mb-6">
        <p className="text-gray-400 text-sm font-bold mb-2 text-center uppercase tracking-wide">
          Players ({players.length})
        </p>
        <div className="grid grid-cols-2 gap-3">
          {/* Team 1 */}
          <div className="bg-blue-900/30 rounded-xl p-3 border border-blue-700/50">
            <p className="text-blue-400 font-bold text-sm mb-2 text-center">
              Team 1
            </p>
            {team1Players.length === 0 && (
              <p className="text-gray-500 text-xs text-center py-2">
                Waiting for players...
              </p>
            )}
            {team1Players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-blue-900/40 rounded-lg px-3 py-2 mb-1"
              >
                <span className="text-white font-medium text-sm truncate">
                  {p.name}
                </span>
                <button
                  onClick={() => onSwapTeam(p.id, 2)}
                  className="text-xs text-blue-300 hover:text-white bg-blue-800/50 px-2 py-0.5 rounded"
                >
                  → T2
                </button>
              </div>
            ))}
          </div>

          {/* Team 2 */}
          <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/50">
            <p className="text-red-400 font-bold text-sm mb-2 text-center">
              Team 2
            </p>
            {team2Players.length === 0 && (
              <p className="text-gray-500 text-xs text-center py-2">
                Waiting for players...
              </p>
            )}
            {team2Players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-red-900/40 rounded-lg px-3 py-2 mb-1"
              >
                <span className="text-white font-medium text-sm truncate">
                  {p.name}
                </span>
                <button
                  onClick={() => onSwapTeam(p.id, 1)}
                  className="text-xs text-red-300 hover:text-white bg-red-800/50 px-2 py-0.5 rounded"
                >
                  → T1
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preset selector */}
      <div className="w-full max-w-lg mb-4">
        <p className="text-gray-400 text-xs font-bold mb-2 text-center uppercase tracking-wide">
          Preset
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_IDS.map((id) => {
            const p = PRESETS[id];
            const active = settings.presetId === id;
            return (
              <button
                key={id}
                onClick={() => handlePresetChange(id)}
                className={`p-2 rounded-xl text-left transition-all active:scale-95 border-2 ${
                  active
                    ? "bg-amber-500/20 border-amber-500"
                    : "bg-gray-800/60 border-gray-700 hover:border-gray-500"
                }`}
              >
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    active ? "text-amber-300" : "text-white"
                  }`}
                >
                  {p.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme + Mode */}
      <div className="w-full max-w-lg flex flex-wrap gap-4 justify-center mb-6">
        <div>
          <p className="text-gray-400 text-xs font-bold mb-1 text-center uppercase tracking-wide">
            Theme
          </p>
          <div className="flex gap-1">
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95 ${
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

        <div>
          <p className="text-gray-400 text-xs font-bold mb-1 text-center uppercase tracking-wide">
            Mode
          </p>
          <div className="flex gap-1">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleModeChange(opt.value)}
                className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95 ${
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
      <div className="flex flex-col items-center gap-3 w-full max-w-xs mb-6">
        <button
          onClick={onStartMatch}
          disabled={!canStart}
          className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-extrabold text-xl
            px-8 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-green-500/30
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {canStart ? "Start Match!" : "Need players on both teams"}
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-sm font-medium px-3 py-2
            rounded-lg hover:bg-gray-800 transition-colors active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
