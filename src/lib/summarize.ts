import crypto from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";
import {
  getCachedSummary,
  putCachedSummary,
  type CachedSummary,
} from "./queries";
import type { RankedCluster } from "./rank";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_CONCURRENCY = 4;

const SYSTEM_PROMPT = `You are a senior wire-desk editor for a calm morning newspaper. You write neutral, factual one-line summaries for stories where one or more sources have covered the same event.

Editorial rules (strict):
- Neutral and factual. Never sensational or speculative.
- No em dashes. Use commas, semicolons, or periods.
- No clickbait. No question marks. No teasers.
- Preserve uncertainty. If sources differ, hedge appropriately ("according to", "appears to").
- Do not introduce facts not present in the source material.
- Do not assign motives unless the sources do.
- Plain past or present tense. Do not address the reader.

Produce two single sentences:

1. one_liner: max 22 words. States what happened.
2. why_it_matters: max 24 words. Explains the practical or contextual significance, grounded in what the sources report. If significance is genuinely unclear, state a concrete factual implication.

Respond with ONLY a JSON object, no preamble, no code fences, in this exact shape:
{"one_liner": "...", "why_it_matters": "..."}`;

/**
 * Stable signature for a cluster: sha256 of its sorted, deduplicated canonical
 * URLs, truncated. Re-running the same edition produces the same key, so
 * cached summaries are reused across runs.
 */
export function clusterSignature(cluster: RankedCluster): string {
  const urls = [...new Set(cluster.articles.map((a) => a.canonicalUrl))].sort();
  return crypto
    .createHash("sha256")
    .update(urls.join("|"))
    .digest("hex")
    .slice(0, 16);
}

function buildUserPrompt(cluster: RankedCluster): string {
  const lines: string[] = [`Section: ${cluster.section}`, "", "Sources:"];
  cluster.articles.forEach((a, i) => {
    lines.push(
      `\n[${i + 1}] ${a.sourceName}`,
      `Title: ${a.title}`,
      a.summary ? `Summary: ${a.summary}` : "Summary: (none)",
    );
  });
  return lines.join("\n");
}

/** Strip em dashes and en dashes in case the model emits them anyway. */
function sanitize(text: string): string {
  return text.replace(/[\u2014\u2013]/g, ",").replace(/\s+/g, " ").trim();
}

function parseSummary(text: string): CachedSummary | null {
  // Strip optional code fences. Extract the first { ... } block.
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as { one_liner?: unknown; why_it_matters?: unknown };
  if (typeof obj.one_liner !== "string" || typeof obj.why_it_matters !== "string") {
    return null;
  }
  const oneLiner = sanitize(obj.one_liner);
  const whyItMatters = sanitize(obj.why_it_matters);
  if (!oneLiner || !whyItMatters) return null;
  return { oneLiner, whyItMatters };
}

/**
 * Summarize a single cluster. Returns null on any failure (network, parse,
 * validation). Callers must treat the result as best-effort.
 */
async function summarizeOne(
  client: Anthropic,
  cluster: RankedCluster,
): Promise<CachedSummary | null> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(cluster) }],
    });
    const block = response.content[0];
    if (!block || block.type !== "text") return null;
    return parseSummary(block.text);
  } catch (err) {
    console.warn(
      `summarize: cluster "${cluster.title.slice(0, 60)}" failed:`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/** Run an async function over items with bounded concurrency. */
async function mapBounded<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length) return;
        results[i] = await fn(items[i]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

export interface SummarizeReport {
  attempted: number;
  cacheHits: number;
  apiCalls: number;
  succeeded: number;
  failed: number;
  skipped: boolean;
}

/**
 * Resolve summaries for a set of ranked clusters.
 *
 *   - If ANTHROPIC_API_KEY is unset, returns an empty Map (Phase 2 behavior).
 *   - Otherwise, returns a Map keyed by cluster signature.
 *   - Cached signatures are returned without an API call.
 *   - Per-cluster failures are silently dropped. The edition still renders.
 *
 * The companion report is for logging only.
 */
export async function summarizeClusters(
  clusters: RankedCluster[],
): Promise<{ summaries: Map<string, CachedSummary>; report: SummarizeReport }> {
  const summaries = new Map<string, CachedSummary>();
  const report: SummarizeReport = {
    attempted: clusters.length,
    cacheHits: 0,
    apiCalls: 0,
    succeeded: 0,
    failed: 0,
    skipped: false,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    report.skipped = true;
    return { summaries, report };
  }

  // First pass: cache lookups. No I/O concurrency needed (SQLite is sync).
  const misses: { cluster: RankedCluster; signature: string }[] = [];
  for (const cluster of clusters) {
    const signature = clusterSignature(cluster);
    const cached = getCachedSummary(signature);
    if (cached) {
      summaries.set(signature, cached);
      report.cacheHits += 1;
    } else {
      misses.push({ cluster, signature });
    }
  }

  if (misses.length === 0) return { summaries, report };

  const client = new Anthropic({ apiKey });
  const results = await mapBounded(misses, MAX_CONCURRENCY, async ({ cluster, signature }) => {
    const summary = await summarizeOne(client, cluster);
    return { signature, summary };
  });

  for (const { signature, summary } of results) {
    report.apiCalls += 1;
    if (!summary) {
      report.failed += 1;
      continue;
    }
    summaries.set(signature, summary);
    putCachedSummary({ signature, ...summary, model: MODEL });
    report.succeeded += 1;
  }

  return { summaries, report };
}
