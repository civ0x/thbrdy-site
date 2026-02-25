import { useInView } from "./shared/useInView";

type Status = "full" | "partial" | "none";

interface CellData {
  status: Status;
  label: string;
}

interface Row {
  capability: string;
  description: string;
  cells: CellData[];
}

const COLUMNS = ["Scholion", "Elicit", "Semantic Scholar", "scite.ai", "Safety Case Frameworks"];

const ROWS: Row[] = [
  {
    capability: "Claim Decomposition",
    description: "Breaking compound assertions into atomic, falsifiable propositions",
    cells: [
      { status: "full", label: "Atomic propositions with Toulmin structure" },
      { status: "partial", label: "Extracts study-level findings" },
      { status: "none", label: "Paper-level only" },
      { status: "none", label: "Citation-sentence level" },
      { status: "partial", label: "Goal-level claims, not atomic" },
    ],
  },
  {
    capability: "Typed Dependencies",
    description: "Classified relationships between claims (causal, conditional, contrastive…)",
    cells: [
      { status: "full", label: "Five dependency types with directed edges" },
      { status: "none", label: "No inter-claim relations" },
      { status: "partial", label: "Citation links, untyped" },
      { status: "partial", label: "Support / contradict / mention" },
      { status: "partial", label: "\u201CSupported by\u201D edges only" },
    ],
  },
  {
    capability: "Warrant Extraction",
    description: "Surfacing the implicit reasoning connecting evidence to conclusions",
    cells: [
      { status: "full", label: "Explicit + implicit warrant classification" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "Author-supplied reasoning" },
    ],
  },
  {
    capability: "Crux Identification",
    description: "Finding load-bearing claims whose failure collapses downstream structure",
    cells: [
      { status: "full", label: "Flip test on dependency graph" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "\u2014" },
      { status: "partial", label: "Manual identification by author" },
    ],
  },
  {
    capability: "Invalidation Propagation",
    description: "Tracing what breaks when a claim is overturned",
    cells: [
      { status: "full", label: "Graph-computed cascade with selective survival" },
      { status: "none", label: "\u2014" },
      { status: "none", label: "\u2014" },
      { status: "partial", label: "Flags contradicting citations" },
      { status: "none", label: "Manual update by author" },
    ],
  },
];

function StatusCell({ status, label, isScholion }: { status: Status; label: string; isScholion: boolean }) {
  return (
    <td className={isScholion ? "scholion-comp-cell" : undefined}>
      <div className={`scholion-comp-status-${status}`}>
        <div className="scholion-comp-dot" />
        <span className="scholion-comp-status-label">{label}</span>
      </div>
    </td>
  );
}

