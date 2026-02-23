import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface EvidenceNode {
  title: string;
  detail: string;
}

interface EvidenceTier {
  label: string;
  color: string;
  colorDim: string;
  style: "solid" | "outlined" | "ghost";
  nodes: EvidenceNode[];
}

const tiers: EvidenceTier[] = [
  {
    label: "Well-Established",
    color: "var(--green)",
    colorDim: "var(--green-dim)",
    style: "solid",
    nodes: [
      {
        title: "Palumbo et al. 2017",
        detail: "Systematic review, 52 studies: physiological linkage across HR, SC, respiration, HRV in diverse dyads",
      },
      {
        title: "Feldman 2007",
        detail: "Bio-behavioral synchrony: parent-infant heart rhythm synchronization during interaction",
      },
      {
        title: "Goldstein et al. 2017",
        detail: "Touch increases respiratory and cardiac coupling between romantic partners",
      },
      {
        title: "Lehrer & Gevirtz 2014",
        detail: "HRV biofeedback meta-analysis: Hedges\u2019 g = 0.83 for stress/anxiety reduction",
      },
    ],
  },
  {
    label: "Promising but Limited",
    color: "var(--accent)",
    colorDim: "var(--accent-dim)",
    style: "outlined",
    nodes: [
      {
        title: "Frey et al. 2018 (Breeze)",
        detail: "Wearable breathing biofeedback sharing between dyads, n=21",
      },
      {
        title: "B\u00F6gels et al. 2022",
        detail: "Bidirectional physiological feedback > unidirectional for synchrony",
      },
      {
        title: "J\u00E4rvel\u00E4 et al.",
        detail: "VR + shared physiological signals \u2192 enhanced empathy and social presence",
      },
      {
        title: "Kleinbub et al. 2020",
        detail: "Proposed interpersonal biofeedback for psychotherapy (not yet deployed)",
      },
    ],
  },
  {
    label: "Missing",
    color: "var(--red)",
    colorDim: "var(--red-dim)",
    style: "ghost",
    nodes: [
      {
        title: "Sham-controlled trial",
        detail: "Technology-mediated co-regulation vs. sham feedback",
      },
      {
        title: "Clinical outcomes",
        detail: "Validated instruments measuring mediated co-regulation benefit",
      },
    ],
  },
];

function nodeStyle(tier: EvidenceTier): React.CSSProperties {
  if (tier.style === "solid") {
    return {
      background: "var(--bg)",
      border: "1px solid var(--border-mid)",
    };
  }
  if (tier.style === "outlined") {
    return {
      background: "var(--bg)",
      border: "1px solid var(--border)",
    };
  }
  return {
    background: "transparent",
    border: "1px dashed rgba(166, 61, 47, 0.3)",
  };
}

export default function CoRegEvidenceMap() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="coreg-evidence">
      <style>{`
        .coreg-evidence {
          margin: 2.5rem 0;
        }
        .coreg-evidence-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .coreg-evidence-header {
          padding: 1.5rem 2rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .coreg-evidence-header h4 {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin: 0;
        }
        .coreg-evidence-tiers {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .coreg-evidence-tier {
          display: flex;
          padding: 1.2rem 2rem;
          gap: 1.2rem;
          border-bottom: 1px solid var(--border);
        }
        .coreg-evidence-tier:last-child {
          border-bottom: none;
        }
        .coreg-evidence-tier-label {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          writing-mode: vertical-lr;
          transform: rotate(180deg);
          white-space: nowrap;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60px;
          padding: 0.5rem 0;
        }
        .coreg-evidence-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          flex: 1;
          min-width: 0;
        }
        .coreg-evidence-node {
          border-radius: 5px;
          padding: 0.6rem 0.8rem;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 0;
        }
        .coreg-evidence-node-title {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          font-weight: 600;
          color: ${tokens.textMid};
          margin-bottom: 0.2rem;
          line-height: 1.3;
        }
        .coreg-evidence-node--ghost .coreg-evidence-node-title {
          color: var(--red);
          opacity: 0.7;
        }
        .coreg-evidence-node-detail {
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          color: ${tokens.textLight};
          line-height: 1.4;
        }
        .coreg-evidence-node--ghost .coreg-evidence-node-detail {
          color: var(--red);
          opacity: 0.5;
        }
        .coreg-evidence-footer {
          padding: 0.8rem 2rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .coreg-evidence-footer p {
          font-family: ${tokens.sans};
          font-size: 0.78rem;
          color: ${tokens.textLight};
          margin: 0;
        }
        @media (max-width: 640px) {
          .coreg-evidence-tier {
            flex-direction: column;
            padding: 1rem 1rem;
            gap: 0.6rem;
          }
          .coreg-evidence-tier-label {
            writing-mode: horizontal-tb;
            transform: none;
            min-height: unset;
            padding: 0;
            justify-content: flex-start;
          }
          .coreg-evidence-header {
            padding: 1rem 1rem 0.75rem;
          }
          .coreg-evidence-footer {
            padding: 0.6rem 1rem;
          }
          .coreg-evidence-node {
            max-width: none;
          }
        }
        @media (max-width: 420px) {
          .coreg-evidence-nodes {
            flex-direction: column;
          }
          .coreg-evidence-node {
            flex: 1 1 auto;
          }
        }
      `}</style>

      <div
        className="coreg-evidence-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="coreg-evidence-header">
          <h4>Evidence gradient for technology-mediated co-regulation</h4>
        </div>

        <div className="coreg-evidence-tiers">
          {tiers.map((tier, ti) => (
            <div
              key={tier.label}
              className="coreg-evidence-tier"
              style={{
                background: tier.colorDim,
                borderLeft: `3px solid ${tier.color}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${ti * 0.15}s`,
              }}
            >
              <div
                className="coreg-evidence-tier-label"
                style={{ color: tier.color }}
              >
                {tier.label}
              </div>
              <div className="coreg-evidence-nodes">
                {tier.nodes.map((node, ni) => (
                  <div
                    key={node.title}
                    className={`coreg-evidence-node coreg-evidence-node--${tier.style}`}
                    style={{
                      ...nodeStyle(tier),
                      opacity: inView ? 1 : 0,
                      transition: `opacity 0.4s ease ${ti * 0.15 + ni * 0.06 + 0.1}s`,
                    }}
                  >
                    <div className="coreg-evidence-node-title">{node.title}</div>
                    <div className="coreg-evidence-node-detail">{node.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="coreg-evidence-footer"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.6s",
          }}
        >
          <p>The research program exists to fill the bottom row.</p>
        </div>
      </div>
    </div>
  );
}
