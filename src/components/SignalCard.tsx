import Link from "next/link";
import type { TrendSignal } from "@/generated/prisma/client";
import { StatusBadge } from "./StatusBadge";
import { OverallScoreBadge } from "./ScoreBar";
import { SOURCE_TYPE_LABELS, type SignalStatus, type SourceType } from "@/lib/scoring";

export function SignalCard({ signal }: { signal: TrendSignal }) {
  const tags = signal.tags ? signal.tags.split(",").map((t) => t.trim()) : [];

  return (
    <Link
      href={`/signals/${signal.id}`}
      className="group block rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]"
    >
      <div className="flex gap-4">
        <OverallScoreBadge score={signal.overallScore} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-snug group-hover:text-[var(--accent)] transition-colors">
              {signal.title}
            </h3>
            <StatusBadge status={signal.status as SignalStatus} />
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
            {signal.summary}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
            <span>{SOURCE_TYPE_LABELS[signal.sourceType as SourceType] ?? signal.sourceType}</span>
            <span>·</span>
            <span>{signal.source}</span>
            {tags.length > 0 && (
              <>
                <span>·</span>
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--card-border)] px-1.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-[var(--muted)]">+{tags.length - 3}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
