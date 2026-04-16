import { Masthead } from "@/components/Masthead";
import { HeroStory } from "@/components/HeroStory";
import { Section } from "@/components/Section";
import { StoryCard } from "@/components/StoryCard";
import { EndOfEdition } from "@/components/EndOfEdition";
import { buildEditionView, currentEditionKind } from "@/lib/edition";
import { countArticles } from "@/lib/queries";
import { sampleEdition } from "@/lib/sampleEdition";

// Server-render on each request. ISR can be added in Phase 3 once the
// edition generation cadence is settled.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const hasData = countArticles() > 0;
  const edition = hasData ? buildEditionView() : sampleEdition(currentEditionKind());

  const totalStories =
    (edition.hero ? 1 : 0) +
    edition.topStories.length +
    edition.sections.reduce((n, s) => n + s.articles.length, 0);

  return (
    <main>
      <Masthead kind={edition.kind} date={edition.date} />

      {!hasData ? (
        <div className="rule-bottom py-3 font-meta text-center">
          Showing sample edition. Run <code>npm run ingest</code> to load live stories.
        </div>
      ) : null}

      {edition.hero ? <HeroStory article={edition.hero} /> : null}

      {edition.topStories.length > 0 ? (
        <section className="py-10 rule-bottom">
          <h2 className="font-display text-3xl mb-6">Top Stories</h2>
          <div className="grid gap-x-10 md:grid-cols-2">
            {edition.topStories.map((a) => (
              <StoryCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      ) : null}

      {edition.sections.map((s) => (
        <Section key={s.name} name={s.name} articles={s.articles} />
      ))}

      <EndOfEdition count={totalStories} />
    </main>
  );
}
