import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Org {
  id: string;
  name: string;
  model: string;
  position: number;
  color: string;
  detail: string;
  trajectory: string;
  pipSub: string;
}

const orgs: Org[] = [
  {
    id: "openai",
    name: "OpenAI",
    model: "Product-Dominant",
    position: 12,
    color: "var(--red)",
    detail: "$12B revenue but significant research attrition. Safety processes subordinated to product cadence. GPT-4o safety team got one week.",
    trajectory: "↙ More product",
    pipSub: "Product capture",
  },
  {
    id: "deepmind",
    name: "DeepMind",
    model: "Forced Merger",
    position: 40,
    color: tokens.textMuted,
    detail: "Eliminated the autonomy buffer that produced AlphaFold. Whether this was wise depends on what you're optimizing for.",
    trajectory: "? Uncertain",
    pipSub: "Forced merger",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    model: "Trading Zone Model",
    position: 62,
    color: tokens.accent,
    detail: "Constitutional AI aligns research with product. The research engineer role creates permanent residents of the trading zone between research and product.",
    trajectory: "↗ Dual track",
    pipSub: "Trading zone",
  },
  {
    id: "fair",
    name: "Meta FAIR",
    model: "Separate Lab",
    position: 88,
    color: "var(--teal)",
    detail: 'Extraordinary research (PyTorch, Llama) but self-acknowledged transition failures. LeCun: "Where Meta was less successful is in pushing research into products."',
    trajectory: "↙ Toward integration",
    pipSub: "Separate lab",
  },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDTradingZone() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="vod-trading-root">
      <style>{`
        .vod-trading-root {
          max-width: 720px;
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

        /* Spectrum */
        .vod-trading-spectrum {
          position: relative;
          margin: 0 0 2.5rem;
          padding: 0 20px;
        }
        .vod-trading-spectrum-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .vod-trading-spectrum-label {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
        }
        .vod-trading-spectrum-axis {
          position: relative;
          height: 4px;
          background: linear-gradient(
            to right,
            rgba(166, 61, 47, 0.25),
            ${tokens.border} 25%,
            ${tokens.accentGlow} 50%,
            ${tokens.border} 75%,
            rgba(166, 61, 47, 0.25)
          );
          border-radius: 2px;
          margin: 80px 0 60px;
        }
        .vod-trading-spectrum-risks {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }
        .vod-trading-spectrum-risk {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--red);
          max-width: 140px;
          line-height: 1.3;
        }
        .vod-trading-spectrum-risk--right {
          text-align: right;
        }

        /* Org markers on axis */
        .vod-trading-org-marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          cursor: pointer;
        }
        .vod-trading-org-marker:hover .vod-trading-org-dot {
          transform: scale(1.3);
        }
        .vod-trading-org-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid ${tokens.bg};
          box-shadow: 0 1px 6px rgba(44, 36, 22, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .vod-trading-org-pip {
          position: absolute;
          top: -42px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          white-space: nowrap;
        }
        .vod-trading-org-pip-name {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 700;
        }
        .vod-trading-org-pip-sub {
          font-family: ${tokens.sans};
          font-size: 0.5625rem;
          color: ${tokens.textFaint};
        }

        /* Trading zone highlight */
        .vod-trading-zone-marker {
          position: absolute;
          top: -16px;
          bottom: -16px;
          border: 1.5px dashed rgba(184, 134, 11, 0.3);
          border-radius: 8px;
          background: rgba(184, 134, 11, 0.04);
        }
        .vod-trading-zone-label {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(184, 134, 11, 0.5);
          white-space: nowrap;
        }

        /* Org detail cards */
        .vod-trading-org-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 2rem;
        }
        .vod-trading-org-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: start;
          padding: 14px 18px;
          border-radius: 8px;
          background: ${tokens.bgWarm};
          border-left: 3px solid transparent;
          transition: background 0.25s ease;
        }
        .vod-trading-org-card:hover {
          background: ${tokens.bgCard};
        }
        .vod-trading-org-card-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }
        .vod-trading-org-card-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .vod-trading-org-card-model {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 4px;
        }
        .vod-trading-org-card-text {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textMid};
          line-height: 1.5;
        }
        .vod-trading-org-card-trajectory {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 500;
          color: ${tokens.textFaint};
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        /* Callout + annotation */
        .vod-trading-callout {
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
          margin-bottom: 1.5rem;
        }
        .vod-trading-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        .vod-trading-annotation {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textLight};
          font-style: italic;
          text-align: center;
          line-height: 1.5;
        }

        @media (max-width: 560px) {
          .vod-trading-org-card {
            grid-template-columns: auto 1fr;
          }
          .vod-trading-org-card-trajectory {
            display: none;
          }
          .vod-trading-spectrum {
            padding: 0 10px;
          }
          .vod-trading-org-pip-name {
            font-size: 0.6875rem;
          }
          .vod-trading-org-pip-sub {
            display: none;
          }
          .vod-trading-spectrum-risk {
            font-size: 0.5rem;
            max-width: 100px;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="vod-trading-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="vod-trading-eyebrow">Organizational Landscape</div>
        <h3 className="vod-trading-title">Four models. One open question.</h3>
      </div>

      {/* Spectrum */}
      <div
        className="vod-trading-spectrum"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0s`,
        }}
      >
        <div className="vod-trading-spectrum-labels">
          <span className="vod-trading-spectrum-label">← Product-Dominant</span>
          <span className="vod-trading-spectrum-label">Research-Autonomous →</span>
        </div>

        <div className="vod-trading-spectrum-axis">
          {/* Trading zone region */}
          <div
            className="vod-trading-zone-marker"
            style={{
              left: "50%",
              right: "15%",
              opacity: inView ? 1 : 0,
              transition: `opacity 0.6s ${ease} 0.9s`,
            }}
          >
            <span className="vod-trading-zone-label">Trading Zone</span>
          </div>

          {/* Org markers */}
          {orgs.map((org, i) => (
            <div
              key={org.id}
              className="vod-trading-org-marker"
              style={{
                left: `${org.position}%`,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} ${0.4 + i * 0.15}s`,
              }}
            >
              <div className="vod-trading-org-pip">
                <div className="vod-trading-org-pip-name" style={{ color: org.color }}>
                  {org.name}
                </div>
                <div className="vod-trading-org-pip-sub">{org.pipSub}</div>
              </div>
              <div
                className="vod-trading-org-dot"
                style={{
                  background: org.color,
                  ...(org.id === "anthropic"
                    ? { boxShadow: `0 0 0 4px rgba(184, 134, 11, 0.15), 0 1px 6px rgba(44, 36, 22, 0.1)` }
                    : {}),
                }}
              />
            </div>
          ))}
        </div>

        <div className="vod-trading-spectrum-risks">
          <span className="vod-trading-spectrum-risk">Premature legibility (Watson Health)</span>
          <span className="vod-trading-spectrum-risk vod-trading-spectrum-risk--right">
            Failed transition (PARC, FAIR world models)
          </span>
        </div>
      </div>

      {/* Org detail cards */}
      <div className="vod-trading-org-cards">
        {orgs.map((org, i) => (
          <div
            key={org.id}
            className="vod-trading-org-card"
            style={{
              borderLeftColor: org.color,
              ...(org.id === "anthropic" ? { background: "rgba(184, 134, 11, 0.04)" } : {}),
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.5s ${ease} ${1.0 + i * 0.12}s, transform 0.5s ${ease} ${1.0 + i * 0.12}s, background 0.25s ease`,
            }}
          >
            <div className="vod-trading-org-card-dot" style={{ background: org.color }} />
            <div>
              <div className="vod-trading-org-card-name" style={{ color: org.color }}>{org.name}</div>
              <div className="vod-trading-org-card-model">{org.model}</div>
              <div className="vod-trading-org-card-text">{org.detail}</div>
            </div>
            <div className="vod-trading-org-card-trajectory">
              {org.trajectory}
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div
        className="vod-trading-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.6s, transform 0.6s ${ease} 1.6s`,
        }}
      >
        <div className="vod-trading-callout-text">
          The research engineer role — deliberately blurring the researcher/engineer divide — may be
          the most consequential organizational innovation. It's the individual-level version of what
          Goldwater-Nichols did at the institutional level.
        </div>
      </div>

      {/* Annotation */}
      <div
        className="vod-trading-annotation"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 2.0s, transform 0.6s ${ease} 2.0s`,
        }}
      >
        "The research engineer role creates permanent residents of the trading zone."
      </div>
    </div>
  );
}
