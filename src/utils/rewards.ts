import type {
  RoundCompleteData,
  PracticeResult,
  RoundRewards,
  RewardLine,
  PlayerProfile,
  BadgeDef,
} from "@/types/game";
import { checkNewBadges } from "./unlocks";

// ── Title thresholds ────────────────────────────────────────────────

const TITLE_THRESHOLDS: { xp: number; title: string; icon: string }[] = [
  { xp: 3000, title: "Math Legend", icon: "\u{1F451}" },
  { xp: 1500, title: "Math Champion", icon: "\u{1F3C6}" },
  { xp: 750, title: "Math Warrior", icon: "\u2694\uFE0F" },
  { xp: 300, title: "Math Explorer", icon: "\u{1F9ED}" },
  { xp: 100, title: "Math Rookie", icon: "\u{1F331}" },
  { xp: 0, title: "Beginner", icon: "\u{1F476}" },
];

export function getCurrentTitle(xp: number): { title: string; icon: string } {
  for (const t of TITLE_THRESHOLDS) {
    if (xp >= t.xp) return { title: t.title, icon: t.icon };
  }
  return TITLE_THRESHOLDS[TITLE_THRESHOLDS.length - 1];
}

export function getNextTitle(xp: number): { title: string; xpNeeded: number } | null {
  for (let i = TITLE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (TITLE_THRESHOLDS[i].xp > xp) {
      return { title: TITLE_THRESHOLDS[i].title, xpNeeded: TITLE_THRESHOLDS[i].xp };
    }
  }
  return null;
}

// ── Battle round rewards ────────────────────────────────────────────

export function calculateBattleRewards(
  data: RoundCompleteData,
  profileBefore: PlayerProfile
): RoundRewards {
  const lines: RewardLine[] = [];
  let xp = 0;
  let stars = 0;

  // Correct answers: 5 XP each
  if (data.correctCount > 0) {
    const bonus = data.correctCount * 5;
    xp += bonus;
    lines.push({ label: `${data.correctCount} correct answers`, xp: bonus, stars: 0 });
  }

  // Win bonus
  if (data.won) {
    xp += 25;
    stars += 1;
    lines.push({ label: "Round victory", xp: 25, stars: 1 });
  }

  // Tie
  if (data.tied) {
    xp += 10;
    lines.push({ label: "Hard-fought tie", xp: 10, stars: 0 });
  }

  // Streak milestones
  if (data.maxStreak >= 8) {
    xp += 30;
    stars += 1;
    lines.push({ label: `Streak of ${data.maxStreak}!`, xp: 30, stars: 1 });
  } else if (data.maxStreak >= 5) {
    xp += 20;
    stars += 1;
    lines.push({ label: `Streak of ${data.maxStreak}!`, xp: 20, stars: 1 });
  } else if (data.maxStreak >= 3) {
    xp += 10;
    lines.push({ label: `Streak of ${data.maxStreak}`, xp: 10, stars: 0 });
  }

  // Rush completion bonus
  if (data.isRush) {
    xp += 15;
    lines.push({ label: "Rush round completed", xp: 15, stars: 0 });
  }

  // Build updated profile to check new badges
  const profileAfter: PlayerProfile = {
    ...profileBefore,
    totalXp: profileBefore.totalXp + xp,
    totalStars: profileBefore.totalStars + stars,
    roundsPlayed: profileBefore.roundsPlayed + 1,
    roundsWon: profileBefore.roundsWon + (data.won ? 1 : 0),
    longestStreak: Math.max(profileBefore.longestStreak, data.maxStreak),
    rushRoundsCompleted: profileBefore.rushRoundsCompleted + (data.isRush ? 1 : 0),
  };

  const newBadges = checkNewBadges(profileBefore, profileAfter);

  // Bonus for new badges
  for (const badge of newBadges) {
    xp += 20;
    stars += 1;
    lines.push({ label: `Badge: ${badge.label}`, xp: 20, stars: 1 });
  }

  return { xp, stars, lines, newBadges };
}

// ── Practice rewards ────────────────────────────────────────────────

export function calculatePracticeRewards(
  data: PracticeResult,
  profileBefore: PlayerProfile
): RoundRewards {
  const lines: RewardLine[] = [];
  let xp = 0;
  let stars = 0;

  // 3 XP per correct
  if (data.correctCount > 0) {
    const bonus = data.correctCount * 3;
    xp += bonus;
    lines.push({ label: `${data.correctCount} correct in practice`, xp: bonus, stars: 0 });
  }

  // Streak milestone
  if (data.maxStreak >= 5) {
    xp += 15;
    stars += 1;
    lines.push({ label: `Practice streak of ${data.maxStreak}!`, xp: 15, stars: 1 });
  } else if (data.maxStreak >= 3) {
    xp += 5;
    lines.push({ label: `Practice streak of ${data.maxStreak}`, xp: 5, stars: 0 });
  }

  // 10+ correct bonus
  if (data.correctCount >= 10) {
    stars += 1;
    lines.push({ label: "10+ correct bonus", xp: 0, stars: 1 });
  }

  const profileAfter: PlayerProfile = {
    ...profileBefore,
    totalXp: profileBefore.totalXp + xp,
    totalStars: profileBefore.totalStars + stars,
    practiceCorrect: profileBefore.practiceCorrect + data.correctCount,
    longestStreak: Math.max(profileBefore.longestStreak, data.maxStreak),
  };

  const newBadges = checkNewBadges(profileBefore, profileAfter);

  for (const badge of newBadges) {
    xp += 20;
    stars += 1;
    lines.push({ label: `Badge: ${badge.label}`, xp: 20, stars: 1 });
  }

  return { xp, stars, lines, newBadges };
}
