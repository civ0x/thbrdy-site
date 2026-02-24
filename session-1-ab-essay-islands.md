# Session 1: AB Essay Islands

## Situation

The AB Essay ("Absolute Beginners++") MDX has prose migrated and live at `/writing/ab-essay/`. Two interactive components were deferred — they exist in `reference/ab-essay.jsx` and need to be ported as Astro islands.

Session 0 established the island infrastructure:
- `src/components/islands/shared/` has `tokens.ts`, `useInView.ts`, `SectionDivider.tsx`, `PullQuote.tsx`
- Convention: essay-specific islands live in `src/components/islands/`, named `AB[ComponentName].tsx`
- Default hydration: `client:visible`
- All conventions documented in CLAUDE.md under "Island Architecture"

## Mission

Port both interactive components from `reference/ab-essay.jsx` into typed Astro islands, integrate them into the existing MDX at their correct positions, and verify the build.

## Technical notes

**Responsive styling pattern — make the call, then document it.**

The reference JSX uses 100% inline styles. Inline styles can't do media queries, so responsive handling requires a different mechanism. Two valid approaches:

1. **`useMediaQuery` hook** — a custom hook (e.g., `useBreakpoint`) in `shared/` that reads `window.innerWidth` and returns a breakpoint enum. Components branch their inline styles based on the return value. Keeps everything in React-land. Downside: no CSS transition between breakpoints, potential layout flash on hydration if SSR viewport doesn't match client.

2. **Injected `<style>` tag** — component renders a scoped `<style>` block with media queries targeting class names or data attributes on the component's root element. Keeps responsive logic in CSS where it belongs. Downside: slightly less colocated with the JSX structure.

Either approach is fine. What matters is consistency: Sessions 2–4 will port ~10 more components across three essays, and they all need to use the same pattern.

**Before writing any component code:**
1. Choose the responsive approach.
2. If it involves a shared utility (like a `useBreakpoint` hook), create it in `src/components/islands/shared/`.
3. Add a "Responsive Pattern" subsection to the "Island Architecture" section of CLAUDE.md documenting the choice, the rationale, and a usage example.

This is a gating step. Do not proceed to Step 2 until the pattern is chosen and documented.

## Components to port

### 1. ABConvergenceDiagram.tsx
**Source:** `reference/ab-essay.jsx` lines 112–314
**What it does:** A scroll-triggered diagram showing five problem-solving frameworks (Pólya, Boyd, Army, Bloom, Gee) converging on a three-layer structure (Orient / Execute / Reflect). Top section is a 5-column grid of framework cards. An SVG convergence arrow connects them to a 6-column comparison table below showing how each framework maps to the three layers. Caption at the bottom.
**Interactivity:** Scroll-triggered fade-in via `useInView`. No user-driven state. Framework data and layer data are static arrays defined within the component.
**Porting notes:**
- Import `useInView` and `tokens` from `./shared/`
- The layers array uses two hardcoded hex colors (`#2D5FD0` for Execute, `#5A3FBF` for Reflect) alongside `tokens.accent` for Orient. These are diagram-internal semantic colors per the design system ("3–4 additional hues used only inside diagrams to distinguish categories"). Keep them as local constants in the component — they don't belong in the global token set.
- The 5-column framework grid and 6-column table need responsive handling. Per the design system: "Horizontal layouts wrap to 2×2 then stack vertically at breakpoints." At narrow widths, the comparison table should stack — a 6-column grid won't work at 375px. Consider a card-based or accordion layout for mobile, or hide the table and show a simplified view. Use your judgment, but don't ignore it.

### 2. ABWrongFirstFlow.tsx
**Source:** `reference/ab-essay.jsx` lines 317–458
**What it does:** A horizontal 4-step process flow (Natural mistake → Recognition → Corrective move → Identity shift). Each step has an SVG icon in a circle, a label, and a description. A horizontal connecting line runs behind the icons. Below the flow is a callout card with a "Design decision" explanation.
**Interactivity:** Scroll-triggered fade-in via `useInView`. Steps stagger in sequence. No user-driven state.
**Porting notes:**
- Import `useInView` and `tokens` from `./shared/`
- The 4-column flow also needs responsive handling. Per the design system: "Process flows wrap to 2×2 then stack vertically." The connecting line logic will need to adapt at breakpoints.
- SVG icons are defined inline in the JSX. Keep them inline in the port — no need to extract to separate files.

