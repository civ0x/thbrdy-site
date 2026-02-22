import { useState, useEffect } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── LC essay accent (local) ───
const LC = {
  accent: "#3A7CA5",
  accentBg: "#3A7CA515",
};
const THIN_RED = "#C0392B";

// ─── Inline SVG icons ───
function XIcon({ size = 13, color = THIN_RED }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FlaskIcon({ size = 13, color = LC.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  );
}

function ChevronDownIcon({ size = 14, color = "var(--text-faint)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const claims = [
  {
    num: "1",
    label: "Coupling",
    question: "Is it strong enough to matter?",
    evidence: "Strong",
    evidenceColor: "var(--green)",
    evidenceBg: "var(--green-dim)",
    kill: "< 5% throughput gap",
    test: "GPT-2 124M, single A100, ~$200",
    color: LC.accent,
  },
  {
    num: "2",
    label: "Learnability",
    question: "Can a GNN policy exploit the joint space?",
    evidence: "Indirect",
    evidenceColor: LC.accent,
    evidenceBg: LC.accentBg,
    kill: "Can't beat sequential on training data",
    test: "GNN on fusion × remat, transformer family",
    color: LC.accent,
  },
  {
    num: "3",
    label: "Hardware Generalization",
    question: "Can the planner generalize across targets?",
    evidence: "Thin",
    evidenceColor: THIN_RED,
    evidenceBg: `${THIN_RED}12`,
    kill: "Fine-tuning with 100 samples always wins",
    test: "Hardware-conditioned model, 3–4 GPU types",
    color: LC.accent,
  },
];

export default function LCNestedClaimsFlow() {
  const [ref, inView] = useInView(0.15);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const timers = [0, 1, 2].map((i) =>
      setTimeout(() => setActiveStep(i), 600 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="lc-claims">
      <style>{`
        .lc-claims {
          margin: 3rem 0;
        }
        .lc-claims-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .lc-claims-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${LC.accent};
          margin-bottom: 0.5rem;
        }
        .lc-claims-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .lc-claims-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .lc-claims-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem 1.75rem;
          border-radius: 12px;
          border: 1px solid ${tokens.border};
        }
        .lc-claims-num {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: ${tokens.sans};
          font-size: 1.125rem;
          font-weight: 700;
        }
        .lc-claims-label-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.25rem;
        }
        .lc-claims-label {
          font-family: ${tokens.sans};
          font-size: 0.9375rem;
          font-weight: 600;
        }
        .lc-claims-badge {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .lc-claims-question {
          font-family: ${tokens.serif};
          font-size: 0.9375rem;
          color: ${tokens.textMuted};
          margin-bottom: 0.75rem;
        }
        .lc-claims-tests {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        @media (max-width: 420px) {
          .lc-claims-tests {
            grid-template-columns: 1fr;
          }
          .lc-claims-card {
            padding: 1rem 1.25rem;
            gap: 0.75rem;
          }
        }
        .lc-claims-test-card {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: 1px solid transparent;
        }
        .lc-claims-test-label {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2px;
        }
        .lc-claims-test-text {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textLight};
        }
        .lc-claims-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 0;
        }
        .lc-claims-connector-line {
          width: 1px;
          background: ${tokens.border};
        }
      `}</style>

      <div className="lc-claims-header">
        <p className="lc-claims-eyebrow">Validation Structure</p>
        <h3 className="lc-claims-title">Three nested claims. Each depends on the previous.</h3>
      </div>

      <div className="lc-claims-list">
        {claims.map((claim, i) => {
          const isActive = activeStep >= i;
          const isLast = i === claims.length - 1;
          return (
            <div key={claim.num}>
              <div
                className="lc-claims-card"
                style={{
                  background: isActive ? tokens.bgWarm : tokens.bg,
                  borderColor: isActive ? `${claim.color}50` : undefined,
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                <div
                  className="lc-claims-num"
                  style={{
                    background: isActive ? LC.accentBg : "transparent",
                    border: `1.5px solid ${isActive ? claim.color : tokens.border}`,
                    color: isActive ? claim.color : tokens.textFaint,
                    transition: "all 0.5s ease",
                  }}
                >
                  {claim.num}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="lc-claims-label-row">
                    <span
                      className="lc-claims-label"
                      style={{
                        color: isActive ? claim.color : tokens.textMuted,
                        transition: "color 0.5s ease",
                      }}
                    >
                      {claim.label}
                    </span>
                    <span
                      className="lc-claims-badge"
                      style={{
                        color: isActive ? claim.evidenceColor : tokens.textMuted,
                        background: isActive ? claim.evidenceBg : "transparent",
                        transition: "all 0.5s ease",
                      }}
                    >
                      Evidence: {claim.evidence}
                    </span>
                  </div>

                  <p
                    className="lc-claims-question"
                    style={{
                      color: isActive ? tokens.textMid : tokens.textMuted,
                      transition: "color 0.5s ease",
                    }}
                  >
                    {claim.question}
                  </p>

                  <div className="lc-claims-tests">
                    <div
                      className="lc-claims-test-card"
                      style={{
                        background: isActive ? tokens.bg : "transparent",
                        borderColor: isActive ? tokens.border : "transparent",
                        transition: "all 0.4s ease 0.2s",
                      }}
                    >
                      <span style={{ marginTop: 2, flexShrink: 0 }}>
                        <XIcon />
                      </span>
                      <div>
                        <p className="lc-claims-test-label">Kill if</p>
                        <p className="lc-claims-test-text">{claim.kill}</p>
                      </div>
                    </div>
                    <div
                      className="lc-claims-test-card"
                      style={{
                        background: isActive ? tokens.bg : "transparent",
                        borderColor: isActive ? tokens.border : "transparent",
                        transition: "all 0.4s ease 0.3s",
                      }}
                    >
                      <span style={{ marginTop: 2, flexShrink: 0 }}>
                        <FlaskIcon />
                      </span>
                      <div>
                        <p className="lc-claims-test-label">Cheapest test</p>
                        <p className="lc-claims-test-text">{claim.test}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className="lc-claims-connector"
                  style={{
                    opacity: activeStep > i ? 1 : 0.2,
                    transition: "opacity 0.5s ease",
                  }}
                >
                  <div className="lc-claims-connector-line" style={{ height: 20 }} />
                  <ChevronDownIcon />
                  <div className="lc-claims-connector-line" style={{ height: 4 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
