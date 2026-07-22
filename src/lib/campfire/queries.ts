import type { SupabaseClient } from "@supabase/supabase-js";
import { getCampfireDate } from "./date";
import type {
  Answer,
  CampfireSnapshot,
  DailyQuestion,
  Outcome,
  Reply,
} from "./types";

/**
 * Campfire data access.
 *
 * PORTABILITY: every function takes the Supabase client as its first argument
 * rather than importing one. The web app passes its server client; a React
 * Native app passes its own. That injection is the whole reason this folder
 * can be shared — do not import a client here.
 *
 * Row-level security already restricts these reads to signed-in users, so
 * these functions carry no auth logic of their own.
 */

/** PostgREST's code for "the result contains 0 rows" — an empty state, not a failure. */
const NO_ROWS = "PGRST116";

/** Postgres' code for a unique-constraint violation — here, "already answered tonight". */
const UNIQUE_VIOLATION = "23505";

/**
 * The shortest an answer may be. Mirrors the `char_length(body) >= 20` check on
 * `public.answers`, so the UI can enforce the same floor the database does and
 * show a friendly counter instead of surfacing a raw constraint error.
 */
export const MIN_ANSWER_LENGTH = 20;

/**
 * The longest an answer may be. There is no upper bound in the database yet, so
 * this is the only ceiling — without it a single answer could be arbitrarily
 * large and inflate every other viewer's feed download. Keep a matching
 * `char_length(body) <= N` check when the schema is next migrated.
 */
export const MAX_ANSWER_LENGTH = 2000;

export interface SubmitAnswerInput {
  questionId: string;
  userId: string;
  body: string;
  isAnonymous?: boolean;
}

/**
 * The outcome of a submit.
 *
 * `alreadyAnswered` is the important case: a repeat insert isn't a failure, it
 * means the user is already entitled to the reveal. Callers treat it as success
 * and re-read the gate rather than showing an error.
 */
export interface SubmitAnswerResult {
  id: string | null;
  alreadyAnswered: boolean;
}

/**
 * Record a user's answer to tonight's question.
 *
 * This is the one write the campfire performs, and it lives here for the same
 * reason the reads do: the app and the website should insert answers through
 * identical, framework-free code. The `unique (question_id, user_id)` index is
 * the real guard against a double answer — a repeat insert comes back as a
 * unique violation, which we report as `alreadyAnswered` rather than an error.
 */
