# Session Prompt: Circuitry of Science v4 — RSP/Sabotage Report Integration

**Date:** 2026-02-25
**Scope:** Prose edits to `scholion/the-circuitry-of-science.mdx`, Section IV primary, Section V minor
**Depends on:** v3 draft (current state of the file)
**Does not touch:** Sections I, II, III, VI, VII. No diagram components. No new files.

---

## Situation

Anthropic released RSP v3.0, a full Risk Report, and a Sabotage Risk Report on 2026-02-24 — the same day the essay was drafted. The essay's Section IV references these documents but at a policy-summary level. The actual structure of the documents validates the essay's thesis more concretely than the current text exploits. Four targeted edits will sharpen the argument without changing the essay's architecture or significantly increasing word count.

Source documents (all in `scholion/`):
- `Anthropic's Responsible Scaling Policy (version 3.0).pdf` (RSP v3.0)
- `Sabotage Risk Report Claude Opus 4.6 (1).pdf` (Sabotage Report)
- `Redacted Risk Report Feb 2026.pdf` (full Risk Report)
- `thesis.pdf` (Khan dissertation — "Safe Automated Research," UCL, July 2025)

---

## Mission

Execute four edits to the essay in priority order. Net word increase target: ~300 words. The essay is currently ~3,870 words; keep it under 4,200.

### Edit 1: Rewrite Section IV, paragraph 2 (the RSP reference paragraph)

**Current text (line 66):**
> Anthropic's Responsible Scaling Policy (v3.0) restructured around safety cases as living documents, with ASL-3 safeguards activated and sketches of ASL-4 safety case components published alongside a pilot Sabotage Risk Report with independent review.

**Problem:** This summarizes what was published but misses the structural innovation. The deeper move is the shift from ASLs-as-checklists to argument-based standards.

**What the replacement must convey:**
1. The RSP v3.0 restructured its industry-wide recommendations around *requiring strong arguments* rather than specifying ASL requirements in advance. The actual phrasing in the RSP is: "Our recommendations for industry-wide safety are thus structured around requiring analysis and arguments making a strong case for safety, rather than AI Safety Levels." Use this or paraphrase closely.
2. The RSP explicitly acknowledges the gap this creates: "one actor's view of what constitutes good risk assessment and mitigation may be very different from another's." This is the Scholion use case stated in institutional language — the quality of safety arguments becomes the load-bearing question, and there is no shared method for evaluating argument quality.
3. The external review requirements (RSP Section 3.6.3) require reviewers to assess "analytical rigor" and "whether the external reviewer disagrees with any of the Risk Report's key claims." This is structural verification of arguments — exactly what Scholion does.
4. Keep the AISI and January 2026 template framework references that follow in the same paragraph. They still serve the "everyone is converging" point.

**Tone:** The essay voice is precise, declarative, unhurried. No breathlessness about the timing. State what the documents say and let the structural implications be visible.

**Target length:** ~100 words for the RSP portion (replacing ~40 words). The full paragraph including AISI and template framework should not exceed ~180 words total.

### Edit 2: Add a new paragraph after the current "selective invalidation" paragraph (after line 76, before "But the deeper implication is not organizational")

**Purpose:** A concrete structural reading of the Sabotage Risk Report that shows it has the same structural properties as the Chen extraction — making the safety case application tangible, not hypothetical.

**What the paragraph must convey:**
1. The Sabotage Report's central argument rests on four claims: prior expectations about alignment (Claim 1), alignment assessment findings (Claim 2), inability to undermine the assessment (Claim 3), and limited opaque reasoning/agentic capabilities (Claim 4). These are dependency-typed: Claims 2-4 are evidential pillars supporting the top-level safety claim; Claim 1 is a prior that conditions the interpretation of Claims 2-4.
2. The report's Section 7 ("Looking Forward") contains a table that is essentially a hand-built Scholion extraction: load-bearing claims in the left column, invalidation conditions in the right column. Example: "An updated alignment audit reports major new concerning findings" invalidates "we are aware of no dangerous coherent misaligned goals." This is manually constructed invalidation propagation — the same operation the Chen extraction demonstrated on paper.
3. The warrant problem appears here too. Claim 1's key warrant — that continuity between Opus 4.5 and 4.6 implies similar alignment properties — is stated as belief ("we believe that it is very unlikely that the changes in scale and training...") rather than mechanism. A Toulmin extraction would surface this immediately as an implicit warrant, just as the Chen extraction surfaced the confounding-by-indication problem behind surgical intervention as a mortality predictor.
4. Close with a sentence connecting back: "The alignment science team independently converged on this structure because the structural bookkeeping is the hard part — and they are doing it by hand."

