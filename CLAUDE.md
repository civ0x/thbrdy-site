# thbrdy.dev — Agent Guidelines

## Cowork Mode Rule

**Do not edit source files directly.** In Cowork mode, plan changes and produce session prompts for execution in separate sessions. No direct modifications to any files under `src/`, `public/`, or content files. This applies to all code, content, config, and style files. The only files Cowork may create or edit are session prompt files (e.g., `session-*.md`) and documentation files (`STATUS.md`, `DECISIONS.md`, this file).

**Session prompt execution protocol.** Each session prompt is a self-contained mission file. When handing a prompt to an executing agent (e.g., Claude Code), the standard kickoff is:

> Read `CLAUDE.md`, `STATUS.md`, and `[session-prompt-filename].md`, then execute.

No additional context is needed — the prompt file contains the full situation, mission, technical constraints, and verification checklist. The executing agent reads the three files in that order and works autonomously.

## What This Is

Personal thinking space for Thomas Brady (techno-vajrapāṇi). Writing is the spine; projects are evidence of an intellectual framework centered on making invisible structures visible and navigable. This is not a portfolio or a blog — it's a research site where each page does cognitive work.

The entity behind this is Pando Industries.

## Stack

- **Framework:** Astro (static site generation, zero JS by default)
- **Hosting:** Cloudflare Pages, auto-deploys on push to `main`
- **Build:** `npm run build` → output in `dist/`
- **JS policy:** Vanilla JS by default. React islands permitted ONLY for interactive essay visualizations in `src/components/islands/*.tsx`, hydrated via Astro's `client:visible` or `client:load` directives. No React in layouts, navigation, or page chrome.
- **CSS:** Custom properties for theming. No Tailwind. No CSS frameworks. Scoped styles in `.astro` files, shared tokens in `src/styles/global.css`.
- **Dependencies:** No charting libraries. No external JS beyond Astro and React (for islands). Diagrams are built from HTML + CSS + IntersectionObserver.

## Directory Structure

```
src/
├── layouts/
│   └── Base.astro              # Shared shell: <head>, nav, footer, mandala canvas
├── components/
│   ├── Nav.astro               # Navigation
│   ├── Footer.astro            # Footer with mantra
│   ├── ProjectCard.astro       # Reusable project card
│   ├── PostPreview.astro       # Writing index list item
│   ├── MandalaCanvas.astro     # Animated background (vanilla JS, gold on warm white)
│   └── islands/                # React interactive components for essays
│       ├── shared/
│       │   ├── tokens.ts       # Design tokens (references CSS custom properties)
│       │   ├── useInView.ts    # Intersection observer hook (fire-once, reduced-motion aware)
│       │   ├── SectionDivider.tsx  # Reusable section divider
│       │   └── PullQuote.tsx       # Reusable pull quote with scroll animation
│       ├── AB*.tsx             # Absolute Beginners++ essay islands
│       ├── Notice*.tsx         # Notice essay islands
│       ├── LC*.tsx             # Learned Compilation essay islands
│       └── Scholion*.tsx       # Scholion essay islands
├── pages/
│   ├── index.astro             # Homepage
│   ├── now.astro               # Now page
│   ├── about.astro             # Resume/background
│   └── writing/
│       ├── index.astro         # Writing index
│       └── [...slug].astro     # Dynamic route for essays (/writing/[slug]/)
├── content/
│   ├── content.config.ts       # Content collection schema (Astro v5 location: src/content.config.ts)
│   └── writing/                # MDX essays with frontmatter
└── styles/
    └── global.css              # Design tokens + shared styles
public/
├── fonts/                      # CODEINK.woff2 (if retained for any use), AkzidenzGrotesk.woff2
└── favicon.svg
reference/                      # Old dark-mode index.html — visual reference, not deployed
```

## Design System

The site uses a single unified warm light palette. There is no dark mode.

### Palette

```css
--bg: #FAF6F0;                        /* Page background — warm off-white, NEVER pure white */
--bg-warm: #F4EFE7;                    /* Elevated surfaces, cards */
--bg-card: #EFEBE4;                    /* Card backgrounds */
--bg-dark: #1C1A17;                    /* Dark code blocks, system diagram interiors */
--bg-dark-mid: #2A2722;               /* Secondary dark surface */
--border: rgba(44, 36, 22, 0.1);      /* Subtle borders */
--border-mid: rgba(44, 36, 22, 0.18); /* Visible borders */
--text: #2C2416;                       /* Primary text */
--text-mid: #4A3D30;                   /* Secondary text */
--text-light: #6B5D4F;                 /* Tertiary text */
--text-muted: #9B8E80;                 /* Metadata, labels */
--text-faint: #C4B8AA;                 /* Decorative text (mantra, hints) */
--accent: #B8860B;                     /* Dark gold — section labels, highlights, interactive borders */
--accent-dim: rgba(184, 134, 11, 0.08); /* Accent background tint */
--accent-glow: rgba(184, 134, 11, 0.15); /* Accent hover/focus states */
```

