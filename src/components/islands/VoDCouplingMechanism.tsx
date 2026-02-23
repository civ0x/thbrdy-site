import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Domain {
  id: string;
  label: string;
  desc: string;
  color: string;
  position: "top" | "right" | "bottom" | "left";
}

const domains: Domain[] = [
  { id: "research", label: "Research Capability", desc: "What the technology can do", color: "var(--teal)", position: "top" },
  { id: "customer", label: "Customer Value", desc: "What problem it solves", color: "var(--green)", position: "right" },
  { id: "business", label: "Business Viability", desc: "Why the company should invest", color: "var(--accent)", position: "bottom" },
  { id: "engineering", label: "Engineering Feasibility", desc: "What it takes to build", color: "var(--blue)", position: "left" },
];

interface Reading {
  role: string;
  interpretation: string;
  color: string;
}

const readings: Reading[] = [
  { role: "Researcher", interpretation: "Translation of my capability", color: "var(--teal)" },
  { role: "Product Lead", interpretation: "Feature proposal", color: "var(--green)" },
  { role: "Executive", interpretation: "Investment case", color: "var(--accent)" },
  { role: "Engineer", interpretation: "System spec", color: "var(--blue)" },
];

interface Constraint {
  fromId: string;
  toId: string;
  label: string;
}

