# Session 2f: Venn — Exact Label Position Fixes

## Problem

The overlap labels are not fully outside the circles. The percentage positions were estimated incorrectly because the circles (60% of container width) extend beyond the container boundaries. The labels need to be positioned relative to the actual circle edges, not guessed with percentages.

## Geometry (for reference, do not change these)

```
Container: 500px × 375px (4:3 aspect ratio)
Circle diameter: 60% of container width = 300px, radius = 150px

Circle centers:
  Meditation: (33%, 33%) → (165px, 124px)
  Mood:       (67%, 33%) → (335px, 124px)
  Health:     (50%, 64%) → (250px, 240px)

Circle edge positions:
  Med/Mood top edge:    124 - 150 = -26px  → -7% of container height
  Meditation left edge: 165 - 150 = 15px   → 3% of container width
  Mood right edge:      335 + 150 = 485px  → 97% of container width
```

## Task

In `src/components/islands/NoticeCompetitiveGap.tsx`, replace the three external overlap label `<div>` elements (lines 206–248) with the following exact code. Use `transform` to position labels relative to circle edges so they're guaranteed to be outside:

### Top label ("Subjective focus, no biometrics")

Replace lines 206–220 with:
```tsx
<div className="notice-gap-overlap-ext" style={{
  position: "absolute",
  left: "50%",
  top: "-7%",
  transform: "translate(-50%, calc(-100% - 12px))",
  textAlign: "center",
  fontFamily: tokens.sans,
  fontSize: "10px",
  color: tokens.textMuted,
  opacity: inView ? 1 : 0,
  transition: "opacity 0.6s ease 0.7s",
  whiteSpace: "nowrap",
}}>
  Subjective focus, no biometrics
</div>
```

This positions the reference point at the top of the Med/Mood circles (-7%), then `translateY(calc(-100% - 12px))` shifts the label upward by its own height plus 12px gap. The label's bottom edge will be 12px above the circle tops.

### Left label ("Wellness intent, no granularity")

Replace lines 221–234 with:
```tsx
<div className="notice-gap-overlap-ext" style={{
  position: "absolute",
  left: "3%",
  top: "52%",
  transform: "translateX(calc(-100% - 12px))",
  textAlign: "right",
  fontFamily: tokens.sans,
  fontSize: "10px",
  color: tokens.textMuted,
  opacity: inView ? 1 : 0,
  transition: "opacity 0.6s ease 0.85s",
  maxWidth: "130px",
}}>
  Wellness intent, no granularity
</div>
```

This positions the reference point at the Meditation circle's left edge (3%), then `translateX(calc(-100% - 12px))` shifts the label left by its own width plus 12px gap. The label's right edge will be 12px to the left of the circle.

### Right label ("Data + labeling, no depth")

Replace lines 235–248 with:
```tsx
<div className="notice-gap-overlap-ext" style={{
  position: "absolute",
  left: "97%",
  top: "52%",
  transform: "translateX(12px)",
  textAlign: "left",
  fontFamily: tokens.sans,
  fontSize: "10px",
  color: tokens.textMuted,
  opacity: inView ? 1 : 0,
  transition: "opacity 0.6s ease 1s",
  maxWidth: "130px",
}}>
  Data + labeling, no depth
</div>
```

This positions the reference point at the Mood circle's right edge (97%), then `translateX(12px)` shifts the label 12px to the right. The label's left edge will be 12px outside the circle.

## That's it

Do not change anything else — circles, category labels, ensō badge, grid, animations, responsive rules. Only replace the three overlap label divs with the code above.

## Verify

- `astro build` passes
- View the essay — the three overlap labels should have visible whitespace between them and the nearest circle edge
