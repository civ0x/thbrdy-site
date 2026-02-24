# Session 2c: Venn Diagram — Remove Overlap Labels, Add Legend Strip

## Situation

The Venn overlap labels inside the circles aren't working — they collide with the Notice badge and each other regardless of positioning. The circles don't have enough interior space for seven text elements. Moving the pairwise overlap information out of the diagram entirely.

## Task

In `src/components/islands/NoticeCompetitiveGap.tsx`, make these specific changes:

### 1. Remove the overlap labels from inside the Venn

Delete the `overlapLabels` array (lines 81–85) and the JSX block that renders them (the `{/* Pairwise overlap labels */}` section, lines 217–235). Remove the `.notice-gap-overlap-label` CSS rules from the `<style>` block as well.

### 2. Add a legend strip between the Venn and the grid

Below the Venn container div and above the feature comparison grid, add a compact horizontal strip with three items. Each item shows a small colored indicator (two dots matching the pair's colors) and a short phrase:

```
[purple dot + green dot] Subjective focus, no biometrics
[purple dot + brown dot] Wellness intent, no granularity
[green dot + brown dot] Data + labeling, no depth
```

Style:
- `display: flex`, `justify-content: center`, `gap: 24px`, `flex-wrap: wrap`
- Max width matches the Venn (`500px`), centered
- Dots: 6px circles using the existing `PURPLE`, `GREEN`, `BROWN` constants, `display: inline-block`, slight gap between the two dots
- Text: `DM Sans` (`tokens.sans`), 11px, `tokens.textMuted`
- Fade in with the same scroll animation as the rest (use `inView`, transition delay after the Venn circles)
- Add responsive rule: at 420px, switch to `flex-direction: column`, `align-items: center`, `gap: 8px`

### 3. Clean up category label positions

The category labels ("Meditation Apps", "Mood Trackers", "Health Platforms") are still slightly off. Without the overlap labels competing for space, they can move closer to their circle centers. Update `catLabelPositions` to:

```typescript
const catLabelPositions = [
  { left: "16%", top: "14%", textAlign: "center" as const },   // Meditation: upper-left
  { left: "72%", top: "14%", textAlign: "center" as const },   // Mood: upper-right
  { left: "50%", top: "82%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Health: bottom
];
```

These are starting values. After rendering, visually confirm each label sits inside its circle's solo region (the part not overlapping other circles). Adjust by a few percent if needed.

### 4. Do not change anything else

- Circles: same positions, size, colors, animation
- Notice badge: same position, size, styling
- Comparison grid: unchanged
- Animation behavior: unchanged
- Other responsive rules: unchanged

### 5. Verify

- `astro build` passes clean
- `astro dev` — view the essay and confirm:
  - Venn diagram is clean — three circles, three category labels, Notice badge, no interior clutter
  - Legend strip appears below the Venn, above the grid, with three pairwise items
  - Legend wraps cleanly at 375px
  - Category labels visually belong inside their circles

## What NOT to do
- Do not modify the MDX or any other component files
- Do not change circle geometry or Notice badge
- Do not change the comparison grid
- Do not add dependencies
