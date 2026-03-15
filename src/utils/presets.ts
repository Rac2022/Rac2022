import type { PresetId, PresetConfig } from "@/types/game";

export const PRESETS: Record<PresetId, PresetConfig> = {
  "grade2-warmup": {
    id: "grade2-warmup",
    label: "Grade 2 Warmup",
    description: "Simple addition & subtraction, small numbers",
    difficulty: "easy",
    operatorMode: "mixed",
    gameMode: "classic",
    winZone: 5,
    themeId: "dino",
    questionRules: {
      minNumber: 1,
      maxNumber: 10,
      allowedOperators: ["+", "-"],
      allowRegrouping: false,
      requireWholeNumberDivision: true,
      allowNegatives: false,
    },
  },

  "grade2-mixed": {
    id: "grade2-mixed",
    label: "Grade 2 Mixed",
    description: "Addition, subtraction & early multiplication",
    difficulty: "easy",
    operatorMode: "mixed",
    gameMode: "classic",
    winZone: 5,
    themeId: "dino",
    questionRules: {
      minNumber: 1,
      maxNumber: 15,
      allowedOperators: ["+", "-", "×"],
      allowRegrouping: false,
      requireWholeNumberDivision: true,
      allowNegatives: false,
    },
  },

  "grade3-facts": {
    id: "grade3-facts",
    label: "Grade 3 Facts",
    description: "All four operations with regrouping",
    difficulty: "medium",
    operatorMode: "mixed",
    gameMode: "classic",
    winZone: 5,
    themeId: "classic",
    questionRules: {
      minNumber: 2,
      maxNumber: 20,
      allowedOperators: ["+", "-", "×", "÷"],
      allowRegrouping: true,
      requireWholeNumberDivision: true,
      allowNegatives: false,
    },
  },

  "grade3-rush": {
    id: "grade3-rush",
    label: "Grade 3 Rush",
    description: "Timed 60s with all four operations",
    difficulty: "medium",
    operatorMode: "mixed",
    gameMode: "rush-60",
    winZone: 5,
    themeId: "space",
    questionRules: {
      minNumber: 2,
      maxNumber: 20,
      allowedOperators: ["+", "-", "×", "÷"],
      allowRegrouping: true,
      requireWholeNumberDivision: true,
      allowNegatives: false,
    },
  },

  "grade4-challenge": {
    id: "grade4-challenge",
    label: "Grade 4 Challenge",
    description: "Larger numbers, all operations, longer pull",
    difficulty: "hard",
    operatorMode: "mixed",
    gameMode: "classic",
    winZone: 7,
    themeId: "soccer",
    questionRules: {
      minNumber: 5,
      maxNumber: 50,
      allowedOperators: ["+", "-", "×", "÷"],
      allowRegrouping: true,
      requireWholeNumberDivision: true,
      allowNegatives: false,
    },
  },

  "grade5-battle": {
    id: "grade5-battle",
    label: "Grade 5+ Battle",
    description: "Big numbers, negatives allowed, 30s rush",
    difficulty: "hard",
    operatorMode: "mixed",
    gameMode: "rush-30",
    winZone: 7,
    themeId: "space",
    questionRules: {
      minNumber: 10,
      maxNumber: 100,
      allowedOperators: ["+", "-", "×", "÷"],
      allowRegrouping: true,
      requireWholeNumberDivision: true,
      allowNegatives: true,
    },
  },
};

export const PRESET_IDS = Object.keys(PRESETS) as PresetId[];

export function getPreset(id: PresetId): PresetConfig {
  return PRESETS[id];
}
