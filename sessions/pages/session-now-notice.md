# Session Prompt: Update /now Page — Notice

## Situation

The `/now` page (`src/pages/now.astro`) currently has two entries from the week of Feb 24: "Rebuilding What Is Code?" and "Two Courses, One Prototype." Both are stale. Replace the page content with a single current entry about Notice.

## Mission

Update `src/pages/now.astro` with a new dated entry about Notice. Preserve all existing styles and structural markup exactly. Only change the content inside `<section class="now">`.

## Changes

### 1. Update the metadata

- Change `last-updated` to `2026-02-26T12:00:00Z`
- Change `<time>` element to `datetime="2026-02-26"` with text `Week of 26 Feb`

### 2. Replace both `<article class="now-entry">` blocks with a single new entry

Title: **Notice**

Content (adapt into `<p>` tags matching the existing prose style — Cormorant Garamond, `--text-mid`, same margins):

**Paragraph 1:**
I built a biofeedback app for Apple Watch + iPhone that helps you notice internal state shifts. You tap when something shifts, the app captures your heart rate and HRV, you label what you're feeling using a felt-sense taxonomy grounded in affect labeling research, and Claude generates contemplative reflections on your patterns over time. It's in TestFlight now with a growing beta group from the <a href="https://www.jhourney.io/" target="_blank" rel="noopener">Jhourney</a> contemplative community.

**Paragraph 2:**
The next frontier: replacing the cloud AI with a fine-tuned model running entirely on-device using Apple's MLX framework and mlx-swift. Train a small open-weights model (Llama 3.2 3B, LoRA fine-tuned) on high-quality contemplative reflections, quantize it, and run inference on the iPhone GPU — no server, no API calls, nothing leaves your phone.

**Paragraph 3:**
The real unlock beyond privacy is on-device LoRA adaptation: a model that learns your phenomenological vocabulary, your somatic patterns, your relationship to experience over time. Not a generic wellness chatbot — a contemplative mirror that gets more precise the longer you practice with it.

**Paragraph 4:**
Still working through where the quality boundary falls between what a 3B model can do (moment-level reflections) and what still needs a larger model (weekly pattern synthesis across dozens of sessions). Likely a hybrid for now, fully on-device as the long-term goal.

### 3. Link to essay

The first mention of "Notice" in the entry title should link to the essay: `<a href="/writing/notice/">Notice</a>`. Apply the same link styling as existing entries (accent color, bottom border).

### 4. Update `<Base>` props for OG metadata

The `<Base>` component accepts `title`, `description`, `image`, and `type` props that populate `<meta>` OG/Twitter tags. Currently the now page only passes `title` and `description`, so it falls back to the default OG image (`/images/og/og-default.png`). That default is fine — no per-page OG image needed for now. But update the props:

```
title="Now — Thomas Brady"
description="Building Notice — a contemplative biofeedback app for Apple Watch + iPhone with on-device AI. In TestFlight now."
```

Keep `image` and `type` unset (defaults are correct).

## Technical Constraints

- Do NOT change any `<style>` block content
- Preserve the section-divider, last-updated, and entry-date structure exactly
- All links use `target="_blank" rel="noopener"` for external URLs, no target for internal
- Font roles per CLAUDE.md: prose in Cormorant Garamond, metadata in JetBrains Mono

## Verification

- [ ] `npm run build` succeeds with zero errors
- [ ] `/now` page renders with warm off-white background (`#FAF6F0`)
- [ ] Entry title renders in Cormorant Garamond 600
- [ ] Metadata (date, "Updated" line) renders in JetBrains Mono
- [ ] Jhourney link opens in new tab
- [ ] Internal `/writing/notice/` link works (no new tab)
- [ ] No horizontal scroll on mobile
- [ ] Old entries ("What Is Code?", "Two Courses") are gone
- [ ] View page source: `og:description` contains "Notice" and "contemplative biofeedback"
- [ ] `og:image` falls back to default (`/images/og/og-default.png`) — no broken image URL
