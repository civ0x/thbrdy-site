# Scholion — Project Status

**Last updated:** 2026-02-24
**Current phase:** Phase 0 (Orient & Scope)

## Phase 0 Progress

- [x] Project directory initialized with governance docs (CLAUDE.md, STATUS.md, DECISIONS.md)
- [x] Annotation schema formalized (`schema.yaml`)
- [x] First extraction prototype: Chen et al. (2025) mortality predictors section (14 claims)
- [x] Second extraction: Chen et al. (2025) symptom chronology & clinical course (11 claims)
- [x] Schema failure log: 6 documented failures across both extractions
- [x] Extraction notes with time estimates, process observations, and schema revision recommendations
- [x] Reconcile schema.yaml with session prompt template (DEC-004 — schema v0.2)
- [x] Literature scan + competitive landscape: `literature-scan-feb2026.md`
- [ ] Select 3-5 papers for Phase 1 annotation across domains
- [ ] Essay 2 ("The Circuitry of Science") — deferred until extraction prototype validates cross-domain framing

## Phase 0 Exit Criteria

- [x] Repository exists
- [x] Schema is documented
- [ ] Papers are selected
- [x] Annotation format is specified
- [x] A single section has been extracted end-to-end in the final format
- [x] Multiple argument types extracted (statistical/regression + Kaplan-Meier/negative finding)
- [x] The result is concrete enough to pitch to a potential annotator

## What Exists

- `schema.yaml` — canonical annotation template, v0.2, 17 fields per claim
- `extractions/chen2025-mortality-predictors.yaml` — 14-claim extraction of the mortality predictors analysis from Chen et al. (2025). Validates schema on regression-based statistical arguments in clinical medicine
- `extractions/chen2025-symptom-chronology.yaml` — 11-claim extraction of the symptom chronology and clinical course argument. Tests schema on negative findings (Kaplan-Meier), cross-study comparison reasoning, and annotator-synthesized structural observations. Cross-references method.1 and method.2 from mortality extraction
- `extractions/chen2025-schema-failures.yaml` — 6 documented schema failure modes with severity ratings and resolution proposals
- `extractions/chen2025-extraction-notes.md` — Process observations, time estimates, decisions made during extraction, and schema revision recommendations for Phase 1
- `literature-scan-feb2026.md` — competitive landscape and literature scan covering Elicit, argument mining benchmarks, Toulmin+LLM research, safety case frameworks (Anthropic RSP v3.0, UK AISI, Jan 2026 template framework), citation graph tools, and ARC/MATS output. Includes gap analysis table showing Scholion's distinctive territory
- Governance docs: CLAUDE.md, STATUS.md, DECISIONS.md

## What Does Not Exist

- No extraction code or pipeline
- No graph database or storage layer
- No web interface or visualization
- No LLM-assisted extraction tooling
- No inter-annotator agreement data (requires second annotator — Phase 1)
- No cross-document dependency mapping

## Next Steps

1. Select Phase 1 paper corpus (3-5 papers across domains). Literature scan recommends: interpretability papers (Toy Models of Superposition, Scaling Monosemanticity) as high-value safety case feedstock, plus Khan Ch. 3-4 as familiar territory
3. Begin identifying potential annotators — the Chen extractions (25 claims, two argument types, with schema failures documented) are the pitch artifact. ArgMining 2026 dataset submission is a publication incentive for collaborators
4. Execute essay 2 session prompt — gate condition met (extraction prototype validates cross-domain framing). Literature scan provides positioning context: safety case maturation + competitive gap analysis
