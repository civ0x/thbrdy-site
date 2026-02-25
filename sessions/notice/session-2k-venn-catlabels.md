# Session 2k: Venn — Center Category Labels in Solo Regions

In `src/components/islands/NoticeCompetitiveGap.tsx`, update `catLabelPositions`:

```typescript
const catLabelPositions = [
  { left: "15%", top: "28%", textAlign: "center" as const },   // Meditation: move down from 20%
  { left: "73%", top: "28%", textAlign: "center" as const },   // Mood: move down from 20%
  { left: "50%", top: "80%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Health: move up from 85%
];
```

Three value changes. Do not change anything else.
