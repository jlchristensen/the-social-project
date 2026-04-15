# Analytics Platform Research for The Social Project

**Date:** April 15, 2026
**Task:** Roadmap items 1.6–1.8 — Choose and install analytics, set up conversion tracking
**Status:** Complete — Recommendation made

---

## Topic

Which analytics platform should The Social Project use to track site traffic, page views, and email signup conversions?

## Why This Matters for The Social Project

Right now you're flying blind. You don't know how many people visit the site, which pages they look at, whether they find the community tab, or if your email capture form is converting. Analytics is the dashboard for your car — without it, you're driving at night with the headlights off.

For a community brand, understanding your audience isn't just about vanity metrics. It tells you:
- **Where people come from** — so you know which channels to invest in
- **What they do on the site** — so you know what resonates
- **Whether they sign up** — so you know your conversion rate
- **When they bounce** — so you know what's not working

Every day without analytics is a day of missed insight. And with the community feature now live, you need to know if people are actually finding and using it.

---

## Options Evaluated

### Option A: Plausible Analytics

- **Free plan:** None — 30-day free trial only
- **Paid plan:** Growth at $9/month ($6/month billed yearly) for 100K monthly pageviews, unlimited websites, 3 team members
- **Higher tiers:** Business at $19/month (1M pageviews, 50 sites, 10 team members), Enterprise (custom pricing)
- **Script size:** Less than 1KB — essentially invisible impact on page load speed
- **Cookie usage:** None. No cookies at all. Zero. This means no cookie consent banners needed anywhere in the world (GDPR, CCPA, ePrivacy — all compliant out of the box)
- **Dashboard:** Clean, single-page dashboard. Top pages, referrers, countries, devices — all visible at a glance. Designed so anyone can understand it in seconds
- **Custom events:** Supported on all plans. Track things like "Email Signup" or "Community Answer Submitted" either via CSS classes (no code) or a JavaScript call
- **Conversion goals:** Set up goals in the dashboard and see conversion rates, referrer sources driving conversions, and entry pages that convert best
- **Next.js integration:** Two options — the `next-plausible` npm package (recommended) or a simple `<Script>` tag. Both work with the App Router. Setup takes about 5 minutes
- **Data hosting:** EU-based servers (Germany) — strong privacy posture
- **Best for:** Privacy-conscious brands that want clean, simple analytics they'll actually check every day
- **Mission alignment:** Strong. No surveillance, no ad tracking, no selling data. Respects visitors the same way The Social Project respects its community

### Option B: PostHog

- **Free plan:** Generous — 1M analytics events/month, 5K session recordings/month, 1M feature flag requests/month. No credit card required
- **Paid plan:** Usage-based pricing kicks in beyond free limits. Product analytics starts at $0.00005/event. Estimated cost at 2M events: ~$31/month
- **Script size:** ~75KB (significantly heavier than Plausible)
- **Cookie usage:** Uses cookies by default, though can be configured for cookieless mode with reduced functionality
- **Dashboard:** Powerful but dense. Built for product teams, not solo founders. Steep learning curve — dozens of features, nested menus, query builders. Think Excel vs. a simple calculator
- **Features beyond analytics:** Session replay (watch real user sessions), feature flags (A/B test changes), surveys, error tracking, data warehouse. It's an entire product suite
- **Custom events:** Yes — via JavaScript SDK. More powerful than Plausible but requires more setup code
- **Next.js integration:** Official `@posthog/next` package. Requires middleware setup, provider wrapper, and environment variables. Setup takes 15–30 minutes
- **Data hosting:** US or EU cloud, or self-hosted (self-hosting requires 8GB+ RAM server with ~20 services)
- **Best for:** Product-focused startups that need deep behavioral analytics, session replays, and A/B testing. Teams with a developer or technical PM
- **Mission alignment:** Mixed. Open source and transparent (good), but the tool encourages deep behavioral tracking and session recording that may feel at odds with a community built on trust and genuine connection

### Option C: Google Analytics (GA4)

