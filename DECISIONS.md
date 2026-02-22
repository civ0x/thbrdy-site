# Decisions

## 001: React islands for interactive essays
**Date:** 2025-02-21
**Decision:** Permit React components hydrated via Astro islands for interactive essay visualizations. All other pages use vanilla JS only.
**Rationale:** Two substantial prototypes (ab-essay.jsx, learned-compilation-essay.jsx) already exist as React. Rewriting to vanilla JS is effort with no user-facing benefit. Astro's partial hydration scopes the React runtime to pages that use it — zero JS ships on pages that don't use React.
**Constraint:** React is only permitted in `src/components/` for essay visualizations. No React in layouts, page chrome, or navigation.

## 002: Unified light-mode palette
**Date:** 2025-02-21
**Decision:** Adopt warm light palette (--bg: #FAF6F0) site-wide. No dark mode.
**Rationale:** The dark Buddhist-cyberpunk aesthetic fought readability. The Scholion essay page proved the warm off-white surface works better for content-heavy pages. The mandala and sacred geometry survive recolored in gold — the identity carries through atmosphere and typography rather than background darkness.
**What this replaces:** Original void-black (#07080D) palette with electric blue (#00C2FF) accents.

## 004: Island shared infrastructure via CSS custom property references
**Date:** 2026-02-22
**Decision:** Island design tokens (`tokens.ts`) reference CSS custom properties as `var(--x)` strings rather than duplicating hex values. Shared utilities (`useInView`, `SectionDivider`, `PullQuote`) live in `src/components/islands/shared/` as TypeScript.
**Rationale:** The three reference `.jsx` prototypes each hardcoded different color palettes (blue in ab-essay, teal in learned-compilation, per-component in notice). Pointing at CSS variables means all islands automatically use the canonical site palette from `global.css`. TypeScript catches prop errors at build time. Shared directory prevents duplicating the same `useInView` hook across every island file.
**Constraint:** No icon libraries (lucide-react was used in prototypes). All icons rebuilt as inline SVG or HTML/CSS.

## 005: Island naming convention
**Date:** 2026-02-22
**Decision:** Essay-specific islands use `[Prefix][ComponentName].tsx` naming (e.g., `ABConvergenceDiagram.tsx`). Prefixes: `AB`, `Notice`, `LC`, `Scholion`.
**Rationale:** Flat directory with prefixes is simpler than nested essay subdirectories while keeping components discoverable. Prefix makes it immediately clear which essay owns a component.

## 003: Cinzel 400 for hero display
**Date:** 2025-02-21  
**Decision:** Use Cinzel at weight 400 with letter-spacing: 0.12em, uppercase, for the hero name only.
**Rationale:** Inscriptional serif at light weight has lapidary quality without heaviness — "stone made light." Pairs naturally with Cormorant Garamond (prose) since both are classically rooted. Replaces CODEINK, which was too brush-stroke/graffiti for the site's actual character.
**Constraint:** Cinzel is scoped exclusively to the hero name. Not for section headings or any other use.
