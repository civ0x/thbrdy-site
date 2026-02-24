import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Stage {
  label: string;
  desc: string;
  isFinal?: boolean;
  isFailed?: boolean;
}

const awsStages: Stage[] = [
  { label: "Research Artifact", desc: "GNN/DGL — strong results, no product path" },
  { label: "PR/FAQ Translation", desc: "Research → product language" },
  { label: "Business Review", desc: "Visibility via leadership cadence" },
  { label: "Shipped Feature", desc: "Neptune ML — production", isFinal: true },
];

const patronageStages: Stage[] = [
  { label: "Research Artifact", desc: "Scaling laws understood, 100B roadmap" },
  { label: "PR/FAQ Translation", desc: "Built for search, ads, voice" },
  { label: "Planning Review", desc: "SageMaker ($500M+ ARR) prioritized" },
  { label: "Opportunity Starved", desc: "30 HC, $15M — paradigm shift filtered", isFinal: true, isFailed: true },
];

const azStages: Stage[] = [
  { label: "Research Candidate", desc: "Preclinical promise" },
  { label: "5R Joint Assessment", desc: "Target, Tissue, Safety, Patient, Commercial" },
  { label: "Portfolio Review", desc: "Joint scientific-commercial evaluation" },
  { label: "Approved Drug", desc: "Phase III → regulatory approval", isFinal: true },
];

