# Session Prompt: Notice Vision Page

**Date:** 2026-02-27
**Type:** New page + island components
**Scope:** Create the Notice vision document as a page on thbrdy.dev, with interactive island visualizations

---

## Situation

The Notice vision document needs to become a page on the site — not an essay, but an investor-facing vision document with the same visual treatment and production quality as the essays (scroll-triggered islands, typography system, warm light palette). It will be linked from the Notice project card on the homepage.

The content has been reviewed and a structural/voice pass completed. This prompt contains the restructured content, specific edits, component specifications, and the four new island prototypes to convert to production TSX.

---

## Mission

1. Create the MDX page for the vision document
2. Build four new island components (converting from JSX prototypes) plus one new timeline component from spec
3. Wire up three existing island components for reuse (NoticeCompetitiveGap, NoticeArchitectureDiagram, NoticeInteractionFlow)
4. Verify build, rendering, and mobile behavior

---

## Content Structure and Edits

The source document is `notice-vision.md`. The page should live at `/writing/notice-vision/` (or a similar slug — confirm with the content collection schema). The MDX file goes in `src/content/writing/notice-vision.mdx`.

### Frontmatter

```yaml
title: "Notice"
date: 2026-02-27
description: "A biofeedback-assisted state navigation app that trains interoceptive awareness — helping you notice what your body already knows, in the middle of a life."
tags: ["Interoception", "Contemplative Technology", "Apple Watch", "AI Architecture", "Vision"]
connected_project: "Notice"
```

### Section-by-Section Content Instructions

**01 · The Gap** — Use as-is from the vision document. No changes.

**02 · What Notice Is** — Two edits:
- Remove the `#### Three tiers of reflection` subheading. Fold the content into the preceding paragraph as flowing prose. Something like: "Claude reflects at three timescales: a brief sentence at snap time — a small act of witnessing; an exploratory paragraph during debrief — an invitation toward curiosity; and daily and weekly synthesis — longitudinal pattern detection that surfaces what you cannot see from inside a single moment. The weekly reflections consume daily syntheses hierarchically, so the AI reasons over compressed patterns rather than re-aggregating raw data. Over weeks and months, these syntheses surface the recurring shapes of your inner life — the patterns you did not know you had."
- Replace "is what separates Notice from every wellness chatbot on the market" with "is the deepest design constraint in the product" or similar phrasing that stays intellectual rather than competitive.
- Insert `<NoticeInteractionFlow client:visible />` AFTER the first paragraph introducing the Frame Snap (after "Then you debrief."). This is an EXISTING component — import from `../../components/islands/NoticeInteractionFlow.tsx`. It shows the four-step flow (Tap → Capture → Name → Reflect) with the "Key Design Decision" callout about subjective-before-objective ordering. Do NOT rebuild it.
- Insert `<NoticeVisionTextureGrid client:visible />` AFTER the interaction flow, at the emotion taxonomy diagram placeholder location. The sequence in Section 02 should be: prose introducing the Frame Snap → NoticeInteractionFlow → prose introducing the emotion taxonomy ("The debrief is not a form...") → NoticeVisionTextureGrid → prose about affect labeling research → Claude reflection quote → tiers of reflection prose.

**03 · What's Built** — Compress paragraphs 2 and 3 (the feature inventory) into roughly three sentences:
- The full snap-debrief-reflection loop works on both Watch and iPhone.
- Voice-initiated snaps via Siri and AirPods let you capture a moment without looking at a screen.
- On-device intelligence handles context assembly — HealthKit trends, calendar, location, recent snaps — without any data leaving the device.
- Cut: liquid glass FAB, Watch face complication specifics, Smart Stack widget details, RelevanceKit, Action Button specifics, graceful degradation details. These are demo-level details.
- Keep the final line about Apple Intelligence degradation if you want, but one sentence max.

