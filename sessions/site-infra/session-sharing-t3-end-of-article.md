# Session: End-of-Article Experience (Tier 3)

## Situation

After the Tier 0+1 session, essays have section deep links and a basic share bar at header and footer. But the end-of-article experience is still abrupt — content ends, share bar appears, then the global footer. There's no designed transition between "I just finished reading" and "what next?"

Good long-form publications (Aeon, Works in Progress, Smashing Magazine) treat this as a deliberate moment: a closing gesture, contextual navigation to related work, and share actions woven into a cohesive block rather than a disconnected toolbar.

## Prerequisite

Tier 0+1 must be complete. This session assumes:
- The share bar markup, styles, and inline script already exist in `PostLayout.astro` (added by T1)
- The header share bar placement remains unchanged — this session only modifies the footer placement
- Section deep links are functional in `SectionDivider.tsx`
- `canonicalUrl`, `title`, and `description` are already available in PostLayout's frontmatter (added by T1)

## Mission

**Remove** the bare footer share bar that Tier 1 placed after `.post__content` (the `<div class="share-bar-divider">` + `<div class="share-bar">` block) and **replace it** with a richer end-of-article block that wraps the same share actions in a semantic `<footer>` alongside related essay navigation and a back-link to the writing index. The header share bar from T1 is left untouched.

### End-of-Article Block Structure

After `<div class="post__content"><slot /></div>`, before `</article>`:

```
┌─────────────────────────────────────┐
│         ─── (centered hr) ───       │  ← divider (already exists from T1)
│                                     │
│     · copy · X · LinkedIn · email · │  ← share bar (already exists from T1)
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │  ← related essays (NEW)
│  │ Essay Title  │ │ Essay Title  │   │
│  │ description  │ │ description  │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│          ← All essays               │  ← back link (NEW)
└─────────────────────────────────────┘
```

### Data Flow

`[...slug].astro` needs to pass related essays to `PostLayout.astro`.

**Strategy for selecting related essays:** Use `connected_project` as the primary signal. If the current essay has a `connected_project`, show up to 2 other essays from the same project (excluding the current one), sorted by date descending. If none match or the essay has no `connected_project`, show the 2 most recent essays (excluding the current one).

**Changes to `src/pages/writing/[...slug].astro`:**

```astro
// After existing code
const allPosts = await getCollection('writing', ({ data }) => !data.draft);
const currentSlug = post.id;

// Related essays: same project first, then recent
let related = [];
if (post.data.connected_project) {
  related = allPosts
    .filter(p => p.id !== currentSlug && p.data.connected_project === post.data.connected_project)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 2);
}
if (related.length < 2) {
  const recent = allPosts
    .filter(p => p.id !== currentSlug && !related.some(r => r.id === p.id))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 2 - related.length);
  related = [...related, ...recent];
}
```

Pass `related` to PostLayout via a new prop:

```astro
<PostLayout
  ...existing props
  relatedEssays={related.map(p => ({
    title: p.data.title,
    description: p.data.description,
    href: `/writing/${p.id}/`,
    date: p.data.date,
  }))}
>
```

**Changes to `PostLayout.astro` Props interface:**

```typescript
interface RelatedEssay {
  title: string;
  description: string;
  href: string;
  date: Date;
}

interface Props {
  // ...existing props
  relatedEssays?: RelatedEssay[];
}
```

### Template Changes

Replace the bare footer share bar with the full end-of-article block. The footer share bar from Tier 1 gets absorbed into this block (same markup, new context).

```html
<footer class="post__footer">
  <div class="share-bar-divider"><hr /></div>

  <div class="share-bar" data-url={canonicalUrl} data-title={title} data-description={description}>
    <!-- same share buttons as Tier 1 -->
  </div>

  {relatedEssays && relatedEssays.length > 0 && (
    <div class="post__related">
      <span class="post__related-label">Continue reading</span>
      <div class="post__related-grid">
        {relatedEssays.map(essay => (
          <a href={essay.href} class="post__related-card">
            <h3 class="post__related-title">{essay.title}</h3>
            <p class="post__related-desc">{essay.description}</p>
          </a>
        ))}
      </div>
    </div>
  )}

  <a href="/writing/" class="post__back">← All essays</a>
</footer>
```

Note: this `<footer>` is a semantic element within the `<article>`, not the site-wide footer. It sits before `</article>`.

### Styles

```css
.post__footer {
  margin-top: 3rem;
  padding-top: 0;
}

.post__related {
  margin-top: 2.5rem;
}

.post__related-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: block;
  margin-bottom: 1rem;
}

.post__related-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.post__related-card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.post__related-card:hover {
  border-color: var(--accent);
  background: var(--accent-dim);
}

.post__related-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text);
  margin: 0 0 0.4rem;
  line-height: 1.3;
}

.post__related-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post__back {
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post__back:hover {
  color: var(--accent);
}

@media (max-width: 640px) {
  .post__related-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .post__related-card,
  .post__back {
    transition: none;
  }
}
```

## Technical Constraints

- **No React.** This is all Astro template + scoped CSS.
- **No new dependencies.**
- **Related essay data fetched at build time** — Astro static generation, no client-side fetch.
- **Graceful degradation:** If an essay has no related essays (shouldn't happen with 7+ published essays, but handle it), the related section simply doesn't render. The share bar and back link still appear.
- **Typography rules:** "Continue reading" label in JetBrains Mono (structural metadata). Essay titles in Cormorant Garamond (prose voice). Back link in JetBrains Mono.

## Files Modified

| File | Change |
|------|--------|
| `src/pages/writing/[...slug].astro` | Compute related essays, pass as prop to PostLayout |
| `src/layouts/PostLayout.astro` | Add `relatedEssays` to Props interface. **Remove** T1's bare footer share bar (the `share-bar-divider` + `share-bar` block after `.post__content`). **Add** `<footer class="post__footer">` element in its place containing: share bar (same markup, now wrapped), related essay cards, back link. Add new styles. T1's header share bar, inline script, and existing share-bar styles remain unchanged. |

## Verification Checklist

- [ ] End-of-article block renders on all 7 published essays
- [ ] Scholion essay shows related Circuitry of Science essay (same `connected_project`)
- [ ] Essay with no `connected_project` shows 2 most recent essays
- [ ] Current essay never appears in its own related section
- [ ] Related cards show title + truncated description (2 lines max)
- [ ] Related card hover: border goes `--accent`, background goes `--accent-dim`
- [ ] "Continue reading" label in JetBrains Mono, uppercase
- [ ] "← All essays" links to `/writing/` and is centered
- [ ] Mobile (375px): related cards stack to single column
- [ ] Share bar still functional (copy, X, LinkedIn, email all work)
- [ ] `npm run build` passes with zero errors
- [ ] No new dependencies
