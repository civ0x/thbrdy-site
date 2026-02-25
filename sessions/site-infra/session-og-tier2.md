# Session Prompt: Pull Quote Share Cards (Tier 2)

**Prerequisite:** Tier 1 (per-essay OG images) must be complete before starting this session.

## Situation

thbrdy.dev now generates per-essay OG images at build time. The next step is the feature that was actually requested: letting readers share individual pull quotes from essays as Twitter posts, where the social card renders the quote in the site's typographic aesthetic.

The site has 8 PullQuotes across 6 published essays:
- `ab-essay.mdx` — 1 quote
- `valley-of-death.mdx` — 2 quotes
- `learned-compilation.mdx` — 1 quote
- `scholion.mdx` — 2 quotes
- `coregulation.mdx` — 1 quote
- `notice.mdx` — 0 quotes (uses PullQuote? — verify)

PullQuote is a React island component (`src/components/islands/shared/PullQuote.tsx`) rendered via `client:visible`. It currently accepts `children` (the quote text) and renders a centered italic block with scroll-triggered fade-in.

## Mission

1. Add a share affordance to the PullQuote component (Twitter + copy link)
2. Generate per-quote OG images at build time
3. Create lightweight static pages that serve as share targets with quote-specific OG meta tags

## Deliverables

### 1. Quote data extraction at build time

**Extend `scripts/generate-og-images.js`** to also extract PullQuote content from MDX files and generate quote card images.

**Extraction approach:**
- Regex-scan each MDX file for `<PullQuote client:visible>...</PullQuote>` blocks
- Extract the text content (strip any inner JSX/HTML tags if present)
- Assign each quote a 1-based index per essay (order of appearance in MDX)
- Output: array of `{ slug, index, text }` objects

**Quote card OG image layout (1200×630):**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [bg: #FAF6F0, subtle 1px border rgba(44,36,22,0.1)]        │
│                                                              │
│                                                              │
│            ── (40px gold rule, 2px)                          │
│                                                              │
│         "The valley of death is not a       ← Cormorant     │
│          gap between two stable entities.     Garamond 36px, │
│          It's the information loss that       italic 400,    │
│          occurs when coupled questions        --text,        │
│          are answered sequentially."          centered,      │
│                                               max-w 900px   │
│            ── (40px gold rule, 2px)                          │
│                                                              │
│         The Valley of Death Is a            ← JetBrains     │
│         Legibility Problem                    Mono 14px,     │
│                                               --text-muted   │
│                                                              │
│              thbrdy.dev                     ← JetBrains     │
│                                               Mono 13px,     │
│                                               --text-faint   │
│                                               bottom-center  │
└──────────────────────────────────────────────────────────────┘
```

The quote is centered vertically in the card. Gold accent bars above and below (matching PullQuote's top-bar pattern, but here both top and bottom since this is a standalone card, not inline with SectionDividers). Below the bottom bar: essay title in mono. Bottom of card: `thbrdy.dev`.

**Text wrapping:** Same character-count heuristic approach as essay titles, but for quote text at 36px italic. Maximum 5 lines. If the quote exceeds 5 lines at 36px, reduce to 30px and re-wrap. If still too long, reduce to 26px.

**Output files:** `public/images/og/[slug]-quote-[n].png` (e.g., `valley-of-death-quote-1.png`)

### 2. Share target pages

Create lightweight Astro pages that serve as the shareable URL for each quote. These pages exist solely to provide quote-specific OG meta tags to Twitter's crawler, then redirect the reader to the actual essay.

**File:** `src/pages/writing/[...slug]/quote/[n].astro`

This is a dynamic route that generates a static page for each quote.

```astro
---
import Base from '../../../../layouts/Base.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  const paths = [];

  for (const post of posts) {
    // Extract PullQuotes via regex (same logic as generate-og-images.js)
    const quoteRegex = /<PullQuote[^>]*>([\s\S]*?)<\/PullQuote>/g;
    let match;
    let index = 1;
    while ((match = quoteRegex.exec(post.body ?? '')) !== null) {
      const text = match[1].trim();
      paths.push({
        params: { slug: post.id, n: String(index) },
        props: { post, quoteText: text, quoteIndex: index },
      });
      index++;
    }
  }
  return paths;
}

const { post, quoteText, quoteIndex } = Astro.props;
const essayUrl = new URL(`/writing/${post.id}/`, Astro.site ?? 'https://thbrdy.dev');
---

<Base
  title={`"${quoteText.slice(0, 80)}${quoteText.length > 80 ? '…' : ''}" — ${post.data.title}`}
  description={post.data.description}
  type="article"
  image={`/images/og/${post.id}-quote-${quoteIndex}.png`}
>
  <!-- Minimal page that redirects to the essay -->
  <meta http-equiv="refresh" content={`0;url=${essayUrl.href}`} />
  <article style="max-width: 720px; margin: 8rem auto; padding: 0 2rem; text-align: center;">
    <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic; color: var(--text); line-height: 1.6;">
      "{quoteText}"
    </p>
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted); margin-top: 2rem;">
      From <a href={essayUrl.href} style="color: var(--accent);">{post.data.title}</a>
    </p>
  </article>
</Base>
```

The page has a `<meta http-equiv="refresh">` redirect so human visitors go straight to the essay. Twitter's crawler reads the OG tags before following redirects, so the quote-specific image is what renders in the card.

**Important:** The redirect page should be a real HTML page (not a 301) because some crawlers don't follow redirects for OG images. The page briefly flashes for humans before redirecting — this is acceptable given the redirect is instant (`content="0"`).

### 3. PullQuote component upgrade

**Modify `src/components/islands/shared/PullQuote.tsx`:**

Add a share bar that appears below the quote text. Two actions: share to Twitter/X and copy link.

**New props:**

```typescript
interface PullQuoteProps {
  children: ReactNode;
  slug?: string;      // Essay slug for constructing share URL
  quoteIndex?: number; // 1-based index of this quote in the essay
}
```

**Share bar layout:**

```
                  [quote text as before]

                  𝕏  ·  🔗                     ← share icons
