# Session Prompt: Essay Share Bar

## Situation

Essays on thbrdy.dev end abruptly — content flows straight into the footer with no sharing affordance. The only sharing currently lives inside `PullQuote` components (X/Twitter intent + copy link for individual quotes). OG meta tags are already wired in `Base.astro` and per-essay OG images exist at `/images/og/[slug].png`.

The goal is to add an essay-level share bar in two placements: one in the header area (near the metadata line) and one at the end of the essay content. This gives readers a way to share the essay URL at the moment they decide to (either on arrival from the title, or after finishing).

Reference pattern: Substack's article share UI — but adapted to this site's minimal aesthetic. No modal, no platform-specific mechanics (restacks, notes). Just a clean inline row.

## Mission

Add a `ShareBar` component to `PostLayout.astro` that renders at two positions:
1. **Header placement:** Below the tags row (or below the meta line if no tags), right-aligned or centered.
2. **Footer placement:** After `post__content` ends, before the article closing tag. Centered, with a subtle section divider above it.

### Share Actions (4 items)

1. **Copy link** — Copies the essay's canonical URL to clipboard. Icon swaps to checkmark for 2 seconds (same pattern as `PullQuote.tsx`).
2. **X (Twitter)** — Opens `https://twitter.com/intent/tweet?text={title}&url={canonicalUrl}` in a new window.
3. **LinkedIn** — Opens `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}` in a new window.
4. **Email** — `mailto:?subject={title}&body={description}%0A%0A{canonicalUrl}`.

### Data Flow

`PostLayout.astro` already receives `title` and `description` as props. The canonical URL can be constructed from `Astro.url` (same pattern as `Base.astro` line 21: `new URL(Astro.url.pathname, Astro.site ?? 'https://thbrdy.dev')`). Pass `title`, `description`, and `canonicalUrl` as data attributes on the share bar container; the inline script reads them.

## Technical Constraints

- **No React island.** This is a static Astro component with a small inline `<script>` for clipboard behavior. No scroll animation, no complex state — React is overkill.
- **No new dependencies.** No icon libraries. SVG icons inline in the Astro component.
- **Typography:** "SHARE" label (if used) in JetBrains Mono, 0.65rem, uppercase, letter-spacing 0.2em, `--accent` color — matching the existing `section-number` convention.
- **Icons:** 16×16 SVG, stroke-based (matching PullQuote's existing icons). `--text-muted` default, `--accent` on hover. Transition: `stroke 0.2s ease`.
- **Layout:** Flex row, centered, gap 12px between icons. Dot separators (`·`) between items at `--border` color matching PullQuote's separator convention.
- **Copy feedback:** Icon changes from link icon to checkmark for 2s. Use a `data-copied` attribute toggle and CSS to swap visibility of two sibling SVGs (no JS framework needed).
- **Reduced motion:** The hover transitions are short enough to not require a `prefers-reduced-motion` guard, but the copy feedback swap should be instant (no transition) under reduced motion.
- **Scoped styles:** All styles in the `<style>` block of `PostLayout.astro`, scoped with `.share-bar` prefix. No global style leaks.

## Implementation Detail

### PostLayout.astro Changes

**Frontmatter:** Add canonical URL construction:
```astro
const canonicalUrl = new URL(Astro.url.pathname, Astro.site ?? 'https://thbrdy.dev').href;
```

**Template:** Add the share bar markup in two positions.

Position 1 — after the tags block inside `<header class="post__header">`, right before `</header>`:
```html
<div class="share-bar share-bar--header" data-url={canonicalUrl} data-title={title} data-description={description}>
  <!-- share buttons -->
</div>
```

Position 2 — after `<div class="post__content"><slot /></div>`, before `</article>`:
```html
<div class="share-bar-divider">
  <hr />
</div>
<div class="share-bar share-bar--footer" data-url={canonicalUrl} data-title={title} data-description={description}>
  <!-- share buttons -->
</div>
```

### Share Bar Markup (used in both positions)

```html
<div class="share-bar" data-url={canonicalUrl} data-title={title} data-description={description}>
  <button class="share-btn" data-action="copy" title="Copy link" aria-label="Copy essay link">
    <svg class="share-icon share-icon--link" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
    <svg class="share-icon share-icon--check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </button>
  <span class="share-sep">&middot;</span>
  <a class="share-btn" data-action="twitter" title="Share on X" aria-label="Share on X" href="#" target="_blank" rel="noopener noreferrer">
    <svg class="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4l6.5 8L4 20h2.5l5-6.2L16.5 20H20l-6.5-8L20 4h-2.5l-5 6.2L7.5 4H4z" />
    </svg>
  </a>
  <span class="share-sep">&middot;</span>
  <a class="share-btn" data-action="linkedin" title="Share on LinkedIn" aria-label="Share on LinkedIn" href="#" target="_blank" rel="noopener noreferrer">
    <svg class="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  </a>
  <span class="share-sep">&middot;</span>
  <a class="share-btn" data-action="email" title="Share via email" aria-label="Share via email" href="#" target="_blank" rel="noopener noreferrer">
    <svg class="share-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  </a>
</div>
```

Note: Use an Astro partial or just duplicate the markup in both positions (it's small). If you prefer DRY, extract a `ShareBar.astro` component that accepts `url`, `title`, `description` props and import it twice. Either approach is fine.

### Inline Script

Add a single `<script>` at the bottom of the template (after the article, before `</Base>`... actually, PostLayout doesn't control scripts directly — add it inside the article element or use Astro's `<script>` which is module-scoped):

```html
<script>
  document.querySelectorAll('.share-bar').forEach(bar => {
    const url = bar.dataset.url;
    const title = bar.dataset.title;
    const description = bar.dataset.description;

    // Set href values for link-based share buttons
    bar.querySelectorAll('[data-action="twitter"]').forEach(btn => {
      btn.href = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: title, url }).toString()}`;
    });
    bar.querySelectorAll('[data-action="linkedin"]').forEach(btn => {
      btn.href = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url }).toString()}`;
    });
    bar.querySelectorAll('[data-action="email"]').forEach(btn => {
      btn.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`;
    });

    // Copy link handler
    bar.querySelectorAll('[data-action="copy"]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(url).then(() => {
          btn.classList.add('copied');
          btn.setAttribute('title', 'Copied!');
          btn.setAttribute('aria-label', 'Link copied');
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.setAttribute('title', 'Copy link');
            btn.setAttribute('aria-label', 'Copy essay link');
          }, 2000);
        });
      });
    });
  });
