---
project: scholion
shape: design-decision
agentRelevance: agent
tagline: Field descriptions are code the model executes
questions:
  - "Why did you pick structured outputs over function calling or raw text?"
  - "How do you keep the model's instructions in sync with the data contract?"
  - "Where does the abstraction in structured outputs leak?"
handles:
  - "The most-leveraged prompt surface in Scholion isn't the system prompt — it's the description string on the `warrant` Pydantic field. The model reads it on every claim."
  - "Structured outputs are code the model executes. The schema is the contract; the field descriptions are the instructions; same source artifact. That's the cleanest version and also the leakiest."
  - "Schema validity isn't semantic validity. The hardest extraction failures pass the validator cleanly — that's where the verifier-or-eval-rig has to live."
---

## Project orientation

Scholion is a system I'm building that extracts the dependency structure of arguments from research papers as machine-tractable graphs — atomic claims, the warrants connecting them, typed edges between them, and which nodes are load-bearing. The substrate is Anthropic structured outputs with Pydantic v2; the gating test is whether the extraction matches a trained human annotator's structural picture.

## Opener

"The session prompt was explicit about this: *use `Field(description=...)` to encode field semantics — these descriptions get compiled into the constrained decoding grammar and directly affect extraction quality.* I'd been treating Pydantic descriptions as docstring hygiene before this project. Working on Scholion, I realized that the field description on `warrant` — 'the reasoning connecting evidence to claim. Often unstated in the source — reconstruct it if implicit. This is the highest-value extraction target' — is doing two jobs simultaneously: it's a comment for the human reading the schema, and it's an instruction the model reads at decode time. Same string, two consumers, indistinguishable from each other in source."

## Punchline

Structured outputs aren't a passive contract the model satisfies — they're code the model executes, and the field descriptions are the most-leveraged prompt surface in the whole system.

## Arc beats

- Context: 17-field claim schema (Toulmin attributes plus dependency typing plus status / confidence / crux / source). Several enum fields (warrant_type, dependency_type, status, confidence, claim_source). The model has to write objects against this on every claim.
- Constraint stack: (a) extraction has to be reliable enough to graph-compose without per-claim human review; (b) the schema is graph-shaped, not flat — dependencies reference IDs from the same extraction run; (c) the system has to be debuggable when extractions go wrong.
- Three real options. *Raw text + downstream parsing* — maximum latitude, worst debuggability. *Function calling with loose JSON* — `Dict[str, Any]` permissive shape, defers schema errors to runtime. *Strict structured outputs + Pydantic v2* — typed contract, validation at the boundary, field descriptions doubling as model instructions.
- Choice: Pydantic v2 with `Field(description=...)` on every attribute, enums for every constrained vocabulary (5 dependency types, 3 warrant types, 3 statuses, 3 confidence levels, 2 anchor types, 3 source types). The description on `warrant` is the most important — it's how the model knows what reasoning to surface.
- Tradeoff, named: *structural validity is not semantic validity.* The schema enforces shape, not meaning. A citation can validate and still not exist. The model can fill `warrant` with plausible-looking reasoning that doesn't actually connect the cited evidence to the conclusion. Schema is a soft boundary that looks hard.
- Second tradeoff: *field descriptions are system-prompt-coupled.* A docstring change is silently a prompt change. The schema and the prompt stay in sync by construction — useful — but you lose the bright line between schema versioning and prompt versioning. Useful and dangerous.
- Third tradeoff: *schema evolution requires schema-versioned ground truth.* Every field addition changes model behavior. The eval rig has to support comparing extractions against schema-versioned references, not a single golden file.
- Lesson: structured outputs are the right primitive for production agentic work, but treat the schema as code the model is executing. Field descriptions are first-class context-engineering surface. The eval rig has to live above the schema, not at it — because the schema gives a green light when the producer's behavior changes underneath it.

## Verify

- [VERIFY] The "use `Field(description=...)` to encode field semantics" instruction — confirmed verbatim in `session-cc-extraction-spike.md` §"Pydantic v2 models" intro paragraph.
- [VERIFY] Field count (17) and enum structure (5 dependency types, 3 warrant types, 3 statuses, 3 confidence levels, 2 anchor types, 3 source types) — confirmed in `extraction_spike.py` and `schema.yaml`.
- [VERIFY] The `warrant` field description as the "highest-value extraction target" — confirmed verbatim in `extraction_spike.py` line ~54 and in the session prompt.
- [CONJECTURE] discriminated-union usage — my actual implementation uses simple enums plus `Optional[DependencyType]`, not discriminated unions. If asked about discriminated unions specifically (the portfolio's earlier framing), correct to: "Enums plus optional typing — I considered discriminated unions for the dependency-type-conditional-fields case but the schema didn't push hard enough on it to justify the complexity."
- [VERIFY] The "structural validity ≠ semantic validity" framing is documented in `prep/onebrief-scholion-story-portfolio.md` Story 2 §"Tradeoffs" but the in-Scholion artifact for this is the schema-failures file — `chen2025-schema-failures.yaml` contains 6 documented schema failure modes; spot-check these match the framing before deploying.
