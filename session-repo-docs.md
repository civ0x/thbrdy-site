# Session Prompt: Public Repo Documentation

## Situation

The thbrdy-site repo is being made public on GitHub (github.com/civ0x/thbrdy-site). The current README.md is the stock Astro starter template — it needs to be replaced with documentation that represents what the project actually is. We also need a LICENSE file that splits code (MIT) from content (All Rights Reserved).

## Mission

Replace `README.md` with a proper public-facing project README, and create a `LICENSE` file at the repo root.

## README.md

Replace the entire contents of `README.md` with the following:

```markdown
# thbrdy.dev

Source for [thbrdy.dev](https://thbrdy.dev) — the personal site of Thomas Brady (Pando Industries).

A research site organized around one thesis: **making invisible structures visible and navigable**. Each essay pairs long-form writing with interactive diagrams that function as structural arguments, not illustrations. The writing is the spine; the code makes the ideas manipulable.

## Projects

- **[Scholion](https://thbrdy.dev/writing/scholion/)** — Mapping epistemic dependencies in scientific reasoning. Interactive argument visualization grounded in Toulmin argumentation and truth-maintenance systems.
- **[Notice](https://thbrdy.dev/writing/notice/)** — Interoceptive awareness training for Apple Watch + iPhone. Two-tier AI architecture: on-device models for real-time context, Claude API for longitudinal pattern analysis.
- **[Learned Compilation](https://thbrdy.dev/writing/learned-compilation/)** — Investigating whether a learned planner can close the 15–30% throughput gap left by sequential decision-making in production ML compilers.
- **[Absolute Beginners++](https://thbrdy.dev/writing/ab-essay/)** — A practical methodology for AI-assisted work. Beginners have the highest leverage — if given method.

## Architecture

Astro static site with zero JS by default. Interactive essay components use React islands hydrated via `client:visible` — they load only when scrolled into view and only inside essay pages. No React in layouts, navigation, or page chrome.

Essays are MDX files that import island components directly. Each island is a self-contained TypeScript/React component that handles its own responsive layout via injected `<style>` tags (CSS media queries, not JS). Scroll-triggered animations use IntersectionObserver with a fire-once pattern, all respecting `prefers-reduced-motion`.

No charting libraries, no animation libraries, no CSS frameworks. Diagrams are built from HTML, CSS, and vanilla JS.

### Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro](https://astro.build) (static generation) |
| Interactivity | React islands (essay visualizations only) |
| Styling | CSS custom properties, scoped styles |
| Fonts | Cinzel · Cormorant Garamond · DM Sans · JetBrains Mono |
| Hosting | Cloudflare Pages |
| OG Images | Generated via @resvg/resvg-js |

### Typography

Four font roles, strictly separated: Cinzel for the display name (inscriptional, hero only), Cormorant Garamond for all prose (the author's voice), DM Sans for structural elements (diagram labels, metadata), JetBrains Mono for code and navigation.

## Local Development

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # production build to dist/
npm run preview    # preview production build
```

## Working with AI

This repo includes `CLAUDE.md`, `STATUS.md`, and `DECISIONS.md` — artifacts of a design-first development methodology where durable project state lives in versioned documents rather than chat history. They're left in the repo intentionally as part of the workflow.

## License

Code is MIT licensed. Written content (essays, prose) is All Rights Reserved.
See [LICENSE](./LICENSE) for details.
```

## LICENSE

Create a new file `LICENSE` at the repo root with the following contents:

```
MIT License (Code)

Copyright (c) 2025–2026 Thomas Brady / Pando Industries

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

Content License (Written Works)

All written content in this repository — including but not limited to essays,
articles, and prose in src/content/ and src/pages/ — is
Copyright (c) 2025–2026 Thomas Brady. All Rights Reserved.

You may not reproduce, distribute, or create derivative works from the written
content without explicit written permission from the author.
```

## Verification

After creating both files:

- [ ] `README.md` no longer contains any Astro starter template content
- [ ] `LICENSE` file exists at repo root
- [ ] All project links in README point to correct `thbrdy.dev/writing/` URLs
- [ ] `npm run build` still succeeds (these are root-level docs, should be no impact)

## Notes

Do NOT modify any other files. This is a documentation-only change.
