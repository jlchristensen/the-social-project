# The Social Project — Founding Roadmap

## Overview

This roadmap takes The Social Project from "working Campfire product" to "growing community with real engagement and sustainable revenue." It's organized into phases, with clear markers for what Jack does vs. what agents handle.

**Where we are today (updated July 2026):**

- Primary product is **The Campfire** — a BeReal-style daily question: answer honestly to unlock everyone else's answers
- **Web** is live on AWS Amplify (`main.d1jaykgbbddd26.amplifyapp.com`) — Next.js 16, React 19, Tailwind 4, Supabase
- **Mobile** companion app exists in `mobile/` (Expo 57 / React Native) sharing the same Campfire logic
- Real auth: sign-up, sign-in, password reset, profiles (avatar, vibe color, bio, activity feed)
- Real backend: Supabase Postgres — `profiles`, `daily_questions`, `answers`, `answer_upvotes`, `answer_replies` (seeded through Oct 2026)
- Kit (ConvertKit) email API is wired (`/api/subscribe`) but the homepage newsletter CTA is intentionally hidden
- Blog and Gift Shop (merch) are "coming soon" shells; About and Resources pages were removed
- Analytics not installed yet (research done — see `docs/research/analytics-platform-research.md`)
- **Open security gap:** answer-to-unlock gate and anonymity are client-side only — see `docs/security/campfire-gate-and-anonymity.md`
- Agent system is set up (advisor, builder, researcher, prompt engineer)

**Legend:**
- **Jack** = Jack does this himself
- **Agent** = An AI agent handles this (Jack activates it)
- **Collab** = Jack and an agent work together interactively

---

## Phase 0: Marketing Site Foundation

> **Goal:** Beautiful branded site + agent system ready.
> **Status:** Complete

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Build Next.js site with Tailwind CSS | Done | Next.js 16, React 19, Tailwind 4 |
| 0.2 | Design system established | Done | Brand greens, dark-forest background, ember accent, TAN NIMBUS / Geist |
| 0.3 | Deploy to AWS Amplify | Done | Live at `main.d1jaykgbbddd26.amplifyapp.com` |
| 0.4 | SEO metadata and OpenGraph | Done | Title, description, OG image |
| 0.5 | Create Advisor / Builder / Researcher / Prompt Engineer agents | Done | `docs/agents/` |

---

## Phase 1: Campfire Product Core

> **Goal:** Turn the site into a real daily-connection product with auth, database, and the answer-to-unlock loop.
> **Status:** Complete (shipped ahead of the original "email-first" plan)

The original Phase 1 was "turn on email + analytics + resources." The product pivoted: community research led to **The Campfire**, and that became the real product.

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Research community tab / daily-question mechanic | Done | `docs/research/community-tab-research.md` |
| 1.2 | Set up Supabase (auth + Postgres) | Done | Migrations in `docs/supabase/001–007` |
| 1.3 | Build Campfire on web (`/community`) | Done | Daily question, answer gate, feed, upvotes, replies |
| 1.4 | Extract portable campfire lib | Done | `src/lib/campfire/` — framework-free, shared with mobile |
| 1.5 | User profiles (avatar, vibe color, bio, stats, activity) | Done | `/profile` + storage bucket |
| 1.6 | Sign-up / sign-in / password reset | Done | Web + mobile |
| 1.7 | Seed daily questions | Done | Through mid-October 2026 |
| 1.8 | Homepage centers Campfire | Done | Hero → Stats → Campfire → Mission |
| 1.9 | Research + wire Kit (ConvertKit) email API | Done | `/api/subscribe` works; homepage CTA hidden on purpose |
| 1.10 | Research analytics platform | Done | Recommendation in research docs — **not installed yet** |

---

## Phase 2: Launch Readiness (NOW)

> **Goal:** Make Campfire safe and measurable enough to invite real people. Fix the trust boundary, see who's using it, polish mobile.
> **Time:** 1–3 sessions
> **Status:** Ready to Start
> **Depends on:** Phase 1 complete