export default function ScholionCompetitiveGap() {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      className="scholion-comp-gap"
      style={{
        margin: "40px 0",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <style>{`
        .scholion-comp-gap .scholion-comp-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .scholion-comp-gap .scholion-comp-label::before {
          content: '';
          display: block;
          width: 12px;
          height: 1.5px;
          background-color: var(--accent);
        }
        .scholion-comp-gap .scholion-comp-scroll-hint {
          display: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.625rem;
          color: var(--text-muted);
          text-align: right;
          margin-bottom: 8px;
        }
        .scholion-comp-gap .scholion-comp-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -8px;
          padding: 0 8px;
        }
        .scholion-comp-gap table {
          width: 100%;
          min-width: 640px;
          border-collapse: separate;
          border-spacing: 0;
          font-family: 'DM Sans', sans-serif;
        }
        .scholion-comp-gap thead th {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-mid);
          padding: 12px 14px 10px;
          text-align: center;
          border-bottom: 2px solid var(--border-mid);
          white-space: nowrap;
          vertical-align: bottom;
        }
        .scholion-comp-gap thead th:first-child {
          text-align: left;
          font-size: 0.625rem;
          color: var(--text-light);
          letter-spacing: 0.06em;
        }
        .scholion-comp-gap thead th.scholion-comp-col-header {
          color: var(--accent);
          position: relative;
        }
        .scholion-comp-gap thead th.scholion-comp-col-header::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 14px;
          right: 14px;
          height: 2px;
          background-color: var(--accent);
        }
        .scholion-comp-gap tbody td {
          padding: 14px 14px;
          border-bottom: 1px solid var(--border-mid);
          text-align: center;
          vertical-align: top;
          font-size: 0.75rem;
          line-height: 1.4;
          color: var(--text-mid);
        }
        .scholion-comp-gap tbody tr:last-child td {
          border-bottom: none;
        }
        .scholion-comp-gap tbody td:first-child {
          text-align: left;
          font-weight: 500;
          color: var(--text);
          font-size: 0.8125rem;
          min-width: 140px;
        }
        .scholion-comp-gap .scholion-comp-cap-desc {
          display: block;
          font-size: 0.6875rem;
          font-weight: 400;
          color: var(--text-light);
          margin-top: 2px;
          line-height: 1.35;
        }
        .scholion-comp-cell {
          background-color: var(--accent-dim);
        }
        .scholion-comp-status-full .scholion-comp-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--teal);
          margin-bottom: 4px;
        }
        .scholion-comp-cell .scholion-comp-status-full .scholion-comp-dot {
          background-color: var(--accent);
        }
        .scholion-comp-status-full .scholion-comp-status-label {
          display: block;
          font-size: 0.6875rem;
          color: var(--teal);
          line-height: 1.3;
        }
        .scholion-comp-cell .scholion-comp-status-full .scholion-comp-status-label {
          color: var(--accent);
          font-weight: 500;
        }
        .scholion-comp-status-partial .scholion-comp-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          background-color: transparent;
          margin-bottom: 4px;
        }
        .scholion-comp-status-partial .scholion-comp-status-label {
          display: block;
          font-size: 0.6875rem;
          color: var(--text-light);
          line-height: 1.3;
        }
        .scholion-comp-status-none .scholion-comp-dot {
          display: inline-block;
          width: 12px;
          height: 1.5px;
          background-color: var(--border-mid);
          margin-bottom: 7px;
        }
        .scholion-comp-status-none .scholion-comp-status-label {
          display: block;
          font-size: 0.6875rem;
          color: var(--text-muted);
          line-height: 1.3;
        }
        .scholion-comp-gap tbody tr {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .scholion-comp-gap.in-view tbody tr:nth-child(1) { opacity: 1; transform: translateY(0); transition-delay: 0.12s; }
        .scholion-comp-gap.in-view tbody tr:nth-child(2) { opacity: 1; transform: translateY(0); transition-delay: 0.24s; }
        .scholion-comp-gap.in-view tbody tr:nth-child(3) { opacity: 1; transform: translateY(0); transition-delay: 0.36s; }
        .scholion-comp-gap.in-view tbody tr:nth-child(4) { opacity: 1; transform: translateY(0); transition-delay: 0.48s; }
        .scholion-comp-gap.in-view tbody tr:nth-child(5) { opacity: 1; transform: translateY(0); transition-delay: 0.60s; }
        .scholion-comp-gap .scholion-comp-legend {
          display: flex;
          gap: 20px;
          margin-top: 16px;
          padding-top: 12px;
          flex-wrap: wrap;
        }
        .scholion-comp-gap .scholion-comp-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.625rem;
          color: var(--text-light);
        }
        .scholion-comp-legend-dot-full {
          width: 6px; height: 6px; border-radius: 50%;
          background-color: var(--teal);
        }
        .scholion-comp-legend-dot-partial {
          width: 6px; height: 6px; border-radius: 50%;
          border: 1.5px solid var(--accent);
          background-color: transparent;
        }
        .scholion-comp-legend-dot-none {
          width: 8px; height: 1.5px;
          background-color: var(--border-mid);
        }
        @media (max-width: 720px) {
          .scholion-comp-gap .scholion-comp-scroll-hint { display: block; }
          .scholion-comp-gap thead th:first-child,
          .scholion-comp-gap tbody td:first-child {
            position: sticky;
            left: 0;
            z-index: 2;
            background-color: var(--bg);
          }
          .scholion-comp-gap thead th { font-size: 0.6rem; padding: 10px 10px 8px; }
          .scholion-comp-gap tbody td { padding: 12px 10px; font-size: 0.6875rem; }
          .scholion-comp-gap tbody td:first-child { font-size: 0.75rem; min-width: 120px; }
        }
      `}</style>

      <div className={`scholion-comp-gap${inView ? " in-view" : ""}`} style={{ margin: 0 }}>
        <div className="scholion-comp-label">Capability Comparison</div>
        <div className="scholion-comp-scroll-hint">Scroll to see all tools →</div>
        <div className="scholion-comp-scroll">
          <table>
            <thead>
              <tr>
                <th>Capability</th>
                {COLUMNS.map((col, i) => (
                  <th key={col} className={i === 0 ? "scholion-comp-col-header" : undefined}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.capability}>
                  <td>
                    {row.capability}
                    <span className="scholion-comp-cap-desc">{row.description}</span>
                  </td>
                  {row.cells.map((cell, i) => (
                    <StatusCell key={i} status={cell.status} label={cell.label} isScholion={i === 0} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="scholion-comp-legend">
          <div className="scholion-comp-legend-item">
            <span className="scholion-comp-legend-dot-full" />
            Core capability
          </div>
          <div className="scholion-comp-legend-item">
            <span className="scholion-comp-legend-dot-partial" />
            Adjacent / partial
          </div>
          <div className="scholion-comp-legend-item">
            <span className="scholion-comp-legend-dot-none" />
            Not provided
          </div>
        </div>
      </div>
    </div>
  );
}
