# Scholion — Project Roadmap

**Date:** 2026-02-24
**Author:** Thomas Brady / Pando Industries
**Status:** Draft — awaiting review

---

## What Scholion Is

Scholion is a system for extracting claim-dependency structures from research documents and maintaining them as machine-tractable graphs. The core thesis: safety cases, research arguments, and scientific claims have logical dependency structures that currently live in prose and in people's heads. Making those structures explicit, machine-readable, and automatically maintained converts what is currently a manual, lossy process into a structural one.

The project has evolved through three conceptual stages, each building on the last:

**Stage 1 (the essay):** Claim-dependency tracking for scientific reasoning. Toulmin extraction → cross-document matching → crux identification → invalidation propagation. Positioned against citation graphs, argument mining, and TMS as filling the gap where none of these combine.

**Stage 2 (the methodology docs):** A formal decomposition methodology. Three extraction methods (Linguistic Splitter, Justification Mapping, Warrant Reveal), five dependency types (Causal, Conditional, Purposive, Contrastive, Conjunctive), and a worklog template tested against Khan's "Safe Automated Research" thesis.

**Stage 3 (the Epistemic Constitution):** A vision of Scholion as epistemic CI/CD — a "Knowledge Operating System" where incoming claims are verified against four articles (Argumentation Theory, Philosophy of Science, Formal Epistemology, Modern Rationality) and invalidation propagates like a broken build through a dependency graph. The "Constitutional Judge" concept — a verifier that competes on structural integrity rather than domain knowledge.

Stage 3 is the right long-term vision. But the roadmap must be honest about the distance between that vision and current reality: there is no running code, no completed extraction on a full document, no validated schema, and no empirical evidence that the decomposition methodology produces consistent results across annotators.

---

## Prior Work Inventory

**Published:**
- Essay: "Safety Cases Are Dependency Graphs That Nobody Maintains" — live at thbrdy.dev/writing/scholion/, with 6 interactive island components

**Methodology (unpublished working docs — exploratory, not validated):**
- "The Scholion Manual for Atomic Decomposition" — formalized extraction process with three methods, worklog template, and invalidation propagation concept
- "Claim Decomposition" — extended methodology with crux identification, the Epistemic Constitution (4 articles), reading list, LLM capability assessment, and red-team analysis of Khan Ch. 4's debate protocol
- Partial manual extraction work on Khan Ch. 3–4 (SHAPER, Debate)

These documents represent brainstorming and exploration of the possibility space — avenues to develop and evaluate, not validated methodology or commitments. They map what's available in the literature and how different traditions might apply. The value is in the breadth of approaches identified, not in any single approach being confirmed as correct.

**Test Corpus:**
- Khan, Akbir (2025). "Safe Automated Research." PhD thesis, UCL. Covers opponent shaping, debate for truthfulness, and monitoring for misalignment — directly relevant to Scholion's domain

**No code exists.** The "working prototype" referenced in the essay refers to the interactive essay visualizations on thbrdy.dev, not a functional extraction or graph system.

---

## The Meta-Crux

Everything in Scholion depends on one question:

**Is structural/logical verification of arguments inherently more legible and tractable than evaluating the same arguments in natural language prose?**

If yes, then a structurally competent judge can oversee a substantively stronger researcher, safety cases can be maintained as living graphs, and Scholion has a reason to exist. If no — if the overhead of formalization exceeds the benefit of explicitness — then Scholion is an academic exercise.

The essay identifies this as the "Structural Advantage." The Claim Decomposition doc calls it the meta-crux. It's the right framing. Every phase below is designed to produce evidence for or against it.

---

## Phased Roadmap

### Phase 0: Orient & Scope (Week 1–2)

**Goal:** Establish the project's working environment, settle the core schema, and define what "done" looks like for Phase 1.

