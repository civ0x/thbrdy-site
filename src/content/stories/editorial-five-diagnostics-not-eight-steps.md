---
project: editorial
shape: design-decision
agentRelevance: agent
tagline: Workflow-for-a-human and harness-for-an-agent are different shapes
questions:
  - "How do you adapt a workflow designed for a human into something an agent can execute?"
  - "When is a checklist the wrong abstraction?"
  - "How do you structure agent reasoning when the source material is a procedure?"
handles:
  - "I had a foundational source that was an eight-step procedure, and the right translation for an agent was five named diagnostics — not eight steps."
  - "Workflow-for-a-human and harness-for-an-agent are different shapes. Most failures I see come from agents being handed procedures designed for serial self-editing."
  - "I think about agent harness design as choosing the right *shape* — procedural, diagnostic, planning-vs-executing — before writing the content."
---

## Project orientation

Sentence Clarity, the first skill in the editorial suite. The source material was Richard Lanham's Paramedic Method — an eight-step procedure for tightening prose: find the action, kick out the slow wind-up, mark prepositions, mark "is" forms, etc. Generations of writers have used it as a self-editing protocol.

## Opener

The obvious move was to ship Lanham's eight steps as the skill's structure — read the prose, run step one, run step two, all the way to "read aloud" and "compute Lard Factor." It even comes with a quantitative metric. But when I started writing the SKILL.md that way I noticed the agent would be doing the procedure, not the diagnosis. The eight steps assume a human self-editor working serially on their own prose. An agent reviewing someone else's prose needs to identify what's wrong, explain why in mechanistic terms the writer can learn from, and propose a fix. That's a different shape entirely.

## Punchline

Lanham's method is a procedure for human self-editors. The agent doesn't need a procedure — it needs a diagnostic framework. So I built five named diagnostics that map to specific cognitive mechanisms, and let the agent decide which fire on a given passage.

## Arc beats

- Context: source taxonomy research identified Lanham (Paramedic Method) and Williams (Style: Lessons in Clarity and Grace) as the primary sources for sentence-level work. Lanham's procedure is the most operational artifact in the field.
- Constraint: SKILL.md is consumed by an agent, not a human. Steps 1–5 are mechanical pattern scans (find prepositions, find "is" forms). Steps 6–8 (read aloud, mark rhythm, compute Lard Factor) don't translate — the agent can't read aloud and Lard Factor as a metric incentivizes word-count reduction at the cost of substance.
- Options: (a) translate eight steps directly; (b) abstract to a framework the agent can apply non-serially.
- Choice: five named diagnostics — em-dash depth (working-memory overload via center-embedding), subject-verb proximity (Gopen's first principle), nominalization scan (Williams's characters-and-actions), stress position audit (Gopen's emphasis principle), old-to-new flow (the given-new contract). Each tied to a specific cognitive mechanism with a specific source.
- Trade-off: lost Lanham's quantitative Lard Factor. Replaced with word-count-reduction thresholds in the eval assertions, where the metric belongs anyway.
- Lesson: harness shape for an agent ≠ workflow shape for a human. A procedure says "do these steps." A diagnostic framework says "these are the mechanisms you're checking for, fire whichever match." The agent needs the second shape because it's reviewing, not editing.

## Verify

- [VERIFY] D3 decision rationale → `DECISIONS.md` lines 17–22.
- [VERIFY] Five diagnostics listed → `sentence-clarity/SKILL.md` (or `STATUS.md` line 15).
- [VERIFY] Lanham steps 6–8 don't translate → `DECISIONS.md` lines 20–21.
- [VERIFY] Lard Factor replaced by word-reduction threshold → `DECISIONS.md` line 22; recalibration in `STATUS.md` line 52.
