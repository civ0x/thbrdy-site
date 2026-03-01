# Session: Fix Notice Quote Card — Missing Glyph and Mandala

## Situation

Quote cards for essays with `connected_project: "Notice"` are rendering without the decorative `"` glyph or the geometric mandala. Scholion (gold) and Pando (blue) cards render both elements correctly. The Notice card appears as bare text on a flat background — identical to the pre-enhancement design.

The suspected cause: the Notice dim color (`#7AA69C`) at 50% opacity on the `#FAF6F0` background produces insufficient contrast, making both elements invisible. But it could also be a data issue (e.g., `connected_project` not matching the lookup key, quote extraction failing for the Notice essay, or the quote card not being regenerated).

## Mission

Diagnose why Notice quote cards lack the decorative `"` glyph and geometric mandala, then fix it.

## Investigation Steps

1. **Verify the data pipeline.** Check which MDX files have `connected_project: "Notice"`. Confirm they contain `<PullQuote>` components. Run the quote extraction logic mentally or via a test to confirm quotes are being extracted and `connected_project` is threaded through.

2. **Check the lookup match.** In `scripts/generate-og-images.js`, the `PROJECT_ACCENTS` key is `'Notice'`. The frontmatter value must match exactly — check for case, whitespace, or quoting differences in the MDX files.

3. **Inspect the SVG output.** Add a temporary `console.log` or `writeFileSync` to dump the raw SVG string for a Notice quote card before it's rendered to PNG. Check whether the `"` glyph `<text>` element and the mandala `<g>` element are present in the SVG. If they are, the issue is purely visual (contrast). If they're missing, the issue is in the code path.

4. **Test contrast.** If the SVG elements ARE present, the fix is adjusting colors. The current Notice dim is `#7AA69C`. Try:
   - Increasing the glyph opacity from 0.5 to 0.7
   - Darkening the dim further to `#5A8A80`
   - Or both

   The mandala uses `colors.accent` (`#2A7A6A`) at opacity 0.22. Compare: gold `#B8860B` at 0.22 on `#FAF6F0` is warm-on-warm with decent contrast. Teal `#2A7A6A` at 0.22 on warm white is cool-on-warm — inherently lower perceived contrast. May need opacity 0.30–0.35 for teal specifically, or a per-project opacity in the `PROJECT_ACCENTS` lookup.

5. **If per-project opacity is needed**, extend the `PROJECT_ACCENTS` structure:
   ```js
   const PROJECT_ACCENTS = {
     'Scholion': { accent: '#B8860B', dim: '#C4B8AA', glyphOpacity: 0.5, mandalaOpacity: 0.22 },
     'Notice':   { accent: '#2A7A6A', dim: '#5A8A80', glyphOpacity: 0.7, mandalaOpacity: 0.32 },
     'Pando':    { accent: '#2A5A8A', dim: '#A3B8CD', glyphOpacity: 0.5, mandalaOpacity: 0.22 },
   };
   ```
   Then reference `colors.glyphOpacity` and `colors.mandalaOpacity` in the SVG template instead of hardcoded values.

## Files to Investigate

| File | What to check |
|------|---------------|
| `scripts/generate-og-images.js` | `PROJECT_ACCENTS` lookup, `quoteCardSvg()` template, `extractQuotes()` data flow |
| `src/content/writing/*.mdx` | Which files have `connected_project: "Notice"` and contain `<PullQuote>` |
| `public/images/og/*notice*` | Current output — compare to Scholion/Pando equivalents |

## Verification

- [ ] Root cause identified and documented
- [ ] `node scripts/generate-og-images.js` runs without errors
- [ ] Notice quote card PNG shows visible `"` glyph (comparable weight to Scholion glyph)
- [ ] Notice quote card PNG shows visible mandala geometry (comparable weight to Scholion mandala)
- [ ] Scholion and Pando cards unchanged or improved
- [ ] No new dependencies
