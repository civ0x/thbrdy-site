# Session: Wire Annotation System into Circuitry of Science Essay

## Situation

The site has a working inline annotation system deployed on the Valley of Death essay:
- `Annotation.tsx` shared component in `src/components/islands/shared/`
- `remark-annotations.mjs` remark plugin registered in `astro.config.mjs`
- `valley-of-death.annotations.yaml` companion file with 38 markers in the MDX

The Scholion essay ("The Circuitry of Science") has annotation content ready:
- `scholion/circuitry-of-science.annotations.yaml` — 33 entries (22 terms, 8 references, 3 links)
- `scholion/the-circuitry-of-science.mdx` — essay prose with `<A t="key">`, `<A r="key">`, `<A l="key">` JSX markers already placed

## Critical Issue: Marker Syntax Mismatch

The existing remark plugin (`remark-annotations.mjs`) resolves `[[mode:key|display text]]` markers. The Scholion MDX uses `<A t="key">display text</A>` JSX syntax (spec'd in Scholion DECISIONS.md DEC-009).

**These are incompatible.** You must resolve this before proceeding. Two options:

**(a) Rewrite Scholion MDX markers to match existing syntax.** Convert all `<A t="key">text</A>` to `[[term:key|text]]`, `<A r="key">` to `[[ref:key|text]]`, `<A l="key">` to `[[link:key|text]]`. This requires no plugin changes and keeps one marker syntax across all essays. **Recommended** — the existing pipeline works and consistency across essays is more valuable than the marginally more concise JSX syntax.

**(b) Extend the remark plugin to support both syntaxes.** Add a second parsing pass for JSX-style `<A>` tags. More work, introduces two ways to do the same thing, but preserves the Scholion MDX as-is.

If you choose (a), the conversion is mechanical: there are approximately 32 annotation markers in the MDX. Search for `<A t=`, `<A r=`, `<A l=` and rewrite each. Document the decision in Scholion's DECISIONS.md.

## Mission

1. Copy `scholion/circuitry-of-science.annotations.yaml` to `src/content/writing/circuitry-of-science.annotations.yaml` (companion file pattern — same directory as the MDX).

2. Resolve the marker syntax mismatch (recommend option a).

3. Copy the essay MDX to `src/content/writing/the-circuitry-of-science.mdx` (or update in place if it already exists there). Ensure frontmatter matches the content collection schema:
   ```yaml
   title: "The Circuitry of Science"
   date: 2026-02-24
   description: "Scholion extracts the logical architecture..."
   tags: ["scholion", "epistemology", "safety-cases", "argument-structure", "research-infrastructure"]
   connected_project: "Scholion"
   ```

4. Verify the remark plugin resolves annotations at build time. The plugin auto-injects the `Annotation` import — no manual import needed in the MDX.

5. Build and verify.

## YAML Structure

The annotations YAML follows the same three-section structure as the VoD essay:

```yaml
terms:
  key:
    display: "Display Name"
    definition: >
      Definition text
    badge: "CLINICAL|ARGUMENT|SAFETY"
    badge_color: "var(--teal|--accent|--blue)"

references:
  key:
    title: "Paper Title"
    attribution: "Author et al. (Year)"
    summary: >
      2-3 sentence summary
    context: >
      "In this essay" relevance note
    url: "https://..."
    url_label: "View paper"

links:
  key:
    domain: "example.com"
    title: "Tool Name"
    source: "Organization"
    summary: >
      1-2 sentence description
    url: "https://..."
    cta: "Visit example.com →"
```

Cross-reference with `valley-of-death.annotations.yaml` to ensure field names match exactly. The remark plugin expects specific field names — any mismatch will silently fail to render.

## Annotation Density

33 annotations across ~4,170 words (~1 per 127 words). Section IV (safety case application) runs denser at ~1 per 80 words because both domain vocabularies collide there. Three badge categories:
- **CLINICAL** (teal, 8 terms): de-ritis-ratio, cox-model, adjusted-hazard-ratio, kaplan-meier, prisma, balthazar-score, wbc, confounding-by-indication
- **ARGUMENT** (accent/gold, 8 terms): toulmin-model, warrant, crux, invalidation-propagation, transitive-closure, flip-test, atomic-decomposition, absence-of-evidence
- **SAFETY** (blue, 6 terms): safety-case, inability-argument, superalignment, model-organisms, gsn, scalable-oversight

## Verification

- [ ] `npm run build` passes clean
- [ ] Essay appears at `/writing/the-circuitry-of-science/`
- [ ] Annotated terms render with dashed underline (`1.5px dashed var(--accent)` for terms, `var(--teal)` for links)
- [ ] Hover on desktop triggers popover with correct content
- [ ] Term popovers show badge + display name + definition
- [ ] Reference popovers show title + attribution + summary + context + source link
- [ ] Link popovers show domain + title + summary + CTA
- [ ] Badge colors: teal for CLINICAL, accent for ARGUMENT, blue for SAFETY
- [ ] Only one popover open at a time
- [ ] Mobile: popovers render as bottom sheets
- [ ] No console errors
- [ ] Annotation count matches: 33 markers in MDX, 33 entries in YAML

## Dependency Note

This session is independent of the diagram port session. Both can run in parallel. However, the MDX file will be touched by both sessions (this one for annotations, the other for diagram component imports). If running in parallel, one session should go first on the MDX — recommend this annotation session goes first since it's simpler, then the diagram session updates the same file with component imports.

## Files to Read

1. `CLAUDE.md` — site conventions
2. `STATUS.md` — current state, annotation system details
3. `src/content/writing/valley-of-death.annotations.yaml` — working example of YAML format
4. `src/content/writing/valley-of-death.mdx` — working example of marker syntax (first 50 lines sufficient)
5. `remark-annotations.mjs` — the remark plugin (understand marker resolution)
6. `scholion/circuitry-of-science.annotations.yaml` — the annotation data to wire in
7. `scholion/the-circuitry-of-science.mdx` — the essay with markers to convert
8. `scholion/DECISIONS.md` — DEC-007, DEC-009 for annotation architecture context
