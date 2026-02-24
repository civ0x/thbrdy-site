# Session 2h: Venn — Three Label Adjustments

In `src/components/islands/NoticeCompetitiveGap.tsx`, three changes:

### 1. Top overlap label — move higher

The "Subjective focus, no biometrics" label overlaps with the top circle borders. Change its `top` from `"2%"` to `"-4%"` so it clears the circles completely.

### 2. Left overlap label — move lower to prevent word wrap

The "Wellness intent, no granularity" label wraps because `maxWidth: 100px` is too narrow at its current vertical position. Change `top` from `"52%"` to `"62%"` and change `maxWidth` from `"100px"` to `"140px"`. This moves it below the widest part of the circles where there's more horizontal room.

### 3. Right overlap label — same fix

The "Data + labeling, no depth" label also wraps. Change `top` from `"52%"` to `"62%"` and change `maxWidth` from `"100px"` to `"140px"`.

## That's it

Do not change anything else. Three style value changes total.
