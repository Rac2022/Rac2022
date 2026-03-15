"use client";

import type { PlayerProfile, DailyChallenge, DailyChallengeState } from "@/types/game";
import { getCurrentTitle, getNextTitle } from "@/utils/rewards";
import { BADGE_DEFS } from "@/utils/unlocks";

interface PlayerProgressProps {
  profile: PlayerProfile;
  dailyChallenge: DailyChallenge;
  dailyProgress: DailyChallengeState;
}

export default function PlayerProgress({
  profile,
  dailyChallenge,
  dailyProgress,
}: PlayerProgressProps) {
  const { title, icon: titleIcon } = getCurrentTitle(profile.totalXp);
  const next = getNextTitle(profile.totalXp);

  // XP progress toward next title
  const progressPct = next
    ? Math.min(100, (profile.totalXp / next.xpNeeded) * 100)
    : 100;

  // Daily challenge progress
  const dailyPct = Math.min(100, (dailyProgress.current / dailyChallenge.target) * 100);

  return (
    <div className="w-full max-w-2xl">
      {/* Profile summary row */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3">
        {/* Title + XP */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-white">
            {titleIcon} {title}
          </p>
          <p className="text-xs text-gray-400 font-bold">
            {profile.totalXp} XP
            {next && <span className="text-gray-500"> / {next.xpNeeded} to {next.title}</span>}
          </p>
        </div>

        {/* Stars */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-amber-400">
            {"\u2B50"} {profile.totalStars}
          </p>
          <p className="text-xs text-gray-400 font-bold">Stars</p>
        </div>

        {/* Wins */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-green-400">
            {profile.roundsWon}
          </p>
          <p className="text-xs text-gray-400 font-bold">Wins</p>
        </div>
      </div>

      {/* XP progress bar */}
      {next && (
        <div className="mx-auto max-w-xs mb-3">
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Badges (compact row) */}
      {profile.unlockedBadges.length > 0 && (
        <div className="flex items-center justify-center gap-1 mb-3 flex-wrap">
          {BADGE_DEFS.filter((b) => profile.unlockedBadges.includes(b.id)).map((b) => (
            <span
              key={b.id}
              title={`${b.label}: ${b.description}`}
              className="text-lg sm:text-xl cursor-default"
            >
              {b.icon}
            </span>
          ))}
        </div>
      )}

      {/* Daily Challenge card */}
      <div className={`mx-auto max-w-sm rounded-xl border p-3 ${
        dailyProgress.completed
          ? "bg-green-900/20 border-green-600/40"
          : "bg-gray-800/60 border-gray-700"
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {"\u{1F4C5}"} Daily Challenge
          </p>
          {dailyProgress.completed ? (
            <span className="text-xs font-bold text-green-400 bg-green-900/40 px-2 py-0.5 rounded">
              {"\u2714"} Complete!
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-500 tabular-nums">
              {dailyProgress.current}/{dailyChallenge.target}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-white">{dailyChallenge.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{dailyChallenge.description}</p>
        {!dailyProgress.completed && (
          <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-full transition-all duration-500"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
        )}
        <p className="text-[10px] text-gray-500 mt-1">
          Reward: +{dailyChallenge.reward.xp} XP, +{dailyChallenge.reward.stars} {"\u2B50"}
        </p>
      </div>
    </div>
  );
}
