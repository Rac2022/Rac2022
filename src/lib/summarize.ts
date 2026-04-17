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
/** Bump this when SYSTEM_PROMPT changes materially; invalidates the cache. */
const PROMPT_VERSION = "v2";

const SYSTEM_PROMPT = `You are a senior wire-desk editor for a professional morning news briefing, in the house style of Reuters, AP, and the Financial Times. Read the clustered sources and write two tight sentences that could sit on a printed front page.

VOICE
Direct, concrete, unfussy. Short words. Active verbs. Match a wire-service lede, not a blog post. Every word earns its place.

HARD RULES
- Two single sentences. Nothing else.
- No em dashes or en dashes. Use commas, semicolons, or periods.
- No question marks, exclamation marks, or rhetorical flourish.
- Do not address the reader. No "you", "we", "our".
- Never introduce facts the sources do not state.
- Do not assign motives unless the sources do.

ONE-LINER (max 22 words; aim for 14 to 18)
- State what happened, who acted, and the crucial number, place, or time.
- Add at least one fact the headline does not already contain. If there is none, restate the event in plainer language with a sharper verb.
- Open with the subject or the action. No "In a move that", no "Amid growing", no "This comes as".
- Do not reuse the headline's wording.
- Attribute with "according to X" or "X said" when sources disagree. Not "appears to" or "reportedly".

WHY IT MATTERS (max 24 words)
- Name a concrete consequence: who is affected, what decision or deadline follows, what changes in practice, or what precedent is set.
- Be specific. Prefer numbers, names, dates, and named policies.
- If the real significance is a pending decision or release, say when and by whom.
- Do not speculate. If the stakes are genuinely unclear from the sources, state one factual implication instead.

BANNED PHRASES (they signal weak writing)
highlights, underscores, sheds light on, comes as, amid growing, sparks debate, raises questions, marks a significant, in a move, in what could be, increasingly, latest in a series, reportedly, appears to, seeks to, looks to, aims to.

OUTPUT
Respond with ONLY a JSON object, no preamble, no code fences, in this exact shape:
{"one_liner": "...", "why_it_matters": "..."}`;

/**
 * Stable signature for a cluster: sha256 of its sorted, deduplicated canonical
 * URLs plus the prompt version, truncated. Re-running the same edition with
 * the same prompt produces the same key, so cached summaries are reused.
 * Bumping PROMPT_VERSION invalidates old cache entries without a migration.
 */
export function clusterSignature(cluster: RankedCluster): string {
  const urls = [...new Set(cluster.articles.map((a) => a.canonicalUrl))].sort();
  return crypto
    .createHash("sha256")
    .update(`${PROMPT_VERSION}|${urls.join("|")}`)
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
