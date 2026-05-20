---
project: notice
shape: star-with-design-decision
agentRelevance: agent
tagline: A prompt's examples are a silent precondition on the data regime
questions:
  - "Tell me about a time a prompt failed in a way you didn't anticipate."
  - "How do you debug a prompt that's producing the wrong kind of output, not the wrong content?"
  - "Walk me through how you'd handle the cold-start problem in an AI-integrated product."
handles:
  - "There's a class of prompt failures where the prompt's own examples are the problem — they teach the model the wrong implicit precondition."
  - "Cold-start in an AI-integrated product is mostly a prompt-design problem, not a model-capability problem — the model can handle thin data fine if you tell it explicitly how to handle it."
  - "I drove the fix with three fictional payloads at distinct density tiers, which is also how I'd think about evals for this layer going forward."
---

## Project orientation

Notice is the Apple Watch and iPhone interoceptive-awareness app — user taps when they notice an internal shift, the app generates contemplative reflections from the data over time. The system prompt is the contemplative reflection layer's source of behavior.

## Opener

I had the system prompt working well in my head — I'd hand-tested it against rich-history payloads and the reflections were exactly the register I wanted. Then I read it again with cold eyes and saw the failure. Every example in the prompt referenced patterns over time. "Third time this week." "Remarkably consistent for two months." "You've labeled this 'anxious' but your note says..." But the product has a cold-start problem. Snap one through about ten have thin or zero history, and the prompt was implicitly trained on the rich case. So at snap #1, Claude would either generate vacuous affirmation — "you noticed something, that's the practice" — or it would force-profound, hallucinating patterns that weren't there. I sat down with three fictional payloads at deliberately different density tiers — first snap ever, fifth snap, twenty-fifth snap — ran the current prompt against each, and iterated until the reflections were right at every density. The fix was an explicit Snap Depth Awareness section: sparse one-to-three, thin four-to-fifteen, rich twenty-plus, with distinct Claude behavior at each tier and explicit guidance not to overfit thin data.

## Punchline

When a prompt's examples implicitly assume a data regime, the prompt has a silent precondition — and the model will fail in characteristic ways on inputs outside it.

## Arc beats

- *Situation.* Notice's system prompt was working well on the rich-history case I'd been testing against, but the product ships into the cold case where users have one to three snaps and no real history.
- *Task.* Produce a reflection that's appropriate at snap #1 without either vacuous affirmation or pattern hallucination.
- *Action — surface.* Generated three fictional payloads at deliberately different density tiers — payload A with zero history, B with five snaps, C with twenty-five — and ran the current prompt against each style (.brief / .exploratory / .weekly) where applicable.
- *Action — design decision.* Two options: keep the prompt as-is and let the cloud model adapt at runtime; add an explicit calibration section. I picked the calibration section, because adaptation-at-runtime under-determines the model's behavior and the failure modes are characteristic — vacuity at sparse, overfitting at thin. The fix has to be structural.
- *Result.* Snap Depth Awareness section added: sparse tier focuses on validating the noticing act and the quality of attention; thin tier holds simple recurrences very lightly; rich tier opens the full Dam Model pattern vocabulary. Length budgets and example reflections per tier.
- *Cost of the chosen path.* The Snap Depth Awareness section commits me to a tier taxonomy — three explicit regimes with their own length budgets and example reflections, each of which has to evolve as real user snap-density distributions surprise the boundaries. The tier definitions are now part of the prompt's contract; moving them is a prompt change with downstream behavior implications, and any future eval has to be schema-versioned against the tier vocabulary.
- *Lesson.* The prompt's examples are part of its instruction surface — examples in the rich regime teach the model implicitly that rich is what it sees. Explicit calibration beats inferred calibration every time the input distribution has known structure.

## Verify

- [VERIFY] docs/cold-start-session-prompt.md: three fictional payloads, density tier definitions (sparse 1–3 / thin 4–15 / rich 20+), evaluation criteria.
- [VERIFY] docs/notice-claude-system-prompt-v1.md and notice-foundation-v3.md §6: Snap Depth Awareness in the production prompt; DECISIONS.md confirms "Snap Depth Awareness tiers" as decided.
- [VERIFY] Confirm before deploying: the iteration described is a designed session prompt; if asked about specific failures it caught, ground in the payloads in cold-start-session-prompt.md rather than invented examples.
