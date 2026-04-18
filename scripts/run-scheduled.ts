#!/usr/bin/env node
/**
 * Scheduled run: ingest RSS feeds, then generate the current edition,
 * then exit. Invoked by Fly scheduled machines.
 *
 *   fly machine run --schedule=hourly <image> npm run scheduled
 */
import { runIngest } from "@/lib/ingest/run";
import { generateEdition } from "@/lib/generateEdition";

async function main() {
  const tag = new Date().toISOString();
  console.log(`[${tag}] scheduled run: starting`);

  const ingest = await runIngest();
  console.log(
    `[${tag}] ingest: ${ingest.articlesInserted} new, ${ingest.itemsSeen} seen, ${ingest.errors.length} feed errors`,
  );

  const edition = await generateEdition();
  const s = edition.summarize;
  console.log(
    `[${tag}] edition #${edition.editionId} (${edition.kind}): ` +
      `${edition.clustersSelected}/${edition.clustersBuilt} clusters, ` +
      (s.skipped
        ? "summaries skipped"
        : `${s.succeeded} ok / ${s.cacheHits} cached / ${s.failed} failed`),
  );

  console.log(`[${tag}] scheduled run: done`);
}

main().catch((err) => {
  console.error("scheduled run failed:", err);
  process.exit(1);
});
