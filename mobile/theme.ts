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

  // --- Mobile-only additions (not on the web palette) -----------------------
  /** A darker pine for the full-screen "moment", so the panel above it lifts. */
  pineDeep: "#0a2116",
  /** The warm campfire glow — the CTA colour on the dark ritual screen. */
  ember: "#e8a24c",
  emberInk: "#2a1a06",
  /** A hairline that reads on the dark pine surface. */
  pineHairline: "rgba(244, 242, 234, 0.12)",
  /** A card surface for the light reveal feed. */
  card: "#ffffff",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

export const radii = {
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;
