# Session Prompt: Replace VoDSequentialFunnel with Transformation Prototype

## Situation

The current `VoDSequentialFunnel.tsx` is a static side-by-side layout: sequential list on the left, diamond graph on the right, ghost edges showing hidden connections. It works but it doesn't make the reader *feel* the information loss.

A working prototype at `prototypes/vod-funnel-transform.html` demonstrates a superior interaction pattern: a toggle that *transforms* between the two views, animating nodes from vertical stack to diamond layout and revealing/collapsing edges. The transformation-as-argument pattern makes the information loss visceral rather than comparative. Click-to-select nodes show mode-sensitive explanations. Fat SVG hit targets enable edge hover on both mouse and touch.

This session replaces the existing production component with a React island that ports the prototype's behavior.

## Mission

Replace `src/components/islands/VoDSequentialFunnel.tsx` with a new implementation that ports the transformation prototype. The MDX import and usage in `src/content/writing/valley-of-death.mdx` should not need to change — same component name, same default export, same `client:visible` directive.

## Source of Truth

**`prototypes/vod-funnel-transform.html`** — this is the canonical reference for behavior, data, positions, and visual design. Port it faithfully. The prototype uses vanilla JS; convert to React idioms (useState, useRef, useEffect for event listeners) but preserve the interaction model exactly.

## What the Prototype Does

1. **Toggle** between "Sequential" and "Actual" views via a labeled switch control.
2. **Node transformation:** 4 nodes animate from vertical stack (sequential) to diamond layout (actual) and back. Positions are defined as percentages within an aspect-ratio container.
3. **Edge animation:** 3 sequential edges visible in both modes. 3 additional edges collapse to zero-length midpoints in sequential mode and expand in actual mode. All edges use colored SVG lines.
4. **Gate markers:** Small diamond + "Gate N" labels appear between sequential nodes, fade out in actual mode.
5. **Edge count:** Large number + label updates on toggle (3 → 6, "visible connections" → "bidirectional dependencies").
6. **Lost edges panel:** Shows struck-through chips for the 3 hidden edges in sequential mode, collapses in actual mode.
7. **Edge hover:** Fat invisible SVG hit targets (stroke-width 18) over visible lines. Hover highlights the edge and shows its label in a detail panel below.
8. **Node click:** Click a node to select it. Shows a mode-sensitive explanation panel (different text for sequential vs actual view). Connected edges highlight, others dim. Click again or click outside to deselect. Selection persists across toggle so explanation updates to new framing.
9. **Callout:** Summary text at bottom updates to reflect current mode.

## Data

Copy the node data, edge data, positions, gate positions, edge colors, and all explanation text directly from the prototype. The data model is:

- 4 nodes: research, market, engineering, executive — each with `seq` and `actual` explanation strings
- 6 edges: 3 sequential (forward chain), 3 non-sequential (cross-connections)
- Sequential positions: vertical stack at x=50%, y evenly spaced
- Actual positions: diamond at x/y extremes
- 3 gate positions between sequential nodes

## Technical Constraints

Standard island architecture per `CLAUDE.md`:

- **Imports:** `useState` from `react`, `tokens` from `./shared/tokens`, `useInView` from `./shared/useInView`
- **CSS:** Injected `<style>` block as first child of root. Class names scoped as `vod-funnel-*`.
- **Animation easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — matches the prototype.
- **Responsive:** 640px and 420px breakpoints. At 420px, diagram container switches to square aspect-ratio and node labels shrink.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` sets all transition-duration to 0.01s.
- **Scroll reveal:** `useInView(0.15)` for initial appearance, then toggle is interactive.
- **No external dependencies.** No icon libraries. SVG edges are `<line>` elements.
- **Default export.**
- **TypeScript (`.tsx`).**

## Key Implementation Notes

1. **SVG viewBox** must match the aspect-ratio container. Prototype uses `viewBox="0 0 680 510"` with `aspect-ratio: 4/3`. Node positions are percentages converted to SVG coordinates via `pctToSvg()`.

2. **Hit targets** are separate transparent SVG `<line>` elements with `strokeWidth={18}` and `pointerEvents="stroke"`, layered above visible edges. The visible edges have `pointerEvents="none"`.

3. **Node click vs edge hover** are independent interactions. Both can be active simultaneously. Edge hover updates the hover-detail panel; node click updates the node-explain panel.

4. **Toggle via label click** — clicking "Sequential" or "Actual" labels also toggles, not just the switch track.

5. **`aria-checked`** and keyboard support (Enter/Space) on the toggle for accessibility.

6. **Node positions** use CSS `left`/`top` percentages with `transform: translate(-50%, -50%)` for centering, not SVG positioning. Nodes are HTML divs overlaid on the SVG edge layer.

## Verification Checklist

After implementation:

- [ ] `npm run build` passes with zero errors
- [ ] Toggle animates nodes between vertical stack and diamond layout
- [ ] 3 edges visible in sequential, 6 in actual
- [ ] Gate markers visible in sequential, hidden in actual
- [ ] Edge hover shows label in detail panel (both modes)
- [ ] Node click shows mode-sensitive explanation
- [ ] Selecting a node, then toggling mode, updates explanation text
- [ ] Lost-edges panel visible in sequential, hidden in actual
- [ ] Edge count number and label update on toggle
- [ ] Keyboard: Enter/Space on toggle, arrow keys if focused
- [ ] Reduced motion: all transitions collapse to instant
- [ ] Mobile 420px: aspect-ratio changes, labels shrink
- [ ] No new dependencies in `package.json`
