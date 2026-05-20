---
project: editorial
shape: design-decision
agentRelevance: agent
tagline: The biggest gain came from "What This Does NOT Cover"
questions:
  - "Walk me through an architectural decision you've made for an agent system."
  - "How do you decide what belongs in one prompt versus split across several?"
  - "When is more context worse than less context?"
handles:
  - "I split a 'do everything' skill into five constrained ones, and the biggest measured gain came from a section called 'What This Does NOT Cover.'"
  - "Cross-level conflation — applying a tool from the wrong layer of the stack — is the failure mode I design against first in any multi-agent system."
  - "If you can't articulate what the skill *won't* do, you don't have a skill, you have a holistic-review default with extra steps."
---

## Project orientation

The editorial skills project. Five agent skills, one per level of the writing stack: sentence mechanics → paragraph flow → essay architecture → audience calibration → visual-verbal integration. Each loads independently when invoked by name.

## Opener

The natural design was one big "writing review" skill — five sections of a single SKILL.md covering everything from sentence rhythm to argument structure. I almost did that. Then I started thinking about what the agent would actually do at runtime: it would load the whole thing, read the user's passage, and pick whichever level seemed most salient. Which is exactly how the unguided base model behaves. The monolithic skill wouldn't be adding scope discipline — it would just be reformatting the same drift.

## Punchline

The biggest delta in my evals — a +53% jump on audience calibration — came not from a better diagnostic but from preventing the agent from applying the wrong diagnostic. The skill's "What This Does NOT Cover" section was doing more work than the diagnostics themselves.

## Arc beats

- Context: choosing between one comprehensive editorial-review skill versus five level-specific skills.
- Constraint: each SKILL.md has a soft 500-line ceiling. A monolithic skill would exceed that and the triggering description couldn't accurately describe what it covers.
- Options: (a) one skill with reference files per level; (b) five skills with explicit non-overlapping scope.
- Choice: five skills, each with an explicit "What This Skill Does NOT Cover" section as load-bearing as the diagnostics.
- Trade-off: more files to maintain, more triggering edges to tune. Pays for itself the moment a passage has, e.g., an audience problem that *looks* like an architecture problem.
- Evidence: Audience Calibration eval 2 — without-skill baseline scored 0/5 by conflating audience calibration with architecture review (proposed headline reordering when the actual problem was unexplained medical terminology). With-skill scored 4/5. The skill's value was almost entirely "stay in your lane."
- Lesson: scope boundaries between agents/skills are not organizational — they're the mechanism that prevents cross-level conflation, which is the most damaging failure mode in any layered agent system.

## Verify

- [VERIFY] D1 decision rationale → `DECISIONS.md` lines 3–8.
- [VERIFY] 0/5 baseline on Audience Calibration eval 2 → `STATUS.md` lines 142, 150; `RETROSPECTIVE.md` lines 45–51.
- [VERIFY] "What This Skill Does NOT Cover" sections → present in all five SKILL.md files (e.g., `visual-verbal-integration/SKILL.md` scope boundary).
- [VERIFY] +53% delta language → `RETROSPECTIVE.md` lines 47, 70–77 (the inverse-correlation table).
