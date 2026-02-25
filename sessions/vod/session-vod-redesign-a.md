# Session Prompt: VoD Island Redesign — Part A (LegibilityGap + CouplingMechanism)

## Situation

Two of the six VoD essay island components need visual redesign. The essay is live at `/writing/valley-of-death/`. The MDX file is `src/content/writing/valley-of-death.mdx`. Both components exist and are integrated; this session replaces the component internals while preserving the same default exports (no required props).

A static HTML prototype exists for the CouplingMechanism redesign at `working/vod-essay/prototype-coupling-mechanism.html`. Open it for visual reference — it defines the target layout, hierarchy, and information architecture. Translate it into React TSX following the island architecture in CLAUDE.md.

## Mission

Rewrite two `.tsx` files in `src/components/islands/`:
1. `VoDLegibilityGap.tsx` — animation refinement (preserve layout)
2. `VoDCouplingMechanism.tsx` — full structural rewrite

Each must: preserve the same default export name, use the shared infrastructure (`tokens`, `useInView`), follow the injected-`<style>` responsive pattern, and pass `npm run build` cleanly.

## Constraints (from CLAUDE.md)

- **No external libraries.** No D3, no charting libraries, no icon libraries.
- **Injected `<style>` tags** with component-scoped class names (e.g., `vod-coupling-*`).
- **Fonts:** DM Sans for labels/metadata, JetBrains Mono for eyebrows/section markers, Cormorant Garamond for prose-style text in detail panels.
- **Colors:** Use `tokens.*` values. Semantic colors (`--teal`, `--green`, `--blue`, `--red` with `-dim` variants) for diagram elements only.
- **Animation:** Scroll-triggered via `useInView(0.15)`. Opacity 0→1, translateY(12–20px → 0), staggered timing. Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Must respect `prefers-reduced-motion: reduce`.
- **Responsive breakpoints:** 640px (tablet), 420px (phone). Use injected CSS media queries, not JS hooks.
- **`<p>` tag caution:** `PostLayout.astro`'s `.post__content :global(p)` overrides island `<p>` margins. Use `<div>` for island elements that need custom margins (annotations, captions).
- **Inline SVGs only.** Build icons from `<svg>` elements directly. No lucide-react.

---

## Component 1: VoDLegibilityGap

**File:** `src/components/islands/VoDLegibilityGap.tsx`

**Argument:** Research and product describe the same reality in mutually unintelligible vocabularies. The dependency bridges between them exist but are invisible until revealed.

**Current state:** Working CSS Grid layout with two columns and dashed bridge lines. The bridge reveal is a simple opacity fade — it doesn't feel like a revelation.

**Changes (preserve existing layout, improve animation staging):**

1. **Staged bridge reveal.** Currently all four bridges fade in simultaneously at `0.9s` delay. Instead, reveal them sequentially: bridge 0 at `1.2s`, bridge 1 at `1.5s`, bridge 2 at `1.8s`, bridge 3 at `2.1s`. Each bridge should also animate `scaleX(0) → scaleX(1)` with `transform-origin: left` so it visually "draws" from left to right.

2. **Bridge visual weight.** Increase bridge visibility: change `opacity: 0.6` to `opacity: 0.8` for the resting state (non-hovered). The current bridges are too faint at 0.6 to read as the diagram's key element.

3. **"Before/after" staging.** Add a brief initial state (first 1.0s after `inView` triggers) where only the two node columns are visible with no bridges — making the reader briefly experience the "two separate vocabularies" state before the bridges appear. Currently the bridges fade in so quickly after the nodes that you never feel the separation.

4. **Annotation timing.** Delay the annotation ("The bridges exist but are not expressed in either vocabulary.") to `3.0s` — it should arrive after all four bridges have appeared, as the conclusion to the visual sequence.

**Do NOT change:** Data arrays, node styling, mobile layout, hover tooltip behavior, the CSS Grid approach, color assignments.

---

## Component 2: VoDCouplingMechanism

**File:** `src/components/islands/VoDCouplingMechanism.tsx`

**Argument:** The PR/FAQ is a boundary object — different audiences read the same document differently, and it forces joint articulation of coupled constraints.

**Current state:** Generic hub-and-spoke with four cardinal domain cards around a central document icon. The "four readings" are a disconnected card grid below. The boundary-object concept (same artifact, different interpretations) is split into two visual sections that don't reinforce each other.

**Redesign (follow `prototype-coupling-mechanism.html`):**

Replace the entire visual structure:

### Layout

1. **Document card** at the top — a styled card with simulated text lines (4–6 thin gray bars of varying width), labeled "PR/FAQ" with subtitle "Coupling Device" in JetBrains Mono uppercase.

