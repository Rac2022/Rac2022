import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SignalForm } from "@/components/SignalForm";
import { updateSignal } from "./actions";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditSignalPage({ params }: { params: Params }) {
  const { id } = await params;
  const signal = await prisma.trendSignal.findUnique({ where: { id } });

  if (!signal) notFound();

  const boundAction = updateSignal.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/signals/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        &larr; Back to signal
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Signal</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Update any field. Overall score is recomputed on save.
        </p>
      </div>
      <SignalForm
        action={boundAction}
        submitLabel="Update Signal"
        cancelHref={`/signals/${id}`}
        initialValues={{
          title: signal.title,
          source: signal.source,
          sourceType: signal.sourceType,
          url: signal.url,
          summary: signal.summary,
          tags: signal.tags,
          notes: signal.notes,
          status: signal.status,
          noveltyScore: signal.noveltyScore,
          socialVelocityScore: signal.socialVelocityScore,
          searchVolumeScore: signal.searchVolumeScore,
          monetizationEaseScore: signal.monetizationEaseScore,
          saturationScore: signal.saturationScore,
        }}
      />
    </div>
  );
}
