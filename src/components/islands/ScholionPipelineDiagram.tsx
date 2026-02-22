import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const stages = [
  {
    num: "Stage 01",
    name: "Passage Extraction",
    desc: "Identify argumentative passages using paper structure as scaffolding",
    schema: "→ passage, section, type",
  },
  {
    num: "Stage 02",
    name: "Atomic Decomposition",
    desc: "Break passages into atomic propositions with Toulmin roles",
    schema: "→ claim, warrant, backing, qualifier, rebuttal",
  },
  {
    num: "Stage 03",
    name: "Dependency Mapping",
    desc: "Identify which claims depend on or support which other claims",
    schema: "→ source, target, direction, type",
  },
  {
    num: "Stage 04",
    name: "Crux Detection",
    desc: "Classify edge types and identify load-bearing dependencies",
    schema: "→ edge_type, is_crux, reasoning",
  },
];

export default function ScholionPipelineDiagram() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="scholion-pipeline">
      <style>{`
        .scholion-pipeline {
          margin: 2.5rem 0;
        }
        .scholion-pipeline-inner {
          background: var(--bg-dark);
          border-radius: 8px;
          padding: 2rem;
          overflow: hidden;
        }
        .scholion-pipeline-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 1.5rem;
        }
        .scholion-pipeline-stages {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .scholion-pipeline-stage {
          background: var(--bg-dark-mid);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 1.2rem 1rem;
        }
        .scholion-pipeline-num {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          color: var(--accent);
          margin-bottom: 0.6rem;
          display: block;
        }
        .scholion-pipeline-name {
          font-family: ${tokens.sans};
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.4rem;
          line-height: 1.3;
        }
        .scholion-pipeline-desc {
          font-family: ${tokens.sans};
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.5;
        }
        .scholion-pipeline-schema {
          margin-top: 0.8rem;
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          color: var(--accent);
          opacity: 0.7;
          line-height: 1.6;
        }
        .scholion-pipeline-callout {
          margin-top: 1rem;
          padding: 1rem 1.2rem;
          background: rgba(184, 134, 11, 0.06);
          border: 1px solid rgba(184, 134, 11, 0.15);
          border-radius: 6px;
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }
        .scholion-pipeline-callout-label {
          color: var(--accent);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .scholion-pipeline-stages {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .scholion-pipeline-inner {
            padding: 1.5rem 1rem;
          }
          .scholion-pipeline-stages {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="scholion-pipeline-inner">
        <div className="scholion-pipeline-title">
          Toulmin extraction pipeline · 4 stages per paper
        </div>
        <div className="scholion-pipeline-stages">
          {stages.map((stage, i) => (
            <div
              key={stage.num}
              className="scholion-pipeline-stage"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
              }}
            >
              <span className="scholion-pipeline-num">{stage.num}</span>
              <div className="scholion-pipeline-name">{stage.name}</div>
              <div className="scholion-pipeline-desc">{stage.desc}</div>
              <div className="scholion-pipeline-schema">{stage.schema}</div>
            </div>
          ))}
        </div>
        <div
          className="scholion-pipeline-callout"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.5s",
          }}
        >
          <span className="scholion-pipeline-callout-label">Critical gap:</span>{" "}
          No validated Toulmin-structured dataset for scientific papers exists.
          The annotation schema and dataset are themselves research contributions —
          the ground truth against which any extraction pipeline must be evaluated.
        </div>
      </div>
    </div>
  );
}