2. **Four lens panels** in a 2×2 grid directly below the document card, with 1px gap and rounded corners on the outer edges. Each lens panel represents one audience reading:
   - **Researcher** (teal-tinted background `rgba(42, 122, 106, 0.06)`): "Translation of my capability into language others can evaluate"
   - **Product Lead** (green-tinted `rgba(74, 122, 74, 0.06)`): "Feature proposal with customer need and competitive positioning"
   - **Engineer** (blue-tinted `rgba(42, 90, 138, 0.06)`): "System spec with architecture constraints and build cost"
   - **Executive** (accent-tinted `rgba(184, 134, 11, 0.06)`): "Investment case with risk profile and expected return"

   Each panel has: role label (DM Sans, 0.6875rem, uppercase, domain color), reading text (Cormorant Garamond italic, 0.95rem, `--text-mid`). Hover state deepens the background tint.

3. **Constraint grid** below, headed by a small mono label "Bidirectional Constraints". A 2×2 grid of constraint cards, each with:
   - Pair label (DM Sans 0.6875rem bold): e.g., "Research ↔ Customer"
   - Description (DM Sans 0.6875rem, `--text-muted`): e.g., "Technical capability determines what problems become solvable"
   - Left border on hover (3px, `--accent`)

4. **Callout** at the bottom with the existing text.

### Data

```typescript
const readings = [
  { role: "Researcher", text: "Translation of my capability into language others can evaluate", color: "var(--teal)", bg: "rgba(42, 122, 106, 0.06)", bgHover: "rgba(42, 122, 106, 0.12)" },
  { role: "Product Lead", text: "Feature proposal with customer need and competitive positioning", color: "var(--green)", bg: "rgba(74, 122, 74, 0.06)", bgHover: "rgba(74, 122, 74, 0.12)" },
  { role: "Engineer", text: "System spec with architecture constraints and build cost", color: "var(--blue)", bg: "rgba(42, 90, 138, 0.06)", bgHover: "rgba(42, 90, 138, 0.12)" },
  { role: "Executive", text: "Investment case with risk profile and expected return", color: "var(--accent)", bg: "rgba(184, 134, 11, 0.06)", bgHover: "rgba(184, 134, 11, 0.12)" },
];

const constraints = [
  { pair: "Research ↔ Customer", text: "Technical capability determines what problems become solvable" },
  { pair: "Research ↔ Engineering", text: "Research approach constrains implementation architecture" },
  { pair: "Research ↔ Business", text: "Novelty determines competitive positioning" },
  { pair: "Customer ↔ Engineering", text: "Customer requirements set performance targets" },
  { pair: "Customer ↔ Business", text: "Market size justifies investment" },
  { pair: "Engineering ↔ Business", text: "Build complexity determines timeline and cost" },
];
```

### Animation

- Document card: fade in at `0s`
- Lens panels: stagger from `0.3s` (0.1s each)
- Constraint grid: fade in at `0.8s`
- Callout: fade in at `1.2s`

### Responsive

- **≤640px:** Lens grid becomes 1-column (stack). Constraint grid stays 2-column.
- **≤420px:** Both grids become 1-column.

### Interaction

- Hovering a lens panel deepens its background tint. No other hover state needed.
- Hovering a constraint card adds a left border accent. These are lightweight — no detail panel needed.

---

## Execution Order

1. `VoDLegibilityGap.tsx` — smallest change, warm up
2. `VoDCouplingMechanism.tsx` — full rewrite

After each component, run `npm run build` to verify no errors.

## Verification Checklist

- [ ] `npm run build` — zero errors after each component
- [ ] Both components render on the essay page at `/writing/valley-of-death/`
- [ ] No new dependencies added (check `package.json`)
- [ ] All animations respect `prefers-reduced-motion: reduce`
- [ ] LegibilityGap: bridges reveal sequentially with scaleX draw animation, 1.2s delay before first bridge
- [ ] LegibilityGap: annotation appears at 3.0s after all bridges
- [ ] LegibilityGap: mobile layout unchanged
- [ ] CouplingMechanism: document card → lens grid → constraint grid layout renders correctly
- [ ] CouplingMechanism: four lens panels show distinct domain-tinted backgrounds
- [ ] CouplingMechanism: hover deepens lens tint, adds constraint card left border
- [ ] Mobile layouts (≤420px) are usable — no horizontal scroll, no clipped content
- [ ] Tablet layouts (≤640px) degrade gracefully
- [ ] Font assignments correct: DM Sans for labels, JetBrains Mono for eyebrows, Cormorant Garamond for detail text
- [ ] All colors reference `tokens.*` or CSS custom properties — no hardcoded hex except in local alpha variants
- [ ] Class names are component-scoped (`vod-legibility-*`, `vod-coupling-*`)
- [ ] No `<p>` tags with custom margins — use `<div>` to avoid PostLayout override
