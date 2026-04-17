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
import { rankClusters, type RankedCluster } from "./rank";
import { currentEditionKind, editionWindow } from "./time";

/** Number of selected clusters echoed in the CLI report. Display only. */
const REPORT_TOP_N = 8;

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
 *   1. Articles inside the edition's time window.
 *   2. Cluster them.
 *   3. Rank clusters by the importance formula.
 *   4. Inside one transaction, persist the clusters and the edition row.
 *
 * A failure anywhere in step 4 leaves the DB untouched.
 */
export function generateEdition(
  kind: EditionKind = currentEditionKind(),
  now = new Date(),
): GenerateReport {
  const { start, end } = editionWindow(kind, now);
  const windowStart = start.toISOString();
  const windowEnd = end.toISOString();

  const articles = getArticlesInWindow(windowStart, windowEnd);
  const drafts = clusterArticles(articles);
  const ranked = rankClusters(drafts, now);
  const selected = ranked.slice(0, PREFERENCES.maxClustersPerEdition);

  const editionId = getDb().transaction(() => {
    const id = insertEdition({ kind, windowStart, windowEnd });
    selected.forEach((cluster, i) => persistCluster(id, i + 1, cluster));
    return id;
  })();

  return {
    editionId,
    kind,
    windowStart,
    windowEnd,
    articlesConsidered: articles.length,
    clustersBuilt: drafts.length,
    clustersSelected: selected.length,
    top: selected.slice(0, REPORT_TOP_N).map((c, i) => ({
      rank: i + 1,
      title: c.title,
      importance: Number(c.importance.toFixed(3)),
      sources: c.articles.length,
    })),
  };
}

/** Write one cluster plus its articles plus its edition-item row. Must run inside a transaction. */
function persistCluster(editionId: number, rank: number, cluster: RankedCluster): void {
  const clusterId = insertCluster({
    primaryArticleId: cluster.primaryArticle.id,
    title: cluster.title,
    section: cluster.section,
    importance: cluster.importance,
  });
  for (const article of cluster.articles) insertClusterItem(clusterId, article.id);
  insertEditionItem({ editionId, clusterId, rank, section: cluster.section });
}
