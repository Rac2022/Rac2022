import Link from "next/link";
import type { TrendSignal } from "@/generated/prisma/client";
import { OverallScoreBadge } from "./ScoreBar";
import { InlineStatusControl } from "./InlineStatusControl";
import { SOURCE_TYPE_LABELS, type SignalStatus, type SourceType } from "@/lib/scoring";

export function SignalCard({ signal }: { signal: TrendSignal }) {
  const tags = signal.tags ? signal.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="group relative rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)]">
      <Link href={`/signals/${signal.id}`} className="absolute inset-0 z-0 rounded-2xl" />
      <div className="relative z-10 flex gap-4">
        <OverallScoreBadge score={signal.overallScore} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-snug tracking-tight group-hover:text-[var(--accent)] transition-colors">
              {signal.title}
            </h3>
            <InlineStatusControl
              signalId={signal.id}
              currentStatus={signal.status as SignalStatus}
            />
          </div>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
            {signal.summary}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
            <span className="font-medium text-[var(--muted-foreground)]">
              {SOURCE_TYPE_LABELS[signal.sourceType as SourceType] ?? signal.sourceType}
            </span>
            <span className="text-[var(--card-border)]">/</span>
            <span>{signal.source}</span>
            {tags.length > 0 && (
              <>
                <span className="text-[var(--card-border)]">/</span>
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[var(--background)] px-1.5 py-0.5 text-[11px] text-[var(--muted-foreground)]"
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
    </div>
  );
}
