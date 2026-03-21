# Editorial Campaign: AI Tic Review + Full Pass

Created: 2026-03-21

## Overview

Full editorial pass across all published essays on thbrdy.dev. Each session prompt is self-contained and follows the standard execution protocol:

> Read `CLAUDE.md`, `STATUS.md`, and `[session-prompt-filename].md`, then execute.

## Execution Order (recommended)

Ordered by effort level — heaviest lifts first, lightest last. Each session is independent; order is a suggestion, not a dependency.

### Heavy Lift (structural changes + tic removal)
1. `session-editorial-scholion.md` — Superseded by Circuitry; needs forward-link, validation rewrite, section compression
2. `session-editorial-notice-vision.md` — Draft → publish gate; hedging, redundancy, timeline verification
3. `session-editorial-valley-of-death.md` — Amazon case redundancy, missing synthesis, soft phrasings

### Medium (targeted tightening)
4. `session-editorial-notice.md` — Opening voice mismatch, 11 tic passages, structural bridge
5. `session-editorial-learned-compilation.md` — Evidence restructuring, threshold justification, section decision
6. `session-editorial-circuitry-of-science.md` — Meta-signposting, section redundancy, factual verification
7. `session-editorial-the-wrong-axis.md` — Hedging qualifiers, section headings, transition tightening
8. `session-editorial-from-transistor-to-token.md` — Conclusion voice, tics, factual clarification

### Light Polish
9. `session-editorial-coregulation.md` — Opening voice, two timeline updates, soft qualifiers
10. `session-editorial-ab-essay.md` — Handful of soft qualifiers, one section tightening
11. `session-editorial-trust-topologies.md` — Four micro-edits

## Common Constraints (all sessions)

- Do not modify React island component files
- Do not change frontmatter dates (except notice-vision draft status)
- Preserve all import statements, component placements, annotation markers
- Run `npm run build` after edits to verify clean build
- Match existing prose style (Cormorant Garamond, no bullet points in body text)

## After All Sessions Complete

- Run `npm run build` one final time
- Spot-check each essay in the browser
- Update STATUS.md to reflect the editorial pass
