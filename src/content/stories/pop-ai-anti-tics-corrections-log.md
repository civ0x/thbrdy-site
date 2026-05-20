---
project: pop-ai
shape: failure-mode
agentRelevance: agent
tagline: A correction is durable only when it's encoded in the harness
questions:
  - "How do you tell when an agent is drifting?"
  - "Give me an example of a feedback loop you built into your own work with agents."
  - "How do you encode a lesson so the next session doesn't re-learn it?"
handles:
  - "I built a corrections log for the way LLMs write, and it's part of every drafting prompt."
  - "The reason my drafts stopped having the AI-tell is that I named the AI-tell."
  - "The feedback loop has to terminate in the system prompt, not in a postmortem."
---

## Project orientation

PopAi is a weekly newsletter where voice is the product. The voice is mine — first-person, forensic, measured — and any drift toward generic AI-newsletter voice undermines the publication.

## Opener

Early drafts kept failing in the same ways. Not surface-level — the structure was fine, the facts were right — but the prose had a tell. Triadic negation: "Not X, not Y, not Z." Theatrical antithesis: "The problem isn't X. It's Y." Anaphoric parallelism: "Some weeks... Some weeks... Some weeks." Surprise-signaling: "what's really interesting is." Each one is the agent reaching for a template instead of building from the thought. I wrote the patterns down as named failures with explanations of why each one is a failure and what to do instead. That list now travels with every drafting prompt, and the prompt requires the agent to run the checklist against its own output and report the counts before returning a draft.

## Punchline

A correction is only durable if it's encoded in the harness — a postmortem in chat is one session away from being forgotten.

## Arc beats

- Hypothesis: agent could be steered toward the publication's voice through stylistic guidance in the system prompt.
- Outcome diverged: the agent produced competent prose with persistent structural tells — the same handful of LLM patterns appearing across pieces despite voice guidance.
- Mechanism: stylistic guidance ("be forensic") doesn't operate at the moment of generation. Named pattern recognition ("don't use triadic negation, defined as X, here's what it looks like, here's what to do instead") does.
- Adjustment: codified each observed failure mode as a named pattern in CLAUDE.md and `editorial-review-rules.md`. The drafting prompt instructs the agent to enforce the limits and run the checklist before returning. Counts are reported. Limits enforced: ≤4 em-dashes per 500 words; ≤3 instances of "structural/structurally" per essay; zero instances of specific phrase-level tics.
- Lesson: the loop that matters isn't drafting → editing. It's drafting → audit → codification of new failure → next drafting prompt absorbs the new constraint.

## Verify

- [VERIFY] Catalog (project-internal): `/Users/thomasbrady/pop-ai/CLAUDE.md` — "Anti-Tics: Patterns to Catch and Kill" (structural, word-level, frequency).
- [VERIFY] Catalog (generalized for any project): `editorial-review-rules.md` — same structure, publication-agnostic.
- [VERIFY] Drafting prompt with explicit enforcement: `drafting-prompt-trust-boundaries.md` — "Voice Constraints" + final "run the anti-tics checklist… Report the counts. If any violate the limits, revise before saving."
- [VERIFY] Proof that audit ran clean on a real piece: `trust-boundary-essay-handoff.md` — opening paragraph reports 0 "structural/structurally," ~1.4 em-dashes per 500 words, 0 "precisely because," 0 "That's the [noun]," no triadic negation, no theatrical antithesis.
- [CONJECTURE] The "tics emerged from observation" narrative is grounded in CLAUDE.md framing them as "patterns to catch and kill"; the specific sequence of which-tic-was-discovered-when is `[CONJECTURE]` unless reconstructed from git history.
