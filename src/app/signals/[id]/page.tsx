import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreBar, OverallScoreBadge } from "@/components/ScoreBar";
import { ScoreExplanation } from "@/components/ScoreExplanation";
import {
  SOURCE_TYPE_LABELS,
  getScoreLabel,
  getScoreColor,
  type SignalStatus,
  type SourceType,
} from "@/lib/scoring";
import { StatusUpdater } from "./status-updater";
import { NotesEditor } from "./notes-editor";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function SignalDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const signal = await prisma.trendSignal.findUnique({ where: { id } });

  if (!signal) notFound();

  const tags = signal.tags ? signal.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const createdDate = signal.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const scoreColor = getScoreColor(signal.overallScore);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          &larr; Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/signals/${signal.id}/edit`}
            className="rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            Edit
          </Link>
          <DeleteButton signalId={signal.id} title={signal.title} />
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <OverallScoreBadge score={signal.overallScore} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight">{signal.title}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
              <StatusBadge status={signal.status as SignalStatus} />
              <span className="text-[var(--card-border)]">/</span>
              <span>{SOURCE_TYPE_LABELS[signal.sourceType as SourceType] ?? signal.sourceType}</span>
              <span className="text-[var(--card-border)]">/</span>
              <span>{signal.source}</span>
              <span className="text-[var(--card-border)]">/</span>
              <span>{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Summary</h2>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{signal.summary}</p>
        </div>

        {/* URL */}
        {signal.url && (
          <div>
            <h2 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Source URL</h2>
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
            <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Tags</h2>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--background)] px-2 py-1 text-xs text-[var(--muted-foreground)]"
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
            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Score Breakdown</h2>
            <span className="text-sm font-semibold" style={{ color: scoreColor }}>
              {signal.overallScore} — {getScoreLabel(signal.overallScore)}
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

        {/* Score explanation */}
        <ScoreExplanation signal={signal} />

        {/* Notes */}
        <div>
          <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Notes</h2>
          <NotesEditor signalId={signal.id} initialNotes={signal.notes} />
        </div>

        {/* Status Update */}
        <div className="border-t border-[var(--card-border)] pt-4">
          <StatusUpdater signalId={signal.id} currentStatus={signal.status as SignalStatus} />
        </div>
      </div>
    </div>
  );
}