## Integration into MDX

Read the existing MDX file. The prose is already structured with section breaks (`---` or section headings). Insert components at these positions, matching the original JSX layout:

- **After Section 02 prose** (after "All five describe the same three-layer structure"): `<ABConvergenceDiagram client:visible />`
- **After the ConvergenceDiagram and resumption prose** (after the domain walls paragraph): `<PullQuote client:visible>Method is the durable layer...</PullQuote>`
- **After Section 04 opening prose** (after "The key design decision was what I call wrong-first pedagogy."): `<ABWrongFirstFlow client:visible />`

The MDX will need import statements at the top for each component. Follow the CLAUDE.md import convention.

**Important:** The `SectionDivider` components are structural elements of the essay layout. Check the current MDX — if section breaks are rendered as `---` horizontal rules, replace them with `<SectionDivider client:visible number="01" label="The Pattern" />` etc., matching the section numbers and labels from the original JSX:
- 01 — The Pattern
- 02 — The Convergence
- 03 — The Expertise Problem
- 04 — The Product Problem
- 05 — The Open Question

If the MDX already uses SectionDivider, leave it as-is.

## Execution

### Step 1: Read sources and choose responsive pattern
Read `reference/ab-essay.jsx` in full and the current AB essay MDX. Understand the component structure and identify exact insertion points in the MDX. Then choose the responsive styling approach (see Technical notes), implement any shared utility, and document the decision in CLAUDE.md. This step gates all subsequent work.

### Step 2: Port ABConvergenceDiagram.tsx
- Create `src/components/islands/ABConvergenceDiagram.tsx`
- Convert from JSX to TSX with appropriate types
- Import shared utilities
- Add responsive breakpoint handling using the pattern chosen in Step 1

### Step 3: Port ABWrongFirstFlow.tsx
- Create `src/components/islands/ABWrongFirstFlow.tsx`
- Convert from JSX to TSX
- Import shared utilities
- Add responsive breakpoint handling using the pattern chosen in Step 1

### Step 4: Integrate into MDX
- Add import statements to the top of the MDX
- Insert components at the correct positions
- Add SectionDividers if not already present

### Step 5: Verify
- `astro build` passes clean
- `astro dev` — navigate to the essay, scroll through, confirm:
  - ConvergenceDiagram animates in when scrolled to
  - WrongFirstFlow animates in when scrolled to
  - PullQuote animates in
  - SectionDividers render correctly
  - No layout shifts or flash of unstyled content
  - Responsive: check narrower viewport widths for grid handling

### Step 6: Update STATUS.md and DECISIONS.md
Note Session 1 complete. AB Essay has two islands integrated. List remaining sessions. Record the responsive pattern decision in DECISIONS.md with rationale.

## Success criteria

- [ ] Responsive styling pattern chosen, documented in CLAUDE.md under "Island Architecture > Responsive Pattern"
- [ ] `ABConvergenceDiagram.tsx` exists, typed, builds clean
- [ ] `ABWrongFirstFlow.tsx` exists, typed, builds clean
- [ ] Both components render in the MDX with `client:visible`
- [ ] Scroll-triggered animations work (fade-in, stagger)
- [ ] PullQuote and SectionDividers integrated in the essay
- [ ] `astro build` passes with no warnings
- [ ] STATUS.md updated
- [ ] DECISIONS.md updated with responsive pattern rationale

## What NOT to do

- Do not modify the essay prose text. Only add component insertions.
- Do not add npm dependencies. Everything is HTML/CSS/intersection observer.
- Do not modify shared infrastructure files from Session 0 (except adding a shared responsive utility if the chosen pattern requires one).
- Do not port components for other essays.
- Do not over-engineer responsive handling — functional at 375px is the bar, not pixel-perfect.
- Do not proceed to component porting before the responsive pattern is chosen and documented.
