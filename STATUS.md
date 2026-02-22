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

### Phase 3: Content Pipeline
Can use parallel worktrees (one branch per task).

- [ ] **Worktree A:** Content collection config + post layout template + `/writing` index page
- [ ] **Worktree B:** Migrate Notice post (`notice-post-draft-v4.md` → `src/content/posts/notice-interoception.md`)
- [ ] **Worktree C:** Migrate Scholion essay pages — preserve existing HTML/JS verbatim, mount at `/projects/scholion/`

**Exit criteria:** `/writing` page lists posts. Notice post renders at `thbrdy.dev/notice-interoception/`. Scholion pages work at existing URLs.

### Phase 4: Remaining Content
Fully parallel — each essay gets its own worktree.

- [ ] AB essay v3 (`ab_essay_v3.md`)
- [ ] Learned compilation essay v2 (`learned-compilation-essay-v2.md`)
- [ ] Pando research report (`pando_research_report.md`)
- [ ] `/now` page (draft from scratch)

**Exit criteria:** All essays render. All nav links resolve (no 404s except `/now` if deferred).

### Phase 5: Polish (not yet scoped)
- [ ] Self-host fonts (eliminate Google Fonts render-blocking request)
- [ ] Open Graph / social meta tags
- [ ] RSS feed
- [ ] Lighthouse audit + performance pass
- [ ] Potential about page condensation (full CV may be too long — judge after seeing it rendered)

## Current State

Phase 2 complete. All 10 files created, build passing. Ready for Phase 3 (Content Pipeline).

### Phase 2 Notes
- Google Fonts used for Cinzel, Cormorant Garamond, DM Sans, JetBrains Mono (self-hosting deferred to Phase 5)
- React client bundle (194KB) ships due to `@astrojs/react` integration — no React components exist yet, so this is dead weight until essay interactives are built; could be removed temporarily
- Content collection auto-generation warning present (no posts in `src/content/posts/` yet — resolved in Phase 3)
- Writing and Now pages are stubs with section headers only — content comes in Phases 3–4

## Sources of Truth

| What | Where |
|------|-------|
| Design system | `CLAUDE.md` |
| Content (about page) | `reference/thomas_brady_cv_v2.md` |
| Visual reference (layout/canvas only) | `reference/index.html` |
| Architectural decisions | `DECISIONS.md` |
| Migration status | This file |
