---
project: silicon-golem
shape: design-decision
agentRelevance: agent
tagline: The allowlist isn't a config — it's the system's theory of the kid
questions:
  - "How do you keep multiple parts of an agent system in sync about what's allowed?"
  - "What's an example of a config that's actually a theory?"
  - "Tell me about an artifact that turned out to be more important than you expected."
handles:
  - "How do you architect context for an agent so that constraints stay coherent across its prompt, its tools, and its eval gates?"
  - "When have you found that one artifact ended up holding a whole system together?"
  - "Walk me through how you keep an LLM agent's prompt aligned with a runtime validator."
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

I was wiring up the runtime and noticed there were three places in the system that need to agree on the answer to one question: what Python constructs is this kid ready for at this level? The code agent's prompt — what to generate. The AST validator — what to accept. The few-shot examples — what style to anchor on. At runtime they're independent: the agent reads its prompt, the validator runs after, the examples are baked in. The moment any one of them drifted from the other two, the agent would generate code the validator rejected, and the kid would see a broken bot.

## Punchline

I treat the concept allowlist as the system's theory of the kid — one canonical JSON spec in GOLEM_SDK.md per level — and any change has to cascade through all three derivations atomically, because the allowlist isn't a config file, it's the shared contract that lets specialized components work independently without diverging.

## Arc beats

- Context: three components need to share a developmental model — code agent generation, AST validator enforcement, and few-shot examples that anchor the agent's style. The orchestrator's concept-readiness logic depends on the same registry.
- Constraint: at the moment of generation these components are independent; there's no shared in-memory state, only what each loaded at startup.
- Options considered: maintain three parallel specs synced by code review (fragile, drifts on every level change); make the validator the single source and let the prompt approximate (too lax — agent generates rejectable code); promote the allowlist JSON to canonical artifact and derive everything from it (chosen).
- Choice: GOLEM_SDK.md defines the canonical allowlist per level (permitted_ast_nodes, permitted_sdk_functions, permitted_builtins, max_lines, max_nesting_depth, code_quality_heuristics). Validator reads it; code agent's prompt is derived from it; few-shots are derived from it; LEARNER_MODEL's level-gate logic uses the same registry. The code agent prompt explicitly defers: "if this list ever conflicts with GOLEM_SDK.md, GOLEM_SDK.md wins."
- Tradeoffs: every level change is a multi-file cascade (cost); the system's developmental model is auditable in one place (benefit); a misbehaving agent can be diagnosed by checking which derivation is stale. I wrote a `validate-allowlist` skill to do exactly that audit — cross-checks GOLEM_SDK.md against the prompt and the validator config and flags divergences.
- Lesson: when you're maintaining parallel constraints across components of an agent system, you don't have a docs problem — you have a single-source-of-truth problem. Naming the artifact as the system's theory (here, "theory of the kid") makes the coupling legible and the cascade obligatory.

## Verify

- [VERIFY] `GOLEM_SDK.md` §"Level 1 Concept Allowlist" — the canonical JSON spec.
- [VERIFY] `CLAUDE.md` §"Concept Allowlist is the Single Source of Truth" — explicit statement that GOLEM_SDK.md drives both code agent prompt and AST validator, and that divergence breaks the bot.
- [VERIFY] `prompts/code_agent.md` §"Concept Level and Constraints" — the "GOLEM_SDK.md wins" deferral.
- [VERIFY] `LEARNER_MODEL.md` §"Concept Registry" and §"Level Gate Logic" — confirm the registry and level_gate mapping that the orchestrator's promotion logic uses.
- [VERIFY] `.claude/skills/validate-allowlist/SKILL.md` — confirms the cross-derivation audit skill exists and what it checks (GOLEM_SDK.md vs. code_agent prompt vs. validator config); confirm before claiming it as "automated drift check."
