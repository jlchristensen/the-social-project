@AGENTS.md

# The Social Project — AI Agent Context

## Read these first

This project lives in the garage and does not repeat the workspace rules.
Before writing anything, read:

- `../../CLAUDE.md` — how Jack works, the git workflow, the copy rules
- `../../docs/standards/coding-standards.md`
- `../../docs/standards/ui-ux-standards.md`

Where this file disagrees with those, this file wins. And note the Next.js
warning imported above: this is a newer Next than your training data.

## What Is This Project?

"One question, every night." A small group gets one question a day, and a
campfire that dies if nobody answers. Built to pull a group of friends back
into talking to each other.

**Live:** https://main.d1jaykgbbddd26.amplifyapp.com

**Repo:** https://github.com/jlchristensen/the-social-project

**Backend:** Supabase project `the-social-project`.

## Status

Live, with accounts and a retention layer built: welcome-back, the dying fire,
unlock spotlight, and "your nights". The campfire mark is the brand.

A mobile client is scaffolded in `mobile/` and has its own `CLAUDE.md`. Read
that one when working in there, not this one.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Supabase · Amplify.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build
```

## Gotchas

- The fire going out is the **product**, not a bug. Anything that makes it
  harder to lose a streak needs a real argument behind it.
- This project has its own `docs/`, including `docs/standards/` and
  `docs/security/`. Where they are more specific than the garage standards,
  they win.
- Web and mobile are two apps in one repo. Be explicit about which you are in.

## Next Steps

See `docs/roadmap/`.
