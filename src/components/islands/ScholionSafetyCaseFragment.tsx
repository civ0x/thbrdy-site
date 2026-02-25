import { useInView } from "./shared/useInView";
import { DiagramPopover, useDiagramPopover } from "./shared/DiagramPopover";

interface PopData {
  label: string;
  title: string;
  body: string;
  structural: string;
}

const POP_DATA: Record<string, PopData> = {
  top: {
    label: 'Safety Determination',
    title: 'Top-Level Safety Conclusion',
    body: 'The overarching claim that current models are safe to deploy under existing safeguards. In traditional safety case methodology (GSN, CAE), this would be the top goal node. Here it\'s rendered as a dependency graph node with typed edges — the same structural representation Scholion uses for research claims, because the operations (dependency tracking, invalidation propagation) are domain-general.',
    structural: 'A conjunctive dependency on all four pillars. The graph makes a key structural property immediately legible: unlike the Chen extraction where different cruxes collapse different subsets, here <em>any single</em> pillar failure is sufficient to revisit the top-level determination. That asymmetry is valuable to know when prioritizing monitoring and review effort.'
  },
  claim1: {
    label: 'Evidential Pillar — Prior Expectations',
    title: 'Training Continuity Implies Alignment Continuity',
    body: 'The argument that because the current model\'s training process is similar to its predecessor\'s, we should expect similar alignment properties. The report thoughtfully acknowledges the uncertainty here. Toulmin decomposition adds a further step by making the connecting reasoning explicit: the warrant linking "similar training" to "similar alignment" is a continuity assumption — a reasonable prior, but one worth surfacing for external reviewers to evaluate directly.',
    structural: 'This pillar illustrates why warrant extraction is useful for safety cases. Making the continuity assumption explicit gives reviewers a concrete claim to assess, rather than having to reconstruct the reasoning themselves. The same value Scholion\'s warrant field provided in the Chen extraction — surfacing implicit reasoning — applies here.'
  },
  warrant1: {
    label: 'Implicit Warrant',
    title: 'Similar Training → Similar Alignment',
    body: 'The reasoning connecting Claim 1\'s evidence to its conclusion. The report frames this as a prior expectation — which is appropriate given the state of the science. Scholion\'s contribution is to tag it explicitly so reviewers can engage with it directly. This parallels the Chen extraction, where the warrant field surfaced the confounding-by-indication reasoning the authors left for readers to fill in. In both cases, making the warrant explicit improves the argument\'s auditability.',
    structural: 'The RSP asks external reviewers to assess "analytical rigor" and whether they "disagree with any of the Risk Report\'s key claims." Surfacing implicit warrants like this one gives reviewers more to work with — the kind of structural bookkeeping that\'s tedious to maintain manually but straightforward as a graph operation.'
  },
  claim2: {
    label: 'Evidential Pillar — Alignment Assessment',
    title: 'No Dangerous Coherent Misaligned Goals',
    body: 'The alignment audit\'s finding that the model does not exhibit dangerous coherent misaligned goals. The strength of this claim depends on the scope and sensitivity of the audit methods — which is what Claim 3 addresses. The report already treats these as connected; the graph representation makes the nature of that connection typed and traceable.',
    structural: 'A full Scholion extraction would likely surface a conditional dependency between this pillar and Claim 3: the credibility of "no dangerous goals found" depends on the adequacy of the methods used to look. Rendering this as a typed edge helps reviewers and authors track which claims are load-bearing for which conclusions.'
  },
  claim3: {
    label: 'Evidential Pillar — Assessment Integrity',
    title: 'Audit Methods Sufficient; Model Cannot Undermine Assessment',
    body: 'The claim that the methods used in the alignment audit are sufficient to detect concerning behaviors, and that the model cannot circumvent the assessment process. This is a meta-claim about the reliability of the evidence-gathering process — structurally analogous to method.1 in the Chen extraction, where the inclusion criteria define the population that all downstream findings rest on.',
    structural: 'The structural parallel to method.1 is instructive: just as the Chen extraction\'s inclusion criteria are foundational to all downstream claims, audit method sufficiency supports the credibility of Claims 2 and 4. A typed dependency graph would represent this as a conditional relationship, helping safety case maintainers track which pillars need revisiting when audit methods evolve.'
  },
  claim4: {
    label: 'Evidential Pillar — Limited Opaque Reasoning',
    title: 'Limited Opaque Reasoning Capabilities',
    body: 'The assessment that the model\'s opaque reasoning capabilities — reasoning processes not visible in outputs — are limited enough that the alignment audit\'s findings are reliable. This addresses the specific risk that a model could appear aligned while reasoning through pathways the audit can\'t observe. The report takes this seriously, which is why it\'s elevated as a distinct pillar rather than subsumed under Claim 3.',
    structural: 'This claim interacts with Claim 3: extensive opaque reasoning could undermine the audit methods Claim 3 vouches for. The dependency structure between these pillars is richer than a flat conjunctive join — the kind of cross-pillar relationship that becomes easier to maintain when it\'s represented as typed edges in a graph.'
  },
  inv1: {
    label: 'Invalidation Condition',
    title: 'Discontinuous Alignment Shifts',
    body: 'If training changes cause sudden, discontinuous shifts in alignment properties, the continuity assumption underlying Claim 1 would need revisiting. This is the Section 7 invalidation condition: a specific, monitorable trigger that the report\'s authors identified as the condition under which this pillar should be re-evaluated.',
    structural: 'Rendered as a contrastive dependency — the same edge type used for limitation nodes in the Chen graph. The visual language is intentionally identical: same graph operation, different domain. The report\'s Section 7 table is already doing this work manually; Scholion makes it computationally tractable.'
  },
  inv2: {
    label: 'Invalidation Condition',
    title: 'New Concerning Audit Findings',
    body: 'If an updated alignment audit reports major new concerning findings, Claim 2 would need to be re-evaluated. This is the most straightforward invalidation pattern: new evidence directly bearing on an existing finding. The report identifies this trigger explicitly, demonstrating the kind of systematic invalidation tracking that Scholion aims to automate.',
    structural: 'In Scholion\'s status vocabulary, this would flip Claim 2 from IN to OUT, and the conjunctive dependency propagates the status change upward. This is the same selective invalidation operation demonstrated in the Chen graph — the report is already performing it manually in Section 7.'
  },
  inv3: {
    label: 'Invalidation Condition',
    title: 'Audit Method Circumvention',
    body: 'If a model-organisms study demonstrates that the full suite of audit methods can be circumvented, Claim 3 would need revisiting. The report flags this as the key empirical test — a well-specified trigger condition, which is exactly what makes invalidation tracking actionable.',
    structural: 'This invalidation has potential cascade effects: if audit methods are found insufficient, the findings that depend on those methods (Claims 2 and 4) also warrant re-examination. Typed dependency graphs make these cascades traceable — the kind of structural bookkeeping that becomes increasingly valuable as safety cases grow in complexity across model generations.'
  },
  inv4: {
    label: 'Invalidation Condition',
    title: 'Undetected Opaque Reasoning',
    body: 'If evidence emerges of substantial opaque reasoning capabilities that went undetected, Claim 4 would need revisiting. The inherent difficulty — undetected capabilities are by definition hard to test for — is one the report acknowledges. The invalidation condition is well-specified even if the monitoring challenge is real.',
    structural: 'This highlights an interesting structural difference between domains. In the Chen extraction, invalidation conditions are empirically testable (run a larger study, adjust for more covariates). In safety cases, some invalidation conditions are harder to monitor — a property of the domain that the graph makes legible, helping safety case authors and reviewers focus attention where epistemic uncertainty is highest.'
  },
};

