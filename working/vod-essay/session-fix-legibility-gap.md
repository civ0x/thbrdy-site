# Session Prompt: Fix VoDLegibilityGap

## Situation

The `VoDLegibilityGap.tsx` island component has been built but has several rendering issues that undermine the diagram's communicative intent. The component is at `src/components/islands/VoDLegibilityGap.tsx`. The design spec is at `working/vod-essay/design-pass-diagrams.md` (Diagram 1) and the original session prompt is at `working/vod-essay/session-vod-islands.md` (Component 1).

## Mission

Fix five specific issues in `VoDLegibilityGap.tsx`, then verify with `npm run build`.

## Issues to Fix

### 1. Node text alignment

**Problem:** Text inside nodes is left-aligned. In a symmetric two-column diagram, node content should be center-aligned.

**Fix:** Add `text-align: center` to `.vod-legibility-node`. Both the label (`node-label`) and description (`node-desc`) should center within the node.

### 2. Node height consistency

**Problem:** Nodes have variable heights because content length differs (e.g., "Competitive Advantage / Defensible position" is taller than "Citations / Field influence"). This causes cumulative vertical misalignment of the bridge endpoints across rows.

**Fix:** Set a fixed `min-height` on `.vod-legibility-node` so all nodes are the same height. Something like `min-height: 54px` with `display: flex; flex-direction: column; justify-content: center` to vertically center the text within the fixed-height box. Verify visually that no content overflows — if it does, increase the min-height.

### 3. Within-column connector lines not centered on nodes

**Problem:** The vertical connector lines between nodes within each column appear visually off-center relative to the nodes. The column uses `align-items: center`, which centers the 1px connector div geometrically. But because the text content inside nodes is left-aligned (issue #1), the visual weight sits left-of-center, making the connector look misaligned.

**Fix:** Fixing issue #1 (center-aligning text) should resolve this. After that fix, verify that the connectors visually align with the center of the nodes. If they still look off, the connector div may need explicit `margin: 0 auto` or `align-self: center`.

### 4. Bridges not centered on node pairs

**Problem:** The SVG bridge overlay uses hardcoded coordinates in a `viewBox="0 0 680 ${totalHeight}"` with `preserveAspectRatio="none"`. Bridge X endpoints are hardcoded at `leftX = 240` and `rightX = 440`, and Y positions are computed from a fixed `nodeHeight = 58` assumption. These coordinates don't match the actual rendered positions of the nodes, and the `preserveAspectRatio="none"` causes non-uniform scaling that distorts bridge positions at different viewport widths.

**Fix:** Replace the hardcoded coordinate system with one that aligns to the actual layout. The recommended approach:

- Remove `preserveAspectRatio="none"`.
- Use `viewBox="0 0 100 100"` with percentage-based coordinates that match the flex layout.
- Compute bridge X endpoints based on the column widths and gap. The columns container is `display: flex; justify-content: center; gap: 160px` with two 240px columns. So the right edge of the left column is at `(containerWidth/2 - gap/2)` and the left edge of the right column is at `(containerWidth/2 + gap/2)`. In percentage terms within a 680px container: left column right edge ≈ 35.3%, right column left edge ≈ 64.7%. Convert to viewBox coordinates.
- Compute bridge Y positions from the fixed node heights established in issue #2, plus connector spacing. Each node center Y = `(nodeIndex * totalStepHeight) + (fixedNodeHeight / 2)`, expressed as a percentage of total column height.

Alternatively, a simpler approach: use the same absolute-positioned `<div>` approach but draw the bridges as absolutely-positioned dashed border elements (CSS-only) rather than SVG. Each bridge could be a `<div>` with `border-top: 1.5px dashed var(--accent)` positioned at the vertical midpoint of each node row, spanning from the right edge of the left column to the left edge of the right column. This avoids SVG coordinate alignment entirely.

Whichever approach you choose, the bridges must:
- Start at the right edge (horizontal center is acceptable too) of each left-column node
- End at the left edge (horizontal center is acceptable too) of the corresponding right-column node
- Be vertically centered on each node pair
- Not distort at different viewport widths

For the S-curve appearance, if staying with SVG, use cubic bezier paths where the left endpoint Y and right endpoint Y are computed independently (they should be the same if nodes have fixed heights, but compute them separately for robustness):

```
M ${leftX} ${leftY} C ${leftX + curveOffset} ${leftY}, ${rightX - curveOffset} ${rightY}, ${rightX} ${rightY}
```

With `curveOffset` around 30-40% of the gap width.

### 5. Missing bridge for the last node pair (Citations ↔ Revenue Model)

**Problem:** The fourth bridge (index 3, connecting Citations to Revenue Model) is not visible in the rendered output. The bridge data array has four entries and the map renders all four, so the SVG path is being created. The issue is that the path's Y position (`3 * 90 + 29 = 299`) may extend beyond the visible area of the SVG, or the `preserveAspectRatio="none"` scaling is pushing it out of view.

**Fix:** This should be resolved by fixing issue #4 (bridge coordinate system). Once bridges use coordinates that match the actual layout, all four bridges will be visible. After fixing, explicitly verify that all four bridges render and align with their respective node pairs.

### 6. Annotation spacing and centering

**Problem:** The annotation quote ("The bridges exist but are not expressed in either vocabulary.") lacks sufficient vertical separation from the diagram grid above it. The `margin: 2rem auto 0` doesn't provide enough breathing room for the quote to read as a distinct concluding element rather than something crowded against the bottom of the diagram.

**Fix:** Increase the top margin on `.vod-legibility-annotation` to `3rem` or `3.5rem`. Verify the annotation is visually balanced — it should feel like a pause after the diagram, not an afterthought. Also add a small bottom margin (`1rem`) so the component's total vertical rhythm feels complete.

## Verification Checklist

After all fixes:

- [ ] `npm run build` — zero errors
- [ ] All eight nodes (four per column) render at the same height
- [ ] Text within all nodes is center-aligned
- [ ] Within-column connector lines are visually centered between nodes
- [ ] All four dashed bridges are visible
- [ ] Each bridge is vertically centered on its corresponding node pair
- [ ] Bridges don't distort or misalign when the viewport is narrower than 680px
- [ ] Hover tooltips still appear at bridge midpoints
- [ ] Mobile layout (≤420px) still shows stacked pair cards correctly
- [ ] Annotation quote has sufficient vertical separation from the diagram (~3rem+)
- [ ] Annotation feels like a distinct concluding element, not crowded
- [ ] Animation timing unchanged: nodes first, bridges delayed to ~0.9s
- [ ] No new dependencies added

## Constraints

- Do not change the data (node labels, descriptions, bridge labels)
- Do not change the animation timing or easing
- Do not change the color scheme or font choices
- Do not change the mobile layout structure
- Preserve the hover tooltip behavior
- Follow all rules in `CLAUDE.md` (island architecture, scoped class names, injected styles, etc.)
