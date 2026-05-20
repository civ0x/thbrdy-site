---
project: editorial
shape: outcome-reframe
agentRelevance: agent
tagline: Outcome evals can't measure where the agent systematizes intuition
questions:
  - "How do you know an agent is actually better than the baseline?"
  - "Tell me about an eval result that surprised you."
  - "What are the limits of outcome-based evaluation for agents?"
handles:
  - "I had a zero-delta eval result that taught me more than the +50% wins."
  - "Outcome-based agent evals have a ceiling: they can measure where the agent *prevents errors*, they can't measure where the agent *systematizes intuition*."
  - "The integration test reframed what 'works' meant for one of my skills — the unit evals were the wrong shape."
---

## Project orientation

Five editorial skills. Each had three test cases — clean prose (restraint test), real problem (diagnostic test), user-misdiagnoses-themselves (pushback test) — run twice per case, with and without the skill. Fifteen evals per skill. Assertions graded by LLM judges.

## Opener

Four of the five skills produced clean deltas — +33% to +53% improvements with the skill on. The fifth, Visual-Verbal Integration, came back at 14 out of 15 both ways. Zero delta. My first read was that the skill was broken. The synthesis from Tufte, Mayer, and Victor wasn't earning its place. Then I looked at *which* cases each variant failed, and the picture flipped.

## Punchline

The evals were measuring output quality, not reasoning quality — so when the base model already had strong intuition, the codified version couldn't show up on the scoreboard even though it was doing real work the eval wasn't designed to see.

## Arc beats

- The standard framing: an agent skill is worth shipping if it beats the baseline on the eval suite.
- What actually happened on VVI: with-skill 14/15, without-skill 14/15. Failures were complementary — the without-skill variant proposed additions to a clean diagram; the with-skill variant under-rated a real signaling gap as "adequate with minor gaps."
- First reframe: the base model has strong default reasoning about visual-verbal integration. The skill codified what the model already knew intuitively. So the assertion framework — which scores output, not reasoning — couldn't see the skill's contribution.
- Second reframe: skills add value where they provide *categories the base model lacks*. The base model lacks a stable audience-vs-architecture distinction → the skill earns +53%. The base model has stable visual-vs-prose intuition → the skill earns 0%, even if it codifies the right framework.
- Third reframe — the one I didn't see until the integration test: in isolated evals, VVI looked redundant. In an integration run on a real 4,500-word essay with four planned diagrams, VVI produced three findings no other skill caught — contiguity, decorative-vs-load-bearing, prose-as-diagram overlap. The unit evals were too simple to surface the work the skill actually does at integration scope.
- Lesson: outcome-based evals can't measure reasoning-quality, consistency across sessions, or value at integration scope. If you ship purely on outcome deltas you'll over-trim the skills that systematize intuition the base model already has.

## Verify

- [VERIFY] VVI 14/15 / 14/15 result → `STATUS.md` lines 167–173 and 175–181.
- [VERIFY] Complementary failure modes → `STATUS.md` line 177; `RETROSPECTIVE.md` lines 27–31.
- [VERIFY] Base-model-competence inverse correlation table → `RETROSPECTIVE.md` lines 69–77.
- [VERIFY] Integration test reveals VVI value → `integration-test-silicon-golem.md` lines 99–107 and findings 3, "Notation Bridge diagram contiguity," "Fleet Mirror decorative," "Execution Pipeline overlap" (lines 40–60).
