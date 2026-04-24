import Link from "next/link";
import type { CampfireActivityItem } from "@/lib/profileActivityFeed";

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface ProfileActivityFeedProps {
  items: CampfireActivityItem[];
}

export default function ProfileActivityFeed({ items }: ProfileActivityFeedProps) {
  return (
    <section className="mb-10" aria-labelledby="campfire-activity-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="campfire-activity-heading"
          className="font-display text-xl text-brand-50"
        >
          Campfire activity
        </h2>
        <p className="font-figtree text-[11px] font-medium uppercase tracking-[0.14em] text-brand-50/45">
          On your voices
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-50/15 bg-white/[0.02] px-4 py-6 text-center">
          <p className="font-figtree text-sm leading-relaxed text-brand-50/55">
            Nothing here yet. When someone{" "}
            <span className="text-brand-50/75">resonates</span> or{" "}
            <span className="text-brand-50/75">writes back</span> to your
            Campfire post, it will show up here.
          </p>
          <Link
            href="/community"
            className="mt-4 inline-block font-figtree text-xs font-semibold uppercase tracking-[0.12em] text-ember transition-colors hover:text-ember-hot"
          >
            Go to the Campfire →
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <Link
                href="/community"
                className="block rounded-xl border border-brand-50/10 bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-[0_12px_40px_-24px_rgba(232,184,106,0.3)]"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-figtree text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      item.kind === "reply"
                        ? "border-brand-50/20 text-brand-50/75"
                        : "border-ember/35 text-ember"
                    }`}
                  >
                    {item.kind === "reply" ? "Reply" : "Resonate"}
                  </span>
                  <span className="font-figtree text-[11px] uppercase tracking-[0.08em] text-brand-50/40">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
                <p className="font-serif text-[17px] leading-snug text-brand-50/95">
                  {item.kind === "reply" ? (
                    <>
                      <span className="italic text-ember">
                        {item.actor_label}
                      </span>{" "}
                      wrote back
                    </>
                  ) : (
                    <>
                      <span className="italic text-ember">
                        {item.actor_label}
                      </span>{" "}
                      resonated with your post
                    </>
                  )}
                </p>
                {item.kind === "reply" && (
                  <p className="mt-1 line-clamp-2 font-figtree text-[13px] leading-relaxed text-brand-50/55">
                    “{item.reply_snippet}”
                  </p>
                )}
                {item.answer_excerpt ? (
                  <p className="mt-2 border-t border-brand-50/10 pt-2 font-figtree text-[11px] leading-relaxed text-brand-50/40">
                    <span className="uppercase tracking-[0.1em] text-brand-50/35">
                      Your post
                    </span>{" "}
                    <span className="text-brand-50/55">{item.answer_excerpt}</span>
                  </p>
                ) : null}
                <p className="mt-2 font-figtree text-[11px] font-semibold uppercase tracking-[0.12em] text-ember">
                  Campfire →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