**Deliverables:**
- [ ] Project repository initialized with CLAUDE.md, STATUS.md, DECISIONS.md
- [ ] Literature scan: what has changed since the essay was written (Feb 2026)? Specifically: Elicit's current capabilities, any new argument mining benchmarks, any new work on structured extraction with LLMs, any new safety case frameworks
- [ ] Competitive landscape update: has anyone started building claim-level dependency tracking? Check Ought/Elicit, ARC, Anthropic's internal tooling mentions, MATS/SERI research output
- [ ] Core schema decision: finalize the claim ontology. The Manual and Claim Decomposition docs propose a schema but it hasn't been tested for consistency. The six problems from manual extraction (non-atomic claims, negative dependencies, circular structures, weighted support, hidden counterfactuals, taxonomy misfit) must be addressed in the schema, not deferred
- [ ] Select 3–5 papers for Phase 1 annotation across domains. Genre and domain diversity tests whether the schema generalizes. Current candidates: (1) a medical systematic review (Chen et al. 2025, COVID-19-induced acute pancreatitis — claim-dense, statistical evidence structure, empirical cruxes) to test generality outside AI; (2) interpretability papers (e.g., Toy Models of Superposition, Scaling Monosemanticity — circuit-level claims, structural dependencies) as the high-value AI application domain; (3) optionally Khan Ch. 3–4 as partially-explored familiar territory. The point is to test the schema against structurally different argument types: theoretical, empirical, and systematic review
- [ ] Define the annotation format: what does a completed extraction look like? What file format? What fields? This is the worklog template, formalized
- [ ] Write a new Scholion essay (essay 2). The original essay ("Safety Cases Are Dependency Graphs That Nobody Maintains") stays as-is — it's where the project started. The new essay reframes Scholion as general research infrastructure — the "circuitry of science" — explicitly referencing the original as the starting point and showing how the thinking evolved through research. Demonstrated with the medical paper as the primary worked example. Safety, interpretability, and constitutional AI appear as application horizons with underexplored implications, not as the core identity. Propositional tone: a researcher presenting a methodology and research program. Full scope in `session-scholion-essay-v2.md`. Execution deferred until the extraction prototype validates the cross-domain framing

**Exit criteria:** Repository exists. Schema is documented. Papers are selected. Annotation format is specified. A single paragraph has been extracted end-to-end in the final format to validate the template. The result is concrete enough to pitch to a potential annotator — someone could look at it and understand what they'd be doing.

**Kill criteria:** None — this phase is definitional.

**Honest risk:** The temptation in this phase is to over-design the schema before testing it. The six problems from manual extraction are real, but the right response is a schema that handles the common cases well and flags the hard cases for human judgment, not a schema that tries to represent everything formally upfront.

---

### Phase 1: Manual Annotation & Schema Validation (Week 3–8)

**Goal:** Produce the first complete, validated dependency graphs from real papers using manual extraction. Test whether the schema produces consistent results.

This is the phase the essay correctly identified as "the cheapest and most informative experiment." It's also the phase that will either validate or kill the project.

**Deliverables:**
- [ ] Complete manual extraction of Khan Ch. 3 (SHAPER) using finalized schema — full claim graph, all dependency types, cruxes identified
- [ ] Complete manual extraction of Khan Ch. 4 (Debate) — same format
- [ ] Complete manual extraction of 2–3 additional papers (different genres)
- [ ] Cross-document dependency mapping: where Khan Ch. 4 depends on Irving et al. (2018), where Khan Ch. 3 depends on Foerster et al. (2018), trace those dependencies into the cited papers
- [ ] Inter-annotator agreement measurement: find one collaborator (researcher, grad student, or domain expert) willing to independently annotate a subset. Measure κ on claim identification, dependency typing, and crux identification separately
- [ ] Document all schema failures: cases where the annotation template couldn't represent the actual argument structure. These are the most valuable findings
- [ ] First invalidation cascade test: take a completed graph, "invalidate" one foundational claim, manually trace what propagates. Does the cascade match intuition? Does it reveal non-obvious vulnerabilities?

**Exit criteria:** 3+ papers fully extracted. Inter-annotator κ ≥ 0.4 on claim identification (the schema is at least somewhat consistent). At least one cross-document dependency chain traced end-to-end. At least one invalidation cascade manually executed and documented.

