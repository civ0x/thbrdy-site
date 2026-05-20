---
project: notice
shape: design-decision
agentRelevance: agent
tagline: Context durability across fresh agents is state capture, not memory
questions:
  - "How do you keep an agent on track for a multi-day task without context degradation?"
  - "Have you used subagents? When are they actually worth the coordination cost?"
  - "Walk me through how you'd architect a complex agent workflow with state that spans sessions."
handles:
  - "I designed the audit as a five-session execution plan with a progress file as the durable state across fresh agents — the progress file is closer to a transcript-replacement than a checklist."
  - "There's a verifier-bootstrap pattern in there I think is worth talking about — Session 1 runs the verifier as an inline Task, Session 4 runs it as a persistent subagent, and the install boundary is the discriminator for whether the upgrade worked."
  - "The case for subagents is mostly two cases — fresh-eyes review and recurring workflow encapsulation — and the audit needed both."
---

## Project orientation

Notice is the interoceptive-awareness app I'm building on iOS, and the harness audit is a meta-pass over the agent harness I use to drive the build. The audit's design ended up as a five-session execution plan because the audit itself is the kind of task that decays badly in one long context.

## Opener

The audit had to do a lot: substrate inventory, classification, drafting seven skill files, drafting four hook scripts, drafting four subagent definitions, formally verifying the whole plan, and applying a closing edit to CLAUDE.md after the replacements landed. One session would have decayed by the time it got to verification. So I designed it as five sessions, each opening with a fresh Claude Code conversation, each reading the same three docs in the same order: spec, execution plan, progress file. The progress file is the durable state — every session reads it first and writes it last, and a second-pass agent reading it cold can answer "what just happened" and "what's next" without the transcript. The verifier subagent is the second move. The audit recommends its own work; without a fresh-context check, the human is the only validator. So I defined a harness-verifier subagent that independently classifies a weighted sample of rules and flags placement disagreements. There's one wrinkle: the verifier itself is installed in Session 3, so Session 1 has to run it as an inline Task using the same system prompt text the persistent definition will get. Single source of truth lives in the execution doc, both invocations reference it, edits propagate to both.

## Punchline

Context durability across fresh agents is a state-capture problem, not a memory problem — and the verifier subagent is what keeps the audit from grading its own homework.

## Arc beats

- *Context.* The audit has to traverse classification, drafting, formal verification, and closing edits — too much for one session to hold without quality decay.
- *Constraint.* Each session opens with a fresh Claude Code conversation; the prompt seed is the entire user-turn-one with no implicit prior context.
- *Options.* One long session and accept decay; ten micro-sessions and accept coordination overhead; five sessions aligned to the spec's Phase 1 / Phase 2 / Phase 3 reversibility ladder.
- *Choice.* Five sessions, with Phase 3 split across three because each ends at a clean install-and-verify boundary that doesn't compress without losing the boundary's value.
- *Verifier bootstrap.* Session 1 invokes the verifier as an inline Task because the persistent .claude/agents/harness-verifier.md isn't installed until Session 3. The system prompt text is captured once in the execution doc and referenced by both call sites — same content, different invocation pattern.
- *Install discriminator.* Session 4's first non-orientation step is to confirm the persistent verifier registered correctly; if invocation silently falls back to inline Task because the file isn't there, the verification has tested nothing. The install boundary between Session 3 and Session 4 is the entire reason Session 4 is its own session.
- *Lesson.* Subagents earn their cost two ways: fresh-eyes reasoning (the parent is anchored on its output and can't reliably audit it) and recurring multi-step workflows (the protocol shouldn't be reconstructed from CLAUDE.md and skill content each invocation). The verifier is the first case; the session-closer is the second.

## Verify

- [VERIFY] HARNESS_AUDIT_EXECUTION.md §"Cross-session conventions": progress file path `/Users/thomasbrady/Notice/HARNESS_AUDIT_PROGRESS.md`, verifier-bootstrap pattern, single-source-of-truth subagent prompt section.
- [VERIFY] HARNESS_AUDIT_EXECUTION.md Session 4 §"Install precondition check": "This check is the entire reason Session 4 is its own session rather than a tail step of Session 3."
- [VERIFY] HARNESS_AUDIT_SPEC.md §4: two conditions justifying a subagent — fresh-eyes reasoning, recurring multi-step workflow.
- [VERIFY] HARNESS_AUDIT_EXECUTION.md §"Subagent system prompts": four definitions live in the execution doc as the single source of truth (harness-verifier, copy-reviewer, privacy-auditor, session-closer).
- [VERIFY] Confirm before deploying: this is a designed execution plan; the five sessions have not all been run end-to-end yet. If the interviewer asks about execution outcomes, be honest that the design is in place and the early sessions are validated; the full run is the next move.