</script>
```

### Styles

Add to the existing `<style>` block in `PostLayout.astro`:

```css
/* Share bar */
.share-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.share-bar--header {
  margin-top: 1rem;
}

.share-bar--footer {
  margin-bottom: 1rem;
}

.share-bar-divider {
  margin-top: 3rem;
}

.share-bar-divider hr {
  border: none;
  border-top: 1px solid var(--border-mid);
  max-width: 100px;
  margin: 0 auto 1.5rem;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s ease;
  line-height: 0;
  text-decoration: none;
}

.share-btn:hover {
  color: var(--accent);
}

.share-sep {
  color: var(--border);
  font-size: 12px;
  line-height: 1;
  user-select: none;
}

/* Copy button icon swap */
.share-btn .share-icon--check {
  display: none;
}

.share-btn.copied .share-icon--link {
  display: none;
}

.share-btn.copied .share-icon--check {
  display: block;
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .share-btn {
    transition: none;
  }
}
```

## Files Modified

| File | Change |
|------|--------|
| `src/layouts/PostLayout.astro` | Add `canonicalUrl` to frontmatter. Add share bar markup in two positions (header + footer). Add inline `<script>` for clipboard + URL construction. Add styles. |

Optionally, if you choose the DRY approach:

| File | Change |
|------|--------|
| `src/components/ShareBar.astro` | New file. Accepts `url`, `title`, `description` props. Contains the share bar markup. |
| `src/layouts/PostLayout.astro` | Import `ShareBar.astro`, render it in two positions. Add the inline script and styles. |

## Verification Checklist

- [ ] Share bar appears in essay header area (below tags or meta line)
- [ ] Share bar appears at essay footer (after content, before article close)
- [ ] Copy link button copies the canonical URL and shows checkmark feedback for 2s
- [ ] X/Twitter link opens intent URL with essay title and URL in new tab
- [ ] LinkedIn link opens sharing URL in new tab
- [ ] Email link opens mailto with subject (title) and body (description + URL)
- [ ] Icons render in `--text-muted` color, switch to `--accent` on hover
- [ ] Dot separators visible between share buttons
- [ ] Footer share bar has a subtle horizontal rule divider above it
- [ ] `npm run build` passes with zero errors
- [ ] Mobile: share bar remains centered and usable at 375px viewport
- [ ] No new dependencies in `package.json`
- [ ] No React — this is pure Astro + inline JS
- [ ] Reduced motion: hover transitions disabled, copy swap is instant
- [ ] Works on all 7 published essay pages
