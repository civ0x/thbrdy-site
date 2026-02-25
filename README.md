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
