---
project: scholion
shape: failure-mode
agentRelevance: agent
tagline: The eval failed, not the agent — finer decomposition looks like hallucination
questions:
  - "Tell me about an agent failure you didn't see coming."
  - "What's a failure mode that's hard to detect with automated eval?"
  - "How do you tell the difference between a hallucination and a defensible extension?"
handles:
  - "The model produced 9 claims the human annotator didn't. The automated eval said 'hallucinations.' I checked by hand. All 9 were defensible — finer decompositions, not fabrications. The automated check was the failure mode, not the model."
  - "Content-based evaluation is a first-class cost. You can't run a quality eval for structured extraction without budgeting for human review of the novel-output cases. That's the lesson Phase 2 is built around."
  - "The atomicity rule in the schema looks like an exact instruction — 'one logical assertion per claim' — and is actually a soft constraint that admits multiple defensible reads. The model and the human were both right, at different granularities."
---

## Project orientation

Scholion is a system I'm building that extracts the dependency structure of arguments from research papers as machine-tractable graphs — atomic claims, the warrants connecting them, typed edges between them, and which nodes are load-bearing. The substrate is Anthropic structured outputs with Pydantic v2; the gating test is whether the extraction matches a trained human annotator's structural picture.

## Opener

"First-pass extraction came back with 23 claims against the 14-claim ground truth. Nine extra claims. My first reflex was the obvious one — the model hallucinated. So I traced every one of those 9 to source text. Every single one was defensibly extracted. The model had decomposed the inclusion criteria into two claims where the human had collapsed them. It had separated continuous AST/ALT ratio from the dichotomized AST/ALT ≥ 2 cutoff as separate univariate findings — which they are. It had pulled hypoalbuminemia's *loss* of significance under multivariate adjustment as its own explicit claim, which the paper's prose lets you infer but doesn't state cleanly. None of these were hallucinations. They were finer decompositions, and they made the dependency graph more accurate, not less."

## Punchline

The failure mode here wasn't the agent's — it was the eval's. The obvious automated check ("did the extraction add claims the GT doesn't have?") fires on the same input as a real hallucination, and the only thing that disambiguates them is content-level review.

## Arc beats

- Hypothesis: extra claims beyond the ground truth are hallucinations. The eval should flag them.
- Outcome diverged: 9 extra claims. Each defensible against source text — splits of the inclusion criteria, of the dual-reviewer screening process, of the statistical method's SPSS version detail, of the multivariate findings into per-predictor claims plus the synthesis claim, and three limitation facets that the paper's prose names without separating.
- Mechanism diagnosed: the human annotator and the model are both making atomicity calls — what counts as one claim vs. two. The schema's atomicity rule says "one logical assertion per claim," but "one assertion" is ambiguous between coarse and fine reads of the same text. The model made finer reads. The human made coarser reads. Both are valid under the schema's instructions; neither is wrong.
- The eval blind spot: an automated check that compares claim counts or even claim IDs will report both "9 hallucinated claims" and "9 missing dependency edges" on this run — the same legitimate behavior shows up as two different failure modes under ID-level matching. (See Story 2 for the structural-path-matching reframe.)
- Adjustment, layer 1: read the 9 novel claims by hand. Document each one in `spike-evaluation.md` §"Novel Findings" — six are author-text-supported splits, three are defensible structural observations about limitations. None are hallucinations.
- Adjustment, layer 2: DEC-012's "Crux identification works but requires content-based evaluation" — codify the rule that the eval pipeline cannot rely on ID matching alone. Content review is a first-class eval cost. Phase 2's benchmarking has to budget for it.
- Lesson: the agent failure modes most worth codifying are the ones the obvious automated check *cannot* distinguish from legitimate behavior. ID-matching is fast and wrong; content review is slow and necessary. The eval methodology has to acknowledge that cost explicitly.

## Verify

- [VERIFY] The 9 novel claims, enumerated — confirmed in `spike-evaluation.md` §"Novel Findings": method.4 (Cox regression framework), method.5 (SPSS / two-tailed p-value), mortality.10 (AST/ALT adjusted), mortality.11 (hypoalbuminemia loss of significance), mortality.12 (surgery adjusted), mortality.13 (three-predictor synthesis), limitation.3 (etiology classification), limitation.4 (short-term outcomes only), limitation.5 (heterogeneity mitigation).
- [VERIFY] "No hallucinated claims — all 23 extracted claims are traceable to source text" — confirmed in DEC-012 evidence section.
- [VERIFY] The "Granularity mismatch is the main discrepancy, not structural error" framing — confirmed in DEC-012.
- [VERIFY] The split of AST/ALT continuous vs. ≥ 2 as defensible separate univariates — confirmed in DEC-012 example.
- [CONJECTURE] that the by-hand content review took ~30–45 minutes for the 9 cases. Be honest if pressed: I didn't time it; the cost was real but bounded for one paper. The scalability of content-review-as-eval-cost is exactly what Phase 1's three-paper corpus is testing.
