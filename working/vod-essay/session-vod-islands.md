# Session Prompt: VoD Essay — Island Implementation

## Situation

We're building six interactive React island components for the essay "The Valley of Death Is a Legibility Problem" on thbrdy.dev. The essay draft is at `working/vod-essay/valley-of-death-v2.md` with diagram placement markers in HTML comments. The design spec is at `working/vod-essay/design-pass-diagrams.md`.

This session creates the `.tsx` island components only. MDX conversion is a separate follow-on session.

## Visual Argument Summary

Each diagram makes a specific argument — not just displaying data but using spatial arrangement and animation to make a structural claim visible. The implementing agent should prioritize these communicative goals:

1. **VoDLegibilityGap:** The bridges between two vocabularies are always there but invisible. The scroll-triggered reveal (nodes first, then bridges after a pause) IS the thesis statement. Don't shortcut the timing — the delay before bridges appear creates the "aha."
2. **VoDSequentialFunnel:** The left panel looks neat and manageable; the right looks messy and complex. That visual contrast IS the argument — the clean version is missing information. Ghost edges on the left make the information loss visible.
3. **VoDMaturitySwitch:** The gradient band in the center (not a sharp line) communicates genuine uncertainty about the switching point. This is honest, not evasive. The indeterminacy is the design decision.
4. **VoDCouplingMechanism:** The document isn't a hub — it's a prism. Same artifact, different readings. The interpretation cards below are essential to this claim. Constraint edges must feel bidirectional (both directions matter).
5. **VoDCaseComparison:** The 6× badges are the visual punchline — make them the heaviest typographic elements. The structural parallels between the two timelines carry the argument: same mechanism, different vocabulary, same result.
6. **VoDTradingZone:** The trajectory arrows transform a static quadrant into dynamic analysis. Each org isn't just positioned — it's moving. This temporal dimension is the key differentiator from a standard positioning chart.

## Mission

Create six island components in `src/components/islands/`:

1. `VoDLegibilityGap.tsx`
2. `VoDSequentialFunnel.tsx`
3. `VoDMaturitySwitch.tsx`
4. `VoDCouplingMechanism.tsx`
5. `VoDCaseComparison.tsx`
6. `VoDTradingZone.tsx`

Each must follow the site's island architecture exactly (see `CLAUDE.md`). After all six are created, run `npm run build` to verify zero errors.

## Technical Constraints

- **Imports:** `tokens` from `./shared/tokens`, `useInView` from `./shared/useInView`, `useState` from `react` where needed.
- **No external dependencies.** No icon libraries, no charting libraries. All icons are inline SVG.
- **CSS:** Injected `<style>` blocks as first child of root element. Component-scoped class names (e.g., `vod-legibility-*`). Media queries at 640px and 420px.
- **Animation:** `useInView(0.15)` for all. Staggered delays at `i * 0.12s`. Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Opacity 0→1 + translateY(12px→0). Reduced motion handled automatically by the hook.
- **Hover interactions:** Detail panel below diagram with `--bg-warm` background, left border in accent color, serif text for descriptions. Placeholder text when nothing hovered.
- **Default export** for each component.
- **TypeScript** (`.tsx`).

## Shared Constants

Each file should define local accent constants at the top. This essay uses the default gold accent:

```ts
// No custom accent needed — uses tokens.accent directly.
// Semantic colors (tokens.teal, tokens.green, tokens.blue, tokens.red)
// used within diagrams for categorical differentiation.
```

## Header Pattern (all six diagrams)

Every diagram starts with this structure:

```tsx
<div className="vod-xxx-header">
  <p className="vod-xxx-eyebrow">{eyebrowText}</p>
  <h3 className="vod-xxx-title">{titleText}</h3>
</div>
```

CSS for the header:

```css
.vod-xxx-header {
  text-align: center;
  margin-bottom: 2rem;
}
.vod-xxx-eyebrow {
  font-family: ${tokens.mono};
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${tokens.accent};
  margin-bottom: 0.5rem;
}
.vod-xxx-title {
  font-family: ${tokens.serif};
  font-size: 1.5rem;
  font-weight: 400;
  color: ${tokens.text};
  margin: 0;
}
```

---

## Component 1: VoDLegibilityGap

**Eyebrow:** "Legibility Gap"
**Title:** "Two vocabularies. One reality."

### Data

