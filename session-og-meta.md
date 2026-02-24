# Session: Open Graph & Twitter Card Meta Tags

## Situation

thbrdy.dev has no social preview meta tags. When a link is shared on Twitter/X, LinkedIn, Slack, Discord, or iMessage, the preview is either blank or a bare URL. The site has `title` and `description` in `<head>` but no `og:*` or `twitter:*` tags, no canonical URL, and no social image.

## Mission

Add Open Graph and Twitter Card meta tags to all pages, generate a default social image, and ensure link previews render correctly across platforms.

## Deliverables

### 1. Generate default OG image (`public/images/og-default.png`)

Create a Node script at `scripts/generate-og-image.js` that renders a 1200×630 PNG using `@resvg/resvg-js` (SVG → PNG, no browser dependency).

**Design spec** (matches site design system):

- Background: `#FAF6F0` (site `--bg`)
- Centered layout, vertically and horizontally
- Name: "THOMAS BRADY" — approximation of Cinzel 400 style: uppercase, letter-spacing wide. Use a system serif or embed the font via `@resvg/resvg-js` font loading. If Cinzel can't be embedded easily, use a clean serif at 400 weight with wide letter-spacing — the goal is "inscriptional, lapidary" feel.
- Below name: a horizontal gold rule, 100px wide, 2px tall, color `#B8860B`
- Below rule: "TECHNO-VAJRAPĀṆI" — monospace style, small caps, color `#B8860B`, letter-spacing wide
- Below that: "Making invisible structures visible and navigable" — serif italic, color `#6B5D4F`
- Subtle border: 1px `rgba(44, 36, 22, 0.1)` around the entire image (looks cleaner in previews than a raw edge)

**Run the script once** to produce `public/images/og-default.png`. The script is a dev tool, not a build step.

Install `@resvg/resvg-js` as a dev dependency: `npm install --save-dev @resvg/resvg-js`

### 2. Extend `Base.astro` props and `<head>`

**Props interface** — add:
```typescript
interface Props {
  title?: string;
  description?: string;
  image?: string;      // Path relative to site root, e.g. "/images/og-default.png"
  type?: string;       // "website" | "article", default "website"
}
```

**Defaults:**
```typescript
const {
  title = 'Thomas Brady — techno-vajrapāṇi',
  description = 'Making invisible structures visible and navigable.',
  image = '/images/og-default.png',
  type = 'website',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site ?? 'https://thbrdy.dev');
const ogImageURL = new URL(image, Astro.site ?? 'https://thbrdy.dev');
```

**Add to `<head>`** (after the existing `<meta name="description">`):
```html
<!-- Canonical -->
<link rel="canonical" href={canonicalURL.href} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL.href} />
<meta property="og:image" content={ogImageURL.href} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content={type} />
<meta property="og:site_name" content="Thomas Brady" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL.href} />
```

**Important:** Also add `site` to `astro.config.mjs` if not already present:
```javascript
export default defineConfig({
  site: 'https://thbrdy.dev',
  // ... existing config
});
```

This is required for `Astro.site` to resolve correctly.

### 3. Thread props through `PostLayout.astro`

Update the `<Base>` call in PostLayout to pass `type="article"`:

```astro
<Base
  title={`${title} — Thomas Brady`}
  description={description}
  type="article"
/>
```

The default OG image applies to essays too. Per-essay images can be added later by extending the content schema with an optional `og_image` field.

### 4. Verify

After all changes:

- [ ] `npm run build` passes clean
- [ ] View page source of built HTML (`dist/index.html`, `dist/writing/notice/index.html`) and confirm:
  - `og:title`, `og:description`, `og:url`, `og:image` present with correct values
  - `twitter:card` = `summary_large_image`
  - `og:type` = `website` on homepage, `article` on essay pages
  - `og:image` resolves to an absolute URL (`https://thbrdy.dev/images/og-default.png`)
  - Canonical URL is present and correct
- [ ] `public/images/og-default.png` exists, is 1200×630, file size reasonable (<200KB)
- [ ] No new runtime JS dependencies added (resvg-js is devDependency only)

## Technical Constraints

- Do not modify any files outside scope (no CSS, no essay MDX, no islands)
- `@resvg/resvg-js` is devDependency only — it does NOT ship to the browser
- The OG image generation script is a one-shot dev tool in `scripts/`, not part of the build pipeline
- If Cinzel font embedding is complex with resvg, fall back to rendering the SVG with system serif fonts and wide letter-spacing. The image should feel right, not be pixel-perfect to the web render.
- Respect the Cowork rule: this session prompt is for execution by Claude Code, not Cowork

## Files Modified

| File | Change |
|------|--------|
| `scripts/generate-og-image.js` | **NEW** — SVG→PNG generation script |
| `public/images/og-default.png` | **NEW** — Generated 1200×630 social image |
| `src/layouts/Base.astro` | Add image/type props, OG + Twitter meta tags, canonical link |
| `src/layouts/PostLayout.astro` | Pass `type="article"` to Base |
| `astro.config.mjs` | Add `site: 'https://thbrdy.dev'` if missing |
| `package.json` | `@resvg/resvg-js` added to devDependencies |

## After Execution

Update STATUS.md:
- Check off "Open Graph / social meta tags" in Phase 5
- Note in Current State that OG + Twitter Card meta tags are live

Update DECISIONS.md with a new entry documenting the choice of `@resvg/resvg-js` over Puppeteer/Playwright for OG image generation (no browser dependency, deterministic SVG rendering, small devDependency footprint).
