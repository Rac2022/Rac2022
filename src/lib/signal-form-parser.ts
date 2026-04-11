import { computeOverallScore } from "@/lib/scoring";

export type ParsedSignal = {
  data: {
    title: string;
    source: string;
    sourceType: string;
    url: string;
    summary: string;
    tags: string;
    notes: string;
    noveltyScore: number;
    socialVelocityScore: number;
    searchVolumeScore: number;
    monetizationEaseScore: number;
    saturationScore: number;
    overallScore: number;
    status?: string;
  };
};

export function parseSignalFormData(
  formData: FormData,
  options: { includeStatus?: boolean } = {},
): { data?: ParsedSignal["data"]; error?: string } {
  const title = (formData.get("title") as string)?.trim();
  const source = (formData.get("source") as string)?.trim();
  const summary = (formData.get("summary") as string)?.trim();

  if (!title || !source || !summary) {
    return { error: "Title, source, and summary are required." };
  }

  const scores = {
    noveltyScore: Number(formData.get("noveltyScore")) || 0,
    socialVelocityScore: Number(formData.get("socialVelocityScore")) || 0,
    searchVolumeScore: Number(formData.get("searchVolumeScore")) || 0,
    monetizationEaseScore: Number(formData.get("monetizationEaseScore")) || 0,
    saturationScore: Number(formData.get("saturationScore")) || 0,
  };

  const data: ParsedSignal["data"] = {
    title,
    source,
    sourceType: (formData.get("sourceType") as string) || "other",
    url: (formData.get("url") as string) || "",
    summary,
    tags: (formData.get("tags") as string) || "",
    notes: (formData.get("notes") as string) || "",
    ...scores,
    overallScore: computeOverallScore(scores),
  };

  if (options.includeStatus) {
    data.status = (formData.get("status") as string) || "new";
  }

  return { data };
}
