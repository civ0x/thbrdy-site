# Session: Scholion Essay 2 — The Circuitry of Science

**Date created:** 2026-02-24
**Status:** Ready for execution (deferred until Phase 0 extraction prototype is complete)
**Kickoff:** Read `CLAUDE.md`, `STATUS.md`, and `session-scholion-essay-v2.md`, then execute.

---

## Situation

The original Scholion essay ("Safety Cases Are Dependency Graphs That Nobody Maintains") is live at `/writing/scholion/` with 6 interactive island components. It stays as-is — it's a coherent artifact that represents where the project started: scoped to AI safety cases, using Anthropic's RSP as the primary example.

This session produces a **new, second essay** — not a revision of the original. The new essay reframes Scholion as **general research infrastructure for making the dependency structure of scientific argumentation explicit and machine-maintainable** — the "circuitry of science." It explicitly references the original essay as the starting point and shows how the thinking deepened through actual research work: the scope expanded from safety cases to a general methodology tested across domains.

Two essays, two purposes:
- **Essay 1 (existing, unchanged):** The original thesis statement. Safety cases as dependency graphs. Where the project started.
- **Essay 2 (this session):** The evolved research program. General methodology, demonstrated on a medical paper, with safety/interpretability/constitutional AI as application horizons.

Together they show a research process: hypothesis → investigation → expanded scope. That's more credible than either essay alone.

**The key distinction the essay must maintain:** Scholion is a general methodology applied across domains. AI safety, mechanistic interpretability, and constitutional AI are application domains where the implications are significant — but they are not what Scholion *is*. The reader should not conflate the tool with any single application. The essay should demonstrate that Thomas is building a prototype, doing research, and applying the methodology across domains — and that these ideas have applications for safety, interpretability, and constitutional AI that are not yet understood or researched.

---

## Mission

Produce a new `scholion-circuitry.mdx` (or similar slug) and new island components that:

1. Explicitly reference the original essay as the starting point, showing intellectual development
2. Frame Scholion as a general claim-dependency methodology — the circuitry of science
3. Demonstrate it with the medical paper (Chen et al. 2025) as the primary worked example — a domain-neutral, concrete proof of concept
4. Identify safety, interpretability, and constitutional AI as application domains with underexplored implications — mentioned as horizons, not as the core identity
5. Present the updated research program with cross-domain validation strategy and explicit kill criteria

---

## Essay Architecture (Revised)

### Section 01: From Safety Cases to the General Problem

Open with the explicit back-reference: "In an earlier essay, I argued that safety cases at frontier AI organizations are dependency graphs that nobody maintains. I used Anthropic's Responsible Scaling Policy to show how a four-level dependency chain — from deployment decisions down to acknowledged open research questions — lives in prose documents and researchers' heads rather than in machines. That framing was correct, but it was too narrow. The problem isn't specific to safety cases. It's structural to how science works."

Then the generalization: every research paper makes claims that depend on other claims, which depend on prior results, which depend on foundational assumptions. This dependency structure is real — it has to be, because the arguments have logical structure — but it's implicit, maintained in researchers' heads and prose documents, and brittle when conditions change.

Give the medical paper as the concrete proof. Chen et al. (2025) is a systematic review of COVID-19-induced acute pancreatitis. Their three mortality predictors (elevated WBC, AST/ALT ratio, surgical intervention) depend on their inclusion criteria, which depend on the distinction between COVID-19-induced vs. coincident pancreatitis, which depends on diagnostic standards that are themselves contested. If the inclusion criteria are wrong, every downstream statistical finding is undermined. That's a dependency chain in clinical medicine — structurally identical to the RSP chain in the original essay, in a completely different domain.

The broadening move: this pattern is everywhere. Clinical medicine. AI safety policy. Mechanistic interpretability. Any field where conclusions rest on chains of prior work. The dependency structure exists but is invisible and manually maintained. Scholion is a system for making these structures explicit and machine-maintainable — not for one domain, but as general research infrastructure.

### Section 02: The Decomposition (Toulmin as Operating System)

This section survives largely intact. The Toulmin structure is domain-independent — it's the grammar of argumentation, not tied to any field.

**Change the worked example.** Replace the AI safety case ("This AI system is safe to deploy at ASL-3") with a claim from the medical paper. Suggested: "Elevated AST/ALT ratio is an independent predictor of mortality in COVID-19-induced acute pancreatitis."

