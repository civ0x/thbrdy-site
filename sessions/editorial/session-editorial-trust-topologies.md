# Session Prompt: Editorial Pass — trust-topologies.mdx

## Situation

Trust Topologies (2026-03-04) is the cleanest essay on the site — tight, direct, domain-grounded. This is a polish pass with only a few minor edits. No factual staleness (17 days old, no time-bound claims).

## Mission

Four micro-edits: one filler phrase, one redundant explanation, one passive transition, one soft generalization.

## File

`src/content/writing/trust-topologies.mdx`

## Specific Edits

1. **SDNN description filler** — "reflecting total autonomic variability across both sympathetic and parasympathetic branches" — this describes the meaning of SDNN without advancing the argument. Delete it. Lead with "both measured in milliseconds."

2. **SDNN/RMSSD distinction redundancy** — The distinction is stated three ways in quick succession: (a) "Both are called HRV. Both are measured in milliseconds. A naive implementation puts them in the same field." (b) "SDNN and RMSSD are derived from the same underlying data..." (c) The detailed physiological explanation. Cut (a) — lead directly into (b): "This is a category error. SDNN and RMSSD are derived from the same underlying data — the time intervals between successive heartbeats — but they extract different physiological signals..."

3. **Passive transition** — "In the Claude reflection layer, the system prompt frames these as categorically distinct signals..." — Activate: "The Claude reflection layer enforces the boundary in the system prompt..."

4. **Soft generalization in closing** — "are not specific to biometric sensing or iOS development" — Reframe to active: "These patterns — trust topologies, category error prevention, temporal anchoring, explicit decomposition at crossing points — apply beyond biometrics and iOS development."

## Constraints

- Do not modify any React island component files
- Do not change frontmatter date
- Preserve all import statements and component placements
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] Four edits applied
- [ ] `npm run build` passes clean
