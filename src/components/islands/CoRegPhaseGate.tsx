import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Phase {
  number: number;
  question: string;
  meta: string;
  opacity: number;
  borderStyle: "solid" | "dashed";
  bg: string;
}

interface Gate {
  goCriteria: string[];
  killCriteria: string[];
}

const phases: Phase[] = [
  {
    number: 0,
    question: "Can Apple hardware deliver bilateral physiological signal transmission with sufficient fidelity?",
    meta: "4\u20136 weeks \u00B7 My time only \u00B7 Working prototype on 2 device sets",
    opacity: 1,
    borderStyle: "solid",
    bg: "var(--bg)",
  },
  {
    number: 1,
    question: "Does bilateral feedback produce greater autonomic synchrony than sham?",
    meta: "6\u20139 months \u00B7 Academic collaborator \u00B7 Manuscript-quality data from 30 dyads",
    opacity: 1,
    borderStyle: "solid",
    bg: "var(--bg)",
  },
  {
    number: 2,
    question: "Does the effect accumulate with repeated use and work outside the lab?",
    meta: "6+ months \u00B7 Grant-funded \u00B7 60 dyads over 6 weeks at home",
    opacity: 0.85,
    borderStyle: "solid",
    bg: "var(--bg-warm)",
  },
  {
    number: 3,
    question: "Wellness product or FDA De Novo classification?",
    meta: "1\u20133 years \u00B7 Investor-funded \u00B7 Regulatory submission or commercial launch",
    opacity: 0.7,
    borderStyle: "dashed",
    bg: "var(--bg-warm)",
  },
];

const gates: Gate[] = [
  {
    goCriteria: [
      "Breathing rate \u00B12 BPM accuracy",
      "Latency <1s",
      "Audio stable 20+ min",
      "Convergence trend in dyad sessions",
    ],
    killCriteria: [
      "Accelerometer can\u2019t derive breathing rate",
      ">20% session failure rate",
      "Audio anxiety-inducing in >50% sessions",
    ],
  },
  {
    goCriteria: [
      "Real > sham respiratory PLV (p<0.05, d\u22650.5)",
      "Blinding holds (\u226460% correct ID)",
      "Subjective reports directionally support",
    ],
    killCriteria: [
      "No real vs. sham difference",
      "Blinding fails (most participants distinguish)",
      "Adverse reports in >20% sessions",
    ],
  },
  {
    goCriteria: [
      "Durable clinical outcomes on validated instruments",
      "Effect accumulates with repeated use",
    ],
    killCriteria: [
      "No lasting effect after sessions end",
      "Effect doesn\u2019t work remotely",
    ],
  },
];

export default function CoRegPhaseGate() {
  const [ref, inView] = useInView(0.1);

  const elements: Array<{ type: "phase"; data: Phase } | { type: "gate"; data: Gate }> = [];
  phases.forEach((phase, i) => {
    elements.push({ type: "phase", data: phase });
    if (i < gates.length) {
      elements.push({ type: "gate", data: gates[i] });
    }
  });

  return (
    <div ref={ref} className="coreg-phase">
      <style>{`
        .coreg-phase {
          margin: 2.5rem 0;
        }
        .coreg-phase-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.5rem 2rem;
          max-width: 520px;
          margin: 0 auto;
        }
        .coreg-phase-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2rem;
          text-align: center;
        }
        .coreg-phase-pipeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .coreg-phase-node {
          width: 100%;
          border-radius: 6px;
          padding: 1rem 1.4rem;
        }
        .coreg-phase-number {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.3rem;
          font-weight: 500;
        }
        .coreg-phase-question {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.text};
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }
        .coreg-phase-meta {
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          color: ${tokens.textMuted};
          line-height: 1.4;
        }
        .coreg-phase-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 36px;
          justify-content: center;
        }
        .coreg-phase-arrow-line {
          width: 1px;
          height: 12px;
          background: var(--border-mid);
        }
        .coreg-phase-arrow-icon {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
          margin-top: -2px;
        }
        .coreg-phase-gate {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 6px;
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .coreg-phase-gate-col {
          padding: 0.7rem 0.9rem;
        }
        .coreg-phase-gate-col--go {
          background: var(--green-dim);
          border-right: 1px solid var(--border);
        }
        .coreg-phase-gate-col--kill {
          background: var(--red-dim);
        }
        .coreg-phase-gate-header {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
        .coreg-phase-gate-header--go {
          color: var(--green);
        }
        .coreg-phase-gate-header--kill {
          color: var(--red);
        }
        .coreg-phase-gate-item {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: ${tokens.textMid};
          line-height: 1.5;
          padding-left: 0.6rem;
          position: relative;
          margin-bottom: 0.15rem;
        }
        .coreg-phase-gate-item::before {
          content: "\u2022";
          position: absolute;
          left: 0;
          color: ${tokens.textMuted};
        }
        @media (max-width: 640px) {
          .coreg-phase-inner {
            padding: 1.5rem 1rem;
            max-width: none;
          }
          .coreg-phase-gate {
            grid-template-columns: 1fr;
          }
          .coreg-phase-gate-col--go {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
        @media (max-width: 420px) {
          .coreg-phase-node {
            padding: 0.8rem 1rem;
          }
          .coreg-phase-question {
            font-size: 0.88rem;
          }
        }
      `}</style>

      <div
        className="coreg-phase-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="coreg-phase-title">
          Staged research program with kill criteria
        </div>

        <div className="coreg-phase-pipeline">
          {elements.map((el, i) => {
            const delay = i * 0.12;

            if (el.type === "phase") {
              const phase = el.data as Phase;
              return (
                <div key={`p${phase.number}`}>
                  {i > 0 && (
                    <div
                      className="coreg-phase-arrow"
                      style={{
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.4s ease ${delay}s`,
                      }}
                    >
                      <div className="coreg-phase-arrow-line" />
                      <span className="coreg-phase-arrow-icon">{"\u2193"}</span>
                    </div>
                  )}
                  <div
                    className="coreg-phase-node"
                    style={{
                      background: phase.bg,
                      border: `1px ${phase.borderStyle} ${phase.borderStyle === "dashed" ? "var(--border)" : "var(--border-mid)"}`,
                      opacity: inView ? phase.opacity : 0,
                      transform: inView ? "translateY(0)" : "translateY(12px)",
                      transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
                    }}
                  >
                    <div className="coreg-phase-number">Phase {phase.number}</div>
                    <div className="coreg-phase-question">{phase.question}</div>
                    <div className="coreg-phase-meta">{phase.meta}</div>
                  </div>
                </div>
              );
            }

            const gate = el.data as Gate;
            return (
              <div key={`g${i}`}>
                <div
                  className="coreg-phase-arrow"
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${delay}s`,
                  }}
                >
                  <div className="coreg-phase-arrow-line" />
                  <span className="coreg-phase-arrow-icon">{"\u2193"}</span>
                </div>
                <div
                  className="coreg-phase-gate"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
                  }}
                >
                  <div className="coreg-phase-gate-col coreg-phase-gate-col--go">
                    <div className="coreg-phase-gate-header coreg-phase-gate-header--go">Go if</div>
                    {gate.goCriteria.map((c, ci) => (
                      <div key={ci} className="coreg-phase-gate-item">{c}</div>
                    ))}
                  </div>
                  <div className="coreg-phase-gate-col coreg-phase-gate-col--kill">
                    <div className="coreg-phase-gate-header coreg-phase-gate-header--kill">Kill if</div>
                    {gate.killCriteria.map((c, ci) => (
                      <div key={ci} className="coreg-phase-gate-item">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
