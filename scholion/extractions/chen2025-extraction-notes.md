# Extraction Notes — Chen et al. (2025)

**Date:** 2026-02-24
**Extractions:** chen2025-mortality-predictors.yaml (14 claims), chen2025-symptom-chronology.yaml (11 claims)
**Total claims extracted:** 25
**Annotator:** claude-opus-4-6 + thomas-brady

---

## Time Estimate

The mortality predictors extraction (14 claims, including cross-references) took approximately one focused session. The symptom chronology extraction (11 claims) took a second session of comparable length. Total for both: roughly 2–3 hours of engaged annotation work per extraction, including reading the source material, identifying claims, decomposing them, and writing up the YAML.

**Projected time for a human annotator on a comparable section:** 4–6 hours for a first extraction (longer learning curve on the schema), 2–4 hours once familiar. This estimate matters for the Phase 1 collaborator pitch — an annotator committing to 3–5 papers at 2–3 sections each is looking at 20–50 hours of work. That's a meaningful ask and should be framed honestly.

---

## Where the Extraction Went Smoothly

**Statistical claims mapped cleanly to Toulmin.** Hazard ratios, confidence intervals, and p-values slot naturally into grounds/warrant/qualifier structure. The warrant field consistently surfaced what the p-value actually licenses (association) versus what the prose implies (causation). This is the schema doing real analytical work, not just reformatting.

**The dependency chain was visible.** The mortality predictors argument has a clean tree structure: inclusion criteria → population → statistical method → univariate findings → multivariate findings → synthesis. Each level has an identifiable parent-child relationship. The five dependency types covered most relationships without straining.

**Cross-extraction references worked.** The chronology extraction references method.1 and method.2 from the mortality extraction without duplication. This validates the design choice to extract by argument block rather than by paper section — argument blocks can share foundational claims across extractions.

**Crux identification was productive.** The two foundational cruxes (method.1: induced/coincident definition; method.3: statistical methodology) are genuinely load-bearing. The flip test works: if the definition is wrong, all 25 claims collapse. If the Cox regression is inappropriate, the mortality predictors collapse but the chronology findings (Kaplan-Meier) survive. This kind of structural insight doesn't emerge from reading the paper in prose.

---

## Where the Extraction Got Stuck

**Negative findings resist the schema's positive-assertion bias.** The chronology extraction's core findings are nulls (p=0.543, p=0.228). The schema was designed around claims that assert something is true. A null finding asserts that something was NOT found — which is epistemically different. The absence-of-evidence problem pervades the chronology extraction. The schema captures this in qualifiers and rebuttals, but the status field (IN/OUT/UNDETERMINED) doesn't distinguish between "IN and well-supported" and "IN but an artifact of low power."

**Cross-study comparison is a distinct reasoning pattern.** The paper's central thesis (COVID-19-induced AP is distinct from concurrent AP) rests on comparing its own null findings against positive findings from other studies. This is neither a dependency nor a simple citation — it's an inferential pattern that the five dependency types don't natively capture. I used "purposive" and "conjunctive" as approximations, but neither is quite right.

**Annotator synthesis blurs the author/annotator boundary.** The Balthazar-survival tension (chronology.9) is the most analytically interesting claim in the chronology extraction — and it's not something the authors assert. The schema needs a convention for when the annotator's structural analysis surfaces something the paper doesn't say. The value proposition of Scholion partially depends on this capability, but the current schema doesn't distinguish it from author-asserted claims.

**The session prompt template and schema.yaml diverged.** The session prompt proposes a richer template with confidence, boundary, flip_test, and external_anchor typing. The existing mortality extraction committed to schema.yaml format. I maintained consistency with the existing extraction. The divergence should be reconciled before Phase 1 — some session prompt fields (particularly confidence and external_anchor typing as foundational/contextual) are genuine improvements.

---

## Decisions Made During Extraction

1. **Argument-block scoping, not section scoping.** The chronology extraction spans Sections 3.3, 3.5, 3.7, and parts of the Discussion. This is because the argument about symptom chronology and survival crosses section boundaries. One extraction per coherent argument block is the right unit.

2. **Cross-extraction referencing without duplication.** The chronology extraction depends on method.1 and method.2 from the mortality extraction but doesn't duplicate those claims. This keeps each extraction file self-contained in its argument but connected via claim_id references. Works well for two extractions from one paper; untested for cross-paper dependencies (Phase 1).

3. **UNDETERMINED status for annotator-synthesized claims.** Used UNDETERMINED for chronology.9 (the Balthazar-survival tension) because it's neither a supported finding (IN) nor a contested one (OUT) — it's a structural observation the paper doesn't address. This is a convention that needs to be codified before Phase 1.

4. **Warrant field as the primary analytical contribution.** In multiple claims (mortality.4, mortality.7, mortality.8, chronology.3, chronology.4), the warrant field does more work than any other field — surfacing confounding by indication, noting the De Ritis ratio interpretation, flagging the absence-of-evidence fallacy. This confirms the Toulmin framework's value: the warrant is where implicit reasoning becomes explicit and auditable.

---

## Schema Revision Recommendations for Phase 1

Listed in priority order:

1. **Add confidence field** (high/medium/low). Source: session prompt template. Addresses SF-001 directly.
2. **Add claim_source field** (author_explicit | author_implicit | annotator_synthesized). Addresses SF-002.
3. **Add external_anchor_type** (foundational | contextual). Source: session prompt template. Critical for propagation — only foundational dependencies participate in invalidation cascades.
4. **Allow claim_text as list of spans** with section/page references. Addresses SF-006.
5. **Consider adding comparative dependency type.** Addresses SF-003. Track frequency in Phase 1 first.
6. **Defer causal_interpretation field.** Addresses SF-005 but may be domain-specific. Evaluate across domains in Phase 1.

---

## Assessment Against Session Prompt Success Criteria

- [x] At least 8–12 claims extracted (25 total across two extractions)
- [x] Complete Toulmin decomposition on each claim (all six fields filled)
- [x] Multi-level dependency chain traced (method.1 → method.2 → method.3 → mortality.2 → mortality.6 → mortality.9 = 5 levels)
- [x] At least 2 cruxes identified with flip-test reasoning (method.1, method.3, chronology.5, chronology.6, chronology.8 = 5 cruxes)
- [x] At least 1 foundational external anchor (Revised Atlanta classification, PRISMA guidelines, Cox methodology)
- [x] Schema failure log contains 6 documented failures
- [x] Time estimate included (2–3 hours per extraction; 4–6 hours projected for new annotator)
