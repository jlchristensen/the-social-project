import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import Reveal from "@/components/ui/Reveal";

export default function FeaturedContent() {
  const featured = blogPosts.slice(0, 3);
  const [first, ...rest] = featured;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-brand-50/60 to-brand-50 py-32 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-700/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="max-w-xl">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-brand-700/40" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-700/85">
                  Latest writing
                </p>
              </div>
              <h2 className="mt-7 text-4xl leading-[1.02] tracking-[-0.02em] text-brand-900 md:text-[3.2rem]">
                Latest from the{" "}
                <span className="font-display font-normal italic">blog</span>.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-brand-900/65">
                Stories, guides, and ideas to help you connect more deeply.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <Link
              href="/blog"
              className="group hidden items-center gap-3 rounded-full border border-brand-700/25 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 transition-all duration-500 hover:border-brand-700 hover:bg-brand-700 hover:text-white md:inline-flex"
            >
              View all posts
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
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Featured large card — deep green, atmospheric */}
          {first && (
            <Reveal className="lg:col-span-7" delay={150}>
              <Link href={`/blog/${first.slug}`} className="group block h-full">
                <article className="relative isolate flex h-full min-h-[26rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-brand-900/10 p-10 text-white transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,32,15,0.45)] md:p-12">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900" />
                  <div className="absolute -right-24 -top-24 -z-10 h-[24rem] w-[24rem] rounded-full bg-brand-200/15 blur-[80px] transition-transform duration-700 group-hover:scale-110" />
                  <div className="grain" />

                  <div className="relative">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm">
                      {first.category}
                    </span>
                  </div>

                  <div className="relative mt-auto pt-16">
                    <h3 className="font-display text-3xl leading-[1.05] md:text-[2.4rem]">
                      {first.title}
                    </h3>
                    <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
                      {first.excerpt}
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                      <span>{first.date}</span>
                      <span className="h-px w-8 bg-white/30" />
                      <span>{first.readTime}</span>
                      <span className="h-px w-8 bg-white/30" />
                      <span className="inline-flex items-center gap-2 text-white/85">
                        Read
                        <svg
                          className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          )}

          {/* Stack of two cards on the right */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={250 + i * 150} className="h-full">
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col justify-between rounded-[2rem] border border-brand-700/10 bg-white/85 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-brand-700/25 hover:bg-white hover:shadow-[0_28px_60px_-30px_rgba(0,32,15,0.25)]">
                    <div>
                      <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                        {post.category}
                      </span>
                      <h3 className="mt-5 text-xl leading-snug tracking-tight text-brand-900 transition-colors duration-300 group-hover:text-brand-600 md:text-[1.4rem]">
                        {post.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-900/65">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-brand-900/45">
                      <span>{post.date}</span>
                      <span className="h-px w-6 bg-brand-900/20" />
                      <span>{post.readTime}</span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/blog"
            className="text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
          >
            View all posts &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
