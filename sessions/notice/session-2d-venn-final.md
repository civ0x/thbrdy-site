# Session 2d: Venn Diagram — Final Layout Fix + Ensō Badge

## Situation

The Venn diagram in `NoticeCompetitiveGap.tsx` has been through several iterations. The current state has a legend strip below the Venn with pairwise overlap labels and colored dots. The category labels are still not well-centered in their circles. The Notice badge is a gold gradient circle with text.

This prompt makes three changes: repositions labels, moves overlap info outside the diagram, and replaces the Notice badge with the ensō image.

## Changes

### 1. Move the ensō image into the project

Move `enso-transparent.png` from the repo root to `public/images/enso-transparent.png`. This makes it available as a static asset at `/images/enso-transparent.png`.

### 2. Replace the Notice gold circle badge with the ensō image

In the Notice badge section of the component, replace the gold gradient `<div>` circle and the "Notice" text `<span>` inside it with an `<img>` element:

```tsx
<img
  src="/images/enso-transparent.png"
  alt="Notice"
  style={{
    width: "90px",
    height: "90px",
    objectFit: "contain",
  }}
/>
```

Remove the `boxShadow` from the badge container since it was styled for the old gold circle. Keep the "All three — plus AI reflection" description text below the image. Keep the existing absolute positioning, opacity animation, and z-index on the badge's outer wrapper.

### 3. Center category labels in their non-overlapping solo regions

Each category label should sit centered in the part of its circle that doesn't overlap with any other circle:

- **Meditation Apps** (circle center: 33%, 33%): The solo region is the upper-left arc. Position the label at approximately `left: 14%, top: 18%` with `textAlign: center`.
- **Mood Trackers** (circle center: 67%, 33%): The solo region is the upper-right arc. Position at approximately `left: 74%, top: 18%` with `textAlign: center`.
- **Health Platforms** (circle center: 50%, 64%): The solo region is the bottom arc. Position at approximately `left: 50%, top: 84%` with `textAlign: center` and `transform: translateX(-50%)`.

These are starting coordinates. After rendering, verify each label visually sits inside its circle's solo region. Adjust by a few percent if needed.

### 4. Move overlap labels outside the Venn diagram

Remove the current legend strip (the flex row with colored dots below the Venn). Replace it with three overlap labels positioned **outside** the Venn circle boundaries, near their relevant circle pair. Use absolute positioning within the Venn container:

- **"Subjective focus, no biometrics"** (Meditation ∩ Mood) → Position **above** the diagram, centered horizontally. This pair shares the top of the Venn. Place at approximately `left: 50%, top: -2%`, `transform: translateX(-50%)`.

- **"Wellness intent, no granularity"** (Meditation ∩ Health) → Position to the **left** of the diagram. This pair shares the left side. Place at approximately `left: -4%, top: 52%`, `textAlign: right`, with a `maxWidth` so it doesn't run off-screen. The text should right-align toward the diagram.

- **"Data + labeling, no depth"** (Mood ∩ Health) → Position to the **right** of the diagram. This pair shares the right side. Place at approximately `right: -4%, top: 52%`, `textAlign: left`, with a `maxWidth`.

Style: `DM Sans` (`tokens.sans`), 10px, `tokens.textMuted`. No dots or color indicators — the spatial proximity to the relevant circles communicates the association.

**Important:** These labels sit outside the circle boundaries. The Venn container may need `overflow: visible` (not `hidden`) for them to show. Also ensure the parent container has enough margin/padding that the external labels don't clip against the page edges.

### 5. Responsive handling

At 420px and below:
- Hide the external overlap labels (they won't fit beside a narrow Venn). Add `display: none` for the overlap label elements at this breakpoint.
- The ensō badge should scale down slightly — `width: 70px, height: 70px`.
- Category labels and the grid already have mobile handling from previous work.

### 6. Delete the old legend strip

Remove the `legendItems` data array, the `.notice-gap-legend` CSS rules, and the JSX block that renders the legend strip with colored dots. The overlap information is now handled by the external labels in step 4.

### 7. Clean up

- Delete `enso-transparent.png` from the repo root after copying to `public/images/`.
- Remove any unused CSS classes or variables left over from previous iterations.

## Verify

- `astro build` passes clean
- `astro dev` — view the essay and confirm:
  - Ensō image renders at the center of the Venn, properly sized, on the warm background
  - Category labels sit centered in their circles' solo regions
  - Three overlap labels appear outside the Venn near their relevant circle pairs
  - Overlap labels don't clip against page edges
  - At 375px: overlap labels hidden, ensō smaller, category labels and grid still work
  - The ensō image loads (check network tab — `/images/enso-transparent.png` should return 200)

## What NOT to do
- Do not modify the MDX or any other component files
- Do not change circle positions, sizes, or colors
- Do not change the comparison grid
- Do not change animation timing or scroll behavior
- Do not add dependencies
