---
project: thbrdy-dev
shape: outcome-reframe
agentRelevance: agent
tagline: '"Form embodies argument" — one-off graduating into a rule'
questions:
  - "How do you turn a one-off design insight into something that scales?"
  - "What's an example of a pattern emerging from a specific piece of work that you generalized?"
  - "How do you teach an agent to make consistent design decisions across a long-running project?"
handles:
  - "The agent kept reaching for the same primitive across island redesigns. So I wrote it down as a standing convention. That's how a one-off graduates into a rule."
  - "Form embodies argument. The interaction makes the reader *experience* the claim — that's the pattern doc's headline, and it constrains every new island the agent builds."
  - "The pattern doc is the system prompt's appendix. The agent reads it the way it reads CLAUDE.md — as a hard reference, not as suggestion."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"I was redesigning the Toulmin diagram for the Scholion essay — first version had six equally-weighted cards in a grid, and the relationships were illegible. I redesigned it as a vertical flow with the Claim dominant, the Qualifier and Rebuttal embedded inside the Claim card as inline modifiers because they *are* modifiers logically, and visible connector lines with the labels 'supports' and 'on account of' wired between Data, Warrant, and Backing. That redesign worked — the inferential structure became immediately graspable without prior Toulmin knowledge. About a week later I was on the third or fourth island redesign and noticed the same move kept happening: the interaction model wasn't decorating the argument, it was *embodying* the argument. So I wrote that down as a standing convention."

## Punchline

The graduation pattern is the eval loop's most valuable output: a noticing — *I keep doing this same move* — becomes a codified principle in `docs/interaction-patterns.md` that the next agent session reads as a constraint. The one-off becomes a rule.

## Arc beats

- Context: `DECISIONS.md` #011 (2026-02-22). Toulmin diagram redesigned from a 6-card grid to a vertical flow with the Claim as center of gravity, qualifier and rebuttal as inline modifiers inside the Claim card, visible connectors with verbal labels.
- Observation across subsequent island redesigns: SequentialFunnel, MaturitySwitch, LegibilityGap, and the annotation system kept reaching for the same primitive — the interaction *enacts* the argument rather than just illustrating it. Match control to argument structure (binary toggle for discrete-state arguments, slider for spectrum, scroll-driven for temporal unfolding).
- Generalization: `DECISIONS.md` #019 (2026-02-25). Extract the recurring patterns into `docs/interaction-patterns.md`. The headline convention: *Form embodies argument — the interaction model makes the reader experience the claim, not just observe a diagram. No default template — start from the argument, work backward to the interaction.*
- Other conventions codified alongside: fat SVG hit targets (18px invisible companion lines behind 1.5px visible edges); mode-sensitive explanations; shared popover/detail-panel visual treatment; prototype-first workflow (standalone HTML → validate interaction → port to React TSX).
- The constraint that makes it operative: `docs/interaction-patterns.md` is referenced from CLAUDE.md and named in #019 as authoritative for visual treatment and interaction mechanics. Individual components may extend but should not contradict these patterns without a new decision entry explaining why. The pattern doc is the system prompt's appendix.
- Lesson: the graduation pattern is the most valuable output of an eval loop. A one-off observation — "I keep reaching for this same primitive" — becomes a codified principle in a referenceable document that constrains the next agent invocation. The pattern doc is the system prompt's externalized memory, and writing it is the move that makes the project actually compound.

## Verify

- [VERIFY] `DECISIONS.md` #011 — confirmed: dated 2026-02-22, Toulmin diagram redesigned from grid to vertical flow with dominant Claim, qualifier/rebuttal as inline modifiers, visible connector lines.
- [VERIFY] `DECISIONS.md` #019 — confirmed: dated 2026-02-25, extracts patterns to `docs/interaction-patterns.md`. Key conventions verbatim: "Form embodies argument," "Match control to argument structure," "Fat SVG hit targets," "Mode-sensitive explanations," "Popover/detail panel consistency," "Prototype-first workflow."
- [VERIFY] `docs/interaction-patterns.md` — confirmed: file exists at ~26KB; should be authoritative for the patterns the agent applies in any new island. [VERIFY by direct read if a round goes deep on the conventions themselves.]
- [VERIFY] Whether `CLAUDE.md` explicitly references `docs/interaction-patterns.md` — [VERIFY by grep]; if not, that's a gap the next session prompt should close.
- [VERIFY] "form embodies argument" as a phrase — confirmed verbatim in #019.
