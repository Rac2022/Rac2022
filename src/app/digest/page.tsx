import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { OverallScoreBadge } from "@/components/ScoreBar";
import { EmptyState } from "@/components/EmptyState";
import { getScoreColor, type SignalStatus } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function DigestPage() {
  const allSignals = await prisma.trendSignal.findMany({
    orderBy: { overallScore: "desc" },
  });

  if (allSignals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Weekly Digest</h1>
          <p className="mt-0.5 text-sm text-[var(--muted)]">Curated opportunity categories from your signals.</p>
        </div>
        <EmptyState
          title="No signals yet"
          description="Add some trend signals to generate your weekly digest."
          action={
            <Link href="/signals/new" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
              Add Signal
            </Link>
          }
        />
      </div>
    );
  }

  // Strongest opportunities: high overall score, not ignored
  const strongest = allSignals
    .filter((s) => s.status !== "ignore" && s.overallScore >= 55)
    .slice(0, 5);

  // Weird niche: high novelty + low saturation, moderate-to-low overall (hidden gems)
  const weirdNiche = allSignals
    .filter((s) => s.noveltyScore >= 65 && s.saturationScore <= 30 && s.status !== "ignore")
    .sort((a, b) => b.noveltyScore - a.noveltyScore)
    .slice(0, 5);

  // Easy monetization: high monetization score, reasonable overall
  const easyMoney = allSignals
    .filter((s) => s.monetizationEaseScore >= 70 && s.status !== "ignore")
    .sort((a, b) => b.monetizationEaseScore - a.monetizationEaseScore)
    .slice(0, 5);

  // Crowded to avoid: high saturation, any status
  const crowded = allSignals
    .filter((s) => s.saturationScore >= 50)
    .sort((a, b) => b.saturationScore - a.saturationScore)
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Weekly Digest</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Curated opportunity categories from your {allSignals.length} signals.
        </p>
      </div>

      <DigestSection
        title="Strongest Opportunities"
        subtitle="High overall score, active signals"
        accent="#22c55e"
        signals={strongest}
        emptyMessage="No signals scored high enough yet."
      />

      <DigestSection
        title="Weird Niche Finds"
        subtitle="High novelty + low saturation — hidden gems"
        accent="#8b5cf6"
        signals={weirdNiche}
        emptyMessage="No niche opportunities detected."
      />

      <DigestSection
        title="Easy Monetization"
        subtitle="High monetization ease score"
        accent="#f59e0b"
        signals={easyMoney}
        emptyMessage="No easy-money signals found."
      />

      <DigestSection
        title="Crowded — Consider Avoiding"
        subtitle="High saturation score — crowded markets"
        accent="#ef4444"
        signals={crowded}
        emptyMessage="No overly saturated signals."
      />
    </div>
  );
}

function DigestSection({
  title,
  subtitle,
  accent,
  signals,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  accent: string;
  signals: Awaited<ReturnType<typeof prisma.trendSignal.findMany>>;
  emptyMessage: string;
}) {
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <p className="mt-0.5 ml-4 text-xs text-[var(--muted)]">{subtitle}</p>
      </div>
      {signals.length === 0 ? (
        <p className="ml-4 text-sm text-[var(--muted)] italic">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {signals.map((signal) => (
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
              <div className="hidden sm:flex flex-col items-end gap-1 text-xs tabular-nums">
                <span className="text-[var(--muted-foreground)]">
                  Nov {signal.noveltyScore} / Sat {signal.saturationScore}
                </span>
                <span className="text-[var(--muted)]">
                  Mon {signal.monetizationEaseScore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