Semantic colors for diagrams only (never in page chrome):
```css
--red: #A63D2F;    --red-dim: rgba(166, 61, 47, 0.08);
--green: #4A7A4A;  --green-dim: rgba(74, 122, 74, 0.08);
--blue: #2A5A8A;   --blue-dim: rgba(42, 90, 138, 0.08);
--teal: #2A7A6A;   --teal-dim: rgba(42, 122, 106, 0.08);
```

Each project page can have its own accent color while sharing the neutral palette. The accent appears in section labels, key highlights, and interactive element borders — never as large background fills.

### Typography

**Four font roles, strictly separated:**

| Role | Font | Usage |
|------|------|-------|
| Display | `Cinzel` 400, uppercase, letter-spacing: 0.12em | Hero name only. Inscriptional, lapidary. |
| Prose | `Cormorant Garamond` 400–700, mixed case | All body text, headings, pull quotes. The author's voice. |
| Structural | `DM Sans` 400–600 | Diagram labels, metadata grids, comparison tables, UI elements. |
| Code/Meta | `JetBrains Mono` 300–500 | Code blocks, eyebrow labels, section markers, navigation, footer. |

**Rules:**
- Cinzel is ONLY for the hero name. Do not use it for section headings or anywhere else.
- Cormorant Garamond is the default for all prose, headings (h1–h3 inside content), and pull quotes.
- DM Sans is for anything structural or data-oriented — diagram labels, comparison grids, card metadata.
- JetBrains Mono is for code, navigation links, eyebrow text, section numbers, and small metadata.
- Never use serif fonts for diagram labels or metadata. Never use mono/sans for body prose.

### Hero Section

```
[mantra — JetBrains Mono, 0.6rem, --text-faint, letter-spacing: 0.5em]
oṃ vajrapāṇi hūṃ phaṭ

[name — Cinzel 400, clamp(2.5rem, 8vw, 6.5rem), --text, uppercase, letter-spacing: 0.12em]
THOMAS BRADY
────── (gold gradient line, 100px)

[identity — JetBrains Mono, 0.65rem, --accent, letter-spacing: 0.25em, uppercase]
TECHNO-VAJRAPĀṆI

[thesis — Cormorant Garamond italic, 1.15rem, --text-light, max-width: 520px]
Making invisible structures visible and navigable...

[vajra icon — stroke: --accent, opacity: 0.4, subtle pulse animation]
```

### Mandala Canvas

The animated mandala background renders in warm gold tones (`rgba(184, 134, 11, ...)`) at very low opacity on the light background. It reads as parchment texture — present when noticed, invisible when reading. Same sacred geometry as the original, recolored from electric blue to gold. Vanilla JS, requestAnimationFrame.

### Animations

- Scroll-triggered via IntersectionObserver, fire once
- Pattern: opacity 0→1, translateY(12–20px → 0), staggered timing
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- All animations MUST respect `prefers-reduced-motion: reduce`

### Section Naming (About Page)

These are deliberate vocabulary choices, not generic labels:
- **Path** = experience/career
- **Instruments** = skills
- **Marks** = awards/certifications
- **Lineage** = education

Section dividers: section number (JetBrains Mono, small uppercase, --accent) + horizontal rule (--border-mid), displayed as a flex row.

## Island Architecture

React islands are used exclusively for interactive essay visualizations. They are hydrated inside MDX content via Astro's `client:visible` directive.

### Rules

- All island components are TypeScript (`.tsx` / `.ts`)
- Island components import shared utilities from `./shared/`
- MDX files import islands with relative paths: `import X from '../../components/islands/X.tsx'`
- Default hydration directive: `client:visible` (all current components are scroll-triggered)
- Only use `client:load` if a component must be interactive above the fold
- Islands receive data via props, not global state
- Design tokens defined once in `shared/tokens.ts`, referencing CSS custom properties from `global.css`
- `useInView` hook lives in `shared/useInView.ts` — handles IntersectionObserver + `prefers-reduced-motion`
- No animation libraries — all transitions use CSS `transition` property
- No icon libraries (lucide-react, etc.) — build icons from HTML/CSS/SVG inline

### Naming Convention

- **Essay-specific:** `[Prefix][ComponentName].tsx` — e.g., `ABConvergenceDiagram.tsx`, `NoticeCompetitiveGap.tsx`
- **Prefixes:** `AB` (Absolute Beginners++), `Notice`, `LC` (Learned Compilation), `Scholion`
- **Shared:** descriptive name — e.g., `SectionDivider.tsx`, `PullQuote.tsx`

### Shared Infrastructure (`islands/shared/`)

| File | Purpose |
|------|---------|
| `tokens.ts` | Design tokens as `var(--x)` strings — stays in sync with `global.css` |
| `useInView.ts` | `[ref, inView]` hook — fire-once IntersectionObserver, respects reduced motion |
| `SectionDivider.tsx` | Section number + label + horizontal rule |
| `PullQuote.tsx` | Centered italic quote with scroll-triggered fade-in |

### Responsive Pattern