- **Claim:** AST/ALT ratio predicts mortality
- **Data:** Multivariate logistic regression on 111 patients from 87 studies
- **Warrant:** The statistical analysis controls for confounders, so the association is causal
- **Backing:** Standard epidemiological methodology for systematic reviews
- **Qualifier:** In COVID-19-induced (not coincident) cases only
- **Rebuttal:** If the inclusion criteria failed to distinguish induced from coincident cases, the patient population is contaminated and the statistical finding is unreliable

This demonstrates that Toulmin decomposition works on empirical/statistical arguments, not just theoretical ones. It also makes the medical paper the worked example throughout the essay, keeping the framing domain-neutral.

### Section 03: What Doesn't Exist (Positioning)

Update the positioning grid. The comparison should be against general research infrastructure tools, not domain-specific ones:

- Citation graphs (Semantic Scholar, Connected Papers)
- Scite.ai
- Elicit (current capabilities as of Feb 2026)
- Argument mining systems (AIF, AIFDB)
- Knowledge graphs (ORKG, AutoSchemaKG)
- Scholion

Capabilities: Paper-level linking, Claim-level extraction, Cross-document dependency tracking, Crux identification, Invalidation propagation.

**Do not include TransformerLens/Neuronpedia** in the positioning grid — those are interpretability-specific tools and including them would narrow the framing. The positioning is against general research infrastructure.

### Section 04: What Scholion Enables (Revised)

The three "what changes" claims survive but are reframed:

1. **Dependency structures become navigable.** (Replaces "Structural oversight.") Any research community gains a machine-readable map of which claims depend on which. When a foundational result is challenged, the implications propagate immediately through the graph rather than slowly through informal channels.

2. **Research arguments become living documents.** Survives as-is — this is domain-general. When new evidence arrives, the graph updates. Safety cases are one instance of this; clinical guidelines are another; any field with active research is a third.

3. **Cruxes become identifiable.** (Sharpened from "shared epistemic map.") The system identifies load-bearing dependencies — points where, if the supporting claim falls, the downstream conclusion collapses. These are the joints where research investment should concentrate and where monitoring matters most.

### Section 05: Application Horizons (New — replaces or supplements current Section 04)

This is where safety, interpretability, and constitutional AI appear — **as application domains with underexplored implications, not as Scholion's core identity.**

Frame explicitly: "The general methodology has implications for several active research areas that have not been explored."

**AI Safety:** Safety cases at frontier AI organizations have exactly the dependency structure Scholion tracks. The RSP example can appear here — briefly, as one application, not as the motivating example. A safety case maintained as a dependency graph with automated invalidation propagation would convert what is currently a manual, brittle process into a structural one.

**Mechanistic Interpretability:** The interpretability literature is building a map of how neural networks work internally. Each finding depends on prior findings — circuit-level claims depend on feature decomposition methods, which depend on the linear representation hypothesis. Scholion could track these dependencies as a graph and identify the cruxes of the interpretability research program. This has not been done.

**Constitutional AI:** The connection to Doyle's Reason Maintenance Systems and formal argumentation suggests a path toward what the methodology docs call an "Epistemic Constitution" — a formal set of structural rules for verifying argument integrity, distinct from the behavioral/moral constitutions used in Constitutional AI. The idea that a structurally competent judge can oversee a substantively stronger researcher by verifying dependency structure rather than competing on domain knowledge is a hypothesis with significant implications for scalable oversight. It has not been tested.

**The framing for all three:** These are research directions that the general methodology opens up. They require investigation. Thomas is not claiming to have solved them — he's identifying that the connections exist and haven't been explored.

### Section 06: The Research Program (Replaces current Section 05)

Lay out the validation plan as a research program:

- Phase 1: Manual annotation across domains (medical, AI safety, interpretability) with inter-annotator agreement measurement. Kill criterion: κ < 0.3 means the schema doesn't work.
- Phase 2: LLM extraction pipeline benchmarked against manual annotations. Kill criterion: F1 < 40% means current models can't do this.
- Phase 3: Graph infrastructure with working invalidation propagation.
- Phase 4: Domain expert validation — does the graph reveal non-obvious dependencies faster than prose review?

The validation timeline island can be updated to reflect this structure.

### Section 07: Why I'm Working on This (Survives with minor updates)

The credibility section survives. The thread — "identifying where research capabilities are mature enough to become production systems, then building the bridge" — applies to the general framing as well as the original.

---

## Island Components — Scope

