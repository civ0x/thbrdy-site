---
project: silicon-golem
shape: problem-and-method
agentRelevance: adjacent
tagline: The latency mitigation became the lesson
questions:
  - "Tell me about a time a constraint produced a better design than the unconstrained version would have."
  - "How do you handle a feature that violates a principle you can't relax?"
  - "When has solving a UX problem accidentally taught the user the thing the system was supposed to teach?"
handles:
  - "When has a constraint forced a better design than the unconstrained version?"
  - "Tell me about a UX mitigation that became the pedagogy."
  - "How do you handle a non-negotiable principle that collides with a feature you can't cut?"
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

I had a hard pedagogical constraint baked into the system: code execution has to produce visible feedback in under 30 seconds, or the kid disengages — that number comes from the game-design literature, and I was treating it as non-negotiable. Building in Minecraft is fine; blocks appear instantly. But survival-mode tasks like mining a stack of cobblestone or smelting a batch of iron take real wall-clock minutes. And the conceptually richest challenges — functions-as-recipes, conditionals-as-survival-decisions, loops-as-batch-processing — lived in exactly the mode that broke the rule.

## Punchline

Instead of cutting survival challenges or shortening the rule, I added "abstracted execution" as the Phase 3+ mitigation — the bot announces it's going to work off-screen and returns a function call with a return value the kid can act on — and it turned out to be the single best on-ramp for teaching what abstraction *is*, because the kid experiences a function as a black box that produces a result, which is exactly what abstraction means; the latency mitigation became the lesson.

## Arc beats

- Problem framing: ADR-002 splits challenges into building (creative, fast visual feedback) and survival (resource management, longer feedback loops). Survival is conceptually richer but threatens the 30-second feedback principle, which is non-negotiable per disengagement risk.
- Worked example: kid asks bot to gather 20 oak logs. Naive impl: bot walks, chops, walks, chops; kid stares at a frozen panel for two minutes; engagement collapses.
- Method: two mitigations conditioned on the kid's stage. Phase 1-2 kids get *narrated execution* — bot chats real-time progress while working ("placing block 1... block 2..."). Phase 3+ kids get *abstracted results* — "I'll go mine while you build, be back in a bit"; kid sees the function call and the return value, not the execution.
- Technical layer: orchestrator detects kid phase from the learner model; chat agent switches narration mode; bridge protocol surfaces enough progress state for either rendering to feel honest.
- Analog: a crafting table is a black box — materials in, item out, internals invisible. The function-as-black-box concept arrives as the *solution* to a latency problem, not as a lesson the kid is asked to sit through. The Phase 3+ kid has already internalized "function = black box that returns something useful" before the system ever names the concept.
- Lesson: when a pedagogical constraint and a feature collide, the right move is often not to relax the constraint or cut the feature — it's to find the mitigation that teaches the concept the violation would have required.

## Verify

- [VERIFY] `DECISIONS.md` ADR-002 §"The Feedback Loop Problem" — confirms two mitigations (narrated execution, abstracted results) and phase gating ("Phase 1-2 kids should see execution (narrated). Phase 3+ kids benefit from abstraction.").
- [CONJECTURE] Whether "abstracted execution" maps to a real implementation in `golem/orchestrator.py` and `prompts/chat_agent.md` §"Narration During Execution" vs. design intent only. chat agent prompt has the narration tiers; I should verify the orchestrator actually flips modes based on learner stage.
- [VERIFY] `LEARNER_MODEL.md` — confirm what "Phase 3+" maps to in the current 7-stage taxonomy (none → exposed → read → modified → authored → debugged → composed). ADR-002 predates LEARNER_MODEL.md, so the terms may not align cleanly.
- [CONJECTURE] `prompts/challenge_agent.md` §"Timing and Pacing" — "feedback within 30 seconds." This is a project-internal heuristic, likely inspired by Gee's regime-of-competence rather than a specifically cited number. Don't claim a literature source without verifying.
