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

/**
 * Decide whether "now" is morning or evening.
 * Before 15:00 local time counts as morning, otherwise evening.
 */
export function currentEditionKind(now = new Date()): EditionKind {
  return now.getHours() < 15 ? "morning" : "evening";
}

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
 *   topStories  : ranks 2..5 (4 items)
 *   sections    : per-section next best clusters, up to 5 per section
 *   briefs      : everything else, shortest form
 *
 * A cluster never appears in more than one slot.
 */
export function assembleLayout(clusters: StoryCluster[]): EditionLayout {
  const ordered = [...clusters].sort((a, b) => a.rank - b.rank);
  const used = new Set<number>();

  const hero = ordered[0] ?? null;
  if (hero) used.add(hero.id);

  const topStories = ordered.slice(1, 5);
  for (const c of topStories) used.add(c.id);

  const SECTIONS_ON_FRONT: Section[] = ALL_SECTIONS.filter(
    (s) => s !== "Briefs",
  );

  const PER_SECTION = 5;
  const sections = SECTIONS_ON_FRONT.map((name) => {
    const bucket: StoryCluster[] = [];
    for (const c of ordered) {
      if (used.has(c.id)) continue;
      if (c.section !== name) continue;
      bucket.push(c);
      used.add(c.id);
      if (bucket.length >= PER_SECTION) break;
    }
    return { name, clusters: bucket };
  }).filter((s) => s.clusters.length > 0);

  const BRIEFS_CAP = 12;
  const briefs: StoryCluster[] = [];
  for (const c of ordered) {
    if (used.has(c.id)) continue;
    briefs.push(c);
    used.add(c.id);
    if (briefs.length >= BRIEFS_CAP) break;
  }

  return {
    hero,
    topStories,
    sections,
    briefs,
    totalClusters: ordered.length,
  };
}
