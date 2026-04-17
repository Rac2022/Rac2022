import { Masthead } from "@/components/Masthead";
import { HeroStory } from "@/components/HeroStory";
import { TopStoriesStrip } from "@/components/TopStoriesStrip";
import { Section } from "@/components/Section";
import { Briefs } from "@/components/Briefs";
import { EndOfEdition } from "@/components/EndOfEdition";
import { currentEditionKind, loadLatestEdition } from "@/lib/edition";
import { sampleEdition } from "@/lib/sampleEdition";

// Re-render on each request for now. Swap to ISR once the edition generator
// runs on a schedule.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const snapshot = loadLatestEdition() ?? sampleEdition(currentEditionKind());
  const isSample = snapshot.id === 0;
  const { layout } = snapshot;

  return (
    <main>
      <Masthead kind={snapshot.kind} date={snapshot.date} />

      {isSample ? (
        <div className="rule-bottom py-3 font-meta text-center">
          Showing sample edition. Run <code>npm run ingest</code> then{" "}
          <code>npm run edition</code> to build today&rsquo;s front page.
        </div>
      ) : null}

      {layout.hero ? <HeroStory cluster={layout.hero} /> : null}
      <TopStoriesStrip clusters={layout.topStories} />

      {layout.sections.map((s) => (
        <Section key={s.name} name={s.name} clusters={s.clusters} />
      ))}

      <Briefs clusters={layout.briefs} />

      <EndOfEdition count={layout.totalClusters} />
    </main>
  );
}
