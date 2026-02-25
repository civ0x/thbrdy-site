# Session 3b: LC Landscape Quadrant Fix + Divider Cleanup

## Situation

Session 3 built the LC essay islands. Session 3a realigned the diagrams to their correct sections. Two issues remain:

1. The LandscapeQuadrant diagram has an inverted Y-axis that makes it read backwards
2. Three horizontal line dividers stack up visually above the Landscape section (between the PullQuote and Section 03)

Read `CLAUDE.md` and `src/content/writing/learned-compilation.mdx` before making changes.

## Files to modify

- `src/components/islands/LCLandscapeQuadrant.tsx` (quadrant axis fix)
- `src/content/writing/learned-compilation.mdx` (divider cleanup)

## Fix 1: Flip the Y-axis on LCLandscapeQuadrant

### Problem

The Y-axis has "Heuristic" at the top and "Learned" at the bottom. The dot positioning uses `top: ${100 - sys.y}%` to flip from data coordinates to CSS coordinates. This means high `y` values (more learned) render near the bottom of the chart. The dashed target zone is positioned at `bottom: 40px` to catch the "Joint Planner" dot.

The result: the aspiration quadrant (learned + all four spaces) is in the bottom-right corner, which reads as the *least* important position in a standard scatter plot. Readers expect upper-right = best.

### Fix

Flip the axis so "Learned" is at the top and "Heuristic" is at the bottom. This requires four coordinated changes:

**a) Swap the Y-axis tick labels:**

Current (line ~210–211):
```tsx
<div className="lc-landscape-tick" style={{ left: 32, top: "16%" }}>Heuristic</div>
<div className="lc-landscape-tick" style={{ left: 32, top: "82%" }}>Learned</div>
```

Change to:
```tsx
<div className="lc-landscape-tick" style={{ left: 32, top: "16%" }}>Learned</div>
<div className="lc-landscape-tick" style={{ left: 32, top: "82%" }}>Heuristic</div>
```

**b) Remove the Y-coordinate inversion on dot positioning:**

Current (line ~242):
```tsx
top: `${100 - sys.y}%`,
```

Change to:
```tsx
top: `${sys.y}%`,
```

**c) Invert the Y-coordinates in the data to match the new axis direction:**

The data currently has high `y` = learned. With the axis flipped, we need high `y` values to map to the bottom (heuristic) and low `y` values to the top (learned). Easiest approach: invert each system's `y` value so the data directly represents the CSS top-offset.

Current system data `y` values and their meaning:
```
xla:       y: 24  (heuristic)     → should be near bottom → new y: 76
torchc:    y: 34  (heuristic)     → should be near bottom → new y: 66
alpa:      y: 40  (mixed)         → middle area          → new y: 60
unity:     y: 52  (mixed)         → middle area          → new y: 48
go:        y: 78  (learned)       → should be near top   → new y: 22
mlgo:      y: 82  (learned)       → should be near top   → new y: 18
planner:   y: 85  (fully learned) → should be at top     → new y: 15
```

The new values are `100 - oldY`, keeping relative positions identical but now mapping directly to CSS `top` percentage.

**d) Reposition the target zone:**

Current:
```css
.lc-landscape-target {
  right: 2%;
  bottom: 40px;
  width: 28%;
  height: 40%;
}
```

Change to:
```css
.lc-landscape-target {
  right: 2%;
  top: 0;
  width: 28%;
  height: 40%;
}
```

The target zone should be in the upper-right quadrant (learned + all four spaces coupled).

**e) Reposition the horizontal quadrant divider:**

Current:
```css
.lc-landscape-divider-h {
  top: 55%;
}
```

This divided heuristic (top) from learned (bottom). With the flip, the divider position stays at 55% but now divides learned (top) from heuristic (bottom), which is still roughly correct. Verify visually — if it looks off, adjust to ~45% so the divider sits between the learned cluster (GO, MLGO, planner) and the mixed cluster (Alpa, Unity).

## Fix 2: Additional quadrant refinements

### Nudge overlapping labels

Alpa (`x: 55, y: 40`) and Unity (`x: 52, y: 52`) have close positions. After the Y-flip they'll be at `x: 55, top: 60%` and `x: 52, top: 48%` — 12 percentage points apart vertically, which should be fine. But verify the labels don't overlap at narrow widths.

XLA (`x: 12, y: 24`) renders close to the left axis label. After the flip it's at `top: 76%` — near the bottom-left corner. Verify the label doesn't collide with the X-axis tick "1" at `left: 14%`.

MLGO (`x: 15, y: 82`) renders at `top: 18%` after the flip — near the top-left. Its label extends to the right and may collide with the vertical divider at `left: 38%`. If so, nudge MLGO's `x` to 18 or 20.

### Soften the dashed target zone

The dashed box is visually dominant. Reduce its presence:
- Change border from `2px dashed` to `1.5px dashed`
- Reduce background opacity: change `LC.accentBg` from `#3A7CA506` to `#3A7CA504` (or just use `transparent`)
- If this makes it too subtle, keep the current values — err on the side of visible but not dominant

## Fix 3: Remove stacked dividers above Landscape section

### Problem

Three horizontal lines stack visually between sections 02 and 03:
1. PullQuote bottom decorative bar
2. PullQuote bottom margin space
3. SectionDivider 03 horizontal rule

This creates an awkward triple-line effect above "The Landscape."

### Fix

In `learned-compilation.mdx`, remove the blank line between the PullQuote closing tag and the SectionDivider to tighten the spacing:

Current (lines ~53–57):
```mdx
<PullQuote client:visible>
Every organization running large-scale training is leaving 15–30% of achievable throughput unrealized due to a compiler architecture decision, not hardware limitations.
</PullQuote>

<SectionDivider number="03" label="The Landscape" client:visible />
```

If removing the blank line doesn't fix the visual stacking, the issue is in the PullQuote component's bottom margin (`margin: 56px auto` in the reference) combined with the SectionDivider's top margin (`margin: 64px 0 32px`). In that case, check `src/components/islands/shared/PullQuote.tsx` and reduce the PullQuote's bottom padding/margin to `24px` so it doesn't create as much dead space before the next SectionDivider.

If the three lines are actually the PullQuote's top bar, bottom bar, and SectionDivider rule rendering as three distinct horizontal lines, the fix is to remove the PullQuote's bottom decorative bar (the `<div>` with `width: 40px, height: 2px` after the quote text). A single accent bar above the quote + the SectionDivider rule below is enough visual punctuation. Don't add *more* dividers — reduce them.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] LandscapeQuadrant Y-axis reads "Learned" at top, "Heuristic" at bottom
- [ ] Joint Planner dot is in the upper-right quadrant
- [ ] Dashed target zone is in the upper-right quadrant
- [ ] XLA and torch.compile are in the lower-left area
- [ ] No label collisions between dots at 375px width
- [ ] No triple-line stacking between PullQuote and Section 03
- [ ] All other islands and SectionDividers unchanged
