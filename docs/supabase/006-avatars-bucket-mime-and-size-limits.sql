-- Avatars bucket — server-enforced MIME allow-list and size cap
-- Hardens the avatars bucket created in 005 so the safety checks can't be
-- bypassed by calling the Supabase Storage API directly with a spoofed
-- content-type or oversize file. The same constraints exist in the client
-- (src/app/profile/AvatarPicker.tsx) for a friendlier UX, but the bucket
-- enforces them too.
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run

update storage.buckets
  set
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    file_size_limit = 2097152  -- 2 MB
  where id = 'avatars';
