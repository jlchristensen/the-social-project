import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function CampfireSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
      {/* Warm “fireside” wash: cool mint eases into parchment so this block feels cozier than the rest of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50 via-[#f3ebe3] to-[#e9dfd4]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_50%_100%,rgba(232,184,106,0.16),transparent_62%)]"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <h2 className="max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-brand-900">
            Sit down at the{" "}
            <span className="font-display font-normal italic normal-case text-brand-600">
              campfire.
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-brand-900/65 md:text-lg">
            One question. Every day. Answer honestly, then see what others
            have to share.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <Link href="/community" className="group mt-16 block">
            <article className="relative isolate flex min-h-[20rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-brand-900/10 p-10 text-center text-white transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,32,15,0.45)] md:p-14">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900" />
              <div className="absolute -right-24 -top-24 -z-10 h-[24rem] w-[24rem] rounded-full bg-amber-400/10 blur-[80px] transition-transform duration-700 group-hover:scale-125" />
              <div className="absolute -left-16 -bottom-16 -z-10 h-[18rem] w-[18rem] rounded-full bg-orange-400/8 blur-[60px] transition-transform duration-700 group-hover:scale-110" />
              <div className="grain" />

              <div className="relative">
                <svg
                  className="mx-auto h-12 w-12 text-amber-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                  />
                </svg>

                <h3 className="mt-6 font-display text-3xl leading-[1.05] md:text-[2.4rem]">
                  Today&apos;s question is live
                </h3>

                <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-500 group-hover:border-white group-hover:bg-white/20">
                  Answer now
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </span>
              </div>
            </article>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
