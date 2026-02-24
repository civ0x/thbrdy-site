# VoD Visualization Redesign — Session Handoff

## Context

The Valley of Death essay (`src/content/writing/valley-of-death.mdx`) has six interactive React island components. We've been redesigning them one at a time, applying the principle that **the visualization's form should embody its argument**, not just illustrate it. Each component makes a specific intellectual claim — the redesign makes the reader *experience* that claim through interaction, not just read a diagram about it.

## What's Done

### 1. VoDSequentialFunnel — ✅ Committed to production

**Argument:** Sequential evaluation hides half the dependency structure.

**Before:** Static vertical list of evaluation stages.

**After:** Toggle between "Sequential" (vertical stack, 3 visible edges, gate markers between stages) and "Actual" (diamond layout, 6 bidirectional edges). Animated transformation — nodes reposition, hidden edges materialize, gate markers dissolve. The reader watches information appear that was structurally invisible.

**Key interaction patterns established here (reuse in future components):**
- Fat SVG hit targets: invisible 18px-wide transparent `<line>` elements behind 1.5px visible lines
- Mode-sensitive node explanations: click a node, get different explanation text depending on toggle state
- Connected edge highlighting when a node is selected
- Click-outside-to-deselect behavior
- Toggle control with mode labels

**File:** `src/components/islands/VoDSequentialFunnel.tsx` (production, committed)

### 2. VoDMaturitySwitch — ✅ Committed to production

**Argument:** The same technology at different maturity levels demands fundamentally different evaluation criteria.

Redesigned in a separate session. Production component updated and committed.

**File:** `src/components/islands/VoDMaturitySwitch.tsx` (production, committed)

### 3. VoDLegibilityGap — 🟡 Prototype complete, not yet in production

**Argument:** Research and product people look at the same reality but use incompatible vocabularies. Bridges exist but aren't expressed in either language.

**Before:** Two-column CSS grid (Research | Product) with dashed bridge lines between corresponding pairs. Hover tooltips on bridges. Generic mapping diagram — could represent any two-list correspondence.

**After (prototype):** Overlapping vocabularies with a continuous focus slider. Four concept cards stacked vertically, each containing *both* the research term and the product term overlaid in the same physical space. A slider shifts between "Research Lens" and "Product Lens."

- At the extremes: one vocabulary sharp and legible, the other blurred (CSS `filter: blur()`) and faded. You can read clearly through one lens at a time.
- In the "liminal zone" (slider 30%–70%): both vocabularies partially visible, bridge labels fade in, hint text turns gold. The discomfort of partial legibility *is* the argument.
- Click any card for a three-mode explanation panel: research-lens explanation, product-lens explanation, or translation explanation — shifts as slider moves.
- Annotation and callout text update dynamically with slider position.

**Prototype file:** `prototypes/vod-legibility-gap.html` (standalone HTML, ready for review)

**Data model (4 concept pairs):**

| Research | Product | Bridge |
|----------|---------|--------|
| Novel Algorithm | Customer Need | Enables solution to... |
| Benchmark SOTA | Competitive Advantage | Translates to... |
| Publication | Build Cost | Implies architecture that costs... |
| Citations | Revenue Model | Signals market for... |

Each pair has three explanation texts (research lens, product lens, translation).

**To convert to production:** Port from vanilla JS to React TSX, use `useInView` + `useState` hooks, follow island naming convention (`VoDLegibilityGap.tsx`), use injected `<style>` tag pattern for responsive CSS. Reference the existing component for the data structure and the prototype for the interaction model.

## What Remains

### 4. VoDCouplingMechanism — Not yet started

**Current:** Central PR/FAQ document with four domains (Research, Product, Engineering, Executive) at cardinal positions. Hover to see edges; click a domain to see its "reading" of the shared document.

**Argument:** A single boundary object (the PR/FAQ) is read differently by each domain. Coupling happens through shared artifacts, not shared understanding.

**Suggested redesign direction — Progressive disclosure on scroll (Distill.pub pattern):**
The PR/FAQ document as literal readable text at center. As the reader scrolls or interacts, different domains' "readings" of the same sentences highlight in sequence — showing that the same words carry different meaning depending on who's reading. Think annotated marginalia that shifts depending on which domain's lens is active.

**Reference practitioners:** Distill.pub (progressive density), Bret Victor (explorable explanations)

### 5. VoDCaseComparison — Not yet started

**Current:** AWS SageMaker vs AstraZeneca side-by-side parallel timelines with structural parallels highlighted.

**Argument:** Two organizations in different domains followed structurally identical patterns. The parallel is the insight — not the individual timelines.

**Suggested redesign direction — Scroll-driven parallel reveal (NYT/Pudding pattern):**
Instead of showing both timelines simultaneously, reveal them in sync. The reader scrolls through one timeline; the structural parallel appears alongside as each phase unfolds. The "aha" moment is experiencing the rhyme in real time, not seeing it laid out as a static comparison.

**Reference practitioners:** The Pudding, NYT interactive features (scrollytelling)

### 6. VoDTradingZone — Not yet started

**Current:** Scatter plot of AI lab organizations on a 2D field (Research Autonomy × Product Integration). Static positioning with hover details.

**Argument:** Organizations occupy positions in a strategic space defined by how they balance research independence against product integration. The space itself — the axes and the tensions they create — is the insight.

**Suggested redesign direction — Interactive field / draggable positioning:**
Let the reader place organizations on the field themselves before revealing actual positions. Or: animate organizations drifting toward equilibrium points, showing the gravitational pull of different strategies. The reader experiences the strategic space as a force field, not a static plot.

**Reference practitioners:** D3/Observable (force-directed layouts), Nicky Case (interactivity as proof)

## Design Principles (Apply to All)

1. **Animation as argument:** Don't show two static views side-by-side. Animate between states so the structural change is experienced, not just observed.
2. **Fat hit targets:** Any hoverable SVG line gets an invisible 18px-wide transparent companion for easy interaction.
3. **Mode-sensitive explanations:** Click for detail; the detail text changes based on current view/mode/slider position.
4. **Progressive disclosure:** Start simple, let interaction reveal complexity. Don't front-load all information.
5. **Respect the design system:** Use site tokens (teal for research, accent/gold for product, semantic colors for diagrams only). Serif for prose, sans for structural labels, mono for metadata. No external libraries.
6. **Standalone prototypes first:** Build in `prototypes/` as standalone HTML. Validate the interaction. Then port to React TSX for production.

## Technical Notes

- All island components are in `src/components/islands/`
- Shared infrastructure in `src/components/islands/shared/` (tokens.ts, useInView.ts, SectionDivider.tsx, PullQuote.tsx)
- Islands use injected `<style>` tags with component-scoped class names for responsive CSS
- Hydrated via `client:visible` in MDX files
- Design tokens reference CSS custom properties from `src/styles/global.css`
- **Cowork mode rule:** Do not edit source files directly. Prototype in `prototypes/`, then hand session prompts to an executing agent for production conversion.
