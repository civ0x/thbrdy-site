import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface TimelineStage {
  label: string;
  shortLabel: string;
  desc: string;
}

interface Timeline {
  id: string;
  title: string;
  color: string;
  colorDim: string;
  stages: TimelineStage[];
  result: string;
  resultDetail: string;
}

const timelines: Timeline[] = [
  {
    id: "aws",
    title: "AWS AI Lab → Neptune ML",
    color: "var(--teal)",
    colorDim: "var(--teal-dim)",
    stages: [
      { label: "Research Artifact", shortLabel: "Research", desc: "GNN/DGL — strong academic results, no productization path" },
      { label: "PR/FAQ Translation", shortLabel: "PR/FAQ", desc: "Converted to product language: ML predictions on graph data in Neptune" },
      { label: "Business Review", shortLabel: "Biz Review", desc: "Structured visibility through leadership review cadence" },
      { label: "Shipped Feature", shortLabel: "Shipped", desc: "Neptune ML — production feature, publicly documented" },
    ],
    result: "6×",
    resultDetail: "increase in transition rate",
  },
  {
    id: "az",
    title: "AstraZeneca → 5R Framework",
    color: "var(--green)",
    colorDim: "var(--green-dim)",
    stages: [
      { label: "Research Candidate", shortLabel: "Candidate", desc: "Drug candidate with preclinical promise" },
      { label: "5R Joint Assessment", shortLabel: "5R Assessment", desc: "Right Target, Right Tissue, Right Safety, Right Patient, Right Commercial" },
      { label: "Portfolio Review", shortLabel: "Portfolio", desc: "Joint scientific-clinical-commercial evaluation" },
      { label: "Approved Drug", shortLabel: "Approved", desc: "Phase III completion and regulatory approval" },
    ],
    result: "6×",
    resultDetail: "4% → 23% success rate",
  },
];

interface Parallel {
  stageIdx: number;
  label: string;
}

