import Link from "next/link";

/**
 * Design-direction chooser. Temporary — delete this whole /preview tree
 * (and the escape hatch in SiteChrome) once a direction has been picked
 * and rolled out across the site.
 */

const DIRECTIONS = [
  {
    slug: "a",
    name: "Refined Campfire",
    thesis: "Your identity, calmed down.",
    detail:
      "Keeps the forest green and ember gold and the campfire metaphor, but strips the grain, the Ken Burns zoom, the drifting embers and the slow reveals. Same soul, far less noise.",
    risk: "Lowest risk. The site still feels unmistakably like yours.",
  },
  {
    slug: "b",
    name: "Clean Light",
    thesis: "Editorial and airy.",
    detail:
      "A full departure. Warm off-white base, deep ink type, one restrained accent. Typography and whitespace do all the work — near-zero ornament.",
    risk: "Biggest change. Maximum clarity, but the current atmosphere is gone.",
  },
  {
    slug: "c",
    name: "Modern Dark Minimal",
    thesis: "Dark, but architectural.",
    detail:
      "Stays dark like today's site, drops the green atmosphere for a neutral near-black. Hairline borders, precise grid, one warm accent used with discipline.",
    risk: "The middle path — modern and sharp without going light.",
  },
];

export default function PreviewIndexPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0b0b0c] px-6 py-20 text-white md:px-12">
      <main className="mx-auto max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
          The Social Project
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.02em] md:text-5xl">
          Pick a direction
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
          Three complete takes on the homepage — same content, same copy, three
          different points of view. Open each one, then tell me which to roll
          across the rest of the site.
        </p>

        <ul className="mt-14 space-y-4">
          {DIRECTIONS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/preview/${d.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-[-0.01em]">
                    <span className="text-white/40">
                      {d.slug.toUpperCase()}.
                    </span>{" "}
                    {d.name}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="text-white/35 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
                  >
                    →
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-white/80">
                  {d.thesis}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {d.detail}
                </p>
                <p className="mt-4 text-[13px] leading-relaxed text-white/40">
                  {d.risk}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-14 text-sm text-white/40">
          Current live homepage for comparison:{" "}
          <Link
            href="/"
            className="text-white/70 underline underline-offset-4 transition-colors hover:text-white"
          >
            the existing design
          </Link>
        </p>
      </main>
    </div>
  );
}
