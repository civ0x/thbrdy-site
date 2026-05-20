---
project: notice
shape: problem-and-method
agentRelevance: agent
tagline: Move rules down the harness stack, not phrase them more carefully
questions:
  - "How do you think about prompt engineering at scale — say, for a system where the agent operates against a growing project for months?"
  - "What's your view on how much guidance an agent really needs in its system prompt?"
  - "Have you worked on reliability problems where context size was the issue?"
handles:
  - "The way I think about it is that an agent's reliability is determined more by harness architecture than by prompt phrasing — and the harness has layers most people don't use."
  - "I ran an audit on Notice that pulled about 70% of the always-loaded instructions out of CLAUDE.md without losing any behavior, by re-homing them to skills, hooks, and permissions."
  - "I treat CLAUDE.md the way you'd treat a global config file — most of what people put in it belongs in a more specific place."
---

## Project orientation

Notice is an interoceptive-awareness app I'm building for Apple Watch and iPhone — user taps when they notice an internal shift, the app captures biometric and contextual data, then Claude generates a contemplative reflection on the pattern. I drive the build through an agent-driven workflow: planning docs, session prompts, and a working CLAUDE.md that the executing agent reads on every turn.

## Opener

Notice's CLAUDE.md had grown to about 200 lines and 40 instructions, the way these files always do — every time the agent did something wrong, the easy fix was a new line that said "don't do that." But it was costing context on every turn, regardless of whether the rule applied. So I went back and read the recent research on this — there's a 150-to-200-instruction ceiling for frontier thinking models, and smaller models degrade exponentially as instruction count rises. The cost wasn't just tokens. It was that a bloated CLAUDE.md actively reduces the agent's attention to the rules that *are* relevant on a given turn, because the system reminder gives the agent license to discard the bundle when too little of it applies. So I wrote a skill that classifies every CLAUDE.md rule against five axes and migrates it to the cheapest harness layer that preserves its function.

## Punchline

Most rules aren't prompt engineering problems — they're substrate problems. The fix is moving them down the stack, not phrasing them more carefully.

## Arc beats

- *Problem framing.* CLAUDE.md grows monotonically because the cheapest fix to any agent failure is adding a defensive line; nothing repeals stale rules; the file becomes a kitchen sink that costs context every turn.
- *Worked example.* Notice's 194-line file projected down to ~50 lines after the audit — about a 70% reduction in always-loaded tokens and instruction count, with no capability loss, because the rules were re-homed not removed.
- *Method.* Five classification axes: enforcement vs. shaping; universal vs. trigger-conditional; reference vs. instruction; blast radius; agent-writable vs. human-only. The first four say *where* the rule belongs; the fifth says *how the audit ships its proposal*.
- *Technical layer.* Five harness layers ordered by cost: CLAUDE.md (every turn) → skills (description-matched on demand) → slash commands (user-invoked) → hooks (event-fired shell scripts) → permissions (deterministic deny). Subagents sit alongside for fresh-eyes review and recurring workflows.
- *Analog.* It's the same move as moving validation out of business logic into the type system, or moving feature flags out of code into config: same correctness, different layer, much cheaper to maintain.

## Verify

- [VERIFY] HARNESS_AUDIT_SPEC.md §1: 60–70% projected reduction; instruction-following ceiling 150–200 (arXiv:2507.11538 via Wilson, HumanLayer 2025-11-25).
- [VERIFY] HARNESS_AUDIT_SPEC.md §2: five axes named exactly above.
- [VERIFY] HARNESS_AUDIT_SPEC.md §1: harness stack ordering (CLAUDE.md → skills → slash commands → hooks → permissions).
- [VERIFY] HARNESS_AUDIT_SPEC.md §6: Notice migration's first-pass residual (~70 lines / ~1800 tokens) and second-pass residual (~50 lines / ~1300 tokens / ~12 instructions).
- [VERIFY] Confirm before deploying: this is a designed audit, not yet a measured one. The 70% is projected from the spec's worked example, not from a post-migration measurement.
