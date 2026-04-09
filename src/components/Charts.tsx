import { STATUS_CONFIG, SOURCE_TYPE_LABELS, type SignalStatus, type SourceType } from "@/lib/scoring";

// --- Bar Chart for score distribution ---

export function ScoreDistributionChart({
  buckets,
}: {
  buckets: { label: string; count: number; color: string }[];
}) {
  const max = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        Score Distribution
      </h3>
      <div className="flex items-end gap-2 h-28">
        {buckets.map((bucket) => {
          const pct = (bucket.count / max) * 100;
          return (
            <div key={bucket.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[11px] font-semibold tabular-nums" style={{ color: bucket.color }}>
                {bucket.count}
              </span>
              <div className="w-full rounded-t-md" style={{
                height: `${Math.max(pct, 4)}%`,
                backgroundColor: `${bucket.color}30`,
                border: `1px solid ${bucket.color}50`,
                borderBottom: "none",
              }} />
              <span className="text-[10px] text-[var(--muted)]">{bucket.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Donut-style chart for source types ---

export function SourceTypeChart({
  data,
}: {
  data: { sourceType: string; count: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#22c55e", "#06b6d4", "#6b7280"];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        Source Types
      </h3>
      <div className="flex gap-4 items-center">
        {/* Stacked bar */}
        <div className="flex h-3 flex-1 overflow-hidden rounded-full">
          {data.map((d, i) => (
            <div
              key={d.sourceType}
              style={{
                width: `${(d.count / total) * 100}%`,
                backgroundColor: COLORS[i % COLORS.length],
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <div key={d.sourceType} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-[var(--muted-foreground)]">
              {SOURCE_TYPE_LABELS[d.sourceType as SourceType] ?? d.sourceType}
            </span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Horizontal bars for status breakdown ---

export function StatusBreakdownChart({
  data,
}: {
  data: Record<string, number>;
}) {
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        Status Breakdown
      </h3>
      <div className="space-y-2">
        {(Object.keys(STATUS_CONFIG) as SignalStatus[]).map((status) => {
          const count = data[status] ?? 0;
          const pct = (count / total) * 100;
          const config = STATUS_CONFIG[status];
          return (
            <div key={status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: config.color }} className="font-medium">
                  {config.label}
                </span>
                <span className="tabular-nums text-[var(--muted-foreground)]">
                  {count} ({Math.round(pct)}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--card-border)]">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: config.color,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
