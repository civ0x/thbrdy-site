# Session 4b: Toulmin Diagram — Backing Alignment Fix

## Kickoff

Read `CLAUDE.md`, `STATUS.md`, and this file, then execute.

## Situation

The Scholion Toulmin diagram (`src/components/islands/ScholionToulminDiagram.tsx`) was redesigned in Session 4a. The overall structure is correct, but the "on account of" connector and Backing card are not visually aligned under the Warrant card. The connector uses `margin-left: auto; margin-right: calc(25% - 0.375rem)` which doesn't reliably match the grid column positions above it.

## Mission

Fix the alignment so the "on account of" connector and Backing card sit directly under the Warrant card (the right column of the Data/Warrant row).

## Fix

The Backing card already uses the correct technique: a 2-column grid (`scholion-toulmin-backing-wrap`) matching the Data/Warrant row's grid, with an empty spacer in the left column. Apply the same technique to the "on account of" connector.

**Specific changes to `ScholionToulminDiagram.tsx`:**

1. **Remove the `scholion-toulmin-connector--right` CSS class entirely.** It's not needed.

2. **Wrap the lower connector in the same grid pattern as the Backing card.** Replace the current lower connector markup:

```tsx
{/* ── Lower connector (right-aligned under Warrant) ── */}
<div
  className="scholion-toulmin-connector scholion-toulmin-connector--right"
  style={{ ... }}
>
  ...
</div>
```

With a grid wrapper that matches the Data/Warrant row:

```tsx
{/* ── Lower connector (aligned under Warrant) ── */}
<div className="scholion-toulmin-backing-wrap">
  <div className="scholion-toulmin-backing-spacer" />
  <div
    className="scholion-toulmin-connector"
    style={{ ... }}
  >
    ...
  </div>
</div>
```

This reuses the existing `scholion-toulmin-backing-wrap` and `scholion-toulmin-backing-spacer` classes, which already handle the grid alignment and mobile collapse correctly.

3. **Clean up the CSS:** Remove the `.scholion-toulmin-connector--right` rule block and its mobile override. No other CSS changes needed.

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] "on account of" connector is visually centered under the Warrant card (right column), not centered on the full diagram width
- [ ] Backing card remains aligned under the Warrant card
- [ ] Mobile (≤640px): connector and Backing both center properly when grid collapses to single column
- [ ] No other visual changes to the diagram
