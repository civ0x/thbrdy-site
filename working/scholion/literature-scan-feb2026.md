# Scholion — Literature Scan & Competitive Landscape

**Date:** 2026-02-24
**Scope:** What has changed since the original Scholion essay was written? Covers Elicit, argument mining, structured extraction with LLMs, safety case frameworks, citation graph tools, and alignment research output.

---

## Executive Summary

Nobody is building claim-level dependency tracking with typed relationships, warrant extraction, and invalidation propagation. The niche Scholion occupies remains open. However, the surrounding landscape has moved substantially: safety cases are maturing into structured frameworks with reusable templates, Elicit has scaled structured extraction to 125M+ papers, argument mining with LLMs now has a survey and active benchmarks, and Toulmin-based LLM reasoning is an emerging research thread. The opportunity for Scholion is clearer than when the essay was written, but the positioning needs to sharpen — the value proposition is not "structured extraction" (Elicit does that) or "citation graphs" (Semantic Scholar does that) but specifically the dependency/warrant/propagation layer that neither provides.

---

## 1. Elicit / Ought

**Current state:** Elicit spun out of Ought as an independent public benefit corporation in 2023. Now serves 2M+ researchers across academia and industry, indexing 125M+ papers. Pricing: free tier (5,000 credits), $10/month Plus plan, team/enterprise plans available.

**What it does well:** Semantic search across papers, structured data extraction into user-defined tables (interventions, outcomes, demographics, effect sizes), sentence-level citation for every claim, systematic review workflows with reproducible search strategies. The architecture is built around "supervising reasoning processes, not outcomes" — using LLMs as building blocks for cognitive work.

**What it doesn't do:** Elicit extracts *data* from papers, not *argument structure*. It can pull effect sizes and sample sizes into a table, but it doesn't extract warrants, identify dependency chains between claims, or propagate invalidation. There's no concept of a claim being "load-bearing" for downstream conclusions. It also doesn't do cross-document dependency mapping — citations are tracked but not typed as foundational vs. contextual.

**Scholion positioning:** Elicit is the upstream data layer Scholion could eventually consume. Elicit answers "what did this paper find?" Scholion answers "why should you believe it, and what breaks if you don't?" These are complementary, not competitive. Phase 5 integration with Elicit's API is a natural pathway if Scholion validates.

---

## 2. Argument Mining with LLMs

**State of the field:** A comprehensive survey — "Large Language Models in Argument Mining" (arXiv, 2025) — systematically covers the intersection. Key findings:

- Zero-shot and few-shot LLM approaches now rival supervised baselines for argument component detection, but "LLMs still favour fluent but logically thin arguments over less polished yet better-supported ones." This is exactly the failure mode Scholion's warrant extraction is designed to surface.
- The survey recommends "structured intermediate representations, symbolic scaffolds (e.g., argument diagrams), or rationale-based generation" as future directions. Scholion's typed dependency graph IS one of these structured intermediate representations.
- Persistent weaknesses: fine-grained structural reasoning, cross-document coherence, and distinguishing genuine logical support from rhetorical flourish.

**Benchmarks:** The ArgMining 2025 workshop (ACL Anthology) introduced several relevant tasks: relation prediction combining KG embeddings with fine-tuned LMs, multi-agent LLM framework for implicit premise recovery (structurally similar to Scholion's warrant extraction), and key statement segmentation (a new task where even LLMs can't solve it satisfactorily yet).

**ArgQuality datasets** benchmark argument quality assessment but use a coarse three-point scale, are limited to short single-turn arguments, and sample from restricted genres (online forums, essays). Scientific argument extraction — Scholion's domain — is not well-represented in current benchmarks.

**Scholion positioning:** The argument mining community is building toward what Scholion needs but hasn't arrived. Scholion could contribute a benchmark: the manually annotated Phase 1 corpus, with Toulmin decomposition and typed dependencies, would be a novel dataset for the argument mining community. This is a publication opportunity independent of the tool itself.

---

## 3. Toulmin-Based LLM Reasoning

**Active thread, small but growing.** Several relevant papers:

- **Critical-Questions-of-Thought (CQoT)** (arXiv, Dec 2024): Uses Toulmin's framework to improve LLM reasoning by probing Data and Warrant components with critical questions. Directly relevant — validates that Toulmin structure improves LLM reasoning quality, which is Scholion's core premise.
- **Advanced Stack implementation**: Proof-of-concept for automated Toulmin extraction using Mistral AI. Uses structured dataclass to extract all six components. Notes scalability potential. This is essentially a toy version of Scholion's Phase 2 pipeline — validates the approach but doesn't include dependency typing, cross-document linking, or propagation.
- **LAK 2025 paper**: Integrates LLMs into qualitative coding using Toulmin's framework. GPT-4o achieved F1 of 0.83 on a coding task, with LLMs "clarifying evidence and warrants behind coders' claims" and "suggesting alternative interpretations." Relevant to Scholion's annotator-assistance use case.
- **ACL 2024**: Zero-shot argument explication using Toulmin's theory with GPT-3.5 and GPT-4. Evaluates claim, reason, and warrant generation.
- **Legal AI taxonomy** (arXiv, July 2025): Maps legal roles to NLP subtasks using Toulmin computationally. Shows Toulmin's cross-domain applicability — relevant to Scholion's generality claim.

