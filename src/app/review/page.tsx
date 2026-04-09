import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { OverallScoreBadge } from "@/components/ScoreBar";
import { EmptyState } from "@/components/EmptyState";
import { ScoreDistributionChart, SourceTypeChart, StatusBreakdownChart } from "@/components/Charts";
import { getScoreColor, type SignalStatus } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [recentSignals, topSignals, allSignals, statusCounts, sourceTypeCounts] = await Promise.all([
    prisma.trendSignal.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      orderBy: { overallScore: "desc" },
    }),
    prisma.trendSignal.findMany({
      orderBy: { overallScore: "desc" },
      take: 5,
    }),
    prisma.trendSignal.findMany(),
    prisma.trendSignal.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.trendSignal.groupBy({
      by: ["sourceType"],
      _count: { sourceType: true },
      orderBy: { _count: { sourceType: "desc" } },
    }),
  ]);

  const totalCount = allSignals.length;
  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status]),
  );

  const avgScore =
    topSignals.length > 0
      ? Math.round(
          (topSignals.reduce((sum, s) => sum + s.overallScore, 0) / topSignals.length) * 10,
        ) / 10
      : 0;

  // Score distribution buckets
  const scoreBuckets = [
    { label: "0–20", min: 0, max: 20, color: "#ef4444" },
    { label: "20–40", min: 20, max: 40, color: "#f97316" },
    { label: "40–60", min: 40, max: 60, color: "#f59e0b" },
    { label: "60–80", min: 60, max: 80, color: "#22c55e" },
    { label: "80+", min: 80, max: 101, color: "#10b981" },
  ].map((b) => ({
    ...b,
    count: allSignals.filter((s) => s.overallScore >= b.min && s.overallScore < b.max).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Portfolio health and signal analytics.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Signals" value={totalCount} />
        <StatCard label="This Week" value={recentSignals.length} />
        <StatCard label="Avg Top-5" value={avgScore} color={getScoreColor(avgScore)} />
        <StatCard label="Validated" value={statusMap["validated"] ?? 0} color="#22c55e" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <ScoreDistributionChart buckets={scoreBuckets} />
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <SourceTypeChart
            data={sourceTypeCounts.map((s) => ({
              sourceType: s.sourceType,
              count: s._count.sourceType,
            }))}
          />
        </div>
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <StatusBreakdownChart data={statusMap} />
        </div>
      </div>

      {/* This week's signals */}
      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">This Week</h2>
        {recentSignals.length === 0 ? (
          <EmptyState
            title="No signals this week"
            description="Add some trend signals to see them in your weekly review."
            action={
              <Link
                href="/signals/new"
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              >
                Add Signal
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {recentSignals.map((signal) => (
              <Link
                key={signal.id}
                href={`/signals/${signal.id}`}
                className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]"
              >
                <OverallScoreBadge score={signal.overallScore} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium tracking-tight truncate">{signal.title}</span>
                    <StatusBadge status={signal.status as SignalStatus} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-[var(--muted)] truncate">
                    {signal.summary}
                  </p>
                </div>
                <span className="hidden sm:block text-xs text-[var(--muted)] whitespace-nowrap tabular-nums">
                  {signal.createdAt.toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 */}
      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Top 5 Overall</h2>
        <div className="space-y-2">
          {topSignals.map((signal, i) => (
            <Link
              key={signal.id}
              href={`/signals/${signal.id}`}
              className="flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-sm font-bold text-[var(--muted)] tabular-nums">
                {i + 1}
              </span>
              <OverallScoreBadge score={signal.overallScore} size="sm" />
              <div className="flex-1 min-w-0">
                <span className="font-medium tracking-tight">{signal.title}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusBadge status={signal.status as SignalStatus} />
                  <span className="text-xs text-[var(--muted)]">{signal.source}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}
