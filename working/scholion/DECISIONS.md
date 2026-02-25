# Scholion — Decision Log

Decisions are logged as they're made. Each entry records the decision, the reasoning, the alternatives considered, and what would cause a revisit.

---

## DEC-001: Annotation format — YAML over JSON

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Use YAML for extraction files and schema definition.
**Reasoning:** YAML supports inline comments (annotator notes on individual fields), multiline strings without escaping (verbatim claim text, warrants), and reads more naturally for a task that is fundamentally human annotation work. JSON is better for machine interchange but Phase 0-1 is manual annotation, not pipeline output.
**Alternatives considered:** JSON (better tooling, stricter validation), Markdown tables (too flat for nested structure), custom DSL (premature).
**Revisit if:** Phase 2 pipeline needs strict schema validation — at that point, add a JSON Schema or Pydantic model that validates the YAML, rather than switching formats.

---

## DEC-002: Schema uses Toulmin as starting framework

**Date:** 2026-02-24
**Phase:** 0
**Decision:** The annotation schema is organized around Toulmin's argument model (claim, data/evidence, warrant, backing, qualifier, rebuttal) extended with dependency typing and graph-oriented fields (depends_on, crux, status).
**Reasoning:** Toulmin provides the most complete single-argument decomposition available. The five dependency types (causal, conditional, purposive, contrastive, conjunctive) come from the methodology docs' exploration of how claims relate across a document. The IN/OUT status tracking comes from Doyle's Reason Maintenance Systems.
**Alternatives considered:** Dung's abstract argumentation (too focused on attack/defeat, misses support structure), AIF/argument interchange format (too heavy for manual annotation), pure propositional logic (loses the warrant/backing layer that makes implicit reasoning explicit).
**Revisit if:** Phase 1 manual annotation reveals that Toulmin categories don't carve real arguments well — particularly if warrants and backings prove consistently indistinguishable in practice, or if the dependency types don't cover recurring patterns.

---

