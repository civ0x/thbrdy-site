---
project: silicon-golem
shape: failure-mode
agentRelevance: agent
tagline: The aesthetic gets overridden mechanically — at the boundary, not the prompt
questions:
  - "How do you control a model whose defaults conflict with your goal?"
  - "What's an example of an eval-and-correction loop you've built around an LLM?"
  - "Walk me through your reasoning for using a hard validator vs. prompt-only constraints."
handles:
  - "Tell me about a time you had to override a model's default — and where you put the override."
  - "Walk me through an eval-and-correction loop you built into a runtime agent system."
  - "When have you used a structured rejection with feedback instead of trying to coax the model in its system prompt?"
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

The code-generating agent in this system writes Python that a nine-year-old reads. It's Sonnet, so it has strong Pythonic style preferences and reaches for clean, idiomatic code by default. The problem is that at Level 1 the kid hasn't seen a for-loop yet, so when she asks for a 5×5 floor, the agent's instinct is to write a nested loop — and by every engineering measure that loop is the better answer. By every pedagogical measure I had to reject it.

## Punchline

The fix isn't begging the model in its prompt — it's a hard gate at the boundary: an AST validator (Python stdlib only, allowlist not blocklist) that walks every node against the kid's level, rejects anything not permitted, and the orchestrator retries up to twice with structured constraint feedback ("you used For, not permitted at level 1") before reporting infeasible — so the agent's aesthetic gets overridden mechanically, and the verbose code that survives is exactly what the productive-failure pedagogy needs.

## Arc beats

- Situation: code agent generates Python the kid sees in a side panel; the agent has strong style preferences toward concise idiomatic code.
- Task: keep generated code within the kid's concept ceiling (no for-loops at Level 1, no defs at Level 2) while keeping the agent productive.
- Action surface: where to enforce — prompt only (soft), validator only (hard but blind), both (chosen). Prompt-only is the cheap option and fails on every model upgrade. Validator-only doesn't help the agent self-correct.
- Action — both, with a feedback loop. Validator uses `ast` (stdlib only, allowlist not blocklist — new Python syntax is rejected by default). Rejected code is sent back to the agent with the specific offending node and the permitted set. Two retries, then the orchestrator reports `infeasible` with a `simpler_alternative` field that the chat agent translates into golem-speak.
- Result: at Level 1 the kid sees 25 nearly-identical `place_block` calls with a visible `+0, +1, +2` index pattern — exactly the explicit repetition the productive-failure design needs before introducing loops. Engineering elegance yields to pedagogical appropriateness, deterministically.
- Lesson: when an LLM has an aesthetic that fights your goal, prompt-side mitigation is necessary but not sufficient; you need a hard gate at the boundary and a feedback channel the agent can correct against in real time.

## Verify

- [VERIFY] `golem/validator.py` and `golem/test/test_validator.py` — confirm allowlist-not-blocklist semantics; 76 tests per STATUS.md.
- [VERIFY] `DECISIONS.md` ADR-004 §"Implementation Status" — confirms concept-level gating implemented; orchestrator retries up to 2x with error feedback then reports infeasible.
- [VERIFY] `prompts/code_agent.md` §"Construct Constraints — The Hard Rules" — prompt also lists permitted constructs as soft constraint; explicit chain-of-thought planning step before generation.
- [VERIFY] `prompts/code_agent.md` §"When the Task Is Impossible Within Constraints" — confirms the infeasible response shape (status, reason, suggestion, simpler_alternative).
- [VERIFY] `prompts/code_agent.md` §"Code Style Directive" — `code_style` described as "a binding constraint — when present, you must follow it even if a different style would produce more elegant code."
