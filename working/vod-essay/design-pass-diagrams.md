# VoD Essay — Diagram Design Pass

**Date:** 2026-02-23
**Status:** Design specifications for six interactive island diagrams
**Feeds into:** Claude Code session prompt for `.tsx` implementation + MDX integration

---

## Visual Language Decisions

**Essay accent color:** Default gold (`--accent: #B8860B`). The essay is connected to Pando, which is organizational/structural in nature — warm analytical territory, not technical-cool like the LC essay's steel blue. Gold aligns with the site's core voice.

**Local accent constants:**

```ts
const VOD = {
  accent: "var(--accent)",        // #B8860B — primary
  accentDim: "var(--accent-dim)", // rgba(184, 134, 11, 0.08)
  accentGlow: "var(--accent-glow)", // rgba(184, 134, 11, 0.15)
};
```

No custom hex values needed — the default palette carries this essay. Semantic colors (`--teal`, `--green`, `--blue`, `--red`) used within diagrams for categorical differentiation.

**Header pattern (consistent across all six):**

```
[eyebrow — JetBrains Mono, 0.7rem, 500, uppercase, letter-spacing 0.2em, --accent]
[title — Cormorant Garamond, 1.5rem, 400, --text]
```

**Animation pattern:** `useInView(0.15)`, staggered delays at `i * 0.12s`, cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0→1 + translateY(12px→0). All transitions respect `prefers-reduced-motion` via the `useInView` hook (returns `inView: true` immediately when reduced motion is preferred).

**Hover interaction pattern:** Detail panel below diagram body — `bg: --bg-warm`, left border accent, serif text for evidence/description. Placeholder text when nothing is hovered: sans, italic, `--text-faint`. Consistent with LC coupling diagram and LC landscape quadrant.

---

## Diagram 1: VoDLegibilityGap

**Position:** After the introductory paragraphs, before Section 01.
**Argument:** Research value and product value describe the same reality in mutually unintelligible vocabularies. The dependency bridges between them exist but are invisible.

### Visual Concept

Two vertical columns — Research Language (left) and Product Language (right) — each containing four nodes stacked vertically. Between them, curved SVG paths representing dependency bridges that are initially invisible and reveal on scroll.

The reveal is the argument. The nodes (the two vocabularies) appear first. Then, after a deliberate pause, the bridges draw in — making visible what was always structurally there but never expressed. This isn't decoration; it's the thesis statement rendered spatially.

### Layout

```
┌─────────────────────────────────────────────────────┐
│              [eyebrow: Legibility Gap]               │
│     [title: Two vocabularies. One reality.]          │
│                                                      │
│   RESEARCH LANGUAGE      PRODUCT LANGUAGE            │
│   ┌──────────────┐       ┌──────────────┐            │
│   │Novel Algorithm│· · · ·│Customer Need │            │
│   └──────────────┘       └──────────────┘            │
│         │                       │                    │
│   ┌──────────────┐       ┌──────────────┐            │
│   │Benchmark SOTA│· · · ·│Competitive   │            │
│   │              │       │  Advantage   │            │
│   └──────────────┘       └──────────────┘            │
│         │                       │                    │
│   ┌──────────────┐       ┌──────────────┐            │
│   │Publication   │· · · ·│Build Cost    │            │
│   └──────────────┘       └──────────────┘            │
│         │                       │                    │
│   ┌──────────────┐       ┌──────────────┐            │
│   │Citations     │· · · ·│Revenue Model │            │
│   └──────────────┘       └──────────────┘            │
│                                                      │
│   [annotation: "The bridges exist but are not        │
│    expressed in either vocabulary."]                  │
└─────────────────────────────────────────────────────┘
```

- Max width: 680px, centered.
- Each column: ~260px wide with 120–160px gap between them for bridges.
- Nodes: `--bg` background, `1px solid --border-mid` border, 6px border-radius. Left column tinted `--teal-dim` border, right column tinted `--accent-dim` border.
- Within-column connectors: thin vertical line (`--border`, 1px) between nodes, suggesting sequence within each vocabulary.
- Bridge paths: SVG `<path>` elements with slight S-curve (not straight lines). Stroke: `--accent`, strokeDasharray for dotted appearance, 1.5px width. On reveal, transition from opacity 0 → 1.

