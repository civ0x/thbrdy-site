---
project: pop-ai
shape: design-decision
agentRelevance: agent
tagline: Role framing is the most consequential decision in an agent prompt
questions:
  - "Walk me through an agent system you designed end to end."
  - "When do you fan work out to subagents instead of doing it in one session?"
  - "How do you make agents produce comparable outputs without flattening them?"
handles:
  - "I'd rather show you the agent design doc I wrote for the convergence piece than talk about it in the abstract — it's where my actual thinking lives."
  - "The cheapest way to make an agent do editorial work is to tell it who the publication is, who the reader is, and what its output will be used for."
  - "The structured schema is the comparability layer. The 'surprise' field is the safety valve against the schema."
---

## Project orientation

PopAi is a weekly newsletter I write about how AI actually works. For one piece on AI output convergence, I had six research briefs — one per dimension of the argument — that needed to be compressed into something the main editorial session could design from.

## Opener

Six research briefs, each one long enough that loading all of them into one session would have left no context for the editorial work. I needed extraction, not summarization — the extracts had to be useful for someone making structural decisions about argument, visuals, what to cut. So I built six agents that ran in parallel. Each one got the same shared context block — about four hundred words encoding who PopAi is, who the reader is, what the piece is about, and what the extraction had to surface. Then each agent got one sentence of session-specific framing and one brief. The extracts compiled into a single file I read in the main session.

## Punchline

Role framing is the most consequential decision in an agent prompt — without it you get competent summaries; with it you get editorial judgment.

## Arc beats

- Context: the synthesis problem — too much material for one session, too much editorial judgment to delegate cleanly.
- Constraint: the extracts had to be comparable across briefs (so I could read across them) without being so structured that they killed the unexpected.
- Options considered: unstructured summaries (too generic); rigid schema (kills surprise); structured schema with an explicit "surprise" field that gives the agent permission to surface what doesn't fit.
- Choice: shared context block + structured schema (findings, visuals, surprise, weakness, connections, seed) + explicit negative instructions ("don't hedge," "don't resolve tensions," "don't write for a general audience").
- Tradeoff: each agent only sees its own brief. To preserve cross-session value, each gets the editorial arc — one paragraph on how all six sessions connect — so it can flag connection points without reading the other briefs.
- Lesson: end-use awareness changes extraction behavior. An agent told its output is the final product resolves ambiguity. An agent told its output feeds editorial design preserves it. Same model, different work.

## Verify

- [VERIFY] Design doc: `agent-design-convergence-extraction.md` — "Design Principles" (7 numbered), "The Shared Context Block," "What NOT to do."
- [VERIFY] Execution prompt: `session-prompts/convergence-extraction-and-editorial.md` — Phase 1 with six session-specific framings.
- [VERIFY] Schema fields are exact: findings (graded CONFIRMED/LIKELY/SPECULATIVE), visuals, surprise, weakness, connections, editorial seed.
- [VERIFY] "Six agents in parallel" actually executed: `research/convergence/extracts.md` exists, plus the eight individual session briefs (the original six plus the long-tail-suppression follow-up session, plus one more). Whether they ran strictly in parallel or sequentially is not confirmed from the artifact alone — say "in parallel" if pressed but note this is the design pattern, not necessarily one wall-clock run.
- [VERIFY] "Role framing is the most consequential decision" is paraphrased from Design Principle #1 in the agent design doc — quote it directly if pressed.
