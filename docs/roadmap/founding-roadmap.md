# The Social Project — Founding Roadmap

## Overview

This roadmap takes The Social Project from "beautiful website with placeholder content" to "growing community brand with real engagement and revenue." It's organized into phases, with clear markers for what Jack does vs. what agents handle.

**Where we are today:**
- Site is live on AWS Amplify (`main.d1jaykgbbddd26.amplifyapp.com`)
- 6 pages: Home, Blog, Community, Resources, Merch, About
- All content is static (hardcoded data files, placeholder links)
- Email capture form exists but doesn't save emails anywhere
- Merch is display-only (no checkout)
- No analytics, no newsletter, no real community backend
- Agent system is set up (advisor, builder, researcher, prompt engineer)

**Legend:**
- **Jack** = Jack does this himself
- **Agent** = An AI agent handles this (Jack activates it)
- **Collab** = Jack and an agent work together interactively

---

## Phase 0: Foundation

> **Goal:** Site built, deployed, and agents ready to go.
> **Time:** Done
> **Status:** Complete

### Website (Complete)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Build Next.js site with Tailwind CSS | Done | Next.js 16, React 19, Tailwind 4 |
| 0.2 | Create all pages (Home, Blog, Community, Resources, Merch, About) | Done | All rendering with static data |
| 0.3 | Design system established | Done | Brand colors, TAN NIMBUS display font, Reveal animations |
| 0.4 | Deploy to AWS Amplify | Done | Live at `main.d1jaykgbbddd26.amplifyapp.com` |
| 0.5 | SEO metadata and OpenGraph configured | Done | Title, description, OG image |

### Agent System (Complete)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.6 | Create Advisor agent | Done | `docs/agents/advisor.md` |
| 0.7 | Create Builder agent | Done | `docs/agents/builder.md` |
| 0.8 | Create Researcher agent | Done | `docs/agents/researcher.md` |
| 0.9 | Create Prompt Engineer agent | Done | `docs/agents/prompt-engineer.md` |

---

## Phase 1: Make It Real

> **Goal:** Connect the pieces that are currently placeholder. Email capture actually captures emails. Resources link to real content. Analytics tell you who's visiting.
> **Time:** 1-2 sessions (2-4 hours)
> **Status:** Ready to Start
> **Depends on:** Phase 0 complete

This is the "turn the lights on" phase. The site looks great but right now it's a storefront with no cashier.

### Email Capture (Agent: Builder)

The newsletter form on the homepage currently doesn't save emails anywhere — it just shows a success message. This needs to connect to a real service.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Research email platform (Beehiiv vs. Buttondown vs. ConvertKit) | Not Started | Agent: Researcher |
| 1.2 | Set up email capture API route | Not Started | `app/api/subscribe/route.ts` |
| 1.3 | Connect CTA form to email service | Not Started | Update `CTASection.tsx` |
| 1.4 | Add welcome email auto-response | Not Started | First touch with new subscribers |
| 1.5 | Add subscriber count to `.env.local` or API | Not Started | For social proof on the site |

### Analytics (Agent: Builder)

You can't improve what you don't measure. Basic analytics tells you if anyone's actually visiting.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.6 | Research analytics tool (Plausible vs. PostHog vs. GA4) | Not Started | Agent: Researcher |
| 1.7 | Install analytics on the site | Not Started | Privacy-friendly preferred |
| 1.8 | Set up conversion tracking (email signups) | Not Started | Know your signup rate |

### Real Resource Content (Agent: Builder + Jack)

Resources currently link to `#`. Even if the actual PDFs/guides aren't ready, you need download pages or at least "coming soon" states.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.9 | Create downloadable Conversation Starter Pack (PDF or page) | Not Started | This is the easiest quick win |
| 1.10 | Create at least 2 more real resources | Not Started | Screen Time Reset + Gathering Guide |
| 1.11 | Update resource links to point to real content | Not Started | Replace all `#` links |
| 1.12 | Add email gate for premium resources | Not Started | "Enter your email to download" |

### How to Start Phase 1

Start with email capture — it's the most important piece because it lets you build an audience. Open Cursor:

```
Follow the instructions in projects/the-social-project/docs/agents/researcher.md

I need to pick an email platform for The Social Project newsletter. Requirements:
- Free or cheap to start (under 1,000 subscribers)
- Works with Next.js API routes
- Has a nice email editor for newsletters
- Can do welcome emails automatically
- I'm a solo founder, so ease of use matters most
```

Then hand the recommendation to the Builder agent to implement it.

---

## Phase 2: Content Engine

