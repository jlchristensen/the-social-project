import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* ───── Background image (Ken Burns) ───── */}
      <div className="absolute inset-0 -z-10">
        <div
          className="ken-burns absolute inset-[-7%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/85 via-brand-700/65 to-brand-900/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,32,15,0.55)_100%)]" />
        <div className="grain" />

        {/* Bottom blend so the hero melts into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#eef6f1]/30 to-[#eef6f1]" />
      </div>

      {/* ───── Top meta line ───── */}
      <div className="pointer-events-none absolute inset-x-0 top-28 z-10 mx-auto hidden max-w-7xl items-center justify-between px-10 text-[10px] font-medium uppercase tracking-[0.3em] text-white/55 md:flex">
        <span>The Social Project — Est. 2026</span>
        <span className="flex items-center gap-3">
          <span className="inline-block h-1 w-1 rounded-full bg-brand-200 breathe" />
          Building a movement
        </span>
      </div>

      {/* ───── Side rules (vertical hairlines) ───── */}
      <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
      <div className="pointer-events-none absolute right-6 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* ───── Content ───── */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-6 pt-32 pb-32 md:px-16 md:pt-40 md:pb-40">
        <Reveal delay={250}>
          <h1 className="text-center text-[clamp(2.6rem,8.4vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.025em] text-white">
            <span className="block">Igniting</span>
            <span className="mt-1 block">
              Human{" "}
              <span className="font-display font-normal italic text-brand-200">
                Connection
              </span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={450}>
          <div className="mt-10 flex max-w-2xl items-start gap-4">
            <span className="mt-2 hidden h-px w-10 flex-shrink-0 bg-white/40 sm:block" />
            <p className="text-center text-base leading-relaxed text-white/80 sm:text-left md:text-lg">
              Be yourself. Be social. Meet someone new.{" "}
              <span className="font-medium text-white">
                Welcome to The Social Project.
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/community"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="relative">Join the Community</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/[0.04] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              Read the Blog
            </Link>
          </div>
        </Reveal>

        {/* ───── Scroll hint ───── */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] font-medium uppercase tracking-[0.32em] text-white/55">
          <span>Scroll</span>
          <span className="scroll-hint" />
        </div>
      </div>
    </section>
  );
}