export async function submitAnswer(
  supabase: SupabaseClient,
  input: SubmitAnswerInput
): Promise<Outcome<SubmitAnswerResult>> {
  const body = input.body.trim();

  if (body.length < MIN_ANSWER_LENGTH) {
    return {
      ok: false,
      error: `An answer needs at least ${MIN_ANSWER_LENGTH} characters.`,
    };
  }

  if (body.length > MAX_ANSWER_LENGTH) {
    return {
      ok: false,
      error: `An answer can be at most ${MAX_ANSWER_LENGTH} characters.`,
    };
  }

  const { data, error } = await supabase
    .from("answers")
    .insert({
      question_id: input.questionId,
      user_id: input.userId,
      body,
      is_anonymous: input.isAnonymous ?? false,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    // Already answered — not a failure. The caller should re-read the gate and
    // reveal the feed, not surface this as an error.
    if (error.code === UNIQUE_VIOLATION) {
      return { ok: true, data: { id: null, alreadyAnswered: true } };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, data: { id: data.id, alreadyAnswered: false } };
}

/**
 * Tonight's question, or `null` when nothing is scheduled.
 *
 * Returns `ok: false` when the lookup itself fails, so callers can tell a real
 * outage apart from a quiet night instead of rendering "no question tonight"
 * over a broken database.
 */
export async function getDailyQuestion(
  supabase: SupabaseClient,
  campfireDate: string = getCampfireDate()
): Promise<Outcome<DailyQuestion | null>> {
  const { data, error } = await supabase
    .from("daily_questions")
    .select("id, question_text, category, active_date")
    .eq("active_date", campfireDate)
    .single<DailyQuestion>();

  if (error && error.code !== NO_ROWS) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: data ?? null };
}

/**
 * How many people have answered a question.
 *
 * Reads through the `campfire_answer_count` SECURITY DEFINER function rather
 * than counting rows directly: once the read policy is gated, an un-answered
 * viewer can't see the rows, but they still need the count for the locked
 * "moment" screen. The function returns the true count without exposing rows.
 */
export async function getAnswerCount(
  supabase: SupabaseClient,
  questionId: string
): Promise<Outcome<number>> {
  const { data, error } = await supabase.rpc("campfire_answer_count", {
    p_question_id: questionId,
  });

  if (error) return { ok: false, error: error.message };

  return { ok: true, data: (data as number | null) ?? 0 };
}

/** Whether a given user has already answered — the answer gate's condition. */
export async function hasUserAnswered(
  supabase: SupabaseClient,
  questionId: string,
  userId: string
): Promise<Outcome<boolean>> {
  const { data, error } = await supabase
    .from("answers")
    .select("id")
    .eq("question_id", questionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  return { ok: true, data: data !== null };
}

/** The shape `get_campfire_answers` returns — already gated and redacted. */
interface CampfireAnswerRow {
  id: string;
  question_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  /** Null for an anonymous answer that isn't the caller's own. */
  author_id: string | null;
  /** Null for an anonymous answer. */
  display_name: string | null;
}

/**
 * Every answer to a question, with display names, upvote counts, reply counts,
 * and whether `viewerId` has upvoted each one.
 *
 * The base rows come from the `get_campfire_answers` SECURITY DEFINER function,
 * which is where the security actually lives: it returns rows only to a caller
 * who has answered (the gate), and redacts the author id and name of anonymous
 * answers inside the database, so identity never crosses the wire. Upvotes and
 * replies are then batched and joined in memory so volume doesn't multiply
 * round trips.
 */
export async function getAnswersWithMeta(
  supabase: SupabaseClient,
  questionId: string,
  viewerId: string
): Promise<Outcome<Answer[]>> {
  const { data, error } = await supabase.rpc("get_campfire_answers", {
    p_question_id: questionId,
  });

  if (error) return { ok: false, error: error.message };

  const rows = (data as CampfireAnswerRow[] | null) ?? [];
  if (rows.length === 0) return { ok: true, data: [] };

  const answerIds = rows.map((a) => a.id);

  const [upvotesRes, repliesRes] = await Promise.all([
    supabase
      .from("answer_upvotes")
      .select("answer_id, user_id")
      .in("answer_id", answerIds),
    supabase
      .from("answer_replies")
      .select("answer_id")
      .in("answer_id", answerIds),
  ]);

  const firstFailure = upvotesRes.error ?? repliesRes.error;
  if (firstFailure) return { ok: false, error: firstFailure.message };

  const upvoterIdsByAnswer = new Map<string, string[]>();
  for (const upvote of upvotesRes.data ?? []) {
    const voters = upvoterIdsByAnswer.get(upvote.answer_id) ?? [];
    voters.push(upvote.user_id);
    upvoterIdsByAnswer.set(upvote.answer_id, voters);
  }

  const replyCountByAnswer = new Map<string, number>();
  for (const reply of repliesRes.data ?? []) {
    replyCountByAnswer.set(
      reply.answer_id,
      (replyCountByAnswer.get(reply.answer_id) ?? 0) + 1
    );
  }

  const answers: Answer[] = rows.map((a) => {
    const voters = upvoterIdsByAnswer.get(a.id) ?? [];
    return {
      id: a.id,
      question_id: a.question_id,
      // `author_id` is already null for redacted anonymous rows; the Answer
      // type wants a string, so an empty id stands in.
      user_id: a.author_id ?? "",
      body: a.body,
      is_anonymous: a.is_anonymous,
      created_at: a.created_at,
      display_name: a.display_name,
      upvote_count: voters.length,
      reply_count: replyCountByAnswer.get(a.id) ?? 0,
      has_upvoted: voters.includes(viewerId),
    };
  });

  return { ok: true, data: answers };
}

/** Replies to a single answer, with display names joined in. */
export async function getReplies(
  supabase: SupabaseClient,
  answerId: string
): Promise<Outcome<Reply[]>> {
  const { data, error } = await supabase
    .from("answer_replies")
    .select("id, answer_id, user_id, body, is_anonymous, created_at")
    .eq("answer_id", answerId)
    .order("created_at", { ascending: true });

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) return { ok: true, data: [] };

  const userIds = [...new Set(data.map((r) => r.user_id))];
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);

  if (profilesError) return { ok: false, error: profilesError.message };

  const displayNameById = new Map<string, string | null>(
    (profiles ?? []).map((p) => [p.id, p.display_name])
  );

  return {
    ok: true,
    data: data.map((r) => ({
      id: r.id,
      answer_id: r.answer_id,
      user_id: r.user_id,
      body: r.body,
      is_anonymous: r.is_anonymous,
      created_at: r.created_at,
      display_name: displayNameById.get(r.user_id) ?? null,
    })),
  };
}

/**
 * Everything the campfire screen needs, in one call.
 *
 * The answer gate is enforced here rather than in the UI: answers are only
 * fetched once the viewer has answered, so unanswered visitors never receive
 * other people's responses over the wire.
 *
 * Pass `viewerId: null` for a signed-out visitor — they get the question and
 * the count, nothing more.
 */
export async function getCampfireSnapshot(
  supabase: SupabaseClient,
  viewerId: string | null,
  campfireDate: string = getCampfireDate()
): Promise<Outcome<CampfireSnapshot>> {
  const questionResult = await getDailyQuestion(supabase, campfireDate);
  if (!questionResult.ok) return questionResult;

  const question = questionResult.data;
  const empty: CampfireSnapshot = {
    question,
    answerCount: 0,
    hasAnswered: false,
    answers: [],
  };

  if (!question) return { ok: true, data: empty };

  const [countResult, answeredResult] = await Promise.all([
    getAnswerCount(supabase, question.id),
    viewerId
      ? hasUserAnswered(supabase, question.id, viewerId)
      : Promise.resolve({ ok: true as const, data: false }),
  ]);

  if (!countResult.ok) return countResult;
  if (!answeredResult.ok) return answeredResult;

  const snapshot: CampfireSnapshot = {
    ...empty,
    answerCount: countResult.data,
    hasAnswered: answeredResult.data,
  };

  if (!viewerId || !snapshot.hasAnswered) return { ok: true, data: snapshot };

  const answersResult = await getAnswersWithMeta(
    supabase,
    question.id,
    viewerId
  );
  if (!answersResult.ok) return answersResult;

  return { ok: true, data: { ...snapshot, answers: answersResult.data } };
}
