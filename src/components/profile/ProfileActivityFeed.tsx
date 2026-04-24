"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { ProfileActivityDisplayRow } from "@/lib/profileActivityFeed";

const INITIAL_VISIBLE = 3;

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

function rowTime(row: ProfileActivityDisplayRow): string {
  return row.kind === "reply" ? row.created_at : row.latest_at;
}

/** Short line under multi-person resonate bundles. */
function resonateIncludingLine(count: number, samples: string[]): string | null {
  if (count < 2 || samples.length === 0) return null;
  const shown = samples.slice(0, 3);
  const rest = count - shown.length;
  if (rest <= 0) {
    if (shown.length === 1) return null;
    if (shown.length === 2) return `Including ${shown[0]} and ${shown[1]}`;
    return `Including ${shown.slice(0, -1).join(", ")}, and ${shown[shown.length - 1]}`;
  }
  const list = shown.join(", ");
  return `Including ${list}, and ${rest} ${rest === 1 ? "other" : "others"}`;
}

function ActivityRow({ item }: { item: ProfileActivityDisplayRow }) {
  const resonateSub =
    item.kind === "resonate_bundle"
      ? resonateIncludingLine(item.count, item.sample_names)
      : null;

  return (
    <li>
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
            {timeAgo(rowTime(item))}
          </span>
        </div>
        <p className="font-serif text-[17px] leading-snug text-brand-50/95">
          {item.kind === "reply" ? (
            <>
              <span className="italic text-ember">{item.actor_label}</span>{" "}
              wrote back
            </>
          ) : item.count === 1 ? (
            <>
              <span className="italic text-ember">
                {item.sample_names[0] ?? "Someone"}
              </span>{" "}
              resonated
            </>
          ) : (
            <>
              <span className="text-ember">{item.count}</span> people resonated
            </>
          )}
        </p>
        {item.kind === "reply" && (
          <p className="mt-1 line-clamp-2 font-figtree text-[13px] leading-relaxed text-brand-50/55">
            “{item.reply_snippet}”
          </p>
        )}
        {resonateSub ? (
          <p className="mt-1 font-figtree text-[13px] leading-relaxed text-brand-50/50">
            {resonateSub}
          </p>
        ) : null}
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
  );
}

interface ProfileActivityFeedProps {
  rows: ProfileActivityDisplayRow[];
}

export default function ProfileActivityFeed({ rows }: ProfileActivityFeedProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hiddenCount = Math.max(0, rows.length - INITIAL_VISIBLE);
  const visibleRows = expanded ? rows : rows.slice(0, INITIAL_VISIBLE);
  const showToggle = rows.length > INITIAL_VISIBLE;

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

      {rows.length === 0 ? (
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
        <>
          <ul id={listId} className="flex flex-col gap-2.5">
            {visibleRows.map((item) => (
              <ActivityRow key={rowKey(item)} item={item} />
            ))}
          </ul>
          {showToggle ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                aria-controls={listId}
                className="rounded-full border border-brand-50/15 bg-white/[0.04] px-4 py-2 font-figtree text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-50/70 transition-colors hover:border-ember/35 hover:text-ember"
              >
                {expanded
                  ? "Show less"
                  : `Show ${hiddenCount} more`}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function rowKey(item: ProfileActivityDisplayRow): string {
  return item.kind === "reply"
    ? `reply-${item.id}`
    : `resonate-${item.answer_id}`;
}
