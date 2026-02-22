import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── LC essay accent (local) ───
const LC = {
  accent: "#3A7CA5",
};

// Strength: 0 = none, 1 = indirect, 2 = moderate, 3 = strong
const strengthColor = ["transparent", tokens.textMuted, LC.accent, tokens.green];
const strengthLabel = ["", "Indirect", "Moderate", "Strong"];

// Column header colors: Coupling → LC accent, Learnability → teal, HW Transfer → green
const colColors = [LC.accent, "var(--teal)", "var(--green)"];

const papers = [
  { name: "Fusion-aware checkpointing", venue: "MLSys '23", claims: [3, 0, 0] },
  { name: "AStitch", venue: "ASPLOS '22", claims: [3, 0, 0] },
  { name: "Alpa", venue: "OSDI '22", claims: [3, 1, 0] },
  { name: "Unity", venue: "OSDI '22", claims: [2, 1, 0] },
  { name: "GO", venue: "NeurIPS '20", claims: [1, 3, 0] },
  { name: "MLGO", venue: "Google '21", claims: [0, 2, 0] },
  { name: "TVM / Ansor", venue: "OSDI '20", claims: [0, 2, 1] },
  { name: "TenSet", venue: "NeurIPS '21", claims: [0, 1, 2] },
  { name: "Fasor", venue: "ICS '24", claims: [0, 0, 2] },
  { name: "GNN+RL JSSP", venue: "Various", claims: [0, 2, 0] },
];

function MinusIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function LCEvidenceGrid() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="lc-evidence">
      <style>{`
        .lc-evidence {
          margin: 3rem 0;
        }
        .lc-evidence-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .lc-evidence-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${LC.accent};
          margin-bottom: 0.5rem;
        }
        .lc-evidence-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .lc-evidence-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .lc-evidence-table {
          min-width: 520px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid ${tokens.border};
        }
        .lc-evidence-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
        }
        .lc-evidence-hdr {
          background: ${tokens.bg};
          border-bottom: 1px solid ${tokens.border};
        }
        .lc-evidence-hdr-cell {
          padding: 0.75rem 1rem;
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .lc-evidence-hdr-cell + .lc-evidence-hdr-cell {
          border-left: 1px solid ${tokens.border};
          text-align: center;
        }
        .lc-evidence-data-cell {
          padding: 0.625rem 1rem;
          display: flex;
          align-items: center;
        }
        .lc-evidence-data-cell + .lc-evidence-data-cell {
          border-left: 1px solid ${tokens.border};
          justify-content: center;
        }
        .lc-evidence-data-row {
          border-bottom: 1px solid ${tokens.border};
        }
        .lc-evidence-data-row:last-child {
          border-bottom: none;
        }
        .lc-evidence-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${tokens.textMid};
          margin-right: 0.5rem;
        }
        .lc-evidence-venue {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
        }
        .lc-evidence-pips {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .lc-evidence-pip {
          width: 8px;
          height: 8px;
          border-radius: 2px;
        }
        .lc-evidence-legend {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 0.75rem;
        }
        .lc-evidence-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lc-evidence-legend-label {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
        }
        @media (max-width: 640px) {
          .lc-evidence-scroll::after {
            content: "scroll →";
            display: block;
            text-align: right;
            font-family: ${tokens.sans};
            font-size: 0.625rem;
            color: ${tokens.textFaint};
            padding: 0.25rem 0.5rem 0;
          }
        }
      `}</style>

      <div className="lc-evidence-header">
        <p className="lc-evidence-eyebrow">Evidence Map</p>
        <h3 className="lc-evidence-title">Where the evidence is strong. Where it's thin.</h3>
      </div>

      <div
        className="lc-evidence-scroll"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="lc-evidence-table">
          {/* Header */}
          <div className="lc-evidence-row lc-evidence-hdr">
            <div className="lc-evidence-hdr-cell" style={{ color: tokens.textMuted }}>Source</div>
            {["Coupling", "Learnability", "HW Transfer"].map((h, i) => (
              <div key={h} className="lc-evidence-hdr-cell" style={{ color: colColors[i] }}>{h}</div>
            ))}
          </div>

          {/* Rows */}
          {papers.map((paper, i) => (
            <div
              key={paper.name}
              className="lc-evidence-row lc-evidence-data-row"
              style={{
                background: i % 2 === 0 ? tokens.bg : tokens.bgWarm,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.3s ease ${0.2 + i * 0.05}s`,
              }}
            >
              <div className="lc-evidence-data-cell">
                <span className="lc-evidence-name">{paper.name}</span>
                <span className="lc-evidence-venue">{paper.venue}</span>
              </div>
              {paper.claims.map((level, j) => (
                <div key={j} className="lc-evidence-data-cell">
                  {level > 0 ? (
                    <div className="lc-evidence-pips">
                      {[...Array(level)].map((_, k) => (
                        <div
                          key={k}
                          className="lc-evidence-pip"
                          style={{ background: strengthColor[level] }}
                        />
                      ))}
                    </div>
                  ) : (
                    <MinusIcon />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        className="lc-evidence-legend"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.8s",
        }}
      >
        {[1, 2, 3].map((level) => (
          <div key={level} className="lc-evidence-legend-item">
            <div className="lc-evidence-pips">
              {[...Array(level)].map((_, k) => (
                <div
                  key={k}
                  className="lc-evidence-pip"
                  style={{ background: strengthColor[level] }}
                />
              ))}
            </div>
            <span className="lc-evidence-legend-label">{strengthLabel[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
