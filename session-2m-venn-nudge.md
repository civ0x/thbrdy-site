# Session 2m: Venn — Nudge Category Labels

In `src/components/islands/NoticeCompetitiveGap.tsx`, update `catLabelPositions`:

```typescript
const catLabelPositions = [
  { left: "28%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Meditation: nudge left from 33%
  { left: "72%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Mood: nudge right from 67%
  { left: "50%", top: "72%", textAlign: "center" as const, transform: "translateX(-50%)" },   // Health: move up from 76%
];
```

Three value changes: Meditation `left` 33%→28%, Mood `left` 67%→72%, Health `top` 76%→72%. Do not change anything else.
