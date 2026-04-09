"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateStatus(_prev: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!id || !status) return null;

  await prisma.trendSignal.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/signals/${id}`);
  revalidatePath("/");
  revalidatePath("/review");
  revalidatePath("/digest");
  return null;
}

export async function updateNotes(_prev: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const notes = formData.get("notes") as string;
  if (!id) return null;

  await prisma.trendSignal.update({
    where: { id },
    data: { notes: notes ?? "" },
  });

  revalidatePath(`/signals/${id}`);
  return { saved: true };
}
