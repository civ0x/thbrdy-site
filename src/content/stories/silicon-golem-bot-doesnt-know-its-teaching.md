---
project: silicon-golem
shape: design-decision
agentRelevance: agent
tagline: Don't give the executor the script if you don't want it performed
questions:
  - "Why would you separate planning from execution in an agent system?"
  - "How do you keep an agent's voice consistent when the system is pursuing a goal the agent doesn't share?"
  - "Walk me through a design choice you made about what context an agent should — and shouldn't — have."
handles:
  - "Tell me about a time you used context-window scope as a design tool."
  - "How would you design a system where one agent plans and a different agent executes — and what does the planner hand to the executor?"
  - "When have you found that the right fix was withholding information from a model, not adding it?"
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

I was building this companion and I'd given the bot a very specific personality — a Minecraft golem, a bit slow on the uptake, doesn't really understand its own code, just runs it. Underneath, the system also has to do something pedagogical — manufacture moments where a concept like loops becomes visible. The first thing I tried was one prompt that knew both. The voice collapsed almost immediately: the moment the bot had the plan, it started performing the plan, sounding like a tutor — exactly the register I'd designed against.

## Punchline

I split it into two agents and gave the executor amnesia: the planner (Opus, async) produces the full four-beat challenge as one JSON artifact, the orchestrator owns the state machine, and the chat agent (Haiku) sees one beat at a time and never the arc — so the bot literally can't sound like a tutor because it doesn't have the information to be one.

## Arc beats

- Goal: an in-character Minecraft companion that nonetheless executes a multi-beat kishōtenketsu structure (introduction / development / twist / resolution) when the learner model says a concept is ripe.
- Failure mode of the obvious design: one agent receiving both personality prompt and full challenge plan starts performing its own pedagogy — "let's see what happens when we change the variable" — which is exactly the tutor register I'd banned.
- Mechanism: full-arc visibility leaks into voice. The model performs the plan instead of inhabiting the character.
- Adjustment: hard role separation. Challenge agent produces a full JSON artifact (target_concept, target_stage, four beats with concrete observable triggers, success/failure/abort signals). Orchestrator owns the state machine, watches world events and learner events, dispatches one beat directive at a time to the chat agent.
- Constraint design: beat triggers must be programmatically observable from world state, learner events, or chat messages — not subjective LLM judgments — so the orchestrator can fire them deterministically without a second model call.
- Lesson: context architecture is voice architecture. If you don't want an agent to perform a role, don't give it the script.

## Verify

- [VERIFY] `prompts/challenge_agent.md` §"Your Output / Delivery model" — challenge agent produces full artifact as single output; orchestrator dispatches beats.
- [VERIFY] `prompts/chat_agent.md` §"Challenge Engine Directive (Optional) / Directive lifecycle" — chat agent sees one beat at a time, returns to default if no new directive arrives.
- [VERIFY] `CLAUDE.md` §"Orchestrator Routing Responsibilities" — orchestrator holds challenge state machine, evaluates triggers, dispatches one beat at a time.
- [VERIFY] `prompts/challenge_agent.md` §"Delivery model" — explicit statement that triggers must be "concrete observable conditions, not subjective assessments."
- [VERIFY] The line "the bot doesn't know it's teaching, because it literally doesn't have the information" appears in `essay/SKELETON.md` §07 and `essay/OUTLINE.md` §05. Confirm I'm comfortable with that phrasing before using it verbatim in an interview.
