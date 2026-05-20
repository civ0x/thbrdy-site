---
project: silicon-golem
shape: outcome-reframe
agentRelevance: partial
tagline: Writing the map is what makes a deferral different from a debt
questions:
  - "Tell me about something important you decided not to ship."
  - "How do you decide which verification layers are worth their cost in an agent system?"
  - "What's an example of writing the map of a known-unknown rather than building it?"
handles:
  - "Walk me through an eval architecture where you consciously didn't build a layer."
  - "How do you decide where prompt-side constraints suffice and where you need a hard programmatic gate?"
  - "Tell me about a design doc that did real work."
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

When you're shipping a system a child will use, verification is a real question — the kid can't tolerate a hallucinating bot the way a developer can. I'd specified four verification layers in ADR-004: AST validation, sandboxed execution, pre-execution simulation against a world-state model, and post-execution comparison of expected vs. actual block positions. By v1 I'd shipped two and a half — strong at the syntax level, nothing at the semantic level — and I had to decide whether to call that done.

## Punchline

The reframe was that "incomplete" and "undocumented" are different conditions, so ADR-004 explicitly lists each deferred item, the specific reason for deferral (implementation cost, and the fact that a half-built simulator's divergence bugs would be worse than the silent failures it'd catch), and a revisit trigger written as a behavioral observation — which converts a half-built system into a known-unknown with a documented path to closure.

## Arc beats

- Field measure: a "complete" verification architecture would catch syntax errors (AST), runtime errors (sandbox), structural mismatches (pre-execution simulation), and semantic mismatches (post-execution state comparison). All four together.
- Actual outcome: v1 shipped AST validator + restricted sandbox + error-personality translation, but zero semantic verification. An off-by-one in coordinates succeeds at the protocol level and the system doesn't notice the wall is crooked. The challenge agent's concept targeting is prompt-constrained but not programmatically gated.
- Reframe move: ADR-004's "Deferred to v2" subsection isn't a punt. Each deferred item names (a) what's missing, (b) why the cost is high relative to v1 validation goals, (c) the failure mode a half-built version would introduce, and (d) a concrete revisit trigger keyed to a behavioral observation ("if playtesting reveals silent failures, start with block-count validation before coordinate-level").
- The challenge-agent verification gap is flagged as most concerning and likely-first to implement — because the cost is small (one orchestrator-level check calling `get_concept_readiness()` before dispatch) and the failure mode is catastrophic (kid sees code with unknown constructs).
- The reframe isn't "we shipped enough" — it's "the verification we built fits the v1 validation goal, and the verification we didn't build is a documented known-unknown with a trigger for closure."
- Lesson: in a multi-layer eval architecture, the right question isn't "did we build the complete spec?" — it's "did we build the layers that pay for themselves now, and did we leave a map for the rest?" Writing the map is what makes a deferral different from a debt.

## Verify

- [VERIFY] `DECISIONS.md` ADR-004 §"Implementation Status" — the explicit "Implemented in v1" / "Deferred to v2" / "Revisit Triggers for Deferred Items" structure.
- [VERIFY] ADR-004 deferred items: pre-execution simulation (cost: building a world-state simulator; risk: simulator-divergence bugs); world state validation (cost: inferring expected outcomes from generated code; revisit: start with block-count before coordinate-level); challenge agent verification (the most concerning gap; smallest fix — programmatic gate calling `get_concept_readiness()`).
- [VERIFY] The "strong at syntax level, absent at semantic level" framing appears in `essay/SKELETON.md` §07 and `essay/HANDOFF_THBRDY_SITE.md` open question 6. Confirm it's mine and consistent with ADR-004 language before using verbatim.
- [VERIFY] Sandbox: ADR-004 says restricted `__builtins__` (no `eval`, `exec`, `open`, `__import__`), only SDK functions injected, AST validation pre-execution. Sandbox is described as "partial" because there's no dry-run against simulated world state.
