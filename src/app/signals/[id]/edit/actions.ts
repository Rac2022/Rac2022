"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseSignalFormData } from "@/lib/signal-form-parser";

export async function updateSignal(
  id: string,
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const parsed = parseSignalFormData(formData, { includeStatus: true });
  if (parsed.error || !parsed.data) {
    return { error: parsed.error };
  }

  await prisma.trendSignal.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath(`/signals/${id}`);
  revalidatePath("/digest");
  revalidatePath("/review");
  redirect(`/signals/${id}`);
}
