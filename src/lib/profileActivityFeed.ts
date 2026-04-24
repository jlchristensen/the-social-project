import type { SupabaseClient } from "@supabase/supabase-js";

export type CampfireActivityItem =
  | {
      kind: "resonate";
      id: string;
      created_at: string;
      answer_id: string;
      actor_label: string;
      answer_excerpt: string;
    }
  | {
      kind: "reply";
      id: string;
      created_at: string;
      answer_id: string;
      actor_label: string;
      reply_snippet: string;
      answer_excerpt: string;
    };

function excerpt(body: string, max = 100): string {
  const t = body.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

/**
 * Replies and resonates on this user's Campfire answers (others only), newest first.
 */
export async function fetchCampfireActivityForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<CampfireActivityItem[]> {
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select("id, body")
    .eq("user_id", userId);

  if (answersError || !answers?.length) {
    return [];
  }

  const answerExcerpt = new Map(
    answers.map((a) => [a.id, excerpt(a.body ?? "")])
  );
  const answerIds = answers.map((a) => a.id);

  const [upvotesRes, repliesRes] = await Promise.all([
    supabase
      .from("answer_upvotes")
      .select("id, created_at, user_id, answer_id")
      .in("answer_id", answerIds)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("answer_replies")
      .select("id, created_at, user_id, answer_id, body, is_anonymous")
      .in("answer_id", answerIds)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  if (upvotesRes.error || repliesRes.error) {
    return [];
  }

  const actorIds = new Set<string>();
  for (const r of repliesRes.data ?? []) {
    if (!r.is_anonymous) actorIds.add(r.user_id);
  }
  for (const u of upvotesRes.data ?? []) {
    actorIds.add(u.user_id);
  }

  const profileMap = new Map<string, string | null>();
  if (actorIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", [...actorIds]);

    for (const p of profiles ?? []) {
      profileMap.set(p.id, p.display_name);
    }
  }

  function actorLabel(uid: string, anonymous: boolean): string {
    if (anonymous) return "Anonymous";
    const name = profileMap.get(uid)?.trim();
    return name && name.length > 0 ? name : "Community member";
  }

  const items: CampfireActivityItem[] = [];

  for (const u of upvotesRes.data ?? []) {
    items.push({
      kind: "resonate",
      id: u.id,
      created_at: u.created_at,
      answer_id: u.answer_id,
      actor_label: actorLabel(u.user_id, false),
      answer_excerpt: answerExcerpt.get(u.answer_id) ?? "",
    });
  }

  for (const r of repliesRes.data ?? []) {
    items.push({
      kind: "reply",
      id: r.id,
      created_at: r.created_at,
      answer_id: r.answer_id,
      actor_label: actorLabel(r.user_id, r.is_anonymous),
      reply_snippet: excerpt(r.body ?? "", 160),
      answer_excerpt: answerExcerpt.get(r.answer_id) ?? "",
    });
  }

  items.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return items.slice(0, 50);
}
