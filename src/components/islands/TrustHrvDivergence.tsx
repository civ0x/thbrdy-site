import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface DerivationPath {
  id: string;
  color: string;
  colorDim: string;
  operation: string;
  operationSub: string;
  properties: { key: string; value: string }[];
  field: string;
  descriptor: string;
}

const paths: DerivationPath[] = [
  {
    id: "sdnn",
    color: tokens.blue,
    colorDim: tokens.blueDim,
    operation: "Standard Deviation",
    operationSub: "of all NN intervals in measurement window",
    properties: [
      { key: "Reflects", value: "Sympathetic + Parasympathetic" },
      { key: "Timescale", value: "Measurement window" },
      { key: "Source", value: "Apple Watch" },
    ],
    field: "hrvSDNN: Double?",
    descriptor: "relativeHRV()",
  },
  {
    id: "rmssd",
    color: tokens.teal,
    colorDim: tokens.tealDim,
    operation: "Root Mean Square of Successive Differences",
    operationSub: "beat-to-beat variability",
    properties: [
      { key: "Reflects", value: "Parasympathetic only" },
      { key: "Timescale", value: "Beat-to-beat" },
      { key: "Sources", value: "Garmin, Oura" },
    ],
    field: "hrvRMSSD: Double?",
    descriptor: "relativeHrvRMSSD()",
  },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function TrustHrvDivergence() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="trust-hrv">
      <style>{`
        .trust-hrv { margin: 2.5rem 0; }
        .trust-hrv-inner {
          background: var(--bg-warm); border: 1px solid var(--border);
          border-radius: 8px; padding: 2rem 1.5rem;
        }
        .trust-hrv-title {
          font-family: ${tokens.mono}; font-size: 0.58rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: ${tokens.textMuted}; margin-bottom: 2rem; text-align: center;
        }
        .trust-hrv-source {
          display: flex; flex-direction: column; align-items: center;
        }
        .trust-hrv-source-node {
          width: 100%; max-width: 280px; padding: 0.9rem 1.2rem;
          border-radius: 6px; border: 2px solid var(--accent);
          background: var(--accent-dim); text-align: center;
        }
        .trust-hrv-source-label {
          font-family: ${tokens.sans}; font-size: 0.85rem;
          font-weight: 600; color: var(--accent);
        }
        .trust-hrv-source-sub {
          font-family: ${tokens.mono}; font-size: 0.58rem;
          color: ${tokens.textMuted}; margin-top: 0.25rem;
        }
        .trust-hrv-fork {
          display: flex; justify-content: center; height: 40px;
        }
        .trust-hrv-fork svg { width: 100%; max-width: 500px; height: 40px; }
        .trust-hrv-columns {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
        }
        .trust-hrv-path {
          display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
        }
        .trust-hrv-op-node {
          width: 100%; padding: 0.7rem 0.8rem;
          border-radius: 5px; border: 1px solid; text-align: center;
        }
        .trust-hrv-op-label {
          font-family: ${tokens.sans}; font-size: 0.75rem;
          font-weight: 500; line-height: 1.3;
        }
        .trust-hrv-op-sub {
          font-family: ${tokens.mono}; font-size: 0.55rem;
          margin-top: 0.2rem; opacity: 0.65;
        }
        .trust-hrv-props {
          width: 100%; display: flex; flex-direction: column; gap: 0.35rem;
        }
        .trust-hrv-prop {
          padding: 0.45rem 0.7rem; border-radius: 4px;
          display: flex; gap: 0.5rem; align-items: baseline;
        }
        .trust-hrv-prop-key {
          font-family: ${tokens.mono}; font-size: 0.52rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          flex-shrink: 0; opacity: 0.6;
        }
        .trust-hrv-prop-value {
          font-family: ${tokens.sans}; font-size: 0.68rem; font-weight: 500;
        }
        .trust-hrv-output {
          width: 100%; padding: 0.55rem 0.7rem; border-radius: 4px;
          border: 1px dashed; text-align: center;
        }
        .trust-hrv-output-field {
          font-family: ${tokens.mono}; font-size: 0.65rem;
        }
        .trust-hrv-output-arrow {
          font-family: ${tokens.mono}; font-size: 0.6rem;
          opacity: 0.4; margin: 0 0.3rem;
        }
        .trust-hrv-output-fn {
          font-family: ${tokens.mono}; font-size: 0.65rem;
          font-weight: 500; color: var(--accent);
        }
        .trust-hrv-constraint {
          margin-top: 1.2rem; padding: 0.7rem 1rem;
          border-top: 2.5px solid var(--red); border-bottom: 2.5px solid var(--red);
          text-align: center; background: var(--red-dim);
        }
        .trust-hrv-constraint-label {
          font-family: ${tokens.mono}; font-size: 0.6rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--red); font-weight: 500;
        }
        .trust-hrv-annotation {
          text-align: center; margin-top: 1.2rem;
          padding-top: 1rem; border-top: 1px solid var(--border);
        }
        .trust-hrv-annotation div {
          font-family: ${tokens.sans}; font-size: 0.75rem;
          color: ${tokens.textLight}; line-height: 1.6;
          max-width: 460px; margin: 0 auto;
        }
        @media (max-width: 640px) {
          .trust-hrv-inner { padding: 1.5rem 1rem; }
          .trust-hrv-columns { gap: 1rem; }
          .trust-hrv-op-label { font-size: 0.68rem; }
          .trust-hrv-prop-value { font-size: 0.62rem; }
          .trust-hrv-source-node { max-width: 240px; }
        }
        @media (max-width: 420px) {
          .trust-hrv-columns { grid-template-columns: 1fr; gap: 1.5rem; }
          .trust-hrv-fork { display: none; }
          .trust-hrv-path { border-top: 1px solid var(--border); padding-top: 1rem; }
          .trust-hrv-source-node { max-width: 100%; }
        }
      `}</style>

      <div className="trust-hrv-inner">
        <div className="trust-hrv-title">Same data, different signals</div>

        <div
          className="trust-hrv-source"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(14px)",
            transition: `all 0.5s ${ease} 0s`,
          }}
        >
          <div className="trust-hrv-source-node">
            <div className="trust-hrv-source-label">RR Intervals</div>
            <div className="trust-hrv-source-sub">
              Time between successive heartbeats (ms)
            </div>
          </div>
        </div>

        <div
          className="trust-hrv-fork"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.4s ease 0.3s" }}
        >
          <svg viewBox="0 0 500 40" preserveAspectRatio="xMidYMid meet">
            <line x1="250" y1="0" x2="125" y2="32" stroke={tokens.blue} strokeWidth="1.5" strokeOpacity="0.45" />
            <polygon points="121,28 129,28 125,36" fill={tokens.blue} fillOpacity="0.6" />
            <line x1="250" y1="0" x2="375" y2="32" stroke={tokens.teal} strokeWidth="1.5" strokeOpacity="0.45" />
            <polygon points="371,28 379,28 375,36" fill={tokens.teal} fillOpacity="0.6" />
          </svg>
        </div>

        <div className="trust-hrv-columns">
          {paths.map((path, pi) => (
            <div key={path.id} className="trust-hrv-path">
              <div
                className="trust-hrv-op-node"
                style={{
                  borderColor: path.color, background: path.colorDim, color: path.color,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(12px)",
                  transition: `all 0.5s ${ease} ${0.45 + pi * 0.15}s`,
                }}
              >
                <div className="trust-hrv-op-label">{path.operation}</div>
                <div className="trust-hrv-op-sub" style={{ color: path.color }}>
                  {path.operationSub}
                </div>
              </div>

              <div className="trust-hrv-props">
                {path.properties.map((prop, ki) => (
                  <div
                    key={prop.key}
                    className="trust-hrv-prop"
                    style={{
                      background: path.colorDim, color: path.color,
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(8px)",
                      transition: `all 0.4s ${ease} ${0.6 + pi * 0.15 + ki * 0.08}s`,
                    }}
                  >
                    <span className="trust-hrv-prop-key" style={{ color: path.color }}>
                      {prop.key}
                    </span>
                    <span className="trust-hrv-prop-value" style={{ color: path.color }}>
                      {prop.value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="trust-hrv-output"
                style={{
                  borderColor: path.color, color: path.color,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(8px)",
                  transition: `all 0.4s ${ease} ${0.85 + pi * 0.15}s`,
                }}
              >
                <span className="trust-hrv-output-field">{path.field}</span>
                <span className="trust-hrv-output-arrow">→</span>
                <span className="trust-hrv-output-fn">{path.descriptor}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          className="trust-hrv-constraint"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: `all 0.5s ${ease} 1.15s`,
          }}
        >
          <div className="trust-hrv-constraint-label">
            Never compared · Never merged
          </div>
        </div>

        <div
          className="trust-hrv-annotation"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.5s ease 1.35s" }}
        >
          <div>
            Two fields on BiometricSnapshot. Two descriptor functions.
            The type system encodes an epistemic constraint.
          </div>
        </div>
      </div>
    </div>
  );
}
