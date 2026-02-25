import { useInView } from "./shared/useInView";

interface FieldRow {
  name: string;
  chip: { label: string; type: "worked" | "new" };
  desc: string;
  example?: string;
}

interface FailureRow {
  id: string;
  severity: "high" | "med" | "low";
  title: string;
  desc: string;
  resolution: string;
}

const WORKED_FIELDS: FieldRow[] = [
  {
    name: "warrant",
    chip: { label: "Validated", type: "worked" },
    desc: "Consistently surfaced implicit reasoning the paper\u2019s prose left unstated. The confounding-by-indication problem in the surgical intervention finding, the continuity assumption in the safety case \u2014 both captured through the warrant field doing genuine analytical work.",
  },
  {
    name: "dependency_type",
    chip: { label: "Validated", type: "worked" },
    desc: "Five types (causal, conditional, purposive, contrastive, conjunctive) covered most relationships without straining. The mortality tree and chronology synthesis both mapped naturally.",
  },
  {
    name: "crux",
    chip: { label: "Validated", type: "worked" },
    desc: "The flip test produced the essay\u2019s most practically significant output: the selective invalidation pattern where different cruxes collapse different subsets of the argument.",
  },
  {
    name: "depends_on",
    chip: { label: "Validated", type: "worked" },
    desc: "Cross-extraction references worked: the chronology extraction shares two foundational claims with the mortality extraction without duplication, validating extraction by argument block rather than by paper section.",
  },
];

const ADDED_FIELDS: FieldRow[] = [
  {
    name: "confidence",
    chip: { label: "New", type: "new" },
    desc: "Binary IN/OUT/UNDETERMINED cannot represent epistemic weight. The chronology null findings are technically IN \u2014 published, peer-reviewed results \u2014 but rest on 11 events with wide confidence intervals. Treating them as straightforwardly IN misrepresents their evidential strength.",
    example: "Values: high | medium | low \u00B7 Alongside status, not replacing it",
  },
  {
    name: "claim_source",
    chip: { label: "New", type: "new" },
    desc: "The Balthazar-survival tension \u2014 the most analytically interesting observation in the extraction \u2014 is not something the authors assert. The schema needs to distinguish between what the paper says and what the annotator surfaces.",
    example: "Values: author_explicit | author_implicit | annotator_synthesized",
  },
];

const FAILURES: FailureRow[] = [
  {
    id: "SF-001", severity: "high",
    title: "Weighted support",
    desc: "Binary status cannot capture that a claim is published but epistemically weak. Absence of evidence treated identically to strong positive findings.",
    resolution: "Resolved \u2192 confidence field added",
  },
  {
    id: "SF-002", severity: "med",
    title: "Annotator-synthesized claims",
    desc: "No way to distinguish author assertions from structural observations the annotator surfaces by juxtaposing findings.",
    resolution: "Resolved \u2192 claim_source field added",
  },
  {
    id: "SF-003", severity: "med",
    title: "Cross-study comparison reasoning",
    desc: "\u201COur null results differ from their positive results, therefore the methodological difference explains the divergence\u201D \u2014 doesn\u2019t map to any of the five dependency types.",
    resolution: "Open \u2192 may warrant a sixth type (\u201Ccomparative\u201D). Track frequency in Phase 1.",
  },
  {
    id: "SF-004", severity: "low",
    title: "Informal schema drift",
    desc: "Extraction practice surfaced useful fields (boundary conditions, flip test notes, typed anchors) not in the canonical schema. The schema evolved informally through annotation before being formally revised.",
    resolution: "Open \u2192 reconcile practice-derived fields with schema.yaml for Phase 1.",
  },
  {
    id: "SF-005", severity: "med",
    title: "Confounding by indication",
    desc: "Statistical association \u2260 causal relationship. The warrant field captures this, but no structured way to flag that the observed effect may be spurious.",
    resolution: "Open \u2192 track across domains. May be specific to empirical/statistical research.",
  },
  {
    id: "SF-006", severity: "low",
    title: "Multi-span claim text",
    desc: "Synthesis claims draw from multiple non-contiguous sections. claim_text becomes a semi-verbatim composite rather than a true verbatim extract.",
    resolution: "Open \u2192 allow claim_text as a list of source spans with section references.",
  },
];

