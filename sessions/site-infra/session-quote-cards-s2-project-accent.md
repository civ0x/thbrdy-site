# Session: Quote Card Enhancement — Per-Project Accent Color

## Prerequisite

Session S1 (decorative quotation mark) must be completed first. This session assumes the `"` glyph is already present in `quoteCardSvg()`.

## Situation

All quote card images currently use the same gold accent (`#B8860B`) for the gold bars and the same `TEXT_FAINT` color for the decorative quotation mark. The `connected_project` field is already extracted in `getEssays()` and available on each essay object, but `extractQuotes()` does not pass it through to the quote data. Adding a per-project accent color differentiates quote cards by origin — a Scholion quote looks distinct from a Notice quote at a glance, which matters when multiple cards appear on the same social feed.

## Mission

Thread `connected_project` through to `quoteCardSvg()` and use it to select a project-specific accent color for the gold bars and decorative quotation mark.

## Constraints

- Modify ONLY `scripts/generate-og-images.js`
- The accent color shifts apply to: the two horizontal bars AND the decorative `"` glyph
- The quote text, essay title, URL, and background remain unchanged
- Use colors from the existing design system's semantic palette (defined in CLAUDE.md):

| Project | Accent | Dim (for `"` glyph) |
|---------|--------|----------------------|
| Scholion | `#B8860B` (gold — the default, unchanged) | `#C4B8AA` (current TEXT_FAINT) |
| Notice | `#2A7A6A` (teal) | `#A3C4BD` (teal at ~40% on BG) |
| (none/other) | `#B8860B` (gold — fallback) | `#C4B8AA` (TEXT_FAINT) |

- You may need to compute the "dim" variants. The pattern: take the accent color and mix it toward `#FAF6F0` at roughly 65–70% background. The goal is a tint that reads as "colored but quiet" — same role as `TEXT_FAINT` plays for gold
- If future projects are added (e.g., Pando), they should be easy to slot in — use a lookup object, not if/else chains

## Technical Spec

### 1. Thread `connected_project` through extractQuotes

Currently `extractQuotes()` receives an essay object but only uses `slug`, `title`, `body`. It returns objects with `{ slug, title, index, text }`. Add `connected_project`:

```js
// In extractQuotes(), change the push to include:
quotes.push({
  slug: essay.slug,
  title: essay.title,
  connected_project: essay.connected_project,
  index,
  text,
});
```

### 2. Add project color lookup

Near the top of the file, alongside the design tokens:

```js
const PROJECT_ACCENTS = {
  'Scholion': { accent: '#B8860B', dim: '#C4B8AA' },
  'Notice':   { accent: '#2A7A6A', dim: '#A3C4BD' },
  // Add future projects here
};
const DEFAULT_ACCENT = { accent: ACCENT, dim: TEXT_FAINT };
```

### 3. Update quoteCardSvg signature and usage

```js
function quoteCardSvg({ text, title, connected_project }) {
  const colors = PROJECT_ACCENTS[connected_project] || DEFAULT_ACCENT;
  // Use colors.accent for the gold bars' stroke
  // Use colors.dim for the decorative " glyph fill
  // ...
}
```

Replace hardcoded `${ACCENT}` in bar strokes with `${colors.accent}`, and the `"` glyph's fill with `${colors.dim}`.

### 4. Tuning the dim colors

The exact dim values above are estimates. After generating, visually compare a Scholion quote card (gold) with a Notice quote card (teal). The teal dim should feel like the same "quiet background glyph" energy as the gold dim — just tinted differently. Adjust if needed.

To find Notice quotes specifically: look for MDX files with `connected_project: "Notice"` in frontmatter, then check if they contain `<PullQuote>` components.

## Files Modified

| File | Action |
|------|--------|
| `scripts/generate-og-images.js` | Add PROJECT_ACCENTS lookup; thread connected_project through extractQuotes; update quoteCardSvg to use per-project colors |

## Verification

- [ ] `node scripts/generate-og-images.js` runs without errors
- [ ] All quote card PNGs regenerated
- [ ] Scholion quote cards still use gold accent (unchanged from S1)
- [ ] Notice quote cards use teal accent on bars and `"` glyph
- [ ] Quote cards with no `connected_project` fall back to gold
- [ ] Visual check: teal dim glyph reads at same "intensity" as gold dim glyph — quiet but tinted
- [ ] Essay OG images and default OG image unchanged
- [ ] No new dependencies
