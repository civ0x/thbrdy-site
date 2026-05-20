---
project: silicon-golem
shape: failure-mode
agentRelevance: agent
tagline: A one-paragraph prompt rule survived an "inevitable" design assumption
questions:
  - "Tell me about a time real user behavior diverged from what your design predicted."
  - "What's an example of an eval or feedback loop in your agent work that produced a codified rule?"
  - "When have you found the smallest possible mechanism solved a problem you thought needed a bigger one?"
handles:
  - "Walk me through a real shipped → observed → adjusted cycle in an agent system."
  - "How do you turn an agent failure mode into a codified rule that survives a session boundary?"
  - "Describe a fix where the right move was changing the system prompt, not the surrounding code."
---

## Project orientation

Silicon Golem is a Minecraft companion bot I built for my kid. It joins their Minecraft world, takes natural-language commands, generates Python that does what they asked, runs it, and shows the code in a side panel the kid can edit. Under the hood it's a Node.js Mineflayer bridge, a Python orchestrator, and a small fleet of Claude models with different roles.

## Opener

On April 9th I ran the first end-to-end playtest of the system. Everything worked mechanically — bot joined the world, took commands, generated Python, blocks appeared, the code panel rendered the code. The whole pedagogical theory of the system depended on a Director-to-Modifier transition — the kid sees the code, notices a value they want to change, edits it, re-runs. I'd been treating that transition as inevitable. It just didn't happen.

## Punchline

Visible code wasn't enough — the kid needed both a salient value and a signal of editability — so I added one in-character habit to the chat agent prompt: about one in three successful commands, the bot names a modifiable value as something it noticed about its own internals ("I used cobblestone for that — you can swap it in my code if you want"), backs off after the kid's first edit, and never fires during an active challenge directive.

## Arc beats

- Hypothesis: visible generated Python in a side panel will pull the kid from Director → Modifier on its own; the design (ADR-001, GOLEM_SDK.md walkthrough) assumed this transition was natural.
- Outcome diverged: 2026-04-09 smoke test, panel rendered correctly, kid stayed at Director — too many unguided steps between "code is on screen" and "code is mine to touch."
- Mechanism: two missing affordances — *salient value* (which thing in 30 lines am I supposed to look at?) and *editability signal* (is this thing even mine?). Neither was supplied by the panel alone.
- Adjustment: ADR-008 written and shipped same afternoon. The mechanism is a behavioral rule in the chat agent system prompt — frequency ("~1 in 3"), tone examples, what NOT to say (no "try changing," no "variable," no "code panel"), backoff after first modification, suppression during active challenge directives.
- Why I codified it in the prompt rather than as a UI feature: the cost is a paragraph of system prompt, it stays in character, it doesn't introduce a separate UX surface, and future-me reading the prompt understands why the rule exists, not just that it does.
- Lesson: design assumptions about "natural" user transitions need a catalyst; the catalyst should be the smallest mechanism consistent with the existing frame; and the corrections-log entry — the ADR plus the prompt rule together — is what makes the fix durable rather than re-litigated.

## Verify

- [VERIFY] `DECISIONS.md` ADR-008 — date (2026-04-09), context, decision, frequency ("Roughly 1 in 3 successful commands"), tone examples, the explicit constraints list, rationale, revisit triggers.
- [VERIFY] `STATUS.md` §"Smoke Test Complete (2026-04-09)" — the smoke-test fixes list and the "Design finding" paragraph naming the curiosity bridge.
- [VERIFY] `prompts/chat_agent.md` §"Pointing to the Code (The Curiosity Bridge)" — confirm the rule actually wired into the chat agent prompt, frequency rules, backoff, and the do/don't list.
- [VERIFY] Git: `7571182` (Smoke test fixes), `ec35a09` (Update STATUS.md and DECISIONS.md after smoke test), `78b42b3` (Update CLAUDE.md with ADR-008 reference) — all 2026-04-09 between 13:15 and 13:30 PT.
- [VERIFY] The CSS bug fixed in the same commit (`color: transparent` on `.code-highlight`) is a separate UI bug, not a design correction. Don't conflate.
