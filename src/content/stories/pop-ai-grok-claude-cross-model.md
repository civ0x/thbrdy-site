---
project: pop-ai
shape: failure-mode
agentRelevance: agent
tagline: Named failure modes are strong — audience reminders are weak
questions:
  - "When do you use different models for different parts of a workflow?"
  - "Talk me through a time you observed an agent failing in a specific way and what you did about it."
  - "What do you do when the model writes editorial conclusions you didn't ask for?"
handles:
  - "I run two different models in the pipeline and the interesting work is in the prompts, not the model choice."
  - "Every observation about how Grok was failing turned into a specific negative instruction in the next version of the prompt."
  - "Audience reminders are weak. Named failure modes are strong."
---

## Project orientation

PopAi is a weekly newsletter I write. The research pipeline runs across three lanes — tools, culture, governance. Each lane has a prompt that searches X/Twitter for the week's developments. The scanning runs on Grok (X integration); the editorial work runs on Claude.

## Opener

I had three prompts running weekly scans across three lanes. Tools came back clean — concrete, product-focused, low noise. Culture came back with insider framing despite explicit audience reminders — phrases like "post-strike playbook" that the PopAi reader wouldn't decode. Governance came back over-clustered: six of ten items on the same dominant story, because the "already covered" exclusions were keyed to individual events rather than story arcs. And across all three: Grok hallucinated some post URLs and wrote editorial conclusions I hadn't asked for — "this is a leading indicator," "foreshadows AI entities as cultural participants." That's the editor's job. The model's job is structural facts and open questions.

## Punchline

Each observed failure became a specific constraint in the next version of the prompt — "describe story arcs, not events," "provide structural facts, not interpretation," "spot-check links" — and the same failures stopped recurring.

## Arc beats

- Hypothesis: a single prompt template per lane, with audience reminders and a "this week's focus" section, would produce usable curation candidates.
- Outcome diverged: three distinct failure modes — register drift (culture prompt), story-arc collapse (governance prompt), and unsolicited editorializing (all three).
- Mechanism: the prompts were specifying the goal but not specifying the failure modes the model would default to. Audience reminders are weak signals next to the model's prior toward analytical framing.
- Adjustment: revised each prompt to encode the observed failure as an explicit negative instruction — "already covered" exclusions describe arcs not events; "provide structural facts and open questions, not interpretation"; "spot-check links."
- Lesson: model selection is the cheaper part. The expensive part is observing the specific way a given model fails on a given task and codifying the constraint. Same principle as the editorial-tics work, applied across the harness boundary to a different model. [CONJECTURE: the model-selection framing — "Grok for scanning because X integration, Claude for editorial because reasoning depth" — is mine, not documented in the artifacts.]

## Verify

- [VERIFY] Observations log: `session-prompt-newsletter-design.md` — "What we learned from testing the Grok prompts" (5 bullets covering tools/culture/governance behavior, hallucinated URLs, unsolicited editorializing).
- [VERIFY] Prompts: `grok-prompts.md` line 10 — confirmed exact constraint: "Give me structural facts and open questions, not editorial conclusions. I write the interpretation."
- [VERIFY] "ALREADY COVERED" exclusion blocks appear at lines 39, 86, 133 — one per lane — confirming the per-lane revision pattern.
- [VERIFY] Caveat: the artifact confirms the constraints are in the prompts. It doesn't separately confirm the chronology (revisions were made in response to specific observed failures). The narrative comes from `session-prompt-newsletter-design.md`'s "What we learned" section, which describes the failures pre-revision.
- [CONJECTURE] Model-selection narrative ("Grok for X integration / Claude for editorial") is `[CONJECTURE]` — grounded in the practical reality that Grok has X access, but not stated as an explicit tier-selection decision in any artifact I've read. The cross-pollination claim (this is the same pattern as the anti-tics work, applied to a different model) is yours to make — the structural parallel is real but the artifacts don't draw it explicitly.
