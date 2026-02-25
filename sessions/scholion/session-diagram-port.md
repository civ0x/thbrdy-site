# Session: Port Scholion Diagram Prototypes to React Islands

## Situation

The essay "The Circuitry of Science" (`src/content/writing/the-circuitry-of-science.mdx`) has six diagram placeholder tags that need React island components. All six have been prototyped as standalone HTML files in `scholion/prototypes/` with inline CSS, IntersectionObserver scroll-reveal, and `prefers-reduced-motion` compliance. The prototypes are reviewed and approved — they are the ground truth for visual behavior.

The MDX currently uses bare component tags: `<DecompositionPipeline />`, `<ChenDependencyGraph />`, `<SafetyCaseFragment />`, `<SchemaEvolution />`, `<CompetitiveGapTable />`, `<Roadmap />`. These need to resolve to React island components hydrated via `client:visible`.

## Mission

Port the six HTML prototypes to React island components following the site's established island architecture. Each prototype becomes a `Scholion[Name].tsx` file in `src/components/islands/`.

## Porting Order (simple → complex)

1. **CompetitiveGapTable** → `ScholionCompetitiveGap.tsx` — Pure table. Establishes token usage and responsive pattern.
2. **SchemaEvolution** → `ScholionSchemaEvolution.tsx` — Tables + status chips. Tests badge/chip rendering in the token system.
3. **DecompositionPipeline** → `ScholionDecompositionPipeline.tsx` — Vertical flow with connector lines. Tests CSS div connectors in the React context.
4. **Roadmap** → `ScholionRoadmap.tsx` — Timeline with phase cards. Similar connector pattern, different layout.
5. **SafetyCaseFragment** → `ScholionSafetyCaseFragment.tsx` — Graph with popovers. First component requiring popover consolidation (see below).
6. **ChenDependencyGraph** → `ScholionChenDependencyGraph.tsx` — Full dependency graph with popovers + branch bars. Most complex.

Complete each component fully before starting the next. After each, verify `npm run build` passes clean.

## Technical Constraints

These are non-negotiable. Read CLAUDE.md for the full set — highlights here:

