# Session: Diagram Screenshot Script

## Situation

The site's React island components render interactive diagrams inside essays. These diagrams are HTML+CSS+SVG laid out with CSS grid, flexbox, absolute positioning, and scroll-triggered animations via `useInView`. We want to capture each diagram as a static PNG for use as OG card images (a separate session will handle compositing into the OG card template).

There is no browser automation dependency in the project currently. We want a standalone script using `puppeteer-core` (no bundled Chromium — uses the local system Chrome) that is run manually, not as part of the build.

## Mission

Create `scripts/screenshot-diagrams.js` — a standalone Node script that:

1. Starts the Astro dev server
2. Launches headless Chrome via `puppeteer-core`
3. Navigates to each essay page containing diagrams
4. Screenshots each diagram by its root CSS selector
5. Saves PNGs to `public/images/diagrams/`
6. Shuts down the browser and dev server

## Diagram Inventory

### `/writing/notice/` (notice.mdx)

| Component | Root selector | Notes |
|-----------|--------------|-------|
| NoticeCompetitiveGap | `.notice-gap` | Venn diagram + capability grid |
| NoticeBuildTimeline | `.notice-timeline` | Vertical timeline |
| NoticeInteractionFlow | `.notice-flow` | Flow diagram |
| NoticeArchitectureDiagram | `.notice-arch` | System architecture |

### `/writing/notice-vision/` (notice-vision.mdx)

| Component | Root selector | Notes |
|-----------|--------------|-------|
| NoticeCompetitiveGap | `.notice-gap` | Same component, reused |
| NoticeArchitectureDiagram | `.notice-arch` | Same component, reused |
| NoticeInteractionFlow | `.notice-flow` | Same component, reused |
| NoticeVisionTextureGrid | `.nvtg-root` | Card grid |
| NoticeVisionLeadTime | `.nvlt-root` | Chart/diagram |
| NoticeVisionScaffoldingDecay | `.nvsd-root` | Decay visualization |
| NoticeVisionExpansionRings | `.nver-root` | Concentric rings, has hover state |
| NoticeVisionTimeline | `.nvtl-root` | Timeline |

### `/writing/coregulation/` (coregulation.mdx)

| Component | Root selector | Notes |
|-----------|--------------|-------|
| CoRegEvidenceMap | (check component file for root class) | Evidence map |

### Deduplication

Some components appear on multiple pages (NoticeCompetitiveGap, NoticeArchitectureDiagram, NoticeInteractionFlow are on both `/writing/notice/` and `/writing/notice-vision/`). Screenshot each **unique component** once. Use the component name (kebab-cased) as the filename, not the page path.

Output filenames: `public/images/diagrams/notice-competitive-gap.png`, `notice-build-timeline.png`, etc.

## Technical Spec

### Dependencies

Add `puppeteer-core` as a devDependency:
```
npm install --save-dev puppeteer-core
```

This is ~2MB (no Chromium bundled). It uses the system Chrome installation.

### Finding system Chrome

The script needs to locate the local Chrome binary. Common paths:
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome` or `/usr/bin/chromium-browser`

Use a simple lookup with fallback, or accept a `CHROME_PATH` environment variable.

### Handling scroll-triggered animations

All diagram components use the `useInView` hook, which checks `prefers-reduced-motion: reduce` and immediately sets `inView=true` if that media feature matches. This means the diagrams will render in their **final animated state** without needing to scroll.

**Set this preference when launching the browser:**
```js
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
});
const page = await browser.newPage();
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'reduce' }
]);
```

This is the cleanest approach — no scrolling, no waitForSelector hacks. Every `useInView` fires immediately on mount.

### Viewport

Set viewport to `1200px` wide (the site's desktop breakpoint). Height doesn't matter for element screenshots — Puppeteer captures the full element bounding box regardless of viewport height.

```js
await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
```

Use `deviceScaleFactor: 2` for retina-quality screenshots. The OG compositing step (separate session) will handle downscaling.

### Element screenshot

```js
const element = await page.waitForSelector('.notice-gap', { timeout: 10000 });
await element.screenshot({ path: 'public/images/diagrams/notice-competitive-gap.png' });
```

### Dev server lifecycle

Start Astro dev server as a child process, wait for it to be ready, then run screenshots:

```js
import { spawn } from 'child_process';

const server = spawn('npx', ['astro', 'dev', '--port', '4399'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

// Wait for "Local" URL line in stdout
await new Promise((resolve) => {
  server.stdout.on('data', (data) => {
    if (data.toString().includes('Local')) resolve();
  });
});

// ... run screenshots ...

server.kill();
```

Use a non-default port (e.g., 4399) to avoid conflicts with a running dev server.

### Script structure

```js
const DIAGRAMS = [
  { page: '/writing/notice/', selector: '.notice-gap', name: 'notice-competitive-gap' },
  { page: '/writing/notice/', selector: '.notice-timeline', name: 'notice-build-timeline' },
  { page: '/writing/notice/', selector: '.notice-flow', name: 'notice-interaction-flow' },
  { page: '/writing/notice/', selector: '.notice-arch', name: 'notice-architecture-diagram' },
  { page: '/writing/notice-vision/', selector: '.nvtg-root', name: 'notice-vision-texture-grid' },
  { page: '/writing/notice-vision/', selector: '.nvlt-root', name: 'notice-vision-lead-time' },
  { page: '/writing/notice-vision/', selector: '.nvsd-root', name: 'notice-vision-scaffolding-decay' },
  { page: '/writing/notice-vision/', selector: '.nver-root', name: 'notice-vision-expansion-rings' },
  { page: '/writing/notice-vision/', selector: '.nvtl-root', name: 'notice-vision-timeline' },
  { page: '/writing/coregulation/', selector: null, name: 'coreg-evidence-map' },
  // ^ selector TBD — check CoRegEvidenceMap.tsx for root className
];
```

Group by page to minimize navigation. Navigate once per unique page URL, then screenshot all selectors on that page before moving to the next.

### npm script

Add to `package.json`:
```json
"scripts": {
  "screenshots": "node scripts/screenshot-diagrams.js"
}
```

## Constraints

- Use `puppeteer-core` only (no bundled Chromium)
- The script is standalone — NOT part of `npm run build` or `prebuild`
- Output directory: `public/images/diagrams/` (create if missing)
- Image format: PNG, 2x resolution
- Do NOT modify any component files, essay content, or existing build scripts
- Check `CoRegEvidenceMap.tsx` for its root className before building the DIAGRAMS array — I wasn't able to confirm the selector

## Verification

- [ ] `npm install` adds only `puppeteer-core` to devDependencies
- [ ] `npm run screenshots` starts dev server, captures all diagrams, shuts down cleanly
- [ ] All PNGs generated in `public/images/diagrams/`
- [ ] Each diagram PNG shows the component in its final (animated-in) state, not the pre-animation state
- [ ] Screenshots are at 2x resolution (retina)
- [ ] No horizontal scrollbar or clipping on any diagram
- [ ] Script exits cleanly (no orphaned dev server process)
- [ ] No modifications to existing source files
