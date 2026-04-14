-- Community tables — daily questions, answers, upvotes, and replies
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run

-- ────────────────────────────────────────────────────────────
-- 1. Daily questions — one per day, set by the team
-- ────────────────────────────────────────────────────────────
create table public.daily_questions (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  category text not null check (
    category in (
      'icebreaker', 'reflection', 'connection',
      'advice', 'hot-take', 'gratitude', 'hypothetical'
    )
  ),
  active_date date not null unique,
  created_at timestamptz default now() not null
);

alter table public.daily_questions enable row level security;

-- Anyone can read questions (visible to logged-out visitors too)
create policy "Questions are publicly readable"
  on public.daily_questions for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- 2. Answers — one per user per question
-- ────────────────────────────────────────────────────────────
create table public.answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references public.daily_questions on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  body text not null check (char_length(body) >= 20),
  is_anonymous boolean default false not null,
  created_at timestamptz default now() not null,
  unique (question_id, user_id)
);

alter table public.answers enable row level security;

-- Signed-in users can read all answers
create policy "Answers are readable by signed-in users"
  on public.answers for select
  using (auth.uid() is not null);

-- Users can insert their own answer
create policy "Users can create their own answer"
  on public.answers for insert
  with check (auth.uid() = user_id);

-- Users can delete their own answer
create policy "Users can delete their own answer"
  on public.answers for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. Upvotes — one per user per answer (upvote only, no downvotes)
-- ────────────────────────────────────────────────────────────
create table public.answer_upvotes (
  id uuid default gen_random_uuid() primary key,
  answer_id uuid references public.answers on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (answer_id, user_id)
);

alter table public.answer_upvotes enable row level security;

-- Signed-in users can read upvotes
create policy "Upvotes are readable by signed-in users"
  on public.answer_upvotes for select
  using (auth.uid() is not null);

-- Users can insert their own upvote
create policy "Users can upvote"
  on public.answer_upvotes for insert
  with check (auth.uid() = user_id);

-- Users can remove their own upvote
create policy "Users can remove their upvote"
  on public.answer_upvotes for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 4. Replies — one level of threading under answers
-- ────────────────────────────────────────────────────────────
create table public.answer_replies (
  id uuid default gen_random_uuid() primary key,
  answer_id uuid references public.answers on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  body text not null check (char_length(body) >= 1),
  is_anonymous boolean default false not null,
  created_at timestamptz default now() not null
);

alter table public.answer_replies enable row level security;

-- Signed-in users can read replies
create policy "Replies are readable by signed-in users"
  on public.answer_replies for select
  using (auth.uid() is not null);

-- Users can insert their own reply
create policy "Users can create their own reply"
  on public.answer_replies for insert
  with check (auth.uid() = user_id);

-- Users can delete their own reply
create policy "Users can delete their own reply"
  on public.answer_replies for delete
  using (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 5. Helper view: answer count per question (public, for teaser stats)
-- ────────────────────────────────────────────────────────────
create or replace view public.question_answer_counts as
  select
    dq.id as question_id,
    count(a.id)::int as answer_count
  from public.daily_questions dq
  left join public.answers a on a.question_id = dq.id
  group by dq.id;