This is a new essay, so components use a new prefix: `SC2` (Scholion Circuitry, essay 2). The original Scholion islands remain untouched.

**New components:**

1. **`SC2DependencyChain.tsx`** — Medical paper dependency chain (inclusion criteria → patient population → statistical analysis → mortality predictors). Same visual pattern as the original `ScholionDependencyChain`, new content. Can reference the original component as a design template.

2. **`SC2ToulminDiagram.tsx`** — Worked example using the medical claim about AST/ALT ratio as independent mortality predictor. Same Toulmin anatomy structure as the original, grounded in clinical evidence rather than safety policy.

3. **`SC2PositioningGrid.tsx`** — General research infrastructure comparison. Systems: citation graphs, Scite, Elicit, argument mining (AIF/AIFDB), knowledge graphs (ORKG), Scholion. No domain-specific tools.

4. **`SC2PipelineDiagram.tsx`** — Same 4-stage extraction pipeline, with schema output examples from the medical paper extraction. Pipeline is domain-independent; the examples prove it.

5. **`SC2ValidationTimeline.tsx`** — Cross-domain research program (Phases 1–4 with kill criteria). Reflects the updated roadmap structure.

6. **`SC2ApplicationHorizons.tsx`** — Simple 3-card layout: Safety / Interpretability / Constitutional AI. Each card has a one-line description of the underexplored connection. Keep it minimal and visually understated — these are horizons, not claims. No dependency chains or detailed diagrams; that would give them more visual weight than the framing warrants.

**Optional (decide during execution):**

7. **`SC2CredibilityCards.tsx`** — May not be needed if the credibility argument is woven into prose differently in the second essay. Decide during drafting whether a dedicated island earns its place or whether the back-reference to the original essay carries that weight.

---

## Tone & Voice

The essay should be **propositional** — laying out a research program and inviting scrutiny, not selling a product. The voice is a researcher presenting a thesis, methodology, and validation plan, then identifying where the implications extend beyond the immediate work.

Key signals to hit:
- "I am building this and testing it across domains" — active research, not speculation
- "These connections exist and haven't been explored" — identifying gaps, not claiming to have filled them
- "Here are my kill criteria" — intellectual honesty about where this fails
- "The methodology is general; the applications are domain-specific" — the core distinction the reader must leave with

---

## Technical Constraints

All standard island constraints from CLAUDE.md apply:

- TypeScript (.tsx), no external libraries
- Injected `<style>` tags with scoped class names for responsive
- `useInView` hook for scroll-triggered animations
- Design tokens from `shared/tokens.ts`
- Breakpoints: 640px (tablet), 420px (phone)
- Respect `prefers-reduced-motion`
- No lucide-react or icon libraries — inline SVGs only
- `<div>` instead of `<p>` for island elements needing custom margins (DECISIONS.md #015)
- All islands use `client:visible` hydration

---

## Verification Checklist

- [ ] `npm run build` passes with zero errors
- [ ] New essay renders at its own URL (e.g., `/writing/scholion-circuitry/`) with all islands hydrated
- [ ] Original essay at `/writing/scholion/` is completely unchanged — no modifications to `scholion.mdx` or any `Scholion*.tsx` component
- [ ] Back-reference to the original essay works as a link and reads naturally
- [ ] Medical paper example is factually accurate (verify claims against Chen et al. 2025)
- [ ] Positioning grid reflects current (Feb 2026) general research infrastructure landscape
- [ ] The reader cannot mistake Scholion for "an interpretability tool" or "a safety case tool" — it is clearly a general methodology
- [ ] Safety, interpretability, and constitutional AI are presented as underexplored application horizons, not as the core identity
- [ ] The essay reads as a research program, not a product pitch
- [ ] The two essays together show intellectual development — hypothesis → investigation → expanded scope
- [ ] All scroll animations respect `prefers-reduced-motion`
- [ ] Mobile: all islands stack correctly, no horizontal scroll
- [ ] Writing index at `/writing/` lists both Scholion essays
- [ ] No new JS dependencies

---

## Dependencies

**Must be completed before executing this session:**

1. Phase 0 extraction prototype on Chen et al. (2025) — the medical paper worked example must be grounded in actual extraction work, not projected
2. Fresh literature scan — ensures positioning grid is accurate
3. Finalized annotation schema — the Toulmin example in Section 02 should use the actual schema, not a sketch

**Do not execute this session until those three are done.** The essay should reflect real findings, not projections.