### Bridge Specifications

| Research Node | Product Node | Bridge Label (on hover) |
|---|---|---|
| Novel Algorithm | Customer Need | "Enables solution to..." |
| Benchmark SOTA | Competitive Advantage | "Translates to..." |
| Publication | Build Cost | "Implies architecture that costs..." |
| Citations | Revenue Model | "Signals market for..." |

The bridge labels appear on hover — small DM Sans tooltip positioned at the midpoint of each curve. This makes the bridges informational, not just decorative.

### Animation Sequence

1. **0–0.4s:** Left column nodes fade in, staggered top-to-bottom (0.12s intervals)
2. **0.2–0.6s:** Right column nodes fade in, staggered top-to-bottom (0.12s intervals)
3. **0.4–0.7s:** Within-column connector lines fade in
4. **0.9–1.5s:** Bridge paths fade in simultaneously with a slight stagger (0.1s per bridge) — this is the reveal moment. Brief pause before bridges appear is essential to the effect.
5. **1.6s:** Annotation fades in below

### Responsive

- **640px:** Columns narrow to ~200px, gap narrows to ~80px. Bridge curves tighten.
- **420px:** Switch to stacked layout. Each research-product pair shown as a horizontal card: `[Research Node] → [Product Node]` with the bridge label visible inline (no hover needed). Pairs stacked vertically. Loses the two-column metaphor but preserves the pairing information.

### Color

- Left column node borders: `--teal` at 30% opacity
- Right column node borders: `--accent` at 30% opacity
- Bridge strokes: `--accent` at full opacity on reveal
- Bridge labels: `--text-mid`, DM Sans 0.6875rem

---

## Diagram 2: VoDSequentialFunnel

**Position:** End of Section 01 ("The Standard Diagnosis").
**Argument:** Sequential evaluation (stage-gate) loses coupling information that the actual dependency structure preserves.

### Visual Concept

Side-by-side comparison. Left: neat, orderly sequential funnel — the reassuring lie. Right: the same nodes rearranged as a fully-connected dependency graph — the messy truth. The visual contrast IS the argument: the left looks manageable but is missing information; the right looks complex but is honest.

