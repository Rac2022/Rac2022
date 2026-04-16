import { formatTimestamp } from "@/lib/time";
import type { StoredArticle } from "@/types/ledger";

interface Props {
  article: StoredArticle;
  compact?: boolean;
}

export function StoryCard({ article, compact = false }: Props) {
  return (
    <article className="py-4 rule-top first:rule-top-0">
      <h3
        className={
          "font-display leading-snug mb-2 " +
          (compact ? "text-lg" : "text-2xl md:text-[1.65rem]")
        }
      >
        <a href={article.url} target="_blank" rel="noreferrer noopener">
          {article.title}
        </a>
      </h3>
      {!compact && article.summary ? (
        <p className="text-[1.02rem] leading-relaxed text-[color:var(--ink-muted)]">
          {article.summary}
        </p>
      ) : null}
      <div className="font-meta mt-2">
        {article.sourceName}
        {article.publishedAt ? ` · ${formatTimestamp(article.publishedAt)}` : ""}
      </div>
    </article>
  );
}