**What the paragraph must NOT do:**
- Do not critique Anthropic's safety work. The essay's stance toward Chen et al. is "this is not a critique; it is a structural observation." Maintain the same stance here.
- Do not speculate about what Scholion would find if applied to the full report. State what is visible in the document's own structure.
- Do not introduce the recursive oversight problem (models evaluating their own safety). That argument is not yet grounded enough for this essay.

**Target length:** ~120-150 words.

### Edit 3: Two small additions to the Khan paragraph (line 80)

**3a.** In the sentence that begins "Khan's research programme on safe automated research (2024)..." — add a clause connecting to the "verification over specification" framing. Khan's dissertation reframes superalignment as "creating trustworthy automated research assistants" where verification of outputs replaces specification of behaviors. The RSP's shift from ASLs-as-checklists to argument-based standards is the institutional expression of this same principle. One clause, woven into the existing sentence structure.

**3b.** After the existing paragraph ending "The judge does not need to match the debaters' capability. The structure compensates for the capability gap." — add one sentence noting Khan's honest limitation: debate works well for code and factual domains but struggles with "complex theoretical work" and "abstract alignment theories" (Khan Ch. 6.5). Then one sentence noting that the two-layer annotation model addresses exactly this gap: it decomposes arguments into auditable structural joints even when the substantive claims exceed the verifier's domain expertise. This is not a replacement for debate — it's a complement that operates at the argument level.

**Target length:** ~40 words net addition across both sub-edits.

### Edit 4: One sentence addition to Section V (line 96-97 area)

**Current text discusses:** "The binary IN/OUT/UNDETERMINED status cannot represent epistemic weight."

**Addition:** After the sentence about the confidence field, add one sentence noting that this problem has an institutional parallel: the RSP v3.0 itself acknowledges that capability thresholds proved far more ambiguous than anticipated — models approach thresholds without clearly passing them. The confidence field addresses this at the claim level, but a richer representation may be needed for the same reason Anthropic's own threshold assessments resist binary classification.

**Target length:** ~25 words.

---

## Technical Constraints

- The essay is MDX. Do not modify any component import statements or `<ComponentName />` tags.
- Maintain the existing section numbering (I through VII).
- Do not add footnotes, endnotes, or inline citation apparatus beyond what already exists (parenthetical references like "arXiv 2506.16383").
- Do not add the Lee et al. formal citation (arXiv 2601.22773) in this session — that's a separate task tracked in review notes.
- Do not change any text outside Sections IV and V.

## Voice Constraints

- The essay's register is precise, declarative, and unhurried. No breathless language about timing or validation. No "remarkably," "strikingly," or "powerfully."
- The stance toward all source documents is the same as toward Chen et al.: structural observation, not critique, not celebration.
- Direct quotes from source documents should be brief (a clause, not a sentence) and woven into the essay's own syntax. No block quotes.
- The author's name is not mentioned. The essay speaks in impersonal analytical voice ("The report's central argument..." not "I noticed that...").

---

## Verification Checklist

- [ ] Section IV paragraph 2 now foregrounds the argument-based shift, not the policy summary
- [ ] The RSP's "one actor's view" gap acknowledgment is present
- [ ] External review requirements ("analytical rigor," "key claims") are referenced
- [ ] New Sabotage Report paragraph follows the "selective invalidation" paragraph and precedes the oversight transition
- [ ] Sabotage Report paragraph covers: 4-claim structure, Section 7 invalidation table, Claim 1 warrant problem
- [ ] Sabotage Report paragraph does not critique Anthropic or speculate beyond what the document shows
- [ ] Khan paragraph includes "verification over specification" connection
- [ ] Khan paragraph includes debate limitation + two-layer complement
- [ ] Section V includes institutional parallel for the confidence/threshold ambiguity problem
- [ ] Total word count is between 3,870 and 4,200
- [ ] No changes outside Sections IV and V
- [ ] No component tags modified
- [ ] Essay voice is consistent — no register shifts in new material
- [ ] `npm run build` succeeds (run from repo root: `cd /Users/thomasbrady/thbrdy-site && npm run build`)

---

## After Execution

Update `scholion/the-circuitry-of-science-review-notes.md`:
- Add a **Revision Summary (v4)** section documenting the four edits
- Under **Claims to Verify**, add entries for any new factual claims introduced (RSP quotes, Sabotage Report structure)
- Under **Revision Priorities (Remaining)**, mark the RSP integration as resolved
- Update word count estimate
