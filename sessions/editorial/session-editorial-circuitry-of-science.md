# Session Prompt: Editorial Pass — the-circuitry-of-science.mdx

## Situation

The Circuitry of Science essay (2026-02-25) is the most technically detailed essay on the site — the actual Phase 1 validation work for Scholion. Voice is strong overall with a few residual tics, some meta-signposting, and one section with light redundancy.

## Mission

Remove meta-signposting, tighten transitions, compress one redundant passage, and verify one factual reference.

## File

`src/content/writing/the-circuitry-of-science.mdx`

## Specific Edits

### AI Tic Removal

1. **"This is not merely a workflow optimization."** — "Not merely" is throat-clearing before the actual claim. Delete this sentence. Start with: "The absence of domain priors may be a structural advantage for the decomposition task."

2. **"The deeper implication is not organizational. It concerns oversight."** — Meta-signposting. Delete the first sentence. Start with "The central problem in AI safety is asymmetric evaluation..." (or whatever the actual claim is on that line).

3. **"The answer is not known yet. But the question is now precise enough to answer empirically."** — Hedging at the essay's close. Rewrite to active voice: "This is an empirical question. Phase 1 provides initial evidence. The test happens next."

4. **"Precisely the kind of arguments safety cases contain"** — "Precisely" is a tic. Delete the word.

5. **"In the past year, this has moved from a conceptual proposal to an operational framework"** — Vague temporal anchor. Be specific: "By early 2026" or give the actual timeframe.

6. **"Honest accounting"** — in "The extraction stress-tested the schema and produced an honest accounting of where it works and where it does not." Replace: "The extraction revealed where the schema works and where it breaks down."

### Structural Tightening

1. **Section II → III transition** — Abrupt jump from methodology explanation to application. Add one bridging sentence: "To test whether this works across domains remote from AI safety, we applied it to clinical medicine."

2. **Section IV redundancy** — The safety case dependency-tracing logic is explained twice (once as motivation, once as application). Merge into one cohesive paragraph. Keep the application version; cut the motivation restatement.

3. **Surgical intervention findings (lines 59–65)** — Three separate findings are each explained in detail. Lead with the Balthazar-survival tension (most analytically novel), then fold the other two as supporting observations. Tighter.

### Factual Verification

- **"Anthropic's Responsible Scaling Policy (v3.0)"** — Verify this is still the current version. If a v3.1 or v4.0 has been released since Feb 2026, update.
- **"The UK AI Security Institute (formerly AISI)"** — Verify the name change is finalized.

### Passive Voice

Several instances of passive voice that could be active:
- "is rendered" → "the system renders" or "you render"
- "is coded" → "we coded"

These are minor but accumulate. Fix where natural.

## Constraints

- Do not modify any React island component files or annotation YAML
- Do not change frontmatter date
- Preserve all import statements, component placements, and annotation markers
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] All five meta-signposting / tic passages addressed
- [ ] Section II → III bridge added
- [ ] Section IV redundancy merged
- [ ] Factual references verified (RSP version, UK AISI name)
- [ ] `npm run build` passes clean
