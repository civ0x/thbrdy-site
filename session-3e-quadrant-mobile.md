# Session 3e: LandscapeQuadrant Mobile Responsive Fix

## Situation

The LandscapeQuadrant diagram renders poorly on mobile. Dot labels clip, overlap axis labels, and overflow the container. The desktop layout uses absolute positioning with percentage coordinates, which doesn't degrade gracefully at narrow widths.

Read `CLAUDE.md` before making changes.

## File to modify

- `src/components/islands/LCLandscapeQuadrant.tsx`

## Problems (visible at ≤420px)

1. **"Joint Planner" label clips off the right edge.** The dot sits at `left: 85%` and the label is positioned `left: calc(100% + 8px)` from the dot, pushing it outside the container which has `overflow: hidden`.

2. **MLGO label collides with "Learned" tick label.** Both occupy the upper-left region (MLGO at `x: 18, y: 18`, "Learned" tick at `left: 32px, top: 16%`).

3. **XLA and torch.compile labels collide with "Heuristic" and the "1" X-axis tick** in the lower-left corner.

4. **Dot labels in general extend beyond the field bounds** on the right side because they're absolutely positioned to the right of each dot with no awareness of container edges.

## Fix

Add a `@media (max-width: 420px)` block targeting the mobile layout. The approach: reposition labels that would clip, hide sub-labels to reduce clutter, and shrink font sizes.

### a) Reposition the Joint Planner label to the left of its dot

At narrow widths, the Joint Planner dot is near the right edge. Its label should flip to the left side:

```css
@media (max-width: 420px) {
  .lc-landscape-dot-label {
    left: auto;
    right: calc(100% + 8px);
    text-align: right;
  }
}
```

But this is a class-level override and would flip ALL labels to the left, which isn't right for dots near the left edge. A better approach: add a `labelPosition` field to the systems data to control per-dot label placement, with a mobile override.

Add to each system object:
```tsx
{ id: "xla",     ..., mobileLabel: "right" },
{ id: "torchc",  ..., mobileLabel: "right" },
{ id: "alpa",    ..., mobileLabel: "right" },
{ id: "unity",   ..., mobileLabel: "right" },
{ id: "go",      ..., mobileLabel: "right" },
{ id: "mlgo",    ..., mobileLabel: "right" },
{ id: "planner", ..., mobileLabel: "left" },
```

Then in the label `<div>`, conditionally set the position. But since we can't use media queries in inline styles, the cleanest approach is:

Define two CSS classes:
```css
.lc-landscape-dot-label-left {
  left: auto;
  right: calc(100% + 8px);
  text-align: right;
}

@media (max-width: 420px) {
  .lc-landscape-dot-label--flip {
    left: auto !important;
    right: calc(100% + 8px);
    text-align: right;
  }
}
```

Apply `lc-landscape-dot-label--flip` to the Joint Planner dot's label div.

### b) Hide sub-labels on mobile

The sub-labels ("Google", "Meta", "Berkeley", etc.) add clutter at small sizes. Hide them:

```css
@media (max-width: 420px) {
  .lc-landscape-dot-sub {
    display: none;
  }
}
```

### c) Shrink dot label font sizes on mobile

```css
@media (max-width: 420px) {
  .lc-landscape-dot-name {
    font-size: 0.5625rem;
  }
}
```

### d) Nudge axis tick labels to avoid collisions

The "Learned" tick at `top: 16%` collides with MLGO at `y: 18%`. The "Heuristic" tick at `top: 82%` collides with XLA at `y: 76%`. On mobile, shift the tick labels further toward the edges:

```css
@media (max-width: 420px) {
  .lc-landscape-tick-learned {
    top: 8% !important;
  }
  .lc-landscape-tick-heuristic {
    top: 90% !important;
  }
}
```

This requires adding specific class names to those two tick `<div>` elements (they currently just use the generic `.lc-landscape-tick` class).

### e) Reduce the field aspect ratio on mobile

The 4:3 aspect ratio wastes vertical space at narrow widths without giving enough horizontal room. Tighten it:

```css
@media (max-width: 420px) {
  .lc-landscape-field {
    aspect-ratio: 1;
  }
}
```

A 1:1 ratio gives more vertical room for the dots to spread out.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] At 375px width: no labels clip outside the container
- [ ] At 375px width: "Joint Planner" label appears to the left of its dot
- [ ] At 375px width: no label-on-label collisions between dots and axis ticks
- [ ] At 375px width: sub-labels hidden, dot names still visible
- [ ] Desktop layout unchanged
- [ ] Hover interactions still work on desktop
