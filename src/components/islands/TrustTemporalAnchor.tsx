import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

export default function TrustTemporalAnchor() {
  const [ref, inView] = useInView(0.1);

  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  const d = (ms: number) => `${ms}ms`;

  return (
    <div ref={ref} className="trust-temporal">
      <style>{`
        .trust-temporal {
          margin: 2.5rem 0;
        }
        .trust-temporal-inner {
          background: ${tokens.bgDark};
          border-radius: 8px;
          padding: 2rem;
          overflow: hidden;
        }
        .trust-temporal-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 1.5rem;
        }
        .trust-temporal-canvas {
          position: relative;
        }
        /* Time axis */
        .trust-temporal-axis {
          position: relative;
          height: 28px;
          margin-bottom: 1rem;
          margin-left: 140px;
        }
        .trust-temporal-axis-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }
        .trust-temporal-tick {
          position: absolute;
          top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .trust-temporal-tick-mark {
          width: 1px;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
        }
        .trust-temporal-tick-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
          margin-top: 2px;
        }
        .trust-temporal-tick-label--accent {
          color: ${tokens.accent};
        }
        /* Swim lanes */
        .trust-temporal-lane {
          display: flex;
          align-items: center;
          height: 64px;
          margin-bottom: 0.5rem;
          position: relative;
        }
        .trust-temporal-lane-label {
          width: 140px;
          flex-shrink: 0;
          padding-right: 1rem;
        }
        .trust-temporal-lane-name {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.3;
        }
        .trust-temporal-lane-sub {
          font-family: ${tokens.mono};
          font-size: 0.52rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
          margin-top: 2px;
        }
        .trust-temporal-lane-track {
          flex: 1;
          position: relative;
          height: 100%;
        }
        /* Button press marker */
        .trust-temporal-marker {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${tokens.accent};
          box-shadow: 0 0 8px rgba(184, 134, 11, 0.4);
        }
        .trust-temporal-epoch {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-family: ${tokens.mono};
          font-size: 0.48rem;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }
        /* HRV bar */
        .trust-temporal-bar {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding-left: 8px;
        }
        .trust-temporal-bar-label {
          font-family: ${tokens.mono};
          font-size: 0.52rem;
          white-space: nowrap;
        }
        /* Timestamp decision */
        .trust-temporal-decision {
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          margin-left: 140px;
          position: relative;
          min-height: 56px;
        }
        .trust-temporal-stamp {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }
        .trust-temporal-stamp-line {
          width: 3px;
          min-height: 28px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .trust-temporal-stamp-text {
          font-family: ${tokens.mono};
          font-size: 0.65rem;
          line-height: 1.5;
        }
        .trust-temporal-stamp-tag {
          font-family: ${tokens.mono};
          font-size: 0.52rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .trust-temporal-rejected-code {
          text-decoration: line-through;
          text-decoration-color: rgba(166, 61, 47, 0.6);
        }
        .trust-temporal-annotation {
          margin-top: 1rem;
          padding-top: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .trust-temporal-annotation div {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
        }
        @media (max-width: 640px) {
          .trust-temporal-inner {
            padding: 1.5rem 1rem;
          }
          .trust-temporal-axis {
            margin-left: 100px;
          }
          .trust-temporal-lane-label {
            width: 100px;
          }
          .trust-temporal-decision {
            margin-left: 100px;
          }
          .trust-temporal-lane-name {
            font-size: 0.62rem;
          }
          .trust-temporal-lane-sub {
            font-size: 0.44rem;
          }
        }
        @media (max-width: 420px) {
          .trust-temporal-inner {
            padding: 1.25rem 0.75rem;
          }
          .trust-temporal-axis {
            margin-left: 0;
          }
          .trust-temporal-lane {
            flex-direction: column;
            align-items: flex-start;
            height: auto;
            gap: 0.3rem;
          }
          .trust-temporal-lane-label {
            width: 100%;
            padding-right: 0;
          }
          .trust-temporal-lane-track {
            width: 100%;
            height: 36px;
          }
          .trust-temporal-decision {
            margin-left: 0;
          }
        }
      `}</style>

      <div
        className="trust-temporal-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: `all 0.5s ${ease}`,
        }}
      >
        <div className="trust-temporal-title">
          Twelve seconds between experience and data
        </div>

        <div className="trust-temporal-canvas">
            {/* Time axis */}
            <div
              className="trust-temporal-axis"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} ${d(200)}`,
              }}
            >
              <div className="trust-temporal-axis-line" />
              {/* t=0 */}
              <div className="trust-temporal-tick" style={{ left: "0%" }}>
                <div className="trust-temporal-tick-mark" style={{ background: tokens.accent }} />
                <div className="trust-temporal-tick-label trust-temporal-tick-label--accent">t = 0</div>
              </div>
              {/* t≈10s */}
              <div className="trust-temporal-tick" style={{ left: "65%" }}>
                <div className="trust-temporal-tick-mark" />
                <div className="trust-temporal-tick-label">t ≈ 10s</div>
              </div>
              {/* t≈12-14s */}
              <div className="trust-temporal-tick" style={{ left: "90%" }}>
                <div className="trust-temporal-tick-mark" />
                <div className="trust-temporal-tick-label">t ≈ 12–14s</div>
              </div>
            </div>

            {/* Lane 1: Button Press */}
            <div
              className="trust-temporal-lane"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.5s ${ease} ${d(400)}`,
              }}
            >
              <div className="trust-temporal-lane-label">
                <div className="trust-temporal-lane-name">User presses button</div>
                <div className="trust-temporal-lane-sub">Garmin epoch: Time.now().value()</div>
              </div>
              <div className="trust-temporal-lane-track">
                <div className="trust-temporal-marker" />
                <div className="trust-temporal-epoch">Dec 31, 1989 00:00 UTC + seconds</div>
              </div>
            </div>

            {/* Lane 2: HRV Capture */}
            <div
              className="trust-temporal-lane"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.5s ${ease} ${d(600)}`,
              }}
            >
              <div className="trust-temporal-lane-label">
                <div className="trust-temporal-lane-name">RR interval accumulation</div>
                <div className="trust-temporal-lane-sub">10s window · ectopic rejection (&gt;25%)</div>
              </div>
              <div className="trust-temporal-lane-track">
                <div
                  className="trust-temporal-bar"
                  style={{
                    left: "0%",
                    width: inView ? "65%" : "0%",
                    background: "rgba(74, 122, 74, 0.18)",
                    border: "1px solid rgba(74, 122, 74, 0.5)",
                    transition: `width 0.6s ${ease} ${d(800)}`,
                  }}
                >
                  <div className="trust-temporal-bar-label" style={{ color: "rgba(74, 122, 74, 0.9)" }}>
                    10s capture window
                  </div>
                </div>
              </div>
            </div>

            {/* Lane 3: BLE Transit */}
            <div
              className="trust-temporal-lane"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.5s ${ease} ${d(800)}`,
              }}
            >
              <div className="trust-temporal-lane-label">
                <div className="trust-temporal-lane-name">BLE payload transfer</div>
                <div className="trust-temporal-lane-sub">Connect IQ → iPhone</div>
              </div>
              <div className="trust-temporal-lane-track">
                <div
                  className="trust-temporal-bar"
                  style={{
                    left: "65%",
                    width: inView ? "25%" : "0%",
                    background: "rgba(42, 90, 138, 0.2)",
                    border: "1px solid rgba(42, 90, 138, 0.5)",
                    transition: `width 0.5s ${ease} ${d(1200)}`,
                  }}
                >
                  <div className="trust-temporal-bar-label" style={{ color: "rgba(42, 90, 138, 0.9)" }}>
                    BLE transit
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp decision */}
            <div
              className="trust-temporal-decision"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ${ease} ${d(1400)}`,
              }}
            >
              {/* Preserved */}
              <div className="trust-temporal-stamp">
                <div
                  className="trust-temporal-stamp-line"
                  style={{ background: tokens.accent }}
                />
                <div>
                  <div className="trust-temporal-stamp-tag" style={{ color: tokens.accent }}>
                    Preserved
                  </div>
                  <div className="trust-temporal-stamp-text" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    snapTimestamp = garminEpoch + offset → Date
                  </div>
                </div>
              </div>
              {/* Rejected */}
              <div
                className="trust-temporal-stamp"
                style={{
                  opacity: inView ? 0.7 : 0,
                  transition: `opacity 0.5s ${ease} ${d(1700)}`,
                }}
              >
                <div
                  className="trust-temporal-stamp-line"
                  style={{ background: tokens.red, opacity: 0.6 }}
                />
                <div>
                  <div className="trust-temporal-stamp-tag" style={{ color: tokens.red }}>
                    Rejected
                  </div>
                  <div
                    className="trust-temporal-stamp-text trust-temporal-rejected-code"
                    style={{ color: "rgba(255, 255, 255, 0.55)" }}
                  >
                    receiveTimestamp ← Date()
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Annotation */}
        <div
          className="trust-temporal-annotation"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.5s ${ease} ${d(1900)}`,
          }}
        >
          <div>
            The snap happened when the user felt something — not when the phone received a packet.
          </div>
        </div>
      </div>
    </div>
  );
}