- **Free plan:** Completely free. Unlimited pageviews and events
- **Paid plan:** GA360 starts around $50K/year — irrelevant at this stage
- **Script size:** ~45KB
- **Cookie usage:** Sets `_ga` and `_gid` cookies — requires explicit opt-in consent before loading under GDPR/ePrivacy rules. As of February 2026, the UK's ICO has moved from guidance to active enforcement, issuing notices to sites loading GA4 before consent
- **Dashboard:** Notoriously confusing. Google redesigned GA4 from scratch and the interface is widely criticized as unintuitive. Finding basic metrics like "how many people visited today" requires navigating multiple layers. Designed for data analysts, not founders
- **Cookie consent requirement:** You must implement a consent banner, block GA4 from loading until users accept, and make rejection as easy as acceptance. Consent Mode V2 (mandatory for EEA) recovers some data from non-consenting users via modeling, but it's still partial data
- **Data loss from consent:** Studies show 40–50% of EU visitors reject analytics cookies. That means nearly half your traffic becomes invisible
- **Custom events:** Supported but setup is complex — requires configuring events in GA4's interface, which has a significant learning curve
- **Next.js integration:** Via `@next/third-parties` or manual script injection. Relatively straightforward, but you still need to build or install a cookie consent solution
- **Best for:** Businesses embedded in the Google Ads ecosystem that need cross-platform attribution. Enterprise teams with dedicated analysts
- **Mission alignment:** Poor. Google Analytics is funded by advertising. Your visitors' data contributes to Google's ad profile ecosystem. For a brand built on genuine human connection, sending visitor data to the world's largest ad company sends the wrong signal

---

## Comparison Table

| Feature | Plausible | PostHog | GA4 |
|---------|-----------|---------|-----|
| **Monthly cost** | $9/mo ($6 annual) | Free (1M events) | Free |
| **Cookie consent needed** | No | Configurable | Yes (mandatory) |
| **GDPR compliant out of box** | Yes | Partially | No (requires consent) |
| **Script size** | <1KB | ~75KB | ~45KB |
| **Dashboard complexity** | Simple (1 page) | Complex (dozens of views) | Complex (layers) |
| **Setup time (Next.js)** | ~5 minutes | ~15–30 minutes | ~30–60 min (with consent) |
| **Custom event tracking** | Yes | Yes | Yes (complex) |
| **Conversion goals** | Yes | Yes | Yes |
| **Session recording** | No | Yes (5K/mo free) | No |
| **Feature flags / A/B tests** | No | Yes | No (needs Optimize) |
| **Solo founder friendly** | Very | Low–Moderate | Low |
| **Data ownership** | EU-hosted | US/EU/self-host | Google-owned |
| **Page speed impact** | Negligible | Noticeable | Moderate |

---

## Recommendation

**Go with Plausible Analytics.**

Here's why it's the right call for The Social Project:

### 1. No cookie consent banner — ever

This is the biggest win. Plausible uses no cookies at all, which means you never need a consent popup. Your visitors land on a clean, beautiful page — no "Accept cookies?" interruption breaking the first impression. For a brand about genuine connection, not hitting people with a legal popup the moment they arrive matters.

GA4 would require you to build or buy a consent solution, and you'd lose 40–50% of your traffic data from visitors who decline. With Plausible, you get 100% of your data, 100% of the time.

### 2. You'll actually use it

This matters more than people think. PostHog and GA4 are powerful tools, but they're designed for product teams with dedicated analysts. The dashboards are dense, nested, and require learning a mental model before you can extract insight.

Plausible gives you a single page: visitors today, top pages, top referrers, countries, devices. Done. You can check it on your phone in 10 seconds while drinking coffee. Analytics you check daily beats powerful analytics you check never.

### 3. Tiny script, fast site

Plausible's script is under 1KB. For comparison, PostHog is ~75KB and GA4 is ~45KB. For a community site where mobile performance matters (especially if you're running ads to it), every kilobyte counts. Plausible is essentially invisible to your page load speed.

### 4. Conversion tracking for email signups

