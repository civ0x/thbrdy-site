import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const bleFields = [
  { key: "hr", type: "Double", label: "hr: Double" },
  { key: "rr", type: "[Int]", label: "rr: [Int]" },
  { key: "st", type: "Double", label: "st: Double" },
  { key: "bb", type: "Double", label: "bb: Double" },
];

const mainActorProps = [
  "var heartRate: Double?",
  "var rrIntervals: [Int]?",
  "var stressScore: Double?",
  "var bodyBattery: Double?",
];

const containers = [
  { name: "IQDevice", annotation: "Objective-C · non-Sendable", fields: ["uuid: UUID", "friendlyName: String", "modelName: String"] },
  { name: "[String: Any]", annotation: "BLE payload dictionary · non-Sendable", fields: ['"hr": Double', '"rr": [Int]', '"st": Double', '"bb": Double'] },
];

export default function TrustConcurrencyBoundary() {
  const [ref, inView] = useInView(0.1);

  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const phase = (delay: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(14px)",
    transition: `all 0.5s ${ease} ${delay}s`,
  });
  const tokenCross = (i: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(-12px)",
    transition: `all 0.4s ${ease} ${0.4 + i * 0.1}s`,
  });
  const blocked = (i: number) => ({
    opacity: inView ? 1 : 0,
    transition: `opacity 0.3s ${ease} ${0.6 + i * 0.08}s`,
  });

  return (
    <div ref={ref} className="trust-concurrency">
      <style>{`
        .trust-concurrency {
          margin: 2.5rem 0;
        }
        .trust-concurrency-inner {
          background: var(--bg-dark);
          border-radius: 8px;
          padding: 2rem;
          overflow: hidden;
        }
        .trust-concurrency-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 1.5rem;
        }
        .trust-concurrency-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: start;
        }
        /* Left domain */
        .trust-concurrency-domain-header {
          font-family: ${tokens.mono};
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          margin-bottom: 0.15rem;
        }
        .trust-concurrency-domain-sub {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 1rem;
        }
        .trust-concurrency-container {
          border-radius: 5px;
          padding: 0.6rem 0.7rem;
          margin-bottom: 0.6rem;
        }
        .trust-concurrency-container-name {
          font-family: ${tokens.mono};
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 0.2rem;
        }
        .trust-concurrency-container-anno {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 0.5rem;
        }
        .trust-concurrency-container-field {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.6);
          padding: 0.15rem 0;
        }
        /* Center boundary */
        .trust-concurrency-boundary {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.2rem;
          position: relative;
        }
        .trust-concurrency-bline {
          width: 2px;
          background: var(--teal);
          opacity: 0.5;
          flex: 1;
          min-height: 100%;
          position: absolute;
          top: 0;
          bottom: 0;
        }
        .trust-concurrency-blabel {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          color: var(--teal);
          background: var(--bg-dark);
          padding: 0.3rem 0.5rem;
          border: 1px solid rgba(42, 122, 106, 0.3);
          border-radius: 3px;
          white-space: nowrap;
          position: relative;
          z-index: 1;
          margin-bottom: 0.8rem;
        }
        .trust-concurrency-crossings {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
        }
        .trust-concurrency-token {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: var(--accent);
          background: var(--bg-dark);
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 3px;
          padding: 0.25rem 0.5rem;
          white-space: nowrap;
        }
        .trust-concurrency-token-check {
          color: var(--green);
          font-size: 0.55rem;
        }
        .trust-concurrency-blocked {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.6rem;
          position: relative;
          z-index: 1;
        }
        .trust-concurrency-block-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          color: var(--red);
          background: var(--bg-dark);
          border: 1px solid rgba(166, 61, 47, 0.2);
          border-radius: 3px;
          padding: 0.2rem 0.45rem;
          white-space: nowrap;
        }
        .trust-concurrency-block-x {
          font-weight: 600;
          font-size: 0.55rem;
        }
        /* Right domain */
        .trust-concurrency-prop {
          font-family: ${tokens.mono};
          font-size: 0.62rem;
          color: rgba(255, 255, 255, 0.75);
          padding: 0.4rem 0.6rem;
          background: var(--bg-dark-mid);
          border-radius: 4px;
          border: 1px solid rgba(74, 122, 74, 0.15);
          margin-bottom: 0.45rem;
        }
        /* Parallel callout */
        .trust-concurrency-callout {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.8rem;
          align-items: center;
        }
        .trust-concurrency-callout-col {
          text-align: center;
        }
        .trust-concurrency-callout-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.3rem;
        }
        .trust-concurrency-callout-desc {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          line-height: 1.5;
          text-wrap: balance;
        }
        .trust-concurrency-callout-eq {
          font-family: ${tokens.mono};
          font-size: 0.75rem;
          color: var(--accent);
          text-align: center;
        }
        .trust-concurrency-annotation {
          margin-top: 1rem;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .trust-concurrency-annotation div {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          text-align: center;
          text-wrap: balance;
        }
        /* Responsive */
        @media (max-width: 640px) {
          .trust-concurrency-inner {
            padding: 1.5rem 1rem;
          }
          .trust-concurrency-boundary {
            padding: 0 0.6rem;
          }
          .trust-concurrency-token,
          .trust-concurrency-block-item {
            font-size: 0.52rem;
            padding: 0.2rem 0.35rem;
          }
          .trust-concurrency-container-field,
          .trust-concurrency-prop {
            font-size: 0.55rem;
          }
          .trust-concurrency-blabel {
            font-size: 0.5rem;
            padding: 0.2rem 0.35rem;
          }
        }
        @media (max-width: 420px) {
          .trust-concurrency-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .trust-concurrency-boundary {
            flex-direction: row;
            padding: 0.8rem 0;
            gap: 0.6rem;
            flex-wrap: wrap;
            justify-content: center;
          }
          .trust-concurrency-bline {
            width: 100%;
            height: 2px;
            min-height: 0;
            position: relative;
          }
          .trust-concurrency-crossings {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .trust-concurrency-blocked {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 0.3rem;
          }
          .trust-concurrency-callout {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .trust-concurrency-callout-eq {
            margin: 0.2rem 0;
          }
        }
      `}</style>

      <div className="trust-concurrency-inner" style={phase(0)}>
        <div className="trust-concurrency-title">Actor isolation as trust boundary</div>

        <div className="trust-concurrency-grid">
          {/* Left domain: BLE callback queue */}
          <div style={phase(0.1)}>
            <div className="trust-concurrency-domain-header" style={{ color: "var(--blue)" }}>
              nonisolated
            </div>
            <div className="trust-concurrency-domain-sub">BLE callback queue</div>

            {containers.map((c, ci) => (
              <div
                key={c.name}
                className="trust-concurrency-container"
                style={{
                  background: "rgba(42, 90, 138, 0.08)",
                  border: "1px solid rgba(42, 90, 138, 0.18)",
                  ...phase(0.15 + ci * 0.08),
                }}
              >
                <div className="trust-concurrency-container-name">{c.name}</div>
                <div className="trust-concurrency-container-anno">{c.annotation}</div>
                {c.fields.map((f) => (
                  <div key={f} className="trust-concurrency-container-field">{f}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Center boundary */}
          <div className="trust-concurrency-boundary" style={phase(0.25)}>
            <div className="trust-concurrency-bline" />
            <div className="trust-concurrency-blabel">{"Task { @MainActor in }"}</div>

            <div className="trust-concurrency-crossings">
              {bleFields.map((f, i) => (
                <div key={f.key} className="trust-concurrency-token" style={tokenCross(i)}>
                  <span className="trust-concurrency-token-check">&#10003;</span>
                  {f.label}
                </div>
              ))}
            </div>

            <div className="trust-concurrency-blocked">
              {containers.map((c, i) => (
                <div key={c.name} className="trust-concurrency-block-item" style={blocked(i)}>
                  <span className="trust-concurrency-block-x">&#10007;</span>
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right domain: MainActor */}
          <div style={phase(0.6)}>
            <div className="trust-concurrency-domain-header" style={{ color: "var(--green)" }}>
              @MainActor @Observable
            </div>
            <div className="trust-concurrency-domain-sub">GarminConnectivityService</div>

            <div
              className="trust-concurrency-container"
              style={{
                background: "rgba(74, 122, 74, 0.08)",
                border: "1px solid rgba(74, 122, 74, 0.18)",
              }}
            >
              {mainActorProps.map((p, i) => (
                <div
                  key={p}
                  className="trust-concurrency-prop"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(8px)",
                    transition: `all 0.4s ${ease} ${0.65 + i * 0.08}s`,
                    marginBottom: i < mainActorProps.length - 1 ? "0.45rem" : 0,
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parallel callout */}
        <div className="trust-concurrency-callout" style={phase(0.9)}>
          <div className="trust-concurrency-callout-col">
            <div className="trust-concurrency-callout-label">Concurrency Boundary</div>
            <div className="trust-concurrency-callout-desc">
              non-Sendable containers stay behind · typed Sendable values cross
            </div>
          </div>
          <div className="trust-concurrency-callout-eq">&#8801;</div>
          <div className="trust-concurrency-callout-col">
            <div className="trust-concurrency-callout-label">Privacy Boundary</div>
            <div className="trust-concurrency-callout-desc">
              absolute measurements stay behind · relative descriptors cross
            </div>
          </div>
        </div>

        <div className="trust-concurrency-annotation" style={phase(1.0)}>
          <div>
            Data moving between domains with different trust models must be explicitly decomposed at the crossing point.
          </div>
        </div>
      </div>
    </div>
  );
}
