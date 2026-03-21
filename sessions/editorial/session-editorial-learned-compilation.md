# Session Prompt: Editorial Pass — learned-compilation.mdx

## Situation

The Learned Compilation essay ("ML Compilers Are Leaving 15–30% of Training Throughput on the Table," 2026-02-17) is technically strong with a clear voice. The editorial pass is lighter — targeted tic removal, one structural tightening, and one logical gap to address.

## Mission

Strip discrete AI tics, tighten one section that drags, and address one unjustified threshold.

## File

`src/content/writing/learned-compilation.mdx`

## Specific Edits

### AI Tic Removal

1. **"despite mounting evidence that the interaction effects between these passes are large enough to matter at scale"** — Soft hedge masquerading as evidence. Flip emphasis. Lead with the empirical claim: "The interaction effects between them yield 12–273% speedups in joint optimization (cited below), yet this sequential approach remains standard."

2. **"Sizing the opportunity" heading** — Generic business-speak. Replace with something concrete: "The Coupling Problem" or "Quantifying the Coupling."

3. **"The counterargument deserves respect"** — Throat-clearing. Lead with what the counterargument actually is (hierarchical decomposition might capture most benefit without joint optimization), state why it's worth taking seriously (Alpa works well), then reframe: "The empirical question is whether that gap matters at training scale."

4. **"Organizations currently hoard identical GPU SKUs"** — "Hoard" substitutes attitude for mechanism. Tighten: "Organizations procure identical GPU SKUs because the compilation cost of mixed hardware exceeds the utilization benefit."

### Structural Tightening

1. **Evidence for learnability section** (the paragraph listing MLGO, GO, TVM Ansor, GNN scheduling) — Currently reads as a procedural list of observations rather than a structured argument. Restructure as a chain of inferences: "Learnability hasn't been tested at scale on all four decision spaces jointly, but three lines of evidence predict it's worth testing." Then connect each piece to *why it matters for this specific problem*. Show the convergence, don't just catalog it.

2. **"Why I'm working on this" section** — Currently does two things: personal background + broader thesis about infrastructure lag. Neither is developed enough. Either expand the infrastructure lag thesis into a structural argument, or truncate to a single-sentence author note and let the technical argument carry the essay.

### Logical Gap

1. **Kill threshold of 5%** — "Validated if pairwise joint optimization yields >5% throughput improvement over sequential passes. Killed if coupling is consistently below 5%." Why 5%? What's the economic hurdle rate? At what speedup does an org actually run your compiler instead of sticking with XLA? Add a brief justification (one sentence) tying the threshold to the economics of recompilation.

### Factual Check

- "The community working on learned compiler optimization is exceptionally small — perhaps a dozen groups worldwide." Verify this is still accurate. If a major group has announced a learned compiler initiative since Feb 2026, update.
- "No existing system learns a joint policy across all four decision spaces." Verify no preprint has changed this.

## Constraints

- Do not modify any React island component files
- Do not change frontmatter date
- Preserve all import statements and component placements
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] All four tic passages have been addressed
- [ ] Evidence section restructured as inference chain
- [ ] 5% threshold justified
- [ ] "Why I'm working on this" either expanded or truncated
- [ ] `npm run build` passes clean
