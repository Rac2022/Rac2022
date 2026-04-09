import { getScoreColor } from "@/lib/scoring";

export function ScoreBar({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = getScoreColor(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--muted-foreground)]">{label}</span>
        <span className="font-medium" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--card-border)]">
        <div
          className="h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function OverallScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const color = getScoreColor(score);
  const dims = size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";
  return (
    <div
      className={`flex ${dims} flex-shrink-0 items-center justify-center rounded-xl font-bold tabular-nums`}
      style={{
        backgroundColor: `${color}15`,
        color,
        border: `1px solid ${color}25`,
      }}
    >
      {score}
    </div>
  );
}
