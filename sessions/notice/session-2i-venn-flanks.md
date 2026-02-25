# Session 2i: Venn — Fix Flank Label Spacing

In `src/components/islands/NoticeCompetitiveGap.tsx`, two changes:

### 1. Left overlap label — move left, allow wrap

The "Wellness intent, no granularity" label is smushed against the left circle edge. Change `left` from `"1%"` to `"-2%"` and change `maxWidth` from `"140px"` to `"80px"`. This pushes it further left and lets it wrap to two lines, keeping it compact and clear of the circles.

### 2. Right overlap label — mirror the fix

The "Data + labeling, no depth" label has the same issue on the right. Change `right` from `"1%"` to `"-2%"` and change `maxWidth` from `"140px"` to `"80px"`.

## That's it

Do not change anything else. Four style value changes total.
