# thbrdy.dev — Migration Status

Last updated: 2026-02-25

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

### Phase 4: Interactive Islands ✅

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

**Session 4 complete (2026-02-22): Scholion essay islands**
- [x] `ScholionDependencyChain.tsx` — RSP 4-level dependency chain with red foundation node, arrow labels, staggered reveal
- [x] `ScholionToulminDiagram.tsx` — Toulmin structure anatomy with AI safety example (designed from scratch), vertical flow layout with Claim dominant at top, inline qualifier/rebuttal modifiers, visible connection lines and labels
- [x] `ScholionPositioningGrid.tsx` — 6×5 capability comparison table with colored cell states, Scholion row highlighted, legend footer
- [x] `ScholionPipelineDiagram.tsx` — 4-stage extraction pipeline, dark background, schema output per stage, critical gap callout
- [x] `ScholionValidationTimeline.tsx` — 3 nested claims with timeline progress line, green validated / red killed criteria cards
- [x] `ScholionCredibilityCards.tsx` — 2×2 career highlights grid with staggered reveal
- [x] MDX integration: SectionDividers (01–06), 2 PullQuotes, all 6 islands at correct positions, both TODOs removed

**Sessions 4a–4b complete (2026-02-22): Toulmin diagram redesign + alignment fix**
- [x] Toulmin diagram completely redesigned: Claim card full-width with 2px gold border, qualifier/rebuttal as inline modifiers inside Claim, vertical connector lines with "supports" and "on account of" labels, Data+Warrant side by side, Backing aligned under Warrant
- [x] "on account of" connector and Backing card aligned via shared 2-column grid wrapper (DECISIONS.md #011)
- [x] Build passes clean (8 pages, ~1s, zero errors)

**Session 3f complete (2026-02-22): PullQuote bottom bar removal**
- [x] Removed bottom accent bar from PullQuote shared component (top bar only)
- [x] Eliminates double gold line artifact when PullQuote precedes SectionDivider
- [x] All essays using PullQuote (AB, LC, Scholion) render correctly

**VoD essay islands created (2026-02-23):**
- [x] `VoDLegibilityGap.tsx` — Two-column research/product vocabulary with SVG bridge reveal, mobile stacked pair cards
- [x] `VoDSequentialFunnel.tsx` — Side-by-side sequential vs diamond dependency graph, ghost edges showing hidden connections
- [x] `VoDMaturitySwitch.tsx` — Gradient maturity bar with switching point, risk callouts, zone cards (essay's key diagram)
- [x] `VoDCouplingMechanism.tsx` — Central document card with cardinal domain positions, SVG constraint edges, interpretation cards
- [x] `VoDCaseComparison.tsx` — Dual horizontal timelines (AWS/AZ) with structural parallels, 6× badges
- [x] `VoDTradingZone.tsx` — Scatter quadrant with org positions, trajectory arrows, risk zones, trading zone highlight
- [x] Build passes clean (9 pages, ~1.2s, zero errors)
- [x] MDX essay file creation + island integration (`valley-of-death.mdx` with all 6 islands, 7 SectionDividers, 2 PullQuotes)

**VoD essay revision — patronage case, PR/FAQ protocol, diagram updates (2026-02-24):**
- [x] Revision 1: Clarified PR/FAQ as cross-functional protocol vs. single-author artifact (Section 04), with two degraded forms
- [x] Revision 2: Added Amazon LLM patronage funding case study to Section 05 — 30 HC, $15M compute, patronage model shaping science, Anthropic investment hedge named explicitly
- [x] Revision 3: Expanded Fraunhofer 30/70 discussion (Section 07), added research engineer qualification (Section 06)
- [x] `VoDCaseComparison.tsx` updated: three-column layout (Neptune ML success / LLM patronage failure / AstraZeneca success), red failure column, updated parallels table and callout
- [x] `VoDMaturitySwitch.tsx` updated: added Amazon LLM case at position 30 (protect), total cases 9→10, best possible 7→8
- [x] Fixed UTC timezone bug in `PostLayout.astro` date formatting (dates were rendering one day behind)
- [x] Essay date updated to 2026-02-24
- [x] Build passes clean (10 pages, ~2s, zero errors)

**VoD LegibilityGap fix (2026-02-23):**
- [x] Replaced SVG bridge overlay with CSS Grid layout — bridges are now regular grid cells between node columns, eliminating all coordinate/scaling issues
- [x] Fixed node text alignment (center-aligned), node height consistency (`min-height: 54px`), connector centering
- [x] All four bridges visible and vertically centered on node pairs at any viewport width
- [x] Fixed annotation margin override: `PostLayout.astro`'s `:global(p)` was overriding island `<p>` margins; changed annotation to `<div>` (DECISIONS.md #015, CLAUDE.md updated)
- [x] Build passes clean (10 pages, ~1.2s, zero errors)

**Co-regulation essay islands + publish (2026-02-23):**
- [x] `CoRegEvidenceMap.tsx` — Three-tier evidence gradient (Well-Established/Promising but Limited/Missing) with green/gold/red color coding, research node cards with decreasing visual weight, sparse bottom row, staggered scroll animation
- [x] `CoRegPhaseGate.tsx` — 4-phase vertical pipeline with 3 go/kill gate nodes, phase weight decreasing (opacity + dashed borders), green/red split gate cards, responsive stacking
- [x] MDX integration: imports added, EvidenceMap placed in section 02, PhaseGate placed in section 04
- [x] Essay published (`draft: false`)
- [x] Build passes clean (9 pages, ~1s, zero errors)

**Annotation system (2026-02-24):**
- [x] `Annotation.tsx` shared island component — three modes (term/reference/link), desktop hover popovers, mobile bottom-sheet, viewport-aware positioning, keyboard accessible, reduced-motion aware
- [x] `remark-annotations.mjs` remark plugin — resolves `[[mode:key|text]]` markers in MDX against companion YAML at build time, auto-injects Annotation import
- [x] `valley-of-death.annotations.yaml` companion file — 17 term definitions, 20 reference summaries, 1 enriched link
- [x] 38 annotation markers placed in `valley-of-death.mdx` (first substantive use of each term/reference)
- [x] `js-yaml` added as devDependency (build-time only, no runtime impact)
- [x] `astro.config.mjs` updated to register remark plugin
- [x] Build passes clean (10 pages, ~1.2s, zero errors)

**Circuitry of Science essay islands (2026-02-24):**
- [x] `ScholionCompetitiveGap.tsx` — 5×6 capability comparison table with colored status indicators (full/partial/none), Scholion column highlighted, horizontal scroll on mobile with sticky first column, staggered row animation
- [x] `ScholionSchemaEvolution.tsx` — Three-section card (What Worked / Fields Added / Edge Cases) with color-coded headers (teal/accent/blue), status/severity chips, staggered field row animation
- [x] `ScholionDecompositionPipeline.tsx` — Three-stage vertical pipeline (Atomic Decomposition → Toulmin Reveal → Dependency Typing) with source text block, CSS div connectors, mini dependency graph in stage 3, staggered stage animation
- [x] `ScholionRoadmap.tsx` — Four-phase timeline with color-coded dots/cards (teal/accent/blue/red), success criteria and kill condition sub-cards, dependency arrows, staggered phase reveal
- [x] `ScholionSafetyCaseFragment.tsx` — Safety case dependency graph with 4 pillars, implicit warrant node, 4 invalidation conditions, popovers with claim details + structural significance, legend
- [x] `ScholionChenDependencyGraph.tsx` — 25-node dependency graph across two chains (Mortality Predictors / Symptom Chronology), grouped UV→MV block, confidence-based opacity, annotator-synthesized node, popovers with clinical/argument dot categorization
- [x] `DiagramPopover.tsx` + `useDiagramPopover` hook — shared popover infrastructure for diagram nodes (desktop hover + click, mobile bottom sheet, keyboard accessible, one-at-a-time). Decision documented in DECISIONS.md #016.
- [x] MDX integration: all 6 islands wired with `client:visible` hydration
- [x] Build passes clean (11 pages, ~1.16s, zero errors)
- [x] No new dependencies added

**Other remaining content:**
- [ ] Pando essay (source file doesn't exist yet — `pando_research_report.md` is a research report, not an essay)
- [x] `/now` page content — first entry ("What Is Code?" rebuild), weekly-update convention established

**Exit criteria:** All essays render with interactive components hydrated. All nav links resolve. Build passes clean.

### Phase 5: Polish (not yet scoped)
- [ ] Self-host fonts (eliminate Google Fonts render-blocking request)
- [x] Open Graph / social meta tags
- [x] Inline annotation system (VoD essay; infrastructure reusable for other essays)
- [x] Per-essay OG images — Tier 1 (session prompt: `session-og-tier1.md`)
- [x] Pull quote share cards — Tier 2 (session prompt: `session-og-tier2.md`, depends on Tier 1)
- [x] Fix Twitter card rendering on quote share pages (JS redirect instead of meta refresh)
- [x] Add `twitter:site` meta tag (@thbrdy)
- [ ] RSS feed
- [ ] Lighthouse audit + performance pass
- [ ] Potential about page condensation (full CV may be too long — judge after seeing it rendered)

## Current State

Phase 4 complete, Phase 5 in progress. Per-essay OG images + per-quote card images generated at build time via `prebuild` hook (`scripts/generate-og-images.js` → `public/images/og/[slug].png` + `[slug]-quote-[n].png`). PullQuote share bar: X/Twitter intent + copy-link with checkmark feedback. Quote share target pages at `/writing/[slug]/quote/[n]/` with quote-specific OG meta tags and JS redirect to parent essay (crawlers don't execute JS, so they read the quote-specific OG tags). `twitter:site` meta tag set to @thbrdy. 7 quote cards across 5 essays. Fonts: Cormorant Garamond SemiBold + Italic, JetBrains Mono Regular in `scripts/fonts/`. Seven published essays have interactive islands. AB essay: 2 islands. Notice essay: 4 islands + ensō header; two deferred. LC essay: 5 islands. Scholion essay: 6 islands. CoRegulation essay: 2 islands. VoD essay: 6 islands + 38 inline annotations. Circuitry of Science essay: 6 islands (CompetitiveGap, SchemaEvolution, DecompositionPipeline, Roadmap, SafetyCaseFragment, ChenDependencyGraph) + inline annotations; two diagram components use shared DiagramPopover infrastructure for node-level popovers. Annotation system infrastructure (`Annotation.tsx`, `remark-annotations.mjs`, companion YAML pattern) is reusable for other essays. `/now` page populated with first dated entry. Build produces 11 pages in ~1.2s.

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
