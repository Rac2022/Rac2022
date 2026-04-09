import { CsvImportForm } from "./csv-import-form";

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import Signals</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Upload a CSV file to bulk-import trend signals.
        </p>
      </div>

      <CsvImportForm />

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          CSV Format
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          The CSV must include <strong className="text-[var(--foreground)]">title</strong>,{" "}
          <strong className="text-[var(--foreground)]">source</strong>, and{" "}
          <strong className="text-[var(--foreground)]">summary</strong> columns.
          All other columns are optional.
        </p>
        <div className="overflow-x-auto rounded-lg bg-[var(--background)] p-3">
          <code className="block whitespace-pre text-xs text-[var(--muted-foreground)]">
{`title,source,sourceType,summary,tags,noveltyScore,socialVelocityScore,searchVolumeScore,monetizationEaseScore,saturationScore,status
"AI Tutors",Reddit,community,"AI tutoring apps...",ai,80,70,60,75,20,new`}
          </code>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Scores default to 50 if omitted. Status defaults to &quot;new&quot;.
          Column names are case-insensitive.
        </p>
      </div>
    </div>
  );
}