The key insight: on the left side, faint "ghost edges" show the dependencies that exist but are invisible to the sequential process. These are the same edges that appear fully on the right. This makes the information loss visible rather than merely asserted.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│              [eyebrow: Information Loss]                   │
│    [title: What sequential evaluation can't see.]         │
│                                                           │
│  SEQUENTIAL EVALUATION          ACTUAL DEPENDENCIES       │
│  (Standard)                     (Reality)                 │
│                                                           │
│  ┌─────────────┐              ┌────────┐   ┌────────┐    │
│  │  Research    │───→          │Research│───│ Market │    │
│  │  Review      │              │ Review │╲ ╱│  Asmt  │    │
│  └──────┬──────┘              └────┬───┘ ╳ └───┬────┘    │
│         │ gate                     │    ╱ ╲    │          │
│  ┌──────┴──────┐              ┌────┴───┐   ┌──┴─────┐    │
│  │   Market    │───→          │  Eng   │───│  Exec  │    │
│  │  Assessment │              │Feasible│   │Approval│    │
│  └──────┬──────┘              └────────┘   └────────┘    │
│         │ gate                                            │
│  ┌──────┴──────┐                                         │
│  │ Engineering │───→                                     │
│  │ Feasibility │                                         │
│  └──────┬──────┘                                         │
│         │ gate                                            │
│  ┌──────┴──────┐                                         │
│  │  Executive  │                                         │
│  │  Approval   │                                         │
│  └─────────────┘                                         │
│                                                           │
│  [Left annotation: "Each stage treats previous output     │
│   as fixed. 3 forward connections."]                      │
│  [Right annotation: "6 bidirectional dependencies.        │
│   The questions are coupled."]                            │
│                                                           │
│  [callout: "Sequential evaluation loses half the          │
│   dependency structure."]                                 │
└──────────────────────────────────────────────────────────┘
```

- Max width: 740px. Two panels at ~340px each, ~60px gap.
- Panel headers: JetBrains Mono, 0.6rem, uppercase, `--text-muted`.

### Left Panel (Sequential)

- Four nodes stacked vertically, connected by downward arrows with gate icons (small diamond or barrier marks) between them.
- Node styling: `--bg-warm` background, `1px solid --border-mid`, 6px radius.
- Arrows: forward-only, thin (`--border-mid` color, 1px).
- Ghost edges: very faint dashed lines (`--accent` at 8% opacity) between non-adjacent nodes, suggesting the dependencies that exist but can't be seen. These appear after the main animation completes.
- Node labels: DM Sans 0.8125rem, 600 weight.

### Right Panel (Dependencies)

- Same four nodes arranged in a 2×2 grid (diamond layout similar to LCCouplingDiagram).
- Six bidirectional edges connecting all pairs. Edge width proportional to coupling strength.
- Edges colored using semantic colors: `--teal`, `--green`, `--blue` variations for different pairings.
- On hover: edge highlights and shows the specific dependency (e.g., "Market viability depends on technical architecture").
- Annotation count: "6 bidirectional dependencies" — numerically concrete.

### Animation Sequence

1. **0–0.6s:** Left panel nodes appear top-to-bottom with forward arrows (0.12s stagger). Clean, orderly.
2. **0.6–1.0s:** Right panel nodes appear simultaneously (no stagger — they're coupled, not sequential).
3. **1.0–1.6s:** Right panel edges draw in, staggered.
4. **1.6–2.0s:** Ghost edges on left panel fade in at very low opacity. The "information loss" becomes visible.
5. **2.0s:** Bottom callout fades in.

### Responsive

- **640px:** Panels stack vertically. Sequential funnel on top, dependency graph below. Vertical divider becomes horizontal.
- **420px:** Same stacking. Nodes in right panel switch from 2×2 grid to a simpler list with inline edge descriptions (since hover doesn't work well on mobile). Show edges as text: "Research ↔ Market," "Engineering ↔ Executive," etc.

---

## Diagram 3: VoDMaturitySwitch

**Position:** Section 03 ("Two Failure Modes").
**Argument:** There's a switching point between protected exploration and structured translation. Premature legibility is as dangerous as failed transition. This is the essay's most important diagram — it carries the maturity qualifier that makes the thesis defensible.

### Visual Concept

A horizontal landscape that reads like a terrain cross-section. Two distinct zones — Protected Exploration (left) and Structured Translation (right) — separated not by a sharp line but by a blurred gradient band. This gradient band IS the argument about the switching point: it exists, it matters, but its exact location is unknown and context-dependent.

The extremes have risk callouts that frame the diagram as diagnostic rather than prescriptive. You don't want to be at either extreme. The gradient center is the honest answer: "we don't know exactly where to switch."

This should NOT look like a 2×2 or a slider. It should feel like a map of terrain with two distinct regimes and an uncertain boundary between them.

### Layout

```
┌────────────────────────────────────────────────────────────┐
│                 [eyebrow: Maturity Threshold]               │
│     [title: When to protect. When to integrate.]           │
│                                                             │
│  ◄── RISK: Premature Legibility                            │
│  Watson Health, Cleantech 1.0, AI Winter                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PROTECTED         ░░░ THE ░░░         STRUCTURED    │  │
│  │  EXPLORATION       ░ SWITCHING ░       TRANSLATION   │  │
│  │                    ░░ POINT ░░░                       │  │
│  │  [teal tint]       [gradient]          [gold tint]   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ──── Research Maturity ────────────────────────►           │
│                                                             │
│                                       RISK: Failed ──►     │
│                                       Transition            │
│                             PARC's GUI, FAIR world models   │
│                                                             │
│  ┌─────────────────┐              ┌──────────────────┐     │
│  │ Separation is    │              │ Integration is    │     │
│  │ optimal.         │              │ optimal.          │     │
│  │                  │              │                   │     │
│  │ Deep learning    │              │ Neptune ML,       │     │
│  │ 1997–2012,       │              │ AstraZeneca 5R,   │     │
│  │ Xerox PARC,      │              │ Goldwater-Nichols │     │
│  │ early-stage      │              │                   │     │
│  │ pharma           │              │                   │     │
│  └─────────────────┘              └──────────────────┘     │
│                                                             │
│  [annotation: "No empirical framework identifies when to   │
│   switch. This is the hardest open question."]             │
└────────────────────────────────────────────────────────────┘
```

### The Maturity Bar

- Full width within the component (max-width: 720px).
- Height: 64px. Border-radius: 12px.
- Left half: gradient from `--teal-dim` (solid) to transparent
- Right half: gradient from transparent to `--accent-dim` (solid)
- Center transition band: ~30% of the bar width. Rendered as overlapping gradients that create a blurred zone. This is NOT a line — it's deliberately indeterminate.
- Center label "The Switching Point" in JetBrains Mono, 0.6rem, uppercase, positioned above the center of the bar with a thin dashed line dropping down into the gradient zone. The dashed line itself is partially transparent — suggesting the pointer can't quite land on a fixed location.
- Below the bar: a subtle axis label "Research Maturity →" in DM Sans, 0.625rem, `--text-faint`.

### Zone Cards

Two cards below the bar, left-aligned and right-aligned respectively.

- Left card: `--teal-dim` background, `1px solid --teal` at 30% opacity, 8px radius.
  - Strategy label: "Separation is optimal" — DM Sans 0.8125rem, 600, `--teal`.
  - Description: "Commercial evaluation destroys optionality" — serif 0.875rem, `--text-mid`.
  - Examples: mono 0.625rem, `--text-muted`.
- Right card: `--accent-dim` background, `1px solid --accent` at 30% opacity, 8px radius.
  - Same structure, accent-colored.

### Risk Callouts

Positioned above the bar (left) and below the bar (right) — staggered to avoid visual symmetry that would suggest false equivalence. Both failure modes are real, but they're different in character.

- Left risk: `--red-dim` background, left border `--red`, 3px. Contains risk name + examples.
- Right risk: same styling, right-aligned.
- Risk labels: DM Sans 0.75rem, 600, `--red`.

### Animation Sequence

1. **0–0.4s:** Maturity bar fades in (left-to-right gradient fill).
2. **0.4–0.8s:** Zone labels appear on the bar.
3. **0.6–1.0s:** Center "switching point" label and dashed line fade in.
4. **0.8–1.2s:** Zone cards fade in (left first, then right, 0.15s gap).
5. **1.2–1.6s:** Risk callouts fade in (staggered).
6. **1.8s:** Bottom annotation fades in.

### Responsive

- **640px:** Bar narrows. Zone cards stack to full width (left card on top, right card below). Risk callouts reposition to be inline with their respective zone cards.
- **420px:** Bar becomes a thin horizontal strip with just the gradient (zone labels move to the cards below). Cards full-width stacked. The gradient bar is still the conceptual anchor but the detail lives in the cards.

---

## Diagram 4: VoDCouplingMechanism

**Position:** Section 04 ("The Mechanism" / "Trading Zones").
**Argument:** The PR/FAQ is a boundary object — different audiences read the same document differently, forcing joint articulation of coupled constraints.

### Visual Concept

The central metaphor isn't hub-and-spoke — it's a prism. A single document refracts into different readings depending on who's looking at it. The document occupies the center, constraint domains surround it, and below, four interpretation cards show how the same document looks different to each audience.

The key differentiation from a generic diagram: the constraint edges are bidirectional AND labeled with specific constraints, showing that changing any one changes all others. And the interpretations below show the SAME text from four perspectives — the boundary object concept made spatial.

### Layout

```
┌────────────────────────────────────────────────────────────┐
│              [eyebrow: Boundary Object]                     │
│     [title: One document. Four readings.]                  │
│                                                             │
│            Research Capability                              │
│            (--teal)                                         │
│                 │                                           │
│                 │ constrains ↕                              │
│                 │                                           │
│  Engineering ───┼──── PR/FAQ ────┼─── Customer Value       │
│  Feasibility    │   ┌────────┐   │    (--green)            │
│  (--blue)       │   │ ═══════│   │                         │
│                 │   │ ═══════│   │                         │
│                 │   │ ═══════│   │                         │
│                 │   └────────┘   │                         │
│                 │                │                          │
│                 │ constrains ↕   │                          │
│                 │                │                          │
│            Business Viability                              │
│            (--accent)                                      │
│                                                             │
│  ┌────────────┬────────────┬────────────┬────────────┐     │
│  │ Researcher │ Product Ld │  Engineer  │ Executive  │     │
│  │"Translation│ "Feature   │ "System    │ "Investment│     │
│  │ of my      │  proposal" │  spec"     │  case"     │     │
│  │ capability"│            │            │            │     │
│  └────────────┴────────────┴────────────┴────────────┘     │
│                                                             │
│  [callout: "The narrative forces joint articulation.        │
│   Changing any constraint changes all others."]            │
└────────────────────────────────────────────────────────────┘
```

### Central Document

- Styled as a paper/document card: white (`--bg`) background, subtle shadow (`0 2px 12px rgba(0,0,0,0.06)`), 8px radius.
- Interior: 3–4 horizontal lines suggesting text (decorative, `--border` color, 1px height, varying widths).
- Label "PR/FAQ" below in DM Sans 0.8125rem, 700 weight.
- Subtitle "Boundary Object" in JetBrains Mono 0.55rem, uppercase, `--text-muted`.
- Size: ~100px × 80px.

### Constraint Domains

Four domains at cardinal positions around the document:
- **Top:** Research Capability — `--teal`
- **Right:** Customer Value — `--green`
- **Bottom:** Business Viability — `--accent`
- **Left:** Engineering Feasibility — `--blue`

Each domain rendered as a small card (rounded rect, domain color tint background, domain-colored top border) with an icon and label.

### Constraint Edges

SVG lines from each domain to the central document. Bidirectional arrows (small arrowheads at both ends). Line color matches the domain. Lines pass through the document card's border, not just to it — visually they converge inside the document.

On hover of any edge: the constraint text appears in the detail panel below (e.g., "Market viability depends on technical architecture. Technical architecture depends on target market segment.").

All six pairwise edges are present (not just the four cardinal-to-center edges). The four edges to the document are primary (thicker), but there are also fainter diagonal edges between non-adjacent domains, showing that ALL four are coupled.

### Interpretation Cards (Below)

4-column grid. Each card:
- Header: role name (DM Sans, 0.75rem, 600, domain color)
- Quote: the interpretation (serif, 0.875rem, `--text-mid`, in quotation marks)
- Background: `--bg-warm`

### Animation Sequence

1. **0–0.3s:** Central document card fades in with slight scale (0.95→1.0).
2. **0.3–0.7s:** Four domain cards radiate outward (translateY/X from center) and fade in, staggered.
3. **0.7–1.2s:** Constraint edges draw in from domains toward document.
4. **1.2–1.6s:** Interpretation cards grid fades in below.
5. **1.6s:** Callout annotation appears.

### Responsive

- **640px:** Diamond layout tightens. Interpretation cards switch to 2×2 grid.
- **420px:** Document and domains switch to a vertical list: Document card on top (large), then four domain cards stacked below with inline constraint descriptions. Interpretation cards become a single-column list. The spatial metaphor is sacrificed for legibility, but the coupling information is preserved.

---

## Diagram 5: VoDCaseComparison

**Position:** Section 05 ("Evidence" / "Two Cases").
**Argument:** Two independent cases (AWS Neptune ML, AstraZeneca 5R) achieved ~6× improvement through structurally identical mechanisms in radically different domains.

### Visual Concept

Two parallel horizontal timelines, vertically stacked. Between them, vertical dashed connector lines link structurally equivalent stages. The visual payoff: despite completely different domain language, the underlying mechanism is the same. The 6× figure anchors the right end of each timeline as the culminating visual element.

The convergence should feel striking, not incidental. The structural parallels drawn between the two timelines carry the argument — same mechanism, different vocabulary, same result.

### Layout

```
┌────────────────────────────────────────────────────────────┐
│              [eyebrow: Cross-Domain Evidence]               │
│     [title: Same mechanism. Same magnitude.]               │
│                                                             │
│  AWS AI LAB → NEPTUNE ML                           ┌────┐  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──┤ 6× │  │
│  │ Research  │──→│ PR/FAQ   │──→│ Business │──→│  └────┘  │
│  │ Artifact  │   │Translation│  │  Review  │   │ Shipped  │
│  │ (GNN/DGL)│   │           │   │          │   │ Feature  │
│  └──────────┘   └──────────┘   └──────────┘   └─────────┘ │
│       :              :              :                       │
│       : maturity     : boundary     : trading              │
│       :   gate       :  object      :   zone               │
│       :              :              :                       │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │ Research  │──→│ 5R Joint │──→│ Portfolio│──→│         │ │
│  │ Candidate │   │Assessment│   │  Review  │   │ ┌────┐  │ │
│  │           │   │          │   │          │   │ │ 6× │  │ │
│  └──────────┘   └──────────┘   └──────────┘   │ └────┘  │ │
│  ASTRAZENECA → 5R FRAMEWORK                    │ 4%→23% │ │
│                                                └─────────┘ │
│                                                             │
│  [callout: "Different domains. Same mechanism.              │
│   Same magnitude of improvement."]                         │
└────────────────────────────────────────────────────────────┘
```

### Timeline Styling

- Max width: 720px.
- Top timeline: `--teal` accent (tech/AI domain).
- Bottom timeline: `--green` accent (pharma/bio domain).
- Stage nodes: rectangular cards, 8px radius, tinted background (domain color at 8% opacity), 1.5px border (domain color at 30% opacity).
- Node labels: DM Sans 0.75rem, 600 weight, domain color for primary label, `--text-muted` for secondary.
- Arrow connectors between stages: thin line with small arrowhead, domain color.

### 6× Badges

The culminating element of each timeline. Large typography that draws the eye:
- Background: domain color at 12% opacity, full border in domain color.
- "6×" text: DM Sans, 2rem, 700 weight, domain color.
- Below: brief result description (serif, 0.75rem, `--text-mid`).

These should be the visually heaviest elements in the diagram — they're the punchline.

### Structural Parallel Connectors

Vertical dashed lines between equivalent stages:

| AWS Stage | AstraZeneca Stage | Shared Mechanism Label |
|---|---|---|
| Research Artifact | Research Candidate | Maturity Gate |
| PR/FAQ Translation | 5R Joint Assessment | Boundary Object |
| Business Review | Portfolio Review | Trading Zone |

Connectors: dashed line (`--text-faint`, 1px, dasharray 4 4). Label at midpoint: JetBrains Mono, 0.55rem, uppercase, `--text-muted`.

### Animation Sequence

1. **0–0.6s:** Top timeline stages appear left to right (0.12s stagger), with connecting arrows.
2. **0.3–0.9s:** Bottom timeline stages appear left to right (0.12s stagger, slightly delayed).
3. **0.9–1.2s:** Structural parallel connectors fade in between the timelines.
4. **1.2–1.5s:** 6× badges scale up slightly (0.9→1.0) and fade in. Brief pulse animation on the "6×" text (subtle shadow glow, one cycle).
5. **1.5s:** Callout appears.

### Responsive

- **640px:** Timeline stages reduce horizontal padding, labels truncate to abbreviations (e.g., "PR/FAQ" stays, "Translation" drops). 6× badges remain prominent.
- **420px:** Each timeline becomes a vertical card stack (4 cards top to bottom). The two stacks are shown sequentially (AWS first, then AZ), with a "Structural Parallels" card between them that lists the three shared mechanisms as a simple 3-row comparison. 6× badges remain visually dominant at the bottom of each stack.

---

## Diagram 6: VoDTradingZone

**Position:** Section 06 ("The AI Lab Experiment").
**Argument:** Current AI labs occupy different positions on a research-autonomy / product-integration landscape, with different risk profiles. The trading zone is the desirable (but hard) position.

### Visual Concept

A 2D positioning landscape — structurally similar to LCLandscapeQuadrant but differentiated by two key additions: trajectory arrows showing organizational movement over time, and risk-zone shading at the dangerous corners. This transforms a static quadrant into a dynamic analysis.

The trajectory arrows are the essential differentiator. Each organization isn't just positioned — it's moving. OpenAI is deepening its product capture. Meta FAIR is being pushed toward integration. Google DeepMind is navigating forced convergence. Anthropic is attempting the upper-right corner where both axes are high.

### Layout

```
┌────────────────────────────────────────────────────────────┐
│              [eyebrow: Organizational Landscape]            │
│     [title: Where the AI labs are heading.]                │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │ PRODUCT    ┌─────────────────────┐                   │  │
│  │ INTEGRATION│ PREMATURE LEGIBILITY│  ● OpenAI ←──     │  │
│  │   ↑        │ (Watson Health risk)│                   │  │
│  │   │        └─────────────────────┘                   │  │
│  │   │                                                  │  │
│  │   │              ● DeepMind ──→?                     │  │
│  │   │                                ┌──────────────┐  │  │
│  │   │                                │ TRADING ZONE │  │  │
│  │   │                                │  ● Anthropic │  │  │
│  │   │                                │   ──→↗       │  │  │
│  │   │                                └──────────────┘  │  │
│  │   │                                                  │  │
│  │   │  ● Meta FAIR ──→                                 │  │
│  │   │                                                  │  │
│  │   │        ┌─────────────────────┐                   │  │
│  │   │        │ FAILED TRANSITION   │                   │  │
│  │   │        │ (PARC, FAIR risk)   │                   │  │
│  │   └────────┴─────────────────────┴───────────────→   │  │
│  │              RESEARCH AUTONOMY                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [hover detail panel]                                      │
│                                                             │
│  [annotation: "The research engineer role creates           │
│   permanent residents of the trading zone."]               │
└────────────────────────────────────────────────────────────┘
```

### Field

- Aspect ratio: 4:3 (consistent with LCLandscapeQuadrant).
- Background: `--bg-warm`. Border: `1px solid --border`, 12px radius.
- X-axis: "Research Autonomy →" (left = low, right = high).
- Y-axis: "Product Integration ↑" (bottom = low, top = high).
- Axis labels: DM Sans, 0.6875rem, 600, uppercase, `--text-faint`.

### Organization Positions

| Org | X | Y | Color | Trajectory |
|---|---|---|---|---|
| OpenAI | 25% | 82% | `--red` | Arrow pointing further into top-left corner (deepening product capture) |
| Meta FAIR | 22% | 28% | `--teal` | Arrow pointing right and up (pushed toward integration post-2024) |
| Google DeepMind | 50% | 58% | `--text-muted` | Arrow with "?" — direction uncertain |
| Anthropic | 72% | 68% | `--accent` | Arrow pointing toward upper-right (attempting high on both) |

Each position rendered as:
- A filled dot (12px diameter, org color) with a subtle glow ring on hover.
- Label to the right: org name (DM Sans, 0.75rem, 600, org color) + brief descriptor below (DM Sans, 0.625rem, `--text-faint`).
- Trajectory arrow: short line (20–30px) from the dot in the direction of movement, with arrowhead. Same color as dot, slightly transparent (70% opacity). For DeepMind, the arrow terminates in "?" text rather than an arrowhead.

### Risk Zones

Two corner zones with semi-transparent shading:

- **Top-left (high integration, low autonomy):** `--red-dim` background fill over a ~25% × 25% rectangle. Label: "Premature Legibility" in DM Sans 0.625rem, `--red`, with subtext "(Watson Health)".
- **Bottom-left (low integration, low autonomy):** `--red-dim` background. Label: "Failed Transition" with subtext "(PARC, FAIR)".

Wait — reconsidering. The bottom-RIGHT should be the failed transition risk (high autonomy, low integration). Let me correct:

- **Top-left corner:** Premature legibility risk. High product integration + low research autonomy = research forced into product cadence before maturity.
- **Bottom-right corner:** Failed transition risk. High research autonomy + low product integration = brilliant research that never ships.

### Trading Zone Highlight

Upper-right area (high on both axes): subtle dashed border rectangle (`--accent` at 25% opacity), labeled "Trading Zone" in JetBrains Mono 0.55rem, uppercase. Anthropic positioned inside or near this zone. This is the aspirational target.

### Hover Detail

Below the field, consistent with LCLandscapeQuadrant pattern. On hover:
- Org name (bold, org color)
- Description: the organizational model and its consequences (serif, 0.875rem, `--text-mid`)

Hover descriptions:
- **OpenAI:** "Fully product-dominant. $12B revenue but significant research attrition. Safety processes subordinated to product cadence."
- **Meta FAIR:** "Separate-lab model. Extraordinary research output (PyTorch, Llama) but self-acknowledged transition failures."
- **Google DeepMind:** "Forced merger of competing labs. AlphaFold emerged from separation; integration may prevent the next AlphaFold."
- **Anthropic:** "Constitutional AI aligns research with product. Research engineer role creates permanent trading-zone residents."

### Animation Sequence

1. **0–0.4s:** Field background and axes fade in.
2. **0.4–0.8s:** Risk zone shadings fade in.
3. **0.6–1.2s:** Organization positions appear one by one (staggered 0.15s).
4. **1.2–1.6s:** Trajectory arrows draw from dots outward.
5. **1.4–1.8s:** Trading zone highlight fades in.
6. **1.8s:** Annotation appears below.

### Responsive

- **640px:** Field narrows, labels compress. Trajectory arrows shorten. Risk zone labels use abbreviated text.
- **420px:** Field retains aspect ratio but within narrower container. Org descriptors below labels hidden — available only on tap (mobile hover equivalent). Consider showing a condensed version where positions are still spatial but labels are numbers keyed to a legend below the field.

---

## Open Editorial Question: Resolution

The handoff raised whether to expand the prescription (research engineer role, Fraunhofer model) into a more actionable section. Having designed all six diagrams, my read:

**Don't expand.** The diagrams already carry the prescription implicitly. VoDMaturitySwitch provides the diagnostic framework ("when to protect, when to integrate"). VoDCouplingMechanism shows the mechanism (boundary objects in trading zones). VoDTradingZone shows Anthropic's research-engineer role as the exemplar. The diagrams make the prescriptive content more present than the prose alone does. Adding an explicit "what to do" section would weaken the essay's intellectual credibility — the diagnosis is the contribution, and the cases provide the evidence. Readers who want to act will extract the pattern. Readers who want to argue will engage the diagnostic frame. Both are served by the current structure.

The stronger editorial move: the annotation below VoDTradingZone should be the essay's implicit prescription. "The research engineer role creates permanent residents of the trading zone" is actionable enough without being prescriptive.

---

## Implementation Notes for Session Prompt

When this feeds into the Claude Code session:

1. All six components follow the `VoD[Name].tsx` naming convention.
2. Import shared utilities from `./shared/` (tokens, useInView).
3. Local accent constants defined once at the top of each file as `const VOD = {...}`.
4. No external dependencies — all icons are inline SVG.
5. All hover interactions include touch-friendly alternatives on mobile (tap to toggle detail, or show details inline when spatial layout collapses).
6. Each component includes a `<style>` block as first child with component-scoped class names (e.g., `vod-legibility-*`, `vod-funnel-*`).
7. MDX integration uses `client:visible` directive for all six islands.
8. SectionDividers: 01 through 07 per the essay structure.
9. Two PullQuotes at the positions marked in the draft.
