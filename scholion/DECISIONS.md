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

<!-- Template for new decisions:

## DEC-NNN: [Short title]

**Date:** YYYY-MM-DD
**Phase:** N
**Decision:** [What was decided]
**Reasoning:** [Why this, specifically]
**Alternatives considered:** [What else was on the table]
**Revisit if:** [What conditions would reopen this decision]

-->