const parallels: Parallel[] = [
  { stageIdx: 0, label: "Maturity Gate" },
  { stageIdx: 1, label: "Boundary Object" },
  { stageIdx: 2, label: "Trading Zone" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDCaseComparison() {
  const [ref, inView] = useInView(0.15);
  const [hoveredStage, setHoveredStage] = useState<{ timeline: number; stage: number } | null>(null);

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
        .vod-case-timelines {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .vod-case-timeline-title {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .vod-case-row {
          display: flex;
          align-items: stretch;
          gap: 8px;
        }
        .vod-case-stages {
          display: flex;
          flex: 1;
          gap: 4px;
          align-items: stretch;
        }
        .vod-case-stage-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .vod-case-stage {
          flex: 1;
          padding: 10px 10px;
          border-radius: 6px;
          cursor: pointer;
          box-sizing: border-box;
          min-height: 52px;
          display: flex;
          align-items: center;
        }
        .vod-case-stage-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0;
        }
        .vod-case-arrow {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .vod-case-badge {
          width: 80px;
          flex-shrink: 0;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          box-sizing: border-box;
        }
        .vod-case-badge-value {
          font-family: ${tokens.sans};
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          line-height: 1;
        }
        .vod-case-badge-detail {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: ${tokens.textMuted};
          margin: 4px 0 0;
          text-align: center;
          line-height: 1.2;
        }
        .vod-case-parallels {
          display: flex;
          justify-content: flex-start;
          gap: 4px;
          padding: 0;
          margin: 0;
          height: 50px;
          align-items: center;
          flex: 1;
        }
        .vod-case-parallel-item {
          flex: 1;
          text-align: center;
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vod-case-parallel-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
        }
        .vod-case-parallel-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          background: ${tokens.bg};
          padding: 2px 6px;
          position: relative;
          z-index: 1;
        }
        .vod-case-parallel-spacer {
          width: 80px;
          flex-shrink: 0;
        }
        .vod-case-detail {
          margin-top: 1rem;
          padding: 12px 16px;
          border-radius: 6px;
          min-height: 40px;
          display: flex;
          align-items: center;
        }
        .vod-case-detail--active {
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
        }
        .vod-case-detail--placeholder {
          background: transparent;
          border-left: 3px solid ${tokens.border};
        }
        .vod-case-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-case-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          margin: 0;
        }
        .vod-case-callout {
          margin-top: 1.5rem;
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
        }
        .vod-case-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-case-mobile-parallels {
          display: none;
        }
        @media (max-width: 640px) {
          .vod-case-stage-label {
            font-size: 0.6875rem;
          }
          .vod-case-badge {
            width: 70px;
          }
          .vod-case-badge-value {
            font-size: 1.75rem;
          }
        }
        @media (max-width: 420px) {
          .vod-case-row {
            flex-direction: column;
          }
          .vod-case-stages {
            flex-direction: column;
            gap: 6px;
          }
          .vod-case-stage-wrap {
            flex-direction: column;
            align-items: stretch;
          }
          .vod-case-arrow {
            display: none;
          }
          .vod-case-badge {
            width: 100%;
          }
          .vod-case-parallels {
            display: none;
          }
          .vod-case-parallel-spacer {
            display: none;
          }
          .vod-case-mobile-parallels {
            display: block;
            padding: 14px 16px;
            background: ${tokens.bgWarm};
            border: 1px solid ${tokens.border};
            border-radius: 8px;
            margin: 12px 0;
          }
          .vod-case-mobile-parallels-title {
            font-family: ${tokens.mono};
            font-size: 0.6rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: ${tokens.textMuted};
            margin: 0 0 10px;
          }
          .vod-case-mobile-parallel-row {
            margin-bottom: 8px;
          }
          .vod-case-mobile-parallel-pair {
            font-family: ${tokens.sans};
            font-size: 0.75rem;
            font-weight: 600;
            color: ${tokens.text};
            margin: 0;
          }
          .vod-case-mobile-parallel-label {
            font-family: ${tokens.mono};
            font-size: 0.6rem;
            color: ${tokens.textMuted};
            margin: 2px 0 0;
          }
        }
      `}</style>

      <div className="vod-case-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-case-eyebrow">Cross-Domain Evidence</p>
        <h3 className="vod-case-title">Same mechanism. Same magnitude.</h3>
      </div>

      <div className="vod-case-timelines">
        {timelines.map((tl, tlIdx) => (
          <div key={tl.id}>
            <p className="vod-case-timeline-title"
              style={{
                color: tl.color,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} ${tlIdx * 0.3}s`,
              }}
            >{tl.title}</p>
            <div className="vod-case-row">
              <div className="vod-case-stages">
                {tl.stages.map((stage, sIdx) => (
                  <div key={sIdx} className="vod-case-stage-wrap">
                    <div className="vod-case-stage"
                      style={{
                        background: tl.colorDim,
                        border: `1.5px solid color-mix(in srgb, ${tl.color} 30%, transparent)`,
                        opacity: inView ? 1 : 0,
                        transform: inView ? "translateY(0)" : "translateY(12px)",
                        transition: `opacity 0.6s ${ease} ${tlIdx * 0.3 + sIdx * 0.12}s, transform 0.6s ${ease} ${tlIdx * 0.3 + sIdx * 0.12}s`,
                      }}
                      onMouseEnter={() => setHoveredStage({ timeline: tlIdx, stage: sIdx })}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      <p className="vod-case-stage-label" style={{ color: tl.color }}>
                        <span className="vod-case-stage-full">{stage.label}</span>
                      </p>
                    </div>
                    {sIdx < tl.stages.length - 1 && (
                      <div className="vod-case-arrow"
                        style={{
                          opacity: inView ? 1 : 0,
                          transition: `opacity 0.4s ${ease} ${tlIdx * 0.3 + sIdx * 0.12 + 0.2}s`,
                        }}
                      >
                        <svg width="12" height="10" viewBox="0 0 12 10">
                          <line x1="0" y1="5" x2="8" y2="5" stroke={tl.color} strokeWidth="1" opacity="0.5" />
                          <polygon points="8,2 12,5 8,8" fill={tl.color} opacity="0.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="vod-case-badge"
                style={{
                  background: `color-mix(in srgb, ${tl.color} 10%, transparent)`,
                  border: `2px solid ${tl.color}`,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "scale(1)" : "scale(0.9)",
                  transition: `opacity 0.6s ${ease} ${1.2 + tlIdx * 0.15}s, transform 0.5s ${ease} ${1.2 + tlIdx * 0.15}s`,
                }}
              >
                <p className="vod-case-badge-value" style={{ color: tl.color }}>{tl.result}</p>
                <p className="vod-case-badge-detail">{tl.resultDetail}</p>
              </div>
            </div>

            {/* Structural parallels between the two timelines */}
            {tlIdx === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="vod-case-parallels"
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.6s ${ease} 0.9s`,
                  }}
                >
                  {tl.stages.map((stage, sIdx) => {
                    const parallel = parallels.find(p => p.stageIdx === sIdx);
                    return (
                      <div key={sIdx} className="vod-case-parallel-item">
                        {parallel && (
                          <>
                            <svg className="vod-case-parallel-line" width="1" height="100%">
                              <line x1="0" y1="0" x2="0" y2="100%" stroke={tokens.textFaint} strokeWidth="1" strokeDasharray="4 4" />
                            </svg>
                            <span className="vod-case-parallel-label">{parallel.label}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="vod-case-parallel-spacer" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile structural parallels card */}
      <div className="vod-case-mobile-parallels"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.9s`,
        }}
      >
        <p className="vod-case-mobile-parallels-title">Structural Parallels</p>
        {parallels.map((p) => (
          <div key={p.stageIdx} className="vod-case-mobile-parallel-row">
            <p className="vod-case-mobile-parallel-pair">
              {timelines[0].stages[p.stageIdx].shortLabel} ↔ {timelines[1].stages[p.stageIdx].shortLabel}
            </p>
            <p className="vod-case-mobile-parallel-label">→ {p.label}</p>
          </div>
        ))}
      </div>

      {/* Hover detail */}
      <div className={`vod-case-detail ${hoveredStage ? "vod-case-detail--active" : "vod-case-detail--placeholder"}`}
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ${ease} 1.0s`,
        }}
      >
        {hoveredStage ? (
          <p className="vod-case-detail-text">
            {timelines[hoveredStage.timeline].stages[hoveredStage.stage].desc}
          </p>
        ) : (
          <p className="vod-case-detail-placeholder">Hover a stage to see details</p>
        )}
      </div>

      <div className="vod-case-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.5s, transform 0.6s ${ease} 1.5s`,
        }}
      >
        <p className="vod-case-callout-text">
          Different domains. Same mechanism. Same magnitude of improvement.
        </p>
      </div>
    </div>
  );
}
