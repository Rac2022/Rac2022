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
  return null;
}
