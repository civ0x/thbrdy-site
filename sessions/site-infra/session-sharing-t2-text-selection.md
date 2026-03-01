# Session: Text-Selection Share Popover (Tier 2)

## Situation

After Tiers 0, 1, and 3, the essay sharing system has section deep links, an essay-level share bar (header + footer), related essay navigation, and PullQuote-level quote sharing. The remaining gap: readers who find a specific sentence or passage compelling have no fast way to share it. They must copy text manually, open a new tab, compose a message.

Medium popularized a text-selection share popover — highlight text, get a small floating menu with share actions. This is the reader-curated complement to the author-curated PullQuote. It matches how intellectual content actually gets transmitted: "look at this specific thing."

## Prerequisite

Tiers 0+1 must be complete (share bar patterns established). Tier 3 is recommended but not strictly required.

## Mission

Add a text-selection share popover that appears when a reader highlights text within essay content on desktop. The popover offers three actions: copy the selected text with a link, share to X with the quote, and share to LinkedIn.

### Scope

- **Desktop only.** Gate with `@media (pointer: fine)`. On touch devices, the native OS share sheet handles this better, and a custom popover conflicts with selection handles.
- **Essay content only.** The popover should only activate for selections within `.post__content`. Selecting text in the header, nav, footer, or other page chrome should not trigger it.
- **Vanilla JS, no React.** This is an inline script in `PostLayout.astro` with a hidden DOM element toggled via class. No hydration cost, no library dependency.

### Popover Design

A small floating pill that appears above (or below, if near viewport top) the text selection midpoint. Contains three icon buttons in a row with no labels — the icons should be self-explanatory at this point (users have seen them in the share bar).

```
┌───────────────────┐
│  📋  ·  𝕏  ·  in  │   (copy quote+link, X, LinkedIn)
└───────────────────┘
         ▼
   [selected text]
```

**Visual spec:**
- Background: `var(--bg-card)` (`#EFEBE4`)
- Border: `1px solid var(--border-mid)`
- Border-radius: `4px`
- Box shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Padding: `4px 8px`
- Icons: 14×14, stroke-based SVG, `currentColor`. Default `--text-muted`, hover `--accent`.
- Separator dots: same `.share-sep` pattern from the share bar
- Small downward-pointing triangle (CSS pseudo-element) connecting the popover to the selection. When flipped below, point upward.
- Z-index: high enough to sit above any island content (use `z-index: 100`).

### Interaction Flow

1. **User selects text** within `.post__content`.
2. On `mouseup`, check `window.getSelection()`. If the selection is:
   - At least 15 characters (avoids accidental triggers)
   - Entirely within `.post__content` (check `anchorNode` and `focusNode` containment)
   - Not empty or collapsed
   ...then show the popover.
3. **Position the popover** using `Range.getBoundingClientRect()`:
   - Default: centered horizontally on the selection, positioned above the top edge with 8px gap.
   - If the selection is near the top of the viewport (less than 60px clearance), flip the popover below the selection.
4. **User clicks an action:**
   - **Copy quote + link:** Copies `"{selectedText}" — {essayTitle}\n{canonicalUrl}` to clipboard. Swap icon to checkmark for 2s.
   - **Share on X:** Opens `https://twitter.com/intent/tweet?text="${truncatedText}"&url={canonicalUrl}`. Truncate selected text to fit within ~220 chars (leaving room for the URL).
   - **Share on LinkedIn:** Opens `https://www.linkedin.com/sharing/share-offsite/?url={canonicalUrl}`.
5. **Dismiss the popover** on:
   - Click anywhere outside the popover
   - New selection started
   - Scroll (debounced — dismiss after 100ms of scrolling)
   - Escape key

### Text Fragment URL (Progressive Enhancement)

When constructing the copy-link URL, append a Text Fragment directive for Chromium browsers:

```
{canonicalUrl}#:~:text={encodeURIComponent(selectedText.slice(0, 100))}
```

