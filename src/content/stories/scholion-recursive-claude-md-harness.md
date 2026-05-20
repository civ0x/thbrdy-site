---
project: scholion
shape: problem-and-method
agentRelevance: agent
tagline: The three-file launch contract is recursive — sub-projects get their own
questions:
  - "How do you organize agent-mediated work on a long-running project?"
  - "How does the agent find what it needs at the start of a session?"
  - "How do you keep the agent oriented when one project is nested inside another?"
handles:
  - "The three-file launch contract is recursive. Each sub-project under this site has its own CLAUDE.md / STATUS.md / DECISIONS.md — same shape, different scope. The agent's standing orders go where the work goes."
  - "Durable state lives in versioned files. Chat history is perishable; CLAUDE.md is doctrine. The most important thing in an agentic project is the boundary between what's true about this project and what we're doing this hour."
  - "Standing guardrails belong in CLAUDE.md, not in every session prompt. The four Scholion guardrails — don't hallucinate claims, don't infer absent dependencies, don't over-engineer the schema, don't commit to one theoretical framework — are read on every session, not negotiated."
---

## Project orientation

Scholion is a system I'm building that extracts the dependency structure of arguments from research papers as machine-tractable graphs — atomic claims, the warrants connecting them, typed edges between them, and which nodes are load-bearing. The substrate is Anthropic structured outputs with Pydantic v2; the gating test is whether the extraction matches a trained human annotator's structural picture.

## Opener

"When I started Scholion, the project lived inside a larger personal site repo, but Scholion's working state — its schema, its decisions, its phase tracker — wasn't going to fit cleanly into the parent project's documentation. So I gave it its own three-file launch. Inside the sub-project, there's a `CLAUDE.md` that names the schema, the dependency types, the atomicity rules, the standing guardrails — *do not hallucinate claims, do not infer dependencies that aren't structurally present, do not over-engineer the schema, do not commit to a single theoretical framework*. There's a `STATUS.md` that tracks phase, what exists, what doesn't. There's a `DECISIONS.md` with 13 numbered entries. The same three-file launch contract that exists at the root exists here, scoped to this work. The harness is recursive."

## Punchline

Durable agent state lives in versioned files, not in chat history — and when a project contains a sub-project, the sub-project gets its own three-file standing system, not a section in the parent's.

## Arc beats

- Problem framing: a long-running agent-mediated project accretes context faster than chat windows can hold it. The parent repo had its own CLAUDE.md governing site-wide conventions (design tokens, typography, island architecture). Scholion needed its own — different scope, different vocabulary, different decisions.
- The constraint: durable project state lives in versioned documents, not chat history. Session prompts are consumable — used once, not committed. The agent's standing orders live in CLAUDE.md.
- The recursive move: the sub-project gets the same three-file contract as the root — CLAUDE.md (standing orders), STATUS.md (phase + what exists), DECISIONS.md (numbered, dated, with rationale and revisit conditions). The executor agent's launch reads the relevant three files for whatever scope it's operating in.
- Worked example: Scholion's CLAUDE.md names the schema fields by description, the five dependency types with examples, the atomicity rules with rationale, and a "standing guardrails" block — four rules that prevent the most common extraction failures. The next session prompt that runs Scholion work reads this file and inherits all of it without restatement.
- Concrete codification: schema v0.2 lives in `schema.yaml`. Decisions are numbered DEC-001 through DEC-013. STATUS.md tracks Phase 0 complete, Phase 1 entry, the corpus selection. Each artifact has a single source of truth.
- Institutional analog: same shape as a tasking order under a doctrinal command — root doctrine governs the larger enterprise; the sub-element has its own SOP that inherits doctrine and specializes for its mission. The agent reads doctrine + SOP + mission, not a re-derivation of doctrine in every order.
- Lesson: in agent-mediated work that contains sub-projects, the harness has to be hierarchical and recursive — same launch contract at every nesting level. Without it, sub-project context bleeds into the parent's standing orders or gets re-derived per session. With it, the executor inherits exactly the durable state relevant to its current scope and nothing else.

## Verify

- [VERIFY] Scholion `CLAUDE.md` — confirmed exists at `/Users/thomasbrady/scholion/CLAUDE.md`. Contains the "Standing Guardrails" block with the four prohibitions verbatim.
- [VERIFY] The 17 schema fields documented in CLAUDE.md — confirmed against `schema.yaml`.
- [VERIFY] The five dependency types with examples — confirmed in CLAUDE.md "Dependency Types" table.
- [VERIFY] `DECISIONS.md` 13 numbered entries (DEC-001 through DEC-013) — confirmed; DEC-013 is dated 2026-02-26 (Phase 1 paper corpus selection).
- [VERIFY] `STATUS.md` phase tracking — confirmed: "Phase 1 Entry (Spike Passed)" as current phase; Phase 0 exit criteria all checked; Phase 1 entry steps listed.
- [VERIFY] The recursive-harness framing — confirmed in `prep/stories.md` Story 6: "Each sub-project (Scholion lives under `working/scholion/`) gets its own three-file launch contract." Note: the canonical Scholion source-of-truth lives at `/Users/thomasbrady/scholion/`, with a mirror at `thbrdy-site/working/scholion/` for site-essay context. If asked which is canonical, the answer is `/Users/thomasbrady/scholion/`.