## DEC-003: First extraction target — non-AI domain (clinical medicine)

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Use Chen et al. (2025) COVID-19-induced acute pancreatitis systematic review as the first extraction, rather than Khan thesis or an AI safety paper.
**Reasoning:** Tests whether the schema generalizes beyond AI safety. A medical systematic review has a different argument structure (statistical evidence, inclusion criteria, regression models) than theoretical AI safety arguments. If the schema works here, it's more credibly general. Also produces a concrete artifact for the second essay's cross-domain framing.
**Alternatives considered:** Khan Ch. 3-4 (familiar territory but doesn't test generality), an interpretability paper (high-value domain but extraction complexity may be too high for a first test).
**Revisit if:** The medical extraction reveals the schema is heavily biased toward theoretical arguments and can't represent statistical/empirical structure well. If so, the schema needs revision before claiming generality.

---

## DEC-004: Schema.yaml vs session prompt template — reconciliation plan

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Extractions use schema.yaml format for consistency with the first prototype. The session prompt template proposes additional fields that should be selectively incorporated into schema v0.2 before Phase 1 begins.
**Reasoning:** The mortality extraction committed to schema.yaml format. The chronology extraction maintained consistency. Switching formats mid-extraction would create two incompatible datasets. However, three session prompt fields address real schema failures documented in chen2025-schema-failures.yaml: (1) `confidence` (high/medium/low) — addresses SF-001, the weighted support problem; (2) `external_anchor_type` (foundational/contextual) — critical for invalidation propagation; (3) `claim_source` (not in either template, proposed from SF-002) — distinguishes author-asserted from annotator-synthesized claims. The session prompt's nested structure (toulmin.grounds, crux.flip_test) is cleaner for reading but harder for YAML editing; the flat schema.yaml structure is better for manual annotation. The session prompt's `glue_words` field is useful for learning but redundant once dependency_type is assigned.
**Alternatives considered:** (a) Rewrite both extractions in session prompt format (wasted effort, existing format works), (b) keep schema.yaml unchanged and rely on notes fields (loses machine-queryability), (c) merge the best of both into schema v0.2 (chosen).
**Revisit if:** Phase 1 annotator feedback reveals the flat structure is too confusing, or the nested structure is actually easier for human annotators.

---

## DEC-005: Extraction unit — argument block, not paper section

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Each extraction file covers one coherent argument block, which may span multiple paper sections. The chronology extraction spans Sections 3.3, 3.5, 3.7, and parts of the Discussion.
**Reasoning:** Arguments don't respect section boundaries. The mortality predictors argument flows from Methods through Results Table 3 to Discussion. The chronology argument flows from Symptoms through Imaging through Survival Outcomes to Discussion. Extracting by section would either (a) artificially split coherent argument chains or (b) force arbitrary decisions about where a claim "belongs." Argument-block scoping keeps the dependency graph connected and the extraction intellectually coherent.
**Alternatives considered:** Section-by-section extraction (cleaner file boundaries but incoherent argument chains), full-paper extraction (too large for a single file, mixes independent argument threads), claim-chain extraction (too granular — a single chain like "AST/ALT → mortality" would be too narrow to test the schema).
**Revisit if:** Cross-paper extractions in Phase 1 reveal that argument-block scoping creates ambiguity about which extraction a shared claim belongs to.

---

## DEC-006: Adopt site-wide interaction patterns for essay visualizations

**Date:** 2026-02-25
**Phase:** 0 (documenting conventions ahead of essay development)
**Decision:** The Scholion essay ("The Circuitry of Science") inherits the interaction pattern conventions documented in `docs/interaction-patterns.md` at the project root. This covers: control-type selection (toggle, slider, scroll-driven, click-to-reveal), popover and detail panel visual treatment, SVG interaction (fat hit targets, edge highlighting), semantic color encoding, trigger indicators, animation specs, CSS specificity rules, mobile/accessibility requirements, and the prototype-first development workflow.
**Reasoning:** These conventions were extracted from three VoD visualization redesigns and the annotation system (root Decisions 018, 019). They represent tested, stable patterns. Adopting them wholesale avoids reinventing visual treatment and interaction mechanics for Scholion's diagrams (which will include Toulmin argument visualizations and dependency graph views). The "form embodies argument" principle is directly aligned with Scholion's goal of making inferential structure experiential.
**Alternatives considered:** Writing Scholion-specific interaction conventions from scratch (unnecessary — the patterns generalize), cherry-picking a subset (risks inconsistency with the rest of the site).
**Revisit if:** Scholion's argument graph visualizations require interaction patterns not covered by the current vocabulary (e.g., graph traversal with expand/collapse, multi-selection for dependency comparison). In that case, extend the root document rather than forking.

---

## DEC-007: Inline annotation content architecture for Scholion essay

**Date:** 2026-02-25
**Phase:** 0 (documenting conventions ahead of essay development)
**Decision:** The Scholion essay will use the inline annotation system (root Decision 018) for term definitions, reference summaries, and enriched links. Annotation content lives in a companion YAML file (`src/content/writing/circuitry-of-science.annotations.yaml`) alongside the MDX, with `terms`, `references`, and `links` sections. A remark plugin resolves explicit markers in MDX against the YAML data. The shared `Annotation.tsx` component (`src/components/islands/shared/`) handles rendering.
**Reasoning:** The Scholion essay is dense with domain-specific vocabulary (Toulmin categories, Doyle's TMS, Lakatos's research programmes, dependency typing) and academic references. Inline annotations surface context at the point of need without breaking reading flow. The companion-file architecture keeps MDX prose clean — the annotation layer is a separable concern that can be batch-generated and independently reviewed. Explicit markers (rather than pattern-matching) give the author control over which occurrences get annotated.
**Key conventions inherited from root Decision 018:**
- Visual: `1.5px dashed var(--accent)` for term triggers, `var(--teal)` for link triggers
- Popover content: three templates (term/definition, reference/citation, link preview) per `interaction-patterns.md`
- Mobile: bottom sheets with semi-transparent backdrop, two-tap for links
- Accessibility: `role="tooltip"`, `aria-describedby`, keyboard nav, `tabindex="0"`
- Workflow: author adds reference metadata to YAML → agent generates summary and context fields → author reviews/edits → ships as static data. No runtime LLM calls.
**Alternatives considered:** Footnotes (break reading flow), margin annotations (don't work on mobile, require wide viewports), inline parentheticals (clutter the prose).
**Revisit if:** The annotation YAML becomes unwieldy for Scholion's density of terms — may need to split into multiple YAML files or adopt a different resolution strategy.

---

## DEC-008: Toulmin diagram — vertical flow with inline modifiers

**Date:** 2026-02-25
**Phase:** 0 (inherited from root Decision 011, documenting for Scholion essay context)
**Decision:** Toulmin argument diagrams use a vertical flow layout: dominant Claim card at top with qualifier/rebuttal as inline modifiers, visible connection lines with labels ("supports", "on account of"), Data+Warrant side by side below, Backing aligned under Warrant via a 2-column grid wrapper with empty spacer. Connection lines use CSS divs (static structural connections), not SVG.
**Reasoning:** The original grid layout (6 equal-weight cards, no connections) made relationships illegible. The Claim must be the center of gravity since everything else relates to it. Qualifier and Rebuttal are modifiers of the Claim, not independent entities — embedding them inside the Claim card reflects their logical role. Visible connector lines with labels make the inferential structure graspable without prior Toulmin knowledge. CSS div connectors are appropriate because these connections are structural, not interactive (per `interaction-patterns.md` SVG vs CSS decision criteria).
**Constraint:** Layout collapses to single column at ≤640px. If the Scholion essay needs interactive Toulmin diagrams (hoverable nodes, animated dependency highlighting), upgrade connections to SVG with fat hit targets per `interaction-patterns.md`.
**Revisit if:** The essay requires Toulmin diagrams where the reader manipulates the argument structure (e.g., toggling claim status IN/OUT and watching downstream propagation). That interaction model would need SVG edges and likely the scrub-controlled mechanism pattern.

---

## DEC-009: Annotation marker syntax and content inventory for Scholion essay

**Date:** 2026-02-25
**Phase:** 0 (documenting conventions ahead of essay development)
**Decision:** Use `<A t="key">`, `<A r="key">`, `<A l="key">` JSX tags in MDX for term, reference, and link annotations respectively. Companion YAML file (`circuitry-of-science.annotations.yaml`) contains 32 entries: 20 terms across 3 badge categories (CLINICAL/teal, ARGUMENT/accent, SAFETY/blue), 9 references, 3 links. Annotations cluster in Sections I (medical vocabulary) and IV (safety vocabulary) — the domain-crossing sections.
**Reasoning:** `<A>` is maximally concise, mnemonic for "annotation," and case-sensitive distinct from `<a>` in JSX. Three badge categories (rather than 4) because statistical methods (Cox, Kaplan-Meier, hazard ratio) are clinical tools in this essay's context — splitting them out would fragment the visual grouping without adding signal. 32 annotations across ~4,170 words (~1 per 130 words) is within acceptable density; Section IV runs denser (~1 per 80 words) because that is where both domain vocabularies collide.
**Key scope decisions:**
- Doyle's TMS: omitted (not named in essay body; IN/OUT status is explained inline)
- Lakatos: omitted (not named in essay body)
- ASL levels: omitted (v4 RSP paragraph self-contextualizes the shift to argument-based standards; RSP reference popover provides institutional detail)
- Confidence interval: omitted (widely understood across target audiences)
- RSP direct quotes: not separately annotated (doing their work inline; `anthropic-rsp` reference popover provides institutional context)
**Alternatives considered:** `<An>` or `<Ann>` tag (less ambiguous but verbose), remark-directive syntax `::term[text]{#key}` (cleaner in prose but requires custom plugin that doesn't exist yet), 4 badge categories with separate STATISTICAL (fragments visual grouping without added clarity).
**Revisit if:** (1) Authoring confusion between `<A>` and `<a>` arises in practice — switch to `<An>`. (2) Section IV density feels visually overwhelming once rendered — thin `uk-aisi` and `lee2026` references first. (3) A second essay's annotations need a different badge taxonomy — generalize at that point.

---

## DEC-010: Diagram visual language — shared node vocabulary across all six components

**Date:** 2026-02-25
**Phase:** 0 (documenting conventions from prototyping)
**Decision:** All six essay diagrams share a unified visual vocabulary prototyped across two sessions. The key conventions:

- **Node types**: Crux nodes get accent (gold) left border + gradient background. Synthesis nodes get warm background. Limitation nodes get red left border. Standard claim nodes get white background with light border.
- **Typed edges**: Dependency type labels (causal, conditional, contrastive, etc.) appear as small mono-font chips on connector lines. Color-coded by type (teal for causal, accent for conditional, blue for purposive, red for contrastive).
- **Connectors**: CSS divs (not SVG) for structural connections. Vertical lines (`vert` class), horizontal branch bars for forking, with accent variant for crux paths.
- **Popovers**: Desktop hover (120ms delay) with positioned popover cards. Mobile bottom sheet with semi-transparent backdrop. Content structure: plain-language explanation + "Structural significance" section.
- **Scroll reveal**: IntersectionObserver with staggered entry delays (150ms between elements). `prefers-reduced-motion` compliance throughout.
- **Typography split**: JetBrains Mono for structural labels (claim IDs, phase numbers, status chips). DM Sans for descriptions and popover content. Cormorant Garamond only for surrounding essay prose.
- **Tone**: Safety case content uses collaborative framing — Scholion helps scale existing good work, not critique of existing approaches.

**Reasoning:** Establishing the visual language on CompetitiveGapTable (simplest) and ChenDependencyGraph (most complex) first, then propagating to the remaining four, ensured consistency without premature commitment. The node vocabulary evolved through iterative feedback across both sessions — branch bars, legend sizing, chip placement, and column alignment were all refined through user review.
**Alternatives considered:** GSN (Goal Structuring Notation) for SafetyCaseFragment (rejected — the dependency graph vocabulary is more natural for Scholion's typed-edge model), D3/charting libraries for ChenDependencyGraph (rejected per DEC-006 — CSS-only constraint), SVG connectors (rejected — connections are structural, not interactive).
**Revisit if:** Porting to React islands reveals that the CSS-only connector approach doesn't scale to dynamic graph states (e.g., toggling claim status IN/OUT with downstream propagation). At that point, upgrade to SVG edges per the contingency noted in DEC-008.

---

## DEC-011: Annotation marker syntax — adopt site-wide `[[mode:key|text]]` over JSX `<A>` tags

**Date:** 2026-02-24
**Phase:** 0
**Decision:** Convert all `<A t="key">text</A>`, `<A r="key">text</A>`, `<A l="key">text</A>` JSX markers in the Circuitry of Science MDX to the site-wide `[[term:key|text]]`, `[[ref:key|text]]`, `[[link:key|text]]` syntax used by `remark-annotations.mjs`. The companion YAML was also converted from object-keyed format to array format with `key` fields, matching the Valley of Death annotations structure.
**Reasoning:** The existing remark plugin resolves `[[mode:key|text]]` markers and auto-injects the `Annotation` component import. The JSX `<A>` syntax specified in DEC-009 would require either extending the plugin to support a second syntax or maintaining two incompatible marker formats across essays. Consistency across all essays is more valuable than the marginally more concise JSX syntax. One syntax, one plugin, one resolution path.
**Alternatives considered:** (a) Extend remark plugin to support both syntaxes (more code to maintain, two ways to do the same thing), (b) rewrite VoD markers to match Scholion JSX syntax (breaks working system, higher risk).
**Revisit if:** A future essay needs marker features that the `[[]]` syntax cannot express (e.g., nested annotations, conditional display).

---

<!-- Template for new decisions:

## DEC-NNN: [Short title]

**Date:** YYYY-MM-DD
**Phase:** N
**Decision:** [What was decided]
**Reasoning:** [Why this, specifically]
**Alternatives considered:** [What else was on the table]
**Revisit if:** [What conditions would reopen this decision]

-->
