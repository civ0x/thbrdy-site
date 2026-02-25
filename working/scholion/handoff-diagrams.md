# Session Handoff: Diagram Design for The Circuitry of Science

## Where Things Stand

The annotation system for `the-circuitry-of-science.mdx` is complete and reviewed. 32 inline annotations across three modes (definition, reference, enriched link) with hover popovers matching the valley-of-death visual treatment. The prototype is at `prototypes/annotations-preview.html`. Companion data is in `circuitry-of-science.annotations.yaml`. DEC-009 and DEC-018 in `DECISIONS.md` are the canonical specs for the annotation system.

## Next Task

Design and prototype the six diagram components that currently appear as placeholder boxes in the essay. Each placeholder is labeled in the prototype and MDX:

| Placeholder | Location | Complexity | What It Needs to Show |
|---|---|---|---|
| `DecompositionPipeline` | End of Section I | Medium | The three-layer extraction methodology: atomic decomposition → Toulmin reveal → dependency typing. A pipeline/flow showing how prose becomes a typed dependency graph. |
| `ChenDependencyGraph` | End of Section III | High | The actual dependency structure from the Chen extraction — 25 claims across two chains (mortality predictors tree + chronology synthesis). Must show cruxes, selective invalidation, typed edges. This is the core visual demonstration. |
| `SafetyCaseFragment` | End of Section IV | High | A fragment of a safety case rendered as a dependency graph, showing how Scholion's methodology maps to safety case structure. Should connect to the Sabotage Risk Report's Section 7 invalidation table. |
| `SchemaEvolution` | End of Section V | Medium | What worked vs. what didn't in the schema — the six failure modes, the confidence field addition, the claim_source field. Could be a before/after or an annotated schema diff. |
| `CompetitiveGapTable` | End of Section VI | Low | Comparison table: Elicit, Semantic Scholar, scite.ai, safety case frameworks vs. Scholion across capability dimensions (claim decomposition, typed dependencies, warrant extraction, crux identification, invalidation propagation). |
| `Roadmap` | End of Section VII | Low–Medium | Four-phase timeline: Manual annotation → LLM extraction → Graph infrastructure → Reading interface. Each phase with success criteria and kill conditions. |

## Read These First

- `interaction-patterns.md` — Diagram specs, animation conventions, scroll-trigger behavior, the intersection observer pattern
- `DECISIONS.md` — Existing decisions about CSS-only diagrams (no D3/charting libraries), intersection observer for scroll triggers, React island architecture, `prefers-reduced-motion` compliance
- `the-circuitry-of-science.mdx` — The essay prose surrounding each placeholder. Diagram content must emerge from the prose arguments, not illustrate them decoratively
- `.claude/CLAUDE.md` (global) — Site technical conventions: Astro + MDX + React islands, CSS-only layout, design tokens in `shared/tokens.ts`, serif/sans typography split (serif for prose, sans for structural elements)
- `prototypes/annotations-preview.html` — The working annotation prototype, useful as a visual reference for the design language (colors, typography, spacing)

## Recommended Approach

Start with two diagrams at opposite ends of the complexity spectrum to establish the visual language before committing to all six:

1. **CompetitiveGapTable** — Simplest. A styled comparison table. Gets the typography, color tokens, and responsive behavior right without complex layout.
2. **ChenDependencyGraph** — Most complex. The dependency graph is the essay's core visual argument. If this works, the visual language transfers to SafetyCaseFragment and the others.

Prototype as standalone HTML (same approach as the annotation prototype) since the site repo is not in this workspace. The prototypes can be ported to React island components later.

## Design Constraints

- CSS-only layout and animation (no D3, no charting libraries)
- Intersection observer for scroll-triggered reveal
- `prefers-reduced-motion` must disable animations
- DM Sans for all structural/diagram text; Cormorant Garamond only for essay prose
- Color palette: `--accent` (gold), `--teal`, `--blue`, `--text`, `--text-mid`, `--text-light`, `--bg-warm`, `--border-mid`
- Diagrams are structural arguments, not decorative illustrations — every visual element should map to a concept in the prose

## Open Questions

- Whether to prototype all six in one session or iterate on 1–2 first
- Whether the ChenDependencyGraph should be fully interactive (click nodes to see claim details) or static with annotations
- Whether the SafetyCaseFragment reuses the same graph visual language as ChenDependencyGraph or introduces a new notation (GSN-style vs. dependency graph style)
