# Email Platform Research for The Social Project

**Date:** April 10, 2026
**Task:** Roadmap item 1.1 — Choose email platform for newsletter and subscriber capture
**Status:** Complete — Recommendation made

---

## Topic

Which email platform should The Social Project use for its newsletter signup, welcome emails, and ongoing newsletter?

## Why This Matters for The Social Project

Email is the single most important channel you'll own. Unlike social media followers (where algorithms decide who sees your posts), your email list is a direct line to people who said "I care about this." For a community brand built on genuine connection, the newsletter is where you build that 1-to-1 relationship at scale.

The CTA form on the homepage currently doesn't save emails anywhere — it shows a success message but nobody's actually subscribing. Every day that form stays broken is potential community members lost.

---

## Options Evaluated

### Option A: Kit (formerly ConvertKit)

- **Free plan:** Up to 10,000 subscribers with unlimited email sends
- **Free plan includes:** Landing pages, forms, one basic visual automation with 1 email sequence, A/B testing, 24/7 support, digital product sales
- **Free plan limitations:** Kit branding on emails/landing pages, broadcasts must include Creator Network recommendations
- **Paid plan:** Creator at $33/month (annual) or $39/month (monthly) for 1,000 subscribers — removes branding, adds unlimited automations
- **Email editor:** Clean, creator-focused editor with templates. Designed for text-forward newsletters (which fits TSP's editorial style)
- **API:** Simple REST API. Subscribe endpoint is `POST /v3/forms/{form_id}/subscribe` with just an API key and email. Multiple Next.js tutorials and examples exist
- **Welcome email:** Supported on free plan via basic automation (1 email sequence included)
- **Best for:** Solo creators who want to grow an audience and eventually sell digital products
- **Mission alignment:** Built for independent creators, not enterprise marketers. The tool gets out of your way and lets the content shine

### Option B: Beehiiv

- **Free plan:** Up to 2,500 subscribers with unlimited sends
- **Free plan includes:** Custom website/domain, newsletter editor, basic analytics, AI writing assistant (10 uses/day), Recommendation Network, API access
- **Free plan limitations:** No email automations (only a single welcome email — not a sequence), no A/B testing, no surveys/polls, no human support
- **Paid plan:** Scale at $43/month (annual) or $49/month (monthly) — adds automations, monetization tools, ad network
- **Email editor:** More modern, design-forward editor. Best-in-class for visual newsletters. Drag-and-drop with good template options
- **API:** REST API with OAuth2. Subscribe endpoint is `POST /v2/publications/{publicationId}/subscriptions`. Requires OAuth token (slightly more complex than Kit's API key approach)
- **Welcome email:** Single welcome email available on free plan. Multi-step welcome sequences require paid plan
- **Best for:** Newsletter-first publishers who want built-in growth and monetization tools
- **Mission alignment:** Very newsletter-focused. The built-in Recommendation Network helps small publications cross-promote, which aligns with community building

### Option C: Mailchimp

- **Free plan:** Up to 250 contacts, 500 sends/month (daily limit of 250)
- **Free plan includes:** Email templates, basic reporting, one-click welcome email, 30 days of email support, 250+ integrations
- **Paid plan:** Essentials starts around $13/month for 500 contacts
- **Email editor:** Feature-rich but cluttered. Powerful but overwhelming for a solo founder
- **API:** Mature, well-documented API with official Node.js library. Easy Next.js integration
- **Welcome email:** Available on free plan
- **Best for:** Small businesses with traditional email marketing needs
- **Mission alignment:** Feels corporate. Mailchimp is the "enterprise solution for small business" — overkill for a community brand at this stage

### Option D: Buttondown

- **Free plan:** Up to 100 subscribers only
- **Paid plan:** À la carte pricing — $9/month per feature (tags, analytics, surveys each cost $9). Automations are $29/month
- **Email editor:** Markdown-based. Clean and simple, but no visual drag-and-drop editor
- **API:** Developer-friendly REST API, good documentation
- **Welcome email:** Requires $29/month Automations add-on
- **Best for:** Developers who want a minimal, privacy-first newsletter tool
- **Mission alignment:** The privacy-first ethos aligns with TSP values, but the 100-subscriber free limit is a dealbreaker and the markdown editor isn't practical for a non-technical founder

### Option E: Resend (with Supabase)

- **Free plan:** 3,000 emails/month transactional, 1,000 marketing contacts
- **What it is:** A developer email API, not a full newsletter platform. You'd build your own newsletter editor, subscriber management, and sending logic
- **Why it's worth mentioning:** Jack already has Supabase. In theory, you could store subscribers in Supabase and send via Resend. But you'd be building a newsletter platform from scratch — no visual editor, no analytics dashboard, no automation builder
- **Best for:** Technical founders building custom email infrastructure
- **Mission alignment:** N/A — this is plumbing, not a product. Would require significant development time for features that Kit and Beehiiv give you for free

---

## Comparison Table

| Feature | Kit (ConvertKit) | Beehiiv | Mailchimp | Buttondown |
|---------|-----------------|---------|-----------|------------|
| **Free subscribers** | 10,000 | 2,500 | 250 | 100 |
| **Unlimited sends** | Yes | Yes | No (500/mo) | Yes |
| **Welcome email (free)** | Yes (1 sequence) | Yes (single email) | Yes | No ($29/mo) |
| **Visual email editor** | Good | Great | Good (cluttered) | No (markdown) |
| **Next.js API ease** | Easy (API key) | Medium (OAuth2) | Easy (SDK) | Easy |
| **Automations (free)** | 1 basic flow | None | 1 welcome email | None |
| **Solo founder friendly** | Very | Very | Moderate | Low |
| **Paid plan start** | $33/mo (annual) | $43/mo (annual) | ~$13/mo | $9/mo per add-on |
| **Digital product sales** | Yes (free plan) | Paid only | No | Paid only |

---

## Recommendation

**Go with Kit (formerly ConvertKit).**

Here's why it's the right call for The Social Project right now:

### 1. Room to grow without paying
Kit's free plan supports 10,000 subscribers — that's 4x more than Beehiiv and 40x more than Mailchimp. You won't need to think about upgrading for a long time. At your stage, that headroom matters. Every dollar saved goes toward content and community.

### 2. Welcome automation included on free
Kit gives you one basic visual automation with an email sequence on the free plan. That means you can set up a welcome email (or even a short welcome series) without paying. Beehiiv only lets you do a single welcome email on free — no sequences, no automation flows.

### 3. Easiest Next.js integration
Kit's API uses a simple API key — no OAuth2 dance like Beehiiv requires. The subscribe endpoint is a single POST request with your API key, form ID, and the subscriber's email. Multiple step-by-step tutorials exist specifically for Next.js + Kit integration.

### 4. Built for creators like you
Kit was literally built for independent creators — bloggers, newsletter writers, people building audiences around ideas. The interface is straightforward, not cluttered with enterprise features you'll never use. Beehiiv is also great for this, but Kit's philosophy aligns more with "build a relationship with your audience" vs. Beehiiv's "grow and monetize your newsletter."

### 5. Future upside with digital products
When The Social Project gets to the Conversation Deck and resource downloads (Phase 4 on your roadmap), Kit lets you sell digital products even on the free plan. That's a nice bonus you won't find on Beehiiv's free tier.

### 6. Your Supabase account is still useful
Kit handles the email platform side (sending, editor, automations, analytics). Supabase can still play a role later — storing community data, user profiles, event RSVPs, etc. They solve different problems. You might also optionally sync Kit subscriber data to Supabase via webhooks for site features like displaying subscriber counts.

### Where Beehiiv wins (and why it's not enough to change the recommendation)
Beehiiv has a slightly more polished visual editor and built-in growth tools (Recommendation Network, Boosts). If you were *only* building a media newsletter (like Morning Brew), Beehiiv would be the pick. But The Social Project is a community brand first and a newsletter second — Kit's flexibility and creator tools are a better fit.

---

## Next Steps

- [ ] **Create a Kit account** at [kit.com](https://kit.com) (free, takes 2 minutes)
- [ ] **Create a form** in Kit for "The Social Project Newsletter" — this gives you the Form ID needed for the API
- [ ] **Set up a welcome email** in Kit's automation builder — keep it warm and personal, introduce the three pillars
- [ ] **Hand this research to the Builder agent** to implement the API route and connect the CTA form (Tasks 1.2–1.5 on the roadmap)
- [ ] **Get your API key** from Kit Settings → Developer → API and save it to `.env.local` as `KIT_API_KEY`

When you're ready to build, tell the Builder agent:

```
Follow the instructions in projects/the-social-project/docs/agents/builder.md

Research is done — we're using Kit (ConvertKit) for email. See docs/research/email-platform-research.md.
I need you to:
1. Create an API route at app/api/subscribe/route.ts that subscribes emails to Kit
2. Update CTASection.tsx to call the API route and handle loading/error states
3. Add the Kit API key and Form ID to .env.example
```

---

## Sources

- Kit pricing page: https://www.convertkit.com/pricing
- Kit Help Center — Newsletter plan details: https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan
- Kit Developer API — Forms subscribe endpoint: https://developers.kit.com/api-reference/v3/forms
- Beehiiv pricing page: https://www.beehiiv.com/pricing/
- Beehiiv developer docs — Create subscription: https://developers.beehiiv.com/api-reference/subscriptions/create
- Beehiiv support — Welcome email vs. automation: https://www.beehiiv.com/support/article/38813477234071-welcome-email-vs-welcome-automation-which-should-you-use
- Beehiiv support — Automations (paid only): https://support.beehiiv.com/hc/en-us/articles/18743686099991-everything-you-need-to-know-about-beehiiv-automations
- Mailchimp pricing and free plan: https://mailchimp.com/pricing/free/
- Buttondown pricing: https://buttondown.email/pricing
- Resend pricing: https://resend.com/pricing
- EmailToolTester — Beehiiv vs Kit comparison: https://www.emailtooltester.com/en/blog/beehiiv-vs-kit/
- ProPicked — Beehiiv vs Kit 2026: https://propicked.com/marketing/compare/beehiiv-vs-kit
- Next.js + Kit integration tutorial: https://makerkit.dev/blog/tutorials/make-convertkit-signup-form-nextjs
