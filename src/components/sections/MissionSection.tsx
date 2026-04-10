import Reveal from "@/components/ui/Reveal";

const pillars = [
  {
    number: "01",
    title: "Real Connection",
    description:
      "In a world of likes and followers, we champion face-to-face conversations, deep friendships, and showing up for each other.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Radical Authenticity",
    description:
      "Drop the mask. We believe the most magnetic thing you can be is yourself — unapologetically, imperfectly, beautifully real.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Intentional Living",
    description:
      "Less scrolling, more living. We provide tools and resources to help you build the life and relationships you actually want.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
  },
];

export default function MissionSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-brand-50/70 to-brand-50 py-32 md:py-40">
      {/* Ambient orbs that drift slowly behind the content */}
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-brand-200/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="float-slow pointer-events-none absolute -right-32 bottom-10 h-[26rem] w-[26rem] rounded-full bg-brand-100/55 blur-[120px]"
        style={{ animationDelay: "-7s" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Left: editorial title block (sticks while pillars scroll past) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-brand-700/40" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-700/85">
                  The Pillars
                </p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="mt-7 text-4xl leading-[1.02] tracking-[-0.02em] text-brand-900 md:text-[3.4rem]">
                What we{" "}
                <span className="font-display font-normal italic text-brand-600">
                  stand
                </span>{" "}
                for.
              </h2>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-brand-900/70">
                The Social Project is built on three pillars — the values that
                guide everything we create, share, and believe in.
              </p>
            </Reveal>
          </div>

          {/* Right: pillar cards */}
          <div className="lg:col-span-7">
            <ul className="space-y-6">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 160}>
                  <li className="group relative flex gap-6 rounded-3xl border border-brand-700/10 bg-white/75 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-brand-700/25 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(0,32,15,0.25)] md:p-10">
                    <div className="flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-brand-50 shadow-[0_18px_30px_-12px_rgba(0,32,15,0.4)] transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                        {pillar.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-xs text-brand-600/55">
                          {pillar.number}
                        </span>
                        <span className="h-px flex-1 bg-brand-700/10" />
                      </div>
                      <h3 className="mt-3 text-2xl tracking-tight text-brand-900 md:text-[1.7rem]">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-brand-900/65">
                        {pillar.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
