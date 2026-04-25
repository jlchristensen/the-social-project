# Profile redesign — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `/profile` settings-style page with an identity-first, inline-editable hero (avatar, name, bio, member-since, vibe color) + a three-chip stats row + the existing Campfire activity feed. Spec: `docs/superpowers/specs/2026-04-24-profile-redesign-design.md`.

**Architecture:** Single Next.js server-rendered route at `/profile` that fetches profile + derived stats + activity in parallel, then composes a new `ProfileHero` (client component for inline edits) + `ProfileStats` (server component) + the existing `ProfileActivityFeed`. New columns and storage bucket are added via one SQL migration (`005-…sql`) that Jack runs in the Supabase dashboard. No new test framework — the project has none today, so verification is manual + lint + build.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (`@supabase/ssr`, `@supabase/supabase-js`).

---

## Heads-up before you start

- **Read the Next.js docs first.** This project's `AGENTS.md` says: *"This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing any code."* Specifically check the docs on Server Components, Client Components, and the `'use client'` directive before reaching for old patterns.
- **No test framework.** The project doesn't have Jest, Vitest, or any test runner configured. Don't add one as part of this work — verification in this plan is manual (dev server + browser) plus `npm run lint` and `npm run build`.
- **Inline edits are client-side.** The page itself stays a server component. Anything interactive (`InlineTextField`, `VibeColorPicker`, `AvatarPicker`) is a client component receiving server-fetched initial values as props.
- **No avatar deletion on replace.** When a user uploads a new avatar, the old file is left in the bucket (cleanup is future work — not part of this plan). The `avatar_url` column simply gets the new URL.
- **`router.refresh()` after every mutation.** After any save (name, bio, avatar, vibe), call `router.refresh()` so server-rendered children (stats row, activity feed, the avatar fallback letter) re-fetch.

---

## File structure

What this plan creates or modifies:

**New files:**
- `docs/supabase/005-profile-vibe-and-avatars-bucket.sql` — SQL migration
- `docs/supabase/006-avatars-bucket-mime-and-size-limits.sql` — server-enforced MIME and size limits
- `src/lib/vibeColor.ts` — shared swatch keys / hex map / type
- `src/lib/profileStats.ts` — derived stats fetcher (voices, resonates, streak)
- `src/app/profile/ProfileHero.tsx` — client component composing the identity hero
- `src/app/profile/ProfileStats.tsx` — server component, three-chip row
- `src/app/profile/InlineTextField.tsx` — client component, shared inline-editable text/textarea primitive
- `src/app/profile/AvatarPicker.tsx` — client component, avatar render + upload flow
- `src/app/profile/VibeColorPicker.tsx` — client component, 5-swatch picker

**Modified files:**
- `src/app/profile/page.tsx` — full replacement of the page composition
- `src/app/profile/activity-preview/page.tsx` — left in place (dev-only); not touched
- `tailwind.config.*` *(if needed)* — add vibe-color utility classes if Tailwind v4 needs them; otherwise inline-style values from `vibeColor.ts`

**Deleted files:**
- `src/app/profile/ProfileForm.tsx` — replaced by inline-edit components

**Untouched:**
- `src/components/profile/ProfileActivityFeed.tsx`
- `src/app/profile/ProfileActivityMarker.tsx`
- `src/lib/profileActivityFeed.ts`

---

## Task 0: Setup — feature branch

**Files:** none (git only)

- [ ] **Step 1: Create and check out a feature branch**

Run from the project root:

```bash
git checkout -b feature/profile-redesign
```

Expected: `Switched to a new branch 'feature/profile-redesign'`.

- [ ] **Step 2: Push the branch to GitHub**

```bash
git push -u origin feature/profile-redesign
```

Expected: confirmation that the branch is now tracked on origin.

---

## Task 1: SQL migration — vibe_color column + avatars bucket

**Files:**
- Create: `docs/supabase/005-profile-vibe-and-avatars-bucket.sql`

- [ ] **Step 1: Create the migration file**

Write `docs/supabase/005-profile-vibe-and-avatars-bucket.sql` with exactly this content:

```sql
-- Profile vibe color + avatars storage bucket
-- Adds the personalization color and the storage bucket for avatar photos.
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run

-- ────────────────────────────────────────────────────────────
-- 1. Vibe color column on profiles
-- ────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists vibe_color text not null default 'ember';

alter table public.profiles
  drop constraint if exists profiles_vibe_color_check;

alter table public.profiles
  add constraint profiles_vibe_color_check
  check (vibe_color in ('ember', 'hearth', 'forest', 'dusk', 'clay'));

comment on column public.profiles.vibe_color is
  'Personal accent color. One of ember, hearth, forest, dusk, clay. Used in the user''s profile hero and stats row.';

-- Backfill: any pre-existing rows already get default 'ember' from the column default.
update public.profiles set vibe_color = 'ember' where vibe_color is null;

-- ────────────────────────────────────────────────────────────
-- 2. Avatars storage bucket (public-read)
-- ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Owner-only write (insert / update / delete) under their own user_id prefix.
-- Anyone (signed in or not) can read, because the bucket is public.

drop policy if exists "Avatars: owner can insert" on storage.objects;
create policy "Avatars: owner can insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars: owner can update" on storage.objects;
create policy "Avatars: owner can update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatars: owner can delete" on storage.objects;
create policy "Avatars: owner can delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- (Public read is automatic for public buckets; no separate select policy needed.)
```

- [ ] **Step 2: Run the migration in Supabase**

Open the Supabase project dashboard → SQL Editor → New query → paste the file contents → Run.

Expected:
- `alter table` succeeds (column added or already exists)
- `insert into storage.buckets` succeeds (or no-ops if the bucket already exists)
- Three `create policy` statements succeed

Verify in the dashboard:
- **Database → Tables → profiles** — confirm `vibe_color` column exists with default `ember`
- **Storage** — confirm an `avatars` bucket exists, marked public

- [ ] **Step 3: Commit the SQL file**

```bash
git add docs/supabase/005-profile-vibe-and-avatars-bucket.sql
git commit -m "feat: add vibe_color column and avatars storage bucket"
git push
```

---

## Task 2: Shared vibe-color module

**Files:**
- Create: `src/lib/vibeColor.ts`

- [ ] **Step 1: Create `src/lib/vibeColor.ts` with the canonical swatch map**

```ts
/**
 * Vibe colors — five preset accents a user can pick for their profile.
 * The DB column `profiles.vibe_color` stores the key (e.g. 'ember').
 */
export const VIBE_COLOR_KEYS = ["ember", "hearth", "forest", "dusk", "clay"] as const;

export type VibeColorKey = (typeof VIBE_COLOR_KEYS)[number];

export interface VibeColor {
  key: VibeColorKey;
  name: string;
  /** Primary hex used for stat numbers, vibe ring, and avatar gradient end. */
  hex: string;
  /** Lighter stop used for the top-left of the avatar fallback gradient. */
  hexLight: string;
  /** Darker stop used for the bottom-right of the avatar fallback gradient. */
  hexDark: string;
}

export const VIBE_COLORS: Record<VibeColorKey, VibeColor> = {
  ember:  { key: "ember",  name: "Ember",  hex: "#f5d28b", hexLight: "#fae3b0", hexDark: "#b07a31" },
  hearth: { key: "hearth", name: "Hearth", hex: "#cf8a5c", hexLight: "#e3a983", hexDark: "#8c4f2a" },
  forest: { key: "forest", name: "Forest", hex: "#7da38d", hexLight: "#a8c4b4", hexDark: "#3f6855" },
  dusk:   { key: "dusk",   name: "Dusk",   hex: "#b58fd8", hexLight: "#cdb1e6", hexDark: "#6e4d9b" },
  clay:   { key: "clay",   name: "Clay",   hex: "#d8a18a", hexLight: "#e8bea9", hexDark: "#9a5e47" },
};

export const DEFAULT_VIBE_COLOR: VibeColorKey = "ember";

export function isVibeColorKey(value: unknown): value is VibeColorKey {
  return typeof value === "string" && (VIBE_COLOR_KEYS as readonly string[]).includes(value);
}

export function resolveVibeColor(value: unknown): VibeColor {
  return VIBE_COLORS[isVibeColorKey(value) ? value : DEFAULT_VIBE_COLOR];
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/vibeColor.ts
git commit -m "feat: add shared vibe color module"
git push
```