Plausible supports custom events and conversion goals on all plans. You can track "Email Signup" as a goal and see exactly which referral sources, pages, and campaigns drive signups. This directly serves roadmap task 1.8 (conversion tracking).

### 5. Privacy aligns with the brand

The Social Project is about genuine human connection — not surveillance. Using a privacy-first analytics tool that doesn't track individuals, doesn't set cookies, and doesn't share data with ad networks is a principled choice that aligns with your mission. It's also a selling point: "We respect your privacy — we use cookie-free analytics" is a trust signal for your community.

### 6. The cost is worth it

$9/month ($6 on annual) is a latte a month. PostHog is free, yes, but you'd pay in complexity and setup time. GA4 is free but you'd pay with a consent banner, lost data, and a confusing dashboard. Plausible's cost buys you simplicity, speed, and brand alignment. At the growth stage you're at, time and focus are more valuable than $9.

### Where PostHog wins (and why it's not enough to change the recommendation)

PostHog's session replays are genuinely useful — watching real users navigate your site reveals things no dashboard can. And the free tier is generous. If The Social Project were a SaaS product with complex user flows, PostHog would be the pick. But for a content and community brand at the early stage, session replays are a "nice to have" that adds significant complexity. You can always add PostHog later for specific product questions without replacing Plausible.

### Where GA4 wins (and why it doesn't matter here)

GA4 is free and deeply integrated with Google Ads. If you were running a Google Ads campaign and needed conversion attribution across Search, Display, and YouTube, GA4 would be essential. But The Social Project's growth channels are organic content, Instagram, and newsletter — none of which require GA4's ad ecosystem. The consent overhead alone disqualifies it.

---

## Next Steps

- [ ] **Sign up for Plausible** at [plausible.io](https://plausible.io) — 30-day free trial, no credit card required
- [ ] **Add your site domain** in the Plausible dashboard (use your Amplify domain or custom domain if you have one)
- [ ] **Get your script snippet** — Plausible will give you a site-specific script URL (format: `https://plausible.io/js/pa-XXXXX.js`)
- [ ] **Hand this research to the Builder agent** to install on the site (Tasks 1.7–1.8 on the roadmap)
- [ ] **Set up an "Email Signup" goal** in Plausible's dashboard after the first signup is tracked

When you're ready to install, tell the Builder agent:

```
Research is done — we're using Plausible Analytics. See docs/research/analytics-platform-research.md.
I need you to:
1. Install the next-plausible package
2. Add PlausibleProvider to the root layout
3. Add a custom event for email signups in CTASection.tsx
4. Add the Plausible domain to .env.example
```

---

## Sources

- Plausible pricing: https://plausible.io/#pricing
- Plausible subscription plans docs: https://plausible.io/docs/subscription-plans
- Plausible Next.js integration: https://plausible.io/docs/nextjs-integration
- Plausible custom events: https://plausible.io/docs/custom-event-goals
- Plausible conversion goals: https://docs.plausible.io/goal-conversions
- Plausible self-hosted vs cloud: https://plausible.io/self-hosted-web-analytics
- next-plausible npm package: https://github.com/4lejandrito/next-plausible
- PostHog pricing: https://posthog.com/pricing
- PostHog Next.js integration: https://posthog.com/docs/integrate/next-js
- @posthog/next package: https://www.npmjs.com/package/@posthog/next
- GA4 GDPR compliance 2026: https://privacychecker.pro/blog/google-analytics-4-gdpr-legal
- GA4 cookie consent requirements: https://saasanalytics.io/cookie-consent-for-analytics-gdpr-ccpa-implementation-guide-2026/
- ICO enforcement timeline: https://chraedon.com/blog/how-to-prepare-website-ga4-gdpr-changes-2026
- PostHog vs Plausible comparison: https://toolpick.dev/comparisons/plausible-vs-posthog
- Best analytics tools for startups 2026: https://fromscratch.dev/best/analytics-tools
- Best analytics tools pricing 2026: https://comparetiers.com/blog/best-analytics-tools-pricing-2026
