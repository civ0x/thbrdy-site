# Scholion — Project Status

**Last updated:** 2026-02-24
**Current phase:** Phase 0 (Orient & Scope)

## Phase 0 Progress

- [x] Project directory initialized with governance docs (CLAUDE.md, STATUS.md, DECISIONS.md)
- [x] Annotation schema formalized (`schema.yaml`)
- [x] First extraction prototype: Chen et al. (2025) mortality predictors section
- [ ] Literature scan: Feb 2026 landscape changes (Elicit, argument mining, structured extraction)
- [ ] Competitive landscape update (Ought/Elicit, ARC, Anthropic tooling, MATS/SERI output)
- [ ] Select 3-5 papers for Phase 1 annotation across domains
- [ ] Essay 2 ("The Circuitry of Science") — deferred until extraction prototype validates cross-domain framing

## Phase 0 Exit Criteria

- [x] Repository exists
- [x] Schema is documented
- [ ] Papers are selected
- [x] Annotation format is specified
- [x] A single section has been extracted end-to-end in the final format
- [x] The result is concrete enough to pitch to a potential annotator

## What Exists

- `schema.yaml` — canonical annotation template with 14 fields per claim
- `extractions/chen2025-mortality-predictors.yaml` — 14-claim extraction of the mortality predictors analysis from Chen et al. (2025), a systematic review of COVID-19-induced acute pancreatitis. Validates schema on a non-AI domain (clinical medicine)
- Governance docs: CLAUDE.md, STATUS.md, DECISIONS.md

## What Does Not Exist

- No extraction code or pipeline
- No graph database or storage layer
- No web interface or visualization
- No LLM-assisted extraction tooling
- No inter-annotator agreement data (requires second annotator — Phase 1)
- No cross-document dependency mapping

## Next Steps

1. Literature scan and competitive landscape update
2. Select Phase 1 paper corpus (3-5 papers across domains)
3. Begin identifying potential annotators — the Chen extraction is the pitch artifact
4. Execute essay 2 session prompt once extraction prototype is reviewed
