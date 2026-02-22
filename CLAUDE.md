# thbrdy.dev — Agent Guidelines

## What this is
Personal thinking space for Thomas Brady (techno-vajrapāṇi). Writing-first, projects as evidence. The site makes invisible structures visible and navigable — that thesis governs what gets published and how it's presented.

## Stack
- Astro static site generator
- Cloudflare Pages deployment (auto-deploys on push to `main`)
- Build command: `npm run build`, output directory: `dist/`
- React integration (`@astrojs/react`) for interactive essay components only

## Design System

### Colors
```
--bg-void: #07080D
--electric-blue: #00C2FF     (accent — section labels, key highlights, interactive borders)
--gold: #FFFFFF               (primary text — yes, white is "gold" in this system)
--deep-red: #8B1A1A
--accent-dim: rgba(0,194,255,0.06)  (accent background tint)
```
Dark backgrounds only. No light mode. No white backgrounds anywhere.

### Fonts
- **CODEINK** — Display only. Used for the site name "Thomas Brady" and nothing else.
- **Cinzel** — Serif headings. The editorial, contemplative voice.
- **JetBrains Mono** — Code blocks, metadata labels, section numbers, navigation. The structural voice.
- **AkzidenzGrotesk** — Body text. Swiss modernist undertone.

The split between serif (prose/headings) and mono (labels/metadata) is the core typographic identity. Don't mix them.

### Aesthetic
Tibetan/cyberpunk. Dense, navigable, warm, weighty. Restraint over ornament. Presentation should be isomorphic to content — form does cognitive work. Think Meiji Jingu meets terminal.

### Section naming (on /about)
- **Path** — experience
- **Instruments** — skills
- **Marks** — awards
- **Lineage** — education

## Content

### Posts
- Location: `src/content/posts/` as `.md` with validated frontmatter
- Frontmatter schema: title (string), date (date), description (string), tags (string[], optional), connected_project (string, optional)
- Flat URLs: `thbrdy.dev/[slug]/` — NOT `thbrdy.dev/writing/[slug]/`
- The `/writing` index page lists all posts, but individual posts live at the root path

### Projects
- Location: `src/pages/projects/[name]/`
- Each project can have its own accent color while sharing the neutral palette

## Conventions

### JavaScript
- Vanilla JS by default for all site chrome, navigation, scroll animations, canvas effects
- React permitted ONLY for interactive essay visualizations in `src/components/*.jsx`
- React components hydrate via Astro islands (`client:visible` or `client:load`)
- No other JS frameworks. No jQuery. No charting libraries.

### CSS
- CSS custom properties for theming. No Tailwind. No CSS-in-JS.
- Scoped styles in `.astro` components where possible; shared styles in `src/styles/global.css`
- All scroll animations use IntersectionObserver, fire once, respect `prefers-reduced-motion`

### HTML
- Semantic HTML. Accessible. Proper heading hierarchy.
- Section dividers: section number (small uppercase mono) + horizontal rule, displayed as flex row

## Common Tasks
- **"Add a new post"**: Create `.md` in `src/content/posts/` with frontmatter matching the schema. It auto-appears on `/writing` and the homepage.
- **"Update the Now page"**: Edit `src/pages/now.astro`
- **"Add a project card to homepage"**: Add entry to the projects data in `src/pages/index.astro`
- **"Update experience/resume"**: Edit `src/pages/about.astro`

## Verification
- Every page must render with `--bg-void` (#07080D) background. No white flashes on load.
- CODEINK must render for the site name. If the font fails to load, the page is broken.
- All scroll animations must respect `prefers-reduced-motion`.
- Post URLs must be flat (root path, not nested under /writing/).
- Run `npm run build` and confirm zero errors before committing.

## Do Not
- Use white (#FFFFFF) as a background color anywhere
- Add framework dependencies (Vue, Svelte, etc.) to any Astro page
- Use React outside of `src/components/` essay visualizations
- Restructure or rewrite existing Scholion interactive pages — preserve their HTML/JS exactly
- Add Tailwind, Bootstrap, or any CSS framework
- Use the serif font (Cinzel) for metadata/labels, or the mono font (JetBrains) for prose
- Create nested post URLs

## Corrections
<!-- Add rules here when Claude Code does something wrong. Format: -->
<!-- - YYYY-MM-DD: [what went wrong] → [the rule to prevent it] -->
