---
project: pop-ai
shape: design-decision
agentRelevance: agent
tagline: The system prompt isn't the briefing — it is the work
questions:
  - "Show me a system prompt you're proud of."
  - "What do you spend the most time on when you're building an agentic workflow?"
  - "How do you keep an agent from hallucinating facts inside a long-form draft?"
handles:
  - "The drafting prompt for this essay is a hundred and thirty lines because every line in it is paying for an error I'd otherwise re-make."
  - "I treat the system prompt as the highest-leverage artifact in any AI-integrated workflow."
  - "There's a section in my drafting prompt that's literally called 'corrections to enforce.' Every line is a postmortem."
---

## Project orientation

PopAi is a weekly newsletter I write. For longer pieces I draft with an agent — meaning the drafting prompt is doing most of the work, and the prompt itself is the artifact I iterate on hardest.

## Opener

The trust-boundary essay had a lot of moving parts — three named CVE incidents, a five-step dependency-chain argument, a parallel between AI plugin ecosystems and npm supply chains. I'd already seen the agent get specific facts wrong in prior drafts: a launch date off by two months, a misattribution to MIT instead of Northeastern, a self-assigned CVSS rating treated as official. So I wrote the drafting prompt as a complete program. Five movements with word budgets and specific source material per movement. A voice-constraints section listing every anti-tic by name with the enforced limit. A factual-constraints section that's literally a corrections log — each line is an error caught in a prior draft, now encoded so it can't recur. And a final step: run the anti-tics checklist, count the instances, report them, revise if any limit is violated.

## Punchline

The system prompt isn't the briefing for the work — it is the work. Everything that's not in there gets re-derived, and re-derivation is where drift happens.

## Arc beats

- Context: long-form drafting with an agent, where factual errors and voice drift both compound across passes.
- Constraint: the draft has to be near-publishable without me hand-editing every paragraph for known-failure-modes I've already seen.
- Options considered: post-hoc editing pass (catches errors but doesn't prevent them); shorter prompts with examples (relies on the agent generalizing); fully specified prompt with embedded corrections (verbose but deterministic on the issues I've already seen).
- Choice: fully specified — 130 lines, structured into mission, structural plan with per-movement word budgets, voice constraints with named limits, factual constraints with explicit corrections, self-audit with reporting.
- Tradeoff: prompt is long and slower to iterate on, but the specific failures it prevents stop recurring across sessions. Cheaper than re-catching them downstream.
- Lesson: the "corrections to enforce" section is the most valuable part — each line is a unit of learning compounded back into the harness. The prompt grows as I observe new failure modes; nothing gets forgotten.

## Verify

- [VERIFY] Artifact: `drafting-prompt-trust-boundaries.md` — read the full structure: Mission, Structural Plan (5 movements with word budgets), Voice Constraints (anti-tics with enforced limits), Factual Constraints with "Corrections to enforce:" (8 bullets), final self-audit step.
- [VERIFY] Specific corrections that prove the pattern: "agentskills.io launched December 18, 2025 (not October)"; "Claude DXT… CVSS 10/10 was self-assigned… DO NOT USE"; "Agents of Chaos paper is led by Northeastern/Bau Lab, not MIT/Harvard/Stanford/CMU."
- [VERIFY] Self-audit step: final paragraph — "After drafting, run the anti-tics checklist… Report the counts. If any violate the limits, revise before saving."
- [VERIFY] Output evidence the audit was actually performed: `trust-boundary-essay-handoff.md` reports the counts cleanly.
- [VERIFY] The framing "system prompt is the highest-leverage artifact" is yours from your user preferences — direct quote available.
