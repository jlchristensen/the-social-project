# Profile redesign — design spec

**Date:** 2026-04-24
**Status:** Brainstormed; awaiting review before implementation plan
**Scope:** `/profile` page only. No other routes change.

---

## 1. Purpose

Today's `/profile` reads like a settings page: an h1 of "Your profile," a meta-info card (email, member-since), the Campfire activity feed, and a name/bio form. Identity is buried at the bottom. The page promises "this is how other community members will see you" but `/profile` is self-only — there is no other-member view.

The redesign reframes the page around **identity / belonging**: "who you are at the Campfire." The page should read like a profile, not like a form. Editing is inline — no modal, no separate edit mode, no save button.

The page remains self-only. There is no public `/profile/[handle]` route. We design as if a stranger were reading, but only the signed-in owner can view their own profile.

A future "The Journal" section will handle private reflection / journaling. That is **not** part of this design.

## 2. Non-goals

Explicitly out of scope:

- Public profile pages or routes (`/profile/[handle]`, `/u/[handle]`, etc.)
- Pinned voice / favorite Campfire answer
- Pronouns, location, "current chapter," pronunciation, outbound link
- The Journal (private reflection page) — separate future project
- Changes to the Campfire feed, sign-in, or anything outside `/profile`
- Backwards compatibility with the existing `ProfileForm` component (it gets replaced)

## 3. Page structure

Single-column layout, `max-w-lg` (matches today). Top to bottom:

1. **Identity hero** — avatar, name, member-since, bio, vibe color picker
2. **Stats row** — three chips: voices · resonates · night streak
3. **Campfire activity** — existing `ProfileActivityFeed` component, unchanged

No tabs. No drawers. No second column. No top h1 like "Your profile" — the avatar and name introduce the page.

## 4. Identity hero

### Layout

- Avatar (~76px circle) on the left, name + member-since stacked next to it on the right
- Bio below the row, full width
- "Vibe" label + 5-swatch row at the bottom of the hero
- A `border-bottom: 1px solid var(--line)` separates the hero from the stats row

### Fields & editing

All fields are inline-editable. A dashed underline (or the corner pen icon on the avatar) hints at editability. Save is on blur; no save button.

| Field | Source | Edit behavior |
|---|---|---|
| **Avatar** | `profiles.avatar_url`; fallback = first letter on vibe-color disc | Click avatar or pen badge → file picker → upload → preview → save. While uploading, a spinner overlays the avatar. |
| **Display name** | `profiles.display_name` | Click to enter input mode (same typography). Blur saves; Esc cancels. Empty input on save reverts to the previous value (the field can't be cleared, but existing users with already-empty `display_name` aren't blocked from viewing — they see an `"Add your name"` placeholder). Max 50 chars. |
| **Member since** | derived from `auth.users.created_at` | Read-only. Styled in **Fraunces italic, 13px, ~50% cream** — quiet subtitle, no ember, no uppercase letterspacing. |
| **Bio** | `profiles.bio` | Click to enter input mode. Blur saves; Esc cancels; allowed empty. Max 300 chars; counter appears in red if over. Empty placeholder: *"Add a bio so others know who you are."* |
| **Vibe color** | `profiles.vibe_color` | Tap a swatch to apply; saves immediately. Selected swatch gets a ring indicator. |

### Avatar fallback

When `avatar_url` is null, render a circular gradient using the user's vibe color, with the first character of `display_name` (or `?` if name is empty) centered in `var(--brand-900)` text. The gradient uses two stops of the vibe color (lighter top-left, darker bottom-right).

### Photo avatar styling

When `avatar_url` is present, the rendered image gets a subtle 2-3px ring in the user's vibe color (via `box-shadow` ring or border). This is how the vibe color shows up even when the user has uploaded a photo.

## 5. Stats row

Three full-width-equal chips, horizontal:

| Chip | Source | Empty state |
|---|---|---|
| **Voices** | `select count(*) from answers where user_id = me` | renders as `0` muted |
| **Resonates** | upvotes received from other users on the user's own answers (excludes self-resonates, mirroring the activity-feed pattern in `fetchCampfireActivityForUser`) | renders as `0` muted |
| **Night streak** | consecutive days (from today backward) on which the user has at least one answer | renders as `0` muted |

### Presentation

- **Bare number** — large Fraunces ember; tiny letterspaced caps label below ("Voices" / "Resonates" / "Night streak")
- Number is rendered in the user's **vibe color** (which is `ember` by default — so the default look is unchanged from a normal ember accent); muted cream when value is 0
- Hover/long-press shows a tooltip explaining what counts (e.g., "Days in a row you've shared a voice — current: 9")
- Row always renders; chips with `0` use a muted color rather than being hidden, so the layout is consistent for new members

### Streak computation

