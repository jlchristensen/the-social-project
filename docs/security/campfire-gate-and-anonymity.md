# Campfire: post-to-unlock gate & anonymity — server-side hardening

**Status:** ✅ DONE — enforced in production and verified end-to-end (2026-07-22).
`008` (functions) and `009` (read policy) are applied; the client reads through
the RPCs (`src/lib/campfire/queries.ts`). Verified against the live DB: an
un-answered user gets nothing via the RPC *or* a direct table read, anonymous
authors come back with `null` id/name, and the count, posting, and the
answered-user feed all still work. Kept for the record — the two findings below
are closed.
**Found by:** adversarial review of the mobile build, 2026-07-22.
**Severity:** both High. Not on fire (app is pre-launch), but must land before real users.

The mobile app talks to Supabase directly with the public anon key. That means
**any logic in `src/lib/campfire/` runs on the user's device and is not a
security boundary** — only Postgres RLS and `SECURITY DEFINER` functions are.
Two invariants are currently enforced only in that client-side code.

---

## 1. The post-to-unlock gate is client-side only

`getCampfireSnapshot` decides whether to fetch other people's answers in TS
(`if (!viewerId || !snapshot.hasAnswered) return snapshot`). But the RLS SELECT
policy on `public.answers` is:

```sql
using (auth.uid() is not null)   -- any signed-in user can read every answer
```

So a signed-in user who has **not** answered can bypass the gate entirely:

```js
supabase.from('answers').select('*').eq('question_id', q) // returns everything
```

The "answer honestly to see what everyone said" promise is not actually enforced.

## 2. Anonymity is cosmetic

`getAnswersWithMeta` sends every answer's `user_id` (and, before the client-side
fix below, its `display_name`) to the device regardless of `is_anonymous`. The UI
just renders the string "Anonymous" — the real identity is still in the payload
and can be read straight off the wire and correlated across nights.

**Already mitigated (client-side, shipped):** the library now nulls
`display_name` for anonymous rows, redacts `user_id` for everyone but the
author, and never fetches anonymous posters' profiles. This cleans the returned
objects, **but the raw `answers` rows still carry `user_id`/`is_anonymous` over
the wire.** Only a server-side redaction closes it fully.

---

## The fix (one migration + one client change)

### ⚠️ The gotcha: strict RLS breaks the "N voices" count

The locked "moment" screen shows the answer count **before** you've answered.
If we simply restrict SELECT on `answers` to people who've answered, an
un-answered viewer can no longer see any rows — so `getAnswerCount`'s
`head: true` count returns **0**, and the moment screen always reads "0 voices".

So the count must move to a `SECURITY DEFINER` function that bypasses RLS.
**Do not deploy the policy change without also switching the client's count
call — otherwise every locked screen shows 0 voices.**

### Migration (review before running — pair with the client change)

```sql
-- a) "have I answered this question?" — bypasses RLS so the policy can use it
create or replace function public.has_answered(p_question_id uuid)
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.answers
    where question_id = p_question_id and user_id = auth.uid()
  );
$$;

-- b) the real gate: you can read a question's answers only once you've answered it
drop policy "Answers are readable by signed-in users" on public.answers;
create policy "Answers readable once you've answered"
  on public.answers for select
  using (public.has_answered(question_id));

-- c) the count the locked screen needs, without exposing rows
create or replace function public.campfire_answer_count(p_question_id uuid)
returns integer language sql security definer stable
set search_path = public as $$
  select count(*)::int from public.answers where question_id = p_question_id;
$$;

-- d) (recommended) redacted answer feed — closes the raw-column anonymity leak
create or replace function public.get_campfire_answers(p_question_id uuid)
returns table (
  id uuid, body text, is_anonymous boolean, created_at timestamptz,
  author_id uuid, display_name text
) language sql security definer stable
set search_path = public as $$
  select a.id, a.body, a.is_anonymous, a.created_at,
         case when a.is_anonymous and a.user_id <> auth.uid() then null else a.user_id end,
         case when a.is_anonymous then null else p.display_name end
  from public.answers a
  left join public.profiles p on p.id = a.user_id
  where a.question_id = p_question_id
    and public.has_answered(p_question_id)   -- gate again, inside the definer
  order by a.created_at desc;
$$;
```

### Paired client change (in `src/lib/campfire/queries.ts`)

- `getAnswerCount` → `supabase.rpc('campfire_answer_count', { p_question_id })`.
- `getAnswersWithMeta` → `supabase.rpc('get_campfire_answers', { p_question_id })`
  (then join upvotes/reply counts as today). This removes the raw-column leak
  because the device never selects `answers` directly for the feed.
- Keep `hasUserAnswered` as-is: after answering, RLS lets the user see their own
  row, so the query still works; before answering there is no row anyway.

### Verify after deploying
- Signed-in, **not** answered: direct `select * from answers` returns 0 rows;
  moment screen still shows the correct voice count.
- Answered: reveal feed loads; an anonymous answer's `author_id`/`display_name`
  come back null for other viewers, non-null for its own author.

---

## Also deferred

- **Refresh token at rest (low):** the Supabase session (incl. long-lived
  refresh token) is in `AsyncStorage`, which is plaintext on device. Move to an
  `expo-secure-store`-backed adapter **for native only** — SecureStore doesn't
  exist on web and would break the web preview, so gate it by platform.
- **Answer max length:** client + library now cap at `MAX_ANSWER_LENGTH` (2000).
  Add a matching `check (char_length(body) <= 2000)` when the schema is next
  migrated so the DB agrees with the client.
