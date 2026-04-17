import { formatTimestamp } from "@/lib/time";
import type { StoryCluster } from "@/types/ledger";

interface Props {
  cluster: StoryCluster;
  variant?: "default" | "compact" | "brief";
}

export function ClusterCard({ cluster, variant = "default" }: Props) {
  const a = cluster.primaryArticle;
  const body = cluster.oneLiner ?? a.summary;
  const otherSources = cluster.relatedArticles
    .map((r) => r.sourceName)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  const titleSize =
    variant === "brief"
      ? "text-base"
      : variant === "compact"
        ? "text-lg"
        : "text-2xl md:text-[1.55rem]";

  return (
    <article className="py-4 rule-top first:rule-top-0 break-inside-avoid">
      <h3 className={`font-display leading-snug mb-2 ${titleSize}`}>
        <a href={a.url} target="_blank" rel="noreferrer noopener">
          {cluster.title}
        </a>
      </h3>
      {variant === "default" && body ? (
        <p className="text-[1.02rem] leading-relaxed text-[color:var(--ink-muted)]">
          {body}
        </p>
      ) : null}
      {variant === "default" && cluster.whyItMatters ? (
        <p className="mt-2 italic text-[0.95rem] leading-relaxed text-[color:var(--ink-muted)]">
          <span className="font-meta not-italic mr-2">Why it matters</span>
          {cluster.whyItMatters}
        </p>
      ) : null}
      <div className="font-meta mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <span>{a.sourceName}</span>
        {a.publishedAt ? <span>{formatTimestamp(a.publishedAt)}</span> : null}
        {otherSources.length > 0 && variant !== "brief" ? (
          <span>Also: {otherSources.slice(0, 3).join(", ")}{otherSources.length > 3 ? "," : ""}</span>
        ) : null}
      </div>
    </article>
  );
}