**Scholion positioning:** Nobody has combined Toulmin extraction with typed dependency graphs and invalidation propagation. The individual pieces exist (Toulmin extraction, argument graphs, LLM reasoning) but the integration is Scholion's distinctive contribution. The CQoT paper is the closest conceptual neighbor.

---

## 4. Safety Case Frameworks

**Rapid maturation since the essay was written.** Three major developments:

**4a. Anthropic RSP v3.0:** Anthropic restructured its Responsible Scaling Policy, acknowledging "ambiguity around public risk assessments" and that requirements at higher levels are "hard to meet unilaterally." ASL-3 safeguards activated May 2025. Safety cases are now explicitly defined as "structured arguments that a system is safe to deploy in a given environment." They published three sketches of ASL-4 safety case components, plus a pilot Sabotage Risk Report (Summer 2025) with independent METR review. Risk Reports will be published every 3–6 months going forward.

**4b. UK AISI (now AI Security Institute):** Published safety case templates including an "inability argument" template and an end-to-end safety case for misuse safeguards. Uses Goal Structuring Notation (GSN) and Claims-Arguments-Evidence (CAE) as structured methods. Acknowledges "many open problems" including how to specify top-level claims, which notation schemes work best, and how to quantify confidence. Planning collaborations on safety cases for models more advanced than currently exist.

**4c. Reusable Template Framework** (arXiv 2601.22773, Jan 2026): Proposes comprehensive taxonomies for AI-specific claim types (assertion-based, constraint-based, capability-based), argument types (demonstrative, comparative, causal/explanatory, risk-based, normative), and evidence families. Explicitly designed to be composable and reusable. This is the most structurally rigorous safety case framework published to date.

**4d. MATS output:** "An Example Safety Case for Safeguards Against Misuse" (Jonah Weinbaum, Dec 2025) — a concrete worked example from the MATS program.

**Scholion positioning:** Safety cases are the natural application domain. The field is converging on structured arguments with typed claims, but nobody is automating the *maintenance* of these structures — tracking what happens when upstream evidence changes. Anthropic's RSP v3.0 explicitly frames safety cases as living documents that must be updated as capabilities evolve. Scholion's invalidation propagation is exactly the infrastructure needed for that maintenance. The essay's framing ("Safety Cases Are Dependency Graphs That Nobody Maintains") is more apt now than when it was written.

---

## 5. Citation Graph & Research Tools

**Semantic Scholar:** 225M+ papers, 2.8B citation edges. Continues to grow. Provides structured bibliography extraction and citation graph construction. TLDR summaries, Semantic Reader for augmented PDF reading. Open data and API. Still operates at the *citation* level, not the *claim* level.

**scite.ai:** Key differentiator is citation context — classifying citations as supporting, contradicting, or mentioning. Oct/Nov 2025 updates: "minimal" reasoning setting, structured boolean output in Assistant workflows, Smart Citations with hover-over support/dispute/mention indicators. This is the closest existing tool to claim-level tracking, but it operates on citation sentences, not on the full argument structure within a paper.

**Open Research Knowledge Graph (ORKG):** Describes research papers in structured form for comparison. The most academically aligned tool, but focused on making papers findable and comparable, not on dependency tracking or invalidation.

**Scholion positioning:** scite.ai's support/contradict/mention classification is a simplified version of Scholion's dependency typing. Scholion goes deeper: typed dependencies (causal, conditional, purposive, contrastive, conjunctive), warrant extraction, crux identification, and propagation. If scite tells you "Paper B contradicts Paper A," Scholion tells you which specific claim in B contradicts which claim in A, through what warrant, and what downstream conclusions are affected.

---

## 6. ARC and Alignment Research

**ARC's current focus:** Combining mechanistic interpretability with formal verification. Trying to produce formal mechanistic explanations of neural network behavior to identify when novel inputs may lead to anomalous behavior. Reports fastest conceptual progress since 2022. ELK (Eliciting Latent Knowledge) remains central, with Mechanistic Anomaly Detection (MAD) as the most promising approach.

**MATS Summer 2026:** Largest cohort yet (120 fellows, 100 mentors). Includes ARC, Anthropic Alignment Science, UK AISI, Redwood Research, LawZero. Research spans AI control, scalable oversight, mechanistic interpretability, model welfare, and security.

**Scholion positioning:** ARC's work on formal verification of neural network behavior is structurally parallel to Scholion's verification of argument structure — both are asking "can we catch when something that looks right is actually wrong?" The difference is the substrate: ARC works on model internals, Scholion works on the reasoning those models produce or that humans produce about those models. There may be a collaboration angle if Scholion validates: using Scholion's dependency graphs to structure the claims in ARC's safety cases.

