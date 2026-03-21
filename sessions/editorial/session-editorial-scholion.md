# Session Prompt: Editorial Pass — scholion.mdx

## Situation

The Scholion essay ("Safety Cases Are Dependency Graphs That Nobody Maintains," 2026-02-06) is the oldest essay on the site and has been substantially superseded by "The Circuitry of Science" (2026-02-25), which reports actual Phase 1 validation work. The essay still functions as the conceptual argument for Scholion, but several sections now read as pre-validation handwaving, and there are discrete AI writing tics throughout.

## Mission

Perform a full editorial pass: strip AI tics, tighten prose, update factual references to reflect that Phase 1 validation has been executed, and add a forward-link to "The Circuitry of Science."

## File

`src/content/writing/scholion.mdx`

## Specific Edits

### AI Tic Removal

1. **Intro roadmap sentence** — "Here's what the evidence says about why this matters, what it would take to validate, and what changes if it works." Delete. The structure speaks for itself.

2. **"The gap matters because..."** — Remove the meta-commentary frame. Lead directly: "The hard part isn't contradiction detection; it's consequence tracing through implicit dependencies nobody has made explicit."

3. **"At its core"** (or equivalent) — Delete wherever it appears. Lead with the claim.

4. **"Each of these claims is contingent on capabilities that haven't been fully validated."** — Reframe from defensive to methodological: tie directly to the kill-condition structure in Phase 1.

5. **"The extraction problem is genuinely hard, but 'hard' is different from 'impossible,' and the gap between current LLM capability and the argument mining state of the art suggests significant room for improvement with well-designed schemas and prompting strategies."** — This is a multi-clause hedge. Cut to something like: "The extraction problem is hard. Current LLM performance on structured decomposition leaves room for improvement, particularly with typed schemas and multi-pass validation."

6. **Overexplained Toulmin enumeration** — "No system currently extracts the Toulmin structure of scientific arguments — the claims, the warrants connecting evidence to conclusions, the backing supporting those warrants, the qualifiers hedging the conclusion, the rebuttals acknowledging counterarguments — and maps the dependency edges between them across papers." Compress: "No system maps the Toulmin structure of individual claims *across* documents, with typed dependencies and crux identification."

### Factual Updates

1. **Add forward-link to Circuitry of Science** — In the introduction, after the problem statement, add a note: "For the first validation work — a detailed extraction of 25 claims from a clinical medicine paper — see [The Circuitry of Science](/writing/the-circuitry-of-science/)."

2. **Validation section** — Rewrite to reflect that Phase 1 has been executed. Change future tense ("Before running any experiments, I'm building...") to past/present tense acknowledging that the medical paper extraction is complete and documented in the companion essay. Reference the six specific schema problems that emerged.

3. **"Six specific problems emerged"** — Either enumerate them briefly (they're in Circuitry Section V) or link directly to that section.

### Structural Tightening

1. **"What Exists and What Doesn't" (Section 02)** — The survey of existing systems (Citation graphs, Scite, AIF, OKRG) followed by what doesn't exist is repetitive. Collapse: show what each handles, identify the empty cell (claim-level dependencies across documents), move on. One paragraph, not three.

2. **"Why I'm Working on This" (Section 06)** — Decide: either expand to show how prototypes and manual extraction led to schema revisions, or point readers to Circuitry for that detail. The current version is caught between two approaches.

### Voice Consistency

The essay starts strong (intro, Mann Gulch) but softens in the survey and validation sections. Tighten:

- **Mann Gulch framing (line 26–27):** "Safety cases at frontier AI organizations have the same structural vulnerability" — name the vulnerability precisely before the analogy. Don't say "same structural vulnerability"; say what the vulnerability is.

- **"Several systems address pieces of this problem"** — This sets up false progress. Lead with what's missing: "Existing systems handle adjacent problems but leave the core gap untouched."

## Constraints

- Do not modify any React island component files
- Do not change frontmatter date
- Preserve all import statements and component placements
- Match existing style (Cormorant Garamond prose, no bullet points in body)
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] All AI tic passages identified above have been addressed
- [ ] Forward-link to Circuitry of Science is present in the intro
- [ ] Validation section reflects past tense (Phase 1 executed)
- [ ] Section 02 is tighter (one paragraph for the survey, not three)
- [ ] `npm run build` passes clean
- [ ] No new imports or dependencies added
