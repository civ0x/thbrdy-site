# Session: Section Deep Links + Essay Share Bar (Tiers 0 & 1)

## Situation

Essays on thbrdy.dev have no sharing affordances at the essay level. The only sharing lives inside `PullQuote` components (X/Twitter intent + copy link for individual quotes). OG meta tags are already wired in `Base.astro` and per-essay OG images exist at `/images/og/[slug].png`.

Two problems to solve in this session:

1. **No section deep links.** Essays are 10–20 minutes long with numbered section dividers, but there's no way to link someone to a specific section. Section dividers are React islands (`SectionDivider.tsx`) that render a number + label + rule, but have no `id` attribute and no anchor affordance.

2. **No essay-level share.** Readers can't easily share an essay URL. Need a lightweight share bar in two placements: header (near metadata) and footer (after content).

## Mission

### Part A: Section Deep Links

Add anchor link support to the `SectionDivider` component so each section becomes a deep-linkable target with a copy-to-clipboard affordance.

**Changes to `src/components/islands/shared/SectionDivider.tsx`:**

1. Derive an `id` from the `number` prop: `section-${number}` (e.g., `section-01`, `section-02`). Apply it to the root `<div>`.

2. Add a link icon button that appears on hover to the left of the section number. Clicking it copies the URL with fragment (`https://thbrdy.dev/writing/[current-slug]/#section-01`) to the clipboard. Show checkmark feedback for 2 seconds (same pattern as PullQuote).

3. The link icon should be invisible by default, appearing on hover of the entire section divider row. On touch devices (`@media (pointer: coarse)`), the icon should always be visible at reduced opacity — there's no hover on mobile.

**Implementation detail:**

```tsx
// New props — no breaking changes, number and label remain required
interface SectionDividerProps {
  number: string;
  label: string;
}
```

The `id` is derived, not passed as a prop — keeps the MDX call sites unchanged. No MDX files need editing.

The link icon should be a small SVG (12×12 or 14×14), stroke-based, using `tokens.textMuted` default and `tokens.accent` on hover/after copy. Use the same link chain icon from PullQuote:

```html
<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
```

For the copy action, use `navigator.clipboard.writeText()`. Construct the URL from `window.location.origin + window.location.pathname + '#section-' + number`.

State management: add `useState` for `copied` and `hovered` (the component already imports from React via `tokens.ts`... actually it doesn't import React hooks currently). Add `import { useState } from "react"` at the top.

Use injected `<style>` tag with scoped `.sd-anchor` class names for the hover reveal behavior — consistent with the island responsive pattern documented in CLAUDE.md.

**CSS for fixed nav offset:** Add to `src/styles/global.css` or `PostLayout.astro`:
```css
[id^="section-"] {
  scroll-margin-top: 80px;
}
```
This ensures the section heading clears the fixed nav when navigating via fragment.

### Part B: Essay Share Bar

Add a share bar to `PostLayout.astro` in two positions: header and footer. Four actions: copy link, X, LinkedIn, email.

**Changes to `src/layouts/PostLayout.astro`:**

**Frontmatter — add canonical URL:**
```astro
const canonicalUrl = new URL(Astro.url.pathname, Astro.site ?? 'https://thbrdy.dev').href;
```

**Template — two share bar placements:**

Position 1 — after the closing `</div>` of `post__tags` (or after `post__meta` if no tags), inside `<header class="post__header">`:
```html
<div class="share-bar" data-url={canonicalUrl} data-title={title} data-description={description}>
  <!-- buttons -->
</div>
```

Position 2 — after `<div class="post__content"><slot /></div>`, before `</article>`:
```html
<div class="share-bar-divider"><hr /></div>
<div class="share-bar" data-url={canonicalUrl} data-title={title} data-description={description}>
  <!-- buttons -->
</div>
```

**Share bar markup (identical in both positions):**

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

**Inline script (add once, after the article element):**

```html
<script>
  document.querySelectorAll('.share-bar').forEach(bar => {
    const url = bar.dataset.url;
    const title = bar.dataset.title;
    const description = bar.dataset.description;

    bar.querySelectorAll('[data-action="twitter"]').forEach(btn => {
      btn.href = `https://twitter.com/intent/tweet?${new URLSearchParams({ text: title, url })}`;
    });
    bar.querySelectorAll('[data-action="linkedin"]').forEach(btn => {
      btn.href = `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`;
    });
    bar.querySelectorAll('[data-action="email"]').forEach(btn => {
      btn.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`;
    });

    bar.querySelectorAll('[data-action="copy"]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(url).then(() => {
          btn.classList.add('copied');
          btn.title = 'Copied!';
          btn.setAttribute('aria-label', 'Link copied');
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.title = 'Copy link';
            btn.setAttribute('aria-label', 'Copy essay link');
          }, 2000);
        });
      });
    });
  });
</script>
```

**Styles (add to PostLayout.astro `<style>` block):**

```css
.share-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
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

## Technical Constraints

- **Part A is a React island change.** SectionDivider already hydrates via `client:visible` in MDX. Adding `useState` for copy feedback is the only new React hook. Keep the component small.
- **Part B is pure Astro + inline JS.** No React island for the share bar. No new dependencies.
- **No MDX changes.** SectionDivider call sites remain `<SectionDivider number="01" label="..." />`. The `id` is derived from `number`.
- **No icon libraries.** SVGs inline.
- **Respect `prefers-reduced-motion`.** Hover transitions disabled. Copy feedback swap is instant.

## Files Modified

| File | Change |
|------|--------|
| `src/components/islands/shared/SectionDivider.tsx` | Add `id` attribute, link icon with hover reveal, clipboard copy with checkmark feedback |
| `src/layouts/PostLayout.astro` | Add `canonicalUrl` to frontmatter. Add share bar markup (2 positions). Add inline script. Add styles. Add `scroll-margin-top` for section anchors. |

## Verification Checklist

- [ ] Navigate to `/writing/scholion/#section-03` → page scrolls to section 03, clearing the fixed nav
- [ ] Hover over any SectionDivider → link icon appears
- [ ] Click link icon → URL with fragment copied to clipboard, checkmark feedback for 2s
- [ ] On mobile viewport (375px): link icon visible at reduced opacity (no hover on touch)
- [ ] Share bar appears below tags in essay header
- [ ] Share bar appears after content with centered `<hr>` divider above it
- [ ] Copy link button copies canonical URL, shows checkmark for 2s
- [ ] X link opens Twitter intent with title + URL in new tab
- [ ] LinkedIn link opens sharing URL in new tab
- [ ] Email link opens mailto with subject + body
- [ ] Icons: `--text-muted` default, `--accent` on hover
- [ ] Dot separators visible between share buttons
- [ ] `npm run build` passes with zero errors
- [ ] No new dependencies in `package.json`
- [ ] All 7 published essays render correctly with both features
- [ ] Reduced motion: transitions disabled, copy swap instant
