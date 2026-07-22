/**
 * Campfire types now live in `@/lib/campfire`, which is framework-free so a
 * React Native app can share it. Re-exported here so existing imports keep
 * working — prefer importing from `@/lib/campfire` in new code.
 */
export type { Answer, DailyQuestion, Reply } from "@/lib/campfire";
