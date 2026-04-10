import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "50%", label: "of U.S. adults experience measurable loneliness" },
  { value: "7h", label: "average daily screen time per person" },
  { value: "70%", label: "drop in time young adults spend with friends since 2003" },
  { value: "5×", label: "increase in men reporting zero close friends since 1990" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-brand-50 py-28 md:py-36">
      {/* Soft ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(208,232,217,0.55)_0%,_transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center justify-center gap-5">
            <span className="h-px w-12 bg-brand-700/30" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-700/85">
              Why this matters
            </p>
            <span className="h-px w-12 bg-brand-700/30" />
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 130}>
              <div className="group relative px-6 lg:border-l lg:border-brand-700/15">
                <p className="font-display text-[3.6rem] leading-none text-brand-700 md:text-[4.4rem]">
                  {stat.value}
                </p>
                <p className="mt-6 max-w-[15rem] text-sm leading-relaxed text-brand-900/70">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
