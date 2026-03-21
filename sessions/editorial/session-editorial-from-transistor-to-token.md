# Session Prompt: Editorial Pass — from-transistor-to-token.mdx

## Situation

From Transistor to Token (2026-03-12) is 9 days old and technically precise. The voice is strongest in the forensic silicon-layer sections and weakens in transitions and the conclusion, where it retreats into hedging and speculation. Several discrete tics to fix.

## Mission

Remove hedging in transitions and conclusion. Fix clichés. Tighten one redundant section opening. Clarify one ambiguous claim.

## File

`src/content/writing/from-transistor-to-token.mdx`

## Specific Edits

### AI Tic Removal

1. **"This is the conceptual hinge of the entire system-level story"** — Redundant with the section heading. Delete the entire sentence or merge into the following paragraph.

2. **"crystallizes"** (re: Gupta's framing) — Hedging word. Replace: "Gupta frames it directly" or "Gupta puts it plainly."

3. **"happen to fit the constraints Apple's silicon imposes"** — Passive hedging. Tighten: "Models either fit its constraints or they don't."

4. **"The smaller dense models punch above their weight"** — Cliché. Replace with the concrete claim: cite the actual benchmark number.

5. **"Whether that matters depends on two open questions"** — Generic transition. Replace: "The M5 Max's advantage rests on two conditions."

### Structural Tightening

1. **Two Regimes section opening (lines 78–88)** — The prefill/decode distinction is stated twice: once as the "conceptual hinge" framing, then again with the MacStories benchmarks. The benchmarks are necessary; the framing is redundant. Delete the "conceptual hinge" sentence and lead directly into the data.

2. **Inference machine thesis (lines 156–158)** — "Three sentences stating 'we have no proof but it's all consistent'" is hedging. Either delete and let the evidence speak, or move to a footnote.

### Passive Voice / Abstraction

1. **"which wastes most of it"** (re: CoreML overhead) — The agent of waste is unmarked. Replace: "CoreML's overhead wastes most of it."

2. **"moved the bottleneck from compute to memory"** — Abstracted agency. Replace: "As inference workloads scaled, the bottleneck shifted from compute (training-time) to memory bandwidth (inference-time)."

3. **"the human's specification of what the system should optimize — the design of the experimental environment rather than the running of experiments within it"** — The two halves say the same thing. Compress: "the human's experimental design — what metrics matter, which constraints to impose, what the system optimizes for."

### Factual Clarification

1. **Seed-swap overfitting example** — "the agent's 'improvement' was changing seed 42 to 137." Is this a documented incident or a hypothetical? If real, cite the source. If hypothetical, reframe: "Potential failure mode: the agent could optimize away actual progress by changing random seeds rather than architecture."

2. **"whether Apple can exceed the 2× Max formula for the first time"** — Ambiguous (2× what?). Specify the metric and period: "whether Apple can exceed the 2× GPU core doubling that defined M2→M5."

### Voice in Conclusion

The final three paragraphs (lines 289–296) retreat from the forensic voice that makes the essay strong. The voice becomes speculative ("Whether that matters depends on...") and hopeful ("The architecture is in place. The software is catching up."). Rewrite the conclusion to maintain the analytical voice. State what the evidence shows, what remains unknown, and what would change the picture — without hedging or hope.

## Constraints

- Do not modify any React island component files or annotation YAML
- Do not change frontmatter date
- Preserve all import statements, component placements, and annotation markers
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] Five tic passages addressed
- [ ] "Conceptual hinge" redundancy removed
- [ ] Inference machine thesis tightened
- [ ] Three passive voice instances activated
- [ ] Seed-swap example clarified (documented vs. hypothetical)
- [ ] Conclusion rewritten in analytical voice
- [ ] `npm run build` passes clean