---

## Task 3: Profile stats fetcher (voices, resonates, streak)

**Files:**
- Create: `src/lib/profileStats.ts`

- [ ] **Step 1: Create `src/lib/profileStats.ts`**

Mirror the parallel-query pattern in `src/lib/profileActivityFeed.ts`. The streak is computed in JavaScript over the answer-date list returned by the answers query — do not query the DB per-day.

```ts
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProfileStats {
  voices: number;
  resonates: number;
  streak: number;
}

export const EMPTY_PROFILE_STATS: ProfileStats = {
  voices: 0,
  resonates: 0,
  streak: 0,
};

/**
 * Voices = own answer count. Resonates = upvotes received on own answers.
 * Streak = consecutive UTC days (anchored to today, or yesterday if today is empty)
 * on which the user has at least one answer.
 */
export async function fetchProfileStatsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileStats> {
  // 1. Pull the user's answer dates in one shot — used for both `voices` count and streak.
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("id, created_at")
    .eq("user_id", userId);

  if (answersError || !answers) {
    return EMPTY_PROFILE_STATS;
  }

  const answerIds = answers.map((a) => a.id);

  // 2. Count resonates only if there's at least one answer to receive them.
  let resonates = 0;
  if (answerIds.length > 0) {
    const { count, error } = await supabase
      .from("answer_upvotes")
      .select("id", { count: "exact", head: true })
      .in("answer_id", answerIds)
      .neq("user_id", userId);

    if (!error && typeof count === "number") {
      resonates = count;
    }
  }

  return {
    voices: answers.length,
    resonates,
    streak: computeStreak(answers.map((a) => a.created_at)),
  };
}

/**
 * Counts consecutive UTC days the user has at least one answer.
 *
 * Rules:
 *   - If today (UTC) has an answer, count today and walk backward.
 *   - Else if yesterday (UTC) has an answer, count yesterday and walk backward.
 *   - Else streak is 0.
 *
 * Exported for direct testing if a test framework is introduced later.
 */
export function computeStreak(
  isoTimestamps: string[],
  now: Date = new Date()
): number {
  if (isoTimestamps.length === 0) return 0;

  const days = new Set<string>();
  for (const ts of isoTimestamps) {
    days.add(toUtcDateKey(new Date(ts)));
  }

  const today = toUtcDateKey(now);
  const yesterday = toUtcDateKey(addDaysUtc(now, -1));

  let cursor: Date;
  if (days.has(today)) {
    cursor = stripToUtcMidnight(now);
  } else if (days.has(yesterday)) {
    cursor = addDaysUtc(stripToUtcMidnight(now), -1);
  } else {
    return 0;
  }

  let count = 0;
  while (days.has(toUtcDateKey(cursor))) {
    count += 1;
    cursor = addDaysUtc(cursor, -1);
  }
  return count;
}

function toUtcDateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stripToUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDaysUtc(d: Date, delta: number): Date {
  return new Date(d.getTime() + delta * 24 * 60 * 60 * 1000);
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/profileStats.ts
git commit -m "feat: add profile stats fetcher with streak computation"
git push
```

---

## Task 4: ProfileStats component (three-chip row)

**Files:**
- Create: `src/app/profile/ProfileStats.tsx`

- [ ] **Step 1: Create the component**

This is a pure server component. It receives the stats and the user's vibe-color hex and renders the three chips. Zero values are muted; nonzero values use the vibe hex.

