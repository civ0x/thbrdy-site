# Session: Diagram OG Card Compositing

## Prerequisite

Session `session-diagram-screenshots.md` must be completed first. This session assumes diagram PNGs exist in `public/images/diagrams/`.

## Situation

We now have high-resolution PNG screenshots of each diagram island component. The site already generates OG images via `scripts/generate-og-images.js` using SVG templates rendered to PNG with `@resvg/resvg-js`. We want to create a new OG card variant — a **diagram card** — that composites a diagram screenshot into the existing card design system (warm background, project accent color, essay attribution, site URL).

These diagram cards will serve as shareable images for individual diagrams, following the same pattern as the existing per-quote OG cards.

## Mission

Extend `scripts/generate-og-images.js` to generate per-diagram OG cards by compositing diagram screenshots into a card template. Add `sharp` as a devDependency for image compositing (resvg can render SVG to PNG but can't composite raster images into SVG).

## Design

The diagram card layout (1200×630):

```
┌──────────────────────────────────────────────┐
│  [DIAGRAM · PROJECT]          (mono, accent) │
│  ─────────────────────────────────────────── │
│                                              │
│        ┌──────────────────────────┐          │
│        │                          │          │
│        │    diagram screenshot    │          │
│        │    (fit within box,      │          │
│        │     centered, padded)    │          │
│        │                          │          │
│        └──────────────────────────┘          │
│                                              │
│           Essay Title (mono, muted)          │
│              thbrdy.dev (faint)              │
└──────────────────────────────────────────────┘
```

- Background: `#FAF6F0` (same as all OG cards)
- Top: "DIAGRAM" label + project name in JetBrains Mono, colored with project accent
- Below label: thin rule (same as essay OG cards)
- Center: diagram screenshot, scaled to fit within ~1040×380 box, maintaining aspect ratio, centered horizontally
- Below diagram: essay title in JetBrains Mono, `TEXT_MUTED`
- Bottom: `thbrdy.dev` in JetBrains Mono, `TEXT_FAINT`
- Thin border: same as other cards

The diagram screenshot should have a subtle border or shadow to separate it from the card background, since some diagrams may have transparent or matching backgrounds.

## Technical Spec

### New dependency

```
npm install --save-dev sharp
```

### Approach: sharp compositing (not SVG)

The existing quote/essay cards use SVG → resvg → PNG. Diagram cards can't use that pipeline because the diagram is a raster image, not SVG. Instead:

1. Create the card background as a solid-color sharp image (1200×630, `#FAF6F0`)
2. Render the text elements (label, rule, title, URL) as an SVG overlay using resvg → PNG
3. Read the diagram screenshot PNG, resize to fit within the target box
4. Composite all layers using sharp's `.composite()` method

Alternatively, a simpler approach:

1. Create the SVG template with a placeholder rectangle where the diagram goes
2. Render that SVG to PNG with resvg
3. Use sharp to composite the diagram screenshot on top of the placeholder area

### Diagram-to-essay mapping

The script needs to know which diagram belongs to which essay (for the title and project accent). Define a mapping:

```js
const DIAGRAM_CARDS = [
  { image: 'notice-competitive-gap.png', essay: 'notice', label: 'Competitive Gap' },
  { image: 'notice-build-timeline.png', essay: 'notice', label: 'Build Timeline' },
  { image: 'notice-interaction-flow.png', essay: 'notice', label: 'Interaction Flow' },
  { image: 'notice-architecture-diagram.png', essay: 'notice', label: 'Architecture' },
  { image: 'notice-vision-texture-grid.png', essay: 'notice-vision', label: 'Texture Grid' },
  { image: 'notice-vision-lead-time.png', essay: 'notice-vision', label: 'Lead Time' },
  { image: 'notice-vision-scaffolding-decay.png', essay: 'notice-vision', label: 'Scaffolding Decay' },
  { image: 'notice-vision-expansion-rings.png', essay: 'notice-vision', label: 'Expansion Rings' },
  { image: 'notice-vision-timeline.png', essay: 'notice-vision', label: 'Vision Timeline' },
  { image: 'coreg-evidence-map.png', essay: 'coregulation', label: 'Evidence Map' },
];
```

Look up essay title and `connected_project` from the existing `getEssays()` data. Use `PROJECT_ACCENTS` for the accent color (these diagrams are all Notice/`connected_project: "Notice"` so they'll get teal).

### Output naming

`public/images/og/[essay-slug]-diagram-[label-kebab].png`

Examples:
- `notice-diagram-competitive-gap.png`
- `notice-vision-diagram-expansion-rings.png`

### Handling missing screenshots

If a diagram PNG doesn't exist in `public/images/diagrams/`, skip it with a console warning rather than failing. This keeps the script resilient if `npm run screenshots` hasn't been run or a specific diagram failed.

## Constraints

- Add `sharp` as a devDependency
- Extend `scripts/generate-og-images.js` (add a new section after the quote card generation loop)
- Do NOT modify the existing essay or quote card generation logic
- Output to the same `public/images/og/` directory as other OG images
- Skip gracefully if source diagram PNGs are missing
- The diagram screenshot should be visually distinct from the card background — add a 1px `rgba(44, 36, 22, 0.1)` border or a subtle drop shadow around the inset image

## Open Question

We may also want to wire these diagram cards into the site as shareable routes (like the existing `/writing/[slug]/quote/[n]/` pattern). That's a separate concern and a separate session — this session only generates the image files.

## Verification

- [ ] `npm install` adds `sharp` to devDependencies
- [ ] `node scripts/generate-og-images.js` still generates all existing essay and quote card images (no regressions)
- [ ] New diagram card PNGs generated in `public/images/og/`
- [ ] Diagram cards show: label, rule, centered diagram image, essay title, URL
- [ ] Diagram image is properly scaled (no stretching, no overflow)
- [ ] Cards use teal accent for Notice-connected essays
- [ ] Missing diagram PNGs produce a console warning, not a crash
- [ ] Visual check: diagram is clearly separated from card background (border or shadow)
