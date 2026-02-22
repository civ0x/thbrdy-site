/**
 * Design tokens for React island components.
 *
 * These reference the CSS custom properties defined in global.css.
 * Using `var(--x)` strings lets islands stay in sync with the site palette
 * without duplicating hex values.
 */

export const tokens = {
  // Backgrounds
  bg: "var(--bg)",
  bgWarm: "var(--bg-warm)",
  bgCard: "var(--bg-card)",
  bgDark: "var(--bg-dark)",
  bgDarkMid: "var(--bg-dark-mid)",

  // Borders
  border: "var(--border)",
  borderMid: "var(--border-mid)",

  // Text
  text: "var(--text)",
  textMid: "var(--text-mid)",
  textLight: "var(--text-light)",
  textMuted: "var(--text-muted)",
  textFaint: "var(--text-faint)",

  // Accent
  accent: "var(--accent)",
  accentDim: "var(--accent-dim)",
  accentGlow: "var(--accent-glow)",

  // Semantic (diagrams only)
  red: "var(--red)",
  redDim: "var(--red-dim)",
  green: "var(--green)",
  greenDim: "var(--green-dim)",
  blue: "var(--blue)",
  blueDim: "var(--blue-dim)",
  teal: "var(--teal)",
  tealDim: "var(--teal-dim)",

  // Font stacks
  serif: "'Cormorant Garamond', serif",
  sans: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
  display: "'Cinzel', serif",
} as const;

export type Tokens = typeof tokens;
