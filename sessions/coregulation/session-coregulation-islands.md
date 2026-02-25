# Session Prompt: Co-Regulation Essay Island Components

## Situation

The co-regulation essay (`src/content/writing/coregulation.mdx`) needs two interactive React island components. The essay is about a research program for technology-mediated physiological co-regulation — making one person's autonomic rhythm perceptible to another through Apple hardware. The two components visualize the essay's core structural arguments: (1) the evidence gradient from robust to nonexistent, and (2) the phased research program with explicit kill criteria at each gate.

Both components follow the established island architecture used in the Scholion and Notice essays. Reference `ScholionPositioningGrid.tsx` and `ScholionDependencyChain.tsx` for the exact patterns.

## Mission

Build two island components and wire them into the essay MDX file.

### Component 1: `CoRegEvidenceMap.tsx`

**Location:** `src/components/islands/CoRegEvidenceMap.tsx`

**Purpose:** Visualize the three-tier evidence gradient that structures section 02 of the essay. The reader needs to see spatially that the natural phenomenon is well-established, technology-mediated studies are promising but thin, and sham-controlled clinical evidence for mediated co-regulation *does not exist*. The emptiness of the bottom tier is the point — it's what justifies the research program.

**Structure:** Three horizontal bands stacked vertically, each with a tier label and research nodes inside.

**Tier 1 — "Well-Established" (top band)**
- Background: `var(--green-dim)`
- Left border or accent: `var(--green)`
- Contains 4 nodes (filled/solid style):
  - "Palumbo et al. 2017 — Systematic review, 52 studies: physiological linkage across HR, SC, respiration, HRV in diverse dyads"
  - "Feldman 2007 — Bio-behavioral synchrony: parent-infant heart rhythm synchronization during interaction"
  - "Goldstein et al. 2017 — Touch increases respiratory and cardiac coupling between romantic partners"
  - "Lehrer & Gevirtz 2014 — HRV biofeedback meta-analysis: Hedges' g = 0.83 for stress/anxiety reduction"

**Tier 2 — "Promising but Limited" (middle band)**
- Background: `var(--accent-dim)`
- Left border or accent: `var(--accent)`
- Contains 4 nodes (outlined/lighter style, visually less weight than tier 1):
  - "Frey et al. 2018 (Breeze) — Wearable breathing biofeedback sharing between dyads, n=21"
  - "Bögels et al. 2022 — Bidirectional physiological feedback > unidirectional for synchrony"
  - "Järvelä et al. — VR + shared physiological signals → enhanced empathy and social presence"
  - "Kleinbub et al. 2020 — Proposed interpersonal biofeedback for psychotherapy (not yet deployed)"

**Tier 3 — "Missing" (bottom band)**
- Background: `var(--red-dim)`
- Left border or accent: `var(--red)`
- Contains 2 nodes (dashed border, ghost/placeholder style — visually sparse):
  - "Sham-controlled trial of technology-mediated co-regulation"
  - "Clinical outcomes from mediated co-regulation (validated instruments)"
- This band should feel conspicuously empty compared to the others. The whitespace is the argument.

**Bottom annotation** (below the bands, inside the card):
- Text: "The research program exists to fill the bottom row."
- Style: `font-family: tokens.sans`, `font-size: 0.78rem`, `color: var(--text-light)`, centered, with a top border separator.

**Visual design rules:**
- Outer wrapper: `var(--bg-warm)` background, `1px solid var(--border)` border, `8px` border-radius (same card style as `ScholionPositioningGrid`).
- Mono uppercase header at top: "Evidence gradient for technology-mediated co-regulation"
- Each tier band has a left-side label (tier name) in `tokens.sans`, small, uppercase, colored to match the tier accent.
- Research nodes within each tier: small cards or pill-shaped elements. Each has a short title (bold, `tokens.sans`, ~0.72rem) and a one-line description (`tokens.sans`, ~0.65rem, `var(--text-light)`). Keep descriptions tight — one line max on desktop.
- Tier 1 nodes: solid background (`var(--bg)`), solid border (`var(--border-mid)`).
- Tier 2 nodes: `var(--bg)` background, border `var(--border)` — lighter than tier 1.
- Tier 3 nodes: transparent or very faint background, dashed border (`var(--red)` at ~0.3 opacity), text in `var(--red)` at reduced opacity.
- Nodes within each tier should wrap using flexbox (not grid) — they don't need to align across tiers.

