import type { Section as SectionName, StoredArticle } from "@/types/ledger";
import { StoryCard } from "./StoryCard";

interface Props {
  name: SectionName;
  articles: StoredArticle[];
}

export function Section({ name, articles }: Props) {
  if (articles.length === 0) return null;
  const compact = name === "Briefs";

  return (
    <section className="py-10 rule-top">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-3xl">{name}</h2>
        <span className="font-meta">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
        </span>
      </div>
      <div className={compact ? "grid gap-x-10 md:grid-cols-3" : "grid gap-x-10 md:grid-cols-2"}>
        {articles.map((a) => (
          <StoryCard key={a.id} article={a} compact={compact} />
        ))}
      </div>
    </section>
  );
}
