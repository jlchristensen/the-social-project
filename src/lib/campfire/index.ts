/**
 * The campfire, as portable TypeScript.
 *
 * This folder is the shared heart of the campfire: the daily-question clock,
 * the queries, the answer-gate rule. It depends only on `@supabase/supabase-js`
 * and takes its client by injection, so the same code runs in the Next.js web
 * app and in a React Native app.
 *
 * RULE: nothing in `src/lib/campfire/` may import React, Next.js, or anything
 * under `@/`. If a change needs one of those, it belongs in a component, not here.
 */

export {
  CAMPFIRE_TIME_ZONE,
  getCampfireDate,
  formatCampfireDate,
} from "./date";

export {
  getDailyQuestion,
  getAnswerCount,
  hasUserAnswered,
  getAnswersWithMeta,
  getReplies,
  getCampfireSnapshot,
} from "./queries";

export type {
  Answer,
  CampfireSnapshot,
  DailyQuestion,
  Outcome,
  Reply,
} from "./types";
