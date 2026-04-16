import type { Section } from "@/types/ledger";

export interface Preferences {
  /**
   * Multiplier applied to cluster importance per section.
   * 0 = hide the section; 1 = neutral; >1 = boost.
   */
  sectionWeights: Record<Section, number>;

  /**
   * Domains (bare hostnames) whose articles will never be ingested.
   */
  blockedDomains: string[];

  /**
   * Heuristic tags we want to avoid. Matched loosely against
   * title/summary during ranking. Not a hard filter.
   */
  avoidContentTypes: string[];

  /**
   * Edition timing, in hours back from "now".
   */
  editionWindowHours: {
    morning: number;
    evening: number;
  };

  /**
   * Upper bound on clusters shown per edition. Keeps the front page finite.
   */
  maxClustersPerEdition: number;
}

export const PREFERENCES: Preferences = {
  sectionWeights: {
    World: 1.0,
    "U.S.": 1.0,
    Business: 0.9,
    "Science & AI": 1.1,
    Health: 0.9,
    Culture: 0.7,
    Briefs: 0.6,
  },
  blockedDomains: [
    // Add known low-signal or outrage-farm domains here.
  ],
  avoidContentTypes: [
    "celebrity gossip",
    "outrage",
    "viral",
    "clickbait",
    "slideshow",
    "listicle",
  ],
  editionWindowHours: {
    morning: 18,
    evening: 10,
  },
  maxClustersPerEdition: 24,
};
