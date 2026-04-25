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