```tsx
import type { ProfileStats } from "@/lib/profileStats";
import type { VibeColor } from "@/lib/vibeColor";

interface ProfileStatsRowProps {
  stats: ProfileStats;
  vibe: VibeColor;
}

interface ChipProps {
  value: number;
  label: string;
  vibeHex: string;
  tooltip: string;
}

function StatChip({ value, label, vibeHex, tooltip }: ChipProps) {
  const isZero = value === 0;
  return (
    <div
      title={tooltip}
      className="flex-1 rounded-2xl border border-brand-50/10 bg-white/[0.025] px-3 py-3.5"
    >
      <div
        className="font-display text-[26px] leading-none"
        style={{ color: isZero ? "rgb(238 246 241 / 0.25)" : vibeHex }}
      >
        {value}
      </div>
      <div
        className={`mt-1 font-figtree text-[10px] font-medium uppercase tracking-[0.14em] ${
          isZero ? "text-brand-50/30" : "text-brand-50/40"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export default function ProfileStatsRow({ stats, vibe }: ProfileStatsRowProps) {
  return (
    <div className="mb-9 flex gap-2">
      <StatChip
        value={stats.voices}
        label="Voices"
        vibeHex={vibe.hex}
        tooltip="Campfire answers you've shared"
      />
      <StatChip
        value={stats.resonates}
        label="Resonates"
        vibeHex={vibe.hex}
        tooltip="Resonates received on your voices"
      />
      <StatChip
        value={stats.streak}
        label="Night streak"
        vibeHex={vibe.hex}
        tooltip="Days in a row you've shared a voice"
      />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/ProfileStats.tsx
git commit -m "feat: add ProfileStats component with vibe-tinted chips"
git push
```

---

## Task 5: VibeColorPicker component

**Files:**
- Create: `src/app/profile/VibeColorPicker.tsx`

- [ ] **Step 1: Create the picker**

Client component. Shows 5 swatches, highlights the current selection, and on click writes `vibe_color` to `profiles` and calls `router.refresh()`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  VIBE_COLORS,
  VIBE_COLOR_KEYS,
  type VibeColorKey,
} from "@/lib/vibeColor";

interface VibeColorPickerProps {
  initialKey: VibeColorKey;
}

export default function VibeColorPicker({ initialKey }: VibeColorPickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<VibeColorKey>(initialKey);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  function flashError(message: string) {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  }

  async function pick(key: VibeColorKey) {
    if (key === selected) return;
    const previous = selected;
    const myRequest = ++requestIdRef.current;
    setSelected(key);
    setError(null);
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (myRequest === requestIdRef.current) {
        setSelected(previous);
        setSaving(false);
        flashError("You must be signed in.");
      }
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        vibe_color: key,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (myRequest !== requestIdRef.current) return;

    if (updateError) {
      setSelected(previous);
      setSaving(false);
      flashError(updateError.message);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2.5">
      <span
        id="vibe-color-label"
        className="font-figtree text-[10px] font-medium uppercase tracking-[0.16em] text-brand-50/40"
      >
        Vibe
      </span>
      <div
        role="radiogroup"
        aria-labelledby="vibe-color-label"
        className="flex gap-1.5"
      >
        {VIBE_COLOR_KEYS.map((key) => {
          const c = VIBE_COLORS[key];
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={c.name}
              onClick={() => pick(key)}
              disabled={saving}
              className="h-[18px] w-[18px] rounded-[5px] border border-white/10 transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06160d] disabled:cursor-wait"
              style={{
                background: c.hex,
                boxShadow: isSelected
                  ? "0 0 0 2px #06160d, 0 0 0 4px rgba(245,210,139,0.55)"
                  : undefined,
              }}
            />
          );
        })}
      </div>
      {error ? (
        <span className="font-figtree text-[11px] text-red-300">{error}</span>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/VibeColorPicker.tsx
git commit -m "feat: add VibeColorPicker with 5 swatches and live save"
git push
```

---

## Task 6: InlineTextField component

**Files:**
- Create: `src/app/profile/InlineTextField.tsx`

- [ ] **Step 1: Create the component**

Reusable inline-edit primitive used for both `display_name` (single-line) and `bio` (multi-line). Save-on-blur; Esc cancels; respects max length; rejects empty if `required`.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface InlineTextFieldProps {
  /** Profile column to update — `display_name` or `bio`. */
  column: "display_name" | "bio";
  initialValue: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  maxLength: number;
  /** Tailwind classes applied to BOTH the resting display and the input. */
  textClassName: string;
  /** Optional resting-state empty content (when initialValue is blank). */
  emptyClassName?: string;
}

export default function InlineTextField({
  column,
  initialValue,
  placeholder,
  multiline = false,
  required = false,
  maxLength,
  textClassName,
  emptyClassName,
}: InlineTextFieldProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      const el = inputRef.current;
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [editing]);

  function flashError(message: string) {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  }

  function startEditing() {
    if (saving) return;
    setDraft(value);
    setError(null);
    setEditing(true);
  }

  function returnFocusToButton() {
    queueMicrotask(() => buttonRef.current?.focus());
  }

  async function commit() {
    if (saving) return;
    const trimmed = draft.trim();

    if (required && trimmed.length === 0) {
      setEditing(false);
      setDraft(value);
      returnFocusToButton();
      return;
    }
    if (trimmed.length > maxLength) {
      flashError(`Too long — keep it under ${maxLength} characters.`);
      return;
    }
    if (trimmed === value) {
      setEditing(false);
      returnFocusToButton();
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setEditing(false);
      flashError("You must be signed in.");
      returnFocusToButton();
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        [column]: trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (updateError) {
      flashError(updateError.message);
      return;
    }

    setValue(trimmed);
    setEditing(false);
    setJustSaved(true);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setJustSaved(false), 700);
    router.refresh();
    returnFocusToButton();
  }

  function cancel() {
    setEditing(false);
    setDraft(value);
    setError(null);
    returnFocusToButton();
  }

  const flashClass = justSaved
    ? "border-ember/80 shadow-[0_4px_24px_-8px_rgba(245,210,139,0.45)]"
    : "border-ember/30";
  const sharedClasses = `${textClassName} cursor-text border-b border-dashed bg-transparent transition-colors transition-shadow duration-500 ${flashClass}`;
  const hasValue = value.trim().length > 0;

  if (editing) {
    return (
      <div className="flex flex-col">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            rows={3}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`${sharedClasses} resize-none focus:outline-none`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              } else if (e.key === "Enter" && !multiline) {
                e.preventDefault();
                commit();
              }
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`${sharedClasses} focus:outline-none`}
          />
        )}
        {error ? (
          <span className="mt-1 font-figtree text-[11px] text-red-300">
            {error}
          </span>
        ) : null}
      </div>
    );
  }

  const editLabel =
    column === "display_name" ? "Edit display name" : "Edit bio";

  return (
    <div className="flex flex-col">
      <button
        ref={buttonRef}
        type="button"
        onClick={startEditing}
        aria-label={editLabel}
        className={`${sharedClasses} text-left ${
          hasValue ? "" : emptyClassName ?? "italic text-brand-50/35"
        }`}
      >
        {hasValue ? value : placeholder}
      </button>
      {error ? (
        <span className="mt-1 font-figtree text-[11px] text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/InlineTextField.tsx
git commit -m "feat: add InlineTextField primitive with save-on-blur"
git push
```

---

## Task 7: AvatarPicker component

**Files:**
- Create: `src/app/profile/AvatarPicker.tsx`

- [ ] **Step 1: Create the component**

Renders the avatar (photo with vibe ring, or fallback letter on vibe gradient). Click → file picker → upload to `avatars/{user_id}/{uuid}.{ext}` → save URL to `profiles.avatar_url` → `router.refresh()`. Validates 2MB / image-only.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { VibeColor } from "@/lib/vibeColor";

interface AvatarPickerProps {
  initialAvatarUrl: string | null;
  initialDisplayName: string;
  vibe: VibeColor;
}

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export default function AvatarPicker({
  initialAvatarUrl,
  initialDisplayName,
  vibe,
}: AvatarPickerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, []);

  function flashError(message: string) {
    setError(message);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
  }

  function openPicker() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      flashError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_BYTES) {
      flashError("Image must be under 2 MB.");
      return;
    }

    const myRequest = ++requestIdRef.current;
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      if (myRequest === requestIdRef.current) {
        setUploading(false);
        flashError("You must be signed in.");
      }
      return;
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const objectPath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (myRequest !== requestIdRef.current) return;

    if (uploadError) {
      setUploading(false);
      flashError(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(objectPath);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (myRequest !== requestIdRef.current) return;

    setUploading(false);

    if (updateError) {
      flashError(updateError.message);
      return;
    }

    setAvatarUrl(publicUrl);
    router.refresh();
  }

  const fallbackChar =
    initialDisplayName.trim().charAt(0).toUpperCase() || "?";
  const ringStyle = { boxShadow: `0 0 0 3px ${vibe.hex}` };
  const fallbackGradient = `linear-gradient(135deg, ${vibe.hexLight}, ${vibe.hexDark})`;
  const altText = `${initialDisplayName.trim() || "Your"} avatar`;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={openPicker}
        disabled={uploading}
        aria-label="Change avatar"
        className="relative h-[76px] w-[76px] flex-shrink-0 overflow-visible rounded-full transition-transform hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06160d] disabled:cursor-wait"
        style={ringStyle}
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
          {avatarUrl ? (
            // `unoptimized` keeps avatars off Next's image optimizer so we don't
            // need to whitelist the Supabase storage host in next.config.ts.
            // Acceptable here because the rendered size is fixed at 76px.
            <Image
              src={avatarUrl}
              alt={altText}
              width={76}
              height={76}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-display text-[30px] font-bold text-brand-900"
              style={{ background: fallbackGradient }}
            >
              {fallbackChar}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-900 bg-ember text-[12px] font-bold text-brand-900"
        >
          {uploading ? "…" : "✎"}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
      />
      {error ? (
        <span className="mt-2 max-w-[180px] font-figtree text-[11px] text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
```

**Note:** `next/image` requires the avatar bucket's hostname to be in `next.config.ts`'s `images.remotePatterns` for non-`unoptimized` rendering. We're using `unoptimized` here to keep the change minimal — this is fine for the avatar use case (small images, tightly constrained dimensions).

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/AvatarPicker.tsx
git commit -m "feat: add AvatarPicker with upload, vibe ring, and fallback letter"
git push
```

---

## Task 8: ProfileHero component

**Files:**
- Create: `src/app/profile/ProfileHero.tsx`

- [ ] **Step 1: Create the hero**

Composes `AvatarPicker`, the inline name field, the member-since line, the inline bio field, and the `VibeColorPicker`. This is the only place that arranges these client components together. It is a server component (no state of its own); each interactive child carries its own client boundary.

```tsx

import AvatarPicker from "./AvatarPicker";
import InlineTextField from "./InlineTextField";
import VibeColorPicker from "./VibeColorPicker";
import type { VibeColor, VibeColorKey } from "@/lib/vibeColor";

interface ProfileHeroProps {
  initialDisplayName: string;
  initialBio: string;
  initialAvatarUrl: string | null;
  initialVibeKey: VibeColorKey;
  vibe: VibeColor;
  memberSinceLabel: string;
}

export default function ProfileHero({
  initialDisplayName,
  initialBio,
  initialAvatarUrl,
  initialVibeKey,
  vibe,
  memberSinceLabel,
}: ProfileHeroProps) {
  return (
    <div className="mb-7 border-b border-brand-50/10 pb-5">
      <div className="mb-4 flex items-center gap-[18px]">
        <AvatarPicker
          initialAvatarUrl={initialAvatarUrl}
          initialDisplayName={initialDisplayName}
          vibe={vibe}
        />
        <div className="min-w-0">
          <InlineTextField
            column="display_name"
            initialValue={initialDisplayName}
            placeholder="Add your name"
            required
            maxLength={50}
            textClassName="font-display text-[28px] font-medium leading-tight text-brand-50"
          />
          <p className="mt-1 font-display text-[13px] italic text-brand-50/50">
            {memberSinceLabel}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <InlineTextField
          column="bio"
          initialValue={initialBio}
          placeholder="Add a bio so others know who you are."
          multiline
          maxLength={300}
          textClassName="font-display text-[17px] leading-snug text-brand-50/85"
        />
      </div>

      <VibeColorPicker initialKey={initialVibeKey} />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/ProfileHero.tsx
git commit -m "feat: add ProfileHero composing avatar, name, bio, vibe picker"
git push
```

---

## Task 9: New `/profile` page composition

**Files:**
- Modify: `src/app/profile/page.tsx` (full replacement)

- [ ] **Step 1: Replace `src/app/profile/page.tsx`**

Replace the entire contents of the file with this. The page is a server component. It fetches profile + activity + stats in parallel, then composes the new components.

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileActivityFeed from "@/components/profile/ProfileActivityFeed";
import {
  buildProfileActivityDisplayRows,
  fetchCampfireActivityForUser,
} from "@/lib/profileActivityFeed";
import { fetchProfileStatsForUser } from "@/lib/profileStats";
import {
  DEFAULT_VIBE_COLOR,
  isVibeColorKey,
  resolveVibeColor,
  type VibeColorKey,
} from "@/lib/vibeColor";
import ProfileHero from "./ProfileHero";
import ProfileStatsRow from "./ProfileStats";
import ProfileActivityMarker from "./ProfileActivityMarker";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [profileRes, activityItems, stats] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    fetchCampfireActivityForUser(supabase, user.id),
    fetchProfileStatsForUser(supabase, user.id),
  ]);

  const profile = profileRes.data;
  const activityRows = buildProfileActivityDisplayRows(activityItems);

  const vibeKey: VibeColorKey = isVibeColorKey(profile?.vibe_color)
    ? profile.vibe_color
    : DEFAULT_VIBE_COLOR;
  const vibe = resolveVibeColor(vibeKey);

  const memberSinceLabel = `Member since ${new Date(user.created_at).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  )}`;

  return (
    <div className="flex min-h-screen items-start justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <h1 className="sr-only">
          Your profile{profile?.display_name ? ` — ${profile.display_name}` : ""}
        </h1>

        <ProfileHero
          initialDisplayName={profile?.display_name ?? ""}
          initialBio={profile?.bio ?? ""}
          initialAvatarUrl={profile?.avatar_url ?? null}
          initialVibeKey={vibeKey}
          vibe={vibe}
          memberSinceLabel={memberSinceLabel}
        />

        <ProfileStatsRow stats={stats} vibe={vibe} />

        <ProfileActivityFeed rows={activityRows} />

        <ProfileActivityMarker />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: no errors. (Warnings about `<Image>` `unoptimized` are acceptable; that decision is documented in Task 7.)

- [ ] **Step 4: Commit**

```bash
git add src/app/profile/page.tsx
git commit -m "feat: rebuild /profile page around identity hero and stats row"
git push
```

---

## Task 10: Remove the obsolete `ProfileForm`

**Files:**
- Delete: `src/app/profile/ProfileForm.tsx`

- [ ] **Step 1: Confirm nothing else imports `ProfileForm`**

```bash
grep -r "ProfileForm" src/
```

Expected: zero matches (the new `page.tsx` from Task 9 doesn't import it).

If there are matches, stop and read them — there's a stray reference to fix before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm src/app/profile/ProfileForm.tsx
```

- [ ] **Step 3: Verify the project still builds**

```bash
npm run build
```

Expected: a successful production build with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/app/profile/ProfileForm.tsx
git commit -m "chore: remove obsolete ProfileForm component"
git push
```

---

## Task 11: Manual verification

**Files:** none (browser-based testing)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000/profile` (signed in).

- [ ] **Step 2: First-paint visual check**

Confirm:
- [ ] Avatar renders (your fallback letter on an ember gradient if no photo)
- [ ] Display name appears with a subtle dashed underline
- [ ] "Member since [Month Year]" sits in italic Fraunces, ~50% cream — quiet
- [ ] Bio appears (or shows placeholder italic if empty)
- [ ] Vibe row shows 5 swatches; one is selected
- [ ] Three stat chips render — voices / resonates / night streak — muted `0`s if you have no answers
- [ ] Campfire activity heading and feed render below

- [ ] **Step 3: Inline edits — name and bio**

- Click your name → input appears with the same typography → type a new value → click outside → value saves and renders
- Refresh the page → new value persists
- Click name → clear it entirely → blur → reverts to previous value (required behavior)
- Click bio → enter > 300 chars → red error appears under the field
- Click bio → press Esc → reverts without saving

- [ ] **Step 4: Avatar upload**

- Click the avatar → native file picker opens
- Choose an image > 2 MB → red error appears
- Choose a non-image (e.g. a `.txt`) → red error appears
- Choose a valid image → spinner shows → image renders → ring is in your current vibe color
- Refresh the page → image persists

- [ ] **Step 5: Vibe color**

- Click each non-selected swatch → it becomes selected → stat numbers retint to that color, avatar ring retints
- Refresh the page → selection persists
- If your avatar is the fallback letter, confirm the gradient changes color when you switch vibes

- [ ] **Step 6: Activity feed unchanged**

- Confirm the existing feed renders identically to before (replies, bundled resonates, expand toggle, empty state).

- [ ] **Step 7: Stop the dev server**

`Ctrl+C` in the dev terminal.

If any of the above fails, the corresponding task above is the place to fix it. After the fix, re-run from Step 1.

---

## Task 12: Open the pull request

**Files:** none (git only)

- [ ] **Step 1: Make sure all commits are pushed**

```bash
git status
git push
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --title "feat: profile redesign — identity hero, stats, vibe color" --body "$(cat <<'EOF'
## Summary
- Replaces `/profile` settings-style page with an identity-first hero (avatar, name, bio, member-since, vibe color)
- Adds a three-chip stats row: voices, resonates, night streak (UTC, computed at request time)
- Reuses the existing `ProfileActivityFeed` and `ProfileActivityMarker` unchanged
- New SQL migration `005-profile-vibe-and-avatars-bucket.sql` adds the `vibe_color` column and the `avatars` storage bucket with RLS

Spec: `docs/superpowers/specs/2026-04-24-profile-redesign-design.md`

## Test plan
- [ ] Open `/profile` signed in — hero, stats, and activity render correctly
- [ ] Click name / bio — inline edit works; saves on blur; Esc cancels
- [ ] Bio over 300 chars shows error
- [ ] Avatar upload works under 2 MB; non-images / oversize files show error
- [ ] Each of the 5 vibe swatches retints stat numbers + avatar ring
- [ ] All values persist across reload
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: a PR URL is returned. Open it in the browser to confirm.

- [ ] **Step 3: Done**

The plan is fully executed. The PR is the natural review checkpoint before merging to main.

---

## Notes for the engineer

---

## Task 13: Avatar upload hardening

**Files:**
- Create: `docs/supabase/006-avatars-bucket-mime-and-size-limits.sql`
- Modify: `src/app/profile/AvatarPicker.tsx`

Server-enforces MIME type and file size restrictions on the `avatars` bucket so the checks can't be bypassed via direct API calls. The same constraints exist in the client (AvatarPicker) for a friendlier UX, but the bucket enforces them at the storage layer.

Changes:
1. New SQL migration restricts `avatars` bucket to `image/jpeg`, `image/png`, `image/webp`, `image/gif` and caps file size at 2 MB.
2. Client AvatarPicker is updated to reject non-allowed MIME types up-front, replacing the generic `"Please choose an image file."` with a specific `"Please choose a JPEG, PNG, WebP, or GIF image."` message.

---

## Notes for the engineer

- **Order matters.** Tasks 1 and 2 must run before Task 3 (which uses the `vibe_color` column). Tasks 4–8 are independent of each other once Tasks 2 & 3 are done — they only get composed in Task 9.
- **`router.refresh()` is your friend.** Every component that mutates the DB calls `router.refresh()` after a successful save so server-rendered children (stats, member-since label, activity feed) re-pull. If something doesn't update visually after a save, suspect a missing `router.refresh()`.
- **If you see a Tailwind class that doesn't apply** (`text-ember`, `border-ember/30`, `bg-ember`), check `src/app/globals.css` or the existing components like `ProfileActivityFeed.tsx` to confirm the design tokens already exist in this project — they do.
- **Don't add a test framework.** If you find yourself wanting one, stop and ask Jack first.
