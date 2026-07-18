/**
 * Campfire date handling.
 *
 * The campfire runs on a single shared clock, not the visitor's clock: everyone
 * answers the same question on the same day, and the fire goes out at midnight
 * Central. Deriving "today" from the device would split users across two
 * questions either side of midnight.
 *
 * PORTABILITY: plain TypeScript. No React, no Next.js, no `@/` imports.
 */

/** The single clock the campfire runs on. */
export const CAMPFIRE_TIME_ZONE = "America/Chicago";

/**
 * Today's campfire date as `YYYY-MM-DD`, matching `daily_questions.active_date`.
 *
 * `en-CA` is used because it formats as ISO `YYYY-MM-DD`, which is what the
 * column expects — not a locale preference.
 */
export function getCampfireDate(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: CAMPFIRE_TIME_ZONE });
}

/**
 * A campfire date rendered for display, e.g. "Friday, 18 July".
 *
 * Takes the `YYYY-MM-DD` string rather than a Date so the label always matches
 * the question actually being shown.
 */
export function formatCampfireDate(
  campfireDate: string,
  locale: string = "en-US"
): string {
  // Parsing and formatting both happen in the runtime's local zone, so the
  // weekday round-trips correctly regardless of where the server runs.
  return new Date(`${campfireDate}T00:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
