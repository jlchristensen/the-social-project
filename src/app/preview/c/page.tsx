import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import HeaderC from "./HeaderC";
import CampfirePanel from "./CampfirePanel";
import NewsletterForm from "./NewsletterForm";
import "./styles.css";

export const metadata: Metadata = {
  title: "Direction C — Modern Dark Minimal | The Social Project",
  description:
    "Homepage design preview: neutral dark, hairline architecture, one warm accent.",
};

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

const missionEntries = [
  {
    classification: "Practice",
    title: "Real Connection",
    sub: "(in person, in full)",
    body: "Eye contact, full attention, the same room. We treat presence as a discipline — one worth defending against every notification engineered to break it.",
  },
  {
    classification: "Posture",
    title: "Radical Authenticity",
    sub: "(unfiltered, on purpose)",
    body: "We take the curation out of being human. The unedited version of you is the most magnetic thing in any room, and the only one that builds real trust.",
  },
  {
    classification: "Method",
    title: "Intentional Living",
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
    {
      href: "https://instagram.com/thesocialproject_official",
      label: "Instagram",
    },
    { href: "https://tiktok.com/@jointhesocialproject", label: "TikTok" },
  ],
};

export default function PreviewCPage() {
  const featured = blogPosts.slice(0, 3);

  return (
    <div className="dir-c">
      <div className="c-shell">
        <HeaderC />

        <main>
          {/* ── Hero — type-led, image as document ── */}
          <section className="c-hero" aria-labelledby="hero-heading">
            <div className="c-frame">
              <div className="c-hero-meta">
                <p className="c-eyebrow">The Social Project — Est. 2026</p>
                <p className="c-eyebrow">Building a movement</p>
              </div>

              <h1 id="hero-heading">
                Igniting
                <br />
                Human <span className="c-serif">Connection</span>
              </h1>

              <div className="c-hero-foot">
                <p className="c-hero-sub">
                  Be yourself. Be social. Meet someone new.{" "}
                  <strong>Welcome to The Social Project.</strong>
                </p>
                <div className="c-hero-actions">
                  <Link href="/community" className="c-btn c-btn-gold">
                    Sit at the fire
                    <span className="c-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                  <Link href="/merch" className="c-btn c-btn-line">
                    The Gift Shop
                  </Link>
                </div>
              </div>
            </div>

            <div className="c-hero-band">
              <Image
                src="/images/hero-bg.jpg"
                alt="People gathered together around a fire at dusk"
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div className="c-frame c-hero-caption">
              <p className="c-eyebrow">Fig. 01 — Around the fire</p>
              <p className="c-eyebrow">Presence over performance</p>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="c-stats" aria-labelledby="stats-heading">
            <div className="c-frame">
              <p className="c-eyebrow">Why this matters</p>
              <h2 id="stats-heading" className="c-h2">
                The numbers behind the{" "}
                <span className="c-serif">disconnect</span>.
              </h2>

              <div className="c-stats-grid">
                {stats.map((stat) => (
                  <div key={stat.label} className="c-stat">
                    <p className="c-stat-value">{stat.value}</p>
                    <p className="c-stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Campfire teaser (live daily question) ── */}
          <CampfirePanel />

          {/* ── Mission ledger ── */}
          <section className="c-mission" aria-labelledby="mission-heading">
            <div className="c-frame">
              <p className="c-eyebrow">What we stand for</p>
              <h2 id="mission-heading" className="c-h2">
                A short list of things we refuse to{" "}
                <span className="c-serif">compromise</span> on.
              </h2>

              <div className="c-mission-list">
                {missionEntries.map((entry) => (
                  <article key={entry.title} className="c-mission-row">
                    <p className="c-eyebrow">{entry.classification}</p>
                    <div>
                      <h3 className="c-mission-title">{entry.title}</h3>
                      <p className="c-mission-sub">{entry.sub}</p>
                    </div>
                    <p className="c-mission-body">{entry.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* ── Featured content ── */}
          <section className="c-featured" aria-labelledby="featured-heading">
            <div className="c-frame">
              <div className="c-featured-head">
                <div>
                  <p className="c-eyebrow">Latest writing</p>
                  <h2 id="featured-heading" className="c-h2">
                    Latest from the <span className="c-serif">blog</span>.
                  </h2>
                </div>
                <Link href="/blog" className="c-textlink">
                  View all posts
                  <span className="c-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>

              {featured.length === 0 ? (
                <Link href="/blog" className="c-empty-panel">
                  <h3 className="c-empty-title">New stories coming soon</h3>
                  <p className="c-empty-body">
                    We&apos;re writing about connection, authenticity, and
                    intentional living. Sign up to be the first to read.
                  </p>
                  <span className="c-empty-cue">
                    Get notified
                    <span className="c-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="c-post-grid">
                  {featured.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="c-post"
                    >
                      <p className="c-eyebrow">{post.category}</p>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <span className="c-post-meta">
                        {post.date} &middot; {post.readTime}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Newsletter CTA ── */}
          <section className="c-cta" aria-labelledby="cta-heading">
            <div className="c-frame">
              <div className="c-cta-grid">
                <div>
                  <p className="c-eyebrow">Newsletter</p>
                  <h2 id="cta-heading" className="c-h2">
                    Ready to connect <span className="c-serif">for real</span>?
                  </h2>
                  <p className="c-cta-body">
                    Join our community and get weekly inspiration, resources,
                    and stories delivered to your inbox. No spam, just genuine
                    content.
                  </p>
                </div>
                <NewsletterForm />
              </div>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="c-footer">
          <div className="c-frame">
            <div className="c-footer-grid">
              <div>
                <Link href="/" className="c-logo">
                  <span className="c-logo-mark" aria-hidden="true" />
                  The Social Project
                </Link>
                <p className="c-footer-tag">
                  Igniting human connection, inspiring authenticity. A
                  community for people who want to live more connected, more
                  real lives.
                </p>
              </div>

              {Object.entries(footerLinks).map(([heading, links]) => (
                <nav key={heading} aria-label={heading}>
                  <h3>{heading}</h3>
                  <ul>
                    {links.map((link) =>
                      link.href.startsWith("http") ? (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        </li>
                      ) : (
                        <li key={link.label}>
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              ))}
            </div>

            <div className="c-footer-base">
              <p className="c-eyebrow">
                &copy; {new Date().getFullYear()} The Social Project
              </p>
              <p className="c-eyebrow">All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
