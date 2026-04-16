/**
 * Clustering — Phase 2.
 *
 * The intent is to group articles that describe the same real-world event.
 * Planned approach:
 *   1. Candidate pairs: same section, published within N hours.
 *   2. Cheap similarity: Jaccard overlap of normalized title tokens + shared named entities.
 *   3. Merge pairs above a threshold into clusters, pick the most-linked article as primary.
 *   4. (Later) Swap in embeddings for better recall on paraphrased headlines.
 *
 * Left intentionally unimplemented in Phase 1.
 */
export function clusterArticlesPlaceholder(): void {
  // no-op for Phase 1
}
