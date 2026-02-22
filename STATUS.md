# thbrdy.dev — Migration Status

Last updated: 2026-02-21

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

### Phase 4: Remaining Content

- [ ] Pando essay (source file doesn't exist yet — `pando_research_report.md` is a research report, not an essay)
- [ ] `/now` page content (currently a stub)
- [ ] React interactive components for essays (TODO markers in MDX files)

**Exit criteria:** All essays render. All nav links resolve. Interactive components hydrated where marked.

### Phase 5: Polish (not yet scoped)
- [ ] Self-host fonts (eliminate Google Fonts render-blocking request)
- [ ] Open Graph / social meta tags
- [ ] RSS feed
- [ ] Lighthouse audit + performance pass
- [ ] Potential about page condensation (full CV may be too long — judge after seeing it rendered)

## Current State

Phase 3 complete. Content pipeline operational with 4 essays migrated as MDX. Build produces 8 pages in ~970ms.

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
