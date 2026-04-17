import { PREFERENCES } from "@/config/preferences";
import type { EditionKind } from "@/types/ledger";
import { clusterArticles } from "./cluster";
import { getDb } from "./db";
import {
  getArticlesInWindow,
  insertCluster,
  insertClusterItem,
  insertEdition,
  insertEditionItem,
} from "./queries";
import { rankClusters } from "./rank";
import { currentEditionKind } from "./edition";
import { editionWindow } from "./time";

export interface GenerateReport {
  editionId: number;
  kind: EditionKind;
  windowStart: string;
  windowEnd: string;
  articlesConsidered: number;
  clustersBuilt: number;
  clustersSelected: number;
  top: { rank: number; title: string; importance: number; sources: number }[];
}

/**
 * Build a reproducible edition snapshot from whatever is currently in the DB.
 *
 *   1. Pick articles inside the edition's time window.
 *   2. Cluster them.
 *   3. Rank clusters by the importance formula.
 *   4. Persist clusters + cluster_items.
 *   5. Persist a new edition row + edition_items (capped).
 *
 * All persistence happens inside a single transaction so a failure leaves the
 * DB untouched.
 */
export function generateEdition(
  kind: EditionKind = currentEditionKind(),
  now = new Date(),
): GenerateReport {
  const { start, end } = editionWindow(kind, now);
  const startIso = start.toISOString();
  const endIso = end.toISOString();

  const articles = getArticlesInWindow(startIso, endIso);
  const drafts = clusterArticles(articles);
  const ranked = rankClusters(drafts, now);
  const selected = ranked.slice(0, PREFERENCES.maxClustersPerEdition);

  const db = getDb();
  const run = db.transaction(() => {
    const editionId = insertEdition({
      kind,
      windowStart: startIso,
      windowEnd: endIso,
    });

    selected.forEach((c, i) => {
      const clusterId = insertCluster({
        primaryArticleId: c.primary.id,
        title: c.title,
        section: c.section,
        importance: c.importance,
      });
      for (const m of c.members) insertClusterItem(clusterId, m.id);
      insertEditionItem({
        editionId,
        clusterId,
        rank: i + 1,
        section: c.section,
      });
    });

    return editionId;
  });

  const editionId = run();

  return {
    editionId,
    kind,
    windowStart: startIso,
    windowEnd: endIso,
    articlesConsidered: articles.length,
    clustersBuilt: drafts.length,
    clustersSelected: selected.length,
    top: selected.slice(0, 8).map((c, i) => ({
      rank: i + 1,
      title: c.title,
      importance: Number(c.importance.toFixed(3)),
      sources: c.members.length,
    })),
  };
}
