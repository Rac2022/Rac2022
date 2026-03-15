import type { GameSettings, PresetId, ThemeId, GameMode } from "@/types/game";

const PRESET_MAP: Record<string, PresetId> = {
  "grade2warmup": "grade2-warmup",
  "grade2-warmup": "grade2-warmup",
  "grade2mixed": "grade2-mixed",
  "grade2-mixed": "grade2-mixed",
  "grade3facts": "grade3-facts",
  "grade3-facts": "grade3-facts",
  "grade3rush": "grade3-rush",
  "grade3-rush": "grade3-rush",
  "grade4challenge": "grade4-challenge",
  "grade4-challenge": "grade4-challenge",
  "grade5battle": "grade5-battle",
  "grade5-battle": "grade5-battle",
};

const THEME_MAP: Record<string, ThemeId> = {
  classic: "classic",
  space: "space",
  dino: "dino",
  soccer: "soccer",
};

const MODE_MAP: Record<string, GameMode> = {
  classic: "classic",
  "rush-30": "rush-30",
  "rush30": "rush-30",
  "rush-60": "rush-60",
  "rush60": "rush-60",
};

/** Parse URL search params into a partial settings override */
export function parseUrlConfig(search: string): Partial<GameSettings> {
  const params = new URLSearchParams(search);
  const result: Partial<GameSettings> = {};

  const preset = params.get("preset");
  if (preset && PRESET_MAP[preset.toLowerCase()]) {
    result.presetId = PRESET_MAP[preset.toLowerCase()];
  }

  const theme = params.get("theme");
  if (theme && THEME_MAP[theme.toLowerCase()]) {
    result.themeId = THEME_MAP[theme.toLowerCase()];
  }

  const mode = params.get("mode");
  if (mode && MODE_MAP[mode.toLowerCase()]) {
    result.gameMode = MODE_MAP[mode.toLowerCase()];
  }

  const custom = params.get("custom");
  if (custom === "1") {
    // Flag presence — lobby will enable custom mode
    result.customQuestionsText = "__custom__";
  }

  return result;
}

/** Build a shareable URL from current settings */
export function buildShareUrl(settings: GameSettings): string {
  if (typeof window === "undefined") return "";
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set("preset", settings.presetId);
  params.set("theme", settings.themeId);
  params.set("mode", settings.gameMode);
  if (settings.customQuestionsText.trim()) {
    params.set("custom", "1");
  }
  return `${base}?${params.toString()}`;
}

/** Check if the current URL has game config params */
export function hasUrlConfig(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.has("preset") || params.has("theme") || params.has("mode");
}