const parallels = [
  { mechanism: "Maturity Gate", aws: "Research Artifact", patronage: "Research Artifact", az: "Research Candidate" },
  { mechanism: "Boundary Object", aws: "PR/FAQ", patronage: "PR/FAQ (worked)", az: "5R Assessment" },
  { mechanism: "Trading Zone", aws: "Business Review", patronage: "Planning Review (filtered)", az: "Portfolio Review" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

function CasePipeline({
  domain,
  name,
  color,
  stages,
  headerClass,
  nameClass,
  inView,
  baseDelay,
  failedCase,
}: {
  domain: string;
  name: string;
  color: string;
  stages: Stage[];
  headerClass: string;
  nameClass: string;
  inView: boolean;
  baseDelay: number;
  failedCase?: boolean;
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
                color: stage.isFailed ? "var(--red)" : undefined,
              }}
            >
              ↓
            </div>
          )}
          <div
            className={`vod-case-stage ${stage.isFailed ? "vod-case-stage--failed" : ""}`}
            style={{
              borderLeft: stage.isFinal
                ? `3px solid ${stage.isFailed ? "var(--red)" : color}`
                : "3px solid transparent",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.5s ${ease} ${baseDelay + 0.1 + i * 0.12}s, transform 0.5s ${ease} ${baseDelay + 0.1 + i * 0.12}s`,
            }}
          >
            <div
              className="vod-case-stage-label"
              style={{ color: stage.isFailed ? "var(--red)" : undefined }}
            >
              {stage.label}
            </div>
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
          max-width: 900px;
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
          max-width: 220px;
        }
        .vod-case-cases {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 2rem;
        }
        .vod-case-pipeline {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vod-case-case-header {
          padding: 12px 14px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .vod-case-case-header--aws {
          background: var(--teal-dim);
          border-left: 3px solid var(--teal);
        }
        .vod-case-case-header--patronage {
          background: var(--red-dim);
          border-left: 3px solid var(--red);
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
          font-size: 0.8rem;
          font-weight: 700;
        }
        .vod-case-case-name--aws { color: var(--teal); }
        .vod-case-case-name--patronage { color: var(--red); }
        .vod-case-case-name--az { color: var(--green); }
        .vod-case-stage {
          padding: 10px 14px;
          border-radius: 6px;
          background: ${tokens.bgWarm};
          transition: background 0.2s ease;
        }
        .vod-case-stage:hover {
          background: ${tokens.bgCard};
        }
        .vod-case-stage--failed {
          background: var(--red-dim);
        }
        .vod-case-stage--failed:hover {
          background: var(--red-dim);
        }
        .vod-case-stage-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          color: ${tokens.text};
        }
        .vod-case-stage-desc {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
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
        .vod-case-parallels-header {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 1fr;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 2px solid ${tokens.borderMid};
          margin-bottom: 4px;
        }
        .vod-case-parallels-header-mechanism {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
        }
        .vod-case-parallels-header-domain {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
        }
        .vod-case-parallels-header-domain--aws { color: var(--teal); }
        .vod-case-parallels-header-domain--patronage { color: var(--red); }
        .vod-case-parallels-header-domain--az { color: var(--green); }
        .vod-case-parallel {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 1fr;
          gap: 8px;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid ${tokens.border};
        }
        .vod-case-parallel:last-child {
          border-bottom: none;
        }
        .vod-case-parallel-mechanism {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.accent};
        }
        .vod-case-parallel-cell {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          font-weight: 500;
          text-align: center;
        }
        .vod-case-parallel-cell--aws { color: var(--teal); }
        .vod-case-parallel-cell--patronage { color: var(--red); }
        .vod-case-parallel-cell--az { color: var(--green); }
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
        @media (max-width: 720px) {
          .vod-case-cases {
            grid-template-columns: 1fr;
            gap: 28px;
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
            margin-bottom: 10px;
          }
          .vod-case-mobile-parallel-row:last-child {
            margin-bottom: 0;
          }
          .vod-case-mobile-parallel-mechanism {
            font-family: ${tokens.mono};
            font-size: 0.55rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: ${tokens.accent};
            margin-bottom: 4px;
          }
          .vod-case-mobile-parallel-items {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .vod-case-mobile-parallel-item {
            font-family: ${tokens.sans};
            font-size: 0.7rem;
            font-weight: 500;
          }
          .vod-case-mobile-parallel-item--aws { color: var(--teal); }
          .vod-case-mobile-parallel-item--patronage { color: var(--red); }
          .vod-case-mobile-parallel-item--az { color: var(--green); }
        }
        @media (max-width: 420px) {
          .vod-case-case-name {
            font-size: 0.75rem;
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
        <h3 className="vod-case-title">Same mechanism. Same magnitude. One blind spot.</h3>
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
          improvement in transition rate — when the evaluative frame could see the opportunity
        </span>
      </div>

      {/* Three-column case layout */}
      <div className="vod-case-cases">
        <CasePipeline
          domain="AI Research"
          name="AWS AI → Neptune ML"
          color="var(--teal)"
          stages={awsStages}
          headerClass="vod-case-case-header--aws"
          nameClass="vod-case-case-name--aws"
          inView={inView}
          baseDelay={0.2}
        />
        <CasePipeline
          domain="AI Research"
          name="AWS AI → LLMs"
          color="var(--red)"
          stages={patronageStages}
          headerClass="vod-case-case-header--patronage"
          nameClass="vod-case-case-name--patronage"
          inView={inView}
          baseDelay={0.3}
          failedCase
        />
        <CasePipeline
          domain="Pharma"
          name="AstraZeneca → 5R"
          color="var(--green)"
          stages={azStages}
          headerClass="vod-case-case-header--az"
          nameClass="vod-case-case-name--az"
          inView={inView}
          baseDelay={0.4}
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
        <div className="vod-case-parallels-header">
          <span className="vod-case-parallels-header-mechanism">Mechanism</span>
          <span className="vod-case-parallels-header-domain vod-case-parallels-header-domain--aws">Neptune ML</span>
          <span className="vod-case-parallels-header-domain vod-case-parallels-header-domain--patronage">LLM / Patronage</span>
          <span className="vod-case-parallels-header-domain vod-case-parallels-header-domain--az">AstraZeneca</span>
        </div>
        {parallels.map((p, i) => (
          <div key={i} className="vod-case-parallel">
            <span className="vod-case-parallel-mechanism">{p.mechanism}</span>
            <span className="vod-case-parallel-cell vod-case-parallel-cell--aws">{p.aws}</span>
            <span className="vod-case-parallel-cell vod-case-parallel-cell--patronage">{p.patronage}</span>
            <span className="vod-case-parallel-cell vod-case-parallel-cell--az">{p.az}</span>
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
            <div className="vod-case-mobile-parallel-mechanism">{p.mechanism}</div>
            <div className="vod-case-mobile-parallel-items">
              <div className="vod-case-mobile-parallel-item vod-case-mobile-parallel-item--aws">{p.aws}</div>
              <div className="vod-case-mobile-parallel-item vod-case-mobile-parallel-item--patronage">{p.patronage}</div>
              <div className="vod-case-mobile-parallel-item vod-case-mobile-parallel-item--az">{p.az}</div>
            </div>
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
          Two successes, one failure — all using the same three-stage mechanism. The 6× improvement
          holds when the evaluative frame can see the opportunity. When it can't, the mechanism
          operates correctly and produces the wrong answer.
        </div>
      </div>
    </div>
  );
}
