/**
 * "N nights at the fire" — the streak, shown beside tonight's question.
 * Renders nothing for a streak of zero; the fire invites, it doesn't shame.
 */
export default function StreakBadge({ streak }: { streak: number }) {
  if (streak < 1) return null;

  const label =
    streak === 1 ? "1 night at the fire" : `${streak} nights at the fire`;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ember/25 bg-ember/[0.05] px-4 py-1.5 font-figtree text-[11px] font-medium uppercase tracking-[0.2em] text-ember/90">
      <svg
        className="h-3 w-3 flame-pulse"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2c.5 3.5-1.5 5-3 7-1.6 2.1-2.5 4-2.5 6A5.5 5.5 0 0 0 12 20.5 5.5 5.5 0 0 0 17.5 15c0-2-.7-3.7-2-5.5-.9 1.2-1.7 1.8-2.5 2 .8-2.6.3-6-1-9.5Z" />
      </svg>
      {label}
    </span>
  );
}
