# Interaction Patterns

Reusable conventions for interactive components across thbrdy.dev. These patterns emerged from the VoD essay visualization redesigns and the annotation system, and apply to all island components site-wide.

## Governing Principle: Form Embodies Argument

A visualization's interaction model should make the reader *experience* the claim, not just observe a diagram about it. Every design choice — the control type, the animation, the information architecture — should be in service of the specific argument the component makes.

This means there is no default template. Each component starts from its argument and works backward to an interaction model. But the *patterns* below are reusable building blocks that recur across different arguments.

## Interaction Controls

### Match the Control to the Argument's Structure

The control type encodes information about the argument. Choose deliberately:

- **Binary toggle** when the argument is about two discrete states (e.g., SequentialFunnel: what sequential evaluation sees vs. what actually exists). The toggle's click is the structural reveal.
- **Continuous slider** when the argument is about a spectrum with a meaningful middle zone (e.g., LegibilityGap: research vocabulary ↔ product vocabulary, with a liminal translation zone between). A toggle here would destroy the insight that the middle ground is where bridges emerge.
- **Scroll-driven** when the argument is about temporal or sequential unfolding — the reader's physical progression through the page mirrors progression through the idea.
- **Click-to-reveal** when the argument is about hidden depth — surface simplicity with optional detail.

### Mode-Sensitive Explanations

When a component has multiple states (toggle positions, slider zones, scroll phases), click-for-detail panels should show different explanation text depending on the current state. Same element, different framing.

Implementation pattern: store explanation text keyed by mode in the data model. On click, read the current mode and select the appropriate text. If the user changes mode while an explanation is open, update the text live — this lets the reader watch the reframing happen.

```
// Data model example
{
  id: 'engineering',
  label: 'Engineering Feasibility',
  explain: {
    sequential: 'Estimates build cost for whatever research and market have already approved...',
    actual: 'Build complexity feeds back into research approach...',
  }
}
```

## Extended Pattern Vocabulary

The patterns above (toggle, slider, scroll-driven, click-to-reveal) emerged from components we've built. The patterns below are drawn from reference practitioners in the explorable explanation genre. They haven't been implemented on this site yet but are available as design vocabulary for future components. Each is described with enough specificity to prototype from.