```ts
interface TrackNode {
  label: string;
  desc: string;
}

const researchTrack: TrackNode[] = [
  { label: "Novel Algorithm", desc: "Technical breakthrough" },
  { label: "Benchmark SOTA", desc: "Competitive performance" },
  { label: "Publication", desc: "Peer recognition" },
  { label: "Citations", desc: "Field influence" },
];

const productTrack: TrackNode[] = [
  { label: "Customer Need", desc: "Problem worth solving" },
  { label: "Competitive Advantage", desc: "Defensible position" },
  { label: "Build Cost", desc: "Engineering investment" },
  { label: "Revenue Model", desc: "Business sustainability" },
];

interface Bridge {
  researchIdx: number;
  productIdx: number;
  label: string;
}

const bridges: Bridge[] = [
  { researchIdx: 0, productIdx: 0, label: "Enables solution to..." },
  { researchIdx: 1, productIdx: 1, label: "Translates to..." },
  { researchIdx: 2, productIdx: 2, label: "Implies architecture that costs..." },
  { researchIdx: 3, productIdx: 3, label: "Signals market for..." },
];
```

### Layout

Two vertical columns, max-width 680px centered. Left column (Research) and right column (Product) each ~240px wide with ~160px gap. Nodes stacked vertically with thin connector lines between them within each column.

- Left column nodes: `var(--teal-dim)` background tint, `1px solid rgba(42, 122, 106, 0.3)` border, 6px radius, padding 10px 14px.
- Right column nodes: `var(--accent-dim)` background tint, `1px solid rgba(184, 134, 11, 0.3)` border, 6px radius, padding 10px 14px.
- Node label: DM Sans, 0.8125rem, 600 weight.
- Node desc: DM Sans, 0.6875rem, `--text-muted`.
- Within-column connectors: 1px vertical line, `--border` color.

### Bridges (SVG)

An SVG overlay covers the gap between columns. Four curved paths connecting corresponding nodes across columns. Use quadratic bezier (`Q` command) with a control point offset ~30px horizontally from the midpoint to create a gentle S-curve. Example path for a bridge from (leftX, y1) to (rightX, y2):

```
M ${leftX} ${y1} Q ${midX + 30} ${y1}, ${midX} ${midY} Q ${midX - 30} ${y2}, ${rightX} ${y2}
```

Or simpler: a single cubic bezier (`C`) with control points pulling the curve gently:

```
M ${leftX} ${y1} C ${leftX + 40} ${y1}, ${rightX - 40} ${y2}, ${rightX} ${y2}
```

- Stroke: `var(--accent)`, 1.5px width.
- Initial state: opacity 0.
- Revealed state: opacity 1, strokeDasharray "6 4" for subtle dotted appearance.

On hover of a bridge: show the bridge label as a tooltip at the path midpoint. Use a small positioned `<div>` (not SVG text) for better font rendering — DM Sans, 0.6875rem, `--text-mid`, with a `--bg-warm` background pill (padding 4px 10px, border-radius 4px).

### Annotation

Below the diagram: centered text.

```
"The bridges exist but are not expressed in either vocabulary."
```

Serif, 0.875rem, `--text-light`, italic. Max-width 440px.

### Animation

1. Left column nodes: stagger top-to-bottom, `i * 0.12s` delay, from 0s.
2. Right column nodes: stagger top-to-bottom, `i * 0.12s` delay, from 0.2s.
3. Within-column connectors: fade in at 0.5s.
4. Bridges: fade in simultaneously at 0.9s with slight stagger (0.1s each). This delay is essential — the pause before bridges appear creates the reveal.
5. Annotation: fade in at 1.6s.

### Responsive

**640px:** Columns narrow to ~180px, gap to ~80px. Bridge curves tighten.

**420px:** Switch to stacked pair layout. Each research-product pair shown as a horizontal card:

```
┌─────────────────────────────────────┐
│ [Research Node] → [Product Node]    │
│ "Bridge label"                      │
└─────────────────────────────────────┘
```

Cards stacked vertically. Bridge labels shown inline (no hover needed). Teal left border on research side, gold right border on product side.

---

## Component 2: VoDSequentialFunnel

**Eyebrow:** "Information Loss"
**Title:** "What sequential evaluation can't see."

### Data