Islands use **injected `<style>` tags** with scoped class names for responsive handling. Each component renders a `<style>` block inside its root element, targeting class names unique to that component (e.g., `.ab-convergence-grid`). Media queries live in CSS where they belong.

**Why not a `useMediaQuery` hook?**
- CSS media queries apply before React hydrates — no layout flash on first paint
- No JS execution needed for responsive behavior
- CSS transitions between breakpoints work naturally
- No shared utility to maintain

**Usage pattern:**
```tsx
export function MyDiagram() {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className="my-diagram">
      <style>{`
        .my-diagram-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 640px) {
          .my-diagram-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 420px) {
          .my-diagram-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="my-diagram-grid">...</div>
    </div>
  );
}
```

**Rules:**
- Class names must be component-scoped to avoid collisions (e.g., `ab-convergence-*`, `ab-wrongfirst-*`)
- Keep the `<style>` block as the first child of the component root
- Inline styles are still used for animation states (opacity, transform) that depend on `inView`
- Media query breakpoints: `640px` (tablet), `420px` (phone)

## Content

### Essays
- Location: `src/content/writing/*.mdx`
- URLs: `thbrdy.dev/writing/[slug]/`
- The `/writing` index lists all non-draft essays
- Frontmatter schema:
  ```yaml
  title: string (required)
  date: date (required)
  description: string (required)
  tags: string[] (optional)
  draft: boolean (optional, default false)
  order: number (optional)
  connected_project: string (optional — "Scholion", "Notice", etc.)
  ```
- Reading time is computed, not manually set
- Essays use MDX format to support embedded React interactive components

### Projects

Three active projects, all following the same thesis (surfacing hidden dependency structures):
1. **Scholion** — mapping epistemic dependencies in scientific reasoning
2. **Notice** — interoceptive awareness training (Apple Watch + iPhone)
3. **Pando** — coordination infrastructure under AI acceleration (research phase)

## Common Tasks

**Add a new essay:**
Create `.mdx` in `src/content/writing/` with the required frontmatter. It auto-appears on `/writing` index.

**Add a project card to homepage:**
Add entry to the projects data in `src/pages/index.astro`. Use the `ProjectCard.astro` component.

**Update experience/about:**
Edit `src/pages/about.astro`. Preserve section naming conventions (Path, Instruments, Marks, Lineage).

**Add a React interactive to an essay:**
Create `.tsx` in `src/components/islands/` using the `[Prefix][Name].tsx` convention. Import shared utilities from `./shared/`. In the MDX file, import with a relative path and use `client:visible`. Do NOT add React to any non-essay page.

## Verification Checklist

Run through this after any change:

- [ ] `npm run build` succeeds with zero errors
- [ ] All pages render with `--bg: #FAF6F0` background. No pure white (#FFFFFF) backgrounds anywhere.
- [ ] Hero name renders in Cinzel 400, uppercase, with wide tracking
- [ ] Body prose renders in Cormorant Garamond, never in sans or mono
- [ ] Mandala canvas renders in warm gold tones, not blue
- [ ] Nav links work and point to correct anchors/pages
- [ ] All scroll animations respect `prefers-reduced-motion`
- [ ] Essay appears in `/writing` index after adding to content collection
- [ ] Essay URL structure: `thbrdy.dev/writing/[slug]/`
- [ ] No new JS dependencies added (check `package.json` diff)
- [ ] Mobile: nav collapses, horizontal layouts stack, no horizontal scroll

## Common Mistakes — Do Not Repeat

- Do not use pure white (`#FFFFFF`) as a background anywhere. The background is `#FAF6F0`.
- Do not use dark/void backgrounds (`#07080D`) for any page. The site is light-mode only. Dark surfaces are used ONLY inside code blocks and system diagram interiors.
- Do not use electric blue (`#00C2FF`) anywhere. The accent color is dark gold (`#B8860B`).
- Do not use Cinzel for anything other than the hero name.
- Do not add framework dependencies (Vue, Svelte, etc.). React is the sole exception, scoped to essay interactive components.
- Do not add Tailwind, Bootstrap, or any CSS framework.
- Do not restructure the Scholion interactive pages during migration — preserve their existing HTML/JS verbatim until explicitly asked to refactor.
- Do not use serif fonts for labels, metadata, or diagram text. Those are mono (JetBrains Mono) or sans (DM Sans).
- Do not use sans/mono fonts for prose body text. Prose is always Cormorant Garamond.
- Essay URLs are nested under `/writing/`. If you generate a flat route like `/[slug]/`, it's wrong.
- Do not add analytics, tracking, or third-party scripts without explicit approval.
- Do not generate placeholder content ("Lorem ipsum", "Coming soon"). If content doesn't exist yet, leave the section out entirely.

## Corrections Log

<!-- Append rules here as mistakes are encountered. Format: date, what happened, the rule. -->

## Session Continuity

- **STATUS.md** tracks the migration roadmap and current phase. Update it as steps complete.
- When executing multi-step plans, check off completed steps in STATUS.md before moving to the next.
- If starting a new session mid-phase, read STATUS.md first to orient.
