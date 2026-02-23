import { useState, Fragment } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface TrackNode {
  label: string;
  desc: string;
}

const researchTrack: TrackNode[] = [
  { label: "Novel Algorithm", desc: "Technical breakthrough" },
  { label: "Benchmark SOTA", desc: "Competitive performance" },
  { label: "Publication", desc: "Peer recognition" },
  { label: "Citations", desc: "Field influence" },
];

const productTrack: TrackNode[] = [
  { label: "Customer Need", desc: "Problem worth solving" },
  { label: "Competitive Advantage", desc: "Defensible position" },
  { label: "Build Cost", desc: "Engineering investment" },
  { label: "Revenue Model", desc: "Business sustainability" },
];

interface Bridge {
  researchIdx: number;
  productIdx: number;
  label: string;
}

const bridges: Bridge[] = [
  { researchIdx: 0, productIdx: 0, label: "Enables solution to..." },
  { researchIdx: 1, productIdx: 1, label: "Translates to..." },
  { researchIdx: 2, productIdx: 2, label: "Implies architecture that costs..." },
  { researchIdx: 3, productIdx: 3, label: "Signals market for..." },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const connectorHeight = 20;
const nodeGap = 12;

export default function VoDLegibilityGap() {
  const [ref, inView] = useInView(0.15);
  const [hoveredBridge, setHoveredBridge] = useState<number | null>(null);

  return (
    <div ref={ref} className="vod-legibility-root">
      <style>{`
        .vod-legibility-root {
          max-width: 680px;
          margin: 2.5rem auto;
        }
        .vod-legibility-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-legibility-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-legibility-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-legibility-grid {
          display: grid;
          grid-template-columns: 240px 1fr 240px;
          max-width: 640px;
          margin: 0 auto;
        }
        .vod-legibility-col-label {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          text-align: center;
          padding-bottom: 1rem;
        }
        .vod-legibility-node {
          min-height: 54px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          width: 100%;
          padding: 10px 14px;
          border-radius: 6px;
          box-sizing: border-box;
        }
        .vod-legibility-node--research {
          background: var(--teal-dim);
          border: 1px solid rgba(42, 122, 106, 0.3);
        }
        .vod-legibility-node--product {
          background: var(--accent-dim);
          border: 1px solid rgba(184, 134, 11, 0.3);
        }
        .vod-legibility-node-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-legibility-node-desc {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
          margin: 2px 0 0;
        }
        .vod-legibility-connector-cell {
          display: flex;
          justify-content: center;
        }
        .vod-legibility-connector {
          width: 1px;
          height: ${connectorHeight}px;
          background: ${tokens.border};
          margin: ${nodeGap / 2}px 0;
        }
        .vod-legibility-bridge-cell {
          display: flex;
          align-items: center;
          position: relative;
          padding: 0 8px;
          cursor: pointer;
        }
        .vod-legibility-bridge-line {
          width: 100%;
          border-top: 1.5px dashed ${tokens.accent};
        }
        .vod-legibility-tooltip {
          position: absolute;
          left: 50%;
          top: 50%;
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMid};
          background: ${tokens.bgWarm};
          padding: 4px 10px;
          border-radius: 4px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          pointer-events: none;
          box-shadow: 0 1px 4px rgba(44, 36, 22, 0.08);
        }
        .vod-legibility-annotation {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textLight};
          font-style: italic;
          text-align: center;
          max-width: 440px;
          margin: 3.5rem auto 1rem;
          line-height: 1.5;
        }
        .vod-legibility-mobile {
          display: none;
        }
        @media (max-width: 640px) {
          .vod-legibility-grid {
            grid-template-columns: 180px 1fr 180px;
          }
        }
        @media (max-width: 420px) {
          .vod-legibility-grid {
            display: none;
          }
          .vod-legibility-mobile {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .vod-legibility-pair {
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid ${tokens.border};
          }
          .vod-legibility-pair-row {
            display: flex;
          }
          .vod-legibility-pair-left {
            flex: 1;
            padding: 10px 12px;
            background: var(--teal-dim);
            border-left: 3px solid var(--teal);
          }
          .vod-legibility-pair-right {
            flex: 1;
            padding: 10px 12px;
            background: var(--accent-dim);
            border-right: 3px solid var(--accent);
          }
          .vod-legibility-pair-arrow {
            display: flex;
            align-items: center;
            padding: 0 6px;
            color: ${tokens.textFaint};
            font-size: 1rem;
          }
          .vod-legibility-pair-bridge {
            font-family: ${tokens.sans};
            font-size: 0.6875rem;
            color: ${tokens.textMuted};
            font-style: italic;
            padding: 6px 12px;
            background: ${tokens.bgWarm};
            border-top: 1px solid ${tokens.border};
          }
        }
      `}</style>

      <div className="vod-legibility-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-legibility-eyebrow">Legibility Gap</p>
        <h3 className="vod-legibility-title">Two vocabularies. One reality.</h3>
      </div>

      {/* Desktop/Tablet: CSS Grid with inline bridges */}
      <div className="vod-legibility-grid">
        <div className="vod-legibility-col-label"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.4s ${ease} 0s`,
          }}
        >Research</div>
        <div />
        <div className="vod-legibility-col-label"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.4s ${ease} 0.2s`,
          }}
        >Product</div>

        {researchTrack.map((node, i) => (
          <Fragment key={i}>
            <div className="vod-legibility-node vod-legibility-node--research"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.6s ${ease} ${i * 0.12}s, transform 0.6s ${ease} ${i * 0.12}s`,
              }}
            >
              <p className="vod-legibility-node-label">{node.label}</p>
              <p className="vod-legibility-node-desc">{node.desc}</p>
            </div>

            <div className="vod-legibility-bridge-cell"
              onMouseEnter={() => setHoveredBridge(i)}
              onMouseLeave={() => setHoveredBridge(null)}
              style={{
                opacity: inView ? (hoveredBridge === i ? 1 : 0.6) : 0,
                transition: `opacity 0.6s ${ease} ${0.9 + i * 0.1}s`,
              }}
            >
              <div className="vod-legibility-bridge-line" />
              {hoveredBridge === i && (
                <div className="vod-legibility-tooltip">
                  {bridges[i].label}
                </div>
              )}
            </div>

            <div className="vod-legibility-node vod-legibility-node--product"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.6s ${ease} ${0.2 + i * 0.12}s, transform 0.6s ${ease} ${0.2 + i * 0.12}s`,
              }}
            >
              <p className="vod-legibility-node-label">{productTrack[i].label}</p>
              <p className="vod-legibility-node-desc">{productTrack[i].desc}</p>
            </div>

            {i < researchTrack.length - 1 && (
              <>
                <div className="vod-legibility-connector-cell">
                  <div className="vod-legibility-connector"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ${ease} 0.5s`,
                    }}
                  />
                </div>
                <div />
                <div className="vod-legibility-connector-cell">
                  <div className="vod-legibility-connector"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ${ease} 0.5s`,
                    }}
                  />
                </div>
              </>
            )}
          </Fragment>
        ))}
      </div>

      {/* Mobile: stacked pair cards */}
      <div className="vod-legibility-mobile">
        {bridges.map((b, i) => (
          <div key={i} className="vod-legibility-pair"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.6s ${ease} ${i * 0.12}s, transform 0.6s ${ease} ${i * 0.12}s`,
            }}
          >
            <div className="vod-legibility-pair-row">
              <div className="vod-legibility-pair-left">
                <p className="vod-legibility-node-label">{researchTrack[b.researchIdx].label}</p>
                <p className="vod-legibility-node-desc">{researchTrack[b.researchIdx].desc}</p>
              </div>
              <div className="vod-legibility-pair-arrow">→</div>
              <div className="vod-legibility-pair-right">
                <p className="vod-legibility-node-label">{productTrack[b.productIdx].label}</p>
                <p className="vod-legibility-node-desc">{productTrack[b.productIdx].desc}</p>
              </div>
            </div>
            <div className="vod-legibility-pair-bridge">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="vod-legibility-annotation"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.6s, transform 0.6s ${ease} 1.6s`,
        }}
      >
        "The bridges exist but are not expressed in either vocabulary."
      </div>
    </div>
  );
}