export default function ScholionSchemaEvolution() {
  const [ref, inView] = useInView(0.1);

  let delayIdx = 0;
  const nextDelay = () => {
    const d = 0.1 + delayIdx * 0.05;
    delayIdx++;
    return `${d}s`;
  };

  return (
    <div
      ref={ref}
      className={`scholion-evo${inView ? " in-view" : ""}`}
      style={{
        margin: "48px 0",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <style>{`
        .scholion-evo .evo-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .scholion-evo .evo-label::before {
          content: '';
          display: block;
          width: 12px;
          height: 1.5px;
          background-color: var(--accent);
        }
        .scholion-evo .evo-section-header {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 8px 14px;
          border-radius: 6px 6px 0 0;
          color: var(--bg);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .scholion-evo .evo-header-worked { background-color: var(--teal); }
        .scholion-evo .evo-header-added { background-color: var(--accent); }
        .scholion-evo .evo-header-edge { background-color: var(--blue); }
        .scholion-evo .evo-section-body {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 6px 6px;
          margin-bottom: 20px;
        }
        .scholion-evo .evo-field-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 0;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          align-items: baseline;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .scholion-evo .evo-field-row:last-child { border-bottom: none; }
        .scholion-evo.in-view .evo-field-row {
          opacity: 1;
          transform: translateY(0);
          transition-delay: var(--d, 0s);
        }
        .scholion-evo .evo-field-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .scholion-evo .evo-field-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: var(--text-mid);
          line-height: 1.4;
        }
        .scholion-evo .evo-field-example {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: var(--text-light);
          margin-top: 3px;
        }
        .scholion-evo .evo-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 6px;
          border-radius: 3px;
          display: inline-block;
        }
        .scholion-evo .evo-chip-worked {
          color: var(--teal);
          background-color: var(--teal-dim);
        }
        .scholion-evo .evo-chip-new {
          color: var(--accent);
          background-color: var(--accent-dim);
        }
        .scholion-evo .evo-chip-open {
          color: var(--blue);
          background-color: var(--blue-dim);
        }
        .scholion-evo .evo-failure-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text);
          line-height: 1.35;
          margin-bottom: 3px;
        }
        .scholion-evo .evo-failure-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem;
          color: var(--text-mid);
          line-height: 1.4;
        }
        .scholion-evo .evo-failure-resolution {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.625rem;
          color: var(--text-light);
          font-style: italic;
          margin-top: 4px;
        }
        .scholion-evo .evo-severity {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 1px 5px;
          border-radius: 2px;
        }
        .scholion-evo .evo-sev-high {
          color: var(--red);
          background-color: var(--red-dim);
        }
        .scholion-evo .evo-sev-med {
          color: var(--accent);
          background-color: var(--accent-dim);
        }
        .scholion-evo .evo-sev-low {
          color: var(--text-light);
          background-color: var(--bg-warm);
        }
        .scholion-evo .evo-annotation {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem;
          color: var(--text-light);
          line-height: 1.4;
          padding: 12px 16px;
          background-color: var(--bg-warm);
          border-left: 3px solid var(--accent);
          border-radius: 0 6px 6px 0;
          margin-top: 24px;
        }
        .scholion-evo .evo-annotation strong {
          color: var(--text-mid);
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .scholion-evo .evo-field-row { grid-template-columns: 1fr; gap: 2px; }
        }
      `}</style>

      <div className="evo-label">Schema Evolution · v0.1 → v0.2 after Chen extraction</div>

      {/* What Worked */}
      <div className="evo-section-header evo-header-worked">What Worked</div>
      <div className="evo-section-body">
        {WORKED_FIELDS.map((f) => {
          const d = nextDelay();
          return (
            <div className="evo-field-row" key={f.name} style={{ "--d": d } as React.CSSProperties}>
              <div className="evo-field-name">
                <span>{f.name}</span>
                <span className={`evo-chip evo-chip-${f.chip.type}`}>{f.chip.label}</span>
              </div>
              <div className="evo-field-desc">{f.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Fields Added */}
      <div className="evo-section-header evo-header-added">Fields Added in v0.2</div>
      <div className="evo-section-body">
        {ADDED_FIELDS.map((f) => {
          const d = nextDelay();
          return (
            <div className="evo-field-row" key={f.name} style={{ "--d": d } as React.CSSProperties}>
              <div className="evo-field-name">
                <span>{f.name}</span>
                <span className={`evo-chip evo-chip-${f.chip.type}`}>{f.chip.label}</span>
              </div>
              <div>
                <div className="evo-field-desc">{f.desc}</div>
                {f.example && <div className="evo-field-example">{f.example}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edge Cases */}
      <div className="evo-section-header evo-header-edge">Documented Edge Cases — 6 Failure Modes</div>
      <div className="evo-section-body">
        {FAILURES.map((f) => {
          const d = nextDelay();
          return (
            <div className="evo-field-row" key={f.id} style={{ "--d": d } as React.CSSProperties}>
              <div className="evo-field-name">
                <span>{f.id}</span>
                <span className={`evo-severity evo-sev-${f.severity}`}>
                  {f.severity === "high" ? "High" : f.severity === "med" ? "Medium" : "Low"}
                </span>
              </div>
              <div>
                <div className="evo-failure-title">{f.title}</div>
                <div className="evo-failure-desc">{f.desc}</div>
                <div className="evo-failure-resolution">{f.resolution}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="evo-annotation">
        <strong>Honest accounting over premature polish.</strong> Two of six failure modes were resolved by adding fields (confidence, claim_source). Four remain open — deliberately. The schema should be tested across domains before committing to structural changes that may be artifacts of a single paper's idiosyncrasies. Phase 1's job is to determine which edge cases are universal and which are domain-specific.
      </div>
    </div>
  );
}
