import { getScoreColor } from "@/lib/scoring";

export function ScoreBar({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = getScoreColor(value);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--muted)]">{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--card-border)]">
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function OverallScoreBadge({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {score}
    </div>
  );
}
