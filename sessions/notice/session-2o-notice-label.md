# Session 2o: Venn — Add "Notice" Label to Ensō

In `src/components/islands/NoticeCompetitiveGap.tsx`, add a "Notice" text label directly above the "All three — plus AI reflection" description and directly below the ensō image.

In the Notice badge section (around line 261–279), add a `<p>` element between the `<img>` and the existing description `<p>`:

```tsx
<p style={{
  fontFamily: tokens.serif,
  fontSize: "18px",
  fontWeight: 600,
  color: "#2C2416",
  margin: "0 auto 4px",
  textAlign: "center",
}}>Notice</p>
```

This goes after the `<img>` closing tag and before the existing `<p className="notice-gap-notice-desc">` element.

Do not change anything else.
