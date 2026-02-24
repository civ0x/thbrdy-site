# Session Prompt: VoD Island Redesign — Part B (CaseComparison + TradingZone)

## Situation

Two of the six VoD essay island components need visual redesign. The essay is live at `/writing/valley-of-death/`. The MDX file is `src/content/writing/valley-of-death.mdx`. Both components exist and are integrated; this session replaces the component internals while preserving the same default exports (no required props).

Static HTML prototypes exist for both redesigns:
- `working/vod-essay/prototype-case-comparison.html`
- `working/vod-essay/prototype-trading-zone.html`

Open each for visual reference — they define the target layout, hierarchy, and information architecture. Translate them into React TSX following the island architecture in CLAUDE.md.

## Mission

Rewrite two `.tsx` files in `src/components/islands/`:
1. `VoDCaseComparison.tsx` — full structural rewrite
2. `VoDTradingZone.tsx` — full structural rewrite

Each must: preserve the same default export name, use the shared infrastructure (`tokens`, `useInView`), follow the injected-`<style>` responsive pattern, and pass `npm run build` cleanly.

## Constraints (from CLAUDE.md)

- **No external libraries.** No D3, no charting libraries, no icon libraries.
- **Injected `<style>` tags** with component-scoped class names (e.g., `vod-case-*`, `vod-trading-*`).
- **Fonts:** DM Sans for labels/metadata, JetBrains Mono for eyebrows/section markers, Cormorant Garamond for prose-style text in detail panels.
- **Colors:** Use `tokens.*` values. Semantic colors (`--teal`, `--green`, `--blue`, `--red` with `-dim` variants) for diagram elements only.
- **Animation:** Scroll-triggered via `useInView(0.15)`. Opacity 0→1, translateY(12–20px → 0), staggered timing. Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Must respect `prefers-reduced-motion: reduce`.
- **Responsive breakpoints:** 640px (tablet), 420px (phone). Use injected CSS media queries, not JS hooks.
- **`<p>` tag caution:** `PostLayout.astro`'s `.post__content :global(p)` overrides island `<p>` margins. Use `<div>` for island elements that need custom margins (annotations, captions).
- **Inline SVGs only.** Build icons from `<svg>` elements directly. No lucide-react.

---

## Component 1: VoDCaseComparison

**File:** `src/components/islands/VoDCaseComparison.tsx`

**Argument:** Two independent cases (AWS Neptune ML, AstraZeneca 5R) achieved ~6× improvement through structurally identical mechanisms in radically different domains. The cross-domain convergence is the point.

**Current state:** Horizontal stage pills squeezed side-by-side with small 6× badges on the right edge. Structural parallels are tiny dashed lines between the timelines — easy to miss.

**Redesign (follow `prototype-case-comparison.html`):**

### Layout

1. **Hero convergence number** — "6×" in DM Sans 4rem bold (`--accent`), with descriptive text to the right: "improvement in transition rate, independently achieved across two radically different domains" (DM Sans 0.875rem, `--text-muted`). This is the first thing the reader sees. Display: flex, centered, gap 12px.

2. **Two-column case layout** — side-by-side (grid: `1fr 1fr`, gap `24px`).

   **Each case** has:
   - **Header card** with domain label (JetBrains Mono 0.55rem uppercase, `--text-muted`) and case name (DM Sans 0.875rem bold, domain color). Left border in domain color. Background in domain `-dim` color.
     - AWS: teal, "AI Research", "AWS AI Lab → Neptune ML"
     - AZ: green, "Pharma", "AstraZeneca → 5R Framework"
   - **Four stage cards** flowing vertically with `↓` arrow separators between them. Each stage card: `background: var(--bg-warm)`, rounded 6px, padding 10px 16px. Stage label (DM Sans 0.8125rem bold, `--text`), stage description below (DM Sans 0.6875rem, `--text-muted`). Last stage card gets a 3px left border in domain color to mark the outcome.

   Stage data (preserve from existing):
   ```
   AWS: Research Artifact → PR/FAQ Translation → Business Review → Shipped Feature
   AZ: Research Candidate → 5R Joint Assessment → Portfolio Review → Approved Drug
   ```

