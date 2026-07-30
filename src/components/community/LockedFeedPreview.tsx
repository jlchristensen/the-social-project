/**
 * The blurred circle — hazy placeholder cards behind the answer gate.
 *
 * SECURITY: these cards are pure decoration. Real answers never reach the
 * client until the viewer has answered (enforced server-side by RLS), so the
 * only true datum here is the count. The shapes are fixed fakes.
 */

const PLACEHOLDER_SHAPES: { name: number; lines: number[] }[] = [
  { name: 88, lines: [100, 92, 61] },
  { name: 64, lines: [96, 78] },
  { name: 104, lines: [100, 88, 95, 42] },
  { name: 72, lines: [90, 55] },
];

export default function LockedFeedPreview({ count }: { count: number }) {
  if (count < 1) return null;

  const cards = PLACEHOLDER_SHAPES.slice(0, Math.min(count, 4));
  const label =
    count === 1
      ? "1 voice is waiting by the fire"
      : `${count} voices are waiting by the fire`;

  return (
    <section
      aria-label={`${label} — answer to unlock`}
      className="relative mx-auto mt-16 max-w-2xl px-5 pb-6 md:max-w-3xl md:px-8"
    >
      {/* Overlay label sits above the haze */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 flex justify-center px-5">
        <span className="rounded-full border border-ember/30 bg-[#06160d]/80 px-5 py-2.5 font-serif text-base italic text-ember backdrop-blur-sm md:text-lg">
          {label} — answer to unlock
        </span>
      </div>

      {/* The hazy cards, fading into the dark */}
      <div
        aria-hidden
        className="space-y-4 [mask-image:linear-gradient(to_bottom,black_0%,black_35%,transparent_95%)]"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex items-center gap-3 blur-[5px]">
              <span className="h-8 w-8 shrink-0 rounded-full bg-brand-200/25" />
              <span
                className="h-3 rounded-full bg-brand-50/25"
                style={{ width: card.name }}
              />
            </div>
            <div className="mt-4 space-y-2.5 blur-[7px]">
              {card.lines.map((width, j) => (
                <span
                  key={j}
                  className="block h-3 rounded-full bg-brand-50/20"
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
