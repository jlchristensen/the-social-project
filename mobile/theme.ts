/**
 * The app's palette, taken from Direction B on the web so the two surfaces
 * read as one product. Keep these in sync with `.dir-b` in
 * `src/app/preview/b/styles.css` — if the web palette changes, change it here.
 */
export const colors = {
  bg: "#fbfaf7",
  ink: "#17211b",
  body: "#3f4b44",
  muted: "#57625a",
  accent: "#1d5c3c",
  hairline: "rgba(23, 33, 27, 0.14)",
  /** The campfire's dark surface — the one moment of full contrast. */
  pine: "#0f2c1e",
  pineInk: "#f4f2ea",
  pineMuted: "rgba(244, 242, 234, 0.68)",
  sage: "#9fc4ac",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;
