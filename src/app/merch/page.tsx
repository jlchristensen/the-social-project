import Link from "next/link";

export const metadata = {
  title: "The Gift Shop — The Social Project",
  description:
    "The Gift Shop is coming soon. Goods, apparel, and conversation cards that spark real connection.",
};

export default function MerchPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(120%_60%_at_50%_0%,rgba(232,184,106,0.10),transparent_60%),radial-gradient(80%_50%_at_50%_100%,rgba(232,184,106,0.14),transparent_60%),linear-gradient(180deg,#08180e_0%,#06160d_30%,#04130a_100%)] text-brand-50">
      <div className="grain" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center md:px-8">
        <span className="font-figtree text-[11px] font-medium uppercase tracking-[0.32em] text-ember/80">
          The Gift Shop
        </span>

        <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-brand-50 md:text-6xl">
          Coming{" "}
          <span className="font-display font-normal italic text-ember">
            soon
          </span>
        </h1>

        <p className="mt-6 max-w-md font-figtree text-base leading-relaxed text-brand-50/70 md:text-lg">
          We&rsquo;re stocking the shelves. Goods, apparel, and conversation
          cards that carry the fire with you — dropping soon.
        </p>

        <span className="mt-10 block h-12 w-px bg-gradient-to-b from-transparent via-ember/60 to-transparent" />

        <Link
          href="/community"
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/[0.04] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white/10"
        >
          Sit at the fire
          <svg
            className="h-3.5 w-3.5"
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
        </Link>
      </div>
    </section>
  );
}
