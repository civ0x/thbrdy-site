---
project: silicon-golem
shape: problem-and-method
agentRelevance: agent
tagline: Session prompts are consumable; CLAUDE.md is doctrine
questions:
  - "How do you handle context that needs to survive across long-running agent work?"
  - "What's your philosophy on what lives in the system prompt vs. the session prompt vs. project docs?"
  - "Walk me through a workflow where multiple agent sessions had to compose into one outcome."
handles:
  - "How do you architect context for long-running agent work so it doesn't decay?"
  - "What's the difference, in your workflow, between something that goes in a system prompt and something that goes in a project doc?"
  - "Tell me about a handoff protocol you designed for multi-session AI work."
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

I was building this system across maybe a dozen Claude sessions — sometimes in parallel worktrees, sometimes a week apart, sometimes after the model itself had been updated. The first session had the full design conversation in its context window. By session three, the agent was operating on a compacted summary of a summary, and it started re-litigating decisions I thought were settled. I'd rather pay the cost of writing things down once than watch the same decision get re-derived — badly — across three sessions.

## Punchline

So I separate durable state from session prompts on purpose — design decisions live in versioned docs (CLAUDE.md, DECISIONS.md, GOLEM_SDK.md, STATUS.md), session prompts are consumed and deleted, and every session reads the docs first — which means a fresh agent with zero memory of prior sessions can pick up where the last one left off because the durable state lives in artifacts that survive context resets.

## Arc beats

- Problem framing: complex agent-driven projects span many sessions, but session context is ephemeral. Decisions made in chat dissolve when the conversation ends or gets compacted.
- Worked example: this project shipped the runtime in a single day (March 5, 11 commits across two worktree branches), but the design conversation that preceded it happened across multiple Cowork sessions. Each session left the project folder in a state where a fresh session could resume from the docs alone.
- Method — four artifact classes. (1) CLAUDE.md: persistent agent guidelines, "read this first." (2) DECISIONS.md: accepted ADRs with rationale, alternatives considered, revisit triggers; immutable once accepted. (3) STATUS.md: current state, updated continuously — what's built, what's next, what's blocked. (4) Session prompts (`HANDOFF.md`, `prompts/handoff_bridge.md`, `prompts/handoff_sdk.md`): written for a specific next session, consumed once, then deleted.
- Technical layer: every session prompt I write to launch an executing-agent worktree follows a fixed shape — *Where We Are / The Live Question / The Next Move / Key Constraints to Hold / Files to Read First*. That shape forces me to surface the inheritable subset of my live context.
- Analog: this is the same separation that ADR-008 codifies for the runtime — the in-session discovery got promoted from "I noticed this in a smoke test" to a permanent paragraph in the chat agent prompt. Both are corrections-log moves: discover, codify, persist.
- Lesson: chat history is not infrastructure. The system that knows what it knows is the one that promotes runtime discoveries into versioned artifacts and writes session prompts as code that runs once and gets deleted.

## Verify

- [VERIFY] `CLAUDE.md` §"Session Management and Handoff Protocol" — the handoff format spec (Where We Are / Live Question / Next Move / Constraints / Files to Read First).
- [VERIFY] `CLAUDE.md` §"Between Sessions" — "Durable project state lives in versioned documents in the project folder, not in chat history."
- [VERIFY] `prompts/handoff_bridge.md` and `prompts/handoff_sdk.md` — concrete examples of session prompts I wrote to launch executing-agent worktrees; each names files to read first, target file structure, key constraints, and a "What Done Looks Like" section.
- [VERIFY] `SESSION_HANDOFF.md` and `HANDOFF.md` — concrete examples of session-to-session handoffs (both marked for deletion per STATUS.md, which is itself an instance of the "session prompts are consumable" rule).
- [VERIFY] Global `~/CLAUDE.md` (the personal one, not the project one) §"Operational Guardrails" — "If a project folder has its own CLAUDE.md, those instructions take precedence over these globals for that project's work." Confirms the layered-context model.
