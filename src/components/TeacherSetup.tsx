"use client";

import { useState } from "react";
import { PRESETS, PRESET_IDS } from "@/utils/presets";
import { THEMES } from "@/utils/themes";
import { parseCustomQuestions } from "@/utils/parseCustomQuestions";
import { buildShareUrl } from "@/utils/urlConfig";
import { DEFAULT_SETTINGS } from "@/utils/storage";
import type {
  GameSettings,
  PresetId,
  ThemeId,
  GameMode,
  Difficulty,
  OperatorMode,
} from "@/types/game";

const WIN_ZONE_OPTIONS = [3, 5, 7, 9];

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

const MODE_OPTIONS: { value: GameMode; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "rush-30", label: "30s Rush" },
  { value: "rush-60", label: "60s Rush" },
];

const THEME_LIST = (
  Object.values(THEMES) as { id: ThemeId; label: string; icon: string }[]
);

interface TeacherSetupProps {
  open: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (s: GameSettings) => void;
}

function OptionRow<T extends string>({
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
    <div>
      <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
              value === opt.value
                ? "bg-amber-500 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TeacherSetup({
  open,
  onClose,
  settings,
  onSettingsChange,
}: TeacherSetupProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const customParsed = parseCustomQuestions(settings.customQuestionsText);
  const customCount = customParsed.length;

  const update = (partial: Partial<GameSettings>) => {
    onSettingsChange({ ...settings, ...partial });
  };

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

  const handleReset = () => {
    onSettingsChange({ ...DEFAULT_SETTINGS });
  };

  const handleCopyLink = async () => {
    const url = buildShareUrl(settings);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Non-critical
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        style={{ animation: "fade-in 0.2s ease-out" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gray-900 z-50 overflow-y-auto
          border-l border-gray-700 shadow-2xl"
        style={{ animation: "slide-in-right 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-extrabold text-white">Teacher Setup</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700
              text-gray-400 hover:text-white text-xl font-bold active:scale-95 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-4 flex flex-col gap-5">
          {/* Preset */}
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Preset
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_IDS.map((id) => {
                const p = PRESETS[id];
                const active = settings.presetId === id;
                return (
                  <button
                    key={id}
                    onClick={() => handlePresetChange(id)}
                    className={`p-2.5 rounded-lg text-left transition-all active:scale-95 border ${
                      active
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-gray-800 border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <p className={`font-bold text-xs ${active ? "text-amber-300" : "text-white"}`}>
                      {p.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Theme
            </p>
            <div className="flex flex-wrap gap-1.5">
              {THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ themeId: t.id })}
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

          {/* Mode */}
          <OptionRow
            label="Game Mode"
            options={MODE_OPTIONS}
            value={settings.gameMode}
            onChange={(v) => update({ gameMode: v })}
          />

          {/* Difficulty */}
          <OptionRow
            label="Difficulty"
            options={DIFFICULTY_OPTIONS}
            value={settings.difficulty}
            onChange={(v) => update({ difficulty: v })}
          />

          {/* Operator */}
          <OptionRow
            label="Operators"
            options={OPERATOR_OPTIONS}
            value={settings.operatorMode}
            onChange={(v) => update({ operatorMode: v })}
          />

          {/* Win Zone */}
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Pull Distance (Win Zone)
            </p>
            <div className="flex gap-1.5">
              {WIN_ZONE_OPTIONS.map((wz) => (
                <button
                  key={wz}
                  onClick={() => update({ winZone: wz })}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
                    settings.winZone === wz
                      ? "bg-amber-500 text-gray-900"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {wz}
                </button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Sound
            </p>
            <button
              onClick={() => update({ soundEnabled: !settings.soundEnabled })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors active:scale-95 ${
                settings.soundEnabled
                  ? "bg-amber-500 text-gray-900"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {settings.soundEnabled ? "\u{1F50A} Sound On" : "\u{1F507} Muted"}
            </button>
          </div>

          {/* Custom Questions */}
          <div>
            <p className="text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wide">
              Custom Questions
            </p>
            <p className="text-gray-500 text-xs mb-2 leading-relaxed">
              Enter one question per line. Format: <code className="text-gray-400">7 x 8 = 56</code>
            </p>
            <textarea
              value={settings.customQuestionsText}
              onChange={(e) => update({ customQuestionsText: e.target.value })}
              placeholder={"7 x 8 = 56\n9 + 6 = 15\n12 / 3 = 4"}
              rows={6}
              className="w-full bg-gray-800 text-white text-sm rounded-lg p-3 border border-gray-700
                focus:border-amber-500 focus:outline-none resize-y placeholder-gray-600
                font-mono leading-relaxed"
            />
            <p className={`text-xs mt-1 font-medium ${customCount > 0 ? "text-green-400" : "text-gray-500"}`}>
              {customCount > 0
                ? `${customCount} valid question${customCount === 1 ? "" : "s"} found`
                : "No valid questions yet"}
            </p>
            {settings.customQuestionsText.trim() && customCount === 0 && (
              <p className="text-xs text-red-400 mt-0.5">
                Check format: each line should be like &quot;7 x 8 = 56&quot;
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
            <button
              onClick={handleCopyLink}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm
                px-4 py-3 rounded-xl active:scale-95 transition-transform"
            >
              {copied ? "Link Copied!" : "Copy Share Link"}
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-bold text-sm
                px-4 py-3 rounded-xl active:scale-95 transition-transform"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
