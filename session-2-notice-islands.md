# Session 2: Notice Essay Islands

## Situation

The Notice essay MDX has prose migrated and live at `/writing/notice/`. Six interactive component positions are marked with TODO comments. Four have reference implementations in `reference/notice-essay-visuals.jsx`; two (SnapDepth, EmotionTaxonomy) have no prototype and are deferred to a future pass.

Session 1 established the responsive pattern: injected `<style>` tags with scoped class names (documented in CLAUDE.md under "Island Architecture > Responsive Pattern" and DECISIONS.md #006). Use the same pattern here.

Session 0 infrastructure:
- `src/components/islands/shared/` has `tokens.ts`, `useInView.ts`, `SectionDivider.tsx`, `PullQuote.tsx`
- Convention: essay-specific islands use `Notice[ComponentName].tsx`
- Default hydration: `client:visible`

## Mission

Port four interactive components from `reference/notice-essay-visuals.jsx` into typed Astro islands, integrate them into the existing MDX at their correct positions, and verify the build. Leave the two unimplemented TODOs (SnapDepth, EmotionTaxonomy) in place.

## Technical notes

**Lucide-react icons must be replaced with inline SVGs.**

The reference JSX imports ~15 icons from `lucide-react`: Heart, Watch, Smartphone, Brain, Shield, Eye, Cloud, Lock, ArrowRight, ChevronDown, Fingerprint, Activity, Calendar, MapPin, MessageCircle, Sparkles, Check, X. Per CLAUDE.md: "No icon libraries (lucide-react, etc.) — build icons from HTML/CSS/SVG inline."

Every `<IconName size={N} color={C} strokeWidth={W} />` call must become an inline `<svg>` element with the same visual appearance. Lucide icons are 24×24 viewBox, stroke-based, with `stroke-linecap="round"` and `stroke-linejoin="round"`. You can reference the lucide icon set at https://lucide.dev for the path data, or approximate the shapes with simple SVG paths. The icons don't need to be pixel-identical — they need to be visually recognizable and stylistically consistent.

Consider creating a local icon helper or object within each component if the same icon appears multiple times, to avoid duplicating SVG markup. But don't create a shared icon library — these are component-internal.

**Two components use `useState` beyond scroll triggering.**

- `InteractionFlow` has a timer-driven `activeStep` state that sequences through four steps after `inView` fires. This is a fire-once animation — the timers run once on scroll-in and don't reset.
- `ArchitectureDiagram` has `hoveredTier` state for hover highlighting on the two tiers. This is interactive but minimal — hover in/out on two regions.

Both patterns are straightforward React state. No special infrastructure needed.

**Hardcoded colors stay local.**

The reference uses several diagram-internal colors: `#7C6F9B` (purple/contemplative), `#5B8A72` (green/health), `#8B6E5A` (brown/mood), `#C4713B` (orange/privacy boundary). These are single-use semantic colors for this essay's diagrams. Keep them as local constants in each component — they don't belong in the global token set. Same decision as Session 1's Execute-blue and Reflect-purple.

## Components to port

### 1. NoticeCompetitiveGap.tsx
**Source:** `reference/notice-essay-visuals.jsx` lines 22–203
**What it does:** A Venn diagram showing three overlapping product categories (Meditation Apps, Mood Trackers, Health Platforms) with Notice positioned at the center intersection. Below the Venn: a 4-column feature comparison grid with checkmark/X indicators for each capability across categories.
**Interactivity:** Scroll-triggered fade-in via `useInView`. Circles stagger in, labels fade, Notice badge appears last. No user-driven state.
**Porting notes:**
- Replace `Check` and `X` lucide icons with inline SVGs (simple checkmark and X strokes)
- The Venn diagram uses absolute positioning with percentage-based coordinates. This should work reasonably at narrow widths since the container constrains via `maxWidth: 720px`, but verify the circles don't clip at 375px
- The 4-column comparison grid needs responsive handling. At narrow widths, consider stacking the grid rows or switching to a card layout per category
- The category data arrays and capability logic are self-contained — port them as-is

### 2. NoticeInteractionFlow.tsx
**Source:** `reference/notice-essay-visuals.jsx` lines 205–377
**What it does:** A horizontal 4-step process flow (Tap → Capture → Name → Reflect) showing the "Frame Snap" interaction. Each step has an icon in a circle, a label, sublabel, and detail line. Connecting lines run between steps. Below the flow: a callout card explaining the key design decision (subjective-before-objective).
**Interactivity:** Scroll-triggered via `useInView`, then timer-driven sequential reveal via `useState(activeStep)`. Steps animate in one at a time with 500ms intervals. Connecting lines color-shift as each step activates.
**Porting notes:**
- Replace `Fingerprint`, `Activity`, `Eye`, `Sparkles` lucide icons with inline SVGs
- The 4-step horizontal flow needs responsive handling per the Session 1 convention. At narrow widths, stack vertically. The connecting lines should adapt (horizontal → vertical, or omit on mobile)
- The `useEffect` timer pattern: fire timers on `inView` becoming true, clean up on unmount. Port as-is — it's idiomatic React

### 3. NoticeArchitectureDiagram.tsx
**Source:** `reference/notice-essay-visuals.jsx` lines 379–656
**What it does:** A two-tier architecture diagram. Top tier: "On-Device — The Read" with a 2-column grid of tool cards (HealthKit, EventKit, CoreLocation, SwiftData) plus a Felt-Sense Interpreter card. A dashed privacy boundary divides the two tiers with "what crosses / what doesn't" indicators. Bottom tier: "Cloud — The Reflection" with capability list and a dark code block showing what Claude receives.
**Interactivity:** Scroll-triggered fade-in via `useInView`. Hover state via `useState(hoveredTier)` — subtle background shift on the two tier panels.
**Porting notes:**
- Replace `Smartphone`, `Heart`, `Calendar`, `MapPin`, `Activity`, `Brain`, `Lock`, `Shield`, `Cloud`, `Check`, `X` lucide icons with inline SVGs. This component has the highest icon count (~11 distinct icons). Consider a local `icons` object mapping names to SVG JSX to keep the render clean
- The two-tier vertical layout is inherently mobile-friendly (it's already a column). The 2-column tool grids inside each tier should stack at narrow widths
- The dark code block at the bottom uses `--bg-dark` palette colors — this is one of the cases where dark surfaces are permitted per the design system (code blocks and system diagram interiors)
- The hover state (`hoveredTier`) is a desktop interaction. On mobile/touch, it's inert — that's fine, don't add tap-to-toggle

### 4. NoticeBuildTimeline.tsx
**Source:** `reference/notice-essay-visuals.jsx` lines 658–752
**What it does:** A vertical timeline with 7 milestones (Days 1–2 through Day 5+). Each milestone has a time label, a dot on the vertical line, a title, and description. Highlighted milestones get a gold dot and gold title.
**Interactivity:** Scroll-triggered fade-in via `useInView`. Timeline entries stagger in from left. The vertical line transitions from gray to a gold→purple gradient on scroll-in.
**Porting notes:**
- No lucide icons — this component is pure layout
- The vertical timeline is inherently mobile-friendly. Minor concern: the fixed `left: 79px` for the vertical line assumes enough horizontal space for the time labels. At very narrow widths, verify the time labels don't truncate
- The gradient line (`gold → purple`) is a subtle detail — port it as-is
- **Content note:** The timeline data in the reference (Days 1–2 through Day 5+) may not match the current MDX prose, which describes "three working days" with iterative loops. The MDX prose is the source of truth — if the timeline data contradicts the prose, flag it rather than changing either. The component should render whatever data it's given; the data itself can be adjusted in a prose pass

## Integration into MDX

Read the current MDX file (`src/content/writing/notice.mdx`). Insert components at their marked TODO positions:

- **Line 21 TODO** → `<NoticeCompetitiveGap client:visible />`
- **Line 45 TODO** → `<NoticeBuildTimeline client:visible />`
- **Line 59 TODO** → Leave as-is (SnapDepth — no reference implementation)
- **Line 69 TODO** → Leave as-is (EmotionTaxonomy — no reference implementation)
- **Line 85 TODO** → `<NoticeInteractionFlow client:visible />`
- **Line 95 TODO** → `<NoticeArchitectureDiagram client:visible />`

Remove the TODO comments for the four components being inserted. Keep the TODO comments for SnapDepth and EmotionTaxonomy.

Add import statements at the top of the MDX for all four components plus any shared components used (SectionDivider, PullQuote if applicable).

**SectionDividers:** Check whether the current MDX uses `---` horizontal rules for section breaks. If so, replace them with `<SectionDivider>` components matching the essay's section structure:
- 01 — The Gap
- 02 — The Traditions
- 03 — The Build
- 04 — The Interaction
- 05 — The Architecture
- 06 — Honest Limits

If SectionDividers are already present, leave them as-is.

**Design Hypothesis callout:** The MDX opens with a bold design hypothesis paragraph. In the reference JSX, this is styled as a centered card with an eyebrow label. Consider whether to port this as a standalone component or leave it as MDX-styled prose. If it looks fine rendered as bold text, leave it. If it needs the card treatment, a simple styled `<div>` in the MDX (not a separate component) is sufficient.

## Execution

### Step 1: Read sources
Read `reference/notice-essay-visuals.jsx` in full and the current Notice MDX. Map each TODO comment to its reference component. Identify exact insertion points. Note any prose/data mismatches between the reference and MDX.

### Step 2: Port NoticeCompetitiveGap.tsx
- Create `src/components/islands/NoticeCompetitiveGap.tsx`
- Convert from JSX to TSX with appropriate types
- Replace lucide-react icons with inline SVGs
- Import shared utilities (`useInView`, `tokens`)
- Add responsive handling via injected `<style>` tags (per Session 1 convention)

### Step 3: Port NoticeInteractionFlow.tsx
- Create `src/components/islands/NoticeInteractionFlow.tsx`
- Convert from JSX to TSX
- Replace lucide-react icons with inline SVGs
- Port the `activeStep` timer logic
- Add responsive handling

### Step 4: Port NoticeArchitectureDiagram.tsx
- Create `src/components/islands/NoticeArchitectureDiagram.tsx`
- Convert from JSX to TSX
- Replace all lucide-react icons (~11) with inline SVGs
- Port the `hoveredTier` hover logic
- Add responsive handling for the internal 2-column grids

### Step 5: Port NoticeBuildTimeline.tsx
- Create `src/components/islands/NoticeBuildTimeline.tsx`
- Convert from JSX to TSX
- No icons to replace
- Add responsive handling (verify timeline layout at 375px)

### Step 6: Integrate into MDX
- Add import statements to the top of the MDX
- Replace four TODO comments with component tags
- Leave SnapDepth and EmotionTaxonomy TODOs in place
- Add SectionDividers if not already present

### Step 7: Verify
- `astro build` passes clean
- `astro dev` — navigate to the essay, scroll through, confirm:
  - CompetitiveGap Venn diagram and comparison grid render and animate
  - InteractionFlow steps sequence in correctly
  - ArchitectureDiagram two-tier layout renders, hover works on desktop
  - BuildTimeline renders with staggered entries
  - SectionDividers render correctly
  - Remaining TODO comments for SnapDepth and EmotionTaxonomy are preserved
  - No layout shifts or flash of unstyled content
  - Responsive: check 375px viewport — grids stack, Venn doesn't clip, timeline readable

### Step 8: Update STATUS.md
Note Session 2 complete. Notice essay has four islands integrated, two deferred (SnapDepth, EmotionTaxonomy). List remaining sessions.

## Success criteria

- [ ] `NoticeCompetitiveGap.tsx` exists, typed, no lucide-react imports, builds clean
- [ ] `NoticeInteractionFlow.tsx` exists, typed, timer animation works, builds clean
- [ ] `NoticeArchitectureDiagram.tsx` exists, typed, hover works, no lucide-react, builds clean
- [ ] `NoticeBuildTimeline.tsx` exists, typed, builds clean
- [ ] All four components render in the MDX with `client:visible`
- [ ] Scroll-triggered animations work (fade-in, stagger, sequential reveal)
- [ ] SectionDividers integrated in the essay
- [ ] SnapDepth and EmotionTaxonomy TODOs remain in the MDX
- [ ] No lucide-react or other icon library imports anywhere in the new components
- [ ] `astro build` passes with no warnings
- [ ] STATUS.md updated

## What NOT to do

- Do not modify the essay prose text. Only add component insertions and SectionDividers.
- Do not add npm dependencies. No lucide-react, no icon libraries. Inline SVG only.
- Do not modify shared infrastructure files from Session 0.
- Do not modify AB essay components from Session 1.
- Do not port components for other essays.
- Do not design SnapDepth or EmotionTaxonomy — those have no reference and are deferred.
- Do not over-engineer responsive handling — functional at 375px is the bar, not pixel-perfect.
- Do not use `#FFFFFF` as a background anywhere. Use `#FFF8F0` or `tokens.bgWarm` for card backgrounds per the design system.
