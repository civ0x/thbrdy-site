---
project: notice
shape: design-decision
agentRelevance: agent
tagline: Privacy isn't symmetric between inference and training
questions:
  - "Tell me about a decision you deliberately deferred. What made deferral the right call?"
  - "How do you reason about privacy in an AI system across different operations on the same data?"
  - "When have you split a design question into 'what's settled' and 'what we still don't know' explicitly?"
handles:
  - "There's a principle that surfaced in this decision I think is generally underappreciated — privacy isn't symmetric between inference and training, even on the same data."
  - "I deferred the training architecture and kept building the parts that didn't depend on the decision — the evaluation corpus, the feedback mechanism, the inference pipeline."
  - "The decision was actually two decisions stacked — the feasibility math told me Option A is hard right now, but the architectural question was whether to switch to B or wait for the framework landscape to move, and the consent asymmetry is what made waiting the right call."
---

## Project orientation

Notice is the interoceptive-awareness app — Apple Watch and iPhone, two-tier AI architecture, contemplative reflections via Claude. The on-device tier is currently Apple Foundation Models for tool orchestration; the question for D10 was whether a personalized LoRA-adapted small model running on-device could replace the Claude API for brief reflections, making the free tier genuinely intelligent rather than a crippled demo.

## Opener

D10 looked at first like a straightforward feasibility call: can a LoRA-adapted small model fit on iPhone hardware for training, not just inference? I ran the memory math — base model weights, adapter weights, gradient state, activations, framework overhead — across configurations and hardware tiers. Under current constraints the answer was no: three blockers, none small. But before I closed the decision, I wrote out the alternatives — server-side fine-tuning using the structured summaries the proxy already receives, and federated preference-only updates using the thumbs-up-thumbs-down signal that's already shipping. And that's when the actual decision surfaced. Privacy is not symmetric between inference and training. A user who consents to "generate a reflection from my data" is not necessarily consenting to "train a model on my data," even on the same data. The two operations have different privacy implications. So the right move wasn't to pick the most feasible option. It was to defer the training architecture until the framework landscape moves — MLX is actively developed, an upstream contribution might reopen the on-device option — and in the meantime build only the work that's settled regardless: the evaluation corpus, the inference architecture, the feedback mechanism.

## Punchline

Deferring is the right move when the cost of wrong is high, the alternatives have meaningfully different cost surfaces, and the work that's settled doesn't depend on resolving them.

## Arc beats

- *Context.* D10 had to answer how the personalization adapter gets updated, against a free-tier product strategy (D9) that wanted on-device personalized brief reflections at zero marginal cost and zero new privacy surface.
- *Constraint.* Three candidates: Option A (on-device training during charging), Option B (server-side fine-tuning with structured summaries), Option C (federated preference-only updates from feedback signals).
- *Options analyzed.* Option A: most privacy-aligned but three blockers on current iPhone hardware (no iOS training framework, BGProcessingTask memory ceiling, MLX runtime overhead). Option B: simplest engineering but expands the consent surface — the data was consented for inference, not training. Option C: strongest privacy narrative but preference signals are sparse and binary, convergence may be too slow.
- *Choice.* Defer. Document the open question explicitly. Build the work that's settled — the evaluation corpus is 1,200 positive examples, model-agnostic, training-architecture-agnostic, and produces value regardless of which option lands. Inference of a pre-trained adapter is well-established on the target hardware regardless of training location.
- *Principle identified.* Privacy is not symmetric between inference and training. The D6 consent flow was designed for inference; repurposing consented data for training without re-consent undermines it. Whatever training architecture lands must respect this.
- *Lesson.* Premature commitment to one of three candidates would have either over-engineered (Option A under current constraints) or quietly degraded the privacy story (Option B without re-consent). The deferral isn't indecision — it's recognizing that the decision-relevant information hasn't arrived yet, and structuring the work so that arrival changes one decision rather than rebuilding the system.

## Verify

- [VERIFY] DECISIONS.md D10: three options (A on-device, B server-side, C preference-based) named with this framing; "Privacy is not symmetric between inference and training" called out as the key principle.
- [VERIFY] d10-memory-feasibility.md: three blockers identified for Option A under current iOS constraints — no iOS training framework, BGProcessingTask memory ceiling, MLX runtime overhead.
- [VERIFY] DECISIONS.md D10 §"What must happen before this decision can be made": MLX contribution exploration, evaluation corpus production (1,200 examples), base model benchmarking.
- [VERIFY] session-d10-memory-feasibility.md: the session prompt that drove the feasibility analysis.
- [VERIFY] Confirm before deploying: the deferral is the current state in DECISIONS.md, not a retrospective framing. The decision genuinely hasn't been made.
