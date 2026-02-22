import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const headers = ["System", "Paper-level", "Claim-level", "Cross-doc", "Crux ID", "Propagation"];

type CellState = "yes" | "no" | "partial" | "gap";

interface Row {
  name: string;
  color: string;
  cells: CellState[];
  highlight?: boolean;
}

const rows: Row[] = [
  { name: "Citation graphs", color: "var(--blue)", cells: ["yes", "no", "yes", "no", "no"] },
  { name: "Scite.ai", color: "var(--teal)", cells: ["yes", "no", "yes", "no", "no"] },
  { name: "Argument mining", color: "var(--green)", cells: ["no", "yes", "no", "no", "no"] },
  { name: "TMS / ATMS", color: "var(--accent)", cells: ["no", "yes", "no", "yes", "yes"] },
  { name: "Knowledge graphs", color: "var(--text-muted)", cells: ["yes", "partial", "yes", "no", "no"] },
  { name: "Scholion", color: "var(--red)", cells: ["gap", "gap", "gap", "gap", "gap"], highlight: true },
];

const cellSymbol: Record<CellState, string> = {
  yes: "●",
  no: "—",
  partial: "◐",
  gap: "●",
};

export default function ScholionPositioningGrid() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="scholion-positioning">
      <style>{`
        .scholion-positioning {
          margin: 2.5rem 0;
        }
        .scholion-positioning-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .scholion-positioning-header {
          padding: 1.5rem 2rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .scholion-positioning-header h4 {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin: 0;
        }
        .scholion-pos-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .scholion-pos-grid {
          display: grid;
          grid-template-columns: 2fr repeat(5, 1fr);
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          min-width: 500px;
        }
        .scholion-pos-hdr {
          padding: 0.7rem 0.8rem;
          font-weight: 500;
          color: ${tokens.textLight};
          letter-spacing: 0.02em;
          border-bottom: 1px solid var(--border);
          background: var(--bg-card);
          text-align: center;
        }
        .scholion-pos-hdr:first-child {
          text-align: left;
        }
        .scholion-pos-row-label {
          padding: 0.7rem 0.8rem;
          font-weight: 500;
          color: ${tokens.textMid};
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .scholion-pos-row-label--highlight {
          font-weight: 700;
          color: var(--accent);
        }
        .scholion-pos-icon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .scholion-pos-cell {
          padding: 0.7rem 0.8rem;
          border-bottom: 1px solid var(--border);
          border-left: 1px solid var(--border);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scholion-pos-cell--yes { color: var(--green); font-weight: 500; }
        .scholion-pos-cell--no { color: var(--text-faint); }
        .scholion-pos-cell--partial { color: var(--accent); }
        .scholion-pos-cell--gap {
          background: var(--red-dim);
          color: var(--red);
          font-weight: 600;
        }
        .scholion-pos-footer {
          padding: 1rem 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .scholion-pos-legend {
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          color: ${tokens.textMuted};
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .scholion-pos-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
        }
        @media (max-width: 640px) {
          .scholion-pos-grid {
            font-size: 0.6rem;
          }
          .scholion-positioning-header {
            padding: 1rem 1rem 0.75rem;
          }
          .scholion-pos-footer {
            padding: 0.75rem 1rem;
            gap: 1rem;
          }
        }
        @media (max-width: 420px) {
          .scholion-pos-grid {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <div
        className="scholion-positioning-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="scholion-positioning-header">
          <h4>Capability comparison across existing approaches</h4>
        </div>
        <div className="scholion-pos-scroll">
          <div className="scholion-pos-grid">
            {/* Header row */}
            {headers.map((h) => (
              <div key={h} className="scholion-pos-hdr">{h}</div>
            ))}

            {/* Data rows */}
            {rows.map((row, i) => (
              <div key={row.name} style={{ display: "contents" }}>
                <div
                  className={`scholion-pos-row-label${row.highlight ? " scholion-pos-row-label--highlight" : ""}`}
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.15 + i * 0.08}s`,
                  }}
                >
                  <span className="scholion-pos-icon" style={{ background: row.color }} />
                  {row.name}
                </div>
                {row.cells.map((state, j) => (
                  <div
                    key={j}
                    className={`scholion-pos-cell scholion-pos-cell--${state}`}
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ease ${0.15 + i * 0.08}s`,
                    }}
                  >
                    {cellSymbol[state]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="scholion-pos-footer"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.7s",
          }}
        >
          <div className="scholion-pos-legend">
            <span className="scholion-pos-dot" style={{ background: "var(--green)" }} /> Exists
          </div>
          <div className="scholion-pos-legend">
            <span className="scholion-pos-dot" style={{ background: "var(--accent)" }} /> Partial
          </div>
          <div className="scholion-pos-legend">
            <span className="scholion-pos-dot" style={{ background: "var(--text-faint)" }} /> Missing
          </div>
          <div className="scholion-pos-legend">
            <span className="scholion-pos-dot" style={{ background: "var(--red)" }} /> Scholion's contribution
          </div>
        </div>
      </div>
    </div>
  );
}
