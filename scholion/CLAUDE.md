# Scholion — Agent Guidelines

## What This Is

Scholion is a system for extracting claim-dependency structures from research documents and maintaining them as machine-tractable graphs. This directory contains the annotation schema, extraction prototypes, and governance docs. No software exists yet — this is Phase 0.

The roadmap lives at `../scholion-roadmap.md` in the parent repo. It is the source of truth for phasing and scope.

## Current Phase: 0 (Orient & Scope)

Phase 0 produces: a finalized annotation schema, a single end-to-end extraction prototype, and governance docs. No code. No pipelines. No graph infrastructure.

## Extraction Conventions

### Schema Fields

Every extracted claim uses this structure (see `schema.yaml` for the canonical template):

- **claim_id**: Hierarchical ID — `[paper_short].[section].[n]` (e.g., `chen2025.mortality.3`)
- **claim_text**: The verbatim text from the source, minimally edited for atomicity
- **atomic_proposition**: A single, falsifiable restatement. One logical assertion per claim. If a sentence contains two assertions, split it into two claims
- **dependency_type**: One of `causal`, `conditional`, `purposive`, `contrastive`, `conjunctive`. If none fits cleanly, use the closest and flag in `notes`
- **depends_on**: List of claim_ids this claim requires to hold
- **warrant**: The implicit or explicit reasoning connecting evidence to claim. Often unstated in the source — the annotator must surface it
- **warrant_type**: `explicit` (stated in text), `implicit` (reconstructed by annotator), or `domain_convention` (standard practice in the field)
- **backing**: The methodological or theoretical framework that authorizes the warrant
- **qualifier**: Conditions under which the claim holds (scope, population, confidence level)
- **rebuttal**: Conditions under which the claim would fail
- **external_anchor**: Citation, dataset, or empirical referent. Format: DOI, PMID, or descriptive string
- **crux**: Boolean — is this a load-bearing dependency? (If it falls, does significant downstream structure collapse?)
- **status**: `IN` (accepted/supported), `OUT` (contested/refuted), or `UNDETERMINED`
- **notes**: Free text for annotator judgment calls, ambiguities, schema edge cases

### Dependency Types

| Type | Meaning | Example |
|------|---------|---------|
| `causal` | A directly causes or produces B | "SARS-CoV-2 infection causes pancreatic injury" |
| `conditional` | A is a precondition for B to hold | "Mortality prediction requires exclusion of alternative etiologies" |
| `purposive` | A supports or enables the goal of B | "Multivariate regression controls for confounders to isolate independent predictors" |
| `contrastive` | A argues against or limits B | "Small sample size limits generalizability of hazard ratios" |
| `conjunctive` | A and B together support C (neither alone sufficient) | "Elevated WBC AND AST/ALT ratio ≥ 2 together characterize high-risk patients" |

### Atomicity Rules

1. One logical assertion per claim. "X and Y are both predictors" becomes two claims
2. Statistical findings include the specific values: HR, CI, p-value, n
3. Methodological claims (how the study was done) are claims too — they ground the empirical findings
4. If a claim has a qualifier embedded in it ("In COVID-19-induced cases, X predicts Y"), extract the qualifier as a separate field, not as part of the atomic proposition

### What Not To Do

- **Do not build software.** Phase 0 is schema design and manual extraction. The temptation to automate before the schema is validated is the biggest risk
- **Do not design a database schema.** That is Phase 3. The graph substrate decision depends on Phase 1-2 findings
- **Do not create an extraction pipeline.** That is Phase 2. It requires manual ground truth from Phase 1
- **Do not create web interfaces, APIs, or visualization tools.** Phase 4+
- **Do not commit to a single theoretical framework.** Toulmin is the starting point, not the final answer. The schema should be testable and revisable
- **Do not over-engineer the schema.** Handle common cases well, flag hard cases for human judgment. The six problems from manual extraction (non-atomic claims, negative dependencies, circular structures, weighted support, hidden counterfactuals, taxonomy misfit) should be acknowledged, not all solved upfront
- **Do not hallucinate claims.** Every extracted claim must be traceable to specific text in the source document. Include page/section references
- **Do not infer dependencies that aren't structurally present.** If the author doesn't connect two claims, don't connect them. Flag suspected implicit dependencies in notes

### File Organization

```
scholion/
├── CLAUDE.md          # This file — agent guidelines
├── STATUS.md          # Current project state
├── DECISIONS.md       # Decision log
├── schema.yaml        # Canonical annotation template
└── extractions/       # Completed extractions
    └── chen2025-mortality-predictors.yaml  # First prototype
```

Extractions are named `[paper_short]-[section].yaml`. One file per extraction unit (typically a section or coherent argument block, not a full paper).
