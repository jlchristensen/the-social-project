import Reveal from "@/components/ui/Reveal";

/* ────────────────────────────────────────────────────────────
   What we stand for — Index Catalogue
   A brutalist filing-card / library register treatment of the
   three pillars. Mono identifiers, classification tags,
   hairline gridlines, and a strict tabular rhythm.
   ──────────────────────────────────────────────────────────── */

const entries = [
  {
    code: "TSP-001",
    title: "REAL CONNECTION",
    sub: "(in person, in full)",
    classification: "Practice",
    body:
      "Eye contact, full attention, the same room. We treat presence as a discipline — one worth defending against every notification engineered to break it.",
  },
  {
    code: "TSP-002",
    title: "RADICAL AUTHENTICITY",
    sub: "(unfiltered, on purpose)",
    classification: "Posture",
    body:
      "We take the curation out of being human. The unedited version of you is the most magnetic thing in any room, and the only one that builds real trust.",
  },
  {
    code: "TSP-003",
    title: "INTENTIONAL LIVING",
    sub: "(less scroll, more soul)",
    classification: "Method",
    body:
      "We design rituals, frameworks, and gentle interruptions that nudge attention back toward the things that actually compose a meaningful life.",
  },
];

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-brand-50 py-28 md:py-36">
      {/* faint blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00200f 1px, transparent 1px), linear-gradient(to bottom, #00200f 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* top register bar */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-brand-900 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-brand-900">
            <span>The Social Project // Manifest No. 001</span>
            <span className="hidden md:inline">
              Filed 2024 · Section A · 03 Entries
            </span>
            <span>↳ what we stand for</span>
          </div>
        </Reveal>

        {/* headline */}
        <Reveal delay={150}>
          <h2 className="mt-14 max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-brand-900">
            A short list of things <br />
            <span className="font-display font-normal italic normal-case text-brand-600">
              we refuse to compromise on.
            </span>
          </h2>
        </Reveal>

        {/* register table */}
        <div className="mt-20">
          {/* column headers */}
          <div className="grid grid-cols-12 gap-6 border-b border-brand-900/30 pb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-brand-900/55">
            <div className="col-span-2">code</div>
            <div className="col-span-5">entry</div>
            <div className="col-span-2">type</div>
            <div className="col-span-3 text-right">notes</div>
          </div>

          {entries.map((e, i) => (
            <Reveal key={e.code} delay={i * 120}>
              <div className="group grid grid-cols-12 items-start gap-6 border-b border-brand-900/20 py-10 transition-colors duration-500 hover:bg-brand-900/[0.04]">
                {/* code */}
                <div className="col-span-2 font-mono text-xs tracking-wide text-brand-700">
                  {e.code}
                  <div className="mt-2 h-px w-6 bg-brand-700/40 transition-all duration-500 group-hover:w-12" />
                </div>

                {/* title block */}
                <div className="col-span-10 md:col-span-5">
                  <h3 className="text-2xl font-bold tracking-tight text-brand-900 md:text-3xl">
                    {e.title}
                  </h3>
                  <p className="mt-1 font-display text-lg italic text-brand-600 md:text-xl">
                    {e.sub}
                  </p>
                </div>

                {/* classification tag */}
                <div className="col-span-6 md:col-span-2">
                  <span className="inline-block border border-brand-900/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-900/70">
                    {e.classification}
                  </span>
                </div>

                {/* notes */}
                <div className="col-span-6 md:col-span-3">
                  <p className="text-[13px] leading-[1.75] text-brand-900/75">
                    {e.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* footer stamp */}
        <Reveal delay={400}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-brand-900/55">
            <span>End of section A · 03 / 03 verified</span>
            <span className="rounded-full border border-brand-900/40 px-3 py-1">
              ✕ filed by hand · 2024 ed.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