**04 · Privacy by Architecture** — Minor compression:
- Cut "About fifty lines of stateless code on Cloudflare's free tier, adding less than 50 milliseconds of latency." Replace with something like "A stateless Cloudflare Worker proxy holds the API key server-side and validates device identity via Apple's App Attest before forwarding any request."
- Keep the regulatory paragraph as-is. It's important for investors.
- Insert `<NoticeArchitectureDiagram client:visible />` at the diagram placeholder. This is an EXISTING component — import it from `../../components/islands/NoticeArchitectureDiagram.tsx`. Do NOT rebuild it.

**05 · What the Science Says** — Restructure:
- Opening line: keep "Three research threads converge in the product." Cut the second sentence ("Notice is designed as a set of interventions grounded in specific empirical findings, not a wellness app with science sprinkled on top."). The evidence speaks for itself.
- Affect Labeling subsection: keep as-is, it's one paragraph, the right length.
- Emotional Granularity subsection: keep as-is.
- Interoceptive Lead Time subsection: keep as-is. This is the climax of the section. The "This is the metric I am most excited about" opening is perfect.
- The blockquote ("A month ago, your body would shift 40 minutes...") should be rendered as a `<PullQuote>` island: `<PullQuote client:visible slug="notice-vision" quoteIndex={1}>A month ago, your body would shift 40 minutes before you snapped. Now it is 15 minutes. You are noticing sooner.</PullQuote>`
- Insert `<NoticeVisionLeadTime client:visible />` AFTER the PullQuote and before the closing paragraph of that subsection.

**06 · An App That Gets Quieter** — Use as-is. No changes to prose.
- Insert `<NoticeVisionScaffoldingDecay client:visible />` at the diagram placeholder location.

**07 · The On-Device Future** — Compress to three paragraphs:
- Paragraph 1: "The Claude API is powerful, but it introduces ongoing cost, latency, and a data pathway outside the phone. The north star is every reflection tier running locally. No API dependency. No data disclosure. No marginal cost per reflection."
- Paragraph 2: "On-device LoRA adaptation means the model learns *your* phenomenological vocabulary, *your* somatic patterns, *your* characteristic ways of relating to experience. Not a generic wellness model shaped by population averages — a contemplative mirror that becomes more precise the longer you practice with it. The personalized weights never leave the phone. The privacy-maximizing architecture turns out to be the quality-maximizing architecture too — a rare alignment."
- Paragraph 3: "Timeline: on-device brief reflections are 4–6 weeks from starting the training pipeline. Exploratory reflections on-device are plausible in 6–12 months. Daily and weekly synthesis may require a generation of model capability improvement. The cloud API remains available as fallback throughout."
- Cut everything else from section 07 (llama.cpp, MLX, SmolLM3-3B, training pipeline details, correction examples, teacher-student distillation). This is technical appendix material.

**08 · The Market** — Cut the Pricing and Go-to-market subsections entirely.
- Keep the two main paragraphs: competitive landscape ("Calm and Headspace own guided meditation...") and convergence warning ("The window to establish this position is narrowing...").
- Add one sentence for positioning: "Premium, anchored against WHOOP and Oura, not meditation apps."
- Replace "Notice is not competing in an existing category. It is creating one." with a more specific opening. The competitive gap diagram does this work better than the assertion. Try: "Three product categories surround the space Notice occupies. None connect all three layers."
- Insert `<NoticeCompetitiveGap client:visible />` at the diagram placeholder. This is an EXISTING component — import from `../../components/islands/NoticeCompetitiveGap.tsx`. Do NOT rebuild it.

**09 · The Larger Vision** — One edit:
- Cut "I am honest about the uncertainties" from the Relational Attunement subsection. The paragraph demonstrates honesty by listing the uncertainties; the meta-statement is redundant.
- Insert `<NoticeVisionExpansionRings client:visible />` at the diagram placeholder location.

**10 · What Comes Next** — Keep the prose paragraph. The timeline diagram placeholder should be built as a simple scroll-triggered vertical timeline (see component spec below). Keep the closing coda paragraphs exactly as written — they are the strongest writing in the document. Do not touch them.

