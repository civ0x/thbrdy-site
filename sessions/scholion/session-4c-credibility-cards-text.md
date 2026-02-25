# Session 4c: Credibility Cards — Accurate Role Descriptions

## Kickoff

Read `CLAUDE.md`, `STATUS.md`, and this file, then execute.

## Situation

The credibility card text in `ScholionCredibilityCards.tsx` overstates the author's role. The cards say "Built..." and "Led training..." which implies hands-on engineering. The author was the product leader for these efforts — driving research strategy, incubating for commercialization, and promoting technology out of the lab. The role is technology transition, not implementation.

## Mission

Update the four card text strings in `src/components/islands/ScholionCredibilityCards.tsx`. No other files need changes — the MDX prose in Section 06 already accurately describes the role.

## Changes

Replace the `cards` array (lines 4–21) with:

```typescript
const cards = [
  {
    label: "ML Compilation",
    text: "Drove <strong>AWS Neuron SDK</strong> from compiler research to production SDK for Trainium chips.",
  },
  {
    label: "Graph ML",
    text: "Brought <strong>Neptune ML</strong> from research to production, establishing graph machine learning on AWS.",
  },
  {
    label: "AutoML",
    text: "Product lead for AutoML at <strong>H2O.ai</strong> alongside the team that built Driverless AI.",
  },
  {
    label: "LLM Training",
    text: "Drove research strategy and commercialization for <strong>Amazon's first production LLM</strong>.",
  },
];
```

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] All four cards render with updated text
- [ ] Bold formatting preserved on key terms (AWS Neuron SDK, Neptune ML, H2O.ai, Amazon's first production LLM)
- [ ] No layout changes — 2×2 grid on desktop, 1-column on mobile