**Kill criteria:**
- κ < 0.3 on claim identification after schema revision → the categories don't carve the domain at its joints. Fundamental rethink needed.
- Extraction of a single paper takes >40 hours of skilled manual work → the task is too expensive to scale even with LLM assistance.
- Cross-document matching produces >50% false positives in manual review → the dependency concept may not work across papers.

**Honest risk:** Finding a second annotator is the hard constraint. The inter-annotator agreement measurement is essential — without it, you have no evidence that the schema works for anyone besides you. This is the single biggest bottleneck in Phase 1, and it needs to be solved early, not deferred. Phase 0's prototype serves double duty: validating the schema and producing an artifact concrete enough to recruit with. A potential annotator needs to see a completed example, understand the task, and estimate the time commitment before they'll agree.

**What this phase is not:** This is not the phase to build software. Resist the urge. The entire point is to generate ground truth and validate the schema before writing a line of extraction code.

---

### Phase 2: LLM Extraction Pipeline (Week 9–16)

**Goal:** Build and validate an LLM-based extraction pipeline that approaches the quality of manual annotation on the Phase 1 corpus.

This phase only begins if Phase 1 produces viable ground truth. The manual annotations from Phase 1 become the benchmark.

**Deliverables:**
- [ ] Multi-pass extraction pipeline design: passage identification → atomic decomposition → dependency mapping → crux detection. Document why this ordering (not another)
- [ ] Pipeline implementation using structured output (Claude API + Pydantic/Instructor or equivalent). Each stage produces typed, validated JSON
- [ ] Benchmark against Phase 1 manual annotations: F1 on claim extraction, F1 on dependency identification, precision/recall on crux identification
- [ ] Error analysis: where does the pipeline fail? Systematic categorization of failure modes. Are failures random or structural (e.g., consistently missing warrants, consistently hallucinating dependencies)?
- [ ] Iteration: schema-prompt co-design. The extraction prompt and the annotation schema should co-evolve — hard extraction cases reveal schema ambiguities, schema refinements improve extraction
- [ ] Cost model: what does it cost to process one paper end-to-end? What's the projected cost for the narrow AI safety corpus (2,000–5,000 papers)?

**Exit criteria:** Pipeline achieves >60% F1 on claim extraction and >40% F1 on dependency identification against manual annotations. Error analysis completed with categorized failure modes. Cost per paper < $1 for batch processing.

**Kill criteria:**
- F1 < 40% on claim extraction after 3+ prompt iterations → current LLMs can't do this task reliably enough to be useful.
- Pipeline produces dependency graphs that domain experts describe as "mostly noise" → the extraction quality floor hasn't been reached.
- Cost per paper > $5 at batch rates → economically unviable for corpus-scale processing.

**Key decision (deferred to this phase):** Single-model vs. multi-model pipeline. Start with Claude (strongest on structured reasoning). Only add a second model if there's evidence that model diversity improves extraction quality on specific subtasks.

**Honest risk:** The argument mining literature shows 35–70% F1 on full argument structure. Getting above 60% on a harder task (Toulmin extraction with typed cross-document dependencies) is not guaranteed. The pipeline may top out at "useful but noisy," which is a different product than "reliable ground truth." The roadmap needs to accommodate that outcome.

---

### Phase 3: Graph Infrastructure & Propagation (Week 17–24)

**Goal:** Build the dependency graph storage, query, and propagation system. Make invalidation cascades automatic.

This phase only begins if Phase 2 produces extraction quality sufficient to generate useful (not necessarily perfect) graphs.

