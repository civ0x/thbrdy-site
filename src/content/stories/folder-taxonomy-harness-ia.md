---
project: thbrdy-dev
shape: design-decision
agentRelevance: agent
tagline: Folder taxonomy as harness IA, not filesystem hygiene
questions:
  - "How do you keep an agent-mediated project navigable as it grows?"
  - "What's a decision you made about project structure that ended up mattering more than you expected?"
  - "How does the agent find what it needs at the start of a session?"
handles:
  - "About four months in, I noticed every session prompt was spending tokens orienting the agent to where things lived. I treated that as a system-prompt problem and reorganized the repo."
  - "The folder layout is a context-engineering artifact. The agent reads paths the same way it reads instructions."
  - "Each sub-project (Scholion lives under `working/scholion/`) gets its own three-file launch contract — CLAUDE.md, STATUS.md, DECISIONS.md inside its own directory. The harness is recursive."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"About four months in, the repo had drifted. Fifty-plus session prompt files at the root. A `scholion/` sub-project running its own parallel directory with duplicate MDX and YAML files. HTML prototypes scattered across three different folders. Orphaned directories left behind by abandoned essays. The agent was still working, but every new session prompt had to spend tokens orienting to where things lived. So I made a design call — *the folder taxonomy is part of the harness* — and consolidated everything into three top-level directories with deliberate semantics: `sessions/` for prompts grouped by topic, `working/` for sub-project documentation, `prototypes/` for HTML scratch."

## Punchline

The folder layout is a system-prompt artifact. The agent reads paths the same way it reads instructions — when the layout encodes the project's mental model, the agent inherits the model for free.

## Arc beats

- Context: `DECISIONS.md` #022 (2026-02-25). 50+ session prompts at root; the `scholion/` sub-project had its own parallel structure with duplicate MDX/YAML files; prototypes scattered across `prototypes/`, `working/vod-essay/`, and `scholion/prototypes/`; orphaned directories (`coregulation-essay/`) contained only stale duplicates.
- Problem framing: the directory was working as a filesystem and failing as a context surface. Every session prompt had to either spell out file locations (overhead) or hope the agent would find them (drift risk).
- Choice: three top-level directories with semantic meaning. `sessions/{ab,notice,lc,scholion,vod,coregulation,site-infra,pages}/` — session prompts grouped by essay or concern. `working/scholion/` — sub-project docs (CLAUDE.md, STATUS.md, DECISIONS.md), research PDFs, schema, extractions — every sub-project gets its own three-file launch contract by mirroring the root one. `prototypes/{scholion,vod}/` — HTML prototypes grouped by project. `docs/` — design reference docs (interaction-patterns.md, design-annotation-system.md).
- Constraint: `src/content/writing/` stays the sole canonical location for essay content. No duplicate MDX or annotation YAML files elsewhere.
- Tradeoffs: one-time cost of moving files and updating references; minor coupling between the folder names and the prompts that reference them (changing the taxonomy means updating session prompts that quote paths); the IA itself becomes a versioned artifact, which is the point.
- Lesson: in an agent-mediated repo, IA is system-prompt scaffolding. A clear, semantic taxonomy reduces the per-session orientation cost to near zero. The discipline of choosing where things live is the discipline of choosing what the next agent sees first.

## Verify

- [VERIFY] `DECISIONS.md` #022 — confirmed: dated 2026-02-25; structure block names `sessions/`, `working/`, `prototypes/`, `docs/`.
- [VERIFY] The "50+ session prompts at root" — confirmed in the entry's rationale.
- [VERIFY] Each sub-project getting its own three-file launch — confirmed: `working/scholion/` contains its own CLAUDE.md, DECISIONS.md, STATUS.md.
- [VERIFY] `docs/interaction-patterns.md` — confirmed: file exists (~26KB), alongside `docs/design-annotation-system.md`.
- [VERIFY] Whether the IA still holds — confirmed: 9 sessions subfolders today (close to #022's enumeration plus `editorial/`, which appears post-reorg).
