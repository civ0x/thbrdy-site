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

## 006: Injected `<style>` tags for island responsive layout
**Date:** 2026-02-22
**Decision:** Islands handle responsive breakpoints via injected `<style>` blocks with scoped class names, not via a `useMediaQuery` React hook.
**Rationale:** CSS media queries apply before React hydrates, eliminating layout flash on first paint. No JS execution needed for responsive behavior. CSS transitions between breakpoints work naturally. Each component is self-contained — no shared responsive utility to maintain. Breakpoints: 640px (tablet), 420px (phone).
**Alternatives considered:** `useMediaQuery` / `useBreakpoint` hook — would cause hydration mismatch if SSR viewport differs from client, requires JS for layout, and doesn't support CSS transitions between breakpoints.

## 007: Conditional project icon in PostLayout
**Date:** 2026-02-22
**Decision:** PostLayout.astro renders an ensō image + "Notice" label above the essay title when `connected_project === "Notice"`. The icon is part of the layout, not the MDX content.
**Rationale:** The project identifier needs to appear above the `<h1>` title, which is rendered by the layout — not reachable from MDX content. Conditional rendering keeps other essays unaffected. The pattern can extend to other projects (Scholion, Pando) by adding additional conditions.
**Constraint:** Project icons are in the layout only. MDX content should not duplicate them.

## 008: Notice essay editorial revisions
**Date:** 2026-02-22
**Decision:** Depersonalize jhana retreat testimonial (remove specific community/person attribution). Expand Barrett paragraph to foreground frame-dependence as a design principle, linking to thbrdy.dev/softmax post.
**Rationale:** The retreat reference should credit the practice, not specific individuals. The Barrett paragraph needed to connect constructed emotion theory to the broader frame-dependence thesis that underpins the product philosophy. The hyperlink to "The Frame-Dependent Mind" creates a cross-reference between essays.

## 009: Per-essay accent colors as local constants
**Date:** 2026-02-22
**Decision:** Essay-specific accent colors live as local constants inside each component file, not in `tokens.ts` or `global.css`. The LC essay uses steel blue (`#3A7CA5`); Notice uses purple/gold. Semantic diagram colors (red, green, blue, teal) use the shared `tokens.*` values.
**Rationale:** Each essay benefits from its own visual identity without polluting the global palette. Local constants make the accent self-contained — if an essay is removed, no global cleanup needed. Semantic tokens are shared because they encode meaning (strong/weak, categories) rather than essay identity.
**Constraint:** Do not add new CSS custom properties for per-essay accents. Do not use `var()` strings with hex-opacity appends (e.g., `${var(--teal)}30`) — this produces invalid CSS. Use pre-computed local constants for opacity variants.

## 010: PullQuote accent bars instead of border lines
**Date:** 2026-02-22
**Decision:** PullQuote uses centered 40px gold accent bars (top and bottom) instead of full-width `borderTop`/`borderBottom`. Bottom margin reduced to 24px.
**Rationale:** Full-width borders stacked visually with SectionDivider horizontal rules, creating double/triple line effects between sections. Short accent bars provide visual punctuation without competing with structural dividers.

## 011: Toulmin diagram vertical flow with inline modifiers
**Date:** 2026-02-22
**Decision:** Redesign the Scholion Toulmin diagram from a spatial grid (6 equal-weight cards) to a vertical flow: dominant Claim card at top with qualifier/rebuttal as inline modifiers, visible connection lines with labels ("supports", "on account of"), Data+Warrant side by side below, Backing aligned under Warrant via a 2-column grid wrapper with empty spacer.
**Rationale:** The original grid layout rendered 6 cards with equal visual weight and no visible connections — relationships were illegible. The Claim must be the center of gravity since everything else relates to it. Qualifier and Rebuttal are modifiers of the Claim, not independent entities — embedding them inside the Claim card reflects their logical role. Visible connector lines with labels make the inferential structure immediately graspable without prior Toulmin knowledge. Grid-based alignment (shared `backing-wrap` class) is more reliable than margin-based positioning for aligning the backing chain.
**Constraint:** Connection lines use CSS divs, not SVG. Layout collapses to single column at ≤640px.

