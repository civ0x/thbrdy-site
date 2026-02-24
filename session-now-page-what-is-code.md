# Session Prompt: Update Now Page — "What Is Code?" Rebuild

## Situation

The `/now` page (`src/pages/now.astro`) currently has only the section divider header and no content. Thomas wants to add a first entry about his current project and establish a weekly-update convention with dated entries.

## Mission

1. Add a "last updated" line below the section header.
2. Add the first dated entry about the "What Is Code?" rebuild.
3. Style entries so future weekly additions follow the same pattern.

## Changes

### File: `src/pages/now.astro`

Replace the content inside `<section class="now">` with:

```html
<section class="now">
  <div class="section-divider">
    <span class="section-number">Now</span>
    <hr />
  </div>

  <p class="last-updated">Updated 24 February 2026</p>

  <article class="now-entry">
    <time class="entry-date" datetime="2026-02-24">Week of 24 Feb</time>
    <h2 class="entry-title">Rebuilding "What Is Code?"</h2>
    <p>
      I'm rebuilding Paul Ford's landmark 2015 Bloomberg essay
      <a href="https://www.bloomberg.com/graphics/2015-paul-ford-what-is-code/" target="_blank" rel="noopener">"What Is Code?"</a>
      — the 38,000-word interactive piece that mass-explained software to a business audience and remains one of the best things ever published on the web.
      Bloomberg open-sourced the original codebase (jQuery, D3&nbsp;v3, Backbone.js, Grunt),
      and I'm doing a faithful modernization using Astro islands, GSAP ScrollTrigger, D3&nbsp;v7, and Web Components
      — preserving the original's 18 interactive modules (circuit simulators, keyboard visualizers, DOM explorers, animated guide characters)
      while replacing every piece of 2015-era tooling with its contemporary equivalent.
    </p>
    <p>
      The interesting addition: an "explorable source layer" that makes the rebuild recursive.
      Readers can pop open any interactive, see the annotated source behind it, and tweak parameters in real-time
      — learning what code is by manipulating the code that renders the essay they're reading.
      It turns a faithful homage into a new pedagogical argument about code itself.
    </p>
    <p>
      It's a portfolio piece, a community tribute, and a reusable framework for interactive longform writing.
    </p>
  </article>
</section>
```

Replace the entire `<style>` block with:

```css
<style>
  .now {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    padding: 8rem 2rem 6rem;
  }

  .section-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .section-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    white-space: nowrap;
  }

  .section-divider hr {
    flex: 1;
    border: none;
    border-top: 1px solid var(--border-mid);
  }

  /* "Updated ..." line beneath the header */
  .last-updated {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 1.5rem 0 0;
  }

  /* Each dated entry */
  .now-entry {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
  }

  .now-entry:first-of-type {
    border-top: none;
    padding-top: 0;
  }

  .entry-date {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .entry-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--text);
    margin: 0 0 1.25rem;
    line-height: 1.3;
  }

  .now-entry p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    line-height: 1.75;
    color: var(--text-mid);
    margin: 0 0 1.25rem;
  }

  .now-entry p:last-child {
    margin-bottom: 0;
  }

  .now-entry a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px solid var(--accent-glow);
    transition: border-color 0.2s ease;
  }

  .now-entry a:hover {
    border-bottom-color: var(--accent);
  }
</style>
```

## Convention for Future Entries

When adding a new weekly entry, the pattern is:

1. Update the date in `.last-updated` to the current date.
2. Add a new `<article class="now-entry">` **above** the previous one (newest first).
3. Each entry gets a `<time class="entry-date">` with the week label and a `datetime` attribute, followed by a title and prose paragraphs.

Over time, older entries can be pruned or archived — but that's a future decision.

## Design Decisions

- **`<time>` element with `datetime` attribute** — semantic HTML, machine-readable dates, consistent with the "week of" label convention.
- **"Week of" format** — compact, avoids false precision (you're not posting daily), reads naturally. The `datetime` attribute carries the ISO date for machines.
- **"Updated" line in JetBrains Mono** — metadata/label convention per CLAUDE.md (mono for meta, serif for prose). Muted color keeps it subordinate.
- **Entry separator** — subtle `--border` line between entries; omitted on the first entry via `:first-of-type`. As entries stack, this keeps them visually distinct.
- **Newest-first ordering** — readers see what's current; scroll down for history.
- **Heading in Cormorant Garamond** — prose content, follows the serif rule.
- **Body text in `--text-mid`** — slightly softer than primary, appropriate for a journal-style page.
- **Link to Bloomberg essay** — inline in the first sentence, opens in new tab.

## Verification

- [ ] `npm run build` succeeds
- [ ] `/now` renders the "Updated" date in JetBrains Mono, muted color
- [ ] Entry date ("Week of 24 Feb") renders in JetBrains Mono, uppercase
- [ ] Entry title and prose render in Cormorant Garamond
- [ ] Background is `--bg` (#FAF6F0), not pure white
- [ ] Link to Bloomberg essay works and opens in new tab
- [ ] No new JS dependencies added
- [ ] Mobile: text wraps cleanly at narrow widths, no horizontal scroll
