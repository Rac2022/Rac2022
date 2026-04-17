const TRACKING_PARAMS = [
  /^utm_/i,
  /^fbclid$/i,
  /^gclid$/i,
  /^mc_/i,
  /^ref$/i,
  /^ref_src$/i,
  /^ref_url$/i,
  /^cmpid$/i,
  /^ns_mchannel$/i,
  /^ocid$/i,
  /^smid$/i,
  /^s_cid$/i,
];

/**
 * Strip tracking parameters and fragments from a URL, lowercase the host,
 * and remove trailing slashes. The result is used for dedupe (UNIQUE index).
 */
export function canonicalizeUrl(raw: string): string {
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    u.hostname = u.hostname.toLowerCase().replace(/^www\./, "");
    for (const key of [...u.searchParams.keys()]) {
      if (TRACKING_PARAMS.some((rx) => rx.test(key))) {
        u.searchParams.delete(key);
      }
    }
    let s = u.toString();
    // remove trailing slash on path-only URLs
    if (u.pathname !== "/" && s.endsWith("/")) s = s.slice(0, -1);
    return s;
  } catch {
    return raw.trim();
  }
}

/**
 * Extract the lowercased, www-stripped hostname from a URL.
 * Returns "" when the input isn't a valid URL.
 */
export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Collapse whitespace and strip HTML tags from short RSS fields.
 * Good enough for titles and short summaries; do not use on article bodies.
 */
export function stripHtml(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}
