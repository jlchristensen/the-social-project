import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProfileStats {
  voices: number;
  resonates: number;
  streak: number;
}

export const EMPTY_PROFILE_STATS: ProfileStats = {
  voices: 0,
  resonates: 0,
  streak: 0,
};

/**
 * Voices = own answer count. Resonates = upvotes received on own answers.
 * Streak = consecutive UTC days (anchored to today, or yesterday if today is empty)
 * on which the user has at least one answer.
 */
export async function fetchProfileStatsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<ProfileStats> {
  // 1. Pull the user's answer dates in one shot — used for both `voices` count and streak.
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("id, created_at")
    .eq("user_id", userId);

  if (answersError || !answers) {
    return EMPTY_PROFILE_STATS;
  }

  const answerIds = answers.map((a) => a.id);

  // 2. Count resonates only if there's at least one answer to receive them.
  let resonates = 0;
  if (answerIds.length > 0) {
    const { count, error } = await supabase
      .from("answer_upvotes")
      .select("id", { count: "exact", head: true })
      .in("answer_id", answerIds)
      .neq("user_id", userId);

    if (!error && typeof count === "number") {
      resonates = count;
    }
  }

  return {
    voices: answers.length,
    resonates,
    streak: computeStreak(answers.map((a) => a.created_at)),
  };
}

/**
 * Counts consecutive UTC days the user has at least one answer.
 *
 * Rules:
 *   - If today (UTC) has an answer, count today and walk backward.
 *   - Else if yesterday (UTC) has an answer, count yesterday and walk backward.
 *   - Else streak is 0.
 *
 * Exported for direct testing if a test framework is introduced later.
 */
export function computeStreak(
  isoTimestamps: string[],
  now: Date = new Date()
): number {
  if (isoTimestamps.length === 0) return 0;

  const days = new Set<string>();
  for (const ts of isoTimestamps) {
    days.add(toUtcDateKey(new Date(ts)));
  }

  const today = toUtcDateKey(now);
  const yesterday = toUtcDateKey(addDaysUtc(now, -1));

  let cursor: Date;
  if (days.has(today)) {
    cursor = stripToUtcMidnight(now);
  } else if (days.has(yesterday)) {
    cursor = addDaysUtc(stripToUtcMidnight(now), -1);
  } else {
    return 0;
  }

  let count = 0;
  while (days.has(toUtcDateKey(cursor))) {
    count += 1;
    cursor = addDaysUtc(cursor, -1);
  }
  return count;
}

function toUtcDateKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stripToUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDaysUtc(d: Date, delta: number): Date {
  return new Date(d.getTime() + delta * 24 * 60 * 60 * 1000);
}
