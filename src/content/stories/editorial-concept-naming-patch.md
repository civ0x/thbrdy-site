---
project: editorial
shape: failure-mode
agentRelevance: agent
tagline: When the diagnostic is right, the fix is usually in the exception structure
questions:
  - "Walk me through a time you debugged an agent's behavior."
  - "How do you handle agent regressions when the diagnostic looks right but the output is wrong?"
  - "Tell me about a feedback loop you built."
handles:
  - "I had an agent that correctly identified a pattern and incorrectly removed the writer's load-bearing concept — the diagnostic was right, the exception list was incomplete."
  - "I codified a rule for distinguishing concept-naming from jargon — based on a structural signal in the surrounding prose, not on semantics."
  - "There's a class of agent failures where the right fix isn't in the trigger, it's in the exception — and you need the exception to be detectable from surface features, not from inferred intent."
---

## Project orientation

The editorial skills project. Sentence Clarity is the first skill — five diagnostics for sentence-level prose problems (em-dash depth, subject-verb proximity, nominalization scan, stress position audit, old-to-new flow). The agent loads the SKILL.md when invoked, reads a passage, applies the diagnostics, proposes revisions.

## Opener

Iteration 2 of Sentence Clarity passed almost everything — assertion grading hit 94%. But eval 2 had a quiet miss the assertion didn't catch. The original passage included the sentence "This is premature legibility at institutional scale." The with-skill agent's revision replaced "premature legibility" with "the core pattern." It scored well on the surface — shorter, fewer nominalizations — but it had killed the writer's analytical move. The skill had trimmed the actual payload.

## Punchline

The diagnostic was firing correctly on the surface pattern. The exception list was incomplete, so the agent couldn't tell concept-naming from jargon — and the fix wasn't a better diagnostic, it was an explicit exception with a structural signal.

## Arc beats

- Hypothesis: the nominalization diagnostic was over-applying.
- Outcome diverged: not over-applying in the general case — it correctly preserved other nominalizations in the same paragraph. It was specifically wrong about "premature legibility."
- Mechanism: Diagnostic 3's "when to keep" exceptions covered backward linkage, familiar concepts, length, and existential copulas — but didn't cover the case where the writer is *crystallizing* a pattern from preceding evidence with a precise label.
- Adjustment: added exception (e) — concept-naming nominalizations, identified by a structural signal ("This is X" labeling construction following an evidence chain). The exception isn't "keep all nominalizations near 'this is'" — it's "when the nominalization is the analytical payload the writer just earned, protect it."
- Verification: reran eval 2 with the patched skill. Agent now explicitly identifies "premature legibility" as a concept-naming move, cites exception (e), protects it, and targets the actual stumble point (a passive colon expansion elsewhere in the paragraph). Also preserved a parallel construction in a different test case.
- Lesson: when an agent fails on a specific case the diagnostic looks right for, the fix is usually in the exception structure, not the trigger. And the signal needs to be structural enough that the agent can detect it without re-deriving the writer's intent each time.

## Verify

- [VERIFY] Concept-naming miss + patch → `STATUS.md` lines 36–41.
- [VERIFY] Rerun verification → `STATUS.md` line 40 (also notes GPT-4o sentence preservation).
- [VERIFY] Patched output location → `sentence-clarity-workspace/iteration-2/eval-2-dense-paragraph/with_skill_v2/`.
- [VERIFY] Exception structure → `sentence-clarity/SKILL.md` Diagnostic 3, exception (e).
- [VERIFY] Aggregate iter-2 score 94% → `STATUS.md` lines 51–54.
