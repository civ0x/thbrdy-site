# Session 2e: Venn — Push Diagram Down, Move Overlap Labels Fully Outside

## Task

In `src/components/islands/NoticeCompetitiveGap.tsx`, two changes only:

### 1. Add space between the header and the Venn diagram

The Venn circles currently sit too close to the "Three categories..." title. Add `margin-top: 24px` to the Venn container div (the one with class `notice-gap-venn`).

### 2. Move overlap labels fully outside the circles

The three overlap labels are currently positioned at the edges of the circles but still overlap with them visually. Move them completely outside the circle boundaries:

- **"Subjective focus, no biometrics"** (top label): Move it higher so it sits fully above both top circles with clear daylight between the text and the circle borders. Try `top: -8%` instead of the current value.

- **"Wellness intent, no granularity"** (left label): Move it further left so it sits fully outside the left circle edge with clear space. Try `left: -12%` instead of the current value.

- **"Data + labeling, no depth"** (right label): Move it further right so it sits fully outside the right circle edge with clear space. Try `right: -12%` instead of the current value.

These are starting values. The goal is visible whitespace between each label and the nearest circle border. Adjust until there's clear separation.

## What NOT to do
- Do not change circle positions, sizes, or colors
- Do not change category labels or their positions
- Do not change the Notice ensō badge
- Do not change the comparison grid
- Do not modify the MDX or any other files
- Do not change anything else
