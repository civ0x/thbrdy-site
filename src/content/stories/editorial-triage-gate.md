---
project: editorial
shape: problem-and-method
agentRelevance: agent
tagline: Make "no action" a first-class output, not an absence of one
questions:
  - "How do you keep an agent from over-acting?"
  - "Tell me about a design pattern you've found yourself reaching for across projects."
  - "What's the biggest mistake you've made building agents?"
handles:
  - "The thing I keep reaching for in agent harnesses is a hard gate that makes 'no action' a first-class output, not an absence of one."
  - "Most editorial-agent failures aren't bad diagnoses — they're correct diagnoses applied to prose that didn't need them."
  - "I started treating the triage gate as the part of the system prompt that earns the biggest delta. Diagnostics are commodity; restraint is rare."
---

## Project orientation

A project to build five agent skills — packaged instructions plus diagnostics — that perform structured editorial review on long-form analytical prose. Each skill operates at a different level of the writing stack and runs inside Claude as a harness layer: the user invokes the skill, the agent loads the SKILL.md, and applies the diagnostics to a passage.

## Opener

I built the first skill — sentence-level diagnostics for prose like nominalization scans and stress-position audits — and the iteration-1 evals came back with the skill *losing* on clean prose. The without-skill baseline correctly left it alone; the with-skill agent kept finding patterns to fix. The diagnostics were correct. The problem was the agent applied them indiscriminately because the skill didn't have a real gate — just a paragraph saying "consider whether revision is warranted." That cracked open a pattern that ended up shaping every skill after.

## Punchline

Across five skills, the biggest quality lever wasn't a better diagnostic — it was a hard gate that lets the agent decide "this needs no intervention" with the same weight as a flagged finding.

## Arc beats

- Iteration 1 of Sentence Clarity: skill-guided agent over-edited clean prose because the triage check was a soft suggestion, not a gate.
- Iteration 2: promoted the gate to its own H2 section with explicit hard-gate language ("if you don't stumble as a reader, you pass triage"), added a "before you propose any revision" forcing function.
- Flow & Coherence hit the same failure mode in iteration 1 — proposed connectives on transitions that worked. Same fix: hard gate + forcing function.
- Architecture Review and Audience Calibration absorbed the pattern at iteration-1 design time. Got the gate right on the first run.
- By skill four, the gate wasn't a preamble anymore — it was a subsystem with its own logic, override clauses, and pushback conditions.

## Verify

- [VERIFY] Iteration 1 over-editing claim → `STATUS.md` lines 22–27 (four problems identified) and `RETROSPECTIVE.md` lines 38–43.
- [VERIFY] "Hard gate" language and forcing function → `sentence-clarity/SKILL.md` (Triage Gate section, Before You Propose Any Revision subsection).
- [VERIFY] "Gate as subsystem by skill four" → `RETROSPECTIVE.md` lines 39–41 (maturation pattern across the suite).
- [VERIFY] Eval deltas pre/post gate → `STATUS.md` iteration-1 vs iteration-2 tables (lines 43–48 for Sentence Clarity; 79–84 for Flow & Coherence).
