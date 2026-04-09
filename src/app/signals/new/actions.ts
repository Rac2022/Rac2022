"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeOverallScore } from "@/lib/scoring";

export async function createSignal(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const title = formData.get("title") as string;
  const source = formData.get("source") as string;
  const summary = formData.get("summary") as string;

  if (!title?.trim() || !source?.trim() || !summary?.trim()) {
    return { error: "Title, source, and summary are required." };
  }

  const scoreFields = {
    noveltyScore: Number(formData.get("noveltyScore")) || 0,
    socialVelocityScore: Number(formData.get("socialVelocityScore")) || 0,
    searchVolumeScore: Number(formData.get("searchVolumeScore")) || 0,
    monetizationEaseScore: Number(formData.get("monetizationEaseScore")) || 0,
    saturationScore: Number(formData.get("saturationScore")) || 0,
  };

  const overallScore = computeOverallScore(scoreFields);

  const signal = await prisma.trendSignal.create({
    data: {
      title: title.trim(),
      source: source.trim(),
      sourceType: (formData.get("sourceType") as string) || "other",
      url: (formData.get("url") as string) || "",
      summary: summary.trim(),
      tags: (formData.get("tags") as string) || "",
      ...scoreFields,
      overallScore,
    },
  });

  redirect(`/signals/${signal.id}`);
}
