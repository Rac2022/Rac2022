"use client";

import { useActionState } from "react";
import { createSignal } from "./actions";
import { SOURCE_TYPE_OPTIONS, SOURCE_TYPE_LABELS } from "@/lib/scoring";

const SCORE_FIELDS = [
  { name: "noveltyScore", label: "Novelty", weight: "25%" },
  { name: "socialVelocityScore", label: "Social Velocity", weight: "25%" },
  { name: "searchVolumeScore", label: "Search Volume", weight: "20%" },
  { name: "monetizationEaseScore", label: "Monetization Ease", weight: "20%" },
  { name: "saturationScore", label: "Saturation", weight: "10% inverse" },
] as const;

type FormState = { error?: string } | null;

export function SignalForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(createSignal, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            color: "var(--danger)",
            border: "1px solid var(--danger)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          }}
        >
          {state.error}
        </div>
      )}

      <fieldset disabled={isPending} className="space-y-4">
        <Field label="Title" required>
          <input
            name="title"
            required
            className="input-field"
            placeholder="e.g. AI-Powered Personal Stylists"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Source" required>
            <input
              name="source"
              required
              className="input-field"
              placeholder="e.g. TikTok, Hacker News"
            />
          </Field>
          <Field label="Source Type">
            <select name="sourceType" className="input-field" defaultValue="other">
              {SOURCE_TYPE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {SOURCE_TYPE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="URL">
          <input name="url" type="url" className="input-field" placeholder="https://..." />
        </Field>

        <Field label="Summary" required>
          <textarea
            name="summary"
            required
            rows={3}
            className="input-field resize-none"
            placeholder="Describe the trend signal and why it matters..."
          />
        </Field>

        <Field label="Tags">
          <input
            name="tags"
            className="input-field"
            placeholder="comma-separated: ai, saas, health"
          />
        </Field>

        <Field label="Notes">
          <textarea
            name="notes"
            rows={2}
            className="input-field resize-none"
            placeholder="Private notes, research links, follow-ups..."
          />
        </Field>

        <div className="space-y-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <h3 className="text-sm font-medium">Scores (0-100)</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SCORE_FIELDS.map((f) => (
              <Field key={f.name} label={`${f.label} (${f.weight})`}>
                <input
                  name={f.name}
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={50}
                  className="input-field"
                />
              </Field>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Signal"}
        </button>
      </fieldset>

    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[var(--muted)]">
        {label}
        {required && <span className="text-[var(--danger)]"> *</span>}
      </span>
      {children}
    </label>
  );
}
