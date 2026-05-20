---
project: silicon-golem
shape: design-decision
agentRelevance: agent
tagline: Same separation-of-concerns at runtime and at build-time
questions:
  - "How do you decide model tier and role boundaries when you're designing an agentic system?"
  - "Walk me through the runtime topology of an agent system you've built."
  - "Has the way you build AI systems changed how you architect them — or vice versa?"
handles:
  - "How do you decide where to spend Opus capability and where Haiku is sufficient?"
  - "Describe the harness you built around your agents — what does the central coordinator actually do?"
  - "When have you found the same architecture showing up in how you built something and what you built?"
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

I was designing the runtime architecture and I had four cognitive responsibilities to allocate. Personality and conversation, which needs to be fast and warm. Code generation, which needs to be precise under hard constraints. Pedagogical design, which needs taste and patience. And concept tracking — what's the kid mastered, what are they ready for — which needs determinism and sub-100ms latency. The first instinct was one big prompt that did everything, and the moment I tried it, the personality leaked into the pedagogy, the pedagogy infected the code style, and nothing landed on its target.

## Punchline

So I split it into four — Haiku for chat, Sonnet for code, Opus for the challenge engine, a rule-based learner model with a fixed BKT update — coordinated by an orchestrator that owns all the data flow but doesn't itself reason; and when I noticed the same fleet pattern was the right way to *build* the system (Opus for design docs and prompts, Sonnet for mechanical implementation, parallel worktrees with the design docs as the shared contract), the build-time/runtime convergence stopped feeling like a coincidence.

## Arc beats

- Problem framing: four AI responsibilities with incompatible optimization targets — speed/personality, correctness/constraint, taste/timing, determinism/latency.
- Worked example: a kid command ("build me a wall") routes chat → chat agent (Haiku, <2s, returns task description) → code agent (Sonnet, <10s, generates Python against concept-level constraints) → validator (sync gate) → sandbox exec → bridge. Async, the challenge agent (Opus) watches for trigger conditions to manufacture the next learning beat.
- Method: model selection by optimization target, not by capability or cost alone. Latency budgets (<2s chat, <10s code, async challenge, <100ms learner) constrain the choice. The orchestrator is the only synchronous coordinator.
- Technical layer: orchestrator owns routing, learner-event processing, challenge state machine, skill-library filtering, world-state assembly. It does no LLM reasoning itself — that separation is what makes the cognitive split clean (the orchestrator can't accidentally start "thinking" on behalf of an agent).
- Analog: same pattern at build-time. Opus + extended thinking for the highest-leverage artifacts (system prompts, ADRs, GOLEM_SDK.md). Sonnet for the spec-driven layers (Mineflayer bridge in Node, Python SDK, AST validator). Parallel worktrees (the project shipped in a single-day burst on 2026-03-05 across `bridge-impl` and `worktree-sdk-implementation` branches). Design docs as the interface contract — the build-time analog of the runtime allowlist.
- Lesson: the architecture of the tool shapes the architecture of the artifact. When both layers independently converge on the same pattern — specialize by optimization target, share a contract, verify at boundaries — that convergence is the evidence the pattern captures something real about how complex cognitive work decomposes.

## Verify

- [VERIFY] `DECISIONS.md` ADR-003 — full table of agents, models, latency requirements, optimization targets; the "Build-Time Agent Strategy" subsection (Cherny fleet pattern, Opus for prompts, Sonnet for mechanical).
- [VERIFY] `CLAUDE.md` §"Architecture Overview" and §"Orchestrator Routing Responsibilities" — confirms orchestrator role and four-agent topology; confirms orchestrator does no LLM reasoning itself.
- [VERIFY] Git log — confirms parallel worktrees actually used: `bridge-impl` (PR #1), `worktree-sdk-implementation` (PRs #2, #3). Single-day burst 2026-03-05 from 15:32 to 22:12 PT, 11 commits including merges.
- [VERIFY] `.claude/worktrees/sdk-implementation/` directory exists — physical evidence of the worktree pattern, not just aspirational.
- [VERIFY] Boris Cherny attribution in `CLAUDE.md` §"Development Methodology" and `essay/SKELETON.md` §06. Confirm how prominent before name-dropping.