---

## 7. Competitive Gap Analysis

| Capability | Elicit | Semantic Scholar | scite.ai | ORKG | Safety Case Templates | **Scholion** |
|---|---|---|---|---|---|---|
| Paper discovery | Yes | Yes | Yes | Yes | No | No |
| Structured data extraction | Yes | No | No | Partial | No | No |
| Citation graph | No | Yes | Yes | Partial | No | No |
| Citation context (support/contradict) | No | No | Yes | No | No | No |
| Claim-level decomposition | No | No | No | No | Partial (manual) | **Yes** |
| Typed dependency relationships | No | No | No | No | No | **Yes** |
| Warrant extraction | No | No | No | No | No | **Yes** |
| Crux identification | No | No | No | No | Partial (manual) | **Yes** |
| Invalidation propagation | No | No | No | No | No | **Yes** |
| Cross-document claim linking | No | No | Partial | Partial | No | **Planned (Phase 3)** |

The bottom five rows are Scholion's distinctive territory. Nobody else is doing claim-level dependency tracking with typed relationships and propagation. The gap is real and has not closed since the essay was written.

---

## Implications for Scholion

**For essay 2 positioning:** Frame against the safety case maturation (Section 4). The field now has structured templates (Jan 2026 framework) and institutional adoption (Anthropic RSP, UK AISI), but no infrastructure for *maintaining* these structures as evidence evolves. Scholion fills that gap. The medical paper extraction demonstrates cross-domain generality.

**For Phase 1 paper selection:** The interpretability domain (Toy Models of Superposition, Scaling Monosemanticity) is high-value because these are papers whose claims directly feed into safety cases. Extracting them creates the most compelling demonstration: here's a dependency graph of an interpretability finding, here's what breaks if this result doesn't replicate.

**For the collaborator pitch:** The argument mining survey and benchmarks provide academic framing. A Phase 1 annotated corpus could be submitted as a novel dataset to ArgMining 2026. This gives a potential collaborator a publication incentive beyond "help Thomas with his project."

---

## Sources

- [Elicit](https://elicit.com/)
- [Large Language Models in Argument Mining: A Survey](https://arxiv.org/html/2506.16383v4)
- [ArgMining 2025 Workshop — ACL Anthology](https://aclanthology.org/events/argmining-2025/)
- [Constructing Safety Cases for AI Systems: A Reusable Template Framework](https://arxiv.org/abs/2601.22773)
- [The BIG Argument for AI Safety Cases](https://arxiv.org/html/2503.11705v1)
- [Safety Cases: How to Justify the Safety of Advanced AI Systems](https://arxiv.org/abs/2403.10462)
- [Safety Cases for Frontier AI](https://arxiv.org/html/2410.21572v1)
- [UK AISI — Safety Cases at AISI](https://www.aisi.gov.uk/blog/safety-cases-at-aisi)
- [UK AISI — Safety Case Template for Inability Arguments](https://www.aisi.gov.uk/blog/safety-case-template-for-inability-arguments)
- [Anthropic RSP v3.0](https://www.anthropic.com/news/responsible-scaling-policy-v3)
- [Three Sketches of ASL-4 Safety Case Components](https://alignment.anthropic.com/2024/safety-cases/)
- [Anthropic Sabotage Risk Report](https://alignment.anthropic.com/2025/sabotage-risk-report/)
- [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026)
- [Critical-Questions-of-Thought: Steering LLM Reasoning with Argumentative Querying](https://arxiv.org/html/2412.15177v1)
- [Harnessing Toulmin's Theory for Zero-Shot Argument Explication — ACL 2024](https://aclanthology.org/2024.acl-long.552.pdf)
- [Bridging Human and Machine Perspectives — LAK 2025](https://ceur-ws.org/Vol-3995/LLMQUAL_paper3.pdf)
- [Implementation of the Toulmin Argument with LLMs — Advanced Stack](https://advanced-stack.com/resources/implementing-toulmin-argument-analysis-with-ai-llm-large-language-models.html)
- [LLMs in Law: Dual-Lens Taxonomy with Toulmin Framework](https://arxiv.org/html/2507.07748v1)
- [Semantic Scholar](https://www.semanticscholar.org/)
- [scite.ai — November 2025 Release Notes](https://scite.ai/blog/november-2025-release-notes)
- [Open Research Knowledge Graph](https://orkg.org/)
- [ARC Theoretical Alignment Research](https://www.alignment.org/theory/)
- [MATS Summer 2026 Program](https://www.matsprogram.org/program/summer-2026)
- [An Example Safety Case for Safeguards Against Misuse — MATS](https://www.matsprogram.org/research/recus2SdRez7fNKKZ)
- [Benchmarking LLM-based Information Extraction](https://www.medrxiv.org/content/10.64898/2026.01.19.26344287v1.full.pdf)
- [ArgQuality Dataset](https://www.emergentmind.com/topics/argquality-dataset)
