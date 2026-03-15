import type { GameSettings, PresetId, ThemeId, GameMode, Difficulty, OperatorMode } from "@/types/game";

const STORAGE_KEY = "classroom-clash-settings";
const CUSTOM_Q_KEY = "classroom-clash-custom-questions";

export const DEFAULT_SETTINGS: GameSettings = {
  presetId: "grade2-warmup",
  themeId: "dino",
  gameMode: "classic",
  difficulty: "easy",
  operatorMode: "mixed",
  winZone: 5,
  soundEnabled: true,
  customQuestionsText: "",
};

const VALID_PRESETS = new Set<string>([
  "grade2-warmup", "grade2-mixed", "grade3-facts",
  "grade3-rush", "grade4-challenge", "grade5-battle",
]);
const VALID_THEMES = new Set<string>(["classic", "space", "dino", "soccer"]);
const VALID_MODES = new Set<string>(["classic", "rush-30", "rush-60"]);
const VALID_DIFFICULTIES = new Set<string>(["easy", "medium", "hard", "mixed"]);
const VALID_OPERATORS = new Set<string>(["+", "-", "\u00d7", "\u00f7", "mixed"]);

function isValidPreset(v: unknown): v is PresetId {
  return typeof v === "string" && VALID_PRESETS.has(v);
}
function isValidTheme(v: unknown): v is ThemeId {
  return typeof v === "string" && VALID_THEMES.has(v);
}
function isValidMode(v: unknown): v is GameMode {
  return typeof v === "string" && VALID_MODES.has(v);
}
function isValidDifficulty(v: unknown): v is Difficulty {
  return typeof v === "string" && VALID_DIFFICULTIES.has(v);
}
function isValidOperator(v: unknown): v is OperatorMode {
  return typeof v === "string" && VALID_OPERATORS.has(v);
}

export function loadSettings(): GameSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      presetId: isValidPreset(parsed.presetId) ? parsed.presetId : DEFAULT_SETTINGS.presetId,
      themeId: isValidTheme(parsed.themeId) ? parsed.themeId : DEFAULT_SETTINGS.themeId,
      gameMode: isValidMode(parsed.gameMode) ? parsed.gameMode : DEFAULT_SETTINGS.gameMode,
      difficulty: isValidDifficulty(parsed.difficulty) ? parsed.difficulty : DEFAULT_SETTINGS.difficulty,
      operatorMode: isValidOperator(parsed.operatorMode) ? parsed.operatorMode : DEFAULT_SETTINGS.operatorMode,
      winZone: typeof parsed.winZone === "number" && [3, 5, 7, 9].includes(parsed.winZone)
        ? parsed.winZone
        : DEFAULT_SETTINGS.winZone,
      soundEnabled: typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      customQuestionsText: typeof parsed.customQuestionsText === "string"
        ? parsed.customQuestionsText
        : DEFAULT_SETTINGS.customQuestionsText,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}
