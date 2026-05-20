---
project: scholion
shape: star-with-design-decision
agentRelevance: agent
tagline: Context engineering is the substrate; topology is downstream
questions:
  - "Tell me about a multi-agent system you've built."
  - "What did you learn from building agentic systems before the current tooling existed?"
  - "What's the load-bearing question when you're designing an agentic workflow?"
handles:
  - "The hackathon was the build that taught me context engineering is the substrate. Topology is secondary, and it converges fast once the inputs are right."
  - "Pre-MCP, June 2024 — the primitives were messages, system prompt, appended context. That constraint made the design question literal: of the things that *could* be in the agents' working set, which actually need to be?"
  - "Same principle runs through Scholion. The paper's argument structure, the schema, the prior extractions as constraint — those are the inputs the model reasons against. Topology comes second."
---

## Project orientation

AI in Motion / Lab Automation Hackathon — Studio45, San Francisco, June 2024. Hardware in the room: an OpenTrons Flex liquid handler (wet-lab pipetting robot), a Cephla microscope (capture and image analysis), bring-your-own LLM orchestration. About 50 builders, ~10 teams, 48 hours. The challenge was to maximize experiment throughput on a wet-lab protocol while maintaining quality.

## Opener

"I'm going to put this in the era it was built — June 2024, function calling and tool calling were nascent, MCP wouldn't ship for another four or five months. The primitives we had were managing messages, the system prompt, and appended context. That constraint shaped everything. Five-person team — three lab techs, a full-stack engineer, me. We gravitated to roles: lab techs owned the workflow, the engineer owned the runtime and the OpenTrons Python API integration, I owned the context layer — what each agent knew, what documents were in scope, what the system prompts looked like. The question that absorbed most of the 48 hours wasn't agent topology. It was, of the things that *could* be in the agents' working set, which actually need to be, and in what form."

## Punchline

In a multi-agent system, context engineering is the substrate. Topology is downstream — it converges fast once you know what each agent knows.

## Arc beats

- Situation: hackathon, 48 hours, ~50 builders, ~10 teams. OpenTrons Flex + Cephla microscope + LLM orchestration. Wet-lab protocol throughput as the scored outcome.
- Task: turn a high-level experiment intent into hardware-executed steps faster than the manual baseline. Quality has to hold.
- Action — surface narrative: we built a multi-agent system. Agents handled protocol planning, OpenTrons control, Cephla capture and analysis, and the coordination loop tying them together. We explored several workflow shapes over the 48 hours and converged on the ones that ran cleanly end-to-end.
- Action — the design-decision layer underneath: the work that took the time was *what context to put into each agent's working set*. We converged on four categories of context as first-class inputs:
  - **Lab protocol documents** — the experimental protocol as a structured artifact the agents could reason against.
  - **Design-of-experiments documents** — the domain framing for how experiments are constructed, what variables matter, what counts as a valid run. The agents needed to know what they were doing, not just how to do it.
  - **The lab-tech-to-scientist conversation, treated as a data source** — the dialogue between domain expert and operator carried implicit knowledge that wasn't anywhere in the protocol document. Bringing it into the context layer was a deliberate move.
  - **OpenTrons Flex Python API + library documentation** — the hardware-facing surface. The agents needed to know what the API actually supported.
- The constraint that shaped this: in June 2024, the primitives were managing messages, system prompts, and appended context. Topology was *easy* to invent; what was hard was deciding what each agent should know.
- Result: roughly 8× throughput against the lab techs' baseline estimate — hackathon-grade, directionally right, not rigorously measured. First place out of ~10 teams. The deeper result was an operating principle for agentic systems I've carried into Scholion.
- What we didn't build, honestly: explicit long-term memory management, token-efficiency optimization, more efficient workflow patterns we didn't get to explore. Some of this was era constraint; some we'd have done better with more time.
- Lesson, mapped to current work: in Scholion's extraction pipeline, the same principle holds — what context the model has access to (paper structure, the citation graph, prior extractions as constraint) is the design problem; agent topology is downstream. It's the same "never dispatch without context" instinct in a different domain.

## Verify

- [VERIFY] Event details (AI in Motion / Lab Automation Hackathon, Studio45 SF, June 2024, OpenTrons-sponsored, ~50 builders / ~10 teams, 48 hours, 5-person team) — confirmed verified 2026-05-17 in `prep/onebrief-scholion-story-portfolio.md` Story 4 [VERIFY] block, ✅.
- [VERIFY] Team composition (Thomas + full-stack engineer + three lab techs; Thomas owned context, FSE owned runtime, lab techs owned workflow) — confirmed verified 2026-05-17.
- [VERIFY] Result (~8× throughput estimated, first place ~10 teams, hackathon-grade rigor) — confirmed verified 2026-05-17, ✅.
- [VERIFY] The four context categories (lab protocol docs, design-of-experiments docs, lab-tech-to-scientist conversation as data source, OpenTrons API + library docs) — confirmed verified 2026-05-17 as the actual architectural arc.
- [VERIFY] Important: the earlier "peer-to-peer first → rebuild around coordinator" framing was inferred, not accurate. Use the context-engineering substrate framing. Cory heard the older framing in the HM screen; if Eric or Tim asks about it, acknowledge the evolution: "I've been thinking about this more since I framed it earlier — the deeper lesson is context engineering."