export default function ScholionSafetyCaseFragment() {
  const [ref, inView] = useInView(0.1);
  const { openKey, triggerRef, close, getNodeProps, getPopoverMouseProps } = useDiagramPopover();
  const popContent = openKey && POP_DATA[openKey] ? POP_DATA[openKey] : null;

  return (
    <div
      ref={ref}
      className={`scf${inView ? " scf-visible" : ""}`}
      style={{
        margin: "48px 0",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <style>{styles}</style>

      <div className="scf-comp-label">Sabotage Risk Report — Safety Case Fragment · 4 pillars, 4 invalidation conditions</div>
      <div className="scf-scroll-hint">Scroll to see full graph →</div>

      <div className="scf-graph-scroll">
        <div className="scf-graph">

          {/* TOP-LEVEL SAFETY DETERMINATION */}
          <div className="scf-node scf-safety-top" style={{ "--d": "0.1s", maxWidth: 420 } as React.CSSProperties} {...getNodeProps("top")}>
            <div className="scf-node-id">
              <span className="scf-dot scf-dot-in" />
              safety.top
              <span className="scf-safety-badge">Safety Determination</span>
            </div>
            <div className="scf-node-label">Current models are sufficiently safe to deploy under existing safeguards</div>
            <div className="scf-node-detail">Top-level conclusion — requires all four pillars to hold</div>
          </div>

          <div className="scf-cc"><div className="scf-vert" style={{ height: 20 }} /></div>
          <div className="scf-dep-type">conjunctive</div>
          <div className="scf-cc"><div className="scf-vert" style={{ height: 12 }} /></div>

          <div style={{ width: "90%", margin: "0 auto" }}><div className="scf-branch-bar" /></div>

          {/* FOUR EVIDENTIAL PILLARS */}
          <div className="scf-pillars">

            {/* PILLAR 1 */}
            <div className="scf-pillar">
              <div className="scf-cc"><div className="scf-vert" style={{ height: 10 }} /></div>
              <div className="scf-inv-pair">
                <div className="scf-node scf-crux" style={{ "--d": "0.25s" } as React.CSSProperties} {...getNodeProps("claim1")}>
                  <div className="scf-node-id">
                    <span className="scf-dot scf-dot-in" /> claim.1
                    <span className="scf-crux-badge">Crux</span>
                  </div>
                  <div className="scf-node-label">Prior expectations: training continuity implies alignment continuity</div>
                </div>

                <div className="scf-cc"><div className="scf-vert" style={{ height: 8 }} /></div>
                <div className="scf-node scf-warrant-node" style={{ "--d": "0.35s", fontSize: "0.65rem" } as React.CSSProperties} {...getNodeProps("warrant1")}>
                  <div className="scf-node-id" style={{ fontSize: "0.45rem" }}>
                    warrant
                    <span className="scf-implicit-tag">Implicit</span>
                  </div>
                  <div className="scf-node-label" style={{ fontSize: "0.65rem" }}>Similar training → similar alignment properties</div>
                  <div className="scf-node-detail">Stated as belief, not mechanism</div>
                </div>

                <div className="scf-cc"><div className="scf-vert" style={{ height: 8 }} /></div>
                <div className="scf-dep-type">contrastive</div>
                <div className="scf-cc"><div className="scf-vert" style={{ height: 6 }} /></div>
                <div className="scf-node scf-invalidation" style={{ "--d": "0.45s" } as React.CSSProperties} {...getNodeProps("inv1")}>
                  <div className="scf-node-id" style={{ fontSize: "0.45rem" }}>invalidation</div>
                  <div className="scf-node-label" style={{ fontSize: "0.625rem" }}>Training changes cause discontinuous alignment shifts</div>
                </div>
              </div>
            </div>

            {/* PILLAR 2 */}
            <div className="scf-pillar">
              <div className="scf-cc"><div className="scf-vert" style={{ height: 10 }} /></div>
              <div className="scf-inv-pair">
                <div className="scf-node scf-crux" style={{ "--d": "0.3s" } as React.CSSProperties} {...getNodeProps("claim2")}>
                  <div className="scf-node-id">
                    <span className="scf-dot scf-dot-in" /> claim.2
                    <span className="scf-crux-badge">Crux</span>
                  </div>
                  <div className="scf-node-label">Alignment audit reports no dangerous coherent misaligned goals</div>
                </div>

                <div className="scf-cc"><div className="scf-vert" style={{ height: 16 }} /></div>
                <div className="scf-dep-type">contrastive</div>
                <div className="scf-cc"><div className="scf-vert" style={{ height: 6 }} /></div>
                <div className="scf-node scf-invalidation" style={{ "--d": "0.45s" } as React.CSSProperties} {...getNodeProps("inv2")}>
                  <div className="scf-node-id" style={{ fontSize: "0.45rem" }}>invalidation</div>
                  <div className="scf-node-label" style={{ fontSize: "0.625rem" }}>Updated audit reports major new concerning findings</div>
                </div>
              </div>
            </div>

            {/* PILLAR 3 */}
            <div className="scf-pillar">
              <div className="scf-cc"><div className="scf-vert" style={{ height: 10 }} /></div>
              <div className="scf-inv-pair">
                <div className="scf-node scf-crux" style={{ "--d": "0.35s" } as React.CSSProperties} {...getNodeProps("claim3")}>
                  <div className="scf-node-id">
                    <span className="scf-dot scf-dot-in" /> claim.3
                    <span className="scf-crux-badge">Crux</span>
                  </div>
                  <div className="scf-node-label">Audit methods are sufficient; model cannot undermine the assessment</div>
                </div>

                <div className="scf-cc"><div className="scf-vert" style={{ height: 16 }} /></div>
                <div className="scf-dep-type">contrastive</div>
                <div className="scf-cc"><div className="scf-vert" style={{ height: 6 }} /></div>
                <div className="scf-node scf-invalidation" style={{ "--d": "0.5s" } as React.CSSProperties} {...getNodeProps("inv3")}>
                  <div className="scf-node-id" style={{ fontSize: "0.45rem" }}>invalidation</div>
                  <div className="scf-node-label" style={{ fontSize: "0.625rem" }}>Model-organisms study shows circumvention of full audit suite</div>
                </div>
              </div>
            </div>

            {/* PILLAR 4 */}
            <div className="scf-pillar">
              <div className="scf-cc"><div className="scf-vert" style={{ height: 10 }} /></div>
              <div className="scf-inv-pair">
                <div className="scf-node scf-crux" style={{ "--d": "0.4s" } as React.CSSProperties} {...getNodeProps("claim4")}>
                  <div className="scf-node-id">
                    <span className="scf-dot scf-dot-in" /> claim.4
                    <span className="scf-crux-badge">Crux</span>
                  </div>
                  <div className="scf-node-label">Limited opaque reasoning capabilities</div>
                </div>

                <div className="scf-cc"><div className="scf-vert" style={{ height: 16 }} /></div>
                <div className="scf-dep-type">contrastive</div>
                <div className="scf-cc"><div className="scf-vert" style={{ height: 6 }} /></div>
                <div className="scf-node scf-invalidation" style={{ "--d": "0.55s" } as React.CSSProperties} {...getNodeProps("inv4")}>
                  <div className="scf-node-id" style={{ fontSize: "0.45rem" }}>invalidation</div>
                  <div className="scf-node-label" style={{ fontSize: "0.625rem" }}>Evidence of substantial opaque reasoning undetected by audits</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Annotation */}
      <div className="scf-annotation-note">
        <strong>Same graph, different domain.</strong> The Section 7 table is already doing invalidation tracking — each right-column condition, if triggered, signals that its corresponding pillar needs re-evaluation. Because the top-level determination is a <strong>conjunctive</strong> dependency on all four pillars, any single invalidation is sufficient to revisit the safety case. Scholion's contribution is making this structure computationally tractable: as safety cases grow across model generations, the structural bookkeeping that the report's authors did manually in Section 7 becomes increasingly valuable to automate.
      </div>

      {/* Legend */}
      <div className="scf-graph-legend">
        <div className="scf-legend-item"><span className="scf-legend-swatch scf-sw-safety" /> Safety determination</div>
        <div className="scf-legend-item"><span className="scf-legend-swatch scf-sw-crux" /> Evidential pillar (crux)</div>
        <div className="scf-legend-item"><span className="scf-legend-swatch scf-sw-inv" /> Invalidation condition</div>
        <div className="scf-legend-item"><span className="scf-legend-swatch scf-sw-warrant" /> Implicit warrant</div>
        <div className="scf-legend-item" style={{ fontStyle: "italic" }}>Tap any node for context</div>
      </div>

      <DiagramPopover
        content={popContent}
        triggerRef={triggerRef}
        open={!!openKey}
        onClose={close}
        {...getPopoverMouseProps()}
      />
    </div>
  );
}

const styles = `
  /* ─── COMPONENT LABEL ─── */
  .scf .scf-comp-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .scf .scf-comp-label::before {
    content: '';
    display: block;
    width: 12px;
    height: 1.5px;
    background-color: var(--accent);
  }

  /* ─── SCROLL WRAPPER ─── */
  .scf .scf-graph-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
  }
  .scf .scf-scroll-hint {
    display: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.625rem;
    color: var(--text-muted);
    text-align: right;
    margin-bottom: 8px;
  }

  /* ─── GRAPH LAYOUT ─── */
  .scf .scf-graph {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ─── NODES ─── */
  .scf .scf-node {
    background: #FFFFFF;
    border: 1px solid #E8E2D8;
    border-radius: 6px;
    padding: 10px 14px;
    position: relative;
    cursor: pointer;
    transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.15s ease;
  }
  .scf .scf-node:hover,
  .scf .scf-node:focus-visible {
    box-shadow: 0 2px 12px rgba(44, 36, 22, 0.08);
    outline: none;
  }
  .scf .scf-node {
    opacity: 0;
    transform: translateY(8px);
  }
  .scf.scf-visible .scf-node {
    opacity: 1;
    transform: translateY(0);
    transition-delay: var(--d, 0s);
  }

  .scf .scf-node-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .scf .scf-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .scf .scf-dot-in { background-color: var(--teal); }
  .scf .scf-node-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text);
    line-height: 1.35;
  }
  .scf .scf-node-detail {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    color: var(--text-light);
    line-height: 1.35;
    margin-top: 3px;
  }

  /* ─── NODE VARIANTS ─── */
  .scf .scf-safety-top {
    border-left: 3px solid var(--teal);
    background: linear-gradient(135deg, #FFFFFF, var(--teal-dim));
  }
  .scf .scf-safety-top .scf-node-label { font-weight: 600; }

  .scf .scf-crux {
    border-left: 3px solid var(--accent);
    background: linear-gradient(135deg, #FFFFFF, var(--accent-dim));
  }
  .scf .scf-crux .scf-node-label { font-weight: 600; }

  .scf .scf-crux-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    background-color: var(--accent-dim);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .scf .scf-safety-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--teal);
    background-color: var(--teal-dim);
    padding: 1px 5px;
    border-radius: 3px;
  }

  .scf .scf-invalidation {
    border-left: 2px solid var(--red);
    background: linear-gradient(135deg, #FFFFFF, var(--red-dim));
  }
  .scf .scf-warrant-node {
    border-left: 2px dashed var(--accent);
    background: var(--bg-warm);
  }
  .scf .scf-implicit-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.45rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--accent);
    background-color: var(--accent-dim);
    padding: 1px 4px;
    border-radius: 2px;
  }

  /* ─── CONNECTORS ─── */
  .scf .scf-cc {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .scf .scf-vert {
    width: 1px;
    background-color: var(--border-mid);
    align-self: center;
  }
  .scf .scf-dep-type {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.45rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    background-color: var(--bg);
    padding: 0 4px;
    line-height: 1;
    z-index: 1;
    position: relative;
  }
  .scf .scf-branch-bar {
    height: 1px;
    background-color: var(--border-mid);
  }

  /* ─── PILLAR LAYOUT ─── */
  .scf .scf-pillars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
  }
  .scf .scf-pillar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .scf .scf-inv-pair {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* ─── ANNOTATION CALLOUT ─── */
  .scf .scf-annotation-note {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6875rem;
    color: var(--text-light);
    line-height: 1.4;
    padding: 12px 16px;
    background-color: var(--bg-warm);
    border-left: 3px solid var(--accent);
    border-radius: 0 6px 6px 0;
    margin-top: 24px;
    max-width: 700px;
  }
  .scf .scf-annotation-note strong {
    color: var(--text-mid);
    font-weight: 600;
  }

  /* ─── LEGEND ─── */
  .scf .scf-graph-legend {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .scf .scf-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem;
    color: var(--text-mid);
  }
  .scf .scf-legend-swatch {
    width: 18px;
    height: 13px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .scf .scf-sw-safety {
    border: 1px solid #E8E2D8;
    border-left: 3px solid var(--teal);
    background: linear-gradient(135deg, #FFFFFF, var(--teal-dim));
  }
  .scf .scf-sw-crux {
    border: 1px solid #E8E2D8;
    border-left: 3px solid var(--accent);
    background: linear-gradient(135deg, #FFFFFF, var(--accent-dim));
  }
  .scf .scf-sw-inv {
    border: 1px solid #E8E2D8;
    border-left: 2px solid var(--red);
    background: linear-gradient(135deg, #FFFFFF, var(--red-dim));
  }
  .scf .scf-sw-warrant {
    border: 1px dashed var(--accent);
    background: var(--bg-warm);
  }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 860px) {
    .scf .scf-scroll-hint { display: block; }
  }
`;
