# Design: Inline Annotation System

**Date:** 2026-02-24
**Status:** Design — not yet scoped for implementation
**Applies to:** Valley of Death essay initially, generalizable to all essays

## Problem

Reader feedback on the Valley of Death essay: domain-specific terms ("Valley of Death," "Technology Readiness Levels," "mētis," "boundary objects") aren't explained inline. References to papers and books (Branscomb & Auerswald 2003, Scott's *Seeing Like a State*, Galison's *Image and Logic*) are cited but not contextualized — the reader has to leave the essay to understand what they argue and why they matter.

The essay is dense by design, but density should reward attention, not punish it. The goal is to surface contextual knowledge at the point of need without breaking reading flow.

## Design

A single annotation component with three modes, sharing a visual pattern (dashed underline + popover on interaction) but sourcing content differently.

### Three Annotation Modes

**1. Term Definition**
For domain-specific vocabulary. Dashed underline on the term. Hover/tap reveals a short definition (1–3 sentences).

- Content source: author-defined, stored in a companion data file
- Example: "Valley of Death" → "The gap between research demonstration and commercial viability where promising technologies fail to transition into products. Named by analogy to the military term for exposed terrain between two defensible positions."
- Example: "mētis" → "James C. Scott's term (from Greek) for the practical, contextual knowledge that comes from experience rather than formal rules. The craftsman's feel for the material, the farmer's read on the soil."

**2. Reference Summary**
For citations of papers, books, and reports. Dashed underline on the citation or title. Hover/tap reveals a structured summary: title, author(s), year, and 2–4 sentences capturing the core argument and why it matters in context.

- Content source: AI-generated at authoring time, reviewed and edited by author, stored in companion data file
- Example: "Branscomb and Auerswald (2003)" → structured card with title, key argument (funding gap is the primary barrier to tech transfer), and a note on why it matters here (this is the canonical diagnosis the essay argues against)
- Example: "*Seeing Like a State*" → title, Scott's central thesis (legibility projects enable state management but destroy local adaptive capacity), and why the essay invokes it (TRL is a legibility project applied to R&D)

**3. Enriched Link**
For external URLs where a preview adds value. Dashed underline on the link text. Hover/tap reveals title, source, and a brief description of what the reader will find.

- Content source: author-curated metadata in companion data file (not live URL previews — too unreliable)
- Example: link to the MLSys 2023 paper → title, authors, venue, one-line summary of the finding
- Fallback: for links where a preview doesn't add value, just render as a normal link with no annotation

### Visual Design

All three modes share the same interaction pattern:

- **Indicator:** dashed bottom border, `1px dashed var(--accent)` (subtle but visible)
- **Popover:** appears on hover (desktop) or tap (mobile). Warm card surface (`var(--bg-warm)`), subtle border (`var(--border-mid)`), soft shadow. Max-width ~360px.
- **Typography:** popover body in DM Sans (structural/informational, not prose). Term being defined in bold. Source titles in italic.
- **Positioning:** popover appears above or below the term depending on viewport space. Arrow/caret pointing to the term.
- **Dismiss:** mouse-leave on desktop, tap-outside on mobile. No close button needed if dismiss behavior is reliable.

### Why Not Hover-Only

Hover doesn't exist on touch devices. The interaction model is really a popover (tap to open, tap elsewhere to close) with a hover shortcut on desktop. This means:

