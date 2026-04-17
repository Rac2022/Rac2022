#!/usr/bin/env node
/**
 * Morning Ledger edition generator.
 *
 * Usage:
 *   npm run edition           # auto picks morning or evening by local time
 *   npm run edition morning
 *   npm run edition evening
 *
 * Reads articles from data/ledger.db, clusters + ranks them, and writes a new
 * edition snapshot. The homepage always renders the most recent snapshot.
 */
import type { EditionKind } from "@/types/ledger";
import { generateEdition } from "@/lib/generateEdition";

function parseKind(arg: string | undefined): EditionKind | undefined {
  if (!arg) return undefined;
  if (arg === "morning" || arg === "evening") return arg;
  console.error(`Unknown edition kind: ${arg}. Use 'morning' or 'evening'.`);
  process.exit(2);
}

const kind = parseKind(process.argv[2]);
const started = Date.now();
const report = generateEdition(kind);
const elapsedMs = Date.now() - started;

console.log(`Edition #${report.editionId} (${report.kind}) generated`);
console.log(`  window            : ${report.windowStart}  to  ${report.windowEnd}`);
console.log(`  articles considered: ${report.articlesConsidered}`);
console.log(`  clusters built     : ${report.clustersBuilt}`);
console.log(`  clusters selected  : ${report.clustersSelected}`);
console.log(`  elapsed            : ${elapsedMs} ms`);
console.log("");
console.log("  Top stories:");
for (const t of report.top) {
  console.log(`    ${t.rank.toString().padStart(2)}. [${t.sources}x] ${t.title}  (i=${t.importance})`);
}
