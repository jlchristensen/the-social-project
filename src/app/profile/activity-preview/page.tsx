import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Preview: Profile activity",
  robots: { index: false, follow: false },
};

const notifBase =
  "block rounded-xl border border-brand-50/10 bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/35 hover:shadow-[0_12px_40px_-24px_rgba(232,184,106,0.35)]";

const notifUnread =
  "border-ember/30 bg-[radial-gradient(500px_120px_at_10%_-40%,rgba(232,184,106,0.07),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] shadow-[inset_0_0_40px_rgba(232,184,106,0.04)]";

export default function ProfileActivityPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <p className="mb-4 rounded-xl border border-dashed border-ember/35 bg-white/[0.03] px-4 py-2.5 font-figtree text-xs leading-relaxed text-brand-50/65">
          <strong className="font-semibold text-ember">Design preview</strong>{" "}
          — dev only at{" "}
          <code className="text-brand-50/85">/profile/activity-preview</code>.
          Not shown in production builds.
        </p>

        <div className="mb-10">
          <h1 className="mb-2 font-display text-4xl text-brand-50">
            Your profile
          </h1>
          <p className="text-lg text-brand-50/60">
            This is how other community members will see you.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-brand-50/10 bg-white/[0.04] px-5 py-4">
          <p className="text-sm text-brand-50/65">
            <span className="font-medium text-brand-100">Email:</span>{" "}
            you@example.com
          </p>
          <p className="mt-1 text-sm text-brand-50/65">
            <span className="font-medium text-brand-100">Member since:</span>{" "}
            April 2026
          </p>
        </div>

        <section className="mb-8" aria-labelledby="activity-heading">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2
              id="activity-heading"
              className="font-display text-xl text-brand-50"
            >
              Activity
            </h2>
            <p className="shrink-0 font-figtree text-[11px] font-medium uppercase tracking-[0.14em] text-brand-50/45">
              <span className="text-ember">3</span> unread · In-app only
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/community"
              className={`${notifBase} ${notifUnread}`}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember shadow-[0_0_12px_rgba(232,184,106,0.6)]"
                  aria-hidden
                />
                <span className="rounded-full border border-brand-50/20 px-2 py-0.5 font-figtree text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-50/75">
                  Reply
                </span>
              </div>
              <p className="font-serif text-[17px] leading-snug text-brand-50/95">
                Maya replied to your post
              </p>
              <p className="mt-1 line-clamp-2 font-figtree text-[13px] leading-relaxed text-brand-50/55">
                “This landed — especially the part about showing up when it’s
                uncomfortable.”
              </p>
              <div className="mt-2.5 flex items-center justify-between font-figtree text-[11px] uppercase tracking-[0.08em] text-brand-50/40">
                <span>Just now</span>
                <span className="font-semibold tracking-[0.12em] text-ember">
                  View →
                </span>
              </div>
            </Link>

            <Link
              href="/community"
              className={`${notifBase} ${notifUnread}`}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember shadow-[0_0_12px_rgba(232,184,106,0.6)]"
                  aria-hidden
                />
                <span className="rounded-full border border-ember/35 px-2 py-0.5 font-figtree text-[10px] font-semibold uppercase tracking-[0.16em] text-ember">
                  Resonate
                </span>
              </div>
              <p className="font-serif text-[17px] leading-snug text-brand-50/95">
                12 people resonated with your post
              </p>
              <p className="mt-1 line-clamp-2 font-figtree text-[13px] leading-relaxed text-brand-50/55">
                Counts update as more folks tap Resonate; one line per
                day&apos;s answer instead of a ping every time.
              </p>
              <div className="mt-2.5 flex items-center justify-between font-figtree text-[11px] uppercase tracking-[0.08em] text-brand-50/40">
                <span>Batched · 4m ago</span>
                <span className="font-semibold tracking-[0.12em] text-ember">
                  Campfire →
                </span>
              </div>
            </Link>

            <Link href="/community" className={notifBase}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="rounded-full border border-brand-50/20 px-2 py-0.5 font-figtree text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-50/75">
                  Reply
                </span>
              </div>
              <p className="font-serif text-[17px] leading-snug text-brand-50/90">
                Alex replied to your post
              </p>
              <p className="mt-1 line-clamp-2 font-figtree text-[13px] leading-relaxed text-brand-50/55">
                “Same here — small steps still count.”
              </p>
              <div className="mt-2.5 flex items-center justify-between font-figtree text-[11px] uppercase tracking-[0.08em] text-brand-50/40">
                <span>Yesterday</span>
                <span className="font-semibold tracking-[0.12em] text-ember">
                  View →
                </span>
              </div>
            </Link>
          </div>
        </section>

        <div className="border-t border-dashed border-ember/20 pt-6">
          <p className="mb-1.5 text-sm font-medium text-brand-100">
            Display name
          </p>
          <div className="mb-4 w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 font-figtree text-sm text-brand-50/35">
            Your name (existing form continues below…)
          </div>
          <p className="mb-1.5 text-sm font-medium text-brand-100">Bio</p>
          <div className="min-h-20 w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 font-figtree text-sm text-brand-50/35">
            …
          </div>
        </div>
      </div>
    </div>
  );
}
