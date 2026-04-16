#!/usr/bin/env node
/**
 * Morning Ledger ingest CLI.
 *
 * Usage:
 *   npm run ingest
 *
 * Reads RSS feeds declared in src/config/feeds.ts, normalizes each item,
 * and upserts into data/ledger.db.
 */
import { runIngest } from "@/lib/ingest/run";

async function main() {
  const started = Date.now();
  const report = await runIngest();
  const elapsedMs = Date.now() - started;

  console.log("Morning Ledger ingest complete");
  console.log(`  feeds processed  : ${report.feedsProcessed}`);
  console.log(`  items seen       : ${report.itemsSeen}`);
  console.log(`  articles inserted: ${report.articlesInserted}`);
  console.log(`  elapsed          : ${elapsedMs} ms`);

  if (report.errors.length) {
    console.log(`  errors (${report.errors.length}):`);
    for (const e of report.errors) {
      console.log(`    - ${e.feed}: ${e.message}`);
    }
  }
}

main().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
