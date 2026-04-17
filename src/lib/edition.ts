import {
  ALL_SECTIONS,
  type EditionKind,
  type Section,
  type StoryCluster,
} from "@/types/ledger";
import { getEditionClusters, getLatestEdition } from "./queries";

export interface EditionLayout {
  hero: StoryCluster | null;
  topStories: StoryCluster[];
  sections: { name: Section; clusters: StoryCluster[] }[];
  briefs: StoryCluster[];
  totalClusters: number;
}

export interface EditionSnapshot {
  id: number;
  kind: EditionKind;
  date: Date;
  windowStart: string;
  windowEnd: string;
  generatedAt: string;
  clusters: StoryCluster[];
  layout: EditionLayout;
}

// Front-page layout dimensions. Adjust here, not in the function body.
const LAYOUT = {
  topStoryCount: 4,
  perSectionCount: 5,
  briefsCap: 12,
};

const FRONT_PAGE_SECTIONS: Section[] = ALL_SECTIONS.filter(
  (s) => s !== "Briefs",
);

/**
 * Load the most recently generated edition from the DB.
 * Returns null if none has ever been generated.
 */
export function loadLatestEdition(): EditionSnapshot | null {
  const head = getLatestEdition();
  if (!head) return null;
  const clusters = getEditionClusters(head.id);
  return {
    id: head.id,
    kind: head.kind,
    date: new Date(head.generatedAt),
    windowStart: head.windowStart,
    windowEnd: head.windowEnd,
    generatedAt: head.generatedAt,
    clusters,
    layout: assembleLayout(clusters),
  };
}

/**
 * Slice a ranked cluster list into the named front-page slots.
 *
 *   hero        : rank 1
 *   topStories  : ranks 2..(1 + topStoryCount)
 *   sections    : next best per section, up to perSectionCount each
 *   briefs      : everything still unplaced, capped at briefsCap
 *
 * A cluster never appears in more than one slot.
 */
export function assembleLayout(clusters: StoryCluster[]): EditionLayout {
  const ordered = [...clusters].sort((a, b) => a.rank - b.rank);
  const used = new Set<number>();

  const takeNext = (match: (c: StoryCluster) => boolean, cap: number) => {
    const out: StoryCluster[] = [];
    for (const c of ordered) {
      if (used.has(c.id) || !match(c)) continue;
      out.push(c);
      used.add(c.id);
      if (out.length >= cap) break;
    }
    return out;
  };

  const hero = takeNext(() => true, 1)[0] ?? null;
  const topStories = takeNext(() => true, LAYOUT.topStoryCount);

  const sections = FRONT_PAGE_SECTIONS.map((name) => ({
    name,
    clusters: takeNext((c) => c.section === name, LAYOUT.perSectionCount),
  })).filter((s) => s.clusters.length > 0);

  const briefs = takeNext(() => true, LAYOUT.briefsCap);

  return {
    hero,
    topStories,
    sections,
    briefs,
    totalClusters: ordered.length,
  };
}
