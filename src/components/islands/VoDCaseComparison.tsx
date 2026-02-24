import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Stage {
  label: string;
  desc: string;
  isFinal?: boolean;
}

const awsStages: Stage[] = [
  { label: "Research Artifact", desc: "GNN/DGL — strong academic results, no productization path" },
  { label: "PR/FAQ Translation", desc: "Converted research language → product language" },
  { label: "Business Review", desc: "Structured visibility through leadership cadence" },
  { label: "Shipped Feature", desc: "Neptune ML — production, publicly documented", isFinal: true },
];

const azStages: Stage[] = [
  { label: "Research Candidate", desc: "Drug candidate with preclinical promise" },
  { label: "5R Joint Assessment", desc: "Right Target, Tissue, Safety, Patient, Commercial" },
  { label: "Portfolio Review", desc: "Joint scientific-clinical-commercial evaluation" },
  { label: "Approved Drug", desc: "Phase III completion, regulatory approval", isFinal: true },
];

const parallels = [
  { left: "Research Artifact", right: "Research Candidate", mechanism: "Maturity Gate" },
  { left: "PR/FAQ", right: "5R Assessment", mechanism: "Boundary Object" },
  { left: "Business Review", right: "Portfolio Review", mechanism: "Trading Zone" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function CasePipeline({
  domain,
  name,
  color,
  colorDim,
  stages,
  headerClass,
  nameClass,
  inView,
  baseDelay,
}: {
  domain: string;
  name: string;
  color: string;
  colorDim: string;
  stages: Stage[];
  headerClass: string;
  nameClass: string;
  inView: boolean;
  baseDelay: number;
}) {
  return (
    <div className="vod-case-pipeline">
      <div
        className={`vod-case-case-header ${headerClass}`}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.5s ${ease} ${baseDelay}s, transform 0.5s ${ease} ${baseDelay}s`,
        }}
      >
        <div className="vod-case-domain">{domain}</div>
        <div className={`vod-case-case-name ${nameClass}`}>{name}</div>
      </div>
      {stages.map((stage, i) => (
        <div key={i}>
          {i > 0 && (
            <div
              className="vod-case-stage-arrow"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ${ease} ${baseDelay + 0.1 + i * 0.12}s`,
              }}
            >
              ↓
            </div>
          )}
          <div
            className="vod-case-stage"
            style={{
              borderLeft: stage.isFinal ? `3px solid ${color}` : "3px solid transparent",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.5s ${ease} ${baseDelay + 0.1 + i * 0.12}s, transform 0.5s ${ease} ${baseDelay + 0.1 + i * 0.12}s`,
            }}
          >
            <div className="vod-case-stage-label">{stage.label}</div>
            <div className="vod-case-stage-desc">{stage.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VoDCaseComparison() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="vod-case-root">
      <style>{`
        .vod-case-root {
          max-width: 720px;
          margin: 2.5rem auto;
        }
        .vod-case-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-case-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-case-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-case-convergence {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 2.5rem;
        }
        .vod-case-convergence-value {
          font-family: ${tokens.sans};
          font-size: 4rem;
          font-weight: 700;
          color: ${tokens.accent};
          line-height: 1;
        }
        .vod-case-convergence-label {
          font-family: ${tokens.sans};
          font-size: 0.875rem;
          color: ${tokens.textMuted};
          line-height: 1.4;
          max-width: 200px;
        }
        .vod-case-cases {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 2rem;
        }
        .vod-case-pipeline {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vod-case-case-header {
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .vod-case-case-header--aws {
          background: var(--teal-dim);
          border-left: 3px solid var(--teal);
        }
        .vod-case-case-header--az {
          background: var(--green-dim);
          border-left: 3px solid var(--green);
        }
        .vod-case-domain {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
        }
        .vod-case-case-name {
          font-family: ${tokens.sans};
          font-size: 0.875rem;
          font-weight: 700;
        }
        .vod-case-case-name--aws { color: var(--teal); }
        .vod-case-case-name--az { color: var(--green); }
        .vod-case-stage {
          padding: 10px 16px;
          border-radius: 6px;
          background: ${tokens.bgWarm};
          transition: background 0.2s ease;
        }
        .vod-case-stage:hover {
          background: ${tokens.bgCard};
        }
        .vod-case-stage-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${tokens.text};
        }
        .vod-case-stage-desc {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
          line-height: 1.4;
          margin-top: 2px;
        }
        .vod-case-stage-arrow {
          display: flex;
          justify-content: center;
          padding: 2px 0;
          color: ${tokens.textFaint};
          font-size: 0.75rem;
        }
        .vod-case-parallels {
          margin-bottom: 2rem;
        }
        .vod-case-parallel {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 12px;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid ${tokens.border};
        }
        .vod-case-parallel:last-child {
          border-bottom: none;
        }
        .vod-case-parallel-left {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 500;
          text-align: right;
          color: var(--teal);
        }
        .vod-case-parallel-right {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 500;
          text-align: left;
          color: var(--green);
        }
        .vod-case-parallel-bridge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .vod-case-parallel-bridge-icon {
          width: 24px;
          height: 1px;
          background: ${tokens.borderMid};
          position: relative;
        }
        .vod-case-parallel-bridge-icon::before,
        .vod-case-parallel-bridge-icon::after {
          content: '';
          position: absolute;
          top: -2px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${tokens.borderMid};
        }
        .vod-case-parallel-bridge-icon::before { left: -2px; }
        .vod-case-parallel-bridge-icon::after { right: -2px; }
        .vod-case-parallel-mechanism {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.accent};
          white-space: nowrap;
        }
        .vod-case-callout {
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
        }
        .vod-case-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        .vod-case-mobile-parallels {
          display: none;
        }
        @media (max-width: 560px) {
          .vod-case-cases {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .vod-case-convergence-value {
            font-size: 3rem;
          }
          .vod-case-parallels {
            display: none;
          }
          .vod-case-mobile-parallels {
            display: block;
            padding: 14px 16px;
            background: ${tokens.bgWarm};
            border: 1px solid ${tokens.border};
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .vod-case-mobile-parallels-title {
            font-family: ${tokens.mono};
            font-size: 0.6rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: ${tokens.textMuted};
            margin-bottom: 10px;
          }
          .vod-case-mobile-parallel-row {
            margin-bottom: 8px;
          }
          .vod-case-mobile-parallel-row:last-child {
            margin-bottom: 0;
          }
          .vod-case-mobile-parallel-pair {
            font-family: ${tokens.sans};
            font-size: 0.75rem;
            font-weight: 600;
            color: ${tokens.text};
          }
          .vod-case-mobile-parallel-label {
            font-family: ${tokens.mono};
            font-size: 0.6rem;
            color: ${tokens.textMuted};
            margin-top: 2px;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="vod-case-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="vod-case-eyebrow">Cross-Domain Evidence</div>
        <h3 className="vod-case-title">Same mechanism. Same magnitude.</h3>
      </div>

      {/* Hero 6× convergence */}
      <div
        className="vod-case-convergence"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: `opacity 0.6s ${ease} 0s, transform 0.6s ${ease} 0s`,
        }}
      >
        <span className="vod-case-convergence-value">6×</span>
        <span className="vod-case-convergence-label">
          improvement in transition rate, independently achieved across two radically different domains
        </span>
      </div>

      {/* Two-column case layout */}
      <div className="vod-case-cases">
        <CasePipeline
          domain="AI Research"
          name="AWS AI Lab → Neptune ML"
          color="var(--teal)"
          colorDim="var(--teal-dim)"
          stages={awsStages}
          headerClass="vod-case-case-header--aws"
          nameClass="vod-case-case-name--aws"
          inView={inView}
          baseDelay={0.2}
        />
        <CasePipeline
          domain="Pharma"
          name="AstraZeneca → 5R Framework"
          color="var(--green)"
          colorDim="var(--green-dim)"
          stages={azStages}
          headerClass="vod-case-case-header--az"
          nameClass="vod-case-case-name--az"
          inView={inView}
          baseDelay={0.3}
        />
      </div>

      {/* Structural parallels — desktop */}
      <div
        className="vod-case-parallels"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.0s, transform 0.6s ${ease} 1.0s`,
        }}
      >
        {parallels.map((p, i) => (
          <div key={i} className="vod-case-parallel">
            <span className="vod-case-parallel-left">{p.left}</span>
            <div className="vod-case-parallel-bridge">
              <div className="vod-case-parallel-bridge-icon" />
              <span className="vod-case-parallel-mechanism">{p.mechanism}</span>
            </div>
            <span className="vod-case-parallel-right">{p.right}</span>
          </div>
        ))}
      </div>

      {/* Structural parallels — mobile */}
      <div
        className="vod-case-mobile-parallels"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 1.0s`,
        }}
      >
        <div className="vod-case-mobile-parallels-title">Structural Parallels</div>
        {parallels.map((p, i) => (
          <div key={i} className="vod-case-mobile-parallel-row">
            <div className="vod-case-mobile-parallel-pair">
              {p.left} ↔ {p.right}
            </div>
            <div className="vod-case-mobile-parallel-label">→ {p.mechanism}</div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div
        className="vod-case-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.4s, transform 0.6s ${ease} 1.4s`,
        }}
      >
        <div className="vod-case-callout-text">
          Different domains. Different vocabularies. Structurally identical interventions.
          The convergence on 6× suggests this may be the approximate ceiling for organizational
          intervention against coupled-question failure.
        </div>
      </div>
    </div>
  );
}
