import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreBar, OverallScoreBadge } from "@/components/ScoreBar";
import {
  SOURCE_TYPE_LABELS,
  getScoreLabel,
  type SignalStatus,
  type SourceType,
} from "@/lib/scoring";
import { StatusUpdater } from "./status-updater";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function SignalDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const signal = await prisma.trendSignal.findUnique({ where: { id } });

  if (!signal) notFound();

  const tags = signal.tags ? signal.tags.split(",").map((t) => t.trim()) : [];
  const createdDate = signal.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        &larr; Back to dashboard
      </Link>

      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <OverallScoreBadge score={signal.overallScore} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{signal.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
              <StatusBadge status={signal.status as SignalStatus} />
              <span>·</span>
              <span>{SOURCE_TYPE_LABELS[signal.sourceType as SourceType] ?? signal.sourceType}</span>
              <span>·</span>
              <span>{signal.source}</span>
              <span>·</span>
              <span>{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="mb-2 text-sm font-medium text-[var(--muted)]">Summary</h2>
          <p className="text-sm leading-relaxed">{signal.summary}</p>
        </div>

        {/* URL */}
        {signal.url && (
          <div>
            <h2 className="mb-1 text-sm font-medium text-[var(--muted)]">Source URL</h2>
            <a
              href={signal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent)] hover:underline break-all"
            >
              {signal.url}
            </a>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-[var(--muted)]">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--card-border)] px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scores */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--muted)]">Score Breakdown</h2>
            <span className="text-sm text-[var(--muted)]">
              Overall: {signal.overallScore} ({getScoreLabel(signal.overallScore)})
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ScoreBar value={signal.noveltyScore} label="Novelty (25%)" />
            <ScoreBar value={signal.socialVelocityScore} label="Social Velocity (25%)" />
            <ScoreBar value={signal.searchVolumeScore} label="Search Volume (20%)" />
            <ScoreBar value={signal.monetizationEaseScore} label="Monetization Ease (20%)" />
            <ScoreBar value={signal.saturationScore} label="Saturation (10% inverse)" />
          </div>
        </div>

        {/* Status Update */}
        <div className="border-t border-[var(--card-border)] pt-4">
          <StatusUpdater signalId={signal.id} currentStatus={signal.status as SignalStatus} />
        </div>
      </div>
    </div>
  );
}