3. **Structural parallels section** — three rows bridging the two cases. Each row is a 3-column grid: `[AWS stage name, right-aligned, teal] — [mechanism label] — [AZ stage name, left-aligned, green]`.

   The mechanism label sits between two small dots connected by a line (CSS pseudo-elements), with the mechanism name below in JetBrains Mono 0.55rem uppercase (`--accent`):
   - Research Artifact ↔ Research Candidate → **Maturity Gate**
   - PR/FAQ ↔ 5R Assessment → **Boundary Object**
   - Business Review ↔ Portfolio Review → **Trading Zone**

   Rows separated by `border-bottom: 1px solid var(--border)`.

4. **Callout** at bottom.

### Data

```typescript
const awsStages = [
  { label: "Research Artifact", desc: "GNN/DGL — strong academic results, no productization path" },
  { label: "PR/FAQ Translation", desc: "Converted research language → product language" },
  { label: "Business Review", desc: "Structured visibility through leadership cadence" },
  { label: "Shipped Feature", desc: "Neptune ML — production, publicly documented", isFinal: true },
];

const azStages = [
  { label: "Research Candidate", desc: "Drug candidate with preclinical promise" },
  { label: "5R Joint Assessment", desc: "Right Target, Tissue, Safety, Patient, Commercial" },
  { label: "Portfolio Review", desc: "Joint scientific-clinical-commercial evaluation" },
  { label: "Approved Drug", desc: "Phase III completion, regulatory approval", isFinal: true },
];

const parallels = [
  { left: "Research Artifact", right: "Research Candidate", mechanism: "Maturity Gate" },
  { left: "PR/FAQ", right: "5R Assessment", mechanism: "Boundary Object" },
  { left: "Business Review", right: "Portfolio Review", mechanism: "Trading Zone" },
];
```

### Animation

- Hero 6×: fade in at `0s`
- Case headers: `0.2s` (AWS), `0.3s` (AZ)
- Stage cards: stagger within each case, `0.12s` intervals, starting at `0.3s` (AWS) and `0.5s` (AZ)
- Parallels: fade in at `1.0s`
- Callout: fade in at `1.4s`

### Responsive

- **≤560px:** Cases stack to single column (gap `32px`). Parallels section collapses to a card with labeled pairs (same as existing mobile parallels card).

### Interaction

- Hovering a stage card changes background to `--bg-card`. No detail panel — the descriptions are already visible inline.

---

## Component 2: VoDTradingZone

**File:** `src/components/islands/VoDTradingZone.tsx`

**Argument:** Current AI labs occupy different positions on a research-autonomy / product-integration spectrum, with different risk profiles. The "trading zone" (balanced research-product integration with boundary-spanning roles) is the structurally interesting position.

**Current state:** 2D scatter quadrant — the exact cliché the handoff warned against. Trajectory arrows are nearly invisible.

**Redesign (follow `prototype-trading-zone.html`):**

### Layout

1. **Horizontal spectrum** replacing the 2D quadrant. The key insight: "Research Autonomy" and "Product Integration" aren't truly independent axes for these orgs — they're roughly inverse. A 1D spectrum is more honest and avoids the quadrant cliché.

   - Axis labels: "← Product-Dominant" (left) and "Research-Autonomous →" (right), DM Sans 0.6875rem bold uppercase, `--text-faint`.
   - Axis bar: 4px tall, rounded, gradient background going from `rgba(166, 61, 47, 0.25)` at the edges to `var(--border)` at 25%/75%, `var(--accent-glow)` at center.
   - Risk labels below the axis at each end:
     - Left: "Premature legibility (Watson Health)" — DM Sans 0.6rem bold uppercase, `--red`
     - Right: "Failed transition (PARC, FAIR world models)" — same style, right-aligned

2. **Trading zone highlight** on the spectrum — a dashed-border rounded rectangle positioned from ~50% to ~85% of the axis width, with a tiny "Trading Zone" label (JetBrains Mono 0.5rem, accent at 50% opacity).

3. **Organization markers** on the spectrum axis — colored dots positioned at:
   - OpenAI: `left: 12%` (red dot)
   - Google DeepMind: `left: 40%` (text-muted dot)
   - Anthropic: `left: 62%` (accent dot, with accent glow ring to highlight it as the trading-zone occupant)
   - Meta FAIR: `left: 88%` (teal dot)

   Each dot has a label above it: org name (DM Sans 0.75rem bold, org color) and model descriptor (DM Sans 0.5625rem, `--text-faint`). Labels positioned with `position: absolute; top: -42px; transform: translateX(-50%)`.

