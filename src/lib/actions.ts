"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { computeOverallScore } from "@/lib/scoring";

export async function updateSignalStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!id || !status) return;

  await prisma.trendSignal.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  revalidatePath(`/signals/${id}`);
  revalidatePath("/review");
  revalidatePath("/digest");
}

export async function updateSignalNotes(formData: FormData) {
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;
  if (!id) return;

  await prisma.trendSignal.update({
    where: { id },
    data: { notes: notes ?? "" },
  });

  revalidatePath(`/signals/${id}`);
}

export async function importSignalsFromCsv(
  _prev: { success?: number; error?: string } | null,
  formData: FormData,
): Promise<{ success?: number; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Please select a CSV file." };
  }

  const text = await file.text();
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return { error: "CSV must have a header row and at least one data row." };
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const titleIdx = headers.indexOf("title");
  const sourceIdx = headers.indexOf("source");
  const summaryIdx = headers.indexOf("summary");

  if (titleIdx === -1 || sourceIdx === -1 || summaryIdx === -1) {
    return { error: "CSV must include title, source, and summary columns." };
  }

  const getCol = (row: string[], idx: number) =>
    idx >= 0 && idx < row.length ? row[idx].replace(/^"|"$/g, "").trim() : "";
  const getNumCol = (row: string[], idx: number) => {
    const val = Number(getCol(row, idx));
    return isNaN(val) ? 50 : Math.max(0, Math.min(100, val));
  };

  const sourceTypeIdx = headers.indexOf("sourcetype");
  const urlIdx = headers.indexOf("url");
  const tagsIdx = headers.indexOf("tags");
  const notesIdx = headers.indexOf("notes");
  const noveltyIdx = headers.indexOf("noveltyscore");
  const socialIdx = headers.indexOf("socialvelocityscore");
  const searchIdx = headers.indexOf("searchvolumescore");
  const monetIdx = headers.indexOf("monetizationeasescore");
  const satIdx = headers.indexOf("saturationscore");
  const statusIdx = headers.indexOf("status");

  let imported = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].match(/(".*?"|[^,]+)/g)?.map((c) => c.trim()) ?? [];
    const title = getCol(row, titleIdx);
    const source = getCol(row, sourceIdx);
    const summary = getCol(row, summaryIdx);
    if (!title || !source || !summary) continue;

    const scores = {
      noveltyScore: getNumCol(row, noveltyIdx),
      socialVelocityScore: getNumCol(row, socialIdx),
      searchVolumeScore: getNumCol(row, searchIdx),
      monetizationEaseScore: getNumCol(row, monetIdx),
      saturationScore: getNumCol(row, satIdx),
    };

    await prisma.trendSignal.create({
      data: {
        title,
        source,
        sourceType: getCol(row, sourceTypeIdx) || "other",
        url: getCol(row, urlIdx),
        summary,
        notes: getCol(row, notesIdx),
        tags: getCol(row, tagsIdx),
        ...scores,
        overallScore: computeOverallScore(scores),
        status: getCol(row, statusIdx) || "new",
      },
    });
    imported++;
  }

  revalidatePath("/");
  revalidatePath("/review");
  revalidatePath("/digest");
  return { success: imported };
}