```ts
interface EvalNode {
  id: string;
  label: string;
  shortLabel: string; // for mobile
}

const nodes: EvalNode[] = [
  { id: "research", label: "Research Review", shortLabel: "Research" },
  { id: "market", label: "Market Assessment", shortLabel: "Market" },
  { id: "engineering", label: "Engineering Feasibility", shortLabel: "Engineering" },
  { id: "executive", label: "Executive Approval", shortLabel: "Executive" },
];

interface Dependency {
  from: string;
  to: string;
  label: string;
}

// All 6 pairwise dependencies
const dependencies: Dependency[] = [
  { from: "research", to: "market", label: "What counts as 'good enough' depends on what the market requires" },
  { from: "research", to: "engineering", label: "Technical approach constrains build cost" },
  { from: "research", to: "executive", label: "Research risk shapes investment appetite" },
  { from: "market", to: "engineering", label: "Target market determines performance requirements" },
  { from: "market", to: "executive", label: "Market size justifies resource allocation" },
  { from: "engineering", to: "executive", label: "Build complexity determines timeline and cost" },
];
```

### Layout

Two panels side by side. Max-width 740px. Left panel ~320px, right panel ~320px, ~60px gap.

**Left panel — "Sequential Evaluation (Standard)":**
- Panel header: JetBrains Mono, 0.6rem, uppercase, `--text-muted`.
- Four nodes stacked vertically with forward-only arrows between them.
- Nodes: `--bg-warm` background, `1px solid --border-mid`, 6px radius, padding 12px 16px.
- Arrows: SVG line + small triangle arrowhead, `--border-mid` color.
- Between nodes, a small gate indicator: a tiny diamond shape (4px rotated square) in `--text-faint`.
- Ghost edges: after the main animation, very faint dashed lines appear between non-adjacent nodes. These represent the dependencies that exist but are invisible to sequential evaluation. Color: `var(--accent)` at 8% opacity, dashed (4 4).

**Right panel — "Actual Dependencies":**
- Same panel header.
- Four nodes arranged in a diamond layout (consistent with LCCouplingDiagram).
- Diamond positions as percentages within a square container (aspect-ratio: 1):
  - Research Review: `left: 50%, top: 8%` (top)
  - Market Assessment: `left: 8%, top: 50%` (left)
  - Engineering Feasibility: `left: 92%, top: 50%` (right)
  - Executive Approval: `left: 50%, top: 92%` (bottom)
- All four use `transform: translate(-50%, -50%)`.
- Six bidirectional edges connecting all pairs. Use SVG lines within a viewBox="0 0 100 100" overlay.
- Edge color assignment (cycling through semantic colors):
  - Research ↔ Market: `var(--teal)`
  - Research ↔ Engineering: `var(--green)`
  - Research ↔ Executive: `var(--blue)`
  - Market ↔ Engineering: `var(--teal)`
  - Market ↔ Executive: `var(--green)`
  - Engineering ↔ Executive: `var(--blue)`
- Edge width: 1.5px. Default opacity: 0.5. Hovered: opacity 1, width 2.5px.
- On hover of an edge: highlight that edge, show bidirectional constraint label in detail panel below.

**Annotation below both panels:**

```
┌────────────────────────────────────────────────┐
│ Sequential evaluation sees 3 forward           │
│ connections. The actual structure has 6         │
│ bidirectional dependencies.                    │
└────────────────────────────────────────────────┘
```

Callout box: `--accent-dim` background, left border `3px solid --accent`, serif 0.875rem.

### Hover Detail

Below the diagram (shared across both panels). Same pattern as LC coupling diagram: left border accent, `--bg-warm` background when active, placeholder text when inactive.

### Animation

