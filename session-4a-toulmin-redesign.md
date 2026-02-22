# Session 4a: Toulmin Diagram Redesign

## Kickoff

Read `CLAUDE.md`, `STATUS.md`, and this file, then execute.

## Situation

The `ScholionToulminDiagram.tsx` component (built in Session 4) doesn't work. It renders six color-coded cards in a CSS grid, but without visible connection lines the relationships are illegible. The qualifier and rebuttal connection labels are `display: none` — they never render. All six cards have equal visual weight, so there's no hierarchy. A reader unfamiliar with Toulmin learns nothing from looking at it.

The diagram's purpose is pedagogical: teach the reader the six Toulmin argument components and how they relate, using a concrete AI safety example, before the essay explains how Scholion extracts this structure computationally.

## Mission

Replace the current `ScholionToulminDiagram.tsx` with a redesigned version that makes the logical structure immediately graspable. No changes to any other files — the MDX import and placement are already correct.

## Design

**Core principle:** The Claim is the center of gravity. Everything else relates to it. The visual hierarchy must reflect this.

**Layout — vertical flow, top to bottom:**

```
┌─────────────────────────────────────────────────┐
│  CLAIM (gold, large, dominant)                   │
│  "This AI system is safe to deploy at ASL-3"     │
│                                                   │
│  ┌─ given that ─────────────────────────────┐    │
│  │ Current threat models and eval coverage   │    │
│  └───────────────────────────────────────────┘    │
│  ┌─ unless ─────────────────────────────────┐    │
│  │ Capability jumps between eval cycles      │    │
│  └───────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
                      │
                 supports ↑
                      │
         ┌────────────┴────────────┐
         │                         │
   ┌─────┴─────┐            ┌─────┴─────┐
   │   DATA    │            │  WARRANT  │
   │  (blue)   │            │  (green)  │
   └───────────┘            └─────┬─────┘
                                  │
                            on account of ↑
                                  │
                            ┌─────┴─────┐
                            │  BACKING  │
                            │  (teal)   │
                            └───────────┘
```

**Detailed specifications:**

### Claim card (top, dominant)
- Full width of the diagram container
- Background: `var(--accent-dim)`, border: `2px solid var(--accent)`
- Label: "CLAIM" in mono, uppercase, gold, 0.6rem
- Text: serif, 1.05rem, `var(--text)` — larger than other cards to signal primacy
- **Qualifier and Rebuttal are inline modifiers inside the Claim card**, not separate boxes. They appear as small sub-blocks at the bottom of the Claim card:
  - Each modifier: a thin left border in its role color (muted for qualifier, red for rebuttal), small padding-left, mono label ("GIVEN THAT" / "UNLESS") at 0.5rem, sans text at 0.72rem
  - Qualifier color: `var(--text-muted)` border
  - Rebuttal color: `var(--red)` border
  - Stack vertically inside the Claim card with 0.5rem gap
  - Separated from the Claim text by a subtle `var(--border)` horizontal rule

### Vertical connector (Claim → Data/Warrant row)
- Centered vertical line: 1px solid `var(--border-mid)`, 24px tall
- Small upward arrow (↑) at the top
- Label: "supports" in mono, 0.5rem, `var(--textFaint)`, centered below the line

### Data and Warrant cards (middle row, side by side)
- Two cards in a row, equal width, 0.75rem gap between them
- Each card: role-colored dim background, 1px role-colored border, border-radius 6px
- Label: role name in mono, uppercase, role color, 0.55rem
- Text: sans, 0.78rem, `var(--text-mid)`
- Data: blue treatment (`var(--blue)` / `var(--blue-dim)`)
- Warrant: green treatment (`var(--green)` / `var(--green-dim)`)

### Vertical connector (Warrant → Backing)
- Right-aligned under the Warrant card (not centered on the full width)
- Same style as the upper connector: 1px line, 24px, arrow, label "on account of"

### Backing card (bottom, under Warrant)
- Aligned with the Warrant card (right half of the layout)
- Teal treatment (`var(--teal)` / `var(--teal-dim)`)
- Same card styling as Data/Warrant

### Container
- Warm background (`var(--bg-warm)`), 1px `var(--border)` border, 8px radius
- Title: "Anatomy of a Toulmin argument · AI safety example" — mono, 0.58rem, uppercase, muted, centered
- Padding: 2.5rem 2rem desktop, 1.5rem 1rem mobile

### Content (same as current)
- Claim: "This AI system is safe to deploy at ASL-3"
- Data: "Capability evaluations show performance below dangerous thresholds"
- Warrant: "If evaluations are below threshold, deployment is safe"
- Backing: "Evaluation methodology validated against known dangerous capabilities"
- Qualifier: "Current threat models and evaluation coverage"
- Rebuttal: "Capability jumps occur between evaluation cycles"

### Animation
- Staggered reveal on scroll via `useInView`:
  1. Claim card (with qualifier/rebuttal) appears first (delay 0)
  2. Upper connector fades in (delay 0.2s)
  3. Data + Warrant cards appear (delay 0.3s)
  4. Lower connector fades in (delay 0.45s)
  5. Backing card appears (delay 0.55s)
- Each card: opacity 0→1, translateY(12px→0), 0.5s ease
- Connectors: opacity only, 0.4s ease

### Responsive
- **Desktop (>640px):** Full spatial layout as described above
- **Tablet/Phone (≤640px):**
  - Claim card remains full width with inline modifiers
  - Data and Warrant stack vertically (single column) instead of side by side
  - Backing card becomes full width
  - Connectors become simpler (shorter lines, labels still visible)
  - "on account of" connector centers under Warrant card

## Technical Constraints

- Replace the existing file: `src/components/islands/ScholionToulminDiagram.tsx`
- Import shared utilities: `tokens` from `./shared/tokens`, `useInView` from `./shared/useInView`
- Scoped class names: `scholion-toulmin-*`
- Injected `<style>` tag for responsive handling
- No animation libraries, no icon libraries
- Connection lines via CSS pseudo-elements or plain divs — NOT SVG
- Respect `prefers-reduced-motion` (handled by `useInView`)

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] Claim card is visually dominant (larger text, full width, prominent border)
- [ ] Qualifier and Rebuttal render as inline modifiers INSIDE the Claim card, not separate boxes
- [ ] Vertical connection line visible between Claim and Data/Warrant row
- [ ] "supports" label visible on the connector
- [ ] Data (blue) and Warrant (green) render side by side on desktop
- [ ] Vertical connection line from Warrant to Backing, right-aligned
- [ ] "on account of" label visible on the lower connector
- [ ] Backing (teal) renders aligned under Warrant
- [ ] Staggered animation: Claim first, then connectors, then Data/Warrant, then Backing
- [ ] Mobile (≤640px): cards stack vertically, no horizontal overflow
- [ ] No new dependencies added
- [ ] Background is `var(--bg-warm)` on the container — no pure white
