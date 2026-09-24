-- Which channels bring people in, and which bring people who stay?
--
-- Sign-ups carry their first-touch source in
-- auth.users.raw_user_meta_data -> 'signup_source' (see src/lib/signupSource.ts).
-- Tag every link you post so it shows up here by name:
--
--   TikTok bio     https://jointhesocialproject.com/?utm_source=tiktok
--   Instagram bio  https://jointhesocialproject.com/?utm_source=instagram
--   Campus flyer   https://jointhesocialproject.com/?utm_source=flyer&utm_campaign=<where>
--   Reddit post    https://jointhesocialproject.com/?utm_source=reddit&utm_campaign=<subreddit>
--   Product Hunt   https://jointhesocialproject.com/?utm_source=producthunt
--   Substack       https://jointhesocialproject.com/?utm_source=substack
--
-- The in-app share button tags itself as `share`. Untagged sites show up by
-- their domain (e.g. reddit.com). No source at all means "direct": typed in,
-- or opened from a text with no tag.
--
-- Sign-ups from before 2026-09-24 have no source and are left out.

select
  coalesce(u.raw_user_meta_data -> 'signup_source' ->> 'source', 'direct') as source,
  u.raw_user_meta_data -> 'signup_source' ->> 'campaign' as campaign,
  count(*) as signups,
  count(*) filter (where a.nights >= 1) as answered_once,
  count(*) filter (where a.nights >= 3) as came_back_3_nights
from auth.users u
left join (
  select user_id, count(distinct created_at::date) as nights
  from public.answers
  group by user_id
) a on a.user_id = u.id
where u.created_at >= '2026-09-24'
group by 1, 2
order by signups desc;
