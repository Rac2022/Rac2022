import type { StoryCluster } from "@/types/ledger";
import { ClusterCard } from "./ClusterCard";

export function TopStoriesStrip({ clusters }: { clusters: StoryCluster[] }) {
  if (clusters.length === 0) return null;
  return (
    <section className="py-10 rule-bottom">
      <h2 className="font-display text-3xl mb-6">Top Stories</h2>
      <div className="grid gap-x-10 md:grid-cols-2">
        {clusters.map((c) => (
          <ClusterCard key={c.id} cluster={c} />
        ))}
      </div>
    </section>
  );
}
