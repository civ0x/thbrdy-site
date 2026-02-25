# Session Prompt: Fix Twitter OG Image Rendering on Quote Share Pages

## Situation

Quote share pages at `/writing/[slug]/quote/[n]/` use `<meta http-equiv="refresh" content="0;url=...">` to redirect visitors to the parent essay. Twitter's crawler (Twitterbot) follows `meta refresh` redirects — it hits the quote page, follows the redirect to the parent essay, and reads the **parent essay's** OG tags instead of the quote-specific ones. Result: the per-quote card images never appear in Twitter previews.

The OG images themselves are correct and accessible (verified: `https://thbrdy.dev/images/og/valley-of-death-quote-1.png` resolves at 1200×630). The meta tags in `Base.astro` are correct. The issue is solely that Twitterbot never reads the quote page's tags because it follows the meta refresh first.

## Mission

Replace the `<meta http-equiv="refresh">` redirect with a JavaScript redirect. Crawlers don't execute JavaScript — Twitterbot will read the OG tags and stop. Real browsers execute JS and redirect to the parent essay as before.

## The Fix

### Edit `src/pages/writing/[slug]/quote/[n].astro`

**Remove** line 39:
```astro
<meta http-equiv="refresh" content={`0;url=${essayUrl.href}`} slot="head" />
```

**Replace** with a `<script>` block inside the `<article>` body (not in the `<head>` slot):
```astro
<script define:vars={{ redirectUrl: essayUrl.href }}>
  window.location.replace(redirectUrl);
</script>
```

The full file should read:

```astro
---
import Base from '../../../../layouts/Base.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('writing');
  const paths = [];

  for (const post of posts) {
    if (post.data.draft) continue;
    const quoteRegex = /<PullQuote[^>]*>([\s\S]*?)<\/PullQuote>/g;
    let match;
    let index = 1;
    while ((match = quoteRegex.exec(post.body ?? '')) !== null) {
      const text = match[1].replace(/<[^>]*>/g, '').trim();
      if (text) {
        paths.push({
          params: { slug: post.id, n: String(index) },
          props: { post, quoteText: text, quoteIndex: index },
        });
        index++;
      }
    }
  }
  return paths;
}

const { post, quoteText, quoteIndex } = Astro.props;
const essayUrl = new URL(`/writing/${post.id}/`, Astro.site ?? 'https://thbrdy.dev');
const truncatedQuote = quoteText.length > 80 ? quoteText.slice(0, 80) + '…' : quoteText;
---

<Base
  title={`"${truncatedQuote}" — ${post.data.title}`}
  description={post.data.description}
  type="article"
  image={`/images/og/${post.id}-quote-${quoteIndex}.png`}
>
  <article style="max-width: 720px; margin: 8rem auto; padding: 0 2rem; text-align: center;">
    <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic; color: var(--text); line-height: 1.6;">
      &ldquo;{quoteText}&rdquo;
    </p>
    <p style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted); margin-top: 2rem;">
      From <a href={essayUrl.href} style="color: var(--accent);">{post.data.title}</a>
    </p>
  </article>
  <script define:vars={{ redirectUrl: essayUrl.href }}>
    window.location.replace(redirectUrl);
  </script>
</Base>
```

### Why `window.location.replace()` instead of `window.location.href`

`replace()` doesn't create a history entry, so the user can't "back" into the quote redirect page. Same UX as the original meta refresh.

### Why `define:vars` instead of inline template literal

Astro's `<script>` tags are processed at build time and bundled. `define:vars` injects the server-side variable into the client script cleanly. A raw template literal inside `<script>` wouldn't have access to the Astro variable.

## No Other Changes Needed

- `Base.astro` — unchanged
- OG images — unchanged (already correct and deployed)
- PullQuote component — unchanged
- `generate-og-images.js` — unchanged

## Verification Checklist

- [ ] `<meta http-equiv="refresh">` removed from `[n].astro`
- [ ] `<script define:vars>` with `window.location.replace()` added
- [ ] `npm run build` succeeds with zero errors
- [ ] Page count unchanged (same number of quote pages generated)
- [ ] Visiting `/writing/valley-of-death/quote/1/` in a browser still redirects to the parent essay
- [ ] View source of a quote page confirms: OG meta tags present, no `<meta http-equiv="refresh">`, JS redirect in `<script>` tag
- [ ] After deploy: paste a quote share URL into a new tweet draft on Twitter — the quote card image should appear in the preview (note: Twitter may take a few minutes to fetch and cache the card)
