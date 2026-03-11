import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Step {
  num: number;
  label: string;
  detail: string;
}

const steps: Step[] = [
  { num: 1, label: "Read", detail: "program.md + train.py" },
  { num: 2, label: "Branch", detail: "git checkout -b" },
  { num: 3, label: "Modify", detail: "Edit train.py" },
  { num: 4, label: "Train", detail: "5 min budget" },
  { num: 5, label: "Evaluate", detail: "val_bpb" },
  { num: 6, label: "Decide", detail: "Improved?" },
];

const annotations = [
  {
    target: 6,
    text: "The random seed incident — seed 42→137 passed the gate via evaluation-set overfitting",
    color: tokens.red,
  },
  {
    target: 5,
    text: "Depth-4 on GPU, depth-6 on ANE — the hardware determines the optimum",
    color: tokens.accent,
  },
];

const hwComparison = [
  { label: "H100", value: "~12 exp/hr" },
  { label: "Apple Silicon (MLX)", value: "~8–9 exp/hr" },
];

export default function FTTAutoresearchRatchet() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="ftt-ratchet">
      <style>{`
        .ftt-ratchet {
          margin: 2.5rem 0;
        }
        .ftt-ratchet-inner {
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          padding: 1.5rem;
        }
        .ftt-ratchet-header {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 1.25rem;
          text-align: center;
        }
        .ftt-ratchet-loop {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .ftt-ratchet-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ftt-ratchet-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.9rem;
          background: ${tokens.bgCard};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          min-width: 80px;
        }
        .ftt-ratchet-node--decide {
          border-color: ${tokens.accent};
          border-width: 2px;
        }
        .ftt-ratchet-num {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          color: ${tokens.textMuted};
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
        }
        .ftt-ratchet-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          color: ${tokens.text};
          margin-bottom: 0.15rem;
        }
        .ftt-ratchet-detail {
          font-family: ${tokens.mono};
          font-size: 0.52rem;
          color: ${tokens.textLight};
        }
        .ftt-ratchet-arrow {
          color: ${tokens.textFaint};
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .ftt-ratchet-outcomes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .ftt-ratchet-outcome {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          font-weight: 500;
        }
        .ftt-ratchet-outcome--merge {
          background: ${tokens.greenDim};
          color: ${tokens.green};
          border: 1px solid ${tokens.green};
        }
        .ftt-ratchet-outcome--revert {
          background: ${tokens.redDim};
          color: ${tokens.red};
          border: 1px solid ${tokens.red};
        }
        .ftt-ratchet-outcome-icon {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }
        .ftt-ratchet-annotations {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid ${tokens.border};
        }
        .ftt-ratchet-annotation {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-family: ${tokens.sans};
          font-size: 0.68rem;
          color: ${tokens.textLight};
          line-height: 1.4;
        }
        .ftt-ratchet-annotation-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.35rem;
        }
        .ftt-ratchet-hw {
          display: flex;
          gap: 1.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid ${tokens.border};
          justify-content: center;
        }
        .ftt-ratchet-hw-item {
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          color: ${tokens.textMuted};
        }
        .ftt-ratchet-hw-value {
          font-family: ${tokens.mono};
          font-weight: 500;
          color: ${tokens.textMid};
        }
        @media (max-width: 640px) {
          .ftt-ratchet-inner {
            padding: 1rem;
          }
          .ftt-ratchet-loop {
            gap: 0.35rem;
          }
          .ftt-ratchet-node {
            min-width: 60px;
            padding: 0.5rem 0.6rem;
          }
          .ftt-ratchet-label {
            font-size: 0.65rem;
          }
          .ftt-ratchet-outcomes {
            grid-template-columns: 1fr;
          }
          .ftt-ratchet-arrow {
            font-size: 0.7rem;
          }
        }
        @media (max-width: 420px) {
          .ftt-ratchet-node {
            min-width: 50px;
            padding: 0.4rem 0.5rem;
          }
          .ftt-ratchet-detail {
            display: none;
          }
        }
      `}</style>

      <div
        className="ftt-ratchet-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="ftt-ratchet-header">The git-based ratchet</div>

        <div className="ftt-ratchet-loop">
          {steps.map((step, i) => (
            <div className="ftt-ratchet-step" key={step.num}>
              <div
                className={`ftt-ratchet-node${step.num === 6 ? " ftt-ratchet-node--decide" : ""}`}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(10px)",
                  transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + i * 0.08}s`,
                }}
              >
                <div className="ftt-ratchet-num">{String(step.num).padStart(2, "0")}</div>
                <div className="ftt-ratchet-label">{step.label}</div>
                <div className="ftt-ratchet-detail">{step.detail}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="ftt-ratchet-arrow">→</div>
              )}
            </div>
          ))}
        </div>

        <div
          className="ftt-ratchet-outcomes"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 0.6s",
          }}
        >
          <div className="ftt-ratchet-outcome ftt-ratchet-outcome--merge">
            <svg className="ftt-ratchet-outcome-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="3,8 7,12 13,4" />
            </svg>
            Improved → merge to main
          </div>
          <div className="ftt-ratchet-outcome ftt-ratchet-outcome--revert">
            <svg className="ftt-ratchet-outcome-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="4" x2="12" y2="12" />
              <line x1="12" y1="4" x2="4" y2="12" />
            </svg>
            No improvement → git reset, retry
          </div>
        </div>

        <div
          className="ftt-ratchet-annotations"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 0.75s",
          }}
        >
          {annotations.map((a, i) => (
            <div className="ftt-ratchet-annotation" key={i}>
              <div className="ftt-ratchet-annotation-dot" style={{ background: a.color }} />
              <div>
                <span style={{ fontFamily: tokens.mono, fontSize: "0.55rem", color: tokens.textMuted }}>
                  Step {a.target}:
                </span>{" "}
                {a.text}
              </div>
            </div>
          ))}
        </div>

        <div
          className="ftt-ratchet-hw"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 0.9s",
          }}
        >
          {hwComparison.map((h) => (
            <div className="ftt-ratchet-hw-item" key={h.label}>
              {h.label}: <span className="ftt-ratchet-hw-value">{h.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