---

## New Island Components to Build

Convert each prototype JSX to production TSX, following the island conventions in CLAUDE.md:
- TypeScript (`.tsx`)
- Import `tokens` from `./shared/tokens` (use CSS custom property references, not hex values)
- Import `useInView` from `./shared/useInView`
- Component-scoped class names to avoid collisions
- Injected `<style>` blocks for responsive CSS
- Media queries at 640px and 420px breakpoints
- `prefers-reduced-motion` support
- Use `<div>` instead of `<p>` for elements needing custom margins (PostLayout specificity issue)
- Default export for each component

### 1. NoticeVisionTextureGrid.tsx

**Source prototype:** `prototype-texture-grid.jsx`
**Prefix:** `NoticeVision` (vision page components)
**Location:** `src/components/islands/NoticeVisionTextureGrid.tsx`

Six cards in a 3×2 grid. Each card: group name in DM Sans (small-caps, colored), three emotion labels in Cormorant Garamond italic. Staggered fade-in on scroll. Caption below.

Colors are local constants (not in global palette):
- Alive: `#C47A2A` / `rgba(196, 122, 42, 0.06)`
- Settled: `#6B8E6B` / `rgba(107, 142, 107, 0.06)`
- Open: `#5B7FA5` / `rgba(91, 127, 165, 0.06)`
- Heavy: `#7A6B8A` / `rgba(122, 107, 138, 0.06)`
- Stirred: `#B85C4A` / `rgba(184, 92, 74, 0.06)`
- Tight: `#8A7A6A` / `rgba(138, 122, 106, 0.06)`

### 2. NoticeVisionLeadTime.tsx

**Source prototype:** `prototype-lead-time.jsx`
**Location:** `src/components/islands/NoticeVisionLeadTime.tsx`

Interactive slider visualization. Reader scrubs through 12 weeks of practice. Two markers on a timeline (red = body shift, teal = conscious snap) converge as the slider moves right. Large number display shows the gap in minutes. Interpretive caption changes at five progress thresholds. Research grounding coda below.

Key interaction: `<input type="range">` controls the progress value (0–1). Gap interpolates between 45 minutes (week 1) and 10 minutes (week 12). Markers reposition via CSS transition.

Accessibility: `aria-label`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on the range input. Keyboard accessible (arrow keys).

### 3. NoticeVisionScaffoldingDecay.tsx

**Source prototype:** `prototype-scaffolding-decay.jsx`
**Location:** `src/components/islands/NoticeVisionScaffoldingDecay.tsx`

Horizontal gradient bar in three segments with decreasing amber opacity (22% → 12% → 5%). Bar segments animate with scaleX from left. Three detail cards below, hover-linked to bar segments. Axis labels: "← App presence" / "User capacity →". Closing italic caption.

### 4. NoticeVisionExpansionRings.tsx

**Source prototype:** `prototype-expansion-rings.jsx`
**Location:** `src/components/islands/NoticeVisionExpansionRings.tsx`

Three concentric circles. Inner (amber, "now") → middle (green, "later") → outer (blue, "speculative"). Reduced ring sizes (radiusPct: 20/38/56) in a 380px max-width container so they don't overlap surrounding content. Staggered scroll animation, inner first. Inner ring label ("Individual Interoception") is centered in the circle; outer ring labels positioned near the top of their rings. Subtitle: "Each ring is gated by the one inside it". Three detail cards below with colored top borders, hover-linked to rings. Closing coda in DM Sans.

### 5. NoticeVisionTimeline.tsx (new — no prototype, build from spec)

**Location:** `src/components/islands/NoticeVisionTimeline.tsx`

Simple vertical timeline. Left edge: amber dots connected by 1px `var(--border-mid)` vertical line. Right of each dot: time label in JetBrains Mono (uppercase, accent-colored) and description in DM Sans. Staggered slide-in from left on scroll.

