-- Campfire server-side gate — STEP 1 of 2: the functions
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run
--
-- These three functions move the post-to-unlock gate and anonymity redaction
-- from the client (where they are not a real security boundary) into the
-- database. This step is ADDITIVE and safe to run at any time — it only
-- creates functions and changes nothing about existing reads.
--
-- Apply the read-policy tightening (009) only AFTER the client has been
-- deployed to read the count and answers through these functions, or the
-- pre-answer "N voices" count on the campfire will read 0.

-- ────────────────────────────────────────────────────────────
-- 1. has_answered — "has the caller answered this question?"
--
-- SECURITY DEFINER so it can see the caller's own answer even once the read
-- policy on `answers` is tightened. This is the predicate the gate is built on.
-- ────────────────────────────────────────────────────────────
create or replace function public.has_answered(p_question_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.answers
    where question_id = p_question_id
      and user_id = auth.uid()
  );
$$;

-- ────────────────────────────────────────────────────────────
-- 2. campfire_answer_count — the count the locked screen shows
--
-- The locked "moment" shows how many people have answered BEFORE the viewer
-- has. Once the read policy is tightened, an un-answered viewer can no longer
-- see any answer rows, so a plain count would return 0. This SECURITY DEFINER
-- function returns the true count without exposing the rows themselves.
-- ────────────────────────────────────────────────────────────
create or replace function public.campfire_answer_count(p_question_id uuid)
returns integer
language sql
security definer
set search_path = public
stable
as $$
  select count(*)::int
  from public.answers
  where question_id = p_question_id;
$$;

-- ────────────────────────────────────────────────────────────
-- 3. get_campfire_answers — the gated, anonymity-redacted feed
--
-- Returns a question's answers ONLY to a caller who has answered it (the gate),
-- and never lets an anonymous answer's author leak: for anonymous rows the
-- author id and display name come back null for everyone but the author. This
-- is the real fix for both deferred findings — the raw user_id/display_name of
-- an anonymous answer never leaves the database.
-- ────────────────────────────────────────────────────────────
create or replace function public.get_campfire_answers(p_question_id uuid)
returns table (
  id uuid,
  question_id uuid,
  body text,
  is_anonymous boolean,
  created_at timestamptz,
  author_id uuid,
  display_name text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    a.id,
    a.question_id,
    a.body,
    a.is_anonymous,
    a.created_at,
    -- Redact the author of an anonymous answer for everyone but its author.
    case when a.is_anonymous and a.user_id <> auth.uid() then null else a.user_id end,
    case when a.is_anonymous then null else p.display_name end
  from public.answers a
  left join public.profiles p on p.id = a.user_id
  where a.question_id = p_question_id
    and public.has_answered(p_question_id)   -- the gate, enforced in the database
  order by a.created_at desc;
$$;

-- Expose the functions to signed-in users via PostgREST (supabase.rpc(...)).
-- SECURITY DEFINER + a pinned search_path keeps them safe to grant.
grant execute on function public.has_answered(uuid) to authenticated;
grant execute on function public.campfire_answer_count(uuid) to authenticated;
grant execute on function public.get_campfire_answers(uuid) to authenticated;
