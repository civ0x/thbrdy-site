# Session: Extend Diagram Screenshots and OG Cards to All Essays

## Situation

The diagram screenshot script (`scripts/screenshot-diagrams.js`) and the diagram OG card compositing code in `scripts/generate-og-images.js` are working but currently scoped to Notice and CoReg essays only. We need to extend both to cover all essays with diagram island components.

Note: the notice-vision page entry at line 63 uses `url: '/notice/'` — this is correct. The notice-vision page is a project page at the site root, not an essay under `/writing/`.

## Mission

1. Add all remaining essays' diagrams to the `PAGES` array in `screenshot-diagrams.js`
2. Add all remaining essays' diagrams to the `DIAGRAM_CARDS` array in `generate-og-images.js`
3. Run `npm run screenshots` to capture all diagrams
4. Run `node scripts/generate-og-images.js` to generate all diagram OG cards

## Complete Diagram Inventory

Below is the full inventory of diagram island components across all essays. Each entry shows the essay slug, page URL, component name, and root CSS selector. These have been verified against the MDX imports and component source files.

### ab-essay (`/writing/ab-essay/`)

| Component | Root selector |
|-----------|--------------|
| ABConvergenceDiagram | `.ab-convergence` |
| ABWrongFirstFlow | `.ab-wrongfirst` |

### notice (`/writing/notice/`) — ALREADY IN SCRIPT

| Component | Root selector |
|-----------|--------------|
| NoticeCompetitiveGap | `.notice-gap` |
| NoticeBuildTimeline | `.notice-timeline` |
| NoticeInteractionFlow | `.notice-flow` |
| NoticeArchitectureDiagram | `.notice-arch` |

### notice-vision (`/notice/`) — ALREADY IN SCRIPT (project page, not under /writing/)

Reuses NoticeCompetitiveGap, NoticeArchitectureDiagram, NoticeInteractionFlow (already captured from `/writing/notice/`). Unique to this page:

| Component | Root selector |
|-----------|--------------|
| NoticeVisionTextureGrid | `.nvtg-root` |
| NoticeVisionLeadTime | `.nvlt-root` |
| NoticeVisionScaffoldingDecay | `.nvsd-root` |
| NoticeVisionExpansionRings | `.nver-root` |
| NoticeVisionTimeline | `.nvtl-root` |

### coregulation (`/writing/coregulation/`) — ALREADY IN SCRIPT

| Component | Root selector |
|-----------|--------------|
| CoRegEvidenceMap | `.coreg-evidence` |
| CoRegPhaseGate | `.coreg-phase` |

### learned-compilation (`/writing/learned-compilation/`)

| Component | Root selector |
|-----------|--------------|
| LCCouplingDiagram | `.lc-coupling` |
| LCLandscapeQuadrant | `.lc-landscape` |
| LCNestedClaimsFlow | `.lc-claims` |
| LCEvidenceGrid | `.lc-evidence` |
| LCStrategicImplications | `.lc-strat` |

### valley-of-death (`/writing/valley-of-death/`)

| Component | Root selector |
|-----------|--------------|
| VoDLegibilityGap | `.vod-legibility-root` |
| VoDSequentialFunnel | `.vod-funnel-root` |
| VoDMaturitySwitch | `.vod-maturity-root` |
| VoDCouplingMechanism | `.vod-coupling-root` |
| VoDCaseComparison | `.vod-case-root` |
| VoDTradingZone | `.vod-trading-root` |

### scholion (`/writing/scholion/`)

| Component | Root selector |
|-----------|--------------|
| ScholionDependencyChain | `.scholion-chain` |
| ScholionToulminDiagram | `.scholion-toulmin` |
| ScholionPositioningGrid | `.scholion-positioning` |
| ScholionPipelineDiagram | `.scholion-pipeline` |
| ScholionValidationTimeline | `.scholion-validation` |
| ScholionCredibilityCards | `.scholion-credibility` |

### the-circuitry-of-science (`/writing/the-circuitry-of-science/`)

| Component | Root selector |
|-----------|--------------|
| ScholionDecompositionPipeline | root class TBD — check component for `ref={ref} className=` pattern |
| ScholionChenDependencyGraph | root class TBD — check component |
| ScholionSafetyCaseFragment | root class TBD — check component |
| ScholionSchemaEvolution | root class TBD — check component |
| ScholionCompetitiveGap | root class TBD — check component |
| ScholionRoadmap | `.scholion-roadmap` |

**Note:** Several `the-circuitry-of-science` components don't follow the `ref={ref} className=` pattern on their root element. Check each component file to find the correct root selector. Some may use a different wrapper pattern — if no `ref` is on the root div, the selector still works for Puppeteer's `waitForSelector`, but verify the element captures the full diagram.

## Changes to `scripts/screenshot-diagrams.js`

### Add new PAGES entries

The notice-vision entry (`url: '/notice/'`) is correct as-is — it's a project page at the root, not under `/writing/`.

Add these entries to the `PAGES` array after the existing coregulation entry:

```js
{
  url: '/writing/ab-essay/',
  diagrams: [
    { selector: '.ab-convergence', name: 'ab-convergence-diagram' },
    { selector: '.ab-wrongfirst', name: 'ab-wrong-first-flow' },
  ],
},
{
  url: '/writing/learned-compilation/',
  diagrams: [
    { selector: '.lc-coupling', name: 'lc-coupling-diagram' },
    { selector: '.lc-landscape', name: 'lc-landscape-quadrant' },
    { selector: '.lc-claims', name: 'lc-nested-claims-flow' },
    { selector: '.lc-evidence', name: 'lc-evidence-grid' },
    { selector: '.lc-strat', name: 'lc-strategic-implications' },
  ],
},
{
  url: '/writing/valley-of-death/',
  diagrams: [
    { selector: '.vod-legibility-root', name: 'vod-legibility-gap' },
    { selector: '.vod-funnel-root', name: 'vod-sequential-funnel' },
    { selector: '.vod-maturity-root', name: 'vod-maturity-switch' },
    { selector: '.vod-coupling-root', name: 'vod-coupling-mechanism' },
    { selector: '.vod-case-root', name: 'vod-case-comparison' },
    { selector: '.vod-trading-root', name: 'vod-trading-zone' },
  ],
},
{
  url: '/writing/scholion/',
  diagrams: [
    { selector: '.scholion-chain', name: 'scholion-dependency-chain' },
    { selector: '.scholion-toulmin', name: 'scholion-toulmin-diagram' },
    { selector: '.scholion-positioning', name: 'scholion-positioning-grid' },
    { selector: '.scholion-pipeline', name: 'scholion-pipeline-diagram' },
    { selector: '.scholion-validation', name: 'scholion-validation-timeline' },
    { selector: '.scholion-credibility', name: 'scholion-credibility-cards' },
  ],
},
{
  url: '/writing/the-circuitry-of-science/',
  diagrams: [
    // Verify selectors by checking each component file for root className
    { selector: '.scholion-roadmap', name: 'scholion-roadmap' },
    // Add remaining after checking root selectors:
    // ScholionDecompositionPipeline, ScholionChenDependencyGraph,
    // ScholionSafetyCaseFragment, ScholionSchemaEvolution, ScholionCompetitiveGap
  ],
},
```

**Important:** Before finalizing the `the-circuitry-of-science` entry, open each of these component files and find the root element's className:
- `ScholionDecompositionPipeline.tsx`
- `ScholionChenDependencyGraph.tsx`
- `ScholionSafetyCaseFragment.tsx`
- `ScholionSchemaEvolution.tsx`
- `ScholionCompetitiveGap.tsx`

Some of these components may not use `ref={ref}` on their root div (they were found to not match the `div ref={ref} className` grep pattern). Verify what the outermost selectable element is for each.

## Changes to `scripts/generate-og-images.js`

Add corresponding entries to the `DIAGRAM_CARDS` array. The `essay` field must match the MDX filename (slug). The `label` is a short human-readable name used in the OG card header.

```js
// ab-essay
{ image: 'ab-convergence-diagram.png', essay: 'ab-essay', label: 'Convergence Diagram' },
{ image: 'ab-wrong-first-flow.png', essay: 'ab-essay', label: 'Wrong-First Flow' },

// learned-compilation
{ image: 'lc-coupling-diagram.png', essay: 'learned-compilation', label: 'Coupling Diagram' },
{ image: 'lc-landscape-quadrant.png', essay: 'learned-compilation', label: 'Landscape Quadrant' },
{ image: 'lc-nested-claims-flow.png', essay: 'learned-compilation', label: 'Nested Claims' },
{ image: 'lc-evidence-grid.png', essay: 'learned-compilation', label: 'Evidence Grid' },
{ image: 'lc-strategic-implications.png', essay: 'learned-compilation', label: 'Strategic Implications' },

// valley-of-death
{ image: 'vod-legibility-gap.png', essay: 'valley-of-death', label: 'Legibility Gap' },
{ image: 'vod-sequential-funnel.png', essay: 'valley-of-death', label: 'Sequential Funnel' },
{ image: 'vod-maturity-switch.png', essay: 'valley-of-death', label: 'Maturity Switch' },
{ image: 'vod-coupling-mechanism.png', essay: 'valley-of-death', label: 'Coupling Mechanism' },
{ image: 'vod-case-comparison.png', essay: 'valley-of-death', label: 'Case Comparison' },
{ image: 'vod-trading-zone.png', essay: 'valley-of-death', label: 'Trading Zone' },

// scholion
{ image: 'scholion-dependency-chain.png', essay: 'scholion', label: 'Dependency Chain' },
{ image: 'scholion-toulmin-diagram.png', essay: 'scholion', label: 'Toulmin Diagram' },
{ image: 'scholion-positioning-grid.png', essay: 'scholion', label: 'Positioning Grid' },
{ image: 'scholion-pipeline-diagram.png', essay: 'scholion', label: 'Pipeline Diagram' },
{ image: 'scholion-validation-timeline.png', essay: 'scholion', label: 'Validation Timeline' },
{ image: 'scholion-credibility-cards.png', essay: 'scholion', label: 'Credibility Cards' },

// the-circuitry-of-science
{ image: 'scholion-roadmap.png', essay: 'the-circuitry-of-science', label: 'Roadmap' },
// Add remaining after selector verification
```

## Constraints

- Do NOT modify any component files or essay MDX files
- Do NOT change the existing Notice/CoReg entries (except fixing the notice-vision URL)
- Verify each `the-circuitry-of-science` component's root selector before adding it
- Image filenames use kebab-case component names (consistent with existing convention)
- If a diagram screenshot fails during `npm run screenshots`, log the error and continue — don't abort

## Verification

- [ ] `npm run screenshots` captures all diagrams across all essays and the notice project page
- [ ] All diagram PNGs appear in `public/images/diagrams/`
- [ ] `node scripts/generate-og-images.js` generates diagram OG cards for all essays
- [ ] Existing essay OG images and quote cards unchanged
- [ ] Diagram OG cards show correct project accent color per essay (gold for Scholion, teal for Notice, blue for Pando)
- [ ] No new runtime dependencies (puppeteer-core is already a devDependency; sharp is already imported)
- [ ] Spot-check at least one diagram card from each essay visually
