import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { OverallScoreBadge } from "@/components/ScoreBar";
import { EmptyState } from "@/components/EmptyState";
import { getScoreColor, type SignalStatus } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function WeeklyReviewPage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [recentSignals, allSignals, statusCounts] = await Promise.all([
    prisma.trendSignal.findMany({
      where: { createdAt: { gte: oneWeekAgo } },
      orderBy: { overallScore: "desc" },
    }),
    prisma.trendSignal.findMany({
      orderBy: { overallScore: "desc" },
      take: 5,
    }),
    prisma.trendSignal.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalCount = statusCounts.reduce((sum, s) => sum + s._count.status, 0);
  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.status]),
  );

  const avgScore =
    allSignals.length > 0
      ? Math.round(
          (allSignals.reduce((sum, s) => sum + s.overallScore, 0) /
            allSignals.length) *
            10,
        ) / 10
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weekly Review</h1>
        <p className="text-sm text-[var(--muted)]">
          Signals added in the last 7 days and overall portfolio health.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Signals" value={totalCount} />
        <StatCard label="This Week" value={recentSignals.length} />
        <StatCard
          label="Avg Top-5 Score"
          value={avgScore}
          color={getScoreColor(avgScore)}
        />
        <StatCard
          label="Validated"
          value={statusMap["validated"] ?? 0}
          color="var(--success)"
        />
      </div>

      {/* Status breakdown */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="mb-4 text-sm font-medium text-[var(--muted)]">
          Status Breakdown
        </h2>
        <div className="flex gap-6">
          {(["new", "watch", "validated", "ignore"] as const).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <StatusBadge status={status} />
              <span className="text-lg font-semibold">
                {statusMap[status] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* This week's signals */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">This Week</h2>
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
                className="flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]"
              >
                <OverallScoreBadge score={signal.overallScore} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{signal.title}</span>
                    <StatusBadge status={signal.status as SignalStatus} />
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--muted)] truncate">
                    {signal.summary}
                  </p>
                </div>
                <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                  {signal.createdAt.toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top signals overall */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Top 5 Overall</h2>
        <div className="space-y-2">
          {allSignals.map((signal, i) => (
            <Link
              key={signal.id}
              href={`/signals/${signal.id}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--card-border)] text-sm font-bold text-[var(--muted)]">
                {i + 1}
              </span>
              <OverallScoreBadge score={signal.overallScore} />
              <div className="flex-1 min-w-0">
                <span className="font-medium">{signal.title}</span>
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
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}
