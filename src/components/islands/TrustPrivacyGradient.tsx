import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface DataRow {
  raw: string;
  descriptor: string;
}

interface SourceTab {
  id: string;
  label: string;
  shortLabel: string;
  rows: DataRow[];
}

const sources: SourceTab[] = [
  {
    id: "apple",
    label: "Apple Watch",
    shortLabel: "Watch",
    rows: [
      { raw: "heartRate: 82 BPM", descriptor: '"slightly elevated"' },
      { raw: "hrvSDNN: 34 ms", descriptor: '"in a moderate range"' },
    ],
  },
  {
    id: "garmin",
    label: "Garmin Enduro 3",
    shortLabel: "Garmin",
    rows: [
      { raw: "heartRate: 82 BPM", descriptor: '"slightly elevated"' },
      { raw: "hrvRMSSD: 48 ms", descriptor: '"in a healthy range"' },
      { raw: "stressScore: 62", descriptor: '"elevated"' },
      { raw: "bodyBattery: 38", descriptor: '"on the lower side"' },
    ],
  },
  {
    id: "oura",
    label: "Oura Ring 3",
    shortLabel: "Oura",
    rows: [
      { raw: "readinessScore: 71", descriptor: '"readiness moderate"' },
      { raw: "sleepEfficiency: 88%", descriptor: '"sleep quality good"' },
      { raw: "hrvRMSSD: 52 ms (overnight)", descriptor: '"nighttime HRV in a healthy range"' },
      { raw: 'stressDaySummary: "stressful"', descriptor: '"stress pattern: stressful"' },
    ],
  },
];

export default function TrustPrivacyGradient() {
  const [ref, inView] = useInView(0.1);
  const [activeTab, setActiveTab] = useState("garmin");

  const activeSource = sources.find((s) => s.id === activeTab)!;

  return (
    <div ref={ref} className="trust-privacy">
      <style>{`
        .trust-privacy {
          margin: 2.5rem 0;
        }
        .trust-privacy-inner {
          background: var(--bg-dark);
          border-radius: 8px;
          padding: 2rem;
          overflow: hidden;
        }
        .trust-privacy-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 1.5rem;
        }
        .trust-privacy-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .trust-privacy-tab {
          padding: 0.6rem 1.2rem;
          font-family: ${tokens.mono};
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 2px solid transparent;
          transition: color 0.2s ease, border-color 0.2s ease;
          margin-bottom: -1px;
        }
        .trust-privacy-tab:hover {
          color: rgba(255, 255, 255, 0.6);
        }
        .trust-privacy-tab--active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .trust-privacy-tab--active:hover {
          color: var(--accent);
        }
        .trust-privacy-columns {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0;
          align-items: start;
        }
        .trust-privacy-col-header {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          padding-bottom: 0.8rem;
          margin-bottom: 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .trust-privacy-divider-header {
          padding-bottom: 0.8rem;
          margin-bottom: 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .trust-privacy-rows {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .trust-privacy-raw {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.75);
          padding: 0.5rem 0.7rem;
          background: var(--bg-dark-mid);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          line-height: 1.4;
        }
        .trust-privacy-descriptor {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: var(--accent);
          padding: 0.5rem 0.7rem;
          background: rgba(184, 134, 11, 0.06);
          border-radius: 4px;
          border: 1px solid rgba(184, 134, 11, 0.12);
          line-height: 1.4;
        }
        .trust-privacy-divider-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
        }
        .trust-privacy-arrow-row {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0.5rem 0;
        }
        .trust-privacy-arrow {
          font-family: ${tokens.mono};
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }
        .trust-privacy-annotation {
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .trust-privacy-annotation div {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
        }
        @media (max-width: 640px) {
          .trust-privacy-inner {
            padding: 1.5rem 1rem;
          }
          .trust-privacy-columns {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .trust-privacy-divider-col {
            display: none;
          }
          .trust-privacy-col-header {
            margin-bottom: 0.5rem;
          }
          .trust-privacy-tab {
            padding: 0.5rem 0.8rem;
            font-size: 0.6rem;
          }
        }
        @media (max-width: 420px) {
          .trust-privacy-tab .trust-privacy-tab-full {
            display: none;
          }
          .trust-privacy-tab .trust-privacy-tab-short {
            display: inline;
          }
          .trust-privacy-raw,
          .trust-privacy-descriptor {
            font-size: 0.62rem;
          }
        }
      `}</style>

      <div
        className="trust-privacy-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="trust-privacy-title">
          Privacy transformation by source
        </div>

        <div className="trust-privacy-tabs">
          {sources.map((source) => (
            <button
              key={source.id}
              className={`trust-privacy-tab${activeTab === source.id ? " trust-privacy-tab--active" : ""}`}
              onClick={() => setActiveTab(source.id)}
              type="button"
            >
              <span className="trust-privacy-tab-full">{source.label}</span>
              <span className="trust-privacy-tab-short" style={{ display: "none" }}>{source.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="trust-privacy-columns">
          <div>
            <div className="trust-privacy-col-header">Raw Values</div>
            <div className="trust-privacy-rows">
              {activeSource.rows.map((row, i) => (
                <div
                  key={`${activeTab}-raw-${i}`}
                  className="trust-privacy-raw"
                >
                  {row.raw}
                </div>
              ))}
            </div>
          </div>

          <div className="trust-privacy-divider-col">
            <div className="trust-privacy-divider-header" style={{ visibility: "hidden" }}>
              &nbsp;
            </div>
            <div className="trust-privacy-rows">
              {activeSource.rows.map((_, i) => (
                <div key={`${activeTab}-arrow-${i}`} className="trust-privacy-arrow-row">
                  <span className="trust-privacy-arrow">→</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="trust-privacy-col-header">What Claude Sees</div>
            <div className="trust-privacy-rows">
              {activeSource.rows.map((row, i) => (
                <div
                  key={`${activeTab}-desc-${i}`}
                  className="trust-privacy-descriptor"
                >
                  {row.descriptor}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="trust-privacy-annotation">
          <div>
            No raw values cross the network boundary.
            Absolute measurements become relative descriptions.
          </div>
        </div>
      </div>
    </div>
  );
}
