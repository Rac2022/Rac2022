import { formatTimestamp } from "@/lib/time";
import type { StoryCluster } from "@/types/ledger";

export function HeroStory({ cluster }: { cluster: StoryCluster }) {
  const a = cluster.primaryArticle;
  const body = cluster.oneLiner ?? a.summary;
  const otherSources = cluster.relatedArticles.length;
  return (
    <article className="py-8 rule-bottom">
      <div className="font-meta mb-2">{cluster.section} · Lead Story</div>
      <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
        <a href={a.url} target="_blank" rel="noreferrer noopener">
          {cluster.title}
        </a>
      </h2>
      {body ? (
        <p className="dropcap text-lg md:text-xl leading-relaxed measure">
          {body}
        </p>
      ) : null}
      {cluster.whyItMatters ? (
        <p className="mt-4 measure italic text-[color:var(--ink-muted)] leading-relaxed">
          <span className="font-meta not-italic mr-2">Why it matters</span>
          {cluster.whyItMatters}
        </p>
      ) : null}
      <div className="font-meta mt-4 flex flex-wrap gap-x-3 gap-y-1">
        <span>{a.sourceName}</span>
        {a.publishedAt ? <span>{formatTimestamp(a.publishedAt)}</span> : null}
        {otherSources > 0 ? (
          <span>
            Also reported by {otherSources} other{" "}
            {otherSources === 1 ? "source" : "sources"}
          </span>
        ) : null}
      </div>
    </article>
  );
}
