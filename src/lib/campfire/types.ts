/**
 * Campfire domain types.
 *
 * PORTABILITY: this folder is plain TypeScript over `@supabase/supabase-js`.
 * It must never import React, Next.js, or anything under `@/`. A React Native
 * app can consume it as-is, so keep it framework-free.
 */

export interface DailyQuestion {
  id: string;
  question_text: string;
  category: string;
  active_date: string;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  /** Joined from `profiles`. */
  display_name: string | null;
  /** Computed from `answer_upvotes`. */
  upvote_count: number;
  /** Computed from `answer_replies`. */
  reply_count: number;
  /** Whether the requesting user is among the upvoters. */
  has_upvoted: boolean;
}

export interface Reply {
  id: string;
  answer_id: string;
  user_id: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
  display_name: string | null;
}

/**
 * One night in a user's own history: the question they sat with and what they
 * said. Powers the "your nights" archive.
 */
export interface Night {
  question_id: string;
  question_text: string;
  /** The campfire date the question ran, `YYYY-MM-DD`. */
  active_date: string;
  body: string;
  is_anonymous: boolean;
  created_at: string;
}

/**
 * Result of a campfire read.
 *
 * The distinction that matters: `{ ok: true, data: null }` means "nothing is
 * scheduled tonight" — a legitimate empty state. `{ ok: false }` means the
 * query itself failed. Collapsing those two is how a database outage ends up
 * rendering "the fire is quiet tonight" to every visitor.
 */
export type Outcome<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Everything the campfire screen needs, in one read. */
export interface CampfireSnapshot {
  question: DailyQuestion | null;
  answerCount: number;
  /** Whether the requesting user has answered — drives the answer gate. */
  hasAnswered: boolean;
  /** Populated only once the gate is passed; empty otherwise. */
  answers: Answer[];
}
