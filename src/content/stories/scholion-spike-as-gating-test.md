---
project: scholion
shape: design-decision
agentRelevance: agent
tagline: A gating test only gates if you refuse the harness around it
questions:
  - "How do you decide what to build vs. what not to build when you're testing whether an agentic approach will work?"
  - "Tell me about a time you resisted scope creep in an early-stage project."
  - "What's your process for figuring out if an idea is worth investing in?"
handles:
  - "I scoped a spike as a gating test, not the first step of a pipeline. The session prompt has a 'What NOT to do' block that's longer than the build spec."
  - "The hardest discipline in agentic-systems work is keeping a one-shot experiment from accreting into a pipeline before you know if the thing works."
  - "Manage to cost, not capacity — at the prompt level. The constraint on what the executor is allowed to build is the design call; the script is what falls out."
---

## Project orientation

Scholion is a system I'm building that extracts the dependency structure of arguments from research papers as machine-tractable graphs — atomic claims, the warrants connecting them, typed edges between them, and which nodes are load-bearing. The substrate is Anthropic structured outputs with Pydantic v2; the gating test is whether the extraction matches a trained human annotator's structural picture.

## Opener

"I needed to know whether the methodology was worth investing in before building any pipeline around it. So I wrote a session prompt for one specific thing — a one-shot Python script that sends a single paper section through structured outputs and compares the extraction to a 14-claim human-annotated ground truth. The interesting part of the prompt isn't the build instructions, it's the 'What NOT to do' section at the bottom: no pipeline, no retry loop, no database schema, no web interface, don't install `instructor`, and explicitly *do not over-engineer the system prompt — write a solid first pass and learn from the gap*. The constraint is the design call. The script is what falls out of it."

## Punchline

A gating test is only a gate if you refuse to build the harness around it before it passes — otherwise the harness is the project and the test is decoration.

## Arc beats

- Context: I had two manually-annotated extractions, a documented 6-mode schema failure log, and a schema I was nervous about. The question was whether structured-output extraction could match the topology of a trained annotator's graph — a binary gating decision.
- Constraint: I'd watched myself and other people pour weeks into pipelines for ideas that should have been spiked in an afternoon. The shape of the answer dictates how much you should build to get it.
- Choice: a single Python script with three components — Pydantic v2 models mirroring the schema, one call to `client.messages.parse()`, and a hard-coded evaluation against the YAML ground truth. Success criteria written in advance: >70% structural edge match counts as build-forward signal; 40–70% as ambiguous; <40% as pivot.
- The "What NOT to do" block is the artifact that does the work. It names six concrete temptations and prohibits each one. "Do not build a pipeline, harness, or retry loop — this is a one-shot spike."
- Tradeoff named: a one-shot test gives you variance-of-one data. I made it explicit — DEC-012 documents that "consistency across runs (single one-shot test, no variance data)" is a thing the spike *did not* establish, even though it passed.
- Outcome: 75% structural path match, 14/14 claim recall, 2/2 cruxes on first pass. Strong signal. DEC-012 captured the decision to build forward and named four specific things the spike does not establish.
- Lesson: scope discipline is encoded in the prompt's prohibitions, not in its instructions. The session prompt's "What NOT to do" is the equivalent of a constraint in a system prompt — it's what keeps the executor honest about the experiment's actual question.

## Verify

- [VERIFY] `session-cc-extraction-spike.md` "What NOT to do" block — confirmed verbatim: "Do not build a pipeline, harness, or retry loop — this is a one-shot spike," plus prohibitions on database schema, web interface, over-engineering the system prompt, and installing `instructor`.
- [VERIFY] Success-criteria thresholds (>70% strong, 40–70% ambiguous, <40% pivot) — confirmed in `session-cc-extraction-spike.md` §"Success criteria".
- [VERIFY] `DECISIONS.md` DEC-012 "Extraction spike passed — build forward on automated extraction" — confirmed, dated 2026-02-26. The "What this does NOT establish" section explicitly names: cross-domain generalization, consistency across runs, inter-annotator agreement, complex argument structures.
- [VERIFY] The script itself (`extraction_spike.py`) — confirmed one file, ~120 lines model code visible at head, no retry loop, no pipeline framing.
- [CONJECTURE] that the original temptation to over-build was real for me on this specific project — be honest about it if pressed: I drafted the prompt twice; the first version had a pipeline-shaped harness that I cut before sending it to the executor.
