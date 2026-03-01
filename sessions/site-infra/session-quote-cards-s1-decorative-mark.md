# Session: Quote Card Enhancement — Decorative Quotation Mark

## Situation

The site generates per-quote OG images at build time via `scripts/generate-og-images.js`. The `quoteCardSvg()` function renders a 1200×630 SVG with centered italic text, small gold bars above/below, essay title, and site URL. The current design is clean but undifferentiated — it reads as "text on a warm background" rather than "this is a quotation." Adding a large decorative quotation mark glyph gives the card immediate visual identity as a quote and makes the images more recognizable when shared on social platforms.

## Mission

Add a large decorative opening quotation mark (`"` or `"`) to the quote card SVG template. The glyph should be the primary visual anchor — large, faded, and positioned so the quote text sits within or beside it.

## Constraints

- Modify ONLY `quoteCardSvg()` in `scripts/generate-og-images.js`
- Use Cormorant Garamond for the quotation mark glyph (same family as the quote text — keeps it typographically unified)
- Glyph color: `#C4B8AA` (`TEXT_FAINT`) — visible but subordinate to the quote text
- Glyph size: ~180–220px font-size. It should feel architectural, not decorative
- Position: top-left quadrant, roughly `x="100" y="240"` — the quote text block should read as "inside" the quotation mark spatially
- Keep the existing gold bars, essay title, and URL unchanged
- The glyph must not interfere with quote text legibility at any text length (short quotes and max-length 5-line quotes both need to read cleanly)
- No new dependencies. This is a single `<text>` element addition to the SVG template

## Technical Spec

In `quoteCardSvg()`, add a single SVG text element before the quote text block:

```xml
<!-- Decorative quotation mark -->
<text x="100" y="240"
      font-family="Cormorant Garamond" font-size="200" font-weight="600"
      fill="${TEXT_FAINT}" opacity="0.5">"</text>
```

The exact `x`, `y`, `font-size`, and `opacity` values will need visual tuning. The goal is:
- The `"` glyph reads as a watermark — present, recognizable, but clearly background
- Quote text (which is centered at `x="${WIDTH/2}"`) doesn't overlap the glyph in a way that hurts legibility
- The glyph anchors the top-left, creating asymmetry that makes the card feel designed rather than just centered

### Tuning approach

1. Start with the values above
2. Run `node scripts/generate-og-images.js`
3. Open a generated quote card PNG (e.g., `public/images/og/scholion-quote-1.png`) and assess
4. Adjust position, size, and opacity until it reads well
5. Check both a short quote (1–2 lines) and a long quote (4–5 lines) to make sure neither case breaks

Use the curly/smart quote character `\u201C` (") rather than the straight quote `"` — it's more typographically refined and Cormorant Garamond renders it beautifully.

## Files Modified

| File | Action |
|------|--------|
| `scripts/generate-og-images.js` | Add decorative `<text>` element to `quoteCardSvg()` |

## Verification

- [ ] `node scripts/generate-og-images.js` runs without errors
- [ ] Quote card PNGs regenerated in `public/images/og/`
- [ ] Visual check: decorative `"` is visible but subordinate to quote text
- [ ] Visual check: short quote (1–2 lines) card looks balanced
- [ ] Visual check: long quote (4–5 lines) card still readable, no overlap issues
- [ ] Essay OG images and default OG image unchanged
- [ ] No new dependencies in `package.json`
