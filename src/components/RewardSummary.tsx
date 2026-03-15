"use client";

import type { RoundRewards } from "@/types/game";

interface RewardSummaryProps {
  rewards: RoundRewards;
}

export default function RewardSummary({ rewards }: RewardSummaryProps) {
  if (rewards.lines.length === 0) return null;

  return (
    <div className="mt-4 bg-black/30 rounded-xl p-3 sm:p-4 max-w-xs mx-auto border border-white/10"
      style={{ animation: "fade-in 0.5s ease-out 0.3s both" }}
    >
      <div className="space-y-1">
        {rewards.lines.map((line, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-white/70">{line.label}</span>
            <span className="font-bold text-amber-300 tabular-nums">
              {line.xp > 0 && `+${line.xp} XP`}
              {line.xp > 0 && line.stars > 0 && "  "}
              {line.stars > 0 && `+${line.stars} \u2B50`}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
        <span className="text-white font-bold text-sm">Total</span>
        <span className="font-extrabold text-amber-300">
          +{rewards.xp} XP{rewards.stars > 0 && `  +${rewards.stars} \u2B50`}
        </span>
      </div>

      {/* New badge notifications */}
      {rewards.newBadges.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/10">
          {rewards.newBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-2 py-1"
              style={{ animation: "bounceIn 0.5s ease-out 0.6s both" }}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-sm font-bold text-amber-300">Badge Unlocked!</p>
                <p className="text-xs text-white/70">{badge.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