- The component needs to manage open/closed state
- Only one popover open at a time (opening a new one closes the previous)
- Popovers must handle viewport edge detection (don't overflow off-screen)
- On mobile, the dashed underline is the only affordance — it needs to look tappable

### Mobile Considerations

- Popover width constrained to `min(360px, calc(100vw - 2rem))`
- Popover appears centered below the term on narrow viewports (no left/right positioning logic needed at small sizes)
- Touch target for the annotated term should meet minimum 44px tap height (the text line-height likely handles this, but verify)

## Content Architecture

### Companion Data File

Annotations live in a YAML or JSON file alongside the MDX, not inline in the prose. This keeps the MDX clean and the annotation layer separable.

```
src/content/writing/
├── valley-of-death.mdx           # Essay prose (unchanged)
├── valley-of-death.annotations.yaml  # Annotation data
```

The annotation file maps terms/references to their content:

```yaml
terms:
  - term: "Valley of Death"
    pattern: "valley of death"  # case-insensitive match (first occurrence only, or all?)
    definition: |
      The gap between research demonstration and commercial viability
      where promising technologies fail to transition into products.

references:
  - key: "branscomb-2003"
    pattern: "Branscomb and Auerswald"
    title: "Between Invention and Innovation"
    authors: "Lewis M. Branscomb, Philip E. Auerswald"
    year: 2003
    summary: |
      Canonical articulation of the "funding gap" diagnosis. Argues that
      the primary barrier to technology transfer is insufficient capital
      at the transition point between research and commercialization.
    context: |
      This is the diagnosis the essay argues against — empirically weak
      but deeply embedded in policy thinking.

links:
  - key: "olechowski-2020"
    pattern: "Olechowski and colleagues"
    url: "https://..."
    title: "Technology readiness levels: Shortcomings and improvement opportunities"
    source: "Systems Engineering, 2020"
    summary: |
      Empirical study surveying practitioners across seven organizations.
      Identified fifteen critical shortcomings of TRL, top-ranked being
      inability to assess integration maturity or parallel development paths.
```

### Why a Companion File, Not Inline MDX Components

Inline components like `<Term def="...">Valley of Death</Term>` clutter the prose. The essay currently reads as clean Markdown with occasional island imports. Annotations are metadata *about* the prose, not part of it — they belong in a parallel data structure.

The companion file also enables:

- Reuse across essays (shared glossary terms)
- Batch generation of reference summaries (run an agent over the annotation file)
- Diff-friendly editing (annotation changes don't touch the essay source)

### Matching Strategy

Two options for how annotations bind to essay text:

**Option A: Pattern matching at build time.** A remark/rehype plugin scans the MDX AST, matches patterns from the annotation file, and wraps matched text in annotation components. The author controls which terms get annotated by what's in the YAML — no MDX changes needed.

- Pro: MDX stays completely clean. Adding annotations is purely additive.
- Con: Pattern matching can be fragile (partial matches, false positives). Need rules like "first occurrence only" or "only in body text, not headings."

**Option B: Explicit markers in MDX.** A lightweight syntax (perhaps `{== Valley of Death ==}` or a custom directive) marks annotatable terms. The plugin resolves the marker against the annotation file for content.

- Pro: Author has precise control over which occurrences get annotated.
- Con: Adds syntax to the MDX. More editing friction.

**Recommendation:** Start with Option B (explicit markers). The author control is worth the small syntax cost, especially since some terms appear multiple times and you'll want to annotate only the first or most contextually relevant occurrence. Pattern matching can be added later as a convenience layer.

## Implementation Approach

### Component: `Annotation.tsx`

A single React island component. Lives in `src/components/islands/shared/` since it's cross-essay infrastructure, not essay-specific.

Props:
- `mode`: `"term"` | `"reference"` | `"link"`
- `content`: the popover content (definition text, or structured reference data)
- `children`: the inline text being annotated

Handles:
- Hover (desktop) → show popover
- Click/tap (mobile) → toggle popover
- Viewport-aware positioning
- Dismiss on outside click/mouse-leave
- Only-one-open-at-a-time (via a lightweight context or DOM event)

### Build Pipeline

A remark plugin (`remark-annotations`) that:

1. Reads the companion `.annotations.yaml` for the current essay
2. Finds explicit markers in the MDX (or pattern-matches, depending on chosen strategy)
3. Replaces them with `<Annotation mode="term" content={...}>matched text</Annotation>`
4. The Annotation component hydrates via `client:visible` like other islands

### Generating Reference Summaries

At authoring time, not build time or render time. The workflow:

1. Author adds a reference entry to the YAML with `key`, `pattern`, `title`, `authors`, `year`
2. Author runs a generation script (or asks an agent) that reads the reference metadata and produces a `summary` and `context` field
3. Author reviews and edits the generated summary
4. Summary ships as static data — no runtime API calls

This keeps the site fully static while leveraging AI for the tedious part (reading papers and writing concise summaries). The author remains the editor — AI drafts, human approves.

## Phasing

### Phase 1: Foundation
- Build the `Annotation` component (term mode only)
- Build the remark plugin for marker resolution
- Define the YAML schema
- Annotate 5–8 key terms in Valley of Death as proof of concept
- Verify: mobile tap behavior, viewport positioning, no layout shift

### Phase 2: References
- Extend component to reference mode (structured card layout)
- Generate summaries for all VoD citations (~15 references)
- Author review pass on generated summaries
- Verify: card layout at various content lengths, mobile rendering

### Phase 3: Enriched Links
- Extend component to link mode
- Curate link metadata for external URLs in VoD
- Verify: links still function as links (annotation is additive, not a replacement for navigation)

### Phase 4: Generalize
- Extract shared glossary terms into a site-wide annotations file
- Apply annotation system to other essays where appropriate
- Consider: should the `/writing` index surface a glossary page?

## Open Questions

1. **First occurrence only, or every occurrence?** Annotating every "Valley of Death" in the essay would be noisy. First occurrence is conventional, but sometimes the most important occurrence is later in the text. Explicit markers solve this but add authoring burden.

2. **Popover or sidebar?** The current design assumes popovers. An alternative: a margin-note style (Tufte-inspired) where annotations appear in the right margin on wide viewports and collapse to popovers on narrow ones. This would be more ambitious but potentially better for dense essays.

3. **Annotation density.** How many annotations per section before it becomes distracting? Need to establish a feel for this during Phase 1 prototyping.

4. **Cross-essay references.** If the VoD essay references a concept explained in the Scholion essay, should the annotation link to that essay? This starts to build a hypertext layer across the site.

5. **Accessibility.** Popovers need proper ARIA attributes (`aria-describedby`, `role="tooltip"` or `role="dialog"`). Keyboard navigation: focusable trigger, Escape to dismiss. Screen reader announcement of popover content.
