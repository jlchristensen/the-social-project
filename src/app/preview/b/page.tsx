import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatCampfireDate,
  getAnswerCount,
  getCampfireDate,
  getDailyQuestion,
  type DailyQuestion,
} from "@/lib/campfire";
import { blogPosts } from "@/data/blog-posts";
import { resources } from "@/data/resources";
import HeaderB from "./HeaderB";
import NewsletterForm from "./NewsletterForm";
import "./styles.css";

/* ────────────────────────────────────────────────────────────
   Direction B — Clean Light / Editorial
   Warm off-white, deep ink, one green accent. Typography and
   whitespace do the work. The campfire panel is the page's
   single dark surface — the one moment of full contrast.
   ──────────────────────────────────────────────────────────── */

type CampfireData = {
  question: DailyQuestion | null;
  answerCount: number;
  dateLabel: string;
};

async function getCampfireData(): Promise<CampfireData> {
  const today = getCampfireDate();
  const dateLabel = formatCampfireDate(today);

  const supabase = await createClient();

  // Homepage teaser: degrade to the quiet-night state on failure rather than
  // taking the page down. The campfire page itself surfaces errors properly.
  const questionResult = await getDailyQuestion(supabase, today);
  const question = questionResult.ok ? questionResult.data : null;

  let answerCount = 0;
  if (question) {
    const countResult = await getAnswerCount(supabase, question.id);
    if (countResult.ok) answerCount = countResult.data;
  }

  return { question, answerCount, dateLabel };
}