This is the new "turn the lights on" phase. The product works — but one security gap undermines the brand promise ("answer to unlock"), and you're still flying blind on traffic.

### Trust & Safety (Agent: Builder — priority #1)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Fix Campfire answer-gate + anonymity in RLS | Not Started | Follow `docs/security/campfire-gate-and-anonymity.md` |
| 2.2 | Verify gate on web and mobile after the fix | Not Started | Don't treat client-side checks as the security boundary |

### Analytics (Agent: Builder)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.3 | Refresh analytics choice for **web + mobile** product metrics | Not Started | April Plausible doc is website-scoped; Campfire needs retention/gate/funnel (Agent: Researcher — short pass) |
| 2.4 | Install analytics + track Campfire events (answer, unlock, return) | Not Started | After 2.3 — more important than email signup right now |

### Mobile polish (Agent: Builder)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.5 | Stabilize Expo daily loop (auth → moment → composer → reveal) | In Progress | `mobile/` on `feature/mobile-bereal-loop` |
| 2.6 | TestFlight / internal build path | Not Started | Jack + Builder when web gate is solid |

### Soft launch (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.7 | Invite first 10–20 people to Campfire | Not Started | After 2.1 ships — personal invites only |
| 2.8 | Watch for first-week friction (copy, length, anonymity feel) | Not Started | Advisor: what to ask early users |

### How to Start Phase 2

Start with the security fix — without it, the Campfire promise is fake:

```
Follow the instructions in docs/agents/builder.md

Implement the Campfire gate + anonymity fix described in
docs/security/campfire-gate-and-anonymity.md.
Ship the migration and client changes on web and mobile.
```

Then do a short analytics refresh for web + mobile Campfire metrics, and install. Don't rebuild email capture — Kit is already wired.

---

## Phase 3: Audience & Content Engine

> **Goal:** Build owned audience around Campfire — email, social, light content. Not a content factory; a habit amplifier.
> **Status:** Not Started
> **Depends on:** Phase 2 soft launch underway (real users answering)

### Email (Collab: Builder + Jack)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Decide when to re-enable homepage Kit CTA | Not Started | Plumbing exists — strategy call, not a build |
| 3.2 | Welcome automation + first newsletter issue | Not Started | Biweekly, short: 1 story + 1 Campfire prompt + 1 question |
| 3.3 | Newsletter archive page (optional) | Not Started | Only if cadence sticks |

### Content & social (Jack + Advisor)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.4 | Choose primary social platform | Not Started | Instagram still recommended for 22–30 |
| 3.5 | Decide whether to relink Blog in nav | Not Started | Blog exists but is unlinked — discoverability choice |
| 3.6 | Publish Campfire-adjacent posts (2/month if blog returns) | Not Started | Consistency > volume |
| 3.7 | Cross-promote: Campfire ↔ social ↔ email | Not Started | Same daily question energy across channels |

### SEO (Agent: Researcher + Builder) — lower priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.8 | Sitemap + robots.txt | Not Started | Easy win when content is visible again |
| 3.9 | Google Search Console | Not Started | Jack — ~5 minutes |

---

## Phase 4: Community Beyond the Screen

> **Goal:** Practice what we preach — IRL connection and real member stories, built on an audience that already shows up for Campfire.
> **Status:** Not Started
> **Depends on:** Phase 3 audience growing

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | First small IRL meetup (5–15 people) | Not Started | Coffee / walk — document with photos + recap |
| 4.2 | Event page + RSVP on site | Not Started | Agent: Builder — only after demand is clear |
| 4.3 | Community guidelines (values-based) | Not Started | For Campfire moderation as scale grows |
| 4.4 | Ambassador concept (first 5) | Not Started | After consistent Campfire engagement |
| 4.5 | Feature real member stories (with consent) | Not Started | Replace any leftover static/placeholder social proof |

