---
project: notice
shape: failure-mode
agentRelevance: agent
tagline: A taxonomy that ignores what the agent can write where is imaginary
questions:
  - "Tell me about a time you discovered something important about an agent system by trying to use it."
  - "What's a failure mode in agent design that's easy to miss until you hit it?"
  - "How do you validate that an agent's plan is actually executable?"
handles:
  - "I had a taxonomy that looked complete on paper but missed the agent-writable axis until the audit tried to apply its own proposals."
  - "There's a clean lesson here about probing substrate before designing on top of it — turns out Bash can create new files under .claude/ but Edit and Write refuse the whole tree, and that asymmetry changes everything about how the audit ships."
  - "The discovery was a corrections-log entry that became a classification axis."
---

## Project orientation

Notice is an interoceptive-awareness app on Apple Watch and iPhone, and I drive the build with a CLAUDE.md plus a small set of harness components under .claude/. The audit work was a meta-pass over that harness.

## Opener

I had what I thought was a complete classification taxonomy for the audit — four axes covering enforcement, universality, reference vs. instruction, and blast radius. I started writing the migration plan and got to the part where the audit ships the agent-applicable changes. That's when I hit it. Bash heredoc could create new files under .claude/ — a new hook script, a new agent definition — but the Edit and Write tools refused all paths under .claude/ entirely, and Bash itself couldn't modify or delete existing files there. So the audit's classification was right but its proposals weren't always shippable. Some changes the agent could just execute. Others needed paste-ready artifacts for me to apply by hand. That asymmetry forced a fifth axis.

## Punchline

A taxonomy of an agent system that doesn't account for what the agent can write where is a taxonomy of an imaginary system, not the real one.

## Arc beats

- *Hypothesis.* Four classification axes — enforcement-vs-shaping, universal-vs-trigger-conditional, reference-vs-instruction, blast-radius — were sufficient to decide *where* each rule belongs.
- *Outcome diverged.* The classification told the audit where to put the rule, but didn't tell it whether the proposal could be executed or had to be handed back to a human. Proposals to amend existing .claude/ files landed in a different operational regime than proposals to create new files.
- *Mechanism.* The Notice substrate exposes the asymmetry sharply: Edit and Write tools blanket-refuse all paths under .claude/, but Bash heredoc can create new files in some .claude/ subdirectories. So new components are agent-shippable; amendments to existing ones aren't. A substrate probe — try to write a no-op test file — surfaced this directly.
- *Adjustment.* Added the agent-writable-vs-human-only axis. The audit now tags every proposed migration with one of three application modes: *agent-applies*, *agent-proposes-human-applies*, or *agent-flags-for-review*. Paste-ready artifacts with target path, full final content, and ordered apply steps ship for anything that isn't agent-applicable.
- *Lesson.* Don't trust your model of the harness; probe it before classifying. Substrate behavior is empirical, not declarative.

## Verify

- [VERIFY] HARNESS_AUDIT_SPEC.md §2 final paragraph: the agent-writable-vs-human-only axis description and the three application-mode tags (*agent-applies*, *agent-proposes-human-applies*, *agent-flags-for-review*) and "Skipping this tagging is the failure mode that surfaced the axis in the first place."
- [VERIFY] HARNESS_AUDIT_SPEC.md §6 Phase 3: the manual cleanup line `rm /Users/thomasbrady/Notice/.claude/hooks/.test-write` confirms a write-probe was actually run, not just hypothesized.
- [VERIFY] Confirm before deploying: this is best framed as a design-time discovery surfaced by the write-probe, not as a runtime production failure.