4. **Organization detail cards** below the spectrum — a vertical stack of cards, one per org:
   - Grid: `auto 1fr auto` (dot | content | trajectory)
   - Dot: 10px circle in org color
   - Content: Name (DM Sans 0.8125rem bold, org color), model label (JetBrains Mono 0.55rem uppercase, `--text-muted`), description (Cormorant Garamond 0.9rem, `--text-mid`)
   - Trajectory: arrow + direction label (DM Sans 0.6875rem, `--text-faint`)
   - Background: `--bg-warm`, rounded 8px. Left border in org color (3px).
   - Anthropic card gets a subtly different background: `rgba(184, 134, 11, 0.04)` to draw the eye.

   Org data:
   ```typescript
   const orgs = [
     { name: "OpenAI", model: "Product-Dominant", position: 12, color: "var(--red)",
       detail: "$12B revenue but significant research attrition. Safety processes subordinated to product cadence. GPT-4o safety team got one week.",
       trajectory: "↙ More product" },
     { name: "Google DeepMind", model: "Forced Merger", position: 40, color: tokens.textMuted,
       detail: "Eliminated the autonomy buffer that produced AlphaFold. Whether this was wise depends on what you're optimizing for.",
       trajectory: "? Uncertain" },
     { name: "Anthropic", model: "Trading Zone Model", position: 62, color: tokens.accent,
       detail: "Constitutional AI aligns research with product. The research engineer role creates permanent residents of the trading zone between research and product.",
       trajectory: "↗ Dual track" },
     { name: "Meta FAIR", model: "Separate Lab", position: 88, color: "var(--teal)",
       detail: 'Extraordinary research (PyTorch, Llama) but self-acknowledged transition failures. LeCun: "Where Meta was less successful is in pushing research into products."',
       trajectory: "↙ Toward integration" },
   ];
   ```

5. **Callout** and **annotation** at bottom (preserve existing text).

### Animation

- Spectrum axis and labels: fade in at `0s`
- Org dots: stagger from `0.4s` (0.15s each, left to right)
- Trading zone highlight: fade in at `0.9s`
- Org detail cards: stagger from `1.0s` (0.12s each)
- Callout: fade in at `1.6s`
- Annotation: fade in at `2.0s`

### Responsive

- **≤560px:** Org labels above dots hide the sub-descriptor. Org detail cards hide trajectory column. Spectrum padding reduces.
- **≤420px:** Org dot labels above the spectrum switch to abbreviated names or hide entirely; a mobile legend card below the spectrum lists all orgs with tappable entries (similar to existing mobile legend approach).

### Interaction

- Hovering an org dot on the spectrum scales it up (1.3×).
- Hovering an org card changes background to `--bg-card`.
- Consider: clicking a dot scrolls the corresponding card into view (if the card list is long enough to need it — optional, skip if it adds complexity).

---

## Execution Order

1. `VoDCaseComparison.tsx` — full rewrite
2. `VoDTradingZone.tsx` — full rewrite

After each component, run `npm run build` to verify no errors.

## Verification Checklist

- [ ] `npm run build` — zero errors after each component
- [ ] Both components render on the essay page at `/writing/valley-of-death/`
- [ ] No new dependencies added (check `package.json`)
- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] CaseComparison: hero 6× number is visually prominent and the first thing you see
- [ ] CaseComparison: two-column case pipelines render with correct domain colors (teal/green)
- [ ] CaseComparison: structural parallels section bridges the two cases with mechanism labels
- [ ] CaseComparison: last stage card in each pipeline has left border accent
- [ ] TradingZone: 1D spectrum renders with four org dots at correct positions
- [ ] TradingZone: trading zone highlight visible between ~50-85% of axis
- [ ] TradingZone: Anthropic dot has accent glow ring
- [ ] TradingZone: four org detail cards below spectrum with correct content
- [ ] TradingZone: Anthropic card has subtly different background
- [ ] Mobile layouts (≤420px) are usable — no horizontal scroll, no clipped content
- [ ] Tablet layouts (≤640px) degrade gracefully
- [ ] Font assignments correct: DM Sans for labels, JetBrains Mono for eyebrows, Cormorant Garamond for detail text
- [ ] All colors reference `tokens.*` or CSS custom properties — no hardcoded hex except in local alpha variants
- [ ] Class names are component-scoped (`vod-case-*`, `vod-trading-*`)
- [ ] No `<p>` tags with custom margins — use `<div>` to avoid PostLayout override
