import { formatEditionDate } from "@/lib/time";

export function EndOfEdition({ count }: { count: number }) {
  return (
    <footer className="py-16 text-center rule-top">
      <div className="font-meta mb-3">— End of edition —</div>
      <p className="font-display text-2xl max-w-xl mx-auto leading-snug">
        You&rsquo;ve finished today&rsquo;s Ledger.
      </p>
      <p className="mt-3 text-[color:var(--ink-muted)] max-w-lg mx-auto">
        {count} {count === 1 ? "story" : "stories"} in this edition. There is nothing
        more to scroll — the next edition arrives tomorrow.
      </p>
      <div className="font-meta mt-6">{formatEditionDate()}</div>
    </footer>
  );
}
