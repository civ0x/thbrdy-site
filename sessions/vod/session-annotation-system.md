# Session: Annotation System — Valley of Death

## Situation

The Valley of Death essay uses domain-specific vocabulary, cites ~20 academic papers/books, and links to external resources. Reader feedback: terms need explaining, references need context. A companion YAML file (`src/content/writing/valley-of-death.annotations.yaml`) has been authored with all annotation content — term definitions, reference summaries, and link metadata. A visual prototype exists at `prototype-annotations.html` in the project root.

Decision 018 in DECISIONS.md documents the full design. Read it before starting.

## Mission

Build the annotation system and apply it to the Valley of Death essay. Three deliverables:

1. **`Annotation.tsx`** — React island component in `src/components/islands/shared/`
2. **`remark-annotations.mjs`** — Remark plugin that resolves annotation markers in MDX against the companion YAML
3. **Updated `valley-of-death.mdx`** — Essay with explicit annotation markers added at the correct locations

## Component: `Annotation.tsx`

Single component, three modes (`term`, `reference`, `link`). Located in `src/components/islands/shared/`.

### Props

```typescript
type AnnotationMode = 'term' | 'reference' | 'link';

interface TermContent {
  definition: string;
}

interface ReferenceContent {
  title: string;
  authors: string;
  year?: number | string;
  venue?: string;
  url?: string;
  summary: string;
  context?: string;
}

interface LinkContent {
  url: string;
  title: string;
  source: string;
  summary: string;
}

interface AnnotationProps {
  mode: AnnotationMode;
  term?: string;           // Display name for term mode
  content: TermContent | ReferenceContent | LinkContent;
  children: React.ReactNode;
}
```

### Behavior

- **Desktop:** hover trigger → show popover, mouse-leave → hide (with 120ms grace period for moving to popover)
- **Mobile (≤640px):** tap trigger → show bottom-sheet popover with backdrop. Tap backdrop or outside → dismiss. For link-mode annotations, first tap shows popover, second tap navigates.
- **Only one popover open at a time.** Opening a new one closes the previous.
- **Viewport-aware positioning:** prefer below, use above if insufficient space. Horizontal edge-clamping to prevent overflow.
- **Keyboard:** `tabindex="0"`, Enter/Space to toggle, Escape to dismiss.
- **Accessibility:** `role="tooltip"`, `aria-describedby` linking trigger to popover.
- **Reduced motion:** respect `prefers-reduced-motion` — skip transition animations.

### Visual Design

Reference `prototype-annotations.html` for exact styles. Key specs:

- **Trigger:** `border-bottom: 1.5px dashed var(--accent)`. Link-mode triggers use `var(--teal)` instead.
- **Popover card:** `background: var(--bg-warm)`, `border: 1px solid var(--border-mid)`, `border-radius: 6px`, soft shadow.
- **Popover inner:** `padding: 1.25rem 1.4rem`, `line-height: 1.4`. Mobile: `padding: 1.35rem 1.5rem`.
- **Typography:** All popover text in DM Sans. Mode badge + metadata in JetBrains Mono.
- **Mode badge:** tiny dot + label (Definition / Reference / External Link). Dot color: `--accent` for terms, `--text-muted` for references, `--teal` for links.
- **Reference card:** italic title, mono meta line (authors · venue · year), summary, "In this essay:" context note (italic, lighter, separated by border-top), "View paper →" link at bottom.
- **Link card:** mono URL, bold title, teal source line, summary, "Visit page →" CTA.
- **Mobile popover:** `position: fixed`, bottom-sheet style. No arrow. Semi-transparent backdrop.

### Implementation Pattern

Follow the existing island conventions:

- Injected `<style>` tag as first child with scoped class names (`annotation-*`)
- `useInView` is NOT needed — annotations don't scroll-trigger
- Inline styles for state-dependent properties (opacity on popover visibility)
- Media queries at 640px (mobile breakpoint)
- Use `<div>` not `<p>` for all popover text elements (avoids PostLayout specificity conflict per Decision 015)

## Remark Plugin: `remark-annotations.mjs`

Location: `src/plugins/remark-annotations.mjs` (create `plugins/` directory).

### What It Does

1. At build time, reads the companion YAML file for the current essay
2. Scans the MDX AST for explicit annotation markers
3. Replaces each marker with an `<Annotation>` component invocation, passing the content from YAML as props
4. Auto-adds the `Annotation` import to the MDX if annotations are present

### Marker Syntax

Use a double-bracket syntax that's unlikely to conflict with existing MDX content:

```
[[term:valley-of-death|valley-of-death phase]]
[[ref:branscomb-2003|Branscomb and Auerswald]]
[[link:neptune-ml|Neptune ML]]
```

Format: `[[mode:key|display text]]`

- `mode`: `term`, `ref`, or `link`
- `key`: matches the `key` field in the YAML
- `display text`: the visible text in the essay (what gets the dashed underline)

### YAML Resolution

The plugin resolves each key against the corresponding section of the YAML (`terms`, `references`, `links`). If a key isn't found, emit a build warning and render the display text without annotation.

### Astro Integration

Register the plugin in `astro.config.mjs`:

