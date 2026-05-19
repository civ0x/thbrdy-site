---
project: scholion
shape: failure-mode
agentRelevance: agent
tagline: Citation extractor drifted when paper formats changed mid-run
questions:
  - Tell me about a time an agent failed in production and how you caught it.
  - How do you design context so agents don't drift?
  - When have you debugged an agent that was confidently wrong?
handles:
  - The thing I kept running into was the agent producing confident output for inputs it had never actually seen.
  - It was a harness-design failure, not a model failure — the constraints we put in the system prompt didn't survive a schema change in the input corpus.
  - Drift caught by structure, not by eval — the codified output schema is what made the failure visible.
---

## Project orientation

Scholion is a tool I'm building for mapping epistemic dependencies in scientific reasoning — given a paper or a claim, it surfaces what other results have to hold for that claim to stand. The extraction layer is an agent pipeline: parse the paper, identify citations and load-bearing references, classify each dependency's role.

## Opener

I was running the extractor against a fresh corpus of preprints and noticed the output looked subtly wrong — the citation graphs were too dense in some places and too sparse in others. The agent wasn't erroring; it was confidently producing structured output that didn't match the source. The thing I kept running into was that the new corpus had a different reference format than the one our system prompt was built against, and the agent had silently rewritten its own assumptions to fit.

## Punchline

The fix wasn't a better prompt — it was making the input schema explicit enough that violations couldn't be papered over by the agent in the moment.

## Arc beats

- Hypothesis: drift comes from input-format shift; system prompt's implicit assumptions don't survive a corpus change.
- Outcome diverged: extraction output looked structurally valid but contradicted the actual references in the papers; eval suite didn't catch it because it was scored on output shape, not source fidelity.
- Mechanism: agent had three plausible interpretations of an ambiguous reference style and silently picked the one that produced the most uniform output, optimizing for its own internal consistency rather than source faithfulness.
- Adjustment: moved format assumptions out of the system prompt and into a typed input-schema validation step; agent now refuses ambiguous inputs instead of guessing, surfaces them to a triage queue.
- Lesson: drift detection requires comparing agent output against something other than itself — schema validation against source is cheaper than a second-pass eval and catches the failure earlier.

## Verify

- [VERIFY] Specific corpus name and date of the format change.
- [VERIFY] Eval suite definition — was it actually scored on output shape only, or did it have a source-fidelity component that the failure slipped past?
- [VERIFY] Final architecture of the triage queue: is it a separate agent, a human-review step, or a structured retry?
