import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { blogPosts } from "@/data/blog-posts";
import Reveal from "./Reveal";
import NewsletterForm from "./NewsletterForm";
import "./styles.css";

export const metadata: Metadata = {
  title: "The Social Project — Direction A: Refined Campfire",
  description:
    "Igniting human connection, inspiring authenticity. A community for people who want to live more connected, more real lives.",
};

/* ── content (real copy from the live site) ─────────────────── */

const stats = [
  { value: "67%", label: "of Gen Z classify as lonely — the highest of any generation" },
  { value: "34m", label: "average daily time Americans spend socializing in 2024" },
  { value: "5h", label: "average daily social media time for U.S. teens" },
  { value: "1 in 4", label: "people worldwide feel lonely" },
];

const missionEntries = [
  {
    classification: "Practice",
    title: "Real connection",
    sub: "(in person, in full)",
    body: "Eye contact, full attention, the same room. We treat presence as a discipline — one worth defending against every notification engineered to break it.",
  },
  {
    classification: "Posture",
    title: "Radical authenticity",
    sub: "(unfiltered, on purpose)",
    body: "We take the curation out of being human. The unedited version of you is the most magnetic thing in any room, and the only one that builds real trust.",
  },
  {
    classification: "Method",
    title: "Intentional living",
    sub: "(less scroll, more soul)",
    body: "We design rituals, frameworks, and gentle interruptions that nudge attention back toward the things that actually compose a meaningful life.",
  },
];

const footerLinks = {
  Explore: [
    { href: "/community", label: "The Campfire" },
    { href: "/merch", label: "The Gift Shop" },
  ],
  Company: [
    { href: "mailto:jackatlancer@gmail.com", label: "Contact" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms" },
  ],
  Connect: [
    { href: "https://instagram.com/thesocialproject_official", label: "Instagram" },
    { href: "https://tiktok.com/@jointhesocialproject", label: "TikTok" },
  ],
};

/* ── data ───────────────────────────────────────────────────── */

interface DailyQuestion {
  id: string;
  question_text: string;
}

async function getCampfire(): Promise<{
  question: DailyQuestion | null;
  answerCount: number;
  dateLabel: string;
}> {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });
  const dateLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  try {
    const supabase = await createClient();
    const { data: question } = await supabase
      .from("daily_questions")
      .select("*")
      .eq("active_date", today)
      .single();

    let answerCount = 0;
    if (question) {
      const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("question_id", question.id);
      answerCount = count ?? 0;
    }
    return { question, answerCount, dateLabel };
  } catch {
    return { question: null, answerCount: 0, dateLabel };
  }
}

/* ── shared bits ────────────────────────────────────────────── */

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <p className="a-kicker">
      <span>{children}</span>
    </p>
  );
}

/* ── page ───────────────────────────────────────────────────── */

