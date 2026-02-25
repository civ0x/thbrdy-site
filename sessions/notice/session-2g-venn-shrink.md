# Session 2g: Shrink Venn Circles to Fit Labels Inside Container

## Problem

The circles are 60% of container width (300px each in a 500px container). They extend beyond the container, so labels positioned "outside" the circles end up at the page margins. Fix: shrink the circles so the whole diagram — circles, category labels, overlap labels — fits within the container bounds.

## Task

In `src/components/islands/NoticeCompetitiveGap.tsx`, make these changes:

### 1. Shrink circles from 60% to 44%

Line 169, change `width: "60%"` to `width: "44%"`.

This makes each circle 220px diameter (110px radius) in the 500px container. The circles will still overlap meaningfully but leave room around the edges for labels.

### 2. Remove `overflow: visible` from the Venn container

In the `<style>` block, remove the `.notice-gap-venn { overflow: visible; }` rule. The default `overflow: hidden` or just removing it entirely is fine — everything should now fit inside the container.

### 3. Reposition category labels to their solo regions

With smaller circles, the solo regions shift. Update `catLabelPositions`:

```typescript
const catLabelPositions = [
  { left: "15%", top: "20%", textAlign: "center" as const },   // Meditation: upper-left solo
  { left: "73%", top: "20%", textAlign: "center" as const },   // Mood: upper-right solo
  { left: "50%", top: "85%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Health: bottom solo
];
```

### 4. Reposition overlap labels — outside circles but inside container

With 44% circles (110px radius), the circle edges are:
- Med/Mood top: ~11% of container height
- Meditation left: ~11% of container width
- Mood right: ~89% of container width
- Health bottom: ~93% of container height

Position labels in the space between circle edges and container edges:

**Top label** — above the Med/Mood circles:
```tsx
style={{
  position: "absolute",
  left: "50%",
  top: "2%",
  transform: "translateX(-50%)",
  ...
}}
```

**Left label** — left of Med/Health circles:
```tsx
style={{
  position: "absolute",
  left: "1%",
  top: "52%",
  textAlign: "left",
  maxWidth: "100px",
  ...
}}
```

**Right label** — right of Mood/Health circles:
```tsx
style={{
  position: "absolute",
  right: "1%",
  top: "52%",
  textAlign: "right",
  maxWidth: "100px",
  ...
}}
```

Keep all other overlap label styles (fontFamily, fontSize, color, opacity/transition) the same.

### 5. Adjust ensō badge size

The ensō at 90px might be too large relative to the now-smaller circles. Reduce to `width: 70px, height: 70px`. Adjust the 420px responsive rule accordingly (60px).

### 6. Do not change anything else

- Circle center positions (33/33, 67/33, 50/64): unchanged
- Container maxWidth (500px) and aspect-ratio (4/3): unchanged
- Comparison grid: unchanged
- Animation timing: unchanged
- All other responsive rules: unchanged

## Verify

- `astro build` passes
- View the essay — all labels should be visible within the diagram container, no clipping
- Circles should still overlap visibly — the center intersection should be clear
- Category labels inside their circles
- Overlap labels outside circles but inside the container
- Check 375px — labels may be tight, confirm nothing clips
