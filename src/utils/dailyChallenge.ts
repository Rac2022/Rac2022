import type { DailyChallenge, DailyChallengeState } from "@/types/game";

const DAILY_KEY = "classroom-clash-daily";

function hashDate(dateStr: string): number {
  let h = 0;
  for (const ch of dateStr) {
    h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
  }
  return Math.abs(h);
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface ChallengeTemplate {
  type: DailyChallenge["type"];
  titleFn: (target: number) => string;
  descFn: (target: number) => string;
  minTarget: number;
  maxTarget: number;
}

const TEMPLATES: ChallengeTemplate[] = [
  {
    type: "correct-count",
    titleFn: (t) => `Get ${t} Correct`,
    descFn: (t) => `Answer ${t} questions correctly in battle mode`,
    minTarget: 8,
    maxTarget: 18,
  },
  {
    type: "streak",
    titleFn: (t) => `Reach Streak ${t}`,
    descFn: (t) => `Get a streak of ${t} in a single round`,
    minTarget: 3,
    maxTarget: 6,
  },
  {
    type: "win-count",
    titleFn: (t) => `Win ${t} Round${t > 1 ? "s" : ""}`,
    descFn: (t) => `Win ${t} battle round${t > 1 ? "s" : ""} today`,
    minTarget: 1,
    maxTarget: 3,
  },
  {
    type: "rush-complete",
    titleFn: () => "Rush Challenge",
    descFn: () => "Complete a rush mode round",
    minTarget: 1,
    maxTarget: 1,
  },
  {
    type: "practice-correct",
    titleFn: (t) => `Practice ${t}`,
    descFn: (t) => `Get ${t} correct answers in practice mode`,
    minTarget: 10,
    maxTarget: 25,
  },
];

/** Generate today's daily challenge deterministically */
export function getTodayChallenge(): DailyChallenge {
  const date = todayStr();
  const h = hashDate(date);

  const template = TEMPLATES[h % TEMPLATES.length];
  const range = template.maxTarget - template.minTarget + 1;
  const target = template.minTarget + (h % range);

  return {
    date,
    title: template.titleFn(target),
    description: template.descFn(target),
    type: template.type,
    target,
    reward: { xp: 50, stars: 3 },
  };
}

/** Load today's daily challenge progress */
export function loadDailyProgress(): DailyChallengeState {
  const date = todayStr();
  if (typeof window === "undefined") return { date, current: 0, completed: false };
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return { date, current: 0, completed: false };
    const state = JSON.parse(raw);
    // Reset if it's a new day
    if (state.date !== date) return { date, current: 0, completed: false };
    return {
      date,
      current: typeof state.current === "number" ? state.current : 0,
      completed: typeof state.completed === "boolean" ? state.completed : false,
    };
  } catch {
    return { date, current: 0, completed: false };
  }
}

/** Save daily challenge progress */
export function saveDailyProgress(state: DailyChallengeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable
  }
}

/** Update daily challenge progress after a game event */
export function updateDailyProgress(
  challenge: DailyChallenge,
  eventData: {
    correctCount?: number;
    maxStreak?: number;
    won?: boolean;
    isRush?: boolean;
    practiceCorrect?: number;
  }
): { state: DailyChallengeState; justCompleted: boolean } {
  const prev = loadDailyProgress();
  if (prev.completed) return { state: prev, justCompleted: false };

  let newCurrent = prev.current;

  switch (challenge.type) {
    case "correct-count":
      newCurrent += eventData.correctCount ?? 0;
      break;
    case "streak":
      newCurrent = Math.max(newCurrent, eventData.maxStreak ?? 0);
      break;
    case "win-count":
      newCurrent += eventData.won ? 1 : 0;
      break;
    case "rush-complete":
      newCurrent += eventData.isRush ? 1 : 0;
      break;
    case "practice-correct":
      newCurrent += eventData.practiceCorrect ?? 0;
      break;
  }

  const completed = newCurrent >= challenge.target;
  const state: DailyChallengeState = {
    date: prev.date,
    current: newCurrent,
    completed,
  };
  saveDailyProgress(state);

  return { state, justCompleted: completed && !prev.completed };
}
