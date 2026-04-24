import { createClient } from "@/lib/supabase/client";

/** Dispatched after /profile bumps `activity_last_viewed_at` so the header can refetch. */
export const PROFILE_ACTIVITY_SEEN_EVENT = "tsp:profile-activity-seen";

/**
 * True when someone else replied to or resonated with this user's answers
 * after `profiles.activity_last_viewed_at`.
 */
export async function fetchHasUnreadProfileActivity(
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("activity_last_viewed_at")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return false;
  }

  const row = profile as { activity_last_viewed_at?: string | null };
  const last =
    row.activity_last_viewed_at ?? "1970-01-01T00:00:00.000Z";

  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("id")
    .eq("user_id", userId);

  if (answersError || !answers?.length) {
    return false;
  }

  const answerIds = answers.map((a) => a.id);

  const [repliesRes, upvotesRes] = await Promise.all([
    supabase
      .from("answer_replies")
      .select("id", { count: "exact", head: true })
      .in("answer_id", answerIds)
      .neq("user_id", userId)
      .gt("created_at", last),
    supabase
      .from("answer_upvotes")
      .select("id", { count: "exact", head: true })
      .in("answer_id", answerIds)
      .neq("user_id", userId)
      .gt("created_at", last),
  ]);

  if (repliesRes.error || upvotesRes.error) {
    return false;
  }

  const replyCount = repliesRes.count ?? 0;
  const upvoteCount = upvotesRes.count ?? 0;
  return replyCount + upvoteCount > 0;
}
