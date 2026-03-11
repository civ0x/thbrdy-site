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
    text: "Same loop structure across all three layers — the pattern is invariant; the instantiation varies",
    color: tokens.accent,
  },
  {
    text: "Each instance discovers hardware- or constraint-specific optima invisible from the spec sheet",
    color: tokens.blue,
  },
  {
    text: "The metric gate is only as good as the metric — seed 42→137 passed via evaluation-set overfitting",
    color: tokens.red,
  },
];

const instances = [
  {
    layer: "Architecture",
    project: "autoresearch",
    mutable: "train.py",
    immutable: "val_bpb harness",
    budget: "5 min wall-clock",
    rate: "~8–12 exp/hr",
    finding: "Depth-4 on GPU, depth-6 on ANE, depth-8 on H100",
    color: tokens.accent,
  },
  {
    layer: "Kernel",
    project: "AutoKernel",
    mutable: "kernel.py",
    immutable: "bench.py (5-stage)",
    budget: "~90s per kernel",
    rate: "~40 exp/hr",
    finding: "80–95% of cuBLAS on tuned kernels",
    color: tokens.blue,
  },
  {
    layer: "Constraint",
    project: "sample-efficiency",
    mutable: "train.py",
    immutable: "val_bpb harness",
    budget: "10M token budget",
    rate: "~50 exp/overnight",
    finding: "14% val loss reduction; different optima than time-budgeted",
    color: tokens.teal,
  },
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
        .ftt-ratchet-instances {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid ${tokens.border};
        }
        .ftt-ratchet-instance {
          background: ${tokens.bgCard};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          padding: 0.75rem;
        }
        .ftt-ratchet-instance-layer {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.15rem;
        }
        .ftt-ratchet-instance-project {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: ${tokens.textMuted};
          margin-bottom: 0.6rem;
        }
        .ftt-ratchet-instance-rows {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 0.6rem;
        }
        .ftt-ratchet-instance-row {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }
        .ftt-ratchet-instance-key {
          font-family: ${tokens.mono};
          font-size: 0.48rem;
          color: ${tokens.textMuted};
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .ftt-ratchet-instance-value {
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          color: ${tokens.textMid};
        }
        .ftt-ratchet-instance-finding {
          font-family: ${tokens.sans};
          font-size: 0.62rem;
          line-height: 1.35;
          padding-top: 0.5rem;
          border-top: 1px solid ${tokens.border};
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
          .ftt-ratchet-instances {
            grid-template-columns: 1fr;
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
          .ftt-ratchet-instance-rows {
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
        <div className="ftt-ratchet-header">The ratchet pattern</div>

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
              <div>{a.text}</div>
            </div>
          ))}
        </div>

        <div className="ftt-ratchet-instances">
          {instances.map((inst, i) => (
            <div
              className="ftt-ratchet-instance"
              key={inst.layer}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(10px)",
                transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.6 + i * 0.1}s`,
              }}
            >
              <div className="ftt-ratchet-instance-layer" style={{ color: inst.color }}>
                {inst.layer}
              </div>
              <div className="ftt-ratchet-instance-project">{inst.project}</div>
              <div className="ftt-ratchet-instance-rows">
                <div className="ftt-ratchet-instance-row">
                  <div className="ftt-ratchet-instance-key">Mutable</div>
                  <div className="ftt-ratchet-instance-value">{inst.mutable}</div>
                </div>
                <div className="ftt-ratchet-instance-row">
                  <div className="ftt-ratchet-instance-key">Immutable</div>
                  <div className="ftt-ratchet-instance-value">{inst.immutable}</div>
                </div>
                <div className="ftt-ratchet-instance-row">
                  <div className="ftt-ratchet-instance-key">Budget</div>
                  <div className="ftt-ratchet-instance-value">{inst.budget}</div>
                </div>
                <div className="ftt-ratchet-instance-row">
                  <div className="ftt-ratchet-instance-key">Rate</div>
                  <div className="ftt-ratchet-instance-value">{inst.rate}</div>
                </div>
              </div>
              <div className="ftt-ratchet-instance-finding" style={{ color: inst.color }}>
                {inst.finding}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
