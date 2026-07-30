import Link from "next/link";
import type { UnreadActivityCounts } from "@/lib/profileActivityFeed";

/**
 * "While you were away" — the first thing a returning member sees when their
 * last answer drew resonates or replies. Reciprocity is the strongest reason
 * to come back, so it greets them before tonight's question does.
 */
export default function WelcomeBack({
  counts,
}: {
  counts: UnreadActivityCounts;
}) {
  const { resonates, replies } = counts;
  if (resonates + replies === 0) return null;

  const parts: string[] = [];
  if (resonates > 0) {
    parts.push(
      resonates === 1
        ? "someone resonated with your voice"
        : `${resonates} people resonated with your voice`
    );
  }
  if (replies > 0) {
    parts.push(replies === 1 ? "someone wrote back" : `${replies} wrote back`);
  }

  return (
    <div className="mb-8 flex justify-center">
      <Link
        href="/profile"
        className="group inline-flex max-w-full items-center gap-3 rounded-full border border-ember/30 bg-ember/[0.07] px-5 py-2.5 transition-all duration-300 hover:border-ember/60 hover:bg-ember/[0.12]"
      >
        <span className="campfire-gate-dot h-[7px] w-[7px] shrink-0 rounded-full bg-ember shadow-[0_0_12px_rgba(245,210,139,0.9)]" />
        <span className="truncate font-serif text-[15px] italic text-ember md:text-base">
          While you were away, {parts.join(" and ")}
        </span>
        <svg
          className="h-3 w-3 shrink-0 text-ember/70 transition-transform duration-300 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
