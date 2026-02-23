import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface OrgPosition {
  id: string;
  name: string;
  abbrev: string;
  x: number;
  y: number;
  color: string;
  descriptor: string;
  detail: string;
  arrow: { dx: number; dy: number; uncertain?: boolean };
}

const orgs: OrgPosition[] = [
  {
    id: "openai",
    name: "OpenAI",
    abbrev: "OAI",
    x: 25,
    y: 82,
    color: "var(--red)",
    descriptor: "Product-dominant",
    detail: "Fully product-dominant. $12B revenue but significant research attrition. Safety processes subordinated to product cadence.",
    arrow: { dx: -8, dy: 6 },
  },
  {
    id: "fair",
    name: "Meta FAIR",
    abbrev: "FAIR",
    x: 78,
    y: 25,
    color: "var(--teal)",
    descriptor: "Separate lab",
    detail: "Extraordinary research output (PyTorch, Llama) but self-acknowledged transition failures. Reorganizing toward integration.",
    arrow: { dx: -10, dy: 10 },
  },
  {
    id: "deepmind",
    name: "Google DeepMind",
    abbrev: "GDM",
    x: 50,
    y: 55,
    color: "var(--text-muted)",
    descriptor: "Forced merger",
    detail: "Forced merger of competing labs. AlphaFold emerged from separation; integration may prevent the next AlphaFold.",
    arrow: { dx: 0, dy: 0, uncertain: true },
  },
  {
    id: "anthropic",
    name: "Anthropic",
    abbrev: "Anth",
    x: 72,
    y: 70,
    color: "var(--accent)",
    descriptor: "Trading zone model",
    detail: "Constitutional AI aligns research with product. Research engineer role creates permanent trading-zone residents.",
    arrow: { dx: 6, dy: 6 },
  },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDTradingZone() {
  const [ref, inView] = useInView(0.15);
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);

  return (
    <div ref={ref} className="vod-trading-root">
      <style>{`
        .vod-trading-root {
          max-width: 640px;
          margin: 2.5rem auto;
        }
        .vod-trading-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-trading-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-trading-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-trading-field-wrap {
          position: relative;
        }
        .vod-trading-field {
          position: relative;
          aspect-ratio: 4 / 3;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 12px;
          overflow: hidden;
        }
        .vod-trading-axis-x {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
        }
        .vod-trading-axis-y {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
          white-space: nowrap;
        }
        .vod-trading-risk-zone {
          position: absolute;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          padding: 10px;
          box-sizing: border-box;
        }
        .vod-trading-risk-zone--tl {
          top: 0;
          left: 0;
          width: 25%;
          height: 30%;
          background: var(--red-dim);
          border-radius: 12px 0 0 0;
          align-items: flex-start;
        }
        .vod-trading-risk-zone--br {
          bottom: 0;
          right: 0;
          width: 25%;
          height: 30%;
          background: var(--red-dim);
          border-radius: 0 0 12px 0;
          align-items: flex-end;
          justify-content: flex-end;
        }
        .vod-trading-risk-label {
          font-family: ${tokens.sans};
          font-size: 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--red);
          margin: 0;
          line-height: 1.3;
        }
        .vod-trading-risk-sub {
          font-family: ${tokens.sans};
          font-size: 0.5rem;
          color: ${tokens.textMuted};
          margin: 2px 0 0;
        }
        .vod-trading-zone-highlight {
          position: absolute;
          left: 58%;
          top: 8%;
          width: 36%;
          height: 38%;
          border: 1.5px dashed rgba(184, 134, 11, 0.25);
          border-radius: 10px;
          box-sizing: border-box;
        }
        .vod-trading-zone-label {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(184, 134, 11, 0.4);
          padding: 8px;
        }
        .vod-trading-org {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 2;
          cursor: pointer;
        }
        .vod-trading-org-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transition: box-shadow 0.2s;
        }
        .vod-trading-org-info {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
        }
        .vod-trading-org-name {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0;
        }
        .vod-trading-org-desc {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
          margin: 1px 0 0;
        }
        .vod-trading-arrow-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        .vod-trading-detail {
          margin-top: 1rem;
          padding: 12px 16px;
          border-radius: 6px;
          min-height: 48px;
          display: flex;
          align-items: center;
        }
        .vod-trading-detail--active {
          background: ${tokens.bgWarm};
          border-left: 3px solid ${tokens.accent};
        }
        .vod-trading-detail--placeholder {
          background: transparent;
          border-left: 3px solid ${tokens.border};
        }
        .vod-trading-detail-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .vod-trading-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.5;
        }
        .vod-trading-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          margin: 0;
        }
        .vod-trading-annotation {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: ${tokens.textLight};
          font-style: italic;
          text-align: center;
          margin-top: 1.5rem;
        }
        .vod-trading-legend {
          display: none;
        }
        @media (max-width: 640px) {
          .vod-trading-org-desc {
            display: none;
          }
          .vod-trading-risk-label {
            font-size: 0.5rem;
          }
          .vod-trading-risk-sub {
            display: none;
          }
        }
        @media (max-width: 420px) {
          .vod-trading-org-info {
            display: none;
          }
          .vod-trading-legend {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 12px;
          }
          .vod-trading-legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: ${tokens.bgWarm};
            border-radius: 6px;
            cursor: pointer;
          }
          .vod-trading-legend-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          .vod-trading-legend-name {
            font-family: ${tokens.sans};
            font-size: 0.75rem;
            font-weight: 600;
            margin: 0;
          }
          .vod-trading-legend-desc {
            font-family: ${tokens.sans};
            font-size: 0.625rem;
            color: ${tokens.textFaint};
            margin: 0;
          }
        }
      `}</style>

      <div className="vod-trading-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-trading-eyebrow">Organizational Landscape</p>
        <h3 className="vod-trading-title">Where the AI labs are heading.</h3>
      </div>

      <div className="vod-trading-field-wrap">
        <div className="vod-trading-field"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.6s ${ease} 0s`,
          }}
        >
          {/* Axes */}
          <span className="vod-trading-axis-x"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ${ease} 0.2s` }}
          >Research Autonomy →</span>
          <span className="vod-trading-axis-y"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ${ease} 0.2s` }}
          >Product Integration ↑</span>

          {/* Risk zones */}
          <div className="vod-trading-risk-zone vod-trading-risk-zone--tl"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ${ease} 0.4s` }}
          >
            <p className="vod-trading-risk-label">Premature Legibility</p>
            <p className="vod-trading-risk-sub">(Watson Health)</p>
          </div>
          <div className="vod-trading-risk-zone vod-trading-risk-zone--br"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ${ease} 0.5s` }}
          >
            <p className="vod-trading-risk-label">Failed Transition</p>
            <p className="vod-trading-risk-sub">(PARC, FAIR)</p>
          </div>

          {/* Trading zone highlight */}
          <div className="vod-trading-zone-highlight"
            style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${ease} 1.2s` }}
          >
            <span className="vod-trading-zone-label">Trading Zone</span>
          </div>

          {/* Trajectory arrows SVG */}
          <svg className="vod-trading-arrow-svg" viewBox="0 0 100 75" preserveAspectRatio="none">
            {orgs.map((org, i) => {
              const cx = org.x;
              const cy = 100 - org.y; // invert Y for CSS top
              // Scale to 75-height viewBox
              const cySvg = cy * 0.75;
              const arrowLen = 2.5;
              const mag = Math.sqrt(org.arrow.dx ** 2 + org.arrow.dy ** 2) || 1;
              const ndx = org.arrow.dx / mag;
              // Invert dy for SVG (positive dy in data = upward = negative in SVG)
              const ndy = -org.arrow.dy / mag;
              const endX = cx + ndx * arrowLen;
              const endY = cySvg + ndy * arrowLen;

              if (org.arrow.uncertain) {
                return (
                  <text
                    key={org.id}
                    x={cx + 2}
                    y={cySvg - 1.5}
                    fontSize="3"
                    fontFamily={tokens.sans}
                    fill={org.color}
                    opacity={inView ? 0.7 : 0}
                    style={{ transition: `opacity 0.5s ${ease} ${1.0 + i * 0.15}s` }}
                  >?</text>
                );
              }

              return (
                <g key={org.id}
                  opacity={inView ? 0.7 : 0}
                  style={{ transition: `opacity 0.5s ${ease} ${1.0 + i * 0.15}s` }}
                >
                  <line
                    x1={cx} y1={cySvg}
                    x2={endX} y2={endY}
                    stroke={org.color}
                    strokeWidth="0.4"
                  />
                  {/* Arrowhead */}
                  <circle cx={endX} cy={endY} r="0.5" fill={org.color} />
                </g>
              );
            })}
          </svg>

          {/* Organization dots + labels */}
          {orgs.map((org, i) => {
            const cssTop = 100 - org.y;
            const isHovered = hoveredOrg === org.id;
            // Position label to left for orgs on the right side
            const labelOnLeft = org.x > 60;
            return (
              <div
                key={org.id}
                className="vod-trading-org"
                style={{
                  left: `${org.x}%`,
                  top: `${cssTop}%`,
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.5s ${ease} ${0.5 + i * 0.15}s`,
                }}
                onMouseEnter={() => setHoveredOrg(org.id)}
                onMouseLeave={() => setHoveredOrg(null)}
              >
                <div className="vod-trading-org-dot"
                  style={{
                    background: org.color,
                    boxShadow: isHovered ? `0 0 0 4px color-mix(in srgb, ${org.color} 25%, transparent)` : "none",
                  }}
                />
                <div className="vod-trading-org-info"
                  style={labelOnLeft ? {
                    left: "auto",
                    right: "18px",
                    textAlign: "right",
                  } : undefined}
                >
                  <p className="vod-trading-org-name" style={{ color: org.color }}>{org.name}</p>
                  <p className="vod-trading-org-desc">{org.descriptor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile legend */}
      <div className="vod-trading-legend">
        {orgs.map((org) => (
          <div
            key={org.id}
            className="vod-trading-legend-item"
            onClick={() => setHoveredOrg(hoveredOrg === org.id ? null : org.id)}
          >
            <div className="vod-trading-legend-dot" style={{ background: org.color }} />
            <div>
              <p className="vod-trading-legend-name" style={{ color: org.color }}>{org.name}</p>
              <p className="vod-trading-legend-desc">{org.descriptor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hover detail */}
      <div className={`vod-trading-detail ${hoveredOrg ? "vod-trading-detail--active" : "vod-trading-detail--placeholder"}`}
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ${ease} 1.0s`,
        }}
      >
        {hoveredOrg ? (() => {
          const org = orgs.find(o => o.id === hoveredOrg)!;
          return (
            <div>
              <p className="vod-trading-detail-name" style={{ color: org.color }}>{org.name}</p>
              <p className="vod-trading-detail-text">{org.detail}</p>
            </div>
          );
        })() : (
          <p className="vod-trading-detail-placeholder">Hover an organization to see its trajectory</p>
        )}
      </div>

      <p className="vod-trading-annotation"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.5s, transform 0.6s ${ease} 1.5s`,
        }}
      >
        "The research engineer role creates permanent residents of the trading zone."
      </p>
    </div>
  );
}