**Animation:**
- `useInView(0.1)` on the outer container.
- Tiers fade in sequentially: tier 1 first, tier 2 ~0.15s later, tier 3 ~0.3s later.
- Nodes within each tier stagger-fade with ~0.06s delay per node.
- Standard easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- `opacity: 0 → 1`, `translateY(12px → 0)`.

**Responsive:**
- Injected `<style>` tag with scoped `.coreg-evidence-*` class names.
- Breakpoints: 640px (nodes shrink, descriptions may truncate), 420px (nodes stack single-column within each tier).
- Tier labels may move from left-side vertical to top-of-band horizontal on mobile.

**Data structure suggestion:**
```typescript
interface EvidenceNode {
  title: string;
  detail: string;
}
interface EvidenceTier {
  label: string;
  color: string;       // e.g., "var(--green)"
  colorDim: string;    // e.g., "var(--green-dim)"
  style: "solid" | "outlined" | "ghost";
  nodes: EvidenceNode[];
}
const tiers: EvidenceTier[] = [...]
```

---

### Component 2: `CoRegPhaseGate.tsx`

**Location:** `src/components/islands/CoRegPhaseGate.tsx`

**Purpose:** Visualize the staged-bets structure of the research program. The reader should see that each phase answers one question, has explicit success and kill criteria, and must pass a gate before the next phase begins. The visual weight should decrease for later phases — Phase 0 is concrete and imminent; Phase 3 is contingent and distant.

**Structure:** Vertical pipeline of 4 phase nodes connected by 3 gate nodes.

**Phase nodes:**

Each phase node is a card containing:
- Phase number (mono, small, uppercase, colored): "PHASE 0", "PHASE 1", etc.
- Question (serif, ~0.95rem, `var(--text)`): the single question this phase answers.
- Metadata row (sans, ~0.65rem, `var(--text-muted)`): timeline + cost + key deliverable, separated by middle dots or pipes.

Phase data:
1. **Phase 0** — "Can Apple hardware deliver bilateral physiological signal transmission with sufficient fidelity?" / 4–6 weeks · My time only · Working prototype on 2 device sets
2. **Phase 1** — "Does bilateral feedback produce greater autonomic synchrony than sham?" / 6–9 months · Academic collaborator · Manuscript-quality data from 30 dyads
3. **Phase 2** — "Does the effect accumulate with repeated use and work outside the lab?" / 6+ months · Grant-funded · 60 dyads over 6 weeks at home
4. **Phase 3** — "Wellness product or FDA De Novo classification?" / 1–3 years · Investor-funded · Regulatory submission or commercial launch

**Visual weight progression:**
- Phase 0: Full opacity, solid border (`var(--border-mid)`), `var(--bg)` background.
- Phase 1: Full opacity, solid border, `var(--bg)` background. (Still concrete — study design exists.)
- Phase 2: Slightly reduced opacity (~0.85), lighter border (`var(--border)`), `var(--bg-warm)` background.
- Phase 3: Further reduced opacity (~0.7), dashed border, `var(--bg-warm)` background.

**Gate nodes (between phases):**

Each gate is a horizontal element with two columns:
- **Left column (go criteria):** green accent. Header "GO IF" in mono/uppercase. 2–3 short criteria as compact text lines.
- **Right column (kill criteria):** red accent. Header "KILL IF" in mono/uppercase. 2–3 short criteria.

Gate data:
1. **Gate 0→1:**
   - Go: Breathing rate ±2 BPM accuracy · Latency <1s · Audio stable 20+ min · Convergence trend in dyad sessions
   - Kill: Accelerometer can't derive breathing rate · >20% session failure rate · Audio experience anxiety-inducing in >50% sessions
2. **Gate 1→2:**
   - Go: Real > sham respiratory PLV (p<0.05, d≥0.5) · Blinding holds (≤60% correct ID) · Subjective reports directionally support
   - Kill: No real vs. sham difference · Blinding fails (most participants distinguish) · Adverse reports in >20% sessions
