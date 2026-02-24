import { useState, useEffect, useRef, useCallback } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface NodeData {
  id: string;
  label: string;
  short: string;
  seq: string;
  actual: string;
}

interface EdgeData {
  from: string;
  to: string;
  label: string;
  sequential: boolean;
}

const nodes: NodeData[] = [
  {
    id: "research",
    label: "Research Review",
    short: "Research",
    seq: "Evaluates technical novelty and scientific rigor in isolation. Passes a confidence score forward — but has no visibility into what the market needs or what engineering can actually build.",
    actual: "Technical capability that simultaneously constrains what markets become addressable, what architectures are feasible, and what investment risk the executive is underwriting. Every other evaluation depends on this one.",
  },
  {
    id: "market",
    label: "Market Assessment",
    short: "Market",
    seq: "Receives a \"research-approved\" candidate and assesses market size and timing. Cannot push back on the research framing — only decides whether the opportunity is big enough to continue.",
    actual: "Market reality shapes what \"good enough\" means for research, sets performance targets for engineering, and determines whether the business case justifies executive investment. It constrains three other evaluations, not just the one downstream.",
  },
  {
    id: "engineering",
    label: "Engineering Feasibility",
    short: "Engineering",
    seq: "Estimates build cost and timeline for whatever research and market have already approved. Can flag infeasibility but cannot reshape the research approach or reframe the market target.",
    actual: "Build complexity feeds back into research approach (some architectures make certain research directions impractical) and directly determines the cost structure executives evaluate. Engineering is a constraint on research, not just a recipient of it.",
  },
  {
    id: "executive",
    label: "Executive Approval",
    short: "Executive",
    seq: "Final go/no-go based on the package that survived three prior gates. Sees only what sequential filtering preserved — the original research risk, market uncertainty, and engineering trade-offs have been compressed into a summary.",
    actual: "Investment appetite is shaped directly by research risk, market size, and build complexity — three independent inputs, not a single filtered package. The executive evaluation also constrains what research gets funded next, closing the loop.",
  },
];

const edges: EdgeData[] = [
  { from: "research", to: "market", label: "What counts as \"good enough\" depends on what the market requires", sequential: true },
  { from: "market", to: "engineering", label: "Target market determines performance requirements", sequential: true },
  { from: "engineering", to: "executive", label: "Build complexity determines timeline and cost", sequential: true },
  { from: "research", to: "engineering", label: "Technical approach constrains build cost", sequential: false },
  { from: "research", to: "executive", label: "Research risk shapes investment appetite", sequential: false },
  { from: "market", to: "executive", label: "Market size justifies resource allocation", sequential: false },
];

const edgeColors: Record<string, string> = {
  "research-market": "var(--teal)",
  "research-engineering": "var(--green)",
  "research-executive": "var(--blue)",
  "market-engineering": "var(--teal)",
  "market-executive": "var(--green)",
  "engineering-executive": "var(--blue)",
};

const seqPositions: Record<string, { x: number; y: number }> = {
  research: { x: 50, y: 8 },
  market: { x: 50, y: 33 },
  engineering: { x: 50, y: 58 },
  executive: { x: 50, y: 83 },
};

const actualPositions: Record<string, { x: number; y: number }> = {
  research: { x: 50, y: 8 },
  market: { x: 12, y: 50 },
  engineering: { x: 88, y: 50 },
  executive: { x: 50, y: 88 },
};

