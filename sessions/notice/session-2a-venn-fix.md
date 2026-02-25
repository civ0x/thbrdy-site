# Session 2a: Fix NoticeCompetitiveGap Venn Diagram

## Situation

The `NoticeCompetitiveGap` Venn diagram (ported in Session 2) has layout problems: the circles barely overlap so intersection regions are meaningless, category labels are offset to container edges rather than sitting inside their circles, and the whole thing is too large for a setup diagram. The comparison grid below the Venn is fine — keep it.

## Task

Rework the Venn diagram in `src/components/islands/NoticeCompetitiveGap.tsx`. Single-component revision — do not modify the MDX or any other files.

### 1. Shrink the Venn container
Change `maxWidth` from `720px` to `500px`. This diagram supports a single paragraph's argument — it shouldn't dominate the section.

### 2. Fix circle overlap
The current circles barely intersect — the pairwise overlap regions are too thin to be visually meaningful. Push the circle centers closer together so pairwise overlaps are roughly 25–30% of each circle's area. The triple intersection at center needs to be large enough for the Notice badge to sit comfortably inside it. Adjust the `x`, `y` positions and possibly the circle `width` percentage to achieve this.

### 3. Move category labels inside their solo regions
Currently the labels ("Meditation Apps", "Mood Trackers", "Health Platforms") are positioned at the container edges, disconnected from their circles. Move each label *inside* the non-overlapping region of its own circle — the part that belongs only to that category. Keep absolute positioning, just re-place them so they visually belong to their circle.

### 4. Add pairwise overlap labels
The three pairwise intersection regions should carry short text showing what those two categories share but still lack. Use `DM Sans`, 10px, muted color (`tokens.textMuted` or similar). One line each, concise:

- Meditation ∩ Mood overlap: "Subjective focus, no biometrics"
- Meditation ∩ Health overlap: "Wellness intent, no granularity"
- Mood ∩ Health overlap: "Data + labeling, no depth"

Adjust wording to be accurate to the essay's argument. The point: each pair covers something, but none covers all three.

**Positioning is critical.** Each overlap label must be visually centered within the actual lens-shaped overlap region of its two circles — not near the edges. To get this right:
- Calculate the midpoint between the two circle centers for each pair. That midpoint is approximately the center of the overlap region.
- Position each label at that midpoint, offset slightly away from the triple-intersection center so it doesn't collide with the Notice badge.
- The labels should have comfortable padding from the circle borders on all sides. If the overlap region is too narrow to fit the text with breathing room, increase the circle overlap (step 2) until there's enough space.
- Verify visually: each label should feel like it "belongs" in its overlap zone, not pinned to an edge.

### 5. Keep everything else
- Notice center badge (gold circle, "Notice" text, tagline) — unchanged
- Feature comparison grid below the Venn — unchanged
- Scroll-triggered animation — unchanged
- Responsive `<style>` tag handling — unchanged
- Inline SVG patterns — unchanged

### 6. Verify
- `astro build` passes clean
- `astro dev` — check the diagram at full width and at 375px
- Circles visibly overlap with legible labels in intersection zones
- Category names clearly belong to their circles
- Notice badge sits naturally at the triple intersection
- Grid below still renders correctly

## What NOT to do
- Do not modify the MDX file
- Do not modify any other component files
- Do not change the comparison grid
- Do not add dependencies
