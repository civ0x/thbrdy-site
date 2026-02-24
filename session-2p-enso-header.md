# Session 2p: Add Ensō + "Notice" Label at Top of Essay

## Task

Add a small centered ensō image with "Notice" below it at the very top of the Notice essay's MDX content — after imports, before the Design Hypothesis paragraph. It should feel like a subtle project identifier, not overpower the essay title above it.

### In `src/content/writing/notice.mdx`

After the import statements (line 14) and before the `**Design Hypothesis:**` paragraph, add:

```mdx
<div style="text-align: center; margin: 0 0 2rem;">
  <img src="/images/enso-transparent.png" alt="" style="width: 48px; height: 48px; object-fit: contain; margin: 0 auto 4px; display: block;" />
  <span style="font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 600; color: #2C2416;">Notice</span>
</div>
```

Key sizing decisions:
- Ensō image at 48px — small enough to read as an icon, not a hero image
- "Notice" in Cormorant Garamond at 14px — smaller than the essay title (which is clamp 1.8rem–2.8rem), clearly subordinate
- Minimal bottom margin (2rem) before the Design Hypothesis

### Do not change anything else
- Do not modify PostLayout.astro
- Do not modify the Venn diagram component
- Do not change any other files
