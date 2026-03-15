import type { PlayerProfile, BadgeDef } from "@/types/game";

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: "first-win",
    icon: "\u{1F3C5}",
    label: "First Victory",
    description: "Win your first round",
    requirement: { stat: "roundsWon", value: 1 },
  },
  {
    id: "five-wins",
    icon: "\u{1F3C6}",
    label: "Winning Streak",
    description: "Win 5 rounds",
    requirement: { stat: "roundsWon", value: 5 },
  },
  {
    id: "ten-wins",
    icon: "\u{1F451}",
    label: "Champion",
    description: "Win 10 rounds",
    requirement: { stat: "roundsWon", value: 10 },
  },
  {
    id: "streak-5",
    icon: "\u{1F525}",
    label: "Streak Master",
    description: "Reach a streak of 5",
    requirement: { stat: "longestStreak", value: 5 },
  },
  {
    id: "streak-8",
    icon: "\u{1F4A5}",
    label: "Blaze Runner",
    description: "Reach a streak of 8",
    requirement: { stat: "longestStreak", value: 8 },
  },
  {
    id: "daily-3",
    icon: "\u{1F4C5}",
    label: "Daily Warrior",
    description: "Complete 3 daily challenges",
    requirement: { stat: "dailyChallengesCompleted", value: 3 },
  },
  {
    id: "daily-7",
    icon: "\u{1F31F}",
    label: "Weekly Hero",
    description: "Complete 7 daily challenges",
    requirement: { stat: "dailyChallengesCompleted", value: 7 },
  },
  {
    id: "practice-50",
    icon: "\u{1F4DA}",
    label: "Practice Pro",
    description: "Get 50 correct in practice mode",
    requirement: { stat: "practiceCorrect", value: 50 },
  },
  {
    id: "rush-5",
    icon: "\u23F1\uFE0F",
    label: "Rush Hour",
    description: "Complete 5 rush rounds",
    requirement: { stat: "rushRoundsCompleted", value: 5 },
  },
  {
    id: "ten-stars",
    icon: "\u2B50",
    label: "Star Collector",
    description: "Earn 10 stars",
    requirement: { stat: "totalStars", value: 10 },
  },
  {
    id: "xp-500",
    icon: "\u{1F680}",
    label: "XP Hunter",
    description: "Earn 500 total XP",
    requirement: { stat: "totalXp", value: 500 },
  },
];

/** Check which badges a profile has earned */
export function getEarnedBadgeIds(profile: PlayerProfile): string[] {
  return BADGE_DEFS
    .filter((b) => {
      const val = profile[b.requirement.stat];
      return typeof val === "number" && val >= b.requirement.value;
    })
    .map((b) => b.id);
}

/** Find badges newly earned between two profile states */
export function checkNewBadges(before: PlayerProfile, after: PlayerProfile): BadgeDef[] {
  const alreadyUnlocked = new Set(before.unlockedBadges);
  return BADGE_DEFS.filter((b) => {
    if (alreadyUnlocked.has(b.id)) return false;
    const val = after[b.requirement.stat];
    return typeof val === "number" && val >= b.requirement.value;
  });
}
