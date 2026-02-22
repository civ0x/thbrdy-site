import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const nodes = [
  { label: "Layer 4", text: "Deployment decision — \"this system is safe to deploy at this capability level\"" },
  { label: "Layer 3", text: "Capability assessment — \"we have evaluated the dangerous capabilities and they are below threshold\"" },
  { label: "Layer 2", text: "Evaluation schedule — \"we assess capabilities before they cross dangerous thresholds\"" },
  {
    label: "Foundation · Acknowledged open question",
    text: "Informal forecasts — \"we can predict capability trajectories well enough to trigger assessments in time\"",
    foundation: true,
  },
];

export default function ScholionDependencyChain() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="scholion-chain">
      <style>{`
        .scholion-chain {
          margin: 2.5rem 0;
        }
        .scholion-chain-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.5rem 2rem;
        }
        .scholion-chain-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2rem;
          text-align: center;
        }
        .scholion-chain-nodes {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .scholion-chain-node {
          width: 100%;
          max-width: 440px;
          background: var(--bg);
          border: 1px solid var(--border-mid);
          border-radius: 6px;
          padding: 1rem 1.4rem;
          position: relative;
        }
        .scholion-chain-node--foundation {
          border-color: var(--red);
          border-width: 2px;
          background: var(--red-dim);
        }
        .scholion-chain-node-label {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 0.3rem;
        }
        .scholion-chain-node--foundation .scholion-chain-node-label {
          color: var(--red);
        }
        .scholion-chain-node-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.text};
          line-height: 1.5;
        }
        .scholion-chain-node--foundation .scholion-chain-node-text {
          color: var(--red);
        }
        .scholion-chain-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 36px;
          justify-content: center;
          position: relative;
        }
        .scholion-chain-arrow-line {
          width: 1px;
          height: 12px;
          background: var(--border-mid);
        }
        .scholion-chain-arrow-icon {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
          margin-top: -2px;
        }
        .scholion-chain-arrow-label {
          position: absolute;
          right: -8px;
          transform: translateX(100%);
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
          white-space: nowrap;
        }
        .scholion-chain-annotation {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .scholion-chain-annotation p {
          font-family: ${tokens.sans};
          font-size: 0.78rem;
          color: ${tokens.textLight};
          line-height: 1.6;
          max-width: 380px;
          margin: 0 auto;
        }
        .scholion-chain-annotation-em {
          color: var(--red);
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .scholion-chain-inner {
            padding: 1.5rem 1rem;
          }
          .scholion-chain-arrow-label {
            display: none;
          }
        }
      `}</style>

      <div className="scholion-chain-inner">
        <div className="scholion-chain-title">
          Implicit dependency chain in a responsible scaling policy
        </div>
        <div className="scholion-chain-nodes">
          {nodes.map((node, i) => (
            <div key={i}>
              {i > 0 && (
                <div
                  className="scholion-chain-arrow"
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${0.15 + i * 0.12}s`,
                  }}
                >
                  <div className="scholion-chain-arrow-line" />
                  <span className="scholion-chain-arrow-icon">↑</span>
                  <span className="scholion-chain-arrow-label">depends on</span>
                </div>
              )}
              <div
                className={`scholion-chain-node${node.foundation ? " scholion-chain-node--foundation" : ""}`}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(12px)",
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.12}s`,
                }}
              >
                <div className="scholion-chain-node-label">{node.label}</div>
                <div className="scholion-chain-node-text">{node.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="scholion-chain-annotation"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.6s",
          }}
        >
          <p>
            The RSP itself describes these forecasting methods as{" "}
            <span className="scholion-chain-annotation-em">"open research questions"</span>{" "}
            that need improvement before being relied upon for risk judgments.
            A four-level dependency chain resting on an acknowledged open question.
          </p>
        </div>
      </div>
    </div>
  );
}