> **Goal:** Establish a consistent content rhythm that builds audience and authority. Blog posts, newsletter, social media presence.
> **Time:** Ongoing (set up the system in 1-2 sessions, then it's a weekly habit)
> **Status:** Not Started
> **Depends on:** Phase 1 email capture working

Content is the engine that drives a community brand. This phase builds the machine.

### Newsletter (Collab: Builder + Jack)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Choose newsletter name and cadence | Not Started | Recommendation: biweekly to start |
| 2.2 | Design newsletter template | Not Started | Match brand — warm, editorial |
| 2.3 | Write and send first issue | Not Started | Keep it short: 1 story + 1 resource + 1 question |
| 2.4 | Set up archive page on site | Not Started | `/newsletter` page showing past issues |
| 2.5 | Track open rates and click rates | Not Started | Built into email platform |

### Blog Content Pipeline (Collab: Prompt Engineer + Jack)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.6 | Create Content Writer agent | Not Started | Via Prompt Engineer agent |
| 2.7 | Build content calendar (first 8 posts) | Not Started | Map to three pillars |
| 2.8 | Publish 2 new blog posts per month minimum | Not Started | Consistency > volume |
| 2.9 | Move blog content to a CMS or markdown files | Not Started | Currently hardcoded in `blog-posts.ts` |
| 2.10 | Add blog categories and tag filtering | Not Started | Agent: Builder |

### Social Media Foundation (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.11 | Choose primary platform (Instagram recommended) | Not Started | Where 22-30 year olds are |
| 2.12 | Set up Instagram account with brand kit | Not Started | Bio, highlights, link in bio |
| 2.13 | Create first 9 posts (grid foundation) | Not Started | Mix: quotes, stories, resources |
| 2.14 | Establish posting cadence | Not Started | 3-4x/week to start |
| 2.15 | Cross-promote blog ↔ newsletter ↔ social | Not Started | Every piece of content appears in all three |

### SEO Foundation (Agent: Researcher + Builder)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.16 | Research target keywords | Not Started | "making friends after college," "loneliness," etc. |
| 2.17 | Optimize existing blog posts for SEO | Not Started | Titles, meta descriptions, headings |
| 2.18 | Add sitemap.xml and robots.txt | Not Started | Agent: Builder |
| 2.19 | Submit to Google Search Console | Not Started | Jack — takes 5 minutes |

### How to Start Phase 2

Start with the newsletter — it builds directly on your email list from Phase 1:

```
Follow the instructions in projects/the-social-project/docs/agents/advisor.md

I have my email capture working and I'm ready to start the newsletter. Help me figure out:
1. What should I call it?
2. How often should I send it?
3. What should the first issue look like?
4. How do I make it feel authentic and not "marketing-y"?
```

---

## Phase 3: Community Building

> **Goal:** Move from broadcasting content to fostering real community interaction. IRL events, online discussions, ambassador program.
> **Time:** 2-4 weeks to set up, ongoing to maintain
> **Status:** Not Started
> **Depends on:** Phase 2 content engine running (need an audience first)

This is where The Social Project practices what it preaches — actual human connection.

### Online Community (Agent: Researcher + Jack)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Research community platform (Geneva vs. Circle vs. Discord) | Not Started | Agent: Researcher |
| 3.2 | Set up community space | Not Started | Start with a small, curated group |
| 3.3 | Create community guidelines | Not Started | Values-based, not rules-heavy |
| 3.4 | Seed with first 20-30 members | Not Started | Personal invites, not mass blast |
| 3.5 | Establish weekly community rituals | Not Started | e.g., Monday check-in, Friday gratitude |

### IRL Events (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.6 | Plan first IRL event (start small — coffee meetup or walk) | Not Started | 5-15 people max |
| 3.7 | Create event page on site | Not Started | Agent: Builder — `/events` page |
| 3.8 | Add RSVP / signup functionality | Not Started | Agent: Builder |
| 3.9 | Host first event and document it | Not Started | Photos, quotes, recap blog post |
| 3.10 | Build event playbook for repeatable gatherings | Not Started | So anyone can host a TSP event |

### Community on the Site (Agent: Builder)

The community page currently shows static posts. Make it more dynamic.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.11 | Add "submit your story" functionality | Not Started | Form that collects user stories |
| 3.12 | Feature real community stories on the site | Not Started | Replace static posts with real ones |
| 3.13 | Add social proof (member count, testimonials) | Not Started | Homepage stats section |

### Ambassador Program (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.14 | Design ambassador program concept | Not Started | What do ambassadors do? What do they get? |
| 3.15 | Create ambassador application page | Not Started | Agent: Builder |
| 3.16 | Recruit first 5 ambassadors | Not Started | Personal outreach to engaged members |

### How to Start Phase 3

Start by testing demand before building infrastructure:

```
Follow the instructions in projects/the-social-project/docs/agents/advisor.md

I'm ready to start building real community around The Social Project. I have [X] email subscribers and [X] Instagram followers. Help me decide:
1. Should I start with an online community or an IRL event?
2. How do I get the first 20-30 people involved?
3. What platform should I use?
```

---

## Phase 4: Monetization

> **Goal:** Generate revenue through merch, partnerships, and/or memberships. Not to get rich — to sustain the mission.
> **Time:** 2-4 weeks to set up, ongoing to grow
> **Status:** Not Started
> **Depends on:** Phase 2-3 (need an audience before you can monetize)

### Merch Store (Agent: Researcher + Builder)

The merch page exists but has no checkout. Time to make it real.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Research e-commerce options (Shopify vs. Printful vs. Spring) | Not Started | Agent: Researcher |
| 4.2 | Start with 1-2 products (Conversation Deck + Tee) | Not Started | Don't over-invest in inventory |
| 4.3 | Integrate checkout on the merch page | Not Started | Agent: Builder |
| 4.4 | Set up print-on-demand fulfillment | Not Started | No inventory risk |
| 4.5 | Test with a small launch to email list | Not Started | Validate demand before scaling |

### Partnerships & Sponsorships (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.6 | Identify 10 aligned brands for partnerships | Not Started | Wellness, lifestyle, social apps |
| 4.7 | Create a media kit / partnership one-pager | Not Started | Audience size, engagement, mission alignment |
| 4.8 | Reach out to first 3 potential partners | Not Started | Start with newsletter sponsorships |

### Membership / Premium Content (Future)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.9 | Evaluate membership model (Patreon vs. site-native) | Not Started | Only when community is active |
| 4.10 | Create premium resource bundle | Not Started | Expanded guides, workshops, exclusive content |
| 4.11 | Launch membership tier | Not Started | $5-10/month for early supporters |

### How to Start Phase 4

Start with the Conversation Deck — it's the most on-brand product and the easiest to test:

```
Follow the instructions in projects/the-social-project/docs/agents/researcher.md

I want to sell The Social Project's Conversation Deck (52 cards with deep conversation prompts). Help me figure out:
1. Best print-on-demand service for card decks
2. What should it cost? (currently listed at $22)
3. How do I handle fulfillment as a solo founder?
4. Should I start with just this product or launch multiple items?
```

---

## Phase 5: Growth & Scale

> **Goal:** Expand reach, add dynamic features, and explore new channels.
> **Time:** When Phases 1-4 are running
> **Status:** Future
> **Depends on:** Established audience, consistent content, some revenue

### Site Upgrades (Agent: Builder)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Add user accounts (sign up / log in) | Not Started | For community features |
| 5.2 | Build dynamic community feed | Not Started | Real user posts, not static data |
| 5.3 | Add search across blog and resources | Not Started | As content library grows |
| 5.4 | Create podcast or video section | Not Started | If Jack starts producing audio/video content |

### Audience Growth (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.5 | Launch referral program ("Invite a friend") | Not Started | Organic growth engine |
| 5.6 | Guest posts on aligned publications | Not Started | Position Jack as a thought leader |
| 5.7 | Explore TikTok / YouTube Shorts | Not Started | Short-form video for the mission |
| 5.8 | Test paid ads ($50-100 budget) | Not Started | Instagram/Meta ads to blog content |

### Technical Foundation (Agent: Builder)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.9 | Set up a database (Supabase or PlanetScale) | Not Started | For user data, community posts |
| 5.10 | Move blog to CMS (Sanity, Contentful, or MDX) | Not Started | So Jack can write without code |
| 5.11 | Add automated testing | Not Started | As site gets more complex |
| 5.12 | Custom domain setup | Not Started | thesocialproject.com (or similar) |

### How to Start Phase 5

When you have consistent content flowing, a growing email list, and community engagement, it's time to level up:

```
Follow the instructions in projects/the-social-project/docs/agents/advisor.md

Here's where The Social Project stands: [subscriber count, social followers, monthly visitors, community size, revenue]. What should I focus on next to grow from here?
```

---

## Quick Start Summary

| Phase | What | Who Does It | Time | Start Here |
|-------|------|-------------|------|------------|
| 0 | Build site + set up agents | Builder + Prompt Engineer | Done | - |
| 1 | Email capture, analytics, real content | Builder + Researcher | 2-4 hrs | Email platform research |
| 2 | Newsletter, blog cadence, social, SEO | Builder + Advisor + Jack | 1-2 weeks setup | Newsletter launch |
| 3 | Online community, IRL events, ambassadors | Advisor + Builder + Jack | 2-4 weeks | Community platform |
| 4 | Merch checkout, partnerships, memberships | Researcher + Builder + Jack | 2-4 weeks | Conversation Deck launch |
| 5 | User accounts, growth channels, database | Builder + Advisor | Ongoing | When Phases 1-4 are running |

---

## The One Rule

**Phase 1 first.** Everything else builds on having a working email capture. An email subscriber is someone who raised their hand and said "I'm interested." That's the most valuable thing you can collect right now. Get Phase 1 done before anything else.

---

## Tips for Jack

1. **Phase 1 is the priority.** Without email capture and analytics, you're flying blind.
2. **Content is king for community brands.** The blog and newsletter are your growth engine — Phase 2 matters more than you think.
3. **Don't build community infrastructure before you have an audience.** Phase 3 requires people. Get them through Phase 2 first.
4. **Monetize after trust.** Don't rush to sell merch. Build the relationship first through content and community.
5. **Use the agents.** That's what they're for. Start with the Researcher for decisions, the Builder for implementation, and the Advisor for strategy.
6. **Ship imperfect things.** A newsletter with a typo beats no newsletter. A 5-person coffee meetup beats a perfectly planned event that never happens.
7. **Measure everything.** Once analytics are in (Phase 1), check your numbers weekly. What's growing? What's flat?
8. **The mission is the brand.** Every decision should pass the test: "Does this serve genuine human connection?" If yes, do it. If not, skip it.
