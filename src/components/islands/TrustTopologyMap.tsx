import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface PathNode {
  label: string;
  color: string;
  colorDim: string;
}

interface DevicePath {
  name: string;
  nodes: PathNode[];
  delayOffset: number;
}

const green = { color: tokens.green, colorDim: tokens.greenDim };
const blue = { color: tokens.blue, colorDim: tokens.blueDim };
const red = { color: tokens.red, colorDim: tokens.redDim };

const paths: DevicePath[] = [
  {
    name: "Apple Watch",
    delayOffset: 0,
    nodes: [
      { label: "Apple Watch", ...green },
      { label: "WatchConnectivity", ...blue },
      { label: "iPhone", ...green },
    ],
  },
  {
    name: "Garmin Enduro 3",
    delayOffset: 0.3,
    nodes: [
      { label: "Garmin Enduro 3", ...green },
      { label: "BLE (Connect IQ)", ...blue },
      { label: "iPhone", ...green },
    ],
  },
  {
    name: "Oura Ring 3",
    delayOffset: 0.6,
    nodes: [
      { label: "Oura Ring 3", ...green },
      { label: "BLE", ...blue },
      { label: "Oura App", ...green },
      { label: "Oura Cloud", ...red },
      { label: "REST API", ...red },
      { label: "iPhone", ...green },
    ],
  },
];

const convergenceNode = { label: "BiometricSnapshot", color: tokens.teal, colorDim: tokens.tealDim };

export default function TrustTopologyMap() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="trust-topo">
      <style>{`
        .trust-topo {
          margin: 2.5rem 0;
        }
        .trust-topo-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem 1.5rem 2rem;
        }
        .trust-topo-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2rem;
          text-align: center;
        }
        .trust-topo-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-items: end;
        }
        .trust-topo-path {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .trust-topo-node {
          width: 100%;
          max-width: 180px;
          padding: 0.6rem 0.8rem;
          border-radius: 5px;
          border: 1px solid;
          text-align: center;
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          font-weight: 500;
          line-height: 1.3;
        }
        .trust-topo-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 28px;
          justify-content: center;
        }
        .trust-topo-arrow-line {
          width: 1px;
          height: 10px;
        }
        .trust-topo-arrow-head {
          font-size: 0.6rem;
          margin-top: -3px;
        }
        .trust-topo-converge-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 0.5rem;
        }
        .trust-topo-converge-arrows {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: 100%;
          margin-bottom: 0;
        }
        .trust-topo-converge-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 36px;
          justify-content: center;
        }
        .trust-topo-converge-arrow-line {
          width: 1px;
          height: 14px;
          background: ${tokens.teal};
          opacity: 0.4;
        }
        .trust-topo-converge-arrow-head {
          font-size: 0.6rem;
          color: ${tokens.teal};
          opacity: 0.6;
          margin-top: -3px;
        }
        .trust-topo-convergence {
          width: 100%;
          max-width: 280px;
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          border: 2px solid;
          text-align: center;
          font-family: ${tokens.mono};
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .trust-topo-annotation {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .trust-topo-annotation div {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textLight};
          line-height: 1.6;
          max-width: 420px;
          margin: 0 auto;
        }
        .trust-topo-legend {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .trust-topo-legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .trust-topo-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .trust-topo-legend-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
        }
        @media (max-width: 640px) {
          .trust-topo-inner {
            padding: 1.5rem 1rem;
          }
          .trust-topo-columns {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            align-items: center;
          }
          .trust-topo-path {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0;
          }
          .trust-topo-node {
            max-width: 140px;
            font-size: 0.65rem;
            padding: 0.5rem 0.6rem;
          }
          .trust-topo-arrow {
            flex-direction: row;
            height: auto;
            width: 24px;
          }
          .trust-topo-arrow-line {
            width: 10px;
            height: 1px;
          }
          .trust-topo-arrow-head {
            margin-top: 0;
            margin-left: -3px;
          }
          .trust-topo-converge-zone {
            margin-top: 1rem;
          }
          .trust-topo-converge-arrows {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .trust-topo-converge-arrow {
            height: 28px;
          }
          .trust-topo-path-label {
            width: 100%;
            text-align: center;
            margin-bottom: 0.5rem;
          }
        }
        @media (max-width: 420px) {
          .trust-topo-node {
            max-width: 120px;
            font-size: 0.6rem;
            padding: 0.4rem 0.5rem;
          }
          .trust-topo-legend {
            gap: 0.8rem;
          }
        }
      `}</style>

      <div className="trust-topo-inner">
        <div className="trust-topo-title">
          Three data flow topologies converging on a single protocol
        </div>

        <div className="trust-topo-legend" style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.4s ease 0.1s",
        }}>
          {[
            { color: tokens.green, label: "On-device" },
            { color: tokens.blue, label: "Transport" },
            { color: tokens.red, label: "Cloud hop" },
            { color: tokens.teal, label: "Protocol boundary" },
          ].map((item) => (
            <div key={item.label} className="trust-topo-legend-item">
              <div className="trust-topo-legend-dot" style={{ background: item.color }} />
              <span className="trust-topo-legend-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="trust-topo-columns">
          {paths.map((path) => (
            <div key={path.name} className="trust-topo-path">
              {path.nodes.map((node, ni) => (
                <div key={ni} style={{ display: "contents" }}>
                  {ni > 0 && (
                    <div
                      className="trust-topo-arrow"
                      style={{
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.3s ease ${path.delayOffset + ni * 0.08}s`,
                      }}
                    >
                      <div
                        className="trust-topo-arrow-line"
                        style={{ background: node.color, opacity: 0.4 }}
                      />
                      <span className="trust-topo-arrow-head" style={{ color: node.color, opacity: 0.6 }}>
                        ↓
                      </span>
                    </div>
                  )}
                  <div
                    className="trust-topo-node"
                    style={{
                      background: node.colorDim,
                      borderColor: node.color,
                      color: node.color,
                      opacity: inView ? 1 : 0,
                      transform: inView ? "translateY(0)" : "translateY(12px)",
                      transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${path.delayOffset + ni * 0.08}s`,
                    }}
                  >
                    {node.label}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="trust-topo-converge-zone">
          <div className="trust-topo-converge-arrows" style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 1.1s",
          }}>
            {paths.map((path) => (
              <div key={path.name} className="trust-topo-converge-arrow">
                <div className="trust-topo-converge-arrow-line" />
                <span className="trust-topo-converge-arrow-head">↓</span>
              </div>
            ))}
          </div>
          <div
            className="trust-topo-convergence"
            style={{
              background: convergenceNode.colorDim,
              borderColor: convergenceNode.color,
              color: convergenceNode.color,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s",
            }}
          >
            {convergenceNode.label}
          </div>
        </div>

        <div
          className="trust-topo-annotation"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 1.4s",
          }}
        >
          <div>
            Everything downstream of BiometricSnapshot is topology-agnostic.
            Three architecturally distinct paths, one protocol interface.
          </div>
        </div>
      </div>
    </div>
  );
}