**Deliverables:**
- [ ] Graph storage: choose substrate. Options: Datalog with provenance semirings (theoretically elegant, matches ATMS lineage), property graph database (Neo4j — practical, visual, good tooling), or a simpler relational model with recursive CTEs (PostgreSQL — least infrastructure overhead). Decision should be evidence-based from Phase 1–2 findings about what operations matter most
- [ ] Schema implementation: claims, dependencies (typed), cruxes, confidence scores, external anchors (citations), boundary nodes (scope limiters), IN/OUT status (Doyle)
- [ ] Transitive closure: "what depends on what" queries. Given a claim, return all upstream dependencies and all downstream dependents
- [ ] Invalidation propagation: mark a claim as contested/refuted, automatically propagate status changes through the graph. Non-monotonic: allow recovery when a refutation is itself refuted
- [ ] Cross-document linking: same claim referenced in multiple papers should be a single node with multiple evidence edges
- [ ] First corpus-scale run: process 50–100 AI safety papers through the Phase 2 pipeline, load into the graph, run invalidation scenarios
- [ ] Crux detection: identify load-bearing dependencies (single points of failure in the graph). A crux is a dependency where the downstream node has no alternative support path

**Exit criteria:** Graph contains 50+ papers with queryable dependency structure. Invalidation cascade on a foundational claim (e.g., "scaling laws are predictable") propagates correctly through at least 3 levels of dependents. Crux detection identifies at least 5 non-obvious single points of failure. Query latency < 1s for transitive closure on the full graph.

**Kill criteria:**
- Graph is too noisy to navigate: domain experts cannot distinguish signal from noise in the dependency structure → extraction quality from Phase 2 was insufficient.
- Invalidation propagation produces cascades that domain experts consistently disagree with → the dependency typing doesn't capture the actual logical relationships.

**Key decision (deferred to this phase):** Datalog vs. property graph vs. relational. Don't decide now. The right substrate depends on what operations Phase 1–2 reveal as most important. If transitive closure and provenance dominate, Datalog wins. If exploratory visualization and ad-hoc queries dominate, Neo4j wins. If simplicity and deployment ease dominate, PostgreSQL wins.

---

### Phase 4: Interface & Validation (Week 25–36)

**Goal:** Build the reading interface. Validate with domain experts. Answer the meta-crux.

**Deliverables:**
- [ ] Reading interface: the "overlay" surface where a researcher reads a paper while seeing its structural decomposition and dependency context simultaneously. This is the product surface — what users actually interact with
- [ ] Dependency graph visualization: navigable graph view showing claim networks, cruxes highlighted, propagation paths visible
- [ ] "What breaks if this is wrong?" query: given any claim, show the full downstream impact. This is the killer feature — the thing no existing tool does
- [ ] Domain expert evaluation: recruit 3–5 safety researchers or alignment researchers. Give them a dependency graph for a paper they know well. Ask: (1) does the graph accurately represent the argument structure? (2) did the graph reveal any dependency or vulnerability you hadn't noticed? (3) would you use this tool for safety case maintenance?
- [ ] Comparative evaluation: same researchers review the same material in prose form and in graph form. Which surface lets them identify vulnerabilities faster? This directly tests the Structural Advantage crux
- [ ] Write up findings — this is publishable regardless of outcome

**Exit criteria:** Working interface deployed (even if rough). 3+ domain experts have used it. Quantitative comparison between prose review and graph review for vulnerability identification.

**Kill criteria:**
- Domain experts consistently find the graph representation less useful than prose → the structural overhead exceeds the structural benefit. Scholion's thesis is wrong, or the execution doesn't deliver on it.
- Researchers identify the dependencies as mostly accurate but say "I already knew all of this" → the system isn't revealing non-obvious structure, just formalizing the obvious.

---

### Phase 5: Scale & Publish (Week 37+)

**Not scoped in detail.** This phase only exists if Phase 4 validates the Structural Advantage. It would include:

- Processing the full narrow AI safety corpus (2,000–5,000 papers)
- Public-facing tool or API
- Research paper on the annotation schema, extraction pipeline, and validation results
- Engagement with safety case methodology community (UK AISI, Anthropic RSP team, ARC)
- Open-sourcing the annotated dataset as a community resource

---

## Scope Tiers

### Must Have (gates everything else)
- Finalized annotation schema with documented design decisions
- Manual annotations on 3–5 papers with inter-annotator agreement
- LLM extraction pipeline with benchmarked performance
- Dependency graph with working invalidation propagation
- Domain expert validation