Data:
```
NOW          → Validate Foundation Models on hardware. Incorporate beta feedback. Deploy API proxy.
MONTHS 1–3   → Begin on-device model training pipeline. Expand beta. Launch notice.tools.
MONTHS 3–6   → Ship on-device brief reflections. Implement scaffolding decay. Measure interoceptive lead time.
MONTHS 6–12  → Expand on-device to exploratory reflections. Finalize pricing. Niche podcast outreach.
JANUARY 2027 → App Store launch.
```

---

## Existing Components to Reuse

Import these directly — do NOT rebuild:

```tsx
import { NoticeCompetitiveGap } from '../../components/islands/NoticeCompetitiveGap.tsx'
import { NoticeArchitectureDiagram } from '../../components/islands/NoticeArchitectureDiagram.tsx'
import { NoticeInteractionFlow } from '../../components/islands/NoticeInteractionFlow.tsx'
import { PullQuote } from '../../components/islands/shared/PullQuote.tsx'
import { SectionDivider } from '../../components/islands/shared/SectionDivider.tsx'
```

Use `<SectionDivider>` between sections with appropriate numbers and labels matching the vision doc section names.

---

## MDX Imports Block

```tsx
import { SectionDivider } from '../../components/islands/shared/SectionDivider.tsx'
import { PullQuote } from '../../components/islands/shared/PullQuote.tsx'
import { NoticeCompetitiveGap } from '../../components/islands/NoticeCompetitiveGap.tsx'
import { NoticeArchitectureDiagram } from '../../components/islands/NoticeArchitectureDiagram.tsx'
import { NoticeInteractionFlow } from '../../components/islands/NoticeInteractionFlow.tsx'
import NoticeVisionTextureGrid from '../../components/islands/NoticeVisionTextureGrid.tsx'
import NoticeVisionLeadTime from '../../components/islands/NoticeVisionLeadTime.tsx'
import NoticeVisionScaffoldingDecay from '../../components/islands/NoticeVisionScaffoldingDecay.tsx'
import NoticeVisionExpansionRings from '../../components/islands/NoticeVisionExpansionRings.tsx'
import NoticeVisionTimeline from '../../components/islands/NoticeVisionTimeline.tsx'
```

---

## Technical Constraints

- No new npm dependencies. Check `package.json` diff.
- All colors via CSS custom properties or pre-computed local rgba constants. No string-concatenated opacity variants.
- `<div>` instead of `<p>` for island elements needing custom margins.
- Injected `<style>` tags with component-scoped class names (e.g., `nvtg-*`, `nvlt-*`, `nvsd-*`, `nver-*`, `nvtl-*`).
- All animations respect `prefers-reduced-motion: reduce`.
- Mobile: 640px and 420px breakpoints. No horizontal scroll.
- Islands hydrate via `client:visible`.

---

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] Page renders at `/writing/notice-vision/` (or chosen slug)
- [ ] Background is `--bg: #FAF6F0`, not pure white
- [ ] All prose in Cormorant Garamond. All labels/metadata in DM Sans or JetBrains Mono.
- [ ] All eight islands render and animate on scroll (5 new + 3 reused)
- [ ] Interoceptive lead time slider is interactive (drag changes gap number and marker positions)
- [ ] Scaffolding decay bar segments hover-link to detail cards
- [ ] Expansion rings hover-link to detail cards
- [ ] Existing components (NoticeCompetitiveGap, NoticeArchitectureDiagram, NoticeInteractionFlow) render correctly
- [ ] PullQuote renders with scroll-triggered fade
- [ ] SectionDividers show numbered labels
- [ ] Mobile (420px): no horizontal scroll, islands stack appropriately, slider works on touch
- [ ] `prefers-reduced-motion: reduce` — all animations skip to final state
- [ ] No new entries in `package.json` dependencies
- [ ] Page appears in `/writing` index (ensure `draft: false` or omit draft field)