const pillars = [
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

const stats = [
  {
    value: "67%",
    label: "of Gen Z classify as lonely — the highest of any generation",
  },
  {
    value: "34m",
    label: "average daily time Americans spend socializing in 2024",
  },
  { value: "5h", label: "average daily social media time for U.S. teens" },
  { value: "1 in 4", label: "people worldwide feel lonely" },
];

const ArrowIcon = () => (
  <svg
    className="b-arrow"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

export default async function PreviewBPage() {
  const { question, answerCount, dateLabel } = await getCampfireData();
  const featuredPosts = blogPosts.slice(0, 3);
  const startHere = resources.slice(0, 3);

  return (
    <div className="dir-b">
      <HeaderB />

      <main id="main">
        {/* ───── Hero — type-led, reads in two seconds ───── */}
        <section className="b-hero" aria-labelledby="hero-heading">
          <div className="b-container">
            <p className="b-eyebrow b-fade" style={{ animationDelay: "0ms" }}>
              The Social Project — Est. 2026
            </p>
            <h1 id="hero-heading" className="b-hero-title b-fade" style={{ animationDelay: "80ms" }}>
              Igniting human
              <br />
              <em className="b-accent-serif">connection.</em>
            </h1>
            <p className="b-hero-sub b-fade" style={{ animationDelay: "160ms" }}>
              Be yourself. Be social. Meet someone new. A community for people
              who want to live more connected, more real lives.
            </p>
            <div className="b-hero-actions b-fade" style={{ animationDelay: "240ms" }}>
              <Link href="/community" className="b-btn">
                Sit at the fire
                <ArrowIcon />
              </Link>
              <Link href="/merch" className="b-link-arrow">
                Visit the Gift Shop
                <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="b-container">
            <div className="b-hero-rule" aria-hidden="true" />
          </div>
        </section>

        {/* ───── Stats — why this matters ───── */}
        <section className="b-stats" aria-labelledby="stats-heading">
          <div className="b-container">
            <h2 id="stats-heading" className="b-eyebrow">
              Why this matters
            </h2>
            <dl className="b-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="b-stat">
                  <dt className="b-stat-label">{stat.label}</dt>
                  <dd className="b-stat-value">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───── Campfire — the page's single dark surface ───── */}
        <section className="b-campfire" aria-labelledby="campfire-heading">
          <div className="b-container">
            <div className="b-section-head">
              <h2 id="campfire-heading" className="b-h2">
                Sit down at the <em className="b-accent-serif">campfire.</em>
              </h2>
              <p className="b-section-lede">
                One question. Every day. Answer honestly, then see what others
                have to share.
              </p>
            </div>

            <Link href="/community" className="b-fire-card-link">
              <article className="b-fire-card">
                <p className="b-fire-status">
                  <span className="b-live-dot" aria-hidden="true" />
                  {question
                    ? `The fire is lit · ${answerCount} ${
                        answerCount === 1 ? "voice" : "voices"
                      } tonight`
                    : "The fire is quiet tonight"}
                </p>
                <p className="b-fire-label">
                  {question ? "Tonight’s question" : "Tomorrow’s question"}
                </p>
                <p className="b-fire-question">
                  {question
                    ? question.question_text
                    : "A new question is being crafted."}
                </p>
                <span className="b-fire-cta">
                  Sit down at the fire
                  <ArrowIcon />
                </span>
                <p className="b-fire-meta">
                  {dateLabel} · The fire goes out at midnight
                </p>
              </article>
            </Link>
          </div>
        </section>

        {/* ───── Mission — what we stand for ───── */}
        <section className="b-mission" aria-labelledby="mission-heading">
          <div className="b-container">
            <p className="b-eyebrow">What we stand for</p>
            <h2 id="mission-heading" className="b-h2 b-mission-title">
              A short list of things we{" "}
              <em className="b-accent-serif">refuse to compromise on.</em>
            </h2>

            <div className="b-mission-list">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="b-mission-row">
                  <div className="b-mission-left">
                    <p className="b-mono-tag">{pillar.classification}</p>
                    <h3 className="b-mission-name">{pillar.title}</h3>
                    <p className="b-mission-sub">{pillar.sub}</p>
                  </div>
                  <p className="b-mission-body">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Featured content — latest writing ───── */}
        <section className="b-featured" aria-labelledby="featured-heading">
          <div className="b-container">
            <div className="b-featured-head">
              <div>
                <p className="b-eyebrow">Latest writing</p>
                <h2 id="featured-heading" className="b-h2">
                  From the <em className="b-accent-serif">blog.</em>
                </h2>
              </div>
              <Link href="/blog" className="b-link-arrow b-featured-all">
                View all posts
                <ArrowIcon />
              </Link>
            </div>

            {featuredPosts.length > 0 ? (
              <div className="b-post-grid">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="b-card-link"
                  >
                    <article className="b-card">
                      <p className="b-mono-tag">{post.category}</p>
                      <h3 className="b-card-title">{post.title}</h3>
                      <p className="b-card-body">{post.excerpt}</p>
                      <p className="b-card-meta">
                        {post.date} · {post.readTime}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="b-coming-soon">
                <p className="b-coming-soon-title">New stories coming soon.</p>
                <p className="b-coming-soon-body">
                  We’re writing about connection, authenticity, and intentional
                  living. Join the newsletter below to be the first to read.
                </p>
              </div>
            )}

            <div className="b-resources">
              <p className="b-eyebrow">Meanwhile, start here</p>
              <div className="b-post-grid">
                {startHere.map((resource) => (
                  <Link key={resource.id} href="/resources" className="b-card-link">
                    <article className="b-card">
                      <p className="b-mono-tag">
                        {resource.type} · {resource.category}
                      </p>
                      <h3 className="b-card-title">{resource.title}</h3>
                      <p className="b-card-body">{resource.description}</p>
                      <p className="b-card-meta">Free resource</p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───── CTA — newsletter ───── */}
        <section className="b-cta" aria-labelledby="cta-heading">
          <div className="b-container">
            <div className="b-cta-inner">
              <p className="b-eyebrow">Newsletter</p>
              <h2 id="cta-heading" className="b-h2">
                Ready to connect <em className="b-accent-serif">for real?</em>
              </h2>
              <p className="b-cta-body">
                Join our community and get weekly inspiration, resources, and
                stories delivered to your inbox. No spam, just genuine content.
              </p>
              <NewsletterForm />
              <p className="b-cta-fineprint">No spam · Unsubscribe anytime</p>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className="b-footer">
        <div className="b-container">
          <div className="b-footer-grid">
            <div className="b-footer-brand">
              <Link href="/" className="b-brand">
                <span className="b-brand-mark" aria-hidden="true" />
                The Social Project
              </Link>
              <p className="b-footer-tagline">
                Igniting human connection, inspiring authenticity. A community
                for people who want to live more connected, more real lives.
              </p>
            </div>

            <nav className="b-footer-col" aria-labelledby="footer-explore">
              <h3 id="footer-explore" className="b-footer-heading">
                Explore
              </h3>
              <ul>
                <li>
                  <Link href="/community">The Campfire</Link>
                </li>
                <li>
                  <Link href="/merch">The Gift Shop</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/resources">Resources</Link>
                </li>
              </ul>
            </nav>

            <nav className="b-footer-col" aria-labelledby="footer-company">
              <h3 id="footer-company" className="b-footer-heading">
                Company
              </h3>
              <ul>
                <li>
                  <a href="mailto:jackatlancer@gmail.com">Contact</a>
                </li>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Terms</Link>
                </li>
              </ul>
            </nav>

            <nav className="b-footer-col" aria-labelledby="footer-connect">
              <h3 id="footer-connect" className="b-footer-heading">
                Connect
              </h3>
              <ul>
                <li>
                  <a
                    href="https://instagram.com/thesocialproject_official"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@jointhesocialproject"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="b-footer-bottom">
            <span>© {new Date().getFullYear()} The Social Project</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