```javascript
import remarkAnnotations from './src/plugins/remark-annotations.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkAnnotations],
  },
});
```

The plugin needs to read YAML files, so it will need the `yaml` npm package (or `js-yaml`). This is a build-time devDependency only — no runtime impact.

## MDX Markers

Add annotation markers to `valley-of-death.mdx` at the following locations. Use the YAML `pattern` field to identify which text occurrence to mark. Annotate first substantive use only unless the pattern field specifies otherwise.

### Terms (17 annotations)

| Key | Pattern to Find in MDX | Section |
|-----|----------------------|---------|
| `valley-of-death` | "valley of death" | intro (para 2, in "valley of death is a legibility problem") |
| `trl` | "Technology Readiness Levels" | 01 (first para) |
| `stage-gate` | "Stage-gate processes" | 01 (third para) |
| `legibility` | "legibility" | 01 (Scott paragraph — the concept introduction, NOT earlier uses in intro) |
| `cadastral-survey` | "cadastral survey" | 01 (Scott paragraph) |
| `metis` | "mētis" | 01 (TRL-as-legibility paragraph) |
| `goldwater-nichols` | "Goldwater-Nichols Act" | 02 |
| `trading-zones` | "trading zones" | 04 (Galison paragraph) |
| `boundary-objects` | "boundary objects" | 04 (Star/Griesemer paragraph) |
| `prfaq` | "PR/FAQ" | 04 (first use in Section 04) |
| `coupling-device` | "coupling device" | 04 (where essay defines it) |
| `heilmeier-catechism` | "Heilmeier Catechism" | 04 |
| `patronage-model` | "patronage model" | 05 (first use) |
| `5r-framework` | "5R Framework" | 05 (AstraZeneca paragraph) |
| `pasteurs-quadrant` | "Pasteur's Quadrant" | 06 |
| `fraunhofer-model` | "Fraunhofer model" | 07 |
| `eroams-law` | "Eroom's Law" | sources |

### References (20 annotations)

| Key | Pattern to Find | Section |
|-----|----------------|---------|
| `branscomb-2003` | "Branscomb and Auerswald" | intro (para 1) |
| `ferguson-2014` | "Ferguson's 2014 analysis" | intro (para 2) |
| `beard-funding-paradox` | "Beard and colleagues" | intro (para 2) |
| `earto-analysis` | "EARTO" | intro (para 2) |
| `olechowski-2020` | "Olechowski and colleagues" | 01 |
| `cooper-stage-gate` | "Cooper designed them" | 01 |
| `strategos-analysis` | "Strategos analysis" | 01 |
| `scott-1998` | "Seeing Like a State" | 01 |
| `mlsys-2023` | "2023 MLSys paper" | 02 |
| `supply-chain-meta` | "meta-analysis" | 02 |
| `chatterjee-viability` | "Chatterjee and colleagues" | 02 |
| `galison-1997` | "Peter Galison" | 04 (first sentence of Galison paragraph) |
| `star-griesemer-1989` | "Star and Griesemer" | 04 |
| `takeuchi-nonaka-1986` | "Takeuchi and Nonaka" | sources |
| `gao-darpa` | "GAO study" | 04 |
| `morgan-astrazeneca` | "Morgan et al." | sources |
| `scannell-eroams` | "Scannell et al." | sources |
| `gertner-bell-labs` | "The Idea Factory" | sources |
| `watzinger-bell-breakup` | "Watzinger & Schnitzer" | sources |
| `uc-berkeley-pasteur-2024` | "UC Berkeley finding" | 06 |

### Links (1 annotation)

| Key | Pattern to Find | Section |
|-----|----------------|---------|
| `neptune-ml` | "Neptune ML" | 05 (first use: "Neptune ML illustrates") |

## Constraints

- No new runtime dependencies. `js-yaml` is a devDependency for the remark plugin only.
- No external tooltip/popover libraries.
- No animation libraries — CSS transitions only.
- Respect `prefers-reduced-motion`.
- Follow existing island conventions: injected `<style>`, scoped class names, TypeScript.
- The `Annotation` component hydrates via `client:visible`.
- Test mobile behavior at 640px and 420px breakpoints.
- The YAML file is the single source of truth for annotation content. The MDX only contains markers (`[[mode:key|text]]`), never the annotation content itself.

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] All three annotation modes render correctly on desktop (hover)
- [ ] All three annotation modes render correctly on mobile (tap, bottom-sheet)
- [ ] Only one popover open at a time
- [ ] Keyboard navigation works (Tab to focus, Enter/Space to toggle, Escape to dismiss)
- [ ] Popover doesn't overflow viewport on any screen width
- [ ] Link-mode annotations still function as navigable links
- [ ] Reference-mode "View paper →" links open in new tab
- [ ] Build warning emitted for any unresolved annotation key
- [ ] No new runtime dependencies added (check `package.json` diff)
- [ ] `prefers-reduced-motion` disables popover transitions
- [ ] Essay prose reads normally with markers present (markers don't affect rendered output beyond adding the annotation)
- [ ] YAML file loads correctly at build time for the valley-of-death essay
- [ ] Annotations in the Sources section render correctly (denser text context)
