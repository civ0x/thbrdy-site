# thbrdy.dev — Migration Status

Last updated: 2026-02-22

## Migration Roadmap

### Phase 1: Scaffold + CI/CD ✅
- [x] Initialize Astro project with React integration (`@astrojs/react`)
- [x] Connect GitHub repo to Cloudflare Pages (auto-deploy on push to main)
- [x] Create directory structure per CLAUDE.md
- [x] Configure content collections with Zod schema validation
- [x] Create CLAUDE.md, STATUS.md, DECISIONS.md
- [x] Place old index.html in `reference/` directory

### Phase 2: Decompose Monolith ✅
Sequential — do NOT parallelize. Use Plan mode.

- [x] Step 1: `src/styles/global.css` — tokens, reset, grain overlay, sacred grid, keyframes, reveal classes, reduced-motion
- [x] Step 2: `src/components/MandalaCanvas.astro` — port canvas JS, recolor blue→gold, reduced-motion guard
- [x] Step 3: `src/components/Nav.astro` — fixed nav bar + mobile hamburger (vanilla JS display toggle)
- [x] Step 4: `src/components/Footer.astro` — mantra, copyright
- [x] Step 5: `src/components/ProjectCard.astro` — props: title, eyebrow, description, tags, href
- [x] Step 6: `src/layouts/Base.astro` — shell with head/fonts/nav/footer/mandala/sacred-grid/scroll-reveal
- [x] Step 7: `src/pages/index.astro` — hero (per CLAUDE.md spec) + 3 project cards
- [x] Step 8: `src/pages/about.astro` — full content from `reference/thomas_brady_cv_v2.md`
- [x] Stub pages: `writing.astro`, `now.astro` — so nav links don't 404

**Exit criteria:** `npm run build` passes (542ms, 4 pages, zero errors). Background is #FAF6F0 everywhere. All 8 roles from CV present on about page. All nav links resolve.

### Phase 3: Content Pipeline ✅

- [x] Install `@astrojs/mdx` integration
- [x] Content collection config (`src/content.config.ts`) with `writing` collection
- [x] Post layout (`src/layouts/PostLayout.astro`)
- [x] Writing index (`src/pages/writing/index.astro`)
- [x] Dynamic route (`src/pages/writing/[...slug].astro`)
- [x] Migrate Notice essay → `src/content/writing/notice.mdx`
- [x] Migrate Scholion essay → `src/content/writing/scholion.mdx`
- [x] Migrate AB essay → `src/content/writing/ab-essay.mdx`
- [x] Migrate Learned Compilation essay → `src/content/writing/learned-compilation.mdx`
- [x] Update homepage project card links
- [x] Update CLAUDE.md URL structure docs
- [x] Update STATUS.md

**Exit criteria:** `/writing` lists 4 essays. Each renders at `/writing/[slug]/`. Build passes (8 pages, zero errors). Interactive component locations marked with TODO comments in MDX.

### Phase 4: Interactive Islands — In Progress

**Island infrastructure validated (Session 0, 2026-02-22):**
- [x] `@astrojs/react` confirmed installed and configured
- [x] Shared utilities extracted to `src/components/islands/shared/`:
  - `tokens.ts` — design tokens referencing CSS custom properties
  - `useInView.ts` — fire-once IntersectionObserver hook, reduced-motion aware
  - `SectionDivider.tsx` — section number + label + rule
  - `PullQuote.tsx` — centered italic quote with scroll fade-in
- [x] Test island hydrated correctly via `client:visible` in MDX
- [x] CLAUDE.md updated with island architecture conventions
- [x] Test artifacts removed

