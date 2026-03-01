# Session: Quote Card Enhancement — Geometric Texture Background

## Prerequisites

Sessions S1 (decorative quotation mark) and S2 (per-project accent color) must be completed first. This session assumes both the `"` glyph and per-project coloring are in place.

## Situation

The quote card background is currently a flat `#FAF6F0` rectangle. The site's identity includes a mandala canvas — sacred geometry rendered in gold at very low opacity, readable as parchment texture. Adding a subtle geometric element to the quote card background creates visual distinction from any other site's quote cards and ties the cards to the site's visual identity. This is the highest-risk enhancement because the line between "textured" and "noisy" is thin, especially at 1200×630 pixels shared on social media (where images are often compressed and downscaled).

## Mission

Add a faint geometric pattern to the quote card background using SVG path elements. The pattern should evoke the mandala canvas aesthetic — concentric circles or radial lines — without competing with the quote text.

## Constraints

- Modify ONLY `quoteCardSvg()` in `scripts/generate-og-images.js`
- The geometric element must be **extremely** subtle: stroke opacity in the 0.03–0.06 range
- Use the project accent color (from S2's `colors.accent`) for the geometry strokes, not a separate color
- Position the geometry off-center (bottom-right quadrant works well) so it doesn't sit directly behind the centered quote text
- The geometry should be simple SVG paths — no bitmap textures, no external files
- Total SVG addition should be under 20 lines. This is a texture hint, not a detailed illustration
- Must look good after PNG compression AND after social media recompression (test at ~50% zoom to simulate Twitter card rendering)

## Technical Spec

### Approach: Concentric circles + radial lines

A simple mandala-like motif: 3–4 concentric circles with 8 radial lines emanating from center, all at very low opacity. Positioned in the bottom-right area so it reads as a watermark/colophon.

```xml
<!-- Geometric texture — bottom-right -->
<g opacity="0.04" stroke="${colors.accent}" fill="none" stroke-width="0.5">
  <circle cx="1050" cy="500" r="60" />
  <circle cx="1050" cy="500" r="100" />
  <circle cx="1050" cy="500" r="140" />
  <!-- Radial lines (8 directions) -->
  <line x1="1050" y1="360" x2="1050" y2="640" />
  <line x1="910" y1="500" x2="1190" y2="500" />
  <line x1="951" y1="401" x2="1149" y2="599" />
  <line x1="1149" y1="401" x2="951" y2="599" />
</g>
```

### Tuning notes

This is the session most likely to need iteration. The variables:

1. **Opacity** (0.03–0.06): Too low and it disappears entirely after JPEG compression on social platforms. Too high and it distracts. Start at 0.04.
2. **Position**: Bottom-right keeps it away from the quote text center. But if the essay title line or the `"` glyph conflicts, shift it.
3. **Scale**: The radii (60/100/140) should be large enough to read as geometry, not as a smudge. But not so large they dominate the card.
4. **Stroke width**: 0.5px at 1200px wide. After downscaling to ~600px (Twitter card), this becomes 0.25px effective — barely a hint. May need 0.75 or 1.0 to survive compression. Test this.

### Iteration protocol

1. Generate with initial values
2. Open a quote card PNG at full size — is the geometry visible?
3. Downscale the PNG to 600px wide (simulate social card) — is it still visible? Is it distracting?
4. If invisible: increase opacity or stroke-width
5. If distracting: decrease opacity, reduce number of circles, or increase transparency
6. Check both gold (Scholion) and teal (Notice) accent versions — the geometry should read at similar intensity in both

### Fallback

If after iteration the geometry consistently either disappears or distracts — if there's no stable middle ground — **remove it entirely and report that finding**. This is the expected failure mode. A flat background is better than a noisy one. The decorative `"` glyph and project accent colors from S1/S2 already provide plenty of visual identity.

## Files Modified

| File | Action |
|------|--------|
| `scripts/generate-og-images.js` | Add geometric `<g>` element to `quoteCardSvg()` before the quote text block |

## Verification

- [ ] `node scripts/generate-og-images.js` runs without errors
- [ ] Quote card PNGs regenerated
- [ ] Visual check at full size (1200×630): geometry is visible as faint texture
- [ ] Visual check at 600px wide (simulating social card): geometry is present but not distracting
- [ ] Visual check: geometry does not overlap quote text in a way that hurts legibility
- [ ] Visual check: works with both gold (Scholion) and teal (Notice) accent colors
- [ ] Long quote (4–5 lines) still readable with geometry behind it
- [ ] Essay OG images and default OG image unchanged
- [ ] If geometry cannot be tuned to a stable sweet spot: revert the addition, note the finding, and ship without it