const gatePositions = [
  { x: 50, y: 20.5 },
  { x: 50, y: 45.5 },
  { x: 50, y: 70.5 },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const SVG_W = 680;
const SVG_H = 510;

function pctToSvg(pctX: number, pctY: number) {
  return { x: (pctX / 100) * SVG_W, y: (pctY / 100) * SVG_H };
}

const nonSeqEdges = edges.filter((e) => !e.sequential);

export default function VoDSequentialFunnel() {
  const [ref, inView] = useInView(0.15);
  const [isActual, setIsActual] = useState(false);
  const [hoveredEdgeIdx, setHoveredEdgeIdx] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const doToggle = useCallback(() => {
    setIsActual((prev) => !prev);
    setHoveredEdgeIdx(null);
  }, []);

  // Click-outside clears node selection
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setSelectedNodeId(null);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const positions = isActual ? actualPositions : seqPositions;

  function getEdgeCoords(edge: EdgeData) {
    const from = pctToSvg(positions[edge.from].x, positions[edge.from].y);
    const to = pctToSvg(positions[edge.to].x, positions[edge.to].y);
    if (isActual || edge.sequential) {
      return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, opacity: 0.5 };
    }
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    return { x1: mx, y1: my, x2: mx, y2: my, opacity: 0 };
  }

  function getEdgeStyle(i: number, edge: EdgeData) {
    const isVisible = isActual || edge.sequential;
    if (selectedNodeId) {
      const connected = edge.from === selectedNodeId || edge.to === selectedNodeId;
      if (isVisible) {
        return {
          opacity: connected ? 0.8 : 0.15,
          strokeWidth: connected ? 2.5 : 1,
        };
      }
      return { opacity: 0, strokeWidth: 1.5 };
    }
    if (hoveredEdgeIdx === i) {
      return { opacity: 1, strokeWidth: 3 };
    }
    if (hoveredEdgeIdx !== null && isVisible) {
      return { opacity: 0.25, strokeWidth: 1.5 };
    }
    const coords = getEdgeCoords(edge);
    return { opacity: coords.opacity, strokeWidth: 1.5 };
  }

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  return (
    <div
      ref={(el) => {
        // Merge refs: useInView ref + rootRef
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        rootRef.current = el;
      }}
      className="vod-funnel-root"
    >
      <style>{`
        .vod-funnel-root {
          max-width: 680px;
          margin: 2.5rem auto;
        }
        .vod-funnel-header {
          text-align: center;
          margin-bottom: 2.5rem;
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
        .vod-funnel-toggle-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 12px;
          align-items: center;
        }
        .vod-funnel-toggle-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: ${tokens.textMuted};
          transition: color 0.4s ease;
          cursor: pointer;
          user-select: none;
        }
        .vod-funnel-toggle-label--active {
          color: ${tokens.accent};
        }
        .vod-funnel-toggle-track {
          width: 52px;
          height: 28px;
          border-radius: 14px;
          background: ${tokens.bgCard};
          border: 1px solid var(--border-mid);
          position: relative;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .vod-funnel-toggle-track:hover {
          background: ${tokens.bgWarm};
        }
        .vod-funnel-toggle-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${tokens.accent};
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.4s ${ease};
          box-shadow: 0 1px 4px rgba(44, 36, 22, 0.15);
        }
        .vod-funnel-toggle-thumb--right {
          transform: translateX(24px);
        }
        .vod-funnel-diagram {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          margin-bottom: 1.5rem;
        }
        .vod-funnel-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .vod-funnel-edge {
          transition: all 0.8s ${ease};
        }
        .vod-funnel-node {
          position: absolute;
          padding: 12px 18px;
          background: var(--bg);
          border: 1.5px solid var(--border-mid);
          border-radius: 8px;
          z-index: 2;
          transition: all 0.8s ${ease};
          text-align: center;
          box-shadow: 0 1px 6px rgba(44, 36, 22, 0.04);
          cursor: pointer;
          transform: translate(-50%, -50%);
        }
        .vod-funnel-node:hover {
          border-color: ${tokens.accent};
          box-shadow: 0 2px 12px rgba(184, 134, 11, 0.08);
        }
        .vod-funnel-node--selected {
          border-color: ${tokens.accent};
          box-shadow: 0 2px 16px rgba(184, 134, 11, 0.12);
          background: ${tokens.bgWarm};
        }
        .vod-funnel-node-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${tokens.text};
          white-space: nowrap;
        }
        .vod-funnel-gate {
          position: absolute;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          transform: translate(-50%, -50%);
          transition: opacity 0.6s ${ease};
          pointer-events: none;
        }
        .vod-funnel-gate-diamond {
          width: 6px;
          height: 6px;
          background: ${tokens.textFaint};
          transform: rotate(45deg);
        }
        .vod-funnel-gate-label {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
          white-space: nowrap;
        }
        .vod-funnel-edge-count {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .vod-funnel-edge-count-inner {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
        }
        .vod-funnel-edge-count-number {
          font-family: ${tokens.sans};
          font-size: 2.5rem;
          font-weight: 700;
          color: ${tokens.accent};
          line-height: 1;
          transition: opacity 0.3s ease;
        }
        .vod-funnel-edge-count-label {
          font-family: ${tokens.sans};
          font-size: 0.875rem;
          font-weight: 500;
          color: ${tokens.textMuted};
        }
        .vod-funnel-edge-count-sub {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textLight};
          font-style: italic;
          margin-top: 4px;
        }
        .vod-funnel-lost-edges {
          margin-bottom: 2rem;
          transition: opacity 0.6s ease 0.3s, max-height 0.6s ease;
          overflow: hidden;
        }
        .vod-funnel-lost-edges--visible {
          opacity: 1;
          max-height: 200px;
        }
        .vod-funnel-lost-edges--hidden {
          opacity: 0;
          max-height: 0;
          margin-bottom: 0;
        }
        .vod-funnel-lost-edges-title {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--red, #A63D2F);
          margin-bottom: 8px;
          text-align: center;
        }
        .vod-funnel-lost-edge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }
        .vod-funnel-lost-edge-chip {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 500;
          color: ${tokens.textMuted};
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 4px;
          padding: 4px 10px;
          text-decoration: line-through;
          text-decoration-color: rgba(166, 61, 47, 0.4);
        }
        .vod-funnel-hover-detail {
          margin-top: 1.5rem;
          padding: 12px 16px;
          border-radius: 6px;
          min-height: 48px;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        .vod-funnel-hover-detail--active {
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
        }
        .vod-funnel-hover-detail--empty {
          background: transparent;
          border-left: 3px solid ${tokens.border};
        }
        .vod-funnel-hover-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          line-height: 1.5;
        }
        .vod-funnel-hover-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
        }
        .vod-funnel-node-explain {
          margin-top: 1rem;
          padding: 14px 18px;
          border-radius: 8px;
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
          transition: opacity 0.3s ease, max-height 0.4s ease;
          overflow: hidden;
        }
        .vod-funnel-node-explain--visible {
          opacity: 1;
          max-height: 300px;
        }
        .vod-funnel-node-explain--hidden {
          opacity: 0;
          max-height: 0;
          padding: 0 18px;
          margin-top: 0;
          border-left-color: transparent;
        }
        .vod-funnel-node-explain-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
        }
        .vod-funnel-node-explain-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          color: ${tokens.text};
        }
        .vod-funnel-node-explain-mode {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${tokens.accent};
          background: var(--accent-dim);
          padding: 2px 6px;
          border-radius: 3px;
        }
        .vod-funnel-node-explain-text {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textMid};
          line-height: 1.6;
          margin: 0;
        }
        .vod-funnel-callout {
          margin-top: 1.5rem;
          padding: 16px 20px;
          background: var(--accent-dim);
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 8px 8px 0;
        }
        .vod-funnel-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 640px) {
          .vod-funnel-node-label { font-size: 0.75rem; }
          .vod-funnel-node { padding: 8px 12px; }
          .vod-funnel-edge-count-number { font-size: 2rem; }
        }
        @media (max-width: 420px) {
          .vod-funnel-diagram { aspect-ratio: 1; }
          .vod-funnel-node-label { font-size: 0.6875rem; }
          .vod-funnel-node { padding: 6px 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vod-funnel-node,
          .vod-funnel-edge,
          .vod-funnel-toggle-thumb,
          .vod-funnel-gate,
          .vod-funnel-lost-edges {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>

      <div
        className="vod-funnel-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="vod-funnel-eyebrow">Information Loss</div>
        <h3 className="vod-funnel-title">What sequential evaluation can't see.</h3>
      </div>

      {/* Toggle */}
      <div
        className="vod-funnel-toggle-wrap"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.2s`,
        }}
      >
        <span
          className={`vod-funnel-toggle-label ${!isActual ? "vod-funnel-toggle-label--active" : ""}`}
          onClick={() => { if (isActual) doToggle(); }}
        >
          Sequential
        </span>
        <div
          className="vod-funnel-toggle-track"
          role="switch"
          aria-checked={isActual}
          tabIndex={0}
          onClick={doToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              doToggle();
            }
          }}
        >
          <div className={`vod-funnel-toggle-thumb ${isActual ? "vod-funnel-toggle-thumb--right" : ""}`} />
        </div>
        <span
          className={`vod-funnel-toggle-label ${isActual ? "vod-funnel-toggle-label--active" : ""}`}
          onClick={() => { if (!isActual) doToggle(); }}
        >
          Actual
        </span>
      </div>

      {/* Diagram area */}
      <div
        className="vod-funnel-diagram"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.3s`,
        }}
      >
        {/* SVG edge layer */}
        <svg className="vod-funnel-svg" viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
          {edges.map((edge, i) => {
            const coords = getEdgeCoords(edge);
            const style = getEdgeStyle(i, edge);
            const key = `${edge.from}-${edge.to}`;
            const isVisible = isActual || edge.sequential;
            return (
              <g key={key}>
                {/* Visible line */}
                <line
                  className="vod-funnel-edge"
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={edgeColors[key] || "var(--border-mid)"}
                  strokeWidth={style.strokeWidth}
                  opacity={style.opacity}
                  style={{ pointerEvents: "none" }}
                />
                {/* Fat invisible hit target */}
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke="transparent"
                  strokeWidth={18}
                  style={{
                    pointerEvents: isVisible ? "stroke" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => {
                    setHoveredEdgeIdx(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredEdgeIdx(null);
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id];
          return (
            <div
              key={node.id}
              className={`vod-funnel-node ${selectedNodeId === node.id ? "vod-funnel-node--selected" : ""}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
              }}
            >
              <span className="vod-funnel-node-label">{node.label}</span>
            </div>
          );
        })}

        {/* Gate markers */}
        {gatePositions.map((pos, i) => (
          <div
            key={i}
            className="vod-funnel-gate"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              opacity: isActual ? 0 : 1,
            }}
          >
            <div className="vod-funnel-gate-diamond" />
            <span className="vod-funnel-gate-label">Gate {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Edge count */}
      <div
        className="vod-funnel-edge-count"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.4s`,
        }}
      >
        <div className="vod-funnel-edge-count-inner">
          <span className="vod-funnel-edge-count-number">{isActual ? 6 : 3}</span>
          <span className="vod-funnel-edge-count-label">
            {isActual ? "bidirectional dependencies" : "visible connections"}
          </span>
        </div>
        <div className="vod-funnel-edge-count-sub">
          {isActual
            ? "All dependencies visible — the full constraint structure"
            : "3 dependencies hidden by sequential ordering"}
        </div>
      </div>

      {/* Lost edges panel */}
      <div
        className={`vod-funnel-lost-edges ${isActual ? "vod-funnel-lost-edges--hidden" : "vod-funnel-lost-edges--visible"}`}
      >
        <div className="vod-funnel-lost-edges-title">Lost in sequential evaluation</div>
        <div className="vod-funnel-lost-edge-list">
          {nonSeqEdges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!;
            const toNode = nodes.find((n) => n.id === edge.to)!;
            return (
              <span key={`${edge.from}-${edge.to}`} className="vod-funnel-lost-edge-chip">
                {fromNode.short} ↔ {toNode.short}
              </span>
            );
          })}
        </div>
      </div>

      {/* Hover detail */}
      <div
        className={`vod-funnel-hover-detail ${hoveredEdgeIdx !== null ? "vod-funnel-hover-detail--active" : "vod-funnel-hover-detail--empty"}`}
      >
        {hoveredEdgeIdx !== null ? (
          <span className="vod-funnel-hover-detail-text">{edges[hoveredEdgeIdx].label}</span>
        ) : (
          <span className="vod-funnel-hover-detail-placeholder">
            {isActual
              ? "Hover an edge to see the bidirectional constraint"
              : "Toggle to see how sequential ordering hides dependencies"}
          </span>
        )}
      </div>

      {/* Node explanation panel */}
      <div
        className={`vod-funnel-node-explain ${selectedNode ? "vod-funnel-node-explain--visible" : "vod-funnel-node-explain--hidden"}`}
      >
        {selectedNode && (
          <>
            <div className="vod-funnel-node-explain-header">
              <span className="vod-funnel-node-explain-name">{selectedNode.label}</span>
              <span className="vod-funnel-node-explain-mode">
                {isActual ? "Actual view" : "Sequential view"}
              </span>
            </div>
            <div className="vod-funnel-node-explain-text">
              {isActual ? selectedNode.actual : selectedNode.seq}
            </div>
          </>
        )}
      </div>

      {/* Callout */}
      <div className="vod-funnel-callout">
        <div className="vod-funnel-callout-text">
          Sequential evaluation sees <strong>{isActual ? "6" : "3"}</strong> forward connections.
          The actual structure has <strong>6</strong> bidirectional dependencies.
          {isActual ? " — nothing is hidden." : " — half the information is invisible."}
        </div>
      </div>
    </div>
  );
}