## 012: PullQuote top bar only
**Date:** 2026-02-22
**Decision:** Remove the bottom accent bar from PullQuote. Keep only the top 40px gold bar.
**Rationale:** When a SectionDivider follows immediately after a PullQuote (as in the LC essay between sections 02 and 03), the bottom accent bar stacks visually with the SectionDivider's horizontal rule, creating a double gold line artifact. The top bar provides the visual entry point; the SectionDivider below provides the exit. No bottom bar needed.

## 013: Single dorje favicon
**Date:** 2026-02-22
**Decision:** Use the hero section's single dorje (vajra) as the favicon, with hardcoded gold colors and a 32×32 PNG fallback. SVG-first, PNG fallback for older browsers.
**Rationale:** The single dorje is already the site's identity mark in the hero section. Reusing it as the favicon keeps the identity consistent. The same geometry from the hero SVG (`viewBox="0 0 40 40"`) is used with `stroke-width="2"` (up from 1.5) for legibility at 16×16 display size. Colors hardcoded to `#B8860B` since the favicon can't inherit CSS custom properties. Initially tried a vishvavajra (double dorje) but it was too dense at favicon scale.
**Constraint:** Hand-authored SVG, no generation libraries. No new runtime dependencies (PNG generated via one-time `npx sharp-cli`).

## 003: Cinzel 400 for hero display
**Date:** 2025-02-21  
**Decision:** Use Cinzel at weight 400 with letter-spacing: 0.12em, uppercase, for the hero name only.
**Rationale:** Inscriptional serif at light weight has lapidary quality without heaviness — "stone made light." Pairs naturally with Cormorant Garamond (prose) since both are classically rooted. Replaces CODEINK, which was too brush-stroke/graffiti for the site's actual character.
**Constraint:** Cinzel is scoped exclusively to the hero name. Not for section headings or any other use.

## 015: Use `<div>` instead of `<p>` for island elements with custom margins
**Date:** 2026-02-23
**Decision:** Island components that need custom margins on text-like elements (annotations, captions, etc.) should use `<div>` instead of `<p>` to avoid specificity conflicts with PostLayout prose styles.
**Rationale:** `PostLayout.astro` applies `.post__content :global(p) { margin: 0 0 1.25rem }` to all paragraph elements inside essay content. This has higher specificity than bare class selectors in island injected `<style>` tags, silently overriding component margins. Discovered when `VoDLegibilityGap`'s annotation margin had no visible effect despite correct CSS. Switching from `<p>` to `<div>` sidesteps the specificity conflict entirely.
**Constraint:** Only applies to elements that need non-default margins. Standard `<p>` tags inside islands that are fine with the 1.25rem bottom margin can remain as `<p>`.

## 016: VoD Case Comparison three-column layout with failure case
**Date:** 2026-02-24
**Decision:** Expand VoDCaseComparison from a two-column success comparison (Neptune ML / AstraZeneca) to a three-column layout: success (teal) / failure (red) / success (green). The patronage/LLM case uses the same four-stage pipeline but with "Opportunity Starved" as the final stage, styled in red. The parallels section uses a four-column table (mechanism + three cases) instead of the original bridge-icon layout.
**Rationale:** The essay revision added the Amazon LLM patronage case between Neptune ML and AstraZeneca in Section 05. This case is the essay's most important evidence — the mechanism operating correctly and producing the wrong answer. The diagram needed to show it. Placing the failure case between two successes creates a visual sandwich that makes the contrast immediate. The red semantic color distinguishes the failure without explanation.
**Constraint:** Descriptions shortened across all three columns to prevent text wrapping in the three-column layout. Mobile breakpoint raised from 560px to 720px to stack earlier.

