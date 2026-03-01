# Sharing System Roadmap — thbrdy.dev

## Research Summary

### How people actually share long-form intellectual content

The key insight from looking at Substack, Aeon, Medium, Works in Progress, and technical documentation sites: **there is no single "share" moment.** There are at least three distinct impulses, each requiring different affordances:

1. **"I want to send this to someone"** — The essay-level share. Triggered on arrival (from the title/description) or at the end (having finished reading). This is the simplest case: share the URL.

2. **"This specific passage is what I want to share"** — The excerpt-level share. Triggered mid-read when a sentence crystallizes something. Medium's text-selection popover and Substack's highlight/restack serve this. Your PullQuote share infrastructure is the author-curated version.

3. **"Read this, start here"** — The section-level share. Triggered when someone wants to direct attention to a specific part of a long piece. GitHub's heading anchors, Stripe docs, Smashing Magazine's `#` links all serve this. Especially important for essays that are 15–20 minutes.

### What the best sites do

**Substack:** Modal with OG image preview card. Primary actions: Copy link, Facebook, Email, Notes. Overflow: Bluesky, X, LinkedIn, Reddit, Pinterest, Hacker News, Embed. Same engagement bar (like/comment/restack/share) appears top and bottom of article. Optimized for newsletter growth and platform engagement.

**Aeon (long-form essays):** Clean end-of-article only. Topic tags, date, then a 2×2 grid: Email, Save, X Post, Facebook Share, plus "Syndicate This Essay." No header share. No text selection share. No section anchors. Minimal and trusts the reader.

**Works in Progress:** No share buttons at all. Decorative divider, author bio, "Similar pieces." Relies on browser native sharing and header newsletter links. The most restrained approach.

**Medium:** Text-selection popover (highlight → share to Twitter). Section-level heading anchors not emphasized. End-of-article: clap/respond/share row. The selection popover is the distinctive feature.

**Smashing Magazine:** Heading anchor links (hover to reveal `#` link). No text-selection sharing. End-of-article: topic tags, related reading cards.

**GitHub/Stripe docs:** Heading anchor links are primary sharing mechanism. Hover on any heading → link icon appears → click to copy URL with fragment. This is the pattern technical readers are most familiar with.

### Key technical findings

**Text Fragment API** (`#:~:text=`): Supported in all Chromium browsers (Chrome, Edge, Arc, Opera, Brave). Not Firefox, not Safari. Allows linking to arbitrary text without any page-side implementation. The browser handles scroll-to and highlight. Style with `::target-text` pseudo-element. Zero JS required on the page. Limitation: ~70% of browsers support it. Could be used as a progressive enhancement — works for Chrome users, degrades gracefully to page-top for others.

**Selection API for text-selection popovers:** `window.getSelection()` + `Range.getBoundingClientRect()` for positioning. PopperJS (or manual calculation) for the popover. Desktop: works on `mouseup`. Mobile: should be disabled or use `pointer: coarse` media query to avoid conflicting with native text selection/sharing. The `highlight-share` library is <1.8KB gzipped and handles this cleanly. Key constraint: keep the popover out of the way of the browser's native context menu.

**Section anchor links:** Standard pattern: add `id` attributes to headings, show a link icon on hover. CSS `scroll-margin-top` needed to account for fixed nav. Your SectionDividers already have numbered sections — these could become anchor targets.

---

## Phased Implementation

### Tier 0: Section Deep Links (foundation)
**Effort:** Small — one session
**Dependencies:** None
**Value:** High — enables all subsequent sharing tiers to link to specific sections

Add `id` attributes to SectionDivider components so each numbered section becomes an anchor target. When a user hovers over a section divider, a subtle link icon appears. Clicking it copies the URL with fragment (e.g., `/writing/the-circuitry-of-science/#03`).

**Technical notes:**
- SectionDivider is a shared React island — already has `useInView`. Add a `sectionId` prop that renders as `id` on the container.
- Link icon appears on hover (CSS only, `:hover` on the divider row). Click handler copies `window.location.origin + window.location.pathname + '#' + sectionId` to clipboard.
- Add `scroll-margin-top: 80px` (or whatever clears the fixed nav) to section divider elements.
- MDX files don't need changes if the section number prop already exists — just derive the id from it.
- Alternatively, if you want to avoid React state for the copy feedback, this could be a small inline `<script>` in PostLayout that attaches click handlers to all `.section-divider` elements.

**Verification:** Navigate to `/writing/scholion/#03` → page scrolls to section 3, clears the nav.

### Tier 1: Essay-Level Share Bar
**Effort:** Small — one session
**Dependencies:** None (but Tier 0 makes it better)
**Value:** Medium — baseline sharing affordance

The session prompt already exists at `sessions/site-infra/session-essay-share-bar.md`. Two placements (header + footer), four actions (copy link, X, LinkedIn, email). Pure Astro component, no React.

**One refinement based on research:** The footer placement should be more intentional than a bare share bar. Drawing from Aeon and Works in Progress: position the share actions after a subtle divider, possibly alongside a pointer to a related essay (if `connected_project` links exist) or back to the `/writing` index. This makes the end-of-article feel like a designed moment rather than a toolbar bolted on.

