# Session 3d: NestedClaimsFlow — Uniform Card Styling

## Situation

In the NestedClaimsFlow diagram, the three claim cards have inconsistent visual treatment. The label colors (Coupling, Learnability, Hardware Generalization), number badge colors, and card border colors all differ between cards because each claim uses a different `color` value. They should all match — every card should look like Claim 1 (Coupling) does now: steel blue LC accent for label, number badge, and border.

Read `CLAUDE.md` before making changes.

## File to modify

- `src/components/islands/LCNestedClaimsFlow.tsx`

## Problem

The claims data array assigns a different `color` per claim:
```tsx
{ num: "1", label: "Coupling",                color: LC.accent },      // "#3A7CA5" (steel blue)
{ num: "2", label: "Learnability",             color: "var(--teal)" },  // teal
{ num: "3", label: "Hardware Generalization",   color: "var(--green)" }, // green
```

This `color` field drives:
- The label text color when active (line ~250)
- The number badge border and background when active (lines ~236–238)
- The card border color when active (line ~227)

The result: three cards that look different from each other. The intent is uniform: **all three cards should use the LC steel blue accent (`#3A7CA5`)** for their structural elements (label, number badge, card border).

There's also a CSS bug: lines that append hex opacity digits to `color` values (e.g., `${claim.color}30`, `${claim.color}15`) produce invalid CSS when the color is a `var()` string. This is why the borders and backgrounds render inconsistently.

## Fix

### 1. Unify the `color` field

Change all three claims to use `LC.accent`:

```tsx
const claims = [
  {
    num: "1",
    label: "Coupling",
    question: "Is it strong enough to matter?",
    evidence: "Strong",
    evidenceColor: "var(--green)",
    evidenceBg: "var(--green-dim)",
    kill: "< 5% throughput gap",
    test: "GPT-2 124M, single A100, ~$200",
    color: LC.accent,
  },
  {
    num: "2",
    label: "Learnability",
    question: "Can a GNN policy exploit the joint space?",
    evidence: "Indirect",
    evidenceColor: LC.accent,
    evidenceBg: LC.accentBg,
    kill: "Can't beat sequential on training data",
    test: "GNN on fusion × remat, transformer family",
    color: LC.accent,
  },
  {
    num: "3",
    label: "Hardware Generalization",
    question: "Can the planner generalize across targets?",
    evidence: "Thin",
    evidenceColor: THIN_RED,
    evidenceBg: `${THIN_RED}12`,
    kill: "Fine-tuning with 100 samples always wins",
    test: "Hardware-conditioned model, 3–4 GPU types",
    color: LC.accent,
  },
];
```

The only change: `color` is now `LC.accent` for all three. The `evidenceColor` and `evidenceBg` fields remain different per claim (green for Strong, steel blue for Indirect, red for Thin) — those are semantically distinct and should stay varied.

### 2. Fix the hex-opacity append bug

With all three claims now using `LC.accent` (`"#3A7CA5"`), the `${claim.color}30` and `${claim.color}15` patterns will at least produce valid CSS. But the opacity is too low — `30` hex ≈ 19% opacity, which is nearly invisible.

**Card border** (line ~227):
```tsx
// Current:
borderColor: isActive ? `${claim.color}30` : undefined,

// Change to:
borderColor: isActive ? `${claim.color}50` : undefined,
```

`50` hex ≈ 31% opacity — visible but subtle. Or use a left-border accent for more visual clarity:
```tsx
borderLeft: isActive ? `3px solid ${claim.color}` : undefined,
```

Either approach works. The left-border accent is more distinctive.

**Number badge background** (line ~236):
```tsx
// Current:
background: isActive ? `${claim.color}15` : "transparent",

// Change to:
background: isActive ? LC.accentBg : "transparent",
```

Use the pre-defined `LC.accentBg` (`"#3A7CA515"`) rather than dynamically computing it.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] All three claim labels ("Coupling", "Learnability", "Hardware Generalization") render in the same steel blue color when active
- [ ] All three number badges (1, 2, 3) have the same border color and background tint when active
- [ ] All three card borders have the same treatment when active
- [ ] Evidence badges remain different per claim (green "Strong", blue "Indirect", red "Thin")
- [ ] Timer-driven reveal still works (cards appear sequentially)
