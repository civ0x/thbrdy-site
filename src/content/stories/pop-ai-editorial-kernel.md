---
project: pop-ai
shape: problem-and-method
agentRelevance: agent
tagline: One artifact every stage reads, not doctrine each stage re-interprets
questions:
  - "How do you keep multiple agents — or multiple invocations of the same agent — consistent with each other across a pipeline?"
  - "What's the difference between a system prompt and what you'd call context engineering?"
  - "Where do you put state that has to survive across sessions and stages?"
handles:
  - "The most expensive mistake I made running an agent pipeline was leaving editorial judgment in prose."
  - "I had a context engineering problem masquerading as a quality problem."
  - "Every stage of my pipeline was a different lossy compression of the same doctrine."
---

## Project orientation

PopAi is a weekly newsletter I write about how AI actually works. The production pipeline runs across scheduled scan tasks, parallel research-extraction agents, and editorial drafting sessions — and the editorial judgment those stages apply needs to be consistent across all of them.

## Opener

I had editorial judgment encoded in two prose documents — a charter at about four thousand words, a project CLAUDE.md at about twenty-five hundred. Every stage of the pipeline that needed that judgment was re-deriving it independently by reading the prose fresh. That produced three failures I could name. Inconsistency — the scan's idea of "high relevance" and the extraction agent's idea of "editorially valuable" should have been the same judgment, but they drifted. Context waste — feeding sixty-five hundred words of editorial prose to a scheduled scan that needs four hundred. And invisible degradation — when the output got generic, nothing in the harness caught it, because the prose telling the agent to be specific wasn't operative at the moment it was being generic.

## Punchline

The editorial judgment had to be one artifact every stage reads, not a doctrine each stage re-interprets.

## Arc beats

- Problem framing: judgment-as-prose is fine for a human collaborator and broken for an agent pipeline — every stage re-derives it and they drift.
- Worked example: the extraction agent context block solved this locally for one piece — a 400-word shared block measurably improved output quality, and that prototype became the proof.
- Method: a kernel containing seven components (audience model, three editorial filters, evidence grading, visual awareness, pattern detection, anti-convergence checks, anti-tics) — stable across stages, layered with stage-specific addenda.
- Technical layer: invocation pattern is layered (core block every stage gets, plus stage-specific overlays), not a single document with section headers, because the latter pushes interpretation back onto the consuming prompt.
- Analog: the same DRY discipline that applies to code applies to context — duplicated judgment drifts the same way duplicated logic does.

## Verify

- [VERIFY] Spec: `popai-editorial-kernel-spec.md`, sections "The Problem It Solves" and "What the Kernel Contains" (7 components).
- [VERIFY] Proof from prior work: `agent-design-convergence-extraction.md` — the 400-word shared context block this generalized from.
- [VERIFY] Session prompt that launched the kernel build: `session-prompts/editorial-kernel-development.md` (live question + open questions).
- [VERIFY] Claim "measurably improved output quality" is the spec's own framing; whether you can show a side-by-side is `[CONJECTURE]` unless you have the before/after extracts.
- [VERIFY] Word counts (4,000 / 2,500 / 400) are stated in the spec — confirm by `wc -w` if pressed.
