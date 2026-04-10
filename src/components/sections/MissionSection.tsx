import Reveal from "@/components/ui/Reveal";

/* ────────────────────────────────────────────────────────────
   What we stand for — Index Catalogue
   A brutalist filing-card / library register treatment of the
   three pillars. Mono identifiers, classification tags,
   hairline gridlines, and a strict tabular rhythm.
   ──────────────────────────────────────────────────────────── */

const entries = [
  {
    classification: "Practice",
    title: "REAL CONNECTION",
    sub: "(in person, in full)",
    body:
      "Eye contact, full attention, the same room. We treat presence as a discipline — one worth defending against every notification engineered to break it.",
  },
  {
    classification: "Posture",
    title: "RADICAL AUTHENTICITY",
    sub: "(unfiltered, on purpose)",
    body:
      "We take the curation out of being human. The unedited version of you is the most magnetic thing in any room, and the only one that builds real trust.",
  },
  {
    classification: "Method",
    title: "INTENTIONAL LIVING",
    sub: "(less scroll, more soul)",
    body:
      "We design rituals, frameworks, and gentle interruptions that nudge attention back toward the things that actually compose a meaningful life.",
  },
];

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-brand-50 py-28 md:py-36">
      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* headline */}
        <Reveal>
          <h2 className="max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-brand-900">
            A short list of things <br />
            <span className="font-display font-normal italic normal-case text-brand-600">
              we refuse to compromise on.
            </span>
          </h2>
        </Reveal>

        {/* entries */}
        <div className="mt-24 space-y-20 md:space-y-24">
          {entries.map((e, i) => (
            <Reveal key={e.title} delay={i * 120}>
              <article className="grid grid-cols-12 items-start gap-6 md:gap-12">
                <div className="col-span-12 md:col-span-5">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-600">
                    {e.classification}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-brand-900 md:text-4xl">
                    {e.title}
                  </h3>
                  <p className="mt-2 font-display text-xl italic text-brand-600 md:text-2xl">
                    {e.sub}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-base leading-[1.8] text-brand-900/75 md:text-lg">
                    {e.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
