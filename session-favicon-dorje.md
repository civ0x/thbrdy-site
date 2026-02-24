# Session: Single Dorje Favicon

## Situation

The site references `favicon.svg` in `Base.astro` (line 25) but the file doesn't exist in `public/`. The hero section of `index.astro` (lines 16–26) already has a single dorje (vajra) as an inline SVG. We want to use that same dorje as the favicon, with a PNG fallback.

## Mission

1. **Create `public/favicon.svg`** — the single dorje from the hero, adapted for favicon rendering.
2. **Generate `public/favicon.png`** — a 32×32 PNG fallback.
3. **Update `src/layouts/Base.astro`** — add the PNG fallback link alongside the existing SVG link.

## Design Spec: Favicon SVG

The existing hero dorje SVG (`index.astro` lines 17–26):

```svg
<svg viewBox="0 0 40 40" width="60" height="60">
  <line x1="20" y1="2" x2="20" y2="38" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="4"/>
  <line x1="10" y1="8" x2="20" y2="16" stroke-linecap="round"/>
  <line x1="30" y1="8" x2="20" y2="16" stroke-linecap="round"/>
  <line x1="10" y1="32" x2="20" y2="24" stroke-linecap="round"/>
  <line x1="30" y1="32" x2="20" y2="24" stroke-linecap="round"/>
  <circle cx="20" cy="2" r="2"/>
  <circle cx="20" cy="38" r="2"/>
</svg>
```

Adapt this into a standalone `favicon.svg`:

- Keep `viewBox="0 0 40 40"` (same geometry, no rescaling needed)
- Remove `width` and `height` attributes (let the browser scale it)
- Add `xmlns="http://www.w3.org/2000/svg"`
- Hardcode the colors that are currently inherited from CSS:
  - `stroke="#B8860B"` on all lines (the site's `--accent` gold)
  - `stroke-width="1.5"`
  - `fill="#B8860B"` on the central hub circle and tip circles
  - `fill="none"` as the SVG default
- Background: transparent
- **Legibility check:** At 16×16 display, the 1.5 stroke may be too thin. If so, increase to `stroke-width="2"`. The central hub `r="4"` and tip circles `r="2"` should be fine. Use judgment — the dorje should read as a recognizable symbol at favicon size, not a thin scratch.

## Base.astro Update

Current (line 25):
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Change to:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
```

SVG first (modern browsers prefer it); PNG is the fallback.

## PNG Generation

Generate a 32×32 PNG from the SVG. Options in order of preference:
1. `npx svgexport public/favicon.svg public/favicon.png 32:32`
2. Sharp or another Node image library
3. Inkscape CLI: `inkscape -w 32 -h 32 public/favicon.svg -o public/favicon.png`
4. If no conversion tool works, note it for manual generation

## Verification

- [ ] `public/favicon.svg` exists and renders the single dorje in gold on transparent background
- [ ] `public/favicon.png` exists at 32×32
- [ ] `Base.astro` has both favicon links (SVG + PNG)
- [ ] `npm run build` succeeds with zero errors
- [ ] Open the site locally (`npm run dev`) and confirm the favicon appears in the browser tab
- [ ] Favicon reads clearly at 16×16 display size — the dorje form is recognizable, not a thin scratch

## Constraints

- No new runtime JS dependencies (dev dependencies for PNG conversion are fine)
- Keep the SVG hand-authored — it's literally 10 lines, no tooling needed
- The favicon should be visually identical to the hero dorje, just self-contained with hardcoded colors