---

## Phase 5: Monetization & Scale

> **Goal:** Sustain the mission — merch, partnerships, or memberships — only after trust and habit exist.
> **Status:** Future
> **Depends on:** Phases 2–4 running

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Gift Shop checkout (1–2 products first) | Not Started | Conversation Deck + tee; print-on-demand |
| 5.2 | Partnerships / media kit | Not Started | Need audience numbers from analytics |
| 5.3 | Membership / premium (evaluate later) | Not Started | Only when community is active |
| 5.4 | Custom domain | Not Started | thesocialproject.com (or similar) |
| 5.5 | CMS for blog if content volume grows | Not Started | Currently `src/data/blog-posts.ts` |
| 5.6 | Automated testing as complexity grows | Not Started | Especially around Campfire gate + auth |

---

## Quick Start Summary

| Phase | What | Who | Status | Start here |
|-------|------|-----|--------|------------|
| 0 | Brand site + agents | Builder + Prompt Engineer | Done | — |
| 1 | Campfire + auth + Supabase + mobile scaffold | Builder + Researcher | Done | — |
| 2 | Security fix, analytics, soft launch | Builder + Jack | **Now** | RLS gate fix |
| 3 | Email reactivation, social, light content | Advisor + Builder + Jack | Next | After soft launch |
| 4 | IRL events, ambassadors, member stories | Advisor + Jack | Later | Need audience |
| 5 | Merch checkout, partnerships, scale | Researcher + Builder + Jack | Future | Need trust + habit |

---

## Legacy map (old roadmap → new)

The original roadmap assumed a static marketing site. Here's what happened to those items:

| Old item | New status |
|----------|------------|
| Email platform research + API | **Done** (Kit wired; CTA hidden) |
| Analytics research | **Done**; install is Phase 2.3 |
| Analytics install / conversion tracking | **Still open** → Phase 2 |
| Real resource PDFs / email gate | **Deferred / cancelled** (Resources page removed) |
| Newsletter cadence / archive | **Still relevant** → Phase 3 |
| Blog CMS / categories | **Deferred** (blog unlinked; not the product) |
| Instagram / social foundation | **Still relevant** → Phase 3 |
| Sitemap / Search Console | **Still relevant** → Phase 3 (lower priority) |
| Online community platform (Discord/Circle/Geneva) | **Superseded** by Campfire |
| Community submit-your-story | **Deferred** → Phase 4.5 |
| Events / RSVP | **Still relevant** → Phase 4 |
| Ambassadors | **Still relevant** → Phase 4 |
| Merch checkout | **Still relevant** → Phase 5 |
| User accounts / database | **Done** (was old Phase 5 — shipped early) |
| Dynamic community feed | **Done** as Campfire |

---

## The One Rule

**Phase 2 first.** Fix the Campfire trust boundary, then measure, then invite real people. Everything else (newsletter, merch, IRL) builds on a product people can trust.

Email is still valuable — but the Kit plumbing already exists. Don't rebuild capture; decide when to turn the CTA back on *after* Campfire feels safe to share.

---

## Tips for Jack

1. **Security before growth.** Don't push invites or PR on Campfire until 2.1 ships. The brand promise is the product.
2. **Campfire is the habit.** Every channel decision should ask: does this get more honest daily answers?
3. **Don't redo finished platform bake-offs.** Kit is decided. Analytics needs a *short* mobile-aware extension of the existing doc — not a from-scratch restart.
4. **Mobile shares the heart.** Never put React/Next imports in `src/lib/campfire/` — that breaks the Expo app.
5. **Use the agents.** Researcher for decisions you haven't researched; Builder for implementation; Advisor for strategy.
6. **Ship imperfect things.** A 10-person soft launch beats a perfect launch that never happens.
7. **Measure once analytics are in.** Weekly: answers submitted, unlocks, return rate.
8. **The mission is the brand.** Every decision: "Does this serve genuine human connection?"