### Should Have (high value, not gating)
- Khan thesis as fully worked example (all chapters extracted and linked)
- Annotation guidelines document (publishable independently)
- Cost model for corpus-scale processing
- Reading interface with overlay visualization

### Not Building (explicitly excluded)
- Real-time monitoring integration (watching arxiv for new papers that affect the graph)
- Multi-user collaborative annotation platform
- Full Epistemic Constitution enforcement (Articles I–IV as automated checks) — this is the long-term vision, not the first version
- Integration with existing tools (Semantic Scholar API, Elicit, etc.) — premature until the core works
- Mobile or native apps

---

## Key Decisions (Deferred)

These decisions should not be made now. Each one should be made when evidence from earlier phases informs the choice.

| Decision | When to Decide | What Informs It |
|----------|---------------|-----------------|
| Graph substrate (Datalog vs. Neo4j vs. PostgreSQL) | Phase 3 start | Phase 1–2 findings on which operations matter |
| Single-model vs. multi-model extraction | Phase 2 mid-point | Extraction quality benchmarks |
| Schema for warrants (explicit node vs. edge attribute) | Phase 1 mid-point | Manual annotation experience |
| Confidence scoring model (binary IN/OUT vs. continuous) | Phase 1 end | How domain experts reason about claim status |
| Interface framework (web app vs. browser extension vs. IDE plugin) | Phase 4 start | Who the users are and how they read papers |
| Whether to treat the Epistemic Constitution as enforceable rules vs. advisory heuristics | Phase 4, based on expert feedback | Whether formal rule enforcement improves or degrades usability |

---

## Honest Assessment

Three things I want to flag because they matter and are easy to overlook:

**The collaborator problem is real and gates Phase 1.** Inter-annotator agreement requires a second annotator. The Phase 1 kill criterion (κ ≥ 0.4) cannot be evaluated solo. This means Phase 1 has a hard dependency on finding someone — a grad student, a safety researcher, a philosopher of science — willing to annotate 50–100 claims using your schema. Phase 0 needs to produce a prototype complete enough to pitch: a worked example, a clear task description, and an honest time estimate. The recruitment conversation should happen in parallel with the schema work, not after it.

**The theoretical breadth is an asset, but the risk is premature commitment.** Toulmin, Doyle, Popper, Pearl, Quine, Dung, and Walton all speak to different aspects of what Scholion might need. For a research project, having multiple theoretical lenses available to compare and contrast is the right posture — the question isn't which tradition to commit to, but which traditions actually help when applied to real extraction work. The risk isn't having too many traditions; it's treating any one of them as settled before empirical work reveals which decomposition approaches produce useful, consistent results. Each phase should evaluate: which theoretical tools earned their keep, and which added complexity without proportional benefit?

**The methodology docs are exploration of the possibility space.** The Manual and Claim Decomposition documents map the landscape of available approaches and identify how different traditions might apply. They're brainstorming artifacts — valuable for the breadth of avenues they identify, not as validated methodology to implement wholesale. The worklog template, the three extraction methods, the Epistemic Constitution articles — these are all hypotheses about what might work, to be tested against real annotation work in Phase 1. Some will survive contact with reality. Some won't. The point is having them as starting points, not pinning hopes on any single one.

---

## Next Step

Phase 0 is the immediate work. Five things, roughly parallel:

1. Initialize the project repo with governance docs (CLAUDE.md, STATUS.md, DECISIONS.md)
2. First extraction prototype: pick one section of the medical paper (Chen et al. 2025) and extract end-to-end in the finalized template format. A domain outside AI tests whether the schema is genuinely general. This prototype also becomes the pitch artifact for collaborators
3. Do a fresh literature scan for Feb 2026 landscape changes, with particular attention to the interpretability/circuits domain
4. Write new Scholion essay (essay 2, "The Circuitry of Science"): general claim-dependency methodology, explicitly building on the original essay, demonstrated with the medical paper, with safety/interpretability/constitutional AI as application horizons. Original essay stays unchanged. Full session prompt in `session-scholion-essay-v2.md`. Execution deferred until extraction prototype is complete
5. Begin identifying potential annotators — the prototype from (2) is what you show them
