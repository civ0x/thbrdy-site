---
project: thbrdy-dev
shape: problem-and-method
agentRelevance: agent
tagline: Planner/executor separation as a context-engineering primitive
questions:
  - "How do you organize agent-mediated work on a long-running project?"
  - "What role does documentation play in your workflow with agents?"
  - "How do you keep an agent from drifting or relearning the project every session?"
handles:
  - "The harness for this site is a hard prohibition on the planner editing source, plus a three-file launch the executor reads on every session. That's all of it."
  - "I separate planning from execution at the agent layer. The planning session produces a self-contained mission prompt; the executor runs autonomously against it."
  - "Most context engineering in long-running agent work is choosing what lives in durable state vs. chat. Making that boundary structural is what makes the project compound across sessions."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"I was working on this site across dozens of agent-mediated sessions over months. Early on I hit the wall everyone hits: context windows decay, chat history compacts, and any state that lives in chat dies with the session. So I built the project around a hard constraint plus a launch contract. The constraint is in `CLAUDE.md`'s first section, verbatim: *Do not edit source files directly. In Cowork mode, plan changes and produce session prompts for execution in separate sessions.* The launch contract is one line the planning session hands the executor: *Read `CLAUDE.md`, `STATUS.md`, and `[session-prompt-filename].md`, then execute.* That's the whole handoff."

## Punchline

The highest-leverage artifact in an agent workflow isn't the prompt — it's the boundary between *what's true about this project* (durable) and *what we're doing this hour* (perishable). The planner has to be forbidden from collapsing that boundary, or it collapses by default.

## Arc beats

- Problem framing: many sessions over months on the same codebase. Agent context decays. Chat compacts. Anything that lives in chat dies with the session. Without a structural intervention, every session relearns the project.
- The constraint: the planner agent (Cowork) is prohibited from editing `src/`, `public/`, or content. It can only produce session prompt files and update three documentation files (`CLAUDE.md`, `STATUS.md`, `DECISIONS.md`). This forces every code change to go through a self-contained mission file.
- The launch contract: each session prompt is a kebab-case mission file containing situation, mission, technical constraints, and a verification checklist. The executor reads CLAUDE.md (conventions, design system, corrections log — ~16K, durable), STATUS.md (migration phase, sources of truth — ~22K, durable-but-dated), and the prompt (perishable). No clarifying turn required.
- Worked example: session prompts live under `sessions/{ab,coregulation,editorial,lc,notice,pages,scholion,site-infra,vod}/` — nine topic folders. The folder discipline is itself part of the harness (Story 6).
- Lifecycle: session prompts have a write → execute → archive flow. Durable docs are committed; mission files accumulate in `sessions/` once their mission is run.
- Institutional analog: same structure as a tasking order in SOF or a runbook in SRE — durable doctrine plus a perishable order. The novelty is applying it to agent-mediated software work where the executor reads natural language and the planner is human-augmented.
- Lesson: in long-running agent work, the boundary between durable state and perishable instruction is the harness. Most "context engineering" I see is at the prompt level; the leverage is at the docs-vs-chat boundary, enforced by a constraint that prevents the planner from cheating.

## Verify

- [VERIFY] `CLAUDE.md` opening "Cowork Mode Rule" — confirmed verbatim, including the three-file launch protocol blockquote.
- [VERIFY] Sessions folder taxonomy — confirmed: 9 folders (ab, coregulation, editorial, lc, notice, pages, scholion, site-infra, vod), ~90 prompt files total. Largest are site-infra (19), notice (19), editorial (14), scholion (13).
- [VERIFY] The "executor reads three files in order" claim — confirmed in `CLAUDE.md`: "The executing agent reads the three files in that order and works autonomously."
- [VERIFY] Whether the three-file launch is universally honored across actual sessions — spot-check 2–3 prompts in `sessions/`. [CONJECTURE that adherence is high but not universal; some session prompts may inline more context than the contract requires.]
- [VERIFY] The "design-first methodology" framing (CLAUDE.md + STATUS.md + DECISIONS.md as the agent's standing artifacts) is consistent across the global Cowork CLAUDE.md and the project-level CLAUDE.md — confirmed.