This means Chrome/Edge/Brave users who follow the link will see the quoted text highlighted on the page. Firefox/Safari users gracefully degrade to the page URL with no fragment highlighting. This is purely additive — no feature detection needed on the page side.

**Styling the highlight:** Add to `PostLayout.astro` or `global.css`:
```css
::target-text {
  background-color: var(--accent-dim);
  color: var(--text);
}
```

### Implementation

**DOM structure:** Add a hidden popover element to `PostLayout.astro`, after the article:

```html
<div id="selection-share" class="sel-share" aria-hidden="true">
  <button class="sel-share-btn" data-action="copy-quote" title="Copy quote with link" aria-label="Copy quote with link">
    <svg class="sel-share-icon sel-share-icon--copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
    <svg class="sel-share-icon sel-share-icon--check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </button>
  <span class="share-sep">&middot;</span>
  <button class="sel-share-btn" data-action="tweet-quote" title="Share on X" aria-label="Share quote on X">
    <svg class="sel-share-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 4l6.5 8L4 20h2.5l5-6.2L16.5 20H20l-6.5-8L20 4h-2.5l-5 6.2L7.5 4H4z" />
    </svg>
  </button>
  <span class="share-sep">&middot;</span>
  <button class="sel-share-btn" data-action="linkedin-quote" title="Share on LinkedIn" aria-label="Share quote on LinkedIn">
    <svg class="sel-share-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  </button>
  <div class="sel-share-arrow"></div>
</div>
```

**Inline script:** A single `<script>` block in PostLayout that handles all selection share logic. Key structure:

```javascript
// Only on desktop
if (window.matchMedia('(pointer: fine)').matches) {
  const popover = document.getElementById('selection-share');
  const contentArea = document.querySelector('.post__content');
  const canonicalUrl = document.querySelector('.share-bar')?.dataset.url || window.location.href;
  const essayTitle = document.querySelector('.share-bar')?.dataset.title || document.title;

  let hideTimeout;

  function showPopover(rect) {
    // Position logic: above selection by default, flip below if near top
    // Center horizontally on selection midpoint
    // Clamp to viewport edges
  }

  function hidePopover() {
    popover.classList.remove('visible');
    popover.setAttribute('aria-hidden', 'true');
  }

  function isWithinContent(node) {
    // Walk up from node to check if it's inside .post__content
    // Return false if it hits the popover itself (prevent self-triggering)
  }

  function getSelectedText() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim().length < 15) return null;
    if (!isWithinContent(sel.anchorNode) || !isWithinContent(sel.focusNode)) return null;
    return sel.toString().trim();
  }

  document.addEventListener('mouseup', (e) => {
    // Small delay to let selection finalize
    setTimeout(() => {
      const text = getSelectedText();
      if (!text) { hidePopover(); return; }
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      showPopover(rect);
    }, 10);
  });

  // Dismiss handlers
  document.addEventListener('mousedown', (e) => {
    if (!popover.contains(e.target)) hidePopover();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hidePopover();
  });
  window.addEventListener('scroll', () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hidePopover, 100);
  }, { passive: true });

  // Action handlers
  popover.addEventListener('click', (e) => {
    const btn = e.target.closest('.sel-share-btn');
    if (!btn) return;
    const text = getSelectedText();
    if (!text) return;
    const action = btn.dataset.action;

    if (action === 'copy-quote') {
      const fragment = `#:~:text=${encodeURIComponent(text.slice(0, 100))}`;
      const copyText = `"${text}"\n— ${essayTitle}\n${canonicalUrl}${fragment}`;
      navigator.clipboard.writeText(copyText).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      });
    } else if (action === 'tweet-quote') {
      const truncated = text.length > 220 ? text.slice(0, 217) + '...' : text;
      const tweetUrl = `https://twitter.com/intent/tweet?${new URLSearchParams({
        text: `"${truncated}"`,
        url: canonicalUrl,
      })}`;
      window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    } else if (action === 'linkedin-quote') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: canonicalUrl })}`,
        '_blank', 'noopener,noreferrer'
      );
    }
  });
}
```