3. **Gate 2→3:**
   - Go: Durable clinical outcomes on validated instruments · Effect accumulates with repeated use
   - Kill: No lasting effect after sessions end · Effect doesn't work remotely

Gate visual design:
- Background: split — `var(--green-dim)` on the left half, `var(--red-dim)` on the right half.
- Compact: these should be narrower/shorter than phase nodes. They're decision points, not content blocks.
- A thin vertical divider line between go and kill columns.
- Border-radius: 6px. A subtle 1px border matching the adjacent phase node borders.

**Connecting arrows between phases and gates:**
- Thin vertical line (1px, `var(--border-mid)`) connecting each element.
- Small arrow icon (↓) in mono, `var(--text-muted)`, centered on the line.
- Follow the exact pattern from `ScholionDependencyChain.tsx` (the `.scholion-chain-arrow` structure).

**Animation:**
- `useInView(0.1)` on the outer container.
- Elements fade in top-to-bottom with staggered delay: Phase 0 first, then Gate 0→1, then Phase 1, etc. ~0.12s stagger per element.
- `opacity: 0 → 1`, `translateY(12px → 0)`.
- Standard easing.

**Responsive:**
- Injected `<style>` with scoped `.coreg-phase-*` class names.
- Gate nodes: side-by-side go/kill columns on desktop → stacked on mobile (≤640px).
- Phase metadata row: horizontal on desktop → may wrap on mobile.
- Max-width on the whole component: ~520px, centered. (It's a vertical pipeline, not a wide layout.)

**Data structure suggestion:**
```typescript
interface Phase {
  number: number;
  question: string;
  meta: string;
  opacity: number;
  borderStyle: "solid" | "dashed";
}
interface Gate {
  goCriteria: string[];
  killCriteria: string[];
}
const phases: Phase[] = [...]
const gates: Gate[] = [...]
```

---

## MDX Integration

The MDX file (`src/content/writing/coregulation.mdx`) has already been updated with the imports and component placements. **Do not modify the MDX file.** Just build the two `.tsx` component files.

Current state of the MDX:
- Lines 12–13: imports for `CoRegEvidenceMap` and `CoRegPhaseGate` are already present.
- Line 45: `<CoRegEvidenceMap client:visible />` is already placed in section 02 (after the "What's missing" paragraph, before the PullQuote).
- Line 67: `<CoRegPhaseGate client:visible />` is already placed in section 04 (after the "Enthusiasm doesn't get to override evidence" paragraph, before the Phase 0 description).

## Technical Constraints

- TypeScript (`.tsx`), default export.
- Import `{ tokens }` from `"./shared/tokens"` and `{ useInView }` from `"./shared/useInView"`.
- Injected `<style>` tag as first child of root element for all CSS (including media queries).
- Scoped class names: `coreg-evidence-*` and `coreg-phase-*` respectively. No collisions with existing components.
- No animation libraries. CSS `transition` property only, driven by `inView` boolean.
- No icon libraries. Build any icons from HTML/CSS/SVG inline.
- No new dependencies.
- Inline styles only for animation states (`opacity`, `transform`) that depend on `inView`. All layout and responsive behavior in the `<style>` block.
- Media query breakpoints: `640px` (tablet), `420px` (phone).
- All text in structural/label/metadata roles uses `tokens.sans` or `tokens.mono`. Never serif for diagram text.
- Respect `prefers-reduced-motion` (handled automatically by `useInView` — it sets `inView = true` immediately).

## Verification

After building:
- [ ] `npm run build` succeeds with zero errors
- [ ] Both components render on the essay page at correct locations
- [ ] Evidence map: three tiers visible with decreasing visual weight top → bottom. Bottom tier feels sparse.
- [ ] Phase gate: four phases with three gates between them. Later phases visually lighter.
- [ ] Gate nodes show go (green) and kill (red) criteria side by side on desktop, stacked on mobile.
- [ ] Scroll animations fire once, staggered, with correct easing.
- [ ] No horizontal scroll on mobile (320px–420px viewport).
- [ ] No new dependencies in `package.json`.
- [ ] Class names don't collide with existing island components.
- [ ] Text is legible at all breakpoints — nothing truncated to unreadability.
