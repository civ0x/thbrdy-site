# Session: Schema v0.1 → v0.2 Reconciliation

**Date created:** 2026-02-24
**Status:** Ready for execution
**Kickoff:** Read this file, then execute.

---

## Task

Update the Scholion annotation schema from v0.1 to v0.2 by adding three fields identified during the Chen et al. (2025) extraction work, then backfill both existing extraction files.

## Context

Read these files first:
- `scholion/CLAUDE.md`
- `scholion/DECISIONS.md` (especially DEC-004)
- `scholion/schema.yaml`
- `scholion/extractions/chen2025-schema-failures.yaml` (especially SF-001, SF-002, SF-004)
- `scholion/extractions/chen2025-mortality-predictors.yaml`
- `scholion/extractions/chen2025-symptom-chronology.yaml`

---

## Step 1: Update schema.yaml

Add three new optional fields to the per-claim template, placed after `status` and before `notes`:

```yaml
confidence: ""          # high | medium | low — author's expressed certainty
external_anchor_type: "" # foundational | contextual
                         # foundational = claim fails if anchor is wrong
                         # contextual = background/definition, claim survives without it
claim_source: ""         # author_explicit | author_implicit | annotator_synthesized
```

Update the version comment at the top from v0.1 to v0.2. Add a changelog comment explaining what changed and why (reference DEC-004 and SF-001/SF-002/SF-004). Update the "Known Schema Limitations" comment block at the bottom to note which limitations are now partially addressed.

## Step 2: Backfill both extraction files

Add the three new fields to every claim in both extraction files. Infer values from what's already in the `qualifier`, `warrant_type`, `notes`, and `external_anchor` fields:

- `confidence`: `high` for claims with strong statistical backing (tight CIs, large effects), `medium` for significant but imprecise findings (wide CIs, small n), `low` for null findings in underpowered analyses or annotator-synthesized observations
- `external_anchor_type`: `foundational` if the claim would collapse without the anchor (e.g., Revised Atlanta classification for method.1, Cox methodology for method.3), `contextual` if the anchor provides background only (e.g., PRISMA guidelines for method.2)
- `claim_source`: `author_explicit` for claims with direct textual support and `warrant_type: explicit`, `author_implicit` for claims where the warrant or proposition was reconstructed by the annotator, `annotator_synthesized` only for chronology.9 (the Balthazar-survival tension)

Do not change any existing field values. Only add the three new fields.

## Step 3: Update STATUS.md

Mark the "Reconcile schema.yaml with session prompt template" line item as complete. Update the schema.yaml description in "What Exists" to say "v0.2, 17 fields per claim."

---

## Constraints

- Do not modify CLAUDE.md or DECISIONS.md
- Do not create new files
- Do not change the structure or content of existing fields
- Preserve all existing comments in all files
- Back up schema.yaml and both extraction files before modifying them (copy to `.bak` suffix)
- Show a `git diff` or equivalent summary of all changes before committing anything — do not commit
