# Session 2l: Venn — Center Category Labels on Circle Centers

In `src/components/islands/NoticeCompetitiveGap.tsx`, update `catLabelPositions`.

Each label must be horizontally centered on its circle's x-coordinate using `transform: translateX(-50%)`. The current positions use `left` without centering, so the labels drift.

```typescript
const catLabelPositions = [
  { left: "33%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Meditation: centered on x=33%
  { left: "67%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Mood: centered on x=67%
  { left: "50%", top: "76%", textAlign: "center" as const, transform: "translateX(-50%)" },   // Health: centered on x=50%
];
```

The `left` values match each circle's center x-coordinate exactly (33%, 67%, 50%). The `transform: translateX(-50%)` centers the label element on that point.

Do not change anything else.
