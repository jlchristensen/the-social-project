-- Campfire server-side gate — STEP 2 of 2: the read policy
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run
--
-- ⚠️  APPLY THIS ONLY AFTER the client that reads answers through
--     get_campfire_answers()/campfire_answer_count() (migration 008) is
--     DEPLOYED. Applying it against the old client makes the pre-answer
--     "N voices" count read 0, because an un-answered viewer can no longer
--     see any answer rows to count.
--
-- This replaces the "any signed-in user can read every answer" policy with the
-- real post-to-unlock gate. Two permissive SELECT policies are OR'd together:
--   1. you can always read YOUR OWN answers, and
--   2. you can read a question's answers once you've answered it.
-- (1) is what lets an insert return your new row and lets the "have I answered"
-- check see it; (2) is the gate for everyone else's answers.

-- Remove the old blanket-read policy.
drop policy if exists "Answers are readable by signed-in users" on public.answers;

-- (1) Always read your own answers — no gate. Needed for INSERT ... RETURNING
-- and for hasUserAnswered() to see your row.
create policy "Read your own answers"
  on public.answers for select
  using (user_id = auth.uid());

-- (2) Read everyone's answers for a question only once you've answered it.
create policy "Read answers once you've answered"
  on public.answers for select
  using (public.has_answered(question_id));

-- After this runs, verify:
--   • A signed-in user who has NOT answered:
--       select * from answers where question_id = '<today>'  → only their own (none)
--       select public.campfire_answer_count('<today>')       → the true count
--   • A signed-in user who HAS answered:
--       select * from answers where question_id = '<today>'  → all rows
