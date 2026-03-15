import type { PlayerProfile } from "@/types/game";

const PROFILE_KEY = "classroom-clash-profile";

export const DEFAULT_PROFILE: PlayerProfile = {
  totalXp: 0,
  totalStars: 0,
  roundsPlayed: 0,
  roundsWon: 0,
  longestStreak: 0,
  dailyChallengesCompleted: 0,
  practiceCorrect: 0,
  rushRoundsCompleted: 0,
  unlockedBadges: [],
};

export function loadProfile(): PlayerProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const p = JSON.parse(raw);
    return {
      totalXp: typeof p.totalXp === "number" ? p.totalXp : 0,
      totalStars: typeof p.totalStars === "number" ? p.totalStars : 0,
      roundsPlayed: typeof p.roundsPlayed === "number" ? p.roundsPlayed : 0,
      roundsWon: typeof p.roundsWon === "number" ? p.roundsWon : 0,
      longestStreak: typeof p.longestStreak === "number" ? p.longestStreak : 0,
      dailyChallengesCompleted: typeof p.dailyChallengesCompleted === "number" ? p.dailyChallengesCompleted : 0,
      practiceCorrect: typeof p.practiceCorrect === "number" ? p.practiceCorrect : 0,
      rushRoundsCompleted: typeof p.rushRoundsCompleted === "number" ? p.rushRoundsCompleted : 0,
      unlockedBadges: Array.isArray(p.unlockedBadges) ? p.unlockedBadges : [],
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage full or unavailable
  }
}