const constraints: Constraint[] = [
  { fromId: "research", toId: "customer", label: "Technical capability determines what customer problems become solvable" },
  { fromId: "research", toId: "engineering", label: "Research approach constrains implementation architecture" },
  { fromId: "research", toId: "business", label: "Novelty determines competitive positioning" },
  { fromId: "customer", toId: "engineering", label: "Customer requirements set performance targets" },
  { fromId: "customer", toId: "business", label: "Market size justifies investment" },
  { fromId: "engineering", toId: "business", label: "Build complexity determines timeline and cost" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// SVG positions for each domain within a 100×100 viewBox
const svgPos: Record<string, { x: number; y: number }> = {
  research: { x: 50, y: 10 },
  customer: { x: 88, y: 50 },
  business: { x: 50, y: 90 },
  engineering: { x: 12, y: 50 },
};

// Simple geometric icon components
function CircleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function DiamondIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="10" y="3" width="10" height="10" rx="1" transform="rotate(45 10 3)" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function SquareIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function TriangleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <polygon points="10,3 18,17 2,17" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

const iconMap: Record<string, typeof CircleIcon> = {
  research: CircleIcon,
  customer: DiamondIcon,
  engineering: SquareIcon,
  business: TriangleIcon,
};

export default function VoDCouplingMechanism() {
  const [ref, inView] = useInView(0.15);
  const [hoveredConstraint, setHoveredConstraint] = useState<number | null>(null);

  return (
    <div ref={ref} className="vod-coupling-root">
      <style>{`
        .vod-coupling-root {
          max-width: 680px;
          margin: 2.5rem auto;
        }
        .vod-coupling-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-coupling-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-coupling-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-coupling-diagram {
          position: relative;
          aspect-ratio: 1;
          max-width: 480px;
          margin: 0 auto 2rem;
        }
        .vod-coupling-doc {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 80px;
          background: ${tokens.bg};
          border: 1px solid ${tokens.borderMid};
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(44, 36, 22, 0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          box-sizing: border-box;
          z-index: 2;
        }
        .vod-coupling-doc-line {
          height: 1px;
          background: ${tokens.border};
          border-radius: 1px;
        }
        .vod-coupling-doc-labels {
          position: absolute;
          left: 50%;
          top: calc(50% + 50px);
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
        }
        .vod-coupling-doc-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-coupling-doc-sub {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin: 2px 0 0;
        }
        .vod-coupling-domain {
          position: absolute;
          width: 120px;
          padding: 8px 12px;
          border-radius: 6px;
          background: ${tokens.bgWarm};
          box-sizing: border-box;
          z-index: 2;
          text-align: center;
        }
        .vod-coupling-domain-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 4px;
        }
        .vod-coupling-domain-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0;
        }
        .vod-coupling-domain-desc {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textMuted};
          margin: 2px 0 0;
        }
        .vod-coupling-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .vod-coupling-readings {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .vod-coupling-reading {
          background: ${tokens.bgWarm};
          border-radius: 8px;
          padding: 12px 16px;
        }
        .vod-coupling-reading-role {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0 0 6px;
        }
        .vod-coupling-reading-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.4;
        }
        .vod-coupling-detail {
          margin-bottom: 1.5rem;
          padding: 12px 16px;
          border-radius: 6px;
          min-height: 48px;
          display: flex;
          align-items: center;
        }
        .vod-coupling-detail--active {
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
        }
        .vod-coupling-detail--placeholder {
          background: transparent;
          border-left: 3px solid ${tokens.border};
        }
        .vod-coupling-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-coupling-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          margin: 0;
        }
        .vod-coupling-callout {
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
        }
        .vod-coupling-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-coupling-mobile-list {
          display: none;
        }
        @media (max-width: 640px) {
          .vod-coupling-diagram {
            max-width: 360px;
          }
          .vod-coupling-domain {
            width: 100px;
            padding: 6px 8px;
          }
          .vod-coupling-domain-label {
            font-size: 0.6875rem;
          }
          .vod-coupling-domain-desc {
            display: none;
          }
          .vod-coupling-readings {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 420px) {
          .vod-coupling-diagram {
            display: none;
          }
          .vod-coupling-mobile-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 1.5rem;
          }
          .vod-coupling-mobile-doc {
            text-align: center;
            padding: 16px;
            background: ${tokens.bg};
            border: 1px solid ${tokens.borderMid};
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(44, 36, 22, 0.06);
            margin-bottom: 8px;
          }
          .vod-coupling-mobile-domain {
            padding: 10px 14px;
            background: ${tokens.bgWarm};
            border-radius: 6px;
          }
          .vod-coupling-mobile-constraints {
            font-family: ${tokens.sans};
            font-size: 0.6875rem;
            color: ${tokens.textMuted};
            margin: 6px 0 0;
            line-height: 1.4;
          }
          .vod-coupling-readings {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="vod-coupling-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-coupling-eyebrow">Boundary Object</p>
        <h3 className="vod-coupling-title">One document. Four readings.</h3>
      </div>

      {/* Spatial diagram (desktop/tablet) */}
      <div className="vod-coupling-diagram">
        {/* SVG edges */}
        <svg className="vod-coupling-svg" viewBox="0 0 100 100">
          {constraints.map((c, i) => {
            const from = svgPos[c.fromId];
            const to = svgPos[c.toId];
            const isHovered = hoveredConstraint === i;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={tokens.borderMid}
                strokeWidth={isHovered ? 2 : 1}
                opacity={inView ? (isHovered ? 1 : 0.4) : 0}
                style={{
                  transition: `opacity 0.5s ${ease} ${0.7 + i * 0.08}s, stroke-width 0.2s`,
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredConstraint(i)}
                onMouseLeave={() => setHoveredConstraint(null)}
              />
            );
          })}
        </svg>

        {/* Central document */}
        <div className="vod-coupling-doc"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.95)",
            transition: `opacity 0.5s ${ease} 0s, transform 0.5s ${ease} 0s`,
          }}
        >
          <div className="vod-coupling-doc-line" style={{ width: "80%" }} />
          <div className="vod-coupling-doc-line" style={{ width: "70%" }} />
          <div className="vod-coupling-doc-line" style={{ width: "85%" }} />
          <div className="vod-coupling-doc-line" style={{ width: "50%" }} />
        </div>
        <div className="vod-coupling-doc-labels"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.5s ${ease} 0.2s`,
          }}
        >
          <p className="vod-coupling-doc-name">PR/FAQ</p>
          <p className="vod-coupling-doc-sub">Boundary Object</p>
        </div>

        {/* Domain cards at cardinal positions */}
        {domains.map((d, i) => {
          const posStyle: Record<string, string> = {};
          if (d.position === "top") {
            posStyle.left = "50%"; posStyle.top = "2%"; posStyle.transform = "translateX(-50%)";
          } else if (d.position === "right") {
            posStyle.left = "88%"; posStyle.top = "50%"; posStyle.transform = "translateY(-50%)";
          } else if (d.position === "bottom") {
            posStyle.left = "50%"; posStyle.top = "88%"; posStyle.transform = "translateX(-50%)";
          } else {
            posStyle.left = "2%"; posStyle.top = "50%"; posStyle.transform = "translateY(-50%)";
          }
          const Icon = iconMap[d.id];
          return (
            <div key={d.id} className="vod-coupling-domain"
              style={{
                ...posStyle,
                borderTop: `3px solid ${d.color}`,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} ${0.3 + i * 0.1}s`,
              }}
            >
              <div className="vod-coupling-domain-icon">
                <Icon color={d.color} />
              </div>
              <p className="vod-coupling-domain-label" style={{ color: d.color }}>{d.label}</p>
              <p className="vod-coupling-domain-desc">{d.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Mobile: linear list */}
      <div className="vod-coupling-mobile-list">
        <div className="vod-coupling-mobile-doc"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.5s ${ease} 0s`,
          }}
        >
          <p className="vod-coupling-doc-name">PR/FAQ</p>
          <p className="vod-coupling-doc-sub">Boundary Object</p>
        </div>
        {domains.map((d, i) => {
          const relatedConstraints = constraints.filter(c => c.fromId === d.id || c.toId === d.id);
          return (
            <div key={d.id} className="vod-coupling-mobile-domain"
              style={{
                borderTop: `3px solid ${d.color}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.5s ${ease} ${0.3 + i * 0.1}s, transform 0.5s ${ease} ${0.3 + i * 0.1}s`,
              }}
            >
              <p className="vod-coupling-domain-label" style={{ color: d.color }}>{d.label}</p>
              <p className="vod-coupling-domain-desc">{d.desc}</p>
              {relatedConstraints.length > 0 && (
                <p className="vod-coupling-mobile-constraints">
                  {relatedConstraints.map(c => c.label).join(" · ")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Hover detail */}
      <div className={`vod-coupling-detail ${hoveredConstraint !== null ? "vod-coupling-detail--active" : "vod-coupling-detail--placeholder"}`}
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ${ease} 1.0s`,
        }}
      >
        {hoveredConstraint !== null ? (
          <p className="vod-coupling-detail-text">{constraints[hoveredConstraint].label}</p>
        ) : (
          <p className="vod-coupling-detail-placeholder">Hover a constraint edge to see the bidirectional dependency</p>
        )}
      </div>

      {/* Interpretation cards */}
      <div className="vod-coupling-readings"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease} 1.2s, transform 0.6s ${ease} 1.2s`,
        }}
      >
        {readings.map((r) => (
          <div key={r.role} className="vod-coupling-reading">
            <p className="vod-coupling-reading-role" style={{ color: r.color }}>{r.role}</p>
            <p className="vod-coupling-reading-text">"{r.interpretation}"</p>
          </div>
        ))}
      </div>

      <div className="vod-coupling-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.6s, transform 0.6s ${ease} 1.6s`,
        }}
      >
        <p className="vod-coupling-callout-text">
          The narrative forces joint articulation. Changing any constraint changes all others.
        </p>
      </div>
    </div>
  );
}
