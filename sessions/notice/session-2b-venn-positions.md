# Session 2b: Fix Venn Diagram Label Positions

## Situation

The Venn diagram in `NoticeCompetitiveGap.tsx` has the right structure but the labels are mispositioned. The overlap labels sit near circle edges instead of centered in their overlap regions. The category labels are at the container edges instead of inside their circles' solo regions.

## Current circle geometry

```
Container: maxWidth 500px, aspect-ratio 4/3 (so 500 × 375 at full width)
Circle width: 60% of container

Centers (as % of container):
  Meditation:  x=33%, y=33%
  Mood:        x=67%, y=33%
  Health:      x=50%, y=64%

Notice badge: x=50%, y=42%
```

## Task

Fix the absolute positions of the overlap labels and category labels in `src/components/islands/NoticeCompetitiveGap.tsx`. No structural changes — just adjust the position values.

### Fix 1: Overlap label positions

The midpoint between each pair of circle centers is the geometric center of the overlap lens. Offset each label slightly away from the Notice badge (at 50%, 42%) so they don't collide with it.

Update the `overlapLabels` array to these positions:

```typescript
const overlapLabels = [
  { text: "Subjective focus,\nno biometrics", x: "50%", y: "26%" },   // Med ∩ Mood: midpoint is (50,33), push up from Notice
  { text: "Wellness intent,\nno granularity", x: "36%", y: "54%" },   // Med ∩ Health: midpoint is (41.5,48.5), push down-left
  { text: "Data + labeling,\nno depth", x: "64%", y: "54%" },         // Mood ∩ Health: midpoint is (58.5,48.5), push down-right
];
```

### Fix 2: Category label positions

Each category label should sit inside the non-overlapping solo region of its circle — the part that doesn't intersect with any other circle. That's the side of the circle farthest from the other two.

Update `catLabelPositions` to approximately:

```typescript
const catLabelPositions = [
  { left: "12%", top: "16%", textAlign: "center" as const },   // Meditation: top-left of its circle
  { left: "76%", top: "16%", textAlign: "center" as const },   // Mood: top-right of its circle
  { left: "50%", top: "80%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Health: bottom of its circle
];
```

### Verify

Run `astro dev`, view the essay, and visually confirm:
- Each overlap label is centered inside its lens-shaped overlap region with breathing room from circle edges
- Each category label clearly sits inside its own circle, not at the container edge
- The Notice badge doesn't collide with any overlap labels
- Nothing clips at 375px

**These are starting coordinates.** If they look slightly off when rendered, adjust by a few percentage points. The goal is: each label visually belongs to its region, with comfortable spacing from boundaries.

## What NOT to do
- Do not change circle positions, sizes, or colors
- Do not change the Notice badge
- Do not change the comparison grid
- Do not change animation behavior
- Do not modify the MDX or any other files
