import { SCORE_WEIGHTS } from "@/lib/scoring";
import type { TrendSignal } from "@/generated/prisma/client";

export function ScoreExplanation({ signal }: { signal: TrendSignal }) {
  const contributions = [
    { label: "Novelty", value: signal.noveltyScore, weight: SCORE_WEIGHTS.noveltyScore, result: signal.noveltyScore * SCORE_WEIGHTS.noveltyScore },
    { label: "Social Velocity", value: signal.socialVelocityScore, weight: SCORE_WEIGHTS.socialVelocityScore, result: signal.socialVelocityScore * SCORE_WEIGHTS.socialVelocityScore },
    { label: "Search Volume", value: signal.searchVolumeScore, weight: SCORE_WEIGHTS.searchVolumeScore, result: signal.searchVolumeScore * SCORE_WEIGHTS.searchVolumeScore },
    { label: "Monetization", value: signal.monetizationEaseScore, weight: SCORE_WEIGHTS.monetizationEaseScore, result: signal.monetizationEaseScore * SCORE_WEIGHTS.monetizationEaseScore },
    { label: "Saturation", value: signal.saturationScore, weight: SCORE_WEIGHTS.saturationScore, result: signal.saturationScore * SCORE_WEIGHTS.saturationScore },
  ];

  const rawTotal = contributions.reduce((sum, c) => sum + c.result, 0);

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4 space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        How is this score calculated?
      </h3>
      <div className="space-y-1.5 font-mono text-xs">
        {contributions.map((c) => (
          <div key={c.label} className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">
              {c.label} ({c.value}) x {c.weight > 0 ? "+" : ""}{(c.weight * 100).toFixed(0)}%
            </span>
            <span className={c.result < 0 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}>
              {c.result < 0 ? "" : "+"}{c.result.toFixed(1)}
            </span>
          </div>
        ))}
        <div className="border-t border-[var(--card-border)] pt-1.5 flex items-center justify-between font-semibold">
          <span className="text-[var(--muted-foreground)]">Overall Score</span>
          <span className="text-[var(--foreground)]">{Math.round(Math.max(0, Math.min(100, rawTotal)) * 10) / 10}</span>
        </div>
      </div>
      <p className="text-[11px] text-[var(--muted)] leading-relaxed">
        Saturation uses inverse weighting — high saturation reduces the overall score.
        All scores are clamped to 0–100.
      </p>
    </div>
  );
}