### Tier 2: Text-Selection Share Popover (desktop only)
**Effort:** Medium — one session, but needs careful interaction design
**Dependencies:** Tier 1 (need the share URL construction pattern established)
**Value:** High for the right audience — this is how people share *insights* from long-form writing

When a reader selects text within `.post__content`, a small popover appears above the selection with: Copy quote, Share on X (with selected text as quote), Copy link with text fragment.

**Technical approach:**
- Vanilla JS, no library dependency (the core logic is small: listen for `mouseup`, check `window.getSelection()`, position a popover using `Range.getBoundingClientRect()`).
- **Desktop only.** Use `@media (pointer: fine)` to gate the behavior. On touch devices, the native share sheet is better and the popover conflicts with selection handles.
- Popover positioning: absolute, anchored above the selection midpoint. If near top of viewport, flip below.
- Text Fragment URL construction: `${canonicalUrl}#:~:text=${encodeURIComponent(selectedText.slice(0, 100))}`. This gives Chrome/Edge users a direct link to the highlighted text. Firefox/Safari users get the page URL (graceful degradation).
- Character limit: if selected text exceeds 280 chars for the X/Twitter intent, truncate with ellipsis.
- Dismiss on click-away or new selection.
- This lives as an inline `<script>` in PostLayout, not a React island. No hydration cost. The popover is a hidden DOM element toggled via class.

**Design considerations:**
- The popover should feel like part of the reading experience, not a social media toolbar. Small, muted, appears quickly and stays out of the way.
- Two or three actions max: Copy text + link, Share on X, maybe Share on LinkedIn. Fewer is better here — this isn't a share dialog, it's a quick action.
- Style: `--bg-card` background, subtle shadow, `--text-muted` icons → `--accent` on hover. JetBrains Mono for any label text.

**Risks:** Can feel intrusive if the popover appears too eagerly. Consider a minimum selection length (e.g., 15 characters) to avoid triggering on accidental selections. Also consider a small delay (200ms) before showing, so quick click-and-drag doesn't flash it.

### Tier 3: End-of-Article Experience
**Effort:** Medium — one session, mostly design work
**Dependencies:** Tier 1 (share bar), optionally Tier 0 (deep links for related essays)
**Value:** Medium-high — the completion moment is an opportunity

Currently essays end abruptly into the footer. This tier designs the post-content space as a deliberate moment. Drawing from Aeon (tags + share + syndication), Works in Progress (divider + bio + related pieces), and Substack (engagement bar + related posts):

**Components:**
1. **Divider** — Subtle centered rule (already in Tier 1 session prompt).
2. **Share bar** — From Tier 1, positioned here.
3. **Connected essays** — If the essay has a `connected_project`, show 1–2 other essays from the same project as small cards. If not, show 1–2 recent essays. This keeps readers in the site rather than bouncing to the footer.
4. **Back to writing index** — A simple "← All essays" link in JetBrains Mono.

This is primarily a PostLayout change with some data fetching (pass related essays from `[...slug].astro`).

**Not building:** Author bio (it's a single-author site — would feel performative). Newsletter signup (no newsletter). Comments (not part of the site's model).

---

## Sequencing

| Tier | Session | Dependencies | Priority |
|------|---------|-------------|----------|
| 0 — Section deep links | `session-section-deep-links.md` | None | Must Have |
| 1 — Essay share bar | `session-essay-share-bar.md` (exists) | None | Must Have |
| 2 — Text-selection popover | `session-text-selection-share.md` | Tier 1 pattern | Should Have |
| 3 — End-of-article experience | `session-end-of-article.md` | Tier 1, optionally Tier 0 | Should Have |

**Recommended execution order:** Tier 0 → Tier 1 → Tier 3 → Tier 2.

Rationale: Tier 0 (section deep links) is the highest-value, lowest-cost move — it makes every other tier more useful because shared URLs can point to specific sections. Tier 1 (share bar) is the baseline affordance. Tier 3 (end-of-article) should come before Tier 2 because it's a more visible improvement and doesn't require the careful interaction design work that the text-selection popover demands. Tier 2 is the most technically delicate and should be done last, with time to get the feel right.

Tiers 0 and 1 could be done in a single session if desired — they're independent and small.

---

## Open Questions

1. **Bluesky?** Your PullQuote currently only has X/Twitter. If you're active on Bluesky, it might belong in the share bar. Low cost to add.

2. **Text Fragment styling:** When someone follows a `#:~:text=` link, Chromium highlights the matched text in yellow by default. You could override this with `::target-text` to use your accent color. Worth doing if you implement Tier 2.

3. **Analytics:** Are you tracking share clicks? No analytics on the site currently per CLAUDE.md. If you add sharing, you might want lightweight event tracking to understand what people actually share. Not a blocker, but worth noting.

4. **RSS:** STATUS.md lists RSS as a Phase 5 todo. RSS is itself a sharing/distribution mechanism. If you build RSS before or alongside this sharing work, the end-of-article experience could include an RSS subscribe link.