**Styles:**

```css
.sel-share {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-mid);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  transform: translateX(-50%);
}

.sel-share.visible {
  opacity: 1;
  pointer-events: auto;
}

.sel-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s ease;
  line-height: 0;
}

.sel-share-btn:hover {
  color: var(--accent);
}

/* Copy feedback — same pattern as share bar */
.sel-share-btn .sel-share-icon--check {
  display: none;
}

.sel-share-btn.copied .sel-share-icon--copy {
  display: none;
}

.sel-share-btn.copied .sel-share-icon--check {
  display: block;
  color: var(--accent);
}

/* Arrow pointing down (default: popover above selection) */
.sel-share-arrow {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-mid);
  border-bottom: 1px solid var(--border-mid);
  transform: translateX(-50%) rotate(45deg);
}

/* When flipped below selection */
.sel-share.flipped .sel-share-arrow {
  bottom: auto;
  top: -5px;
  transform: translateX(-50%) rotate(-135deg);
}

/* Desktop only — entire feature hidden on touch */
@media (pointer: coarse) {
  .sel-share {
    display: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sel-share {
    transition: none;
  }

  .sel-share-btn {
    transition: none;
  }
}
```

## Technical Constraints

- **No library dependencies.** The Selection API and Range.getBoundingClientRect() are sufficient. No PopperJS, no floating-ui.
- **No React.** Pure vanilla JS in an inline `<script>`.
- **Desktop only.** `@media (pointer: coarse)` hides the element entirely. The JS also gates on `(pointer: fine)` media query so no event listeners are attached on mobile.
- **Minimum selection length: 15 characters.** Prevents accidental triggers from clicks or tiny selections.
- **Content-area only.** Selection must be within `.post__content`. Selecting nav, header metadata, or footer text does not trigger the popover.
- **Self-dismissing.** Popover hides on click-away, scroll, escape, or new mousedown.
- **Text Fragment URLs are progressive enhancement.** They work in Chromium browsers (~70% of traffic) and gracefully degrade in Firefox/Safari.
- **No interference with existing interactions.** The popover must not conflict with PullQuote interactions, annotation popovers, or diagram popovers. Check that `isWithinContent` excludes the popover itself and that clicking popover buttons doesn't dismiss it.

## Files Modified

| File | Change |
|------|--------|
| `src/layouts/PostLayout.astro` | Add hidden popover DOM element. Add inline `<script>` for selection handling. Add styles. Add `::target-text` style for Text Fragment highlighting. |

## Verification Checklist

- [ ] Select 15+ characters of essay text on desktop → popover appears above selection
- [ ] Select text near top of viewport → popover flips below selection
- [ ] Select less than 15 characters → no popover
- [ ] Select text in nav/header/footer → no popover
- [ ] Copy quote button: copies `"selected text"\n— Essay Title\nURL#:~:text=...` to clipboard, checkmark for 2s
- [ ] X button: opens Twitter intent with quoted text + URL in new tab
- [ ] LinkedIn button: opens sharing URL in new tab
- [ ] Click outside popover → dismisses
- [ ] Press Escape → dismisses
- [ ] Scroll → dismisses after brief delay
- [ ] Start new selection → old popover dismisses, new one appears
- [ ] Mobile viewport (375px, touch device): popover never appears, native selection works normally
- [ ] Popover doesn't conflict with annotation popovers or diagram popovers
- [ ] Text Fragment link: open a copied URL in Chrome → text is highlighted with `--accent-dim` background
- [ ] Same URL in Firefox → page loads normally, no error, no highlight (graceful degradation)
- [ ] `npm run build` passes with zero errors
- [ ] No new dependencies
- [ ] `prefers-reduced-motion`: opacity transition disabled