Streaks are computed in **UTC** for v1. (Per-user timezones can be revisited later — they're not worth the complexity to ship this.)

The streak is the longest run of consecutive UTC days, anchored to "now," on which the user has at least one row in `answers`:

- If today (UTC) has an answer, the streak runs through today
- If today has no answer but yesterday does, the streak runs through yesterday — so the chip doesn't drop to 0 just because the user hasn't posted yet today
- If neither today nor yesterday has an answer, streak is 0

So a user who posts daily sees their streak grow each day; a user who skips a day sees it reset; a user who hasn't posted yet today but did yesterday still sees yesterday's number.

## 6. Vibe color

Five preset swatches, one selected at a time. Stored in `profiles.vibe_color` as a string key.

| Key | Hex | Name |
|---|---|---|
| `ember` *(default)* | `#f5d28b` | Ember |
| `hearth` | `#cf8a5c` | Hearth |
| `forest` | `#7da38d` | Forest |
| `dusk` | `#b58fd8` | Dusk |
| `clay` | `#d8a18a` | Clay |

The vibe color shows up only inside the profile page:

1. Tints the **default-letter avatar** (the gradient when no photo is uploaded)
2. **Rings** the photo avatar (when one is uploaded)
3. Tints the **stat number** color (replacing the ember accent for nonzero values)

It does **not** show up anywhere else on the site (Campfire, header, replies, etc.).

## 7. Activity feed

The existing `ProfileActivityFeed` and `ProfileActivityMarker` components are reused **unchanged**. They sit below the stats row with the same `<h2>Campfire activity</h2>` heading and the same "On your voices" tag. Empty state copy and the show-3-then-expand behavior are unchanged.

## 8. States

### First-visit (brand-new user)

- Avatar = first-letter-of-name on vibe-color (defaulting to ember)
- Name = whatever was set at sign-up (or `"Add your name"` placeholder if blank)
- Bio = empty; placeholder italic copy invites editing
- Stats = three muted `0` chips
- Activity feed = existing empty state ("Nothing here yet…")

### Editing — saving

- Optimistic UI: new value renders instantly
- Subtle ember-glow pulse on the field signals success
- On error: field reverts to previous value; small inline error in soft red appears below; auto-dismisses after 5s

### Editing — validation

- Empty display name → revert to previous (name is required)
- Bio capped at 300 chars via the input's native `maxLength` — typing past the cap is blocked; pasted overflow surfaces an inline red error and blocks save
- Avatar upload > 2MB or non-image MIME → inline error, no save attempted

### Loading

- Page is a server-rendered route. No skeleton needed for first paint.
- Avatar upload shows a small spinner overlay on the avatar circle while uploading.

## 9. Data model & persistence

### `profiles` table — new columns

| Column | Type | Notes |
|---|---|---|
| `vibe_color` | `text` | One of `ember` / `hearth` / `forest` / `dusk` / `clay`. NOT NULL. Default `'ember'`. CHECK constraint enforces the allowed values. |

`avatar_url` (text, nullable) already exists in the `profiles` table from migration `001-profiles-table.sql`. The redesign just starts using it.

Other existing columns (`display_name`, `bio`, `activity_last_viewed_at`, `updated_at`) are unchanged.

### Supabase Storage

- New bucket: `avatars`
- Public-read access (so the public URL works without auth)
- Path convention: `avatars/{user_id}/{uuid}.{ext}`
- RLS: only the owner can `INSERT` / `UPDATE` / `DELETE` files under their own `{user_id}` prefix
- Old avatars are **not** automatically deleted on replace (cleanup is a future concern)

### Derived stats — no new persistence

All three stat numbers are computed at request time inside the same server fetch as the profile and activity feed. They are **not** stored as denormalized counters.

### Migration

A new SQL file `docs/supabase/005-profile-vibe-and-avatars-bucket.sql` adds:

- The `vibe_color` column on `profiles` with CHECK constraint and default
- The `avatars` storage bucket + RLS policies
- A backfill setting `vibe_color = 'ember'` for any pre-existing rows

## 10. Files affected

Concrete file-level scope (the implementation plan will break these into ordered steps):

- **Replace:** `src/app/profile/page.tsx` — new page composition (hero + stats + feed)
- **Replace:** `src/app/profile/ProfileForm.tsx` — old form goes away; replaced by inline-edit components
- **New:** `src/app/profile/ProfileHero.tsx` — identity hero (avatar, name, since, bio, vibe)
- **New:** `src/app/profile/ProfileStats.tsx` — three-chip stats row
- **New:** `src/app/profile/InlineTextField.tsx` — shared inline-editable text/textarea primitive (or two narrowly-scoped components if cleaner)
- **New:** `src/app/profile/AvatarPicker.tsx` — avatar circle + upload flow
- **New:** `src/app/profile/VibeColorPicker.tsx` — 5-swatch row
- **New:** `src/lib/profileStats.ts` — derived stats (voices, resonates, streak) with a single Supabase query helper
- **New:** `docs/supabase/005-profile-vibe-and-avatar.sql` — migration
- **Unchanged:** `src/components/profile/ProfileActivityFeed.tsx`, `src/app/profile/ProfileActivityMarker.tsx`, `src/lib/profileActivityFeed.ts`

## 11. Open questions for the implementation plan

These are decisions to be resolved during planning, not in this design:

- Whether to ship the SQL migration before the UI lands behind a feature flag, or coordinate them in one merge
- Whether the inline text fields share one primitive (`InlineTextField`) or stay as two narrower components
- How to expose `vibe_color` and `avatar_url` types in the existing profile-fetch utilities without breaking other call sites
- Choice of file-input UX for avatar upload (native picker vs. drop-zone)
