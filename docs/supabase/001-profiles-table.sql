-- Profiles table — stores public user info (display name, bio, avatar)
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run

-- 1. Create the profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Turn on Row Level Security (RLS)
-- This ensures users can only edit their own data
alter table public.profiles enable row level security;

-- 3. Anyone can read profiles (needed for discussion threads)
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- 4. Users can insert their own profile
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 5. Users can update only their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 6. Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
