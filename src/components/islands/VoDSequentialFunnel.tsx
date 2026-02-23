import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface EvalNode {
  id: string;
  label: string;
  shortLabel: string;
}

const nodes: EvalNode[] = [
  { id: "research", label: "Research Review", shortLabel: "Research" },
  { id: "market", label: "Market Assessment", shortLabel: "Market" },
  { id: "engineering", label: "Engineering Feasibility", shortLabel: "Engineering" },
  { id: "executive", label: "Executive Approval", shortLabel: "Executive" },
];

interface Dependency {
  from: string;
  to: string;
  label: string;
}

const dependencies: Dependency[] = [
  { from: "research", to: "market", label: "What counts as 'good enough' depends on what the market requires" },
  { from: "research", to: "engineering", label: "Technical approach constrains build cost" },
  { from: "research", to: "executive", label: "Research risk shapes investment appetite" },
  { from: "market", to: "engineering", label: "Target market determines performance requirements" },
  { from: "market", to: "executive", label: "Market size justifies resource allocation" },
  { from: "engineering", to: "executive", label: "Build complexity determines timeline and cost" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Diamond positions (percentage within a square container)
const diamondPos: Record<string, { x: number; y: number }> = {
  research: { x: 50, y: 8 },
  market: { x: 8, y: 50 },
  engineering: { x: 92, y: 50 },
  executive: { x: 50, y: 92 },
};

// Edge colors cycling through semantic tokens
const edgeColors: Record<string, string> = {
  "research-market": "var(--teal)",
  "research-engineering": "var(--green)",
  "research-executive": "var(--blue)",
  "market-engineering": "var(--teal)",
  "market-executive": "var(--green)",
  "engineering-executive": "var(--blue)",
};

// Ghost edges: non-adjacent pairs in the sequential chain
const ghostEdges = [
  { from: 0, to: 2 },
  { from: 0, to: 3 },
  { from: 1, to: 3 },
];

export default function VoDSequentialFunnel() {
  const [ref, inView] = useInView(0.15);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);

  return (
    <div ref={ref} className="vod-funnel-root">
      <style>{`
        .vod-funnel-root {
          max-width: 740px;
          margin: 2.5rem auto;
        }
        .vod-funnel-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-funnel-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-funnel-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-funnel-panels {
          display: flex;
          gap: 60px;
          justify-content: center;
        }
        .vod-funnel-panel {
          flex: 1;
          max-width: 320px;
        }
        .vod-funnel-panel-label {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 1rem;
          text-align: center;
        }
        .vod-funnel-seq-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .vod-funnel-seq-node {
          width: 100%;
          padding: 12px 16px;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.borderMid};
          border-radius: 6px;
          box-sizing: border-box;
        }
        .vod-funnel-seq-node-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-funnel-seq-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 32px;
          justify-content: center;
          position: relative;
        }
        .vod-funnel-seq-arrow-line {
          width: 1px;
          height: 20px;
          background: ${tokens.borderMid};
        }
        .vod-funnel-seq-gate {
          width: 5px;
          height: 5px;
          background: ${tokens.textFaint};
          transform: rotate(45deg);
          margin: 2px 0;
        }
        .vod-funnel-diamond {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
        }
        .vod-funnel-diamond-node {
          position: absolute;
          padding: 8px 12px;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.borderMid};
          border-radius: 6px;
          text-align: center;
          z-index: 1;
        }
        .vod-funnel-diamond-label {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          color: ${tokens.text};
          margin: 0;
          white-space: nowrap;
        }
        .vod-funnel-diamond-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .vod-funnel-detail {
          margin-top: 1.5rem;
          padding: 12px 16px;
          border-radius: 6px;
          min-height: 48px;
          display: flex;
          align-items: center;
        }
        .vod-funnel-detail--active {
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
        }
        .vod-funnel-detail--placeholder {
          background: transparent;
          border-left: 3px solid ${tokens.border};
        }
        .vod-funnel-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-funnel-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          margin: 0;
        }
        .vod-funnel-callout {
          margin-top: 2rem;
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
        }
        .vod-funnel-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-funnel-ghost-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .vod-funnel-mobile-deps {
          display: none;
        }
        @media (max-width: 640px) {
          .vod-funnel-panels {
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }
          .vod-funnel-panel {
            max-width: 400px;
            width: 100%;
          }
        }
        @media (max-width: 420px) {
          .vod-funnel-diamond {
            display: none;
          }
          .vod-funnel-mobile-deps {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .vod-funnel-dep-card {
            padding: 10px 14px;
            background: ${tokens.bgWarm};
            border: 1px solid ${tokens.border};
            border-radius: 6px;
          }
          .vod-funnel-dep-pair {
            font-family: ${tokens.sans};
            font-size: 0.75rem;
            font-weight: 600;
            color: ${tokens.text};
            margin: 0 0 4px;
          }
          .vod-funnel-dep-label {
            font-family: ${tokens.sans};
            font-size: 0.6875rem;
            color: ${tokens.textMuted};
            margin: 0;
          }
        }
      `}</style>

      <div className="vod-funnel-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-funnel-eyebrow">Information Loss</p>
        <h3 className="vod-funnel-title">What sequential evaluation can't see.</h3>
      </div>

      <div className="vod-funnel-panels">
        {/* Left Panel — Sequential */}
        <div className="vod-funnel-panel">
          <div className="vod-funnel-panel-label"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.4s ${ease} 0s`,
            }}
          >Sequential Evaluation (Standard)</div>
          <div className="vod-funnel-seq-list">
            {/* Ghost edge SVG layer */}
            <svg className="vod-funnel-ghost-svg" viewBox="0 0 320 380" preserveAspectRatio="none">
              {ghostEdges.map((g, i) => {
                const y1 = g.from * 88 + 24;
                const y2 = g.to * 88 + 24;
                const offsetX = 290 + i * 10;
                return (
                  <path
                    key={i}
                    d={`M 280 ${y1} Q ${offsetX} ${(y1 + y2) / 2}, 280 ${y2}`}
                    fill="none"
                    stroke={tokens.accent}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    opacity={inView ? 0.08 : 0}
                    style={{ transition: `opacity 0.6s ${ease} ${1.6 + i * 0.1}s` }}
                  />
                );
              })}
            </svg>
            {nodes.map((node, i) => (
              <div key={node.id}>
                <div className="vod-funnel-seq-node"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.6s ${ease} ${i * 0.12}s, transform 0.6s ${ease} ${i * 0.12}s`,
                  }}
                >
                  <p className="vod-funnel-seq-node-label">{node.label}</p>
                </div>
                {i < nodes.length - 1 && (
                  <div className="vod-funnel-seq-arrow"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ${ease} ${i * 0.12 + 0.3}s`,
                    }}
                  >
                    <div className="vod-funnel-seq-arrow-line" />
                    <div className="vod-funnel-seq-gate" />
                    <svg width="8" height="6" viewBox="0 0 8 6" style={{ marginTop: 1 }}>
                      <polygon points="4,6 0,0 8,0" fill={tokens.borderMid} />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — Diamond Dependencies */}
        <div className="vod-funnel-panel">
          <div className="vod-funnel-panel-label"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.4s ${ease} 0.6s`,
            }}
          >Actual Dependencies</div>

          {/* Diamond layout (desktop/tablet) */}
          <div className="vod-funnel-diamond"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.6s ${ease} 0.6s`,
            }}
          >
            <svg className="vod-funnel-diamond-svg" viewBox="0 0 100 100">
              {dependencies.map((dep, i) => {
                const from = diamondPos[dep.from];
                const to = diamondPos[dep.to];
                const key = `${dep.from}-${dep.to}`;
                const color = edgeColors[key] || tokens.borderMid;
                const isHovered = hoveredEdge === i;
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke={color}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    opacity={inView ? (isHovered ? 1 : 0.5) : 0}
                    style={{
                      transition: `opacity 0.5s ${ease} ${1.0 + i * 0.1}s, stroke-width 0.2s`,
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredEdge(i)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                );
              })}
            </svg>
            {nodes.map((node) => {
              const pos = diamondPos[node.id];
              const isTop = pos.y < 25;
              const isBottom = pos.y > 75;
              return (
                <div key={node.id} className="vod-funnel-diamond-node"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%)`,
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.5s ${ease} 0.7s`,
                  }}
                >
                  <p className="vod-funnel-diamond-label">{node.shortLabel}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile dependency list */}
          <div className="vod-funnel-mobile-deps">
            {dependencies.map((dep, i) => {
              const fromNode = nodes.find(n => n.id === dep.from)!;
              const toNode = nodes.find(n => n.id === dep.to)!;
              return (
                <div key={i} className="vod-funnel-dep-card"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity 0.5s ${ease} ${0.6 + i * 0.08}s, transform 0.5s ${ease} ${0.6 + i * 0.08}s`,
                  }}
                >
                  <p className="vod-funnel-dep-pair">{fromNode.shortLabel} ↔ {toNode.shortLabel}</p>
                  <p className="vod-funnel-dep-label">{dep.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover detail */}
      <div className={`vod-funnel-detail ${hoveredEdge !== null ? "vod-funnel-detail--active" : "vod-funnel-detail--placeholder"}`}
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ${ease} 1.4s`,
        }}
      >
        {hoveredEdge !== null ? (
          <p className="vod-funnel-detail-text">{dependencies[hoveredEdge].label}</p>
        ) : (
          <p className="vod-funnel-detail-placeholder">Hover an edge to see the bidirectional constraint</p>
        )}
      </div>

      <div className="vod-funnel-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 2.0s, transform 0.6s ${ease} 2.0s`,
        }}
      >
        <p className="vod-funnel-callout-text">
          Sequential evaluation sees 3 forward connections. The actual structure has 6 bidirectional dependencies.
        </p>
      </div>
    </div>
  );
}