## 017: UTC timezone for date formatting in PostLayout
**Date:** 2026-02-24
**Decision:** Add `timeZone: 'UTC'` to the `toLocaleDateString` call in PostLayout.astro.
**Rationale:** Astro parses frontmatter dates like `date: 2026-02-24` as midnight UTC. Without an explicit timezone, `toLocaleDateString` renders in the build server's local timezone, which rolls dates back one day for any timezone behind UTC. This caused Feb 24 to render as "February 23, 2026."

## 018: Inline annotation system for essays
**Date:** 2026-02-24
**Decision:** Essays support inline annotations — hover/tap popovers attached to dashed-underlined terms. Three modes: term definitions, reference summaries, and enriched links. All annotation content is static, stored in a companion YAML file per essay (`[slug].annotations.yaml` alongside the MDX). No runtime API calls.
**Rationale:** Dense essays (Valley of Death, Scholion) reference domain-specific vocabulary, academic papers, and external resources that readers may not know. Inline annotations surface context at the point of need without breaking reading flow. The companion-file approach keeps MDX prose clean and makes the annotation layer a separable concern — diffable, batch-generatable, and reusable across essays.
**Design:**
- **Visual pattern:** `1.5px dashed var(--accent)` bottom border on annotated terms. Popover on hover (desktop) or tap (mobile) with `var(--bg-warm)` card, subtle border and shadow. Only one popover open at a time.
- **Term definitions:** Short (1–3 sentence) author-written definitions. Popover shows mode badge, term name (DM Sans bold), definition text (DM Sans regular).
- **Reference summaries:** AI-generated at authoring time, author-reviewed. Popover shows title (italic), authors/year (JetBrains Mono), summary, contextual "In this essay" note, and link to the source artifact (paper, book, report).
- **Enriched links:** Author-curated metadata for external URLs. Popover shows URL, title, source, summary, and "Visit page →" CTA. Link annotations use `var(--teal)` instead of `var(--accent)`.
- **Typography:** All popover content in DM Sans (structural, not prose). Mode badges and metadata in JetBrains Mono. Line-height 1.4–1.45 (tighter than body prose).
- **Mobile:** Popovers render as bottom sheets with semi-transparent backdrop. Tap-outside to dismiss. First tap on link annotations opens popover; second tap navigates.
- **Accessibility:** `role="tooltip"`, `aria-describedby`, keyboard navigation (Enter/Space to toggle, Escape to dismiss), `tabindex="0"` on triggers.
**Content architecture:** Annotations defined in `src/content/writing/[slug].annotations.yaml` with `terms`, `references`, and `links` sections. A remark plugin resolves explicit markers in MDX against the YAML data. Explicit markers preferred over pattern-matching for author control over which occurrences get annotated.
**Reference summary workflow:** Author adds reference metadata to YAML → agent generates summary and context fields → author reviews/edits → ships as static data. No runtime LLM calls.
**Component:** `Annotation.tsx` in `src/components/islands/shared/` — cross-essay infrastructure, not essay-specific.
**Constraint:** No external tooltip/popover libraries. No runtime API calls for content. Respects `prefers-reduced-motion`. Prototype: `prototype-annotations.html` in project root.

## 014: @resvg/resvg-js for OG image generation
**Date:** 2026-02-22
**Decision:** Use `@resvg/resvg-js` as a devDependency for generating the default Open Graph image (1200×630 PNG) from an SVG template. One-shot script in `scripts/generate-og-image.js`, not a build step.
**Rationale:** Alternatives (Puppeteer, Playwright) require a full headless browser — heavy dependency, slow execution, non-deterministic rendering. `@resvg/resvg-js` is a Rust-based SVG renderer compiled to WASM: deterministic output, fast execution, small footprint (~5MB devDependency), no browser required. The OG image is static (same for all pages), so a one-shot generation script is simpler and more reliable than build-time generation.
**Constraint:** `@resvg/resvg-js` is devDependency only — zero runtime impact. The generated PNG ships as a static asset in `public/images/`. System fonts used in the SVG (Georgia, Courier New) since embedding web fonts into resvg adds complexity with no meaningful visual difference at OG preview sizes.
