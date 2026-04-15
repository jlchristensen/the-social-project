import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: "67%", label: "of Gen Z classify as lonely — the highest of any generation" },
  { value: "34m", label: "average daily time Americans spend socializing in 2024" },
  { value: "5h", label: "average daily social media time for U.S. teens" },
  { value: "1 in 4", label: "people worldwide feel lonely" },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
      {/* Soft sage glow at the top to bridge from the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(95,173,128,0.10)_0%,_transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center justify-center gap-5">
            <span className="h-px w-12 bg-brand-200/30" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-200/85">
              Why this matters
            </p>
            <span className="h-px w-12 bg-brand-200/30" />
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 130}>
              <div className="group relative px-6 lg:border-l lg:border-brand-50/10">
                <p className="font-display text-[3.6rem] leading-none text-brand-200 md:text-[4.4rem]">
                  {stat.value}
                </p>
                <p className="mt-6 max-w-[15rem] text-sm leading-relaxed text-brand-50/70">
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