**Session 1 complete (2026-02-22): Absolute Beginners++ islands**
- [x] Responsive pattern chosen: injected `<style>` tags with scoped class names (documented in CLAUDE.md + DECISIONS.md #006)
- [x] `ABConvergenceDiagram.tsx` — 5-framework convergence diagram with desktop table + mobile card layout
- [x] `ABWrongFirstFlow.tsx` — 4-step wrong-first process flow with staggered animation
- [x] MDX updated: SectionDividers (01–05), PullQuote, both islands integrated at correct positions
- [x] Build passes clean (8 pages, 923ms, zero errors)

**Session 2 complete (2026-02-22): Notice essay islands**
- [x] `NoticeCompetitiveGap.tsx` — Venn diagram + 4-column feature comparison grid, inline SVG check/X icons
- [x] `NoticeInteractionFlow.tsx` — 4-step Frame Snap flow with timer-driven sequential reveal, inline SVG icons
- [x] `NoticeArchitectureDiagram.tsx` — Two-tier architecture (on-device/cloud) with hover state, ~11 inline SVG icons, dark code block
- [x] `NoticeBuildTimeline.tsx` — Vertical timeline with 7 milestones, gold→purple gradient line
- [x] MDX updated: SectionDividers (01–06), all four islands integrated at correct positions
- [x] Two TODOs preserved: SnapDepth tiers, EmotionTaxonomy (no reference implementations — deferred)
- [x] Build passes clean (8 pages, 986ms, zero errors)

**Sessions 2f–2r complete (2026-02-22): Venn diagram refinement + ensō header**
- [x] Venn circles shrunk (60%→44%) so labels fit inside container bounds
- [x] Overlap labels repositioned outside circles but inside container
- [x] Category labels centered on circle centers with outward nudge into solo regions
- [x] "Notice" label added to ensō badge in Venn diagram center
- [x] Ensō + "Notice" project icon added to PostLayout.astro (conditional on `connected_project === "Notice"`)
- [x] Ensō image (`public/images/enso-transparent.png`) committed
- [x] Build passes clean (8 pages, ~1s, zero errors)

**Session 3 complete (2026-02-22): Learned Compilation essay islands**
- [x] `LCCouplingDiagram.tsx` — Diamond-layout SVG with 4 decision space nodes, 6 coupling lines with hover hitboxes + evidence detail panel, 4 inline SVG icons
- [x] `LCLandscapeQuadrant.tsx` — Scatter plot with 7 system dots, axis labels, dashed target zone, hover detail panel; Y-axis oriented Learned (top) → Heuristic (bottom)
- [x] `LCNestedClaimsFlow.tsx` — 3 sequential claim cards with timer-driven reveal (600ms intervals), chevron connectors, Kill if / Cheapest test sub-cards, uniform steel blue card styling
- [x] `LCEvidenceGrid.tsx` — 10-row × 3-column data table with colored strength pips, horizontal scroll on mobile, staggered row animation
- [x] `LCStrategicImplications.tsx` — 3-column card grid with inline SVG icons, staggered scroll animation
- [x] MDX updated: SectionDividers (01 The Problem, 02 If It Works, 03 The Landscape, 04 Evidence, 05 Validation, 06 Positioning), PullQuote between sections 02 and 03, all five islands at correct prose positions
- [x] PullQuote redesigned: full-width border replaced with centered 40px gold accent bars (top + bottom)
- [x] Steel blue accent (`#3A7CA5`) as local constants; semantic tokens for decision-space colors
- [x] No lucide-react — all 11 icon types are inline SVGs
- [x] Build passes clean (8 pages, ~1s, zero errors)

**Remaining — essay island porting (Session 4):**
- [ ] Session 4: Scholion (`scholion.mdx`) — visuals TBD

**Other remaining content:**
- [ ] Pando essay (source file doesn't exist yet — `pando_research_report.md` is a research report, not an essay)
- [ ] `/now` page content (currently a stub)

**Exit criteria:** All essays render with interactive components hydrated. All nav links resolve. Build passes clean.

### Phase 5: Polish (not yet scoped)
- [ ] Self-host fonts (eliminate Google Fonts render-blocking request)
- [ ] Open Graph / social meta tags
- [ ] RSS feed
- [ ] Lighthouse audit + performance pass
- [ ] Potential about page condensation (full CV may be too long — judge after seeing it rendered)

## Current State

Phase 4 in progress. Sessions 1–3 complete. AB essay has two islands + SectionDividers + PullQuote. Notice essay has four islands + SectionDividers + ensō header; two deferred (SnapDepth, EmotionTaxonomy). LC essay has five islands + SectionDividers + PullQuote with steel blue accent color. PullQuote shared component redesigned (accent bars instead of border lines). Session 4 (Scholion) remains. Build produces 8 pages in ~1s.

### Phase 3 Notes
- Essays use MDX format (`@astrojs/mdx`) to support future React island embeds
- URL structure: `/writing/[slug]/` (not flat)
- Interactive component locations marked with `{/* TODO: Interactive — ComponentName */}` comments
- Companion JSX prototypes exist in `reference/` (notice-essay-visuals.jsx, ab-essay.jsx, learned-compilation-essay.jsx)
- `>` symbols in MDX escaped as `&gt;` to avoid JSX parsing issues
- Reading time computed from word count in `[...slug].astro`

### Phase 2 Notes
- Google Fonts used for Cinzel, Cormorant Garamond, DM Sans, JetBrains Mono (self-hosting deferred to Phase 5)
- React client bundle (194KB) ships due to `@astrojs/react` integration — will be used when essay interactives are built

## Sources of Truth

| What | Where |
|------|-------|
| Design system | `CLAUDE.md` |
| Content (about page) | `reference/thomas_brady_cv_v2.md` |
| Visual reference (layout/canvas only) | `reference/index.html` |
| Architectural decisions | `DECISIONS.md` |
| Migration status | This file |
