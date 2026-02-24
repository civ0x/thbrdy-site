# Scholion — Decision Log

Decisions are logged as they're made. Each entry records the decision, the reasoning, the alternatives considered, and what would cause a revisit.

---

## DEC-001: Annotation format — YAML over JSON

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Use YAML for extraction files and schema definition.
**Reasoning:** YAML supports inline comments (annotator notes on individual fields), multiline strings without escaping (verbatim claim text, warrants), and reads more naturally for a task that is fundamentally human annotation work. JSON is better for machine interchange but Phase 0-1 is manual annotation, not pipeline output.
**Alternatives considered:** JSON (better tooling, stricter validation), Markdown tables (too flat for nested structure), custom DSL (premature).
**Revisit if:** Phase 2 pipeline needs strict schema validation — at that point, add a JSON Schema or Pydantic model that validates the YAML, rather than switching formats.

---

## DEC-002: Schema uses Toulmin as starting framework

**Date:** 2026-02-24
**Phase:** 0
**Decision:** The annotation schema is organized around Toulmin's argument model (claim, data/evidence, warrant, backing, qualifier, rebuttal) extended with dependency typing and graph-oriented fields (depends_on, crux, status).
**Reasoning:** Toulmin provides the most complete single-argument decomposition available. The five dependency types (causal, conditional, purposive, contrastive, conjunctive) come from the methodology docs' exploration of how claims relate across a document. The IN/OUT status tracking comes from Doyle's Reason Maintenance Systems.
**Alternatives considered:** Dung's abstract argumentation (too focused on attack/defeat, misses support structure), AIF/argument interchange format (too heavy for manual annotation), pure propositional logic (loses the warrant/backing layer that makes implicit reasoning explicit).
**Revisit if:** Phase 1 manual annotation reveals that Toulmin categories don't carve real arguments well — particularly if warrants and backings prove consistently indistinguishable in practice, or if the dependency types don't cover recurring patterns.

---

## DEC-003: First extraction target — non-AI domain (clinical medicine)

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Use Chen et al. (2025) COVID-19-induced acute pancreatitis systematic review as the first extraction, rather than Khan thesis or an AI safety paper.
**Reasoning:** Tests whether the schema generalizes beyond AI safety. A medical systematic review has a different argument structure (statistical evidence, inclusion criteria, regression models) than theoretical AI safety arguments. If the schema works here, it's more credibly general. Also produces a concrete artifact for the second essay's cross-domain framing.
**Alternatives considered:** Khan Ch. 3-4 (familiar territory but doesn't test generality), an interpretability paper (high-value domain but extraction complexity may be too high for a first test).
**Revisit if:** The medical extraction reveals the schema is heavily biased toward theoretical arguments and can't represent statistical/empirical structure well. If so, the schema needs revision before claiming generality.

---

## DEC-004: Schema.yaml vs session prompt template — reconciliation plan

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Extractions use schema.yaml format for consistency with the first prototype. The session prompt template proposes additional fields that should be selectively incorporated into schema v0.2 before Phase 1 begins.
**Reasoning:** The mortality extraction committed to schema.yaml format. The chronology extraction maintained consistency. Switching formats mid-extraction would create two incompatible datasets. However, three session prompt fields address real schema failures documented in chen2025-schema-failures.yaml: (1) `confidence` (high/medium/low) — addresses SF-001, the weighted support problem; (2) `external_anchor_type` (foundational/contextual) — critical for invalidation propagation; (3) `claim_source` (not in either template, proposed from SF-002) — distinguishes author-asserted from annotator-synthesized claims. The session prompt's nested structure (toulmin.grounds, crux.flip_test) is cleaner for reading but harder for YAML editing; the flat schema.yaml structure is better for manual annotation. The session prompt's `glue_words` field is useful for learning but redundant once dependency_type is assigned.
**Alternatives considered:** (a) Rewrite both extractions in session prompt format (wasted effort, existing format works), (b) keep schema.yaml unchanged and rely on notes fields (loses machine-queryability), (c) merge the best of both into schema v0.2 (chosen).
**Revisit if:** Phase 1 annotator feedback reveals the flat structure is too confusing, or the nested structure is actually easier for human annotators.

---

## DEC-005: Extraction unit — argument block, not paper section

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Each extraction file covers one coherent argument block, which may span multiple paper sections. The chronology extraction spans Sections 3.3, 3.5, 3.7, and parts of the Discussion.
**Reasoning:** Arguments don't respect section boundaries. The mortality predictors argument flows from Methods through Results Table 3 to Discussion. The chronology argument flows from Symptoms through Imaging through Survival Outcomes to Discussion. Extracting by section would either (a) artificially split coherent argument chains or (b) force arbitrary decisions about where a claim "belongs." Argument-block scoping keeps the dependency graph connected and the extraction intellectually coherent.
**Alternatives considered:** Section-by-section extraction (cleaner file boundaries but incoherent argument chains), full-paper extraction (too large for a single file, mixes independent argument threads), claim-chain extraction (too granular — a single chain like "AST/ALT → mortality" would be too narrow to test the schema).
**Revisit if:** Cross-paper extractions in Phase 1 reveal that argument-block scoping creates ambiguity about which extraction a shared claim belongs to.

---

<!-- Template for new decisions:

## DEC-NNN: [Short title]

**Date:** YYYY-MM-DD
**Phase:** N
**Decision:** [What was decided]
**Reasoning:** [Why this, specifically]
**Alternatives considered:** [What else was on the table]
**Revisit if:** [What conditions would reopen this decision]

-->
