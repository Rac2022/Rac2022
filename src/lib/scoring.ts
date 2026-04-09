export const SCORE_WEIGHTS = {
  noveltyScore: 0.25,
  socialVelocityScore: 0.25,
  searchVolumeScore: 0.2,
  monetizationEaseScore: 0.2,
  saturationScore: -0.1,
} as const;

export type ScoreInputs = {
  noveltyScore: number;
  socialVelocityScore: number;
  searchVolumeScore: number;
  monetizationEaseScore: number;
  saturationScore: number;
};

export function computeOverallScore(inputs: ScoreInputs): number {
  const raw =
    inputs.noveltyScore * SCORE_WEIGHTS.noveltyScore +
    inputs.socialVelocityScore * SCORE_WEIGHTS.socialVelocityScore +
    inputs.searchVolumeScore * SCORE_WEIGHTS.searchVolumeScore +
    inputs.monetizationEaseScore * SCORE_WEIGHTS.monetizationEaseScore +
    inputs.saturationScore * SCORE_WEIGHTS.saturationScore;

  return Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "Strong";
  if (score >= 40) return "Moderate";
  return "Weak";
}

export const STATUS_OPTIONS = ["new", "watch", "validated", "ignore"] as const;
export type SignalStatus = (typeof STATUS_OPTIONS)[number];

export const SOURCE_TYPE_OPTIONS = [
  "social_media",
  "news",
  "research",
  "community",
  "marketplace",
  "search_trends",
  "other",
] as const;
export type SourceType = (typeof SOURCE_TYPE_OPTIONS)[number];

export const STATUS_CONFIG: Record<SignalStatus, { label: string; color: string }> = {
  new: { label: "New", color: "#3b82f6" },
  watch: { label: "Watch", color: "#f59e0b" },
  validated: { label: "Validated", color: "#22c55e" },
  ignore: { label: "Ignore", color: "#6b7280" },
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  social_media: "Social Media",
  news: "News",
  research: "Research",
  community: "Community",
  marketplace: "Marketplace",
  search_trends: "Search Trends",
  other: "Other",
};
