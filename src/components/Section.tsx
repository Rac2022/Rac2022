import type { Section as SectionName, StoryCluster } from "@/types/ledger";
import { ClusterCard } from "./ClusterCard";

interface Props {
  name: SectionName;
  clusters: StoryCluster[];
}

export function Section({ name, clusters }: Props) {
  if (clusters.length === 0) return null;
  return (
    <section className="py-10 rule-top">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-3xl">{name}</h2>
        <span className="font-meta">
          {clusters.length} {clusters.length === 1 ? "story" : "stories"}
        </span>
      </div>
      <div className="grid gap-x-10 md:grid-cols-2">
        {clusters.map((c) => (
          <ClusterCard key={c.id} cluster={c} />
        ))}
      </div>
    </section>
  );
}
