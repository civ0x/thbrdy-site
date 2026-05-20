---
project: scholion
shape: outcome-reframe
agentRelevance: agent
tagline: When the obvious metric fails, ask if the metric was the right test
questions:
  - "How do you evaluate an agentic workflow when there's no clean ground truth?"
  - "Tell me about a time the obvious metric was misleading."
  - "How do you know when an extraction is good enough?"
handles:
  - "I had two metrics on the same data — one reported 29.2%, the other reported 75%. Both were honest. The design question was which test was the right test."
  - "The exact-ID matcher was answering a question I wasn't actually asking. The system was building a finer graph than the ground truth, and the matcher couldn't read through the renumbering."
  - "In eval design for stochastic systems, the metric is part of the system. Treat metric choice the way you'd treat a schema choice — versioned, justified, revisable."
---

## Project orientation

Scholion is a system I'm building that extracts the dependency structure of arguments from research papers as machine-tractable graphs — atomic claims, the warrants connecting them, typed edges between them, and which nodes are load-bearing. The substrate is Anthropic structured outputs with Pydantic v2; the gating test is whether the extraction matches a trained human annotator's structural picture.

## Opener

"The spike ran. Sonnet 4.5 produced 23 claims where the human annotator had produced 14. I wrote a comparison routine that walked through every ground-truth dependency edge and asked 'is this edge present in the extraction?' — exact-ID match. The number came back 29.2%. By that metric, the spike was a clear fail. But when I looked at the actual data, the model hadn't missed those edges. It had decomposed claims more finely than the human annotator had — splitting `method.2` into PubMed search scope plus dual-reviewer screening, renumbering Cox regression from `method.3` to `method.4`. Every 'missing' edge was reachable through the extraction's finer graph; the exact-ID matcher just couldn't see through the renumbering."

## Punchline

When the obvious eval metric reports failure on a stochastic system, your first move shouldn't be "the system failed" — it should be "did the metric ask the right question."

## Arc beats

- Field framing: in evals for argument extraction, "did the model produce the same dependency edges?" sounds like the right question, and it's how the argument-mining literature reports F1.
- The result on first pass: 29.2% exact-ID match. Reported as a number, that's a pivot signal under the spike's own success criteria.
- The actual data: the model split GT claims into multiple finer claims with new IDs. Both decompositions are defensible — continuous AST/ALT ratio and dichotomized AST/ALT ≥ 2 are legitimately separate claims; the human annotator collapsed them.
- Reframe move: replace exact-ID dependency match with structural path matching — for each ground-truth edge, check whether the GT edge is *reachable* through the extraction's graph. The metric becomes graph-topology-aware, which is what was being asked all along.
- Result on the corrected metric: 75% structural path match, 2/2 cruxes correct, 14/14 claim recall. Strong signal under the spike's pre-registered threshold.
- Cost of the corrected metric: structural path matching distinguishes "finer decomposition the model added" from "claims the model missed" only with content-level review. ID-level matching is fast and wrong; the structural metric is right and expensive. Phase 2's benchmarking has to budget for that cost explicitly — content review enters as a first-class eval expense, not a one-time spike artifact.
- Lesson: in any eval for an agentic system that has structural latitude, the metric you choose is the eval system. The first question to ask of a failing metric is whether the metric is the right test for the design question. If it isn't, the result is data about the metric, not about the system.

## Verify

- [VERIFY] `spike-evaluation.md` numbers — confirmed: 23 extracted vs. 14 ground truth; 14/14 claim matches; 29.2% exact-ID dependency match; 75.0% structural path match; 2/2 crux agreement; 9 novel claims.
- [VERIFY] `DECISIONS.md` DEC-012 reasoning under "Granularity mismatch is the main discrepancy, not structural error" — confirmed verbatim: "This means exact-ID dependency matching (29.2%) dramatically underestimates quality — structural path matching (75%) is the correct metric."
- [VERIFY] The specific renumbering example (method.3 → method.4 for Cox regression) — confirmed in DEC-012 "Crux identification works but requires content-based evaluation."
- [VERIFY] The 9 novel claims being defensible finer decompositions, not hallucinations — confirmed: spike-evaluation.md "Novel Findings" section enumerates them; STATUS.md frames them as "finer decomposition, not hallucinations."
- [CONJECTURE] that I wrote the exact-ID matcher first because it was the obvious move — true to my best recollection; the structural-path version came after I looked at the data and felt the disconnect.
