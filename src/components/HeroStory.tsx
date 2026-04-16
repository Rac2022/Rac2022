import { formatTimestamp } from "@/lib/time";
import type { StoredArticle } from "@/types/ledger";

export function HeroStory({ article }: { article: StoredArticle }) {
  return (
    <article className="py-8 rule-bottom">
      <div className="font-meta mb-2">{article.section} · Lead Story</div>
      <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
        <a href={article.url} target="_blank" rel="noreferrer noopener">
          {article.title}
        </a>
      </h2>
      {article.summary ? (
        <p className="dropcap text-lg md:text-xl leading-relaxed max-w-3xl">
          {article.summary}
        </p>
      ) : null}
      <div className="font-meta mt-4">
        {article.sourceName}
        {article.publishedAt ? ` · ${formatTimestamp(article.publishedAt)}` : ""}
      </div>
    </article>
  );
}
