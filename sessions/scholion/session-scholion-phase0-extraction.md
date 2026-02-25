# Session: Scholion Phase 0 — First Extraction Prototype

**Date created:** 2026-02-24
**Status:** Ready for execution
**Kickoff:** Read `CLAUDE.md`, `scholion-roadmap.md`, and `session-scholion-phase0-extraction.md`, then execute.

---

## Situation

Scholion is a system for extracting claim-dependency structures from research documents and maintaining them as machine-tractable graphs. The project has a published essay, two methodology exploration documents, and a phased roadmap — but no running code and no completed extraction on any document.

This session produces the **first end-to-end extraction prototype**: a single section of a medical paper decomposed into atomic claims, typed dependencies, warrants, cruxes, and external anchors using a formalized annotation template. This prototype serves three purposes:

1. **Schema validation.** Does the annotation template actually work on real prose? Where does it break?
2. **Cross-domain test.** The paper is clinical medicine, not AI safety. If the schema works here, it's not domain-specific.
3. **Pitch artifact.** A potential annotator needs to see a completed example to understand the task and estimate the time commitment.

**No software is being built in this session.** The deliverable is a structured extraction in a documented format, plus notes on where the schema succeeded and failed.

---

## Target Paper

**Chen, X. et al. (2025). "Comprehensive Analysis of COVID-19-Induced Acute Pancreatitis: From Pathophysiology to Management Strategies." PMC12559807.**

This is a systematic review — claim-dense, with statistical evidence structures, empirical cruxes, and chains of reasoning from inclusion criteria through to clinical recommendations. Structurally different from the AI safety arguments in the original Scholion essay.

**Source:** https://pmc.ncbi.nlm.nih.gov/articles/PMC12559807/

### Why this paper

- Systematic reviews are rich extraction targets: they synthesize multiple studies into conclusions, creating visible dependency chains
- Medical evidence has explicit methodology (inclusion/exclusion criteria, statistical tests) that maps cleanly onto Toulmin structure
- A non-AI domain tests whether the schema is genuinely general
- The paper's three mortality predictors (elevated WBC, AST/ALT ratio, surgical intervention) depend on inclusion criteria, which depend on the distinction between COVID-19-induced vs. coincident pancreatitis — a multi-level dependency chain ready to extract

### Target section

Start with the **mortality predictors analysis** — the section discussing factors associated with mortality outcomes. This is where the paper's most consequential claims live, with clear statistical backing and identifiable warrants.

If the mortality section is too large for a single session, scope down to the **AST/ALT ratio as independent mortality predictor** claim and its full dependency chain. One claim extracted completely is more valuable than five claims extracted partially.

---

## The Annotation Template

This is the formalized extraction format. Each extracted claim gets one record. The format synthesizes the worklog structure from the methodology docs into a machine-readable template.

### Record Schema (YAML)

```yaml
claim_id: "CHEN-2025.{section}.{sequence}"  # e.g., CHEN-2025.4.3
raw_text: "The exact sentence(s) from the paper"

# Atomic decomposition
atomic_propositions:
  - id: "A"
    text: "First standalone assertion"
  - id: "B"
    text: "Second standalone assertion (if compound)"

# Dependency structure
dependency:
  type: "causal | conditional | purposive | contrastive | conjunctive"
  glue_words: "The connecting language from the prose"
  parent_claims: ["CHEN-2025.x.y"]  # Claims this depends on

# Toulmin structure
toulmin:
  grounds: "The evidence cited"
  warrant: "The unstated assumption connecting grounds to claim"
  backing: "What supports the warrant (methodology, convention, prior work)"
  qualifier: "Scope or confidence limitation"
  rebuttal: "Conditions under which the claim fails"

# External anchors
external_anchors:
  - citation: "Author (Year)"
    dependency_type: "foundational | contextual"
    # foundational = claim fails if cited work is wrong
    # contextual = cited work provides background, claim survives without it

# Crux identification
crux:
  flip_test: "If [X] were false, does this claim survive?"
  is_crux: true | false
  crux_of: ["CHEN-2025.x.y"]  # Which higher-level claims depend on this
  load_bearing: true | false   # No alternative support path exists

# Status (Doyle RMS)
status: "IN"  # Default for initial extraction. OUT if evidence contradicts.
confidence: "high | medium | low"  # Author's expressed certainty
boundary: "The scope within which this claim is valid"
```

### Template Notes

- **claim_id format:** Paper identifier, section number, sequence within section. This is a flat namespace — cross-document linking comes later.
- **dependency.type** uses the five types from the methodology docs: Causal (A causes B), Conditional (B requires A), Purposive (A is the tool for B), Contrastive (A conflicts with B), Conjunctive (A and B are independent co-claims).
- **external_anchors.dependency_type** distinguishes foundational dependencies (the claim falls if the citation is wrong) from contextual ones (background, definitions). This is the key to propagation — only foundational dependencies participate in invalidation cascades.
- **crux.load_bearing** means this claim is a single point of failure — no alternative support path exists in the graph. This is what makes crux detection valuable: load-bearing nodes are where research investment should concentrate.

