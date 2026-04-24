-- Track when the user last viewed profile-related activity (replies / resonates on their answers).
-- Used for the header profile orb and future Activity on /profile.
-- Run in Supabase: SQL Editor → paste → Run

alter table public.profiles
  add column if not exists activity_last_viewed_at timestamptz not null default now();

comment on column public.profiles.activity_last_viewed_at is
  'Replies and resonates on this user''s answers created after this time count as unread for the profile indicator.';
