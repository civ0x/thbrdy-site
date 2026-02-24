# VoD Essay — Design Pass Handoff

## Where We Are

We've drafted a full essay for thbrdy.dev: **"The Valley of Death Is a Legibility Problem."** The argument: the gap between research and product is a structural failure — coupled questions (technical feasibility, market viability, production readiness) answered sequentially through frameworks (TRL, stage-gate) that destroy the coupling information that matters most. The diagnosis draws on James C. Scott's legibility framework (novel application to tech transfer — confirmed as unpublished), Galison's trading zones, and Star & Griesemer's boundary objects. Evidence spans pharma (AstraZeneca 5R, 6× improvement), defense (DARPA, Goldwater-Nichols), and AI labs (AWS AI Lab, 6× improvement), with honest counterarguments (Watson Health, deep learning's 15-year incubation, Cleantech 1.0 crash).

The thesis has a critical maturity qualifier: premature legibility is as dangerous as failed transition. The essay addresses this directly rather than arguing integration is always superior.

## Artifacts

All in `working/vod-essay/`:

- **`valley-of-death-v2.md`** — Current draft. ~3,500 words. Seven sections with diagram placement markers and detailed diagram specifications in HTML comments. Ready for design pass, then MDX conversion.
- **`valley-of-death-draft.md`** — V1 for reference. Superseded.
- **`research-prompt-vod.md`** — The prompt used for the deep research report.

The deep research report itself was uploaded as `Why Research Dies on the Way to Product.md` (in uploads). Comprehensive cross-domain evidence that informed v2.

## What This Session Needs to Do

**Design pass for six interactive island diagrams.** These aren't illustrations — they're structural arguments that carry meaning the prose can't. Each needs:

1. Visual concept — what the reader sees, what the argument is
2. Layout and hierarchy — what draws the eye, reading order
3. Animation behavior — scroll-triggered via `useInView`, what changes on enter
4. Responsive breakpoints — 640px (tablet), 420px (phone)
5. Color usage — from the site's design system (see CLAUDE.md for full palette)

### The Six Diagrams

**1. VoDLegibilityGap** (after intro, before Section 01)
- **Argument:** Research value and product value describe the same reality in mutually unintelligible vocabularies. The dependency bridges between them exist but are invisible.
- **Spec in draft:** Two parallel tracks (Research Language / Product Language) with dotted dependency bridges that fade in on scroll.
- **Design questions:** How to make "invisible bridges becoming visible" feel like a reveal, not just an animation. Should this be vertical (two columns) or horizontal (two rows)?

**2. VoDSequentialFunnel** (end of Section 01)
- **Argument:** Sequential evaluation (stage-gate) loses coupling information that the actual dependency structure preserves.
- **Spec in draft:** Left side shows linear funnel with gates; right side shows the same nodes as a fully-connected dependency graph.
- **Design questions:** Side-by-side vs. before/after? How to visually convey "information loss" — maybe the dependency edges on the left are absent/grayed?

**3. VoDMaturitySwitch** (Section 03 — "Two Failure Modes")
- **Argument:** There's a switching point between protected exploration and structured translation. Premature legibility is as dangerous as failed transition.
- **Spec in draft:** Horizontal maturity axis with two zones, risk labels on each side.
- **Design questions:** This is the essay's most important diagram — it carries the maturity qualifier that makes the thesis defensible. Needs to feel like a genuine conceptual tool, not a 2×2. How to convey the "unknown switching point" without it looking like a cop-out?

**4. VoDCouplingMechanism** (Section 04 — "Trading Zones")
- **Argument:** The PR/FAQ is a boundary object — different audiences read the same document differently, and it forces joint articulation of coupled constraints.
- **Spec in draft:** Central document icon with four constraint edges radiating to Research/Customer/Engineering/Business. Below: how each audience reads it differently.
- **Design questions:** Risk of looking like a generic "hub and spoke" diagram. How to make the boundary-object concept visually distinct — maybe show the document with different "lenses" or readings overlaid?

**5. VoDCaseComparison** (Section 05 — "Two Cases")
- **Argument:** Two independent cases (AWS Neptune ML, AstraZeneca 5R) achieved ~6× improvement through structurally identical mechanisms in radically different domains.
- **Spec in draft:** Two parallel timelines with structural parallels highlighted between them.
- **Design questions:** How to make the cross-domain convergence feel striking rather than incidental. The 6× figure should be the visual anchor.

**6. VoDTradingZone** (Section 06 — "AI Lab Experiment")
- **Argument:** Current AI labs occupy different positions on a research-autonomy / product-integration landscape, with different risk profiles.
- **Spec in draft:** 2D landscape with positions for OpenAI, Meta FAIR, Google DeepMind, Anthropic. Risk labels on extremes.
- **Design questions:** This risks looking like a positioning quadrant cliché. How to make it feel analytical rather than reductive? Maybe the positions should show movement over time (arrows indicating where each org is heading)?

## Design System Reference

Read `CLAUDE.md` at the site root for the full design system. Key constraints:

- **Palette:** Warm light palette, no dark mode. `--bg: #FAF6F0`, `--accent: #B8860B` (dark gold), semantic colors for diagrams only (`--red`, `--green`, `--blue`, `--teal` with `-dim` variants).
- **Typography in diagrams:** DM Sans for labels/metadata, JetBrains Mono for section markers and small annotations. Never serif in diagram elements.
- **Animation:** Scroll-triggered via IntersectionObserver, fire once. Opacity 0→1, translateY(12–20px → 0), staggered timing. Must respect `prefers-reduced-motion`.
- **Responsive:** Injected `<style>` tags with component-scoped classes. Breakpoints at 640px and 420px.
- **No external libraries.** Diagrams built from HTML + CSS + React state. No D3, no charting libraries.

## Existing Essay Diagrams for Reference

Look at the existing island components in `src/components/islands/` for the established visual language:
- `ScholionDependencyChain.tsx` — chain/flow visualization
- `ScholionToulminDiagram.tsx` — structured argument diagram
- `LCCouplingDiagram.tsx` — coupling/interaction visualization (most relevant precedent)
- `LCLandscapeQuadrant.tsx` — 2D positioning (relevant for VoDTradingZone)
- `NoticeCompetitiveGap.tsx` — comparison/gap visualization

## What Comes After

The output of this design session feeds into a Claude Code session prompt that handles:
- MDX file creation with final prose + island imports
- Six `.tsx` island components following the architecture in CLAUDE.md
- Build verification (`npm run build` clean)

## Open Editorial Question

One unresolved decision: whether to expand the prescription in the essay (the research engineer role, the Fraunhofer 30/70 model) into a more actionable "what you can do" section, or leave the diagnosis strong and the prescription deliberately incomplete. The critical review noted the essay is stronger on diagnosis than prescription. The counterargument: adding prescriptive clarity might reduce intellectual credibility by overpromising. This could be resolved during the design pass — if the diagrams suggest a natural place for prescription, take it; if not, let the essay be what it is.
