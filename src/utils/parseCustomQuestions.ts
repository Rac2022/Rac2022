import type { CustomQuestion, MathQuestion } from "@/types/game";

/**
 * Parse a single line of custom question text.
 * Expected formats:
 *   7 × 8 = 56
 *   9 + 6 = 15
 *   12 ÷ 3 = 4
 *   7 x 8 = 56
 *   12 / 3 = 4
 */
const LINE_PATTERN = /^(.+?)\s*=\s*(-?\d+)\s*$/;

function normalizeLine(line: string): string {
  return line
    .replace(/x/gi, "\u00d7")
    .replace(/\*/g, "\u00d7")
    .replace(/\//g, "\u00f7");
}

export function parseCustomQuestion(line: string): CustomQuestion | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) return null;

  const normalized = normalizeLine(trimmed);
  const match = normalized.match(LINE_PATTERN);
  if (!match) return null;

  const display = match[1].trim();
  const answer = parseInt(match[2], 10);
  if (isNaN(answer)) return null;

  return { display, answer };
}

export function parseCustomQuestions(text: string): CustomQuestion[] {
  return text
    .split("\n")
    .map(parseCustomQuestion)
    .filter((q): q is CustomQuestion => q !== null);
}

/** Convert a CustomQuestion to a MathQuestion for use in the game engine */
export function customToMathQuestion(cq: CustomQuestion): MathQuestion {
  return {
    a: 0,
    b: 0,
    operator: "+",
    answer: cq.answer,
    display: cq.display,
  };
}

/** Shuffle an array in place (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
