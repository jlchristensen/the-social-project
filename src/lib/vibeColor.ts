/**
 * Vibe colors — five preset accents a user can pick for their profile.
 * The DB column `profiles.vibe_color` stores the key (e.g. 'ember').
 */
export const VIBE_COLOR_KEYS = ["ember", "hearth", "forest", "dusk", "clay"] as const;

export type VibeColorKey = (typeof VIBE_COLOR_KEYS)[number];

export interface VibeColor {
  key: VibeColorKey;
  name: string;
  /** Primary hex used for stat numbers, vibe ring, and avatar gradient end. */
  hex: string;
  /** Lighter stop used for the top-left of the avatar fallback gradient. */
  hexLight: string;
  /** Darker stop used for the bottom-right of the avatar fallback gradient. */
  hexDark: string;
}

export const VIBE_COLORS: Record<VibeColorKey, VibeColor> = {
  ember:  { key: "ember",  name: "Ember",  hex: "#f5d28b", hexLight: "#f5d28b", hexDark: "#b07a31" },
  hearth: { key: "hearth", name: "Hearth", hex: "#cf8a5c", hexLight: "#e3a983", hexDark: "#8c4f2a" },
  forest: { key: "forest", name: "Forest", hex: "#7da38d", hexLight: "#a8c4b4", hexDark: "#3f6855" },
  dusk:   { key: "dusk",   name: "Dusk",   hex: "#b58fd8", hexLight: "#cdb1e6", hexDark: "#6e4d9b" },
  clay:   { key: "clay",   name: "Clay",   hex: "#d8a18a", hexLight: "#e8bea9", hexDark: "#9a5e47" },
};

export const DEFAULT_VIBE_COLOR: VibeColorKey = "ember";

export function isVibeColorKey(value: unknown): value is VibeColorKey {
  return typeof value === "string" && (VIBE_COLOR_KEYS as readonly string[]).includes(value);
}

export function resolveVibeColor(value: unknown): VibeColor {
  return VIBE_COLORS[isVibeColorKey(value) ? value : DEFAULT_VIBE_COLOR];
}
