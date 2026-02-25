# Session Prompt: Replace VoDMaturitySwitch with Draggable Threshold Prototype

## Situation

The current `VoDMaturitySwitch.tsx` is a static gradient bar with a fixed center switching point, two zone cards, and two risk callouts. It states the essay's argument as text ("No empirical framework identifies when to switch") but doesn't let the reader experience it.

A working prototype at `prototypes/vod-maturity-slider.html` demonstrates a superior interaction: a draggable threshold slider that the reader moves to classify 9 historical case studies as "protect" or "integrate." The case study positions interleave on the maturity axis so that no single threshold achieves better than 7/9. The reader discovers the impossibility by trying and failing — then clicks the stubbornly misclassified cases to learn that domain-specific factors (reliability requirements, capital intensity, market tolerance) determine the correct prescription, not maturity alone.

This session replaces the existing production component with a React island that ports the prototype's behavior.

## Mission

Replace `src/components/islands/VoDMaturitySwitch.tsx` with a new implementation that ports the draggable threshold prototype. The MDX import and usage in `src/content/writing/valley-of-death.mdx` should not need to change — same component name, same default export, same `client:visible` directive.

## Source of Truth

**`prototypes/vod-maturity-slider.html`** — canonical reference for behavior, data, positions, and visual design. Port faithfully. Convert vanilla JS to React idioms (useState, useRef, useEffect/useCallback for drag listeners) but preserve the interaction model exactly.

## What the Prototype Does

1. **Draggable threshold:** A gold diamond marker on a horizontal maturity bar. Drag (mouse + touch), click anywhere on bar to jump, keyboard arrows (±2%) for accessibility. Clamped to 5–95%.

2. **Case study dots:** 9 dots positioned above the bar at their maturity positions, vertically staggered to avoid overlaps. Each dot has a label above and a colored circle. Green = current threshold classifies this case correctly. Red = wrong zone.

3. **Score display:** Large number "N / 9 correctly classified" with color coding (green at max, gold near max, red otherwise). Contextual subtitle text changes based on proximity to best score (7/9).

4. **Zone cards:** Two side-by-side cards ("Protected exploration" / "Structured translation") listing cases currently in each zone. Each case shows a green/red icon and a "✓ correct" / "✗ wrong zone" verdict. Cases are clickable.

5. **Case detail panel:** Click any case dot or zone list item to show a narrative explanation. Panel shows case name, a badge ("Correctly protected" / "Should be integrated" etc.), and the full narrative text. Click again to deselect.

6. **Callout:** Updates dynamically. At best score (7), explains the two crossing pairs and the domain-specific factors argument. Below best score, shows current score and challenges reader to reach 7.

7. **Best score computation:** `computeBestScore()` iterates all thresholds 0–100, returns max achievable. This is computed once, not hardcoded, so the data can be adjusted without breaking the feedback logic.

## Data Model — Critical

The case positions are carefully chosen so that protect and integrate cases **interleave** on the maturity axis. This is what makes 9/9 impossible. The two crossing pairs:

- **Deep Learning (35, integrate) < Cleantech (38, protect):** DL integrated at lower maturity because image classification tolerates errors that energy infrastructure doesn't.
- **FAIR (48, integrate) < Watson Health (52, protect):** FAIR was integration-ready at lower maturity because world models don't need medical-grade reliability.

Copy all 9 case entries exactly from the prototype, including positions, correct prescriptions, and narrative text. Do not change positions — the math has been verified: best possible score is 7/9, achievable across thresholds 16–55.

```
AI Winter:        15, protect
Deep Learning:    35, integrate
Cleantech 1.0:    38, protect
FAIR:             48, integrate
Watson Health:    52, protect
AstraZeneca 5R:   55, integrate
Neptune ML:       60, integrate
Xerox PARC:       72, integrate
Zombie Labs:      82, integrate
```

## Technical Constraints

Standard island architecture per `CLAUDE.md`:

- **Imports:** `useState`, `useRef`, `useEffect`, `useCallback` from `react`, `tokens` from `./shared/tokens`, `useInView` from `./shared/useInView`
- **CSS:** Injected `<style>` block as first child of root. Class names scoped as `vod-maturity-*`.
- **Animation easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- **Responsive:** 640px (zone cards stack, dots shrink) and 420px (bar height shrinks, zone labels hidden, dot labels smaller, diamond handle smaller).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` sets all transition-duration to 0.01s.
- **Scroll reveal:** `useInView(0.15)` for initial appearance, then slider is interactive.
- **No external dependencies.** No icon libraries. SVG is minimal (none needed beyond the bar itself).
- **Default export.**
- **TypeScript (`.tsx`).**

## Key Implementation Notes

1. **Drag handling** must be registered on `document` (mousemove/mouseup, touchmove/touchend) via useEffect, not on the bar element, so dragging continues when the pointer leaves the bar. The bar's mousedown/touchstart initiates dragging.

2. **Case dot vertical stagger:** Sort cases by position, assign each to the lowest row that doesn't conflict (conflict = positions within 11% of each other). Position dots absolutely above the bar using computed top offsets based on row assignment. This layout should be computed once on mount and on window resize.

3. **Classification function:** `position < threshold → protect, position >= threshold → integrate`. Compare zone to case's `correct` field for green/red.

4. **Zone card sizing:** Compact — `padding: 10px 14px`, `min-height: 0`, case items at `0.6875rem` font with `3px` vertical padding. Cards size to content, not a fixed minimum.

5. **ARIA:** The threshold handle needs `role="slider"`, `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `tabIndex={0}`.

6. **`<p>` tag warning:** Per CLAUDE.md corrections log, `PostLayout.astro`'s `:global(p)` overrides island paragraph margins. Use `<div>` for any element that needs custom margins inside the island.

## Verification Checklist

After implementation:

- [ ] `npm run build` passes with zero errors
- [ ] Threshold diamond is draggable via mouse, touch, and keyboard arrows
- [ ] Clicking the bar jumps the threshold to that position
- [ ] 9 case dots positioned above bar, vertically staggered, no label overlaps
- [ ] Dots turn green/red as threshold moves
- [ ] Score updates continuously during drag (not just on release)
- [ ] Best achievable score is 7/9 (test by dragging to ~39 or ~53)
- [ ] Score subtitle changes at 7 ("That's the best possible..."), 6 ("Close..."), and below
- [ ] Zone cards list cases with correct/wrong verdicts
- [ ] Clicking a case dot or zone list item shows detail panel with narrative
- [ ] Callout text updates when score reaches 7/9
- [ ] Reduced motion: all transitions collapse to instant
- [ ] Mobile 640px: zone cards stack vertically
- [ ] Mobile 420px: bar shrinks, zone labels hidden, dots smaller
- [ ] No new dependencies in `package.json`
