# Session: Scholion Essay 2 — "The Circuitry of Science" (Part 2: Interactive Diagram Specs)

**Date created:** 2026-02-24
**Status:** Ready for execution
**Kickoff:** Read `CLAUDE.md`, this file, and the essay draft from Part 1, then implement.
**Part 1:** `session-scholion-essay-v2-prose.md` (essay prose — separate session, should be completed first)

---

## Context

This session produces detailed implementation specs for six interactive diagrams embedded in the essay "The Circuitry of Science." The essay draft (Part 1) marks insertion points with component tags matching the names below. Each diagram is an Astro React island component following the existing thbrdy.dev architecture.

Read these files for data and design context:

- `scholion/CLAUDE.md` — project guidelines and schema documentation
- `scholion/schema.yaml` — the annotation template (v0.2, 17 fields per claim)
- `scholion/extractions/chen2025-mortality-predictors.yaml` — 14-claim mortality extraction
- `scholion/extractions/chen2025-symptom-chronology.yaml` — 11-claim chronology extraction
- `scholion/extractions/chen2025-schema-failures.yaml` — 6 documented schema failures
- `scholion/literature-scan-feb2026.md` — competitive landscape (for gap table data)
- The original essay at thbrdy.dev/writing/scholion/ — for existing design system reference

---

## Design System Constraints

All diagrams follow the existing thbrdy.dev design system:

- **Typography:** Serif for prose (the author's voice), sans-serif for structural elements (diagram labels, metadata, UI controls)
- **Layout:** CSS-only layout, no external charting or animation libraries
- **Animation:** Intersection observer for scroll-triggered reveals. CSS transitions for state changes. Respect `prefers-reduced-motion` — all animations degrade to instant state changes
- **Tokens:** Design tokens in `shared/tokens.ts`. Use existing color palette, spacing scale, and breakpoints
- **Islands:** Each diagram is a React island component hydrated via Astro's `client:visible` directive
- **Accessibility:** All interactive elements keyboard-navigable. ARIA labels on graph nodes. Color is never the sole encoding — use shape, label, or pattern as redundant channel

---

## Diagram 1: The Decomposition Pipeline

**Component name:** `<DecompositionPipeline />`
**Essay section:** II (What Scholion Does)
**Purpose:** Show a sentence from the Chen paper being decomposed through all three methodology layers. The reader watches prose become structure.

### Data

Source sentence: The AST/ALT ratio claim from Chen et al.:
> "The AST/ALT ratio ≥ 2 was an independent predictor of mortality (HR 11.052, 95% CI 1.4–84.8, p = 0.021)"

**Stage 1 — Raw prose:** The full sentence as it appears in the paper.

**Stage 2 — Atomic decomposition:** Split into the atomic proposition:
- claim_id: `mortality.12`
- atomic_proposition: "AST/ALT ratio ≥ 2 is an independent predictor of mortality in COVID-19-induced AP"
- Statistical values extracted: HR 11.052, CI 1.4–84.8, p = 0.021

**Stage 3 — Toulmin reveal:** Show each Toulmin field appearing around the atomic claim:
- warrant: "The De Ritis ratio (AST/ALT ≥ 2) indicates hepatocellular damage severity; in the context of COVID-19-induced AP, this reflects multi-organ involvement predictive of mortality"
- warrant_type: implicit
- backing: Cox proportional hazards regression methodology; De Ritis ratio clinical interpretation
- qualifier: "COVID-19-induced (not coincident) AP patients; single-center retrospective cohort"
- rebuttal: "Wide CI (1.4–84.8) suggests imprecise estimation; result may not replicate in larger cohorts"

**Stage 4 — Dependency graph fragment:** Show mortality.12 as a node with typed edges:
- depends_on: mortality.9 (multivariate regression context) — conditional
- depends_on: method.3 (Cox regression methodology) — conditional
- depends_on: method.1 (inclusion criteria) — conditional (transitive via mortality.9)
- crux: false (it's a leaf finding, not load-bearing for downstream claims)

### Interaction Behavior

Four-step animated progression. User controls via:
1. **Auto-play on scroll:** When the component enters the viewport, begin the four-step animation with 1.5s pauses between stages. Each stage builds on the previous — elements don't disappear.
2. **Step controls:** Four numbered buttons (1–4) below the diagram. Clicking a button jumps to that stage. Active stage highlighted.
3. **Reduced motion:** If `prefers-reduced-motion`, show all four stages simultaneously in a vertical layout (pipeline view) with no animation.

### Visual Design

- Stage 1: Prose text in serif font, highlighted span for the key clause
- Stage 2: The atomic proposition appears below in a card with sans-serif label "Atomic Proposition." Statistical values pulled out into tagged chips (HR, CI, p)
- Stage 3: Toulmin fields appear as labeled cards arranged around the central claim. Warrant card is visually emphasized (slightly larger, accent border) because it's the highest-value extraction target
- Stage 4: Graph fragment with the claim as a node and dependency edges drawn to named parent nodes. Edges color-coded by dependency type. Node shapes: rounded rectangle for claims, hexagon for method claims

### Dimensions

- Full width of content column (max ~720px)
- Height: ~400px at stage 4 (grows as stages build)
- Responsive: stacks vertically on mobile (<640px)

---

## Diagram 2: The Chen Dependency Graph

**Component name:** `<ChenDependencyGraph />`
**Essay section:** III (The Medical Demonstration)
**Purpose:** The full 25-claim graph with both argument chains. This is the money shot — the reader sees invalidation propagation in action.

### Data

All 25 claims from both extraction files, organized into two subgraphs:

**Mortality predictors chain (14 claims):**
- method.1, method.2, method.3 (foundation)
- mortality.1 through mortality.14
- Tree structure rooted at method.1

**Symptom chronology chain (11 claims):**
- Cross-references method.1, method.2 (shared foundation — no duplication)
- chronology.1 through chronology.11
- chronology.9 is annotator-synthesized (visually distinct)

**Edge data:** Extract `depends_on` and `dependency_type` from each claim to build the edge list. Five edge types with distinct colors:
- causal — warm red
- conditional — blue
- purposive — green
- contrastive — amber/orange
- conjunctive — purple

**Crux nodes:** Identify all claims with `crux: true`. These get a visual indicator (thicker border, icon, or glow).

### Interaction Behavior

1. **Default state:** Full graph visible. Nodes labeled with short IDs (e.g., "M.12" for mortality.12). Edges drawn with dependency type colors. Legend visible.

2. **Hover on node:** Tooltip shows the atomic_proposition text and key Toulmin fields (warrant, qualifier). Edges to/from the hovered node are emphasized; others dim.

3. **Click to select:** Clicking a node selects it. Selection panel shows full claim details (all schema fields).

4. **Invalidation cascade — method.1:** A prominent button labeled "What if the inclusion criteria are wrong?" When clicked:
   - method.1 turns red (status: OUT)
   - All transitively dependent nodes cascade to red, animated with a propagation delay (each "hop" in the graph takes 200ms)
   - The entire graph goes red — both chains depend on method.1
   - A counter shows "25/25 claims affected"
   - Reset button appears

5. **Invalidation cascade — method.3:** A second button: "What if the Cox regression is flawed?"
   - method.3 turns red
   - Only the mortality chain cascades — the chronology chain uses Kaplan-Meier (method.2), not Cox
   - Counter shows "~14/25 claims affected" (exact count from dependency traversal)
   - The chronology subgraph remains intact — this IS the point. Different method, different failure boundary.

6. **Reduced motion:** Cascades happen instantly (no propagation animation). All other interactions preserved.

### Layout Algorithm

Use a layered/hierarchical layout (Sugiyama-style):
- Method claims (method.1, method.2, method.3) at the top
- Claims arranged in layers by dependency depth
- Two visually distinct columns/clusters for the two argument chains
- Shared foundation nodes (method.1, method.2) centered between clusters
- Edges route downward (parent → child)

Implementation: Pre-compute layout positions in the component's data file (not a runtime graph layout library). The graph is small enough (25 nodes) that manual/semi-automatic positioning is feasible and produces better results than force-directed layout.

### Visual Design

- Nodes: Rounded rectangles, ~120px wide. Background white, border colored by argument chain (mortality = one hue, chronology = another). Crux nodes have thicker/accent border.
- Edges: Thin lines (1.5px), colored by dependency type. Arrowheads on the dependent end.
- Invalidated nodes: Red background with white text. Transition: 300ms ease.
- Selected node: Elevated shadow, expanded detail panel slides in from the side (or below on mobile).
- Legend: Small legend in the corner showing edge type colors and node symbols.

### Dimensions

- Full width of content column, aspect ratio ~16:10
- Height: ~500–600px
- Mobile: Horizontal scroll with a hint indicator, or a zoomed-out overview with tap-to-zoom

---

## Diagram 3: The Safety Case Fragment

**Component name:** `<SafetyCaseFragment />`
**Essay section:** IV (The Safety Case Application)
**Purpose:** Show invalidation propagation in a safety case context. Brief and illustrative — not a real safety case.

### Data

A simplified safety case argument (5–7 nodes):

```
top_claim: "Model X is safe to deploy at capability level Y"
  ├── subclaim_1: "Model X cannot autonomously acquire resources" (inability argument)
  │     └── evidence_1: "Evaluations show <1% success rate on resource acquisition tasks"
  ├── subclaim_2: "Model X's outputs are interpretable to human reviewers"
  │     └── evidence_2: "Interpretability study Z found feature X maps to concept Y with 85% fidelity"
  └── subclaim_3: "Monitoring system detects anomalous behavior within N minutes"
        └── evidence_3: "Red team exercises achieved detection within SLA 95% of the time"
```

**Dependency types:**
- top_claim depends on subclaim_1, subclaim_2, subclaim_3 — conjunctive (all three required)
- Each subclaim depends on its evidence — conditional

### Interaction Behavior

1. **Default state:** Clean tree layout, all nodes green/neutral (status: IN).

2. **Invalidation trigger:** A button: "New interpretability finding challenges Study Z." When clicked:
   - evidence_2 turns red (new finding contradicts it)
   - subclaim_2 cascades to red (lost its evidential support)
   - top_claim cascades to red (conjunctive dependency — one leg fails, top fails)
   - subclaim_1 and subclaim_3 remain green — they're unaffected
   - Annotation appears: "The safety case requires all three legs. One broken dependency compromises the whole argument."

3. **Reset button** restores default state.

### Visual Design

- Use Goal Structuring Notation (GSN)-inspired shapes: rectangles for claims, circles for evidence, parallelogram for context/assumptions
- Cleaner and more minimal than the Chen graph — this is an illustration, not a data visualization
- Same color system for invalidation (green → red cascade)

### Dimensions

- Content column width, ~300px height
- Simple enough to render well on mobile without horizontal scroll

---

## Diagram 4: Schema Evolution

**Component name:** `<SchemaEvolution />`
**Essay section:** V (What the Extraction Revealed)
**Purpose:** Show the v0.1 → v0.2 schema changes concretely. A diff-like visualization for a single claim.

### Data

Use mortality.12 (AST/ALT ratio) as the example claim. Show the claim in v0.1 format (14 fields), then highlight the three new v0.2 fields appearing:

- `confidence: medium` (wide CI despite significant p)
- `external_anchor_type: foundational` (Cox methodology is foundational, not contextual)
- `claim_source: author_explicit` (directly stated in paper)

### Interaction Behavior

1. **Toggle view:** Two tabs or a toggle switch — "v0.1" and "v0.2"
2. **v0.1 view:** All 14 original fields displayed. Clean, readable.
3. **v0.2 view:** Same 14 fields plus three new fields highlighted with a green "added" indicator (similar to a git diff `+` line). Brief annotation for each new field explaining what it captures.
4. **No animation required** — instant switch between views is fine.

### Visual Design

- Code-block aesthetic (monospace font, dark background) for the claim fields
- New fields marked with a green left-border and `+` indicator
- Each new field has a one-line annotation in sans-serif explaining the addition
- Compact — this is a supporting illustration, not a centerpiece

### Dimensions

- Content column width, ~350px height
- Works on mobile without modification

---

## Diagram 5: The Competitive Gap Table

**Component name:** `<CompetitiveGapTable />`
**Essay section:** VI (The Competitive Landscape)
**Purpose:** Interactive version of the gap analysis table from the literature scan.

### Data

Direct from `literature-scan-feb2026.md`, Section 7:

| Capability | Elicit | Semantic Scholar | scite.ai | ORKG | Safety Case Templates | **Scholion** |
|---|---|---|---|---|---|---|
| Paper discovery | Yes | Yes | Yes | Yes | No | No |
| Structured data extraction | Yes | No | No | Partial | No | No |
| Citation graph | No | Yes | Yes | Partial | No | No |
| Citation context (support/contradict) | No | No | Yes | No | No | No |
| Claim-level decomposition | No | No | No | No | Partial (manual) | **Yes** |
| Typed dependency relationships | No | No | No | No | No | **Yes** |
| Warrant extraction | No | No | No | No | No | **Yes** |
| Crux identification | No | No | No | No | Partial (manual) | **Yes** |
| Invalidation propagation | No | No | No | No | No | **Yes** |
| Cross-document claim linking | No | No | Partial | Partial | No | **Planned (Phase 3)** |

### Interaction Behavior

1. **Default state:** Full table visible. Top four rows slightly muted (these are established capabilities). Bottom five rows are Scholion's territory — visually emphasized.

2. **Hover on row:** Row highlights. Brief tooltip or inline expansion explaining what the capability means. For example, hovering "Warrant extraction" shows: "Surfacing the implicit reasoning connecting evidence to conclusion — the unstated assumptions that make an argument vulnerable."

3. **Hover on cell:** For "Partial" cells, tooltip explains the qualification. For example, scite.ai's "Partial" on cross-document linking: "Classifies citation context as support/contradict/mention, but at the citation level, not the claim level."

4. **Column highlight:** Clicking a column header highlights that tool's column, dimming others. Makes it easy to see one tool's coverage profile.

### Visual Design

- Clean table with thin borders. Sans-serif throughout (this is structural/data content).
- "Yes" cells: checkmark icon, green tint
- "No" cells: empty or light dash, neutral
- "Partial" cells: half-filled indicator, amber tint
- Scholion column: slightly wider, bold header, accent color border
- Bottom five rows: subtle background tint to visually group Scholion's distinctive territory

### Dimensions

- Full content column width. Horizontal scroll on mobile with sticky first column (capability names).
- Height: auto (table height)

---

## Diagram 6: The Roadmap

**Component name:** `<Roadmap />`
**Essay section:** VII (Where This Goes)
**Purpose:** Phased timeline with kill criteria marked. Not a Gantt chart — a dependency-aware view showing what gates what.

### Data

Four phases with dependencies:

**Phase 1: Manual Annotation Corpus**
- Task: 3-5 papers across domains, manual extraction, inter-annotator agreement
- Gate: κ ≥ 0.7 on dependency typing
- Kill criterion: If inter-annotator agreement is too low, the schema doesn't carve arguments at the joints
- Dependencies: None (current phase)

**Phase 2: LLM Extraction Pipeline**
- Task: Automated extraction benchmarked against manual ground truth
- Gate: F1 ≥ 0.8 on atomic proposition extraction; F1 ≥ 0.6 on dependency typing
- Kill criterion: If extraction quality is too poor, LLMs can't do the task
- Dependencies: Phase 1 (needs ground truth corpus)

**Phase 3: Graph Infrastructure**
- Task: Storage layer, invalidation propagation engine, cross-document linking
- Gate: Propagation correctness on synthetic test cases
- Kill criterion: None (engineering, not research — build or don't)
- Dependencies: Phase 2 (needs extraction pipeline for input)

**Phase 4: Reading Interface & Validation**
- Task: Domain expert evaluation of graph utility vs. prose
- Gate: Expert preference for graph-augmented reading over prose-only
- Kill criterion: If domain experts don't find the graph more useful than prose, the structural advantage thesis is wrong
- Dependencies: Phase 3 (needs working system to evaluate)

### Interaction Behavior

1. **Default state:** Four phase cards arranged horizontally (or vertically on mobile). Dependency arrows between them. Each card shows the phase name, one-line description, gate criterion, and kill criterion.

2. **Hover on phase:** Card expands slightly, showing additional detail (full task description, specific metrics).

3. **Kill criteria emphasis:** Kill criteria are visually distinct — red border or icon. They're the falsifiable predictions. Hovering a kill criterion shows the full "what would change my mind" text.

4. **Current phase indicator:** Phase 1 marked as "current" with a pulsing or highlighted border.

### Visual Design

- Horizontal flow diagram with connecting arrows
- Phase cards: White background, rounded corners. Phase number prominently displayed
- Dependency arrows: Solid lines showing what gates what
- Kill criteria: Red accent, distinct from the blue/green of the phase cards
- Gate criteria: Shown as a "checkpoint" icon between phases
- Current phase: Accent border or badge

### Dimensions

- Full content column width
- Height: ~250px horizontal layout, taller on mobile (vertical stack)

---

## Deliverables

### 1. Diagram specification document (this file, expanded)
For each diagram: complete data structures (as TypeScript interfaces or JSON), interaction state machine, CSS custom properties used, accessibility annotations, and responsive breakpoint behavior.

### 2. Component implementation files
Six React island components following the thbrdy.dev architecture:
- `src/components/essay2/DecompositionPipeline.tsx`
- `src/components/essay2/ChenDependencyGraph.tsx`
- `src/components/essay2/SafetyCaseFragment.tsx`
- `src/components/essay2/SchemaEvolution.tsx`
- `src/components/essay2/CompetitiveGapTable.tsx`
- `src/components/essay2/Roadmap.tsx`

Each component includes:
- TypeScript data file with all claim/graph data
- CSS module or styled-components following design tokens
- Intersection observer integration for scroll-triggered hydration
- `prefers-reduced-motion` handling
- Keyboard navigation for all interactive elements
- ARIA labels and roles

### 3. Shared utilities
- `src/components/essay2/shared/graphUtils.ts` — dependency traversal, invalidation propagation algorithm, transitive closure
- `src/components/essay2/shared/tokens.ts` — essay-2-specific design tokens (edge colors, node styles) extending the global token set

---

## What NOT to Do

- **Don't write the essay prose.** That's Part 1. This session implements the diagrams that the prose references.
- **Don't use external charting libraries** (D3, Chart.js, vis.js, etc.). All layout and rendering from HTML/CSS/SVG with React for state management.
- **Don't use runtime graph layout algorithms.** Pre-compute all positions. The graphs are small enough that manual positioning produces better results.
- **Don't over-engineer the graph infrastructure.** The invalidation propagation here is a visualization feature (BFS/DFS on a static graph), not the Phase 3 graph engine. Keep it simple.
- **Don't break existing site styles.** All new CSS should be scoped to essay-2 components and extend, not override, the global design system.

---

## Success Criteria

- [ ] All six diagrams are specified with enough detail to implement without ambiguity
- [ ] Data structures are complete — all 25 claims from the extractions are represented in the Chen graph data
- [ ] Invalidation cascades on the Chen graph produce correct propagation (verified against dependency data)
- [ ] All diagrams degrade gracefully with `prefers-reduced-motion`
- [ ] All interactive elements are keyboard-accessible
- [ ] Mobile responsive behavior is specified for each diagram
- [ ] No external charting/animation libraries used
- [ ] Design tokens reference the existing thbrdy.dev token system