1. **0–0.6s:** Left panel nodes appear top-to-bottom (0.12s stagger). Arrows draw between them.
2. **0.6–1.0s:** Right panel nodes appear simultaneously (no stagger — they're coupled).
3. **1.0–1.6s:** Right panel edges draw in (0.1s stagger).
4. **1.6–2.0s:** Ghost edges on left panel fade in at low opacity.
5. **2.0s:** Callout appears.

### Responsive

**640px:** Panels stack vertically. Sequential funnel on top, dependency graph below.

**420px:** Same stacking. Right panel (dependencies) switches from diamond layout to a list of dependency pairs shown as text rows: "Research ↔ Market: [label]". Each row is a small card.

---

## Component 3: VoDMaturitySwitch

**Eyebrow:** "Maturity Threshold"
**Title:** "When to protect. When to integrate."

This is the essay's most important diagram. The gradient transition band in the center communicates genuine uncertainty about the switching point — this is honest, not evasive.

### Data

```ts
interface Zone {
  id: string;
  label: string;
  strategy: string;
  description: string;
  examples: string[];
  color: string;
  colorDim: string;
}

const zones: Zone[] = [
  {
    id: "protection",
    label: "Protected Exploration",
    strategy: "Separation is optimal",
    description: "Commercial evaluation destroys optionality before the research is mature enough to survive it.",
    examples: ["Deep learning 1997–2012", "Xerox PARC", "Early-stage pharma"],
    color: "var(--teal)",
    colorDim: "var(--teal-dim)",
  },
  {
    id: "integration",
    label: "Structured Translation",
    strategy: "Integration is optimal",
    description: "Continued separation wastes mature capability that is ready for product evaluation.",
    examples: ["Neptune ML", "AstraZeneca 5R", "Goldwater-Nichols"],
    color: "var(--accent)",
    colorDim: "var(--accent-dim)",
  },
];

interface Risk {
  label: string;
  examples: string[];
  side: "left" | "right";
}

const risks: Risk[] = [
  {
    label: "Premature legibility",
    examples: ["Watson Health ($5B destroyed)", "Cleantech 1.0 ($25B lost)", "AI Winter"],
    side: "left",
  },
  {
    label: "Failed transition",
    examples: ["PARC's GUI → Apple", "FAIR world models", "Zombie research labs"],
    side: "right",
  },
];
```

### Layout

Max-width 720px, centered.

**Maturity Bar:**
- Full width. Height: 56px. Border-radius: 10px.
- Background: a CSS linear gradient. Left portion tinted `var(--teal)` at ~6% opacity, right portion tinted `var(--accent)` at ~6% opacity, with a wide (~30%) blended transition in the center. Render as:
  ```css
  background: linear-gradient(
    to right,
    rgba(42, 122, 106, 0.06) 0%,
    rgba(42, 122, 106, 0.06) 30%,
    rgba(42, 122, 106, 0.03) 40%,
    rgba(184, 134, 11, 0.03) 60%,
    rgba(184, 134, 11, 0.06) 70%,
    rgba(184, 134, 11, 0.06) 100%
  );
  ```
- Border: `1px solid --border`.
- Zone labels on the bar: "PROTECTED EXPLORATION" (left, teal) and "STRUCTURED TRANSLATION" (right, gold). JetBrains Mono, 0.55rem, uppercase, letter-spacing 0.15em. Positioned absolutely, left/right padded 20px, vertically centered.
- Center: "THE SWITCHING POINT" label above the bar, with a thin dashed vertical line (1px, `--text-faint`, dasharray 3 3) dropping from the label down through the center of the bar. The dashed line is slightly transparent (opacity 0.5) — it can't quite land on a fixed point.

**Axis label below bar:** "Research Maturity →" — DM Sans, 0.625rem, `--text-faint`, right-aligned.

**Risk Callouts:**
- Positioned above the bar on the left and below the bar on the right (asymmetric to avoid false visual equivalence).
- Each: `--red-dim` background, `3px solid --red` left border, 8px radius, padding 10px 14px.
- Risk label: DM Sans, 0.75rem, 600, `--red`.
- Examples: DM Sans, 0.6875rem, `--text-muted`.
- Max-width: ~240px each.

**Zone Cards:**
Two cards below the bar, side by side (left-aligned, right-aligned).
- Left card: `var(--teal-dim)` background, `1px solid rgba(42, 122, 106, 0.3)` border (30% opacity), 8px radius.
- Right card: `var(--accent-dim)` background, `1px solid rgba(184, 134, 11, 0.3)` border (30% opacity), 8px radius.
- Strategy: DM Sans, 0.8125rem, 600, zone color.
- Description: serif, 0.875rem, `--text-mid`, line-height 1.6.
- Examples: JetBrains Mono, 0.6rem, `--text-muted`, comma-separated.

**Bottom annotation:**

```
"No empirical framework identifies when to switch. This is the hardest open question."
```

Serif, 0.9rem, `--text-light`, italic, centered, max-width 480px.

### Animation

1. **0–0.4s:** Maturity bar fades in (opacity).
2. **0.4–0.6s:** Zone labels on bar appear.
3. **0.6–0.9s:** Center "switching point" label and dashed line fade in.
4. **0.8–1.2s:** Zone cards fade in (left first at 0.8s, right at 0.95s).
5. **1.2–1.5s:** Risk callouts fade in (left at 1.2s, right at 1.35s).
6. **1.6s:** Annotation fades in.

### Responsive

**640px:** Zone cards stack to full width (left on top). Risk callouts reposition inline above/below their respective cards.

**420px:** Bar shrinks to 40px height. Zone labels on the bar hidden — they move to the zone cards. Risk callouts become small inline badges above each zone card. Everything stacks vertically.

---

## Component 4: VoDCouplingMechanism

**Eyebrow:** "Boundary Object"
**Title:** "One document. Four readings."

### Data

```ts
interface Domain {
  id: string;
  label: string;
  desc: string;
  color: string;
  position: "top" | "right" | "bottom" | "left";
}

const domains: Domain[] = [
  { id: "research", label: "Research Capability", desc: "What the technology can do", color: "var(--teal)", position: "top" },
  { id: "customer", label: "Customer Value", desc: "What problem it solves", color: "var(--green)", position: "right" },
  { id: "business", label: "Business Viability", desc: "Why the company should invest", color: "var(--accent)", position: "bottom" },
  { id: "engineering", label: "Engineering Feasibility", desc: "What it takes to build", color: "var(--blue)", position: "left" },
];

interface Reading {
  role: string;
  interpretation: string;
  color: string;
}

const readings: Reading[] = [
  { role: "Researcher", interpretation: "Translation of my capability", color: "var(--teal)" },
  { role: "Product Lead", interpretation: "Feature proposal", color: "var(--green)" },
  { role: "Executive", interpretation: "Investment case", color: "var(--accent)" },
  { role: "Engineer", interpretation: "System spec", color: "var(--blue)" },
];

interface Constraint {
  fromId: string;
  toId: string;
  label: string;
}

const constraints: Constraint[] = [
  { fromId: "research", toId: "customer", label: "Technical capability determines what customer problems become solvable" },
  { fromId: "research", toId: "engineering", label: "Research approach constrains implementation architecture" },
  { fromId: "research", toId: "business", label: "Novelty determines competitive positioning" },
  { fromId: "customer", toId: "engineering", label: "Customer requirements set performance targets" },
  { fromId: "customer", toId: "business", label: "Market size justifies investment" },
  { fromId: "engineering", toId: "business", label: "Build complexity determines timeline and cost" },
];
```

### Layout

Max-width 680px, centered.

**Central Document Card:**
- Centered in the upper portion. Width ~100px, height ~80px.
- Background: `var(--bg)`. Border: `1px solid --border-mid`. Border-radius: 8px.
- Subtle shadow: `0 2px 12px rgba(44, 36, 22, 0.06)`.
- Interior: 4 horizontal lines suggesting text content. Lines are `--border` color, 1px height, varying widths (80%, 70%, 85%, 50%), spaced 10px apart, centered vertically.
- Below the card: "PR/FAQ" — DM Sans, 0.8125rem, 700. "Boundary Object" — JetBrains Mono, 0.55rem, uppercase, `--text-muted`.

**Domain Cards:**
Four cards at cardinal positions around the document. Use absolute positioning within a relative container (aspect-ratio: 1, max-width: 480px).
- Each card: ~120px wide, padding 8px 12px, domain-colored top border (3px), `--bg-warm` background, 6px radius.
- Icon: small inline SVG (20x20) in domain color. Simple geometric shapes — circle for Research, diamond for Customer, square for Engineering, triangle for Business.
- Label: DM Sans, 0.75rem, 600, domain color.
- Desc: DM Sans, 0.625rem, `--text-muted`.

Position percentages (left, top) within the container:
- Top (Research): 50%, 2% — centered horizontally, near top. Transform: translateX(-50%).
- Right (Customer): 88%, 50% — right side, vertically centered. Transform: translateY(-50%).
- Bottom (Business): 50%, 88% — centered, near bottom. Transform: translateX(-50%).
- Left (Engineering): 2%, 50% — left side, vertically centered. Transform: translateY(-50%).

**Constraint Edges (SVG):**
SVG overlay on the container. Six lines connecting domain positions through/near the central document. Bidirectional — small arrowheads (4px triangles) at both ends. Line color: blend of the two domain colors, or use `--border-mid` with the hovering changing to domain color. Width: 1.5px.

On hover: edge highlights (opacity 1, thicker), corresponding constraint label appears in hover detail panel below.

**Interpretation Cards (below main diagram):**
4-column grid (2×2 on tablet, 1-col on phone).
- Each card: `--bg-warm` background, 8px radius, padding 12px 16px.
- Role header: DM Sans, 0.75rem, 600, reading color.
- Interpretation: serif, 0.875rem, `--text-mid`, in quotation marks.

**Callout below interpretation cards:**

```
"The narrative forces joint articulation. Changing any constraint changes all others."
```

`--accent-dim` background, left border `3px solid --accent`, serif 0.875rem.

### Animation

1. **0–0.3s:** Central document card fades in with scale(0.95→1.0).
2. **0.3–0.7s:** Domain cards radiate outward from center (translate from center position to final position) and fade in, 0.1s stagger.
3. **0.7–1.2s:** Constraint edges draw in (opacity), 0.08s stagger.
4. **1.2–1.6s:** Interpretation cards grid fades in.
5. **1.6s:** Callout appears.

### Responsive

**640px:** Diamond layout tightens (container narrows). Interpretation cards switch to 2×2 grid.

**420px:** Abandon spatial layout. Document card at top (full width, centered). Domain cards listed vertically below with inline constraint descriptions. Interpretation cards single column.

---

## Component 5: VoDCaseComparison

**Eyebrow:** "Cross-Domain Evidence"
**Title:** "Same mechanism. Same magnitude."

### Data

```ts
interface TimelineStage {
  label: string;
  shortLabel: string;
  desc: string;
}

interface Timeline {
  id: string;
  title: string;
  color: string;
  colorDim: string;
  stages: TimelineStage[];
  result: string;
  resultDetail: string;
}

const timelines: Timeline[] = [
  {
    id: "aws",
    title: "AWS AI Lab → Neptune ML",
    color: "var(--teal)",
    colorDim: "var(--teal-dim)",
    stages: [
      { label: "Research Artifact", shortLabel: "Research", desc: "GNN/DGL — strong academic results, no productization path" },
      { label: "PR/FAQ Translation", shortLabel: "PR/FAQ", desc: "Converted to product language: ML predictions on graph data in Neptune" },
      { label: "Business Review", shortLabel: "Biz Review", desc: "Structured visibility through leadership review cadence" },
      { label: "Shipped Feature", shortLabel: "Shipped", desc: "Neptune ML — production feature, publicly documented" },
    ],
    result: "6×",
    resultDetail: "increase in transition rate",
  },
  {
    id: "az",
    title: "AstraZeneca → 5R Framework",
    color: "var(--green)",
    colorDim: "var(--green-dim)",
    stages: [
      { label: "Research Candidate", shortLabel: "Candidate", desc: "Drug candidate with preclinical promise" },
      { label: "5R Joint Assessment", shortLabel: "5R Assessment", desc: "Right Target, Right Tissue, Right Safety, Right Patient, Right Commercial" },
      { label: "Portfolio Review", shortLabel: "Portfolio", desc: "Joint scientific-clinical-commercial evaluation" },
      { label: "Approved Drug", shortLabel: "Approved", desc: "Phase III completion and regulatory approval" },
    ],
    result: "6×",
    resultDetail: "4% → 23% success rate",
  },
];

interface Parallel {
  stageIdx: number;
  label: string;
}

const parallels: Parallel[] = [
  { stageIdx: 0, label: "Maturity Gate" },
  { stageIdx: 1, label: "Boundary Object" },
  { stageIdx: 2, label: "Trading Zone" },
];
```

### Layout

Max-width 720px, centered.

**Each timeline:** A horizontal row of 4 stage cards connected by arrows, terminating in a large 6× badge.

- Stage cards: `domain-colorDim` background, `1.5px solid domain-color` at 30% opacity, 6px radius. Padding 10px 14px. Width determined by grid (each stage gets equal space minus the badge).
- Stage label: DM Sans, 0.75rem, 600, domain color.
- Stage desc: hidden on initial view; available in a shared hover detail panel.
- Arrow connectors: thin line (1px) with small arrowhead (3px triangle), domain color at 50% opacity.

**6× Badge:**
- Width: ~80px, height matches the stage card height.
- Background: domain color at 10% opacity. Border: `2px solid domain-color`.
- Border-radius: 10px.
- "6×" text: DM Sans, 2rem, 700, domain color. Centered.
- Below "6×": result detail text — DM Sans, 0.6rem, `--text-muted`.

**Timeline title:** Above each row. DM Sans, 0.8125rem, 600, domain color.

**Structural Parallel Connectors:**
Between the two timeline rows, vertical dashed lines connecting equivalent stages (indices 0, 1, 2). Lines: `--text-faint`, 1px, strokeDasharray "4 4". At the midpoint of each line, a label: JetBrains Mono, 0.55rem, uppercase, `--text-muted`.

Gap between timelines: ~80px (enough for the parallel labels).

**Callout below:**

```
"Different domains. Same mechanism. Same magnitude of improvement."
```

Same callout style: `--accent-dim` background, left border, serif text.

### Animation

1. **0–0.6s:** Top timeline stages appear left to right (0.12s stagger), arrows draw.
2. **0.3–0.9s:** Bottom timeline stages appear (same pattern, 0.3s delayed).
3. **0.9–1.2s:** Structural parallels fade in between timelines.
4. **1.2–1.5s:** 6× badges scale in (0.9→1.0) and fade. Brief box-shadow pulse (domain color glow at 15% opacity, 0→1→0 over 0.6s, once).
5. **1.5s:** Callout appears.

### Responsive

**640px:** Stage labels switch to `shortLabel`. Stage cards narrow. 6× badges remain full size (they're the visual anchor).

**420px:** Each timeline becomes a vertical card stack. The two timelines show sequentially (AWS first, gap, then AZ). Structural parallels become a separate card between them:

```
┌────────────────────────────────────┐
│ STRUCTURAL PARALLELS               │
│                                    │
│ Research Artifact ↔ Candidate      │
│ → Maturity Gate                    │
│                                    │
│ PR/FAQ ↔ 5R Assessment             │
│ → Boundary Object                  │
│                                    │
│ Biz Review ↔ Portfolio Review      │
│ → Trading Zone                     │
└────────────────────────────────────┘
```

6× badges still prominent — positioned as the last card in each vertical stack, full width.

---

## Component 6: VoDTradingZone

**Eyebrow:** "Organizational Landscape"
**Title:** "Where the AI labs are heading."

### Data

```ts
interface OrgPosition {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage (0 = bottom, 100 = top — note: CSS top is inverted)
  color: string;
  descriptor: string;
  detail: string;
  arrow: { dx: number; dy: number; uncertain?: boolean }; // trajectory direction
}

// Note: y values in CSS positioning (top) are inverted from axis values.
// y=82 in data means high on the Product Integration axis = top: 18% in CSS.
const orgs: OrgPosition[] = [
  {
    id: "openai",
    name: "OpenAI",
    x: 25,
    y: 82, // high product integration
    color: "var(--red)",
    descriptor: "Product-dominant",
    detail: "Fully product-dominant. $12B revenue but significant research attrition. Safety processes subordinated to product cadence.",
    arrow: { dx: -8, dy: 6 }, // deeper into top-left
  },
  {
    id: "fair",
    name: "Meta FAIR",
    x: 78,
    y: 25, // low product integration, high autonomy
    color: "var(--teal)",
    descriptor: "Separate lab",
    detail: "Extraordinary research output (PyTorch, Llama) but self-acknowledged transition failures. Reorganizing toward integration.",
    arrow: { dx: -10, dy: 10 }, // moving toward center
  },
  {
    id: "deepmind",
    name: "Google DeepMind",
    x: 50,
    y: 55,
    color: "var(--text-muted)",
    descriptor: "Forced merger",
    detail: "Forced merger of competing labs. AlphaFold emerged from separation; integration may prevent the next AlphaFold.",
    arrow: { dx: 0, dy: 0, uncertain: true }, // direction unclear
  },
  {
    id: "anthropic",
    name: "Anthropic",
    x: 72,
    y: 70,
    color: "var(--accent)",
    descriptor: "Trading zone model",
    detail: "Constitutional AI aligns research with product. Research engineer role creates permanent trading-zone residents.",
    arrow: { dx: 6, dy: 6 }, // toward upper-right
  },
];
```

### Layout

Max-width 640px, centered.

**Field:**
- Aspect ratio: 4 / 3.
- Background: `var(--bg-warm)`. Border: `1px solid --border`. Border-radius: 12px.
- Overflow: hidden.

**Axes:**
- X-axis label: "Research Autonomy →" — positioned bottom-center of field.
- Y-axis label: "Product Integration ↑" — positioned left side, rotated -90deg.
- Both: DM Sans, 0.6875rem, 600, uppercase, letter-spacing 0.1em, `--text-faint`.

**Risk Zones (corner shading):**
- Top-left zone (~25% × 30% rectangle from top-left): background `var(--red-dim)`. Label "Premature Legibility" — DM Sans, 0.55rem, 600, uppercase, `--red`. Small subtext: "(Watson Health)".
- Bottom-right zone (~25% × 30% from bottom-right): same styling. Label "Failed Transition". Subtext: "(PARC, FAIR)".
- Both: border-radius matches field corners.

Note on axis orientation: In the CSS `top` property, 0% = top of the field = high Product Integration. So an org at y=82 (high integration) has CSS `top: 18%`. Convert with: `cssTop = (100 - y)%`.

**Trading Zone Highlight:**
- Upper-right area: dashed border rectangle positioned at `left: 58%, top: 8%, width: 36%, height: 38%`. Border: `1.5px dashed rgba(184, 134, 11, 0.25)` (accent at 25% opacity). CSS `border-style: dashed` with default browser dash pattern is fine. Border-radius: 10px. Background: transparent. Label "TRADING ZONE" — JetBrains Mono, 0.5rem, uppercase, `rgba(184, 134, 11, 0.4)` (accent at 40% opacity), positioned with padding 8px inside top-left of the rectangle.

**Organization Positions:**
Each rendered as:
- Filled dot: 12px diameter, org color. On hover: `box-shadow: 0 0 0 4px ${color}25`.
- Label to the right (or repositioned to avoid overlap): org name — DM Sans, 0.75rem, 600, org color. Descriptor below — DM Sans, 0.625rem, `--text-faint`.
- Trajectory arrow: SVG line, 20-30px length from the dot center in the direction of (dx, dy). Small arrowhead at the end. Color: org color at 70% opacity. Width: 1.5px. For DeepMind (`uncertain: true`), replace the arrowhead with "?" text in DM Sans 0.625rem.

Absolute positioning: `left: ${x}%`, `top: ${100 - y}%`, `transform: translate(-50%, -50%)`.

**Hover Detail (below field):**
Same pattern as other diagrams. On hover, shows org name (bold, org color) and detail text (serif, 0.875rem, `--text-mid`).

**Annotation below detail:**

```
"The research engineer role creates permanent residents of the trading zone."
```

JetBrains Mono, 0.6rem, `--text-light`, italic, centered.

### Animation

1. **0–0.4s:** Field background and axes fade in.
2. **0.4–0.7s:** Risk zone shadings fade in.
3. **0.5–1.0s:** Org positions appear one by one (0.15s stagger).
4. **1.0–1.4s:** Trajectory arrows draw outward from dots.
5. **1.2–1.5s:** Trading zone highlight fades in.
6. **1.5s:** Annotation appears.

### Responsive

**640px:** Field narrows. Trajectory arrows shorten to 15px. Risk zone labels use single-word abbreviations. Org descriptors hidden (hover only).

**420px:** Field kept but within narrower container. Org labels switch to abbreviations (e.g., "OAI", "FAIR", "GDM", "Anth") with a legend below the field mapping abbreviations to full names and descriptors. Hover detail replaced by tap-to-toggle or always-visible legend.

---

## Verification Checklist

After building all six components:

- [ ] `npm run build` — zero errors, zero warnings
- [ ] Each component has a default export
- [ ] Each component uses `useInView(0.15)` for scroll triggering
- [ ] All `<style>` blocks use component-scoped class names (no collisions)
- [ ] No external library imports (only react, ./shared/tokens, ./shared/useInView)
- [ ] All fonts match the design system: DM Sans for labels, JetBrains Mono for eyebrows/annotations, Cormorant Garamond for body/detail text
- [ ] No `#FFFFFF` backgrounds — use `var(--bg)` which resolves to `#FAF6F0`
- [ ] No new entries in `package.json`
- [ ] All six files are TypeScript (`.tsx`)
- [ ] Responsive media queries at 640px and 420px in each component