- **Naming:** `Scholion[Name].tsx` prefix per DECISIONS.md #005
- **Shared infra:** Import `useInView` from `./shared/useInView.ts`, reference tokens from `./shared/tokens.ts`
- **Responsive:** Injected `<style>` tags with scoped class names (e.g., `scholion-competitive-gap-*`). NOT `useMediaQuery`. See DECISIONS.md #006 and CLAUDE.md "Responsive Pattern" section.
- **CSS tokens:** Prototype hex values must be replaced with `var(--x)` references matching `global.css`. The prototypes use slightly different token names (e.g., `--accent` in prototypes maps to `var(--accent)` in the site — same value `#B8860B` but some dim variants may differ). Cross-reference `global.css` and `tokens.ts`.
- **Typography:** DM Sans for all diagram content, JetBrains Mono for metadata/badges/IDs. Never serif in diagrams. This is already correct in the prototypes — preserve it.
- **No libraries:** No icon libraries, no charting libraries, no tooltip libraries. All inline.
- **`<div>` not `<p>`:** For elements needing custom margins inside islands, use `<div>` to avoid PostLayout specificity conflict (DECISIONS.md #015).
- **Default export:** Each component needs a default export with no required props.
- **Animations:** `prefers-reduced-motion` compliance via `useInView` hook (already handled). Staggered entry delays via CSS `--d` variable pattern from prototypes.

## Popover Consolidation (Components 5 and 6)

The prototypes for SafetyCaseFragment and ChenDependencyGraph implement popovers inline — hover triggers, positioned cards, mobile behavior, dismiss logic. The site already has `Annotation.tsx` (`src/components/islands/shared/`) which handles popovers with viewport-aware positioning, mobile bottom sheets, keyboard accessibility, and one-at-a-time behavior.

**Decision needed:** The diagram popovers show claim details (plain-language explanation + structural significance), not annotation content (term/reference/link). The question is whether to:

(a) **Reuse `Annotation.tsx` internals** — extract the positioning/dismiss logic into a shared hook or wrapper and use it for both annotation popovers and diagram popovers with different content templates. This is the cleaner long-term architecture.

(b) **Keep diagram popovers self-contained** — duplicate the positioning logic in each diagram component. Faster to port, but creates two popover implementations to maintain.

Recommend (a) if `Annotation.tsx` is cleanly separable, (b) if extraction would require significant refactoring. Read `Annotation.tsx` before deciding and document the choice in DECISIONS.md.

## MDX Integration

After all six components are ported, update the essay MDX:

1. Add imports at the top of `the-circuitry-of-science.mdx`:
   ```
   import ScholionCompetitiveGap from '../../components/islands/ScholionCompetitiveGap.tsx'
   import ScholionSchemaEvolution from '../../components/islands/ScholionSchemaEvolution.tsx'
   // ... etc.
   ```

2. Replace bare tags with hydrated components:
   ```
   <ScholionCompetitiveGap client:visible />
   ```

3. The MDX file currently lives in `scholion/the-circuitry-of-science.mdx`. It needs to be copied to `src/content/writing/the-circuitry-of-science.mdx` if not already there. Check first — it may already be at the site location with older content.

## What the Prototypes Contain

Each prototype is a complete standalone HTML file with:
- `:root` CSS custom properties (map to `global.css` tokens)
- Google Fonts loaded (Cormorant Garamond, DM Sans, JetBrains Mono) — in React islands, these are already available from the site's font loading
- A `.component` wrapper with scroll-triggered reveal (opacity/translateY transition)
- IntersectionObserver JS at the bottom — replaced by `useInView` hook in React
- `prefers-reduced-motion` media query — handled by `useInView` in React
- All content data inline — keep inline in React components (no external data files needed)

**Prototype-specific notes:**
- `competitive-gap-table.html` (683 lines): Simple table with colored capability cells. Horizontal scroll on mobile.
- `schema-evolution.html` (460 lines): Two tables (what worked / what didn't) + 6 edge case cards with severity chips.
- `decomposition-pipeline.html` (715 lines): Three-layer vertical flow with CSS div connectors and step descriptions.
- `roadmap.html` (498 lines): Four-phase timeline with gold connector line, success criteria cards, kill condition cards.
- `safety-case-fragment.html` (872 lines): Dependency graph with node hierarchy, typed edges, hover popovers. Uses branch bars for forking paths.
- `chen-dependency-graph.html` (1105 lines): 25-node dependency graph across two chains. Crux badges, typed edge chips, branch bars, hover popovers with claim details. Horizontal scroll container with min-width.

## Verification

After each component:
- [ ] `npm run build` passes clean
- [ ] Component renders with correct typography (DM Sans structural, JetBrains Mono meta)
- [ ] Colors use CSS custom properties, not hardcoded hex
- [ ] Scroll-reveal animation works and respects `prefers-reduced-motion`
- [ ] Responsive: stacks or scrolls horizontally on mobile (≤640px)
- [ ] No new dependencies added to `package.json`

After all six + MDX integration:
- [ ] Essay page renders at `/writing/the-circuitry-of-science/`
- [ ] All six diagrams hydrate on scroll
- [ ] No console errors
- [ ] Build time stays reasonable (< 3s)

## Files to Read

1. `CLAUDE.md` — full site conventions, island architecture, design system
2. `STATUS.md` — current state, existing Scholion islands (6 from the first essay)
3. `src/components/islands/shared/tokens.ts` — available design tokens
4. `src/components/islands/shared/useInView.ts` — scroll-reveal hook interface
5. `src/components/islands/shared/Annotation.tsx` — popover implementation (for consolidation decision)
6. `src/styles/global.css` — canonical CSS custom properties
7. `scholion/prototypes/*.html` — the six prototypes (ground truth)
8. `scholion/DECISIONS.md` — DEC-006 through DEC-010 (diagram visual language, interaction patterns, Toulmin layout)
