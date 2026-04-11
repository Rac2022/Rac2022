import { SignalForm } from "@/components/SignalForm";
import { createSignal } from "./actions";

export default function NewSignalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Signal</h1>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          Record a new trend signal with scoring.
        </p>
      </div>
      <SignalForm action={createSignal} cancelHref="/" />
    </div>
  );
}
