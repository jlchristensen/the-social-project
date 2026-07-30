import { formatCampfireDate, type Night } from "@/lib/campfire";

const INITIAL_VISIBLE = 5;

/**
 * Your nights — every question this member has ever answered, newest first.
 * A quiet private journal that accumulates; nights past the first few sit
 * behind a native <details> fold.
 */
export default function YourNights({ nights }: { nights: Night[] }) {
  if (nights.length === 0) return null;

  const visible = nights.slice(0, INITIAL_VISIBLE);
  const folded = nights.slice(INITIAL_VISIBLE);

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-figtree text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-50/60">
          Your nights
        </h2>
        <span className="font-figtree text-[11px] text-brand-50/40">
          {nights.length} {nights.length === 1 ? "night" : "nights"} at the
          fire
        </span>
      </div>

      <ol className="space-y-3">
        {visible.map((night) => (
          <NightRow key={night.created_at} night={night} />
        ))}
      </ol>

      {folded.length > 0 && (
        <details className="group mt-3">
          <summary className="cursor-pointer list-none text-center font-figtree text-[11px] font-medium uppercase tracking-[0.2em] text-brand-50/50 transition-colors hover:text-ember">
            <span className="group-open:hidden">
              Show {folded.length} earlier{" "}
              {folded.length === 1 ? "night" : "nights"}
            </span>
            <span className="hidden group-open:inline">Show fewer</span>
          </summary>
          <ol className="mt-3 space-y-3">
            {folded.map((night) => (
              <NightRow key={night.created_at} night={night} />
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

function NightRow({ night }: { night: Night }) {
  return (
    <li className="rounded-xl border border-brand-50/10 bg-white/[0.02] p-4">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className="font-figtree text-[11px] uppercase tracking-[0.08em] text-brand-50/40">
          {formatCampfireDate(night.active_date)}
        </span>
        {night.is_anonymous && (
          <span className="rounded-full border border-brand-50/20 px-2 py-0.5 font-figtree text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-50/60">
            Anonymous
          </span>
        )}
      </div>
      <p className="font-serif text-[15px] italic leading-snug text-ember/90">
        {night.question_text}
      </p>
      <p className="mt-2 whitespace-pre-line font-serif text-[16px] leading-relaxed text-brand-50/90">
        {night.body}
      </p>
    </li>
  );
}
