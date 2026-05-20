---
project: editorial
shape: problem-and-method
agentRelevance: agent
tagline: Integration tests surface what unit evals can't see
questions:
  - "How do you test a multi-agent or multi-skill system?"
  - "What's the difference between unit evals and integration evals for an agent?"
  - "Tell me about a test that changed how you understood your own system."
handles:
  - "I had a five-skill agent suite that passed every unit eval, and the integration test surfaced two things — emergent convergence between skills and revealed value from a skill that looked redundant in isolation."
  - "If I ship a multi-agent or multi-skill system on unit evals alone, I expect to ship something whose system-level behavior I haven't actually characterized."
  - "The integration test changed what one of my skills was understood to be doing — that's the kind of result that's only available at integration scope."
---

## Project orientation

The editorial skills suite. Five skills, each with three test cases — fifteen unit evals total. After the unit evals were green, I ran all five skills in sequence on a real 4,500-word essay draft with four planned diagrams. That run was the integration test.

## Opener

Each skill had passed its own evals. Restraint held, diagnostics fired correctly, pushback worked. The retrospective listed five open risks for integrated use: order effects, scope boundary erosion, compound token cost, cumulative noise, and whether the fifth skill — Visual-Verbal Integration, the one with zero delta in isolation — earned its place in the sequence. The integration test was designed to answer those five questions on a real piece of prose, not a cherry-picked passage.

## Punchline

Two of my skills independently converged on the same passage at different levels of the stack — and that convergence told me more about the essay than either skill said alone, plus it resolved the question about whether the zero-delta skill was worth shipping.

## Arc beats

- Setup: ran Architecture Review, then Flow & Coherence, then Visual-Verbal Integration, then Audience Calibration, then Sentence Clarity, in macro-to-micro order. Total output ~2,500 words of diagnostic review.
- Finding 1 — convergence: Architecture Review and Flow & Coherence independently flagged Sections IV–V as a problem. Architecture Review saw it as a complexity scaffolding failure (sections constitute 40% of the essay between the climactic demonstration and the resolution). Flow & Coherence saw it as a density modulation failure (H×12 paragraphs with one M-density break). Same passage, different lenses, complementary interventions.
- Finding 2 — scope held: no skill encroached on another's territory. Audience Calibration stayed quiet because the prose was well-calibrated. Sentence Clarity found two issues without trying to restructure sections. The "What This Skill Does NOT Cover" sections did their job at integration scope.
- Finding 3 — VVI earned its place: Visual-Verbal Integration produced three findings nothing else caught — contiguity (Notation Bridge diagram placed after unrelated paragraphs), a decorative-vs-load-bearing call (Fleet Mirror — recommend cutting), and a prose-vs-diagram overlap (Execution Pipeline bridge paragraph doing diagram work in prose form). The unit evals had been too simple to surface this.
- Finding 4 — order matters in the small: Architecture Review framing the back-half density problem changed how the Flow & Coherence finding read. Without the architecture pass, the density looks like "add breathing room." With it, the density looks like "reconsider the sections, *then* add breathing room."
- Finding 5 — compound cost is manageable but real: ~2,500 words of review for a ~4,500-word essay. Recommended split for routine use: structural pass (Architecture + Flow + VVI) and polish pass (Audience + Sentence) — skip polish if structural changes will rewrite the prose anyway.
- Lesson: unit evals confirm each component works on its designed case. Integration tests are where you discover what the *system* does — including emergent behavior (skill convergence) and revealed value (VVI's integration-scope contribution invisible in isolation).

## Verify

- [VERIFY] Five risks framed in retrospective → `RETROSPECTIVE.md` lines 108–115.
- [VERIFY] Convergence finding → `integration-test-silicon-golem.md` lines 22–32, 89–91.
- [VERIFY] Scope held → `integration-test-silicon-golem.md` lines 80–86.
- [VERIFY] VVI integration-scope findings → `integration-test-silicon-golem.md` lines 99–107.
- [VERIFY] Compound cost ~2,500 words → `integration-test-silicon-golem.md` lines 116–119.
- [VERIFY] Recommended structural/polish split → `integration-test-silicon-golem.md` lines 121–131.