export default async function PreviewA() {
  const { question, answerCount, dateLabel } = await getCampfire();
  const featured = blogPosts.slice(0, 3);

  return (
    <div className="dir-a">
      {/* ── Header ── */}
      <header className="a-header">
        <div className="a-container a-header-inner">
          <Link href="/preview/a" className="a-wordmark">
            The Social Project
          </Link>
          <nav className="a-nav" aria-label="Main navigation">
            <Link href="/community" className="a-nav-link">
              The Campfire
            </Link>
            <Link href="/merch" className="a-nav-link a-nav-link-secondary">
              The Gift Shop
            </Link>
            <Link href="/community" className="a-btn a-btn-primary a-nav-cta">
              Sit at the fire
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="a-hero" aria-labelledby="hero-heading">
          <div className="a-hero-bg" aria-hidden="true">
            <Image
              src="/images/hero-bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="a-hero-scrim" aria-hidden="true" />

          <div className="a-container a-hero-inner">
            <p className="a-hero-est">The Social Project — Est. 2026</p>
            <h1 id="hero-heading">
              Igniting human <em>connection</em>
            </h1>
            <p className="a-hero-sub">
              Be yourself. Be social. Meet someone new.{" "}
              <strong>Welcome to The Social Project.</strong>
            </p>
            <div className="a-hero-actions">
              <Link href="/community" className="a-btn a-btn-primary">
                Sit at the fire
                <ArrowIcon />
              </Link>
              <Link href="/merch" className="a-btn a-btn-ghost">
                The Gift Shop
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="a-section a-stats" aria-labelledby="stats-heading">
          <div className="a-container">
            <Reveal>
              <Kicker>Why this matters</Kicker>
              <h2 id="stats-heading" className="a-h2">
                Loneliness is the problem <em>we exist to solve.</em>
              </h2>
            </Reveal>
            <div className="a-stats-grid">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 60}>
                  <div className="a-stat">
                    <p className="a-stat-value">{stat.value}</p>
                    <p className="a-stat-label">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="a-section" aria-labelledby="mission-heading">
          <div className="a-container">
            <Reveal>
              <Kicker>What we stand for</Kicker>
              <h2 id="mission-heading" className="a-h2">
                A short list of things <em>we refuse to compromise on.</em>
              </h2>
            </Reveal>
            <div className="a-mission-list">
              {missionEntries.map((entry, i) => (
                <Reveal key={entry.title} delay={i * 60}>
                  <article className="a-mission-row">
                    <div>
                      <p className="a-mission-tag">{entry.classification}</p>
                      <h3 className="a-mission-title">{entry.title}</h3>
                      <p className="a-mission-sub">{entry.sub}</p>
                    </div>
                    <p className="a-mission-body">{entry.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Campfire ── */}
        <section className="a-section" aria-labelledby="campfire-heading" style={{ paddingTop: 0 }}>
          <div className="a-container">
            <Reveal>
              <Kicker>The daily ritual</Kicker>
              <h2 id="campfire-heading" className="a-h2">
                Sit down at the <em>campfire.</em>
              </h2>
              <p className="a-lede">
                One question. Every day. Answer honestly, then see what others
                have to share.
              </p>
            </Reveal>

            <Reveal delay={60}>
              <Link href="/community" className="a-campfire-card">
                <span className="a-campfire-status">
                  {question
                    ? `The fire is lit · ${answerCount} ${answerCount === 1 ? "voice" : "voices"} tonight`
                    : "The fire is quiet tonight"}
                </span>

                <p className="a-campfire-eyebrow">
                  {question ? "Tonight’s question" : "Tomorrow’s question"}
                </p>
                <h3 className="a-campfire-question">
                  {question ? question.question_text : "A new question is being crafted."}
                </h3>

                <span className="a-btn a-btn-primary a-campfire-cta">
                  Sit down at the fire
                  <ArrowIcon />
                </span>

                <span className="a-campfire-meta">
                  <span>{dateLabel}</span>
                  <span>The fire goes out at midnight</span>
                </span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── Featured content ── */}
        <section className="a-section a-featured" aria-labelledby="featured-heading">
          <div className="a-container">
            <Reveal>
              <div className="a-featured-head">
                <div>
                  <Kicker>Latest writing</Kicker>
                  <h2 id="featured-heading" className="a-h2">
                    Latest from the <em>blog.</em>
                  </h2>
                  <p className="a-lede">
                    Stories, guides, and ideas to help you connect more deeply.
                  </p>
                </div>
                {featured.length > 0 && (
                  <Link href="/blog" className="a-featured-link">
                    View all posts
                    <ArrowIcon />
                  </Link>
                )}
              </div>
            </Reveal>

            {featured.length === 0 ? (
              <Reveal delay={60}>
                <div className="a-coming-soon">
                  <div>
                    <h3>New stories coming soon</h3>
                    <p>
                      We&apos;re writing about connection, authenticity, and
                      intentional living. Sign up to be the first to read.
                    </p>
                  </div>
                  <Link href="/blog" className="a-btn a-btn-ghost">
                    Visit the blog
                    <ArrowIcon />
                  </Link>
                </div>
              </Reveal>
            ) : (
              <div className="a-post-grid">
                {featured.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 60}>
                    <Link href={`/blog/${post.slug}`} className="a-post-card">
                      <p className="a-post-category">{post.category}</p>
                      <h3 className="a-post-title">{post.title}</h3>
                      <p className="a-post-excerpt">{post.excerpt}</p>
                      <p className="a-post-meta">
                        {post.date} · {post.readTime}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="a-section a-cta" aria-labelledby="cta-heading">
          <div className="a-container">
            <Reveal>
              <Kicker>Newsletter</Kicker>
              <h2 id="cta-heading" className="a-h2">
                Ready to connect <em>for real?</em>
              </h2>
              <p className="a-lede">
                Join our community and get weekly inspiration, resources, and
                stories delivered to your inbox. No spam, just genuine content.
              </p>
              <NewsletterForm />
              <p className="a-cta-note">No spam · Unsubscribe anytime</p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="a-footer">
        <div className="a-container">
          <div className="a-footer-grid">
            <div>
              <Link href="/preview/a" className="a-wordmark">
                The Social Project
              </Link>
              <p className="a-footer-blurb">
                Igniting human connection, inspiring authenticity. A community
                for people who want to live more connected, more real lives.
              </p>
            </div>
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="a-footer-heading">{heading}</h3>
                <ul className="a-footer-list">
                  {links.map((link) => {
                    const isExternal = link.href.startsWith("http");
                    return (
                      <li key={link.label}>
                        {isExternal ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href}>{link.label}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="a-footer-bottom">
            <span>&copy; {new Date().getFullYear()} The Social Project</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
