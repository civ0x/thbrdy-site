import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Zone {
  id: string;
  label: string;
  strategy: string;
  description: string;
  examples: string[];
  color: string;
  colorDim: string;
}

const zones: Zone[] = [
  {
    id: "protection",
    label: "Protected Exploration",
    strategy: "Separation is optimal",
    description: "Commercial evaluation destroys optionality before the research is mature enough to survive it.",
    examples: ["Deep learning 1997–2012", "Xerox PARC", "Early-stage pharma"],
    color: "var(--teal)",
    colorDim: "var(--teal-dim)",
  },
  {
    id: "integration",
    label: "Structured Translation",
    strategy: "Integration is optimal",
    description: "Continued separation wastes mature capability that is ready for product evaluation.",
    examples: ["Neptune ML", "AstraZeneca 5R", "Goldwater-Nichols"],
    color: "var(--accent)",
    colorDim: "var(--accent-dim)",
  },
];

interface Risk {
  label: string;
  examples: string[];
  side: "left" | "right";
}

const risks: Risk[] = [
  {
    label: "Premature legibility",
    examples: ["Watson Health ($5B destroyed)", "Cleantech 1.0 ($25B lost)", "AI Winter"],
    side: "left",
  },
  {
    label: "Failed transition",
    examples: ["PARC's GUI → Apple", "FAIR world models", "Zombie research labs"],
    side: "right",
  },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDMaturitySwitch() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="vod-maturity-root">
      <style>{`
        .vod-maturity-root {
          max-width: 720px;
          margin: 2.5rem auto;
        }
        .vod-maturity-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-maturity-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-maturity-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-maturity-bar-section {
          position: relative;
          margin-bottom: 2rem;
        }
        .vod-maturity-risk-top {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 12px;
        }
        .vod-maturity-risk-bottom {
          display: flex;
          justify-content: flex-end;
          margin-top: 12px;
        }
        .vod-maturity-risk {
          max-width: 240px;
          padding: 10px 14px;
          background: var(--red-dim);
          border-left: 3px solid var(--red);
          border-radius: 0 8px 8px 0;
        }
        .vod-maturity-risk-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--red);
          margin: 0 0 4px;
        }
        .vod-maturity-risk-examples {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
          margin: 0;
          line-height: 1.4;
        }
        .vod-maturity-switch-label {
          text-align: center;
          margin-bottom: 6px;
        }
        .vod-maturity-switch-text {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
        }
        .vod-maturity-bar-wrap {
          position: relative;
        }
        .vod-maturity-bar {
          width: 100%;
          height: 56px;
          border-radius: 10px;
          background: linear-gradient(
            to right,
            rgba(42, 122, 106, 0.06) 0%,
            rgba(42, 122, 106, 0.06) 30%,
            rgba(42, 122, 106, 0.03) 40%,
            rgba(184, 134, 11, 0.03) 60%,
            rgba(184, 134, 11, 0.06) 70%,
            rgba(184, 134, 11, 0.06) 100%
          );
          border: 1px solid ${tokens.border};
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          box-sizing: border-box;
        }
        .vod-maturity-bar-zone {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .vod-maturity-bar-zone--left {
          color: var(--teal);
        }
        .vod-maturity-bar-zone--right {
          color: var(--accent);
        }
        .vod-maturity-dashed-line {
          position: absolute;
          left: 50%;
          top: -24px;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
        }
        .vod-maturity-axis {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
          text-align: right;
          margin-top: 6px;
        }
        .vod-maturity-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 2rem;
        }
        .vod-maturity-card {
          padding: 16px 18px;
          border-radius: 8px;
        }
        .vod-maturity-card--protection {
          background: var(--teal-dim);
          border: 1px solid rgba(42, 122, 106, 0.3);
        }
        .vod-maturity-card--integration {
          background: var(--accent-dim);
          border: 1px solid rgba(184, 134, 11, 0.3);
        }
        .vod-maturity-card-strategy {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          margin: 0 0 8px;
        }
        .vod-maturity-card-desc {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .vod-maturity-card-examples {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: ${tokens.textMuted};
          margin: 0;
        }
        .vod-maturity-annotation {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textLight};
          font-style: italic;
          text-align: center;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.5;
        }
        @media (max-width: 640px) {
          .vod-maturity-cards {
            grid-template-columns: 1fr;
          }
          .vod-maturity-risk-top {
            justify-content: center;
          }
          .vod-maturity-risk-bottom {
            justify-content: center;
          }
        }
        @media (max-width: 420px) {
          .vod-maturity-bar {
            height: 40px;
          }
          .vod-maturity-bar-zone {
            display: none;
          }
          .vod-maturity-risk {
            max-width: 100%;
            padding: 8px 10px;
          }
          .vod-maturity-risk-label {
            font-size: 0.6875rem;
          }
          .vod-maturity-risk-examples {
            font-size: 0.625rem;
          }
        }
      `}</style>

      <div className="vod-maturity-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <p className="vod-maturity-eyebrow">Maturity Threshold</p>
        <h3 className="vod-maturity-title">When to protect. When to integrate.</h3>
      </div>

      <div className="vod-maturity-bar-section">
        {/* Risk callout — top left */}
        <div className="vod-maturity-risk-top"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 0.6s ${ease} 1.2s, transform 0.6s ${ease} 1.2s`,
          }}
        >
          <div className="vod-maturity-risk">
            <p className="vod-maturity-risk-label">{risks[0].label}</p>
            <p className="vod-maturity-risk-examples">{risks[0].examples.join(" · ")}</p>
          </div>
        </div>

        {/* Switching point label */}
        <div className="vod-maturity-switch-label"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.6s ${ease} 0.6s`,
          }}
        >
          <span className="vod-maturity-switch-text">The Switching Point</span>
        </div>

        {/* Bar */}
        <div className="vod-maturity-bar-wrap">
          <div className="vod-maturity-bar"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.6s ${ease} 0s`,
            }}
          >
            <span className="vod-maturity-bar-zone vod-maturity-bar-zone--left"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} 0.4s`,
              }}
            >Protected Exploration</span>
            <span className="vod-maturity-bar-zone vod-maturity-bar-zone--right"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} 0.4s`,
              }}
            >Structured Translation</span>
          </div>
          {/* Dashed center line */}
          <svg className="vod-maturity-dashed-line"
            style={{
              opacity: inView ? 0.5 : 0,
              transition: `opacity 0.6s ${ease} 0.7s`,
            }}
          >
            <line x1="0" y1="0" x2="0" y2="100%" stroke={tokens.textFaint} strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        </div>

        {/* Axis label */}
        <div className="vod-maturity-axis"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.4s ${ease} 0.5s`,
          }}
        >Research Maturity →</div>

        {/* Risk callout — bottom right */}
        <div className="vod-maturity-risk-bottom"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 0.6s ${ease} 1.35s, transform 0.6s ${ease} 1.35s`,
          }}
        >
          <div className="vod-maturity-risk">
            <p className="vod-maturity-risk-label">{risks[1].label}</p>
            <p className="vod-maturity-risk-examples">{risks[1].examples.join(" · ")}</p>
          </div>
        </div>
      </div>

      {/* Zone cards */}
      <div className="vod-maturity-cards">
        {zones.map((zone, i) => (
          <div key={zone.id}
            className={`vod-maturity-card vod-maturity-card--${zone.id}`}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 0.6s ${ease} ${0.8 + i * 0.15}s, transform 0.6s ${ease} ${0.8 + i * 0.15}s`,
            }}
          >
            <p className="vod-maturity-card-strategy" style={{ color: zone.color }}>{zone.strategy}</p>
            <p className="vod-maturity-card-desc">{zone.description}</p>
            <p className="vod-maturity-card-examples">{zone.examples.join(" · ")}</p>
          </div>
        ))}
      </div>

      <p className="vod-maturity-annotation"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.6s, transform 0.6s ${ease} 1.6s`,
        }}
      >
        "No empirical framework identifies when to switch. This is the hardest open question."
      </p>
    </div>
  );
}