Reference index: [explorabl.es](https://explorabl.es) catalogs the genre broadly.

### Reactive Inline Parameters (Victor)

*Source: Bret Victor, "Explorable Explanations" and "Tangle" library.*

A manipulable value embedded directly in prose text. The reader drags or scrubs a number, and the surrounding paragraph updates in real time to reflect the new value. The text itself is the interface — no separate diagram needed.

This is different from our standalone diagram components. Victor's move is making *prose* interactive: "At a translation fidelity of **[72%]**, the research term becomes partially legible" — where 72% is a draggable value, and the sentence (or a nearby visualization) reacts.

When to use: when the argument hinges on a threshold, a parameter, or a "what if" — and the reader needs to discover where the interesting values are by exploring the space themselves. The inline placement keeps the reader in the prose flow rather than context-switching to a separate widget.

Implementation approach: a `<span>` with `cursor: ew-resize` that tracks horizontal drag distance, maps to a value range, and emits updates to sibling elements. CSS `user-select: none` on the span during drag. Display the current value inline with a subtle underline or highlight to signal interactivity. Site convention: use `var(--accent)` underline + DM Sans for the value display (it's a structural/data element, not prose).

Constraint: the reactive span must be keyboard-accessible (arrow keys to increment/decrement) and must have an `aria-valuenow` / `aria-valuemin` / `aria-valuemax` for screen readers.

### Reader-Generated Proof (Case)

*Source: Nicky Case, "Parable of the Polygons," "The Evolution of Trust."*

The reader makes choices, a simulation runs, and the outcome demonstrates the thesis. The reader doesn't observe a pre-computed proof — they *produce* the evidence through their own interaction.

This is a stronger form of "form embodies argument." In our current components, the reader explores a structure that already exists (toggle reveals hidden edges, slider shifts between vocabularies). In Case's pattern, the structure *emerges from the reader's decisions*. The argument isn't "look at this" — it's "try it yourself and watch what happens."

When to use: when the argument is a causal claim that's counterintuitive or contested. Letting the reader generate the evidence themselves is more persuasive than showing them a diagram. Especially powerful for emergent phenomena — where the macro pattern arises from simple local rules that the reader controls.

Implementation approach: define a small simulation with clear rules and a visible state space. Give the reader 1–3 controls (sliders, drag-to-place, click-to-toggle). Run the simulation visibly — don't hide the computation. Show the outcome updating in real time as the reader manipulates inputs. The key UX requirement: the causal chain from reader action → simulation state → visible outcome must be immediate and legible. No "run" button — the simulation is always live.

Candidate component: VoDTradingZone. Let the reader place organizations on the research-autonomy × product-integration field before revealing actual positions. The gap between the reader's intuition and reality *is* the insight.

### Scrub-Controlled Mechanism (Ciechanowski)

*Source: Bartosz Ciechanowski, "Gears," "Sound," "Mechanical Watch."*

The reader controls temporal progress through a multi-step causal chain by scrubbing (dragging a progress control). The animation advances only as far as the reader drags — no autoplay, no play button. The reader's hand is on the mechanism.

This is different from a spatial slider (LegibilityGap) which controls a parameter. The scrub controls *time* — it shows how step N causes step N+1 in a sequential process. The reader sets the pace of revelation and can reverse to re-examine any transition.

When to use: when the argument is about a causal mechanism — how A leads to B leads to C. The reader needs to see each transition clearly, at their own pace, and be able to replay any step. Especially effective for processes where the intermediate states are as important as the endpoints.

Implementation approach: a horizontal scrub bar (range input or custom drag element) mapped to a normalized progress value (0–1). The component defines keyframes at specific progress values (e.g., 0.0–0.25 = step 1, 0.25–0.5 = step 2). Between keyframes, elements interpolate position/opacity/size linearly. The scrub bar should show tick marks at keyframe boundaries with labels. Visual treatment: same as the lens slider (accent-colored thumb, gradient track) but with keyframe ticks added.

Key UX detail from Ciechanowski: pair the scrub with a synchronized diagram that animates in place. The reader scrubs; the diagram responds. No separate "animation player" — the scrub *is* the animation control. The diagram and the scrub are perceptually one object.

Candidate component: VoDCouplingMechanism. Scrub through the four domains' readings of the PR/FAQ document — at progress 0.0 the document is un-annotated; scrub to 0.25 and Research's reading highlights; scrub to 0.5 and Product's reading overlays; by 1.0 all four readings are visible and the coupling is apparent.

### Progressive Density (Distill)

*Source: Distill.pub, "Feature Visualization," "Attention and Augmented Recurrent Neural Networks."*

The same concept is explained at increasing levels of detail as the reader progresses. First pass: the intuition in one sentence. Second: the mechanism with a simple diagram. Third: the full specification with edge cases and formal notation. Each level is self-sufficient — a reader can stop at any depth and have a correct (if incomplete) understanding.

This is a scroll-driven pattern but more specific than generic scrollytelling. The structure is concentric, not sequential: each layer wraps and enriches the previous one rather than moving to the next topic. The reader is always looking at the same concept — just with more resolution.

When to use: when the audience has mixed expertise. A product manager reads the first layer and gets the intuition. An engineer reads deeper and gets the mechanism. A researcher reads the full specification. Each person stops at their natural depth without feeling like they've missed the point.

Implementation approach: three (or more) scroll-triggered zones, each containing the same concept at a different resolution. As the reader scrolls past a zone boundary, the visualization gains detail: labels appear, annotations unfold, secondary elements fade in. Crucially, earlier elements remain visible — the lower-density version is still there, now surrounded by higher-density context. Use `useInView` with multiple thresholds on a single component, or segment the component into stacked layers with independent scroll triggers.

Visual treatment: lower-density layers use larger type, more whitespace, fewer elements. Higher-density layers use smaller structural type (DM Sans), tighter spacing, more annotation. The density shift should be visible — it's part of the reading experience.

### Tethered Explanation (Cross-Practitioner)

*Source: appears across Distill.pub (margin annotations), Victor (inline values), Ciechanowski (labeled diagram parts), Case (inline simulation controls).*

The explanation is visually connected to the thing it explains — by a line, a highlight, spatial proximity, or inline placement. Not shunted to a separate panel below the diagram.

Our current pattern uses detail panels that sit below the component (the node-explain panel in SequentialFunnel, the explain-panel in LegibilityGap). This works but creates a spatial gap: the reader clicks a node at the top of the diagram, then reads the explanation at the bottom. The eye has to travel, and the connection between the element and its explanation is maintained only by memory.

Tethering closes this gap. The explanation appears *next to* the element it describes: a margin annotation beside the relevant paragraph, a tooltip anchored to the relevant node, a callout with a visible leader line pointing to the source element.

When to use: when the explanation is short enough to fit near the element (1–3 sentences) and the spatial relationship between element and explanation *matters* to comprehension. For longer explanations, the below-component detail panel is still appropriate — but consider a leader line or highlight connecting the panel to the triggering element.

Implementation approaches, in order of tightness:

- **Inline** (tightest): the explanation is part of the text itself, like Victor's reactive values. No spatial gap at all.
- **Anchored tooltip**: a popover positioned adjacent to the clicked/hovered element using `position: absolute` relative to the diagram container. Follows existing popover visual pattern (bg-warm, border-mid, shadow). Add a small CSS triangle or leader line pointing to the anchor element.
- **Margin annotation**: explanation rendered in the margin beside the relevant content. Works on wide viewports; collapses to inline or below-component on mobile. Distill.pub's signature pattern.
- **Leader line**: a thin line (1px, `var(--border-mid)`) connecting a below-component detail panel to the element it explains. The panel stays in its current position but gains a visual tether.

Constraint: anchored tooltips must reposition to stay within viewport bounds (flip from right to left if near the edge). On mobile, all tethered patterns collapse to either inline or bottom-sheet — margin annotations don't work on narrow viewports.

## Connection Rendering: SVG vs CSS

Two approaches for drawing connections between elements, chosen based on the connection's role in the interaction:

**SVG edges** — when connections are animated, hoverable, or need hit targets. Used in SequentialFunnel (edges appear/disappear on toggle, hoverable with labels) and any component where edges are part of the interactive argument. SVG gives you stroke-width control, opacity transitions, coordinate-based positioning, and the fat hit target pattern below.

**CSS div connectors** — when connections are static and structural. Used in the Toulmin diagram (vertical lines between Claim → Data → Backing with "supports" / "on account of" labels). CSS divs are simpler: a `1px` wide div with a background color, no SVG namespace overhead, natural document flow. These collapse to single-column on mobile via standard responsive CSS.

Rule of thumb: if the reader will interact with the connection (hover, click, watch it animate), use SVG. If the connection just shows structure, use a CSS div.

## SVG Interaction

### Fat Hit Targets

Any hoverable or clickable SVG line gets an invisible companion element for reliable interaction. Visible lines are too thin (1–2px) to hover reliably, especially on touch devices.

Implementation: render an invisible `<line>` with `stroke: transparent` and `stroke-width: 18` on top of each visible line. The invisible line handles all pointer events (`pointer-events: stroke`); the visible line has `pointer-events: none`.

```svg
<!-- Visible line — no pointer events -->
<line x1="..." y1="..." x2="..." y2="..."
  stroke="var(--teal)" stroke-width="1.5"
  style="pointer-events: none;" />

<!-- Fat invisible hit target — handles interaction -->
<line x1="..." y1="..." x2="..." y2="..."
  stroke="transparent" stroke-width="18"
  style="pointer-events: stroke; cursor: pointer;" />
```

Rules:
- Hit target width: 18px minimum.
- Hit target sits above the visible line in DOM order (painted on top, but transparent).
- Sync hit target coordinates with visible line on all state changes (toggle, animation).
- When an edge is hidden (e.g., collapsed in sequential mode), set `pointer-events: none` on the hit target too.

### Edge Highlighting

On hover: thicken the hovered edge (stroke-width 1.5 → 3), raise opacity to 1, dim all other edges (opacity → 0.25). On node click: highlight all edges connected to the selected node (stroke-width → 2.5, opacity → 0.8), dim unconnected edges.

## Popovers and Detail Panels

### Popover Visual Pattern

All hover/tap popovers across the site share a consistent visual treatment:

- **Background:** `var(--bg-warm)` (#F4EFE7)
- **Border:** `1px solid var(--border-mid)` with `border-radius: 8px`
- **Shadow:** `0 2px 12px rgba(44, 36, 22, 0.08)`
- **Typography:** DM Sans for all popover content (structural, not prose). Mode badges and metadata in JetBrains Mono.
- **Line-height:** 1.4–1.45 (tighter than body prose 1.6)
- **Constraint:** Only one popover open at a time.

### Detail Panels (Click-to-Reveal)

For richer explanations that need more than a tooltip, use a detail panel below the component:

- **Background:** `var(--bg-warm)`
- **Left border:** `3px solid var(--accent)`
- **Border-radius:** `8px`
- **Header:** element name (DM Sans bold) + mode badge (JetBrains Mono, small caps, colored background pill)
- **Body text:** Cormorant Garamond, `0.9rem`, `var(--text-mid)`, line-height 1.6
- **Transition:** `opacity 0.3s ease, max-height 0.4s ease`
- **Hidden state:** `opacity: 0; max-height: 0; padding: 0;`

### Popover Content Structure

Beyond the shared visual shell (bg-warm, border, shadow), popovers need consistent internal layout. Three content templates have been established, generalized from the annotation system (Decision 018). These apply to any popover, not just text annotations — a diagram label tooltip, a node detail card, or a link preview should use the same structures.

**Term/definition popover** — for explaining what something means:

- Mode badge (JetBrains Mono, 0.55rem, uppercase, colored pill background) — top-left, identifies the popover type
- Term name (DM Sans, 0.8125rem, bold, `var(--text)`)
- Definition (DM Sans, 0.75rem, regular, `var(--text-mid)`, 1–3 sentences)

Use for: diagram node tooltips, glossary terms, labeled concepts. The badge distinguishes "this is a definition" from other popover types at a glance.

**Reference/citation popover** — for contextualizing a source:

- Title (DM Sans, 0.8125rem, italic, `var(--text)`)
- Attribution (JetBrains Mono, 0.6rem, `var(--text-muted)`) — authors, year, source
- Summary (DM Sans, 0.75rem, `var(--text-mid)`, 2–3 sentences)
- Context line (DM Sans, 0.6875rem, italic, `var(--text-light)`) — "In this essay: [how it's relevant]"
- Source link (DM Sans, 0.6875rem, `var(--teal)`) — "View paper →" or similar CTA

Use for: academic citations, external references, evidence popovers on diagram elements.

**Link preview popover** — for previewing an outbound URL:

- URL domain (JetBrains Mono, 0.55rem, `var(--text-muted)`)
- Title (DM Sans, 0.8125rem, bold, `var(--text)`)
- Source/publication (DM Sans, 0.6875rem, `var(--text-light)`)
- Summary (DM Sans, 0.75rem, `var(--text-mid)`, 1–2 sentences)
- CTA (DM Sans, 0.6875rem, `var(--teal)`) — "Visit page →"

Use for: enriched external links anywhere on the site. The two-tap mobile convention applies: first tap opens preview, second tap navigates.

**Shared layout rules across all three:** Content flows top-to-bottom with 4–6px gaps between elements. Max-width: 280px (desktop), full-width minus 32px margin (mobile bottom sheet). Padding: 12px 14px. No horizontal rules or dividers inside popovers — the type hierarchy and spacing create the structure.

### Semantic Color as Argument

Diagram colors encode meaning without needing a legend. The semantic palette:

- `var(--teal)` / `var(--teal-dim)` — research, success, positive outcome
- `var(--accent)` / `var(--accent-dim)` — product, commercial, gold-coded elements
- `var(--red)` / `var(--red-dim)` — failure, risk, negative outcome
- `var(--green)` / `var(--green-dim)` — success (when teal is already taken for research)
- `var(--blue)` / `var(--blue-dim)` — neutral category, third dimension

Used in VoDCaseComparison: teal column (success) | red column (failure) | green column (success) — the color *is* the verdict before the reader processes any text. The color sandwich (success–failure–success) makes the contrast immediate.

Constraint: semantic colors are for diagrams only, never in page chrome (navigation, footer, cards). Per-essay accent colors are local constants in the component file, not CSS custom properties — and opacity variants must be pre-computed (e.g., `const tealDim = 'rgba(42, 122, 106, 0.08)'`), not string-concatenated from `var()` references (which produces invalid CSS).

### Trigger Indicators

Interactive elements need a visual signal that they're interactive, and the signal should encode *what kind* of interaction to expect. Color-coding trigger types lets the reader distinguish "this will define a term" from "this will preview a link" before they interact.

Principle: different categories of interactive trigger get different colors from the semantic palette. The color is the type indicator — no icon or label needed.

Current trigger types:

- **Term annotations (inline text):** `1.5px dashed var(--accent)` bottom border. Gold = "this will explain a concept."
- **Link annotations (inline text):** `1.5px dashed var(--teal)` bottom border. Teal = "this will preview a destination." The color shift from gold to teal signals a different popover type before the reader hovers.
- **Diagram nodes:** `border-color: var(--accent)` + elevated box-shadow on hover. Selected state adds `background: var(--bg-warm)`. The border-color shift from `var(--border-mid)` to `var(--accent)` on hover is the interactivity signal.
- **Diagram edges:** Thickened stroke + raised opacity (see Edge Highlighting above).

When adding new trigger types, assign them a color from the semantic palette that doesn't collide with existing meanings in the same component. If a component already uses teal for link triggers and accent for term triggers, a third trigger type could use `var(--blue)` — but document the mapping in the component's data model.

### Mobile

- Popovers render as **bottom sheets** with semi-transparent backdrop (`rgba(0,0,0,0.3)`).
- Tap outside to dismiss.
- For link annotations: first tap opens popover, second tap navigates.
- Detail panels remain inline (they're already full-width).

### Accessibility

- `role="tooltip"` on popovers, `aria-describedby` linking trigger to popover.
- `tabindex="0"` on triggers.
- Keyboard: Enter/Space to toggle, Escape to dismiss.
- All animations respect `prefers-reduced-motion: reduce` (transition-duration → 0.01s).

## Visual Punctuation and Component Adjacency

When interactive components sit adjacent to structural elements (SectionDividers, PullQuotes, other islands), their visual boundaries can collide.

**Short accent bars over full-width borders.** PullQuote uses a centered 40px gold accent bar at top, not a full-width border. Full-width borders stack visually with SectionDivider horizontal rules, creating double/triple line artifacts. Short accent bars provide visual punctuation without competing with structural dividers.

**One-sided borders when adjacent.** When a PullQuote precedes a SectionDivider, use only the top accent bar — the SectionDivider below provides the exit. Avoid decorative elements on the edge that faces another component's decorative element.

**General rule:** Before finalizing a component's borders/dividers, check what sits immediately above and below it in the essay flow. Static mockups miss this — you need to see the component in its actual MDX context.

## CSS Specificity in Islands

Two gotchas that bite when building island components:

**`<p>` margin override.** `PostLayout.astro` applies `.post__content :global(p) { margin: 0 0 1.25rem }` to all paragraphs inside essay content. This has higher specificity than class selectors in island injected `<style>` tags, silently overriding component margins. Use `<div>` instead of `<p>` for island elements that need custom margins (annotations, captions, compact labels). Standard `<p>` tags that are fine with the 1.25rem bottom margin can stay as `<p>`.

**Opacity variant string concatenation.** When a component needs a semi-transparent version of a semantic color, pre-compute it as a local constant: `const tealDim = 'rgba(42, 122, 106, 0.08)'`. Do not attempt `${tokens.teal}30` or `${var(--teal)}30` — this produces invalid CSS. The `*-dim` variants in `global.css` exist for exactly this reason; use them when available.

## Animation

### Transformation Over Static Comparison

Don't show two states side by side. Animate between them. The structural change is the insight — the reader should watch it happen.

- **Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (site standard).
- **Duration:** 0.6–0.8s for structural repositioning. 0.3–0.4s for opacity/highlight changes.
- **Stagger:** When multiple elements animate together, stagger by 0.1–0.15s per element for readability.

### Scroll-Triggered Entry

Island components fade in on scroll via `useInView` hook (`shared/useInView.ts`). This is the canonical spec — CLAUDE.md's Animation section defers here.

- **Mechanism:** IntersectionObserver, fire-once (no re-triggering on scroll back).
- **Hook signature:** `const [ref, inView] = useInView(threshold)` — returns a ref to attach and a boolean.
- **Reduced motion:** The hook checks `prefers-reduced-motion` internally. When reduced motion is preferred, `inView` is immediately `true` (no animation).
- **Entry pattern:** `opacity: 0 → 1`, `translateY(12–20px → 0)`, applied via inline styles keyed to `inView`.
- **Easing:** Same site-standard cubic-bezier as structural animations.
- **Stagger:** Elements within a component stagger their entry delays (e.g., `${i * 0.12}s`).
- **Threshold:** 0.1–0.15 (trigger when 10–15% of component is visible).
- **Bridge/edge entry:** Bridges and connecting lines enter after nodes, with longer delays (e.g., `${0.9 + i * 0.1}s` for bridge lines in LegibilityGap). Structural connections should feel like they *emerge from* the nodes, not appear simultaneously.

### Reduced Motion

All animations must include:
```css
@media (prefers-reduced-motion: reduce) {
  .component-name, .component-name * {
    transition-duration: 0.01s !important;
  }
}
```

## Development Workflow

### Prototype First

Build new interaction models as standalone HTML files in `prototypes/` before touching production code. Validate that the interaction works, feels right, and embodies the argument. Then port to React TSX.

- Prototypes use the same design tokens, fonts, and color variables as the production site.
- Prototypes are vanilla HTML/CSS/JS — no build step, open directly in a browser.
- Name: `vod-[component-slug].html` or `[feature-name].html`.

### Production Conversion

When porting a prototype to a React island:
- Use `useState` for interaction state (toggle, slider value, selected element, hovered element).
- Use `useInView` from `shared/useInView.ts` for scroll-triggered entry.
- Use injected `<style>` tags with component-scoped class names for responsive CSS (see Decision 006).
- Inline styles for animation states that depend on React state (`opacity`, `transform`, `filter`).
- Follow `[Prefix][ComponentName].tsx` naming (see Decision 005).
