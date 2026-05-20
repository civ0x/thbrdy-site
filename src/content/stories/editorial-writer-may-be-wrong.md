---
project: editorial
shape: star-with-design-decision
agentRelevance: agent
tagline: One paragraph gave the agent permission to contradict the user
questions:
  - "When have you built an agent that pushes back on the user?"
  - "How do you handle the case where the user is asking for the wrong thing?"
  - "Tell me about a constraint you wrote into a system prompt that mattered."
handles:
  - "There's a class of agent failure where the user gives you a symptom, you treat it as a directive, and you do worse than nothing."
  - "I codified a 'writer may be wrong' clause into four of five skills — it's the bit of the system prompt that gives the agent permission to contradict the user."
  - "The signature trace was an eval flipping from 2/5 to 5/5 from a single paragraph change in the harness."
---

## Project orientation

A project to build five agent skills for structured editorial review. The skills load when the user invokes them, read the passage and the user's request, and produce a diagnosis-plus-revision response.

## Opener

I had an eval where the prompt was a writer saying "my transitions feel weak, can you tighten them?" — but the transitions were actually working. They used parallel structure and implicit chain-links instead of explicit connectives. In iteration 1, the skill-guided agent did what agents do — took the user at their word, proposed bridge paragraphs and connectives, scored 2/5. The unguided baseline did the same. The skill wasn't winning because both variants assumed the user's self-diagnosis was correct.

## Punchline

I added one paragraph to the harness telling the agent that the writer may be wrong about their own work — and the eval flipped from 2/5 to 5/5.

## Arc beats

- Situation: Flow & Coherence eval 3 — user prompt asks to fix transitions that actually function correctly. With-skill iteration 1 scored 2/5, no better than baseline.
- Task: figure out whether the diagnostics were wrong or the constraint structure was wrong.
- Action-surface: revise the SKILL.md, specifically the triage gate and the forcing function.
- Action / design-decision layer: added a "writer may be wrong" override — explicit instruction that when the writer reports a symptom, the agent's job is to test whether the symptom is real before treating it as a directive. Added language protecting parallel structure and implicit chain-links as legitimate connective devices.
- Result: iteration 2 agent pushed back ("your transitions are working correctly, here's why") instead of inventing fixes. Eval flipped to 5/5. Same override propagated into Architecture Review (where it caught a writer proposing to weaken a strong instability opening) and Audience Calibration (where it caught a writer flagging honest qualifiers as hedging).
- Cost, named: the override lives in four of five skills, not all five. Sentence Clarity — the fifth — doesn't get it, because pushback is correct for diagnosis-level skills where the user might be wrong about what's wrong, and incorrect for execution-level skills where the user is asking for a specific mechanical repair. Applied to Sentence Clarity, the override would have the agent litigating against a writer's request to fix a comma splice. The override pays for itself in diagnosis; it would cost in execution. The asymmetry is the design.
- Lesson: most agent skills assume user knows what they want. For domains where the user routinely misdiagnoses their own problem, that assumption is the failure mode. The override has to be explicit, because the default agent posture is deference.

## Verify

- [VERIFY] Eval flip 2/5 → 5/5 (exact quote) → `RETROSPECTIVE.md` line 59. Iter1-vs-iter2 narrative table → `STATUS.md` lines 79–84.
- [VERIFY] Override language → `flow-coherence/SKILL.md` (Triage Gate, "writer may be wrong" instruction).
- [VERIFY] "Four of five skills include it" → `RETROSPECTIVE.md` lines 53–57.
- [VERIFY] Architecture Review propagation → `STATUS.md` line 102 (override included) and line 106 (eval 3 "opening-pushback").
- [VERIFY] Audience Calibration propagation → `STATUS.md` line 131 (override included) and line 135 (eval 3 qualifier pushback).