---

## Extraction Process

Follow this sequence for each claim. The methodology docs provide three decomposition methods; use all three as appropriate:

### Step 1: Claim identification
Read the target section. Identify every assertion — sentences that propose a state of the world, a relationship, or a recommendation. Skip pure definitions unless the definition is itself contested.

**Assertion markers:** verbs of certainty ("demonstrates," "is," "predicts"), normative statements ("requires," "must"), logical connectives ("therefore," "consequently," "because").

### Step 2: Atomic decomposition
For each claim, check if it's compound. Apply the **Linguistic Splitter**: break at logical connectives (because, since, while, and). Each atom should contain one independently falsifiable assertion.

### Step 3: Dependency mapping
Identify the "glue" connecting atoms and claims. Classify using the five types. Trace parent-child relationships: which claims does this one depend on? Which claims depend on this one?

### Step 4: Toulmin reveal
For each claim, fill in the six Toulmin fields. The **warrant** is the most important — it's the unstated assumption the author expects the reader to accept. If the warrant is missing or weak, that's where the argument is most vulnerable.

### Step 5: Crux identification
Apply the **Flip Test**: imagine the opposite of this claim is true. Does the paper's conclusion survive? If not, this claim (or the assumption behind it) is a crux. Mark it as load-bearing if no alternative support path exists.

### Step 6: External anchor mapping
For every citation supporting a claim, determine if the dependency is foundational or contextual. If the cited study were retracted tomorrow, does this claim still stand?

---

## Deliverables

### 1. Extraction file
A YAML (or JSON) file containing all extracted claims from the target section, using the template above. File name: `chen-2025-extraction.yaml`

### 2. Dependency graph (text)
A plain-text description of the dependency structure: which claims depend on which, where the cruxes are, and what an invalidation cascade would look like if one foundational claim were challenged. This doesn't need to be visual — a well-structured textual description is fine.

### 3. Schema failure log
A separate section documenting every case where the annotation template couldn't adequately represent the argument structure. These are the most valuable findings — they tell us what needs to change in the schema before Phase 1 begins.

Common failure modes to watch for (from the roadmap):
- Non-atomic claims that resist decomposition
- Negative dependencies ("this claim holds because X is NOT the case")
- Circular structures (A supports B supports A)
- Claims requiring weighted/probabilistic support rather than binary IN/OUT
- Hidden counterfactuals
- Taxonomy misfit (the five dependency types don't capture the actual relationship)

### 4. Extraction notes
Observations on the process: How long did it take? Where did you get stuck? What was ambiguous? What decisions did you make and why? These inform the annotator guidelines that will be needed in Phase 1.

---

## What NOT to Do

- **Don't build software.** No extraction scripts, no graph databases, no pipelines. This is manual intellectual work.
- **Don't extract the entire paper.** Pick one section (mortality predictors) or even one claim chain (AST/ALT ratio). Depth over breadth.
- **Don't design the final schema.** This template is a hypothesis. The point of the extraction is to stress-test it. If fields need adding, removing, or restructuring, that's a finding, not a failure.
- **Don't invent claims.** Extract what the authors actually assert. If a warrant is truly implied and not stated, mark it as implied — but don't put words in the authors' mouths.
- **Don't worry about presentation.** The extraction doesn't need to be pretty. It needs to be complete and honest about where it struggled.

---

## Accessing the Paper

The paper is available at PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC12559807/

Use web tools to read the paper content. If the full text isn't accessible, work with whatever sections are available — the abstract and results alone contain extractable claims. Note any access limitations in the extraction notes.

---

## Success Criteria

The extraction is successful if:

- [ ] At least 8–12 claims extracted from the target section in the template format
- [ ] Each claim has a complete Toulmin decomposition (all six fields attempted, even if some are "not applicable")
- [ ] At least one multi-level dependency chain traced (3+ levels: e.g., inclusion criteria → patient population → statistical analysis → mortality predictor)
- [ ] At least 2 cruxes identified with flip-test reasoning documented
- [ ] At least 1 external anchor classified as foundational (claim fails without it)
- [ ] Schema failure log contains at least 1 documented failure — if the schema worked perfectly on the first try, you probably weren't looking hard enough
- [ ] Extraction notes include a time estimate (even rough) for the work, which informs the annotator pitch

---

## Context Files

For project context, the following files exist in the repo:

- **`CLAUDE.md`** — Site-level agent guidelines and design system
- **`scholion-roadmap.md`** — Full phased roadmap with scope tiers, kill criteria, and honest assessment
- **`session-scholion-essay-v2.md`** — Essay 2 session prompt (deferred, depends on this extraction)

The methodology exploration docs that informed this template:
- "The Scholion Manual for Atomic Decomposition" — three extraction methods, worklog structure, invalidation propagation
- "Claim Decomposition" — extended methodology with crux identification, five dependency types, Epistemic Constitution, LLM capability assessment

These docs are brainstorming artifacts exploring the possibility space. The template above distills the most actionable parts. Where the docs and this prompt disagree, this prompt takes precedence — it reflects the current state of thinking.