```

The share bar appears below the quote, centered, using small (16px) inline SVG icons. Subtle — `--text-muted` by default, `--accent` on hover. No text labels; just the icons with tooltips. The bar fades in with the quote (same `inView` animation).

**Icon implementation:** Inline SVG (no icon libraries per CLAUDE.md). Two icons:
- **X/Twitter:** The 𝕏 logo mark (simple path)
- **Link/copy:** A chain-link icon (two interlocking rounded rectangles)

**Twitter intent URL construction:**

```typescript
const tweetUrl = `https://twitter.com/intent/tweet?${new URLSearchParams({
  text: `"${quoteText}"\n\n— ${essayTitle}`,
  url: `https://thbrdy.dev/writing/${slug}/quote/${quoteIndex}/`,
}).toString()}`;
```

The `url` parameter points to the quote's share target page, which has the quote-specific OG image. Twitter renders the card from this URL's meta tags.

**Copy link behavior:**

Copies `https://thbrdy.dev/writing/${slug}/quote/${quoteIndex}/` to clipboard. Show brief "Copied!" feedback (swap icon or show a small tooltip for 2s, then revert).

**Passing props from MDX:**

Currently, MDX files use PullQuote like:
```mdx
<PullQuote client:visible>Quote text here</PullQuote>
```

This needs to become:
```mdx
<PullQuote client:visible slug="valley-of-death" quoteIndex={1}>Quote text here</PullQuote>
```

**Alternative approach (preferred — less MDX churn):** Instead of requiring explicit `slug` and `quoteIndex` props in every MDX file, have PullQuote infer the share URL from the current page URL at runtime:

```typescript
// Inside PullQuote component
const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
// Extract slug from /writing/[slug]/ pattern
const slugMatch = currentPath.match(/\/writing\/([^/]+)\//);
const slug = slugMatch ? slugMatch[1] : '';
```

For `quoteIndex`, use a data attribute or a simple approach: each PullQuote could accept an optional `id` prop that maps to its index. Or — simplest — just require the explicit props. There are only 8 quotes across 6 essays. The MDX edit is minimal.

**Recommendation:** Use explicit props. It's 8 edits, it's unambiguous, and it doesn't rely on runtime URL parsing that could break during SSR/hydration.

### 4. MDX updates

Add `slug` and `quoteIndex` props to every PullQuote usage across all essays:

- `ab-essay.mdx`: `<PullQuote client:visible slug="ab-essay" quoteIndex={1}>...</PullQuote>`
- `valley-of-death.mdx`: quotes 1 and 2
- `learned-compilation.mdx`: quote 1
- `scholion.mdx`: quotes 1 and 2
- `coregulation.mdx`: quote 1

## Technical Constraints

- No new npm dependencies
- Share icons are inline SVG (no lucide-react, no icon libraries)
- The share bar inherits the PullQuote's animation — it appears with the quote, not separately
- Share bar must respect `prefers-reduced-motion`
- The quote share pages add to the total page count but are tiny (minimal HTML + redirect)
- Twitter's crawler respects `<meta http-equiv="refresh">` but reads OG tags first — this pattern is well-established
- The copy-link feature uses `navigator.clipboard.writeText()` (widely supported, fails gracefully)
- No analytics or tracking on share actions

## Design Notes

**Share bar visual weight:** The share icons should be **quiet**. They're not a CTA — they're a convenience for readers who've already decided to share. `--text-muted` (#9B8E80) at rest, `--accent` (#B8860B) on hover, 16×16px icons, 8px gap between them, separated by a centered dot in `--border` color. The whole bar sits 16px below the quote text, centered.

**Quote card aesthetics:** The OG images should look like they belong to the site. Warm off-white background, Cormorant Garamond italic for the quote, gold accent bars for visual rhythm, JetBrains Mono for the essay title attribution. The quote should be in regular quotation marks (not guillemets, not smart quotes — just `"..."`). No decorative elements beyond the gold rules.

**Copy feedback:** When "copy link" is clicked, the chain-link icon briefly transforms to a checkmark (transition over 200ms), holds for 2 seconds, then reverts. Use React state, not CSS-only, since it needs a timer.

## Verification Checklist

- [ ] `npm run generate:og` produces quote card PNGs in addition to essay PNGs
- [ ] Each quote card PNG is 1200×630, visually matches the layout spec
- [ ] Quote text wraps correctly for long quotes (Valley of Death quote 1 is ~130 characters)
- [ ] Share target pages exist at `/writing/[slug]/quote/[n]/` for every PullQuote
- [ ] Share target pages have correct `og:image` pointing to the quote-specific PNG
- [ ] Share target pages redirect to the parent essay (verify `<meta http-equiv="refresh">`)
- [ ] PullQuote component shows share bar (𝕏 icon + link icon)
- [ ] Twitter intent URL opens Twitter compose with quoted text + share target URL
- [ ] Copy link copies the share target URL to clipboard
- [ ] Copy feedback (checkmark) appears and reverts after 2 seconds
- [ ] Share bar respects `prefers-reduced-motion`
- [ ] All MDX files updated with `slug` and `quoteIndex` props
- [ ] `npm run build` succeeds with zero errors
- [ ] Test a share URL with Twitter Card Validator (https://cards-dev.twitter.com/validator) — verify the quote card image renders
- [ ] No new dependencies in `package.json`
