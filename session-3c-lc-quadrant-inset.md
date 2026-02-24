# Session 3c: LC Quadrant Target Zone Inset + Divider Stacking

## Situation

Session 3b fixed the Y-axis orientation on the LandscapeQuadrant. Two small issues remain.

Read `CLAUDE.md` before making changes.

## Files to modify

- `src/components/islands/LCLandscapeQuadrant.tsx` (target zone inset)
- `src/components/islands/shared/PullQuote.tsx` (remove border to fix stacking)

## Fix 1: Inset the dashed target zone

### Problem

The dashed target zone rectangle is flush against the top and right edges of the chart container. It reads as a border artifact rather than a "zone within the chart."

### Current CSS (in `LCLandscapeQuadrant.tsx`):
```css
.lc-landscape-target {
  position: absolute;
  right: 2%;
  top: 0;
  width: 28%;
  height: 40%;
  border-radius: 12px;
  border: 1.5px dashed ${LC.accentFaint};
  background: transparent;
}
```

### Fix

Add an inset from the top and right edges so the zone floats within the chart area:

```css
.lc-landscape-target {
  position: absolute;
  right: 4%;
  top: 4%;
  width: 28%;
  height: 38%;
  border-radius: 12px;
  border: 1.5px dashed ${LC.accentFaint};
  background: transparent;
}
```

The key changes: `right: 2%` → `right: 4%`, `top: 0` → `top: 4%`, `height: 40%` → `height: 38%` (slightly smaller to compensate for the inset so the Joint Planner dot still lands inside the zone). Verify the Joint Planner dot (at `x: 85, y: 15`, rendering at `left: 85%, top: 15%`) still falls within the target zone bounds.

## Fix 2: Remove PullQuote borderTop to fix divider stacking

### Problem

Above the Landscape section (Section 03), two horizontal lines stack visually:
1. PullQuote's `borderTop: 1px solid ${tokens.borderMid}` (line 19 of PullQuote.tsx)
2. SectionDivider 03's horizontal rule

The PullQuote appears between sections 02 and 03. Its top border + the following SectionDivider's rule create a double-line effect.

### Fix

In `src/components/islands/shared/PullQuote.tsx`, remove the `borderTop` and replace the top padding with a centered accent bar (matching the reference design). This is a shared component used by both AB and LC essays, so the change affects both.

Current (line ~18–19):
```tsx
padding: "48px 0 0",
borderTop: `1px solid ${tokens.borderMid}`,
```

Change to:
```tsx
padding: "0 0 0",
```

And add a centered accent bar `<div>` above the quote text (before the `<p>` tag), matching the reference's PullQuote design:

```tsx
<div
  style={{
    width: "40px",
    height: "2px",
    background: tokens.accent,
    margin: "0 auto 28px",
  }}
/>
```

This replaces the full-width border with a short centered accent bar — less visual weight, no stacking with SectionDivider rules. Also add a matching bar after the quote:

```tsx
<div
  style={{
    width: "40px",
    height: "2px",
    background: tokens.accent,
    margin: "28px auto 0",
  }}
/>
```

**Important:** Since PullQuote is a shared component, verify the AB essay (`/writing/ab-essay/`) still looks correct after this change. The AB essay also uses PullQuote between sections.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] Dashed target zone has visible inset from top and right edges of the chart
- [ ] Joint Planner dot still falls inside the target zone
- [ ] No double horizontal lines between PullQuote and SectionDivider 03
- [ ] PullQuote displays centered accent bars (top and bottom) instead of full-width borderTop
- [ ] AB essay PullQuote still renders correctly
