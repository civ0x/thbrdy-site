import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

export default function FTTInferenceRegimes() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="ftt-regimes">
      <style>{`
        .ftt-regimes {
          margin: 2.5rem 0;
        }
        .ftt-regimes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: ${tokens.borderMid};
          border: 1px solid ${tokens.borderMid};
          border-radius: 8px;
          overflow: hidden;
        }
        .ftt-regimes-col {
          padding: 1.75rem 1.5rem;
          background: ${tokens.bgWarm};
        }
        .ftt-regimes-heading {
          font-family: ${tokens.sans};
          font-size: 1rem;
          font-weight: 600;
          color: ${tokens.text};
          margin-bottom: 0.75rem;
        }
        .ftt-regimes-badge {
          display: inline-block;
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .ftt-regimes-metric-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 0.25rem;
        }
        .ftt-regimes-metric-value {
          font-family: ${tokens.sans};
          font-size: 0.8rem;
          font-weight: 500;
          color: ${tokens.textMid};
          margin-bottom: 1rem;
        }
        .ftt-regimes-improvement {
          font-family: ${tokens.sans};
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }
        .ftt-regimes-concrete {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: ${tokens.textLight};
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .ftt-regimes-frequency {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.06em;
          color: ${tokens.textMuted};
          text-transform: uppercase;
        }
        .ftt-regimes-callout {
          margin-top: 1rem;
          padding: 1rem 1.25rem;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          font-family: ${tokens.sans};
          font-size: 0.8rem;
          font-weight: 500;
          color: ${tokens.textMid};
          text-align: center;
          line-height: 1.5;
        }
        @media (max-width: 640px) {
          .ftt-regimes-grid {
            grid-template-columns: 1fr;
          }
          .ftt-regimes-col {
            padding: 1.25rem 1rem;
          }
        }
        @media (max-width: 420px) {
          .ftt-regimes-improvement {
            font-size: inherit;
          }
        }
      `}</style>

      <div
        className="ftt-regimes-grid"
      >
        {/* Prefill column */}
        <div
          className="ftt-regimes-col"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="ftt-regimes-heading">Prefill</div>
          <div
            className="ftt-regimes-badge"
            style={{ background: tokens.accentDim, color: tokens.accent }}
          >
            Compute-bound
          </div>
          <div className="ftt-regimes-metric-label">Key metric</div>
          <div className="ftt-regimes-metric-value">TFLOPS</div>
          <div className="ftt-regimes-metric-label">M4 → M5 improvement</div>
          <div
            className="ftt-regimes-improvement"
            style={{ fontSize: "2.5rem", color: tokens.accent }}
          >
            4×
          </div>
          <div className="ftt-regimes-concrete">81s → 18s for 10K-token prompt</div>
          <div className="ftt-regimes-frequency">Happens once per prompt</div>
        </div>

        {/* Decode column */}
        <div
          className="ftt-regimes-col"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s",
          }}
        >
          <div className="ftt-regimes-heading">Decode</div>
          <div
            className="ftt-regimes-badge"
            style={{ background: tokens.blueDim, color: tokens.blue }}
          >
            Bandwidth-bound
          </div>
          <div className="ftt-regimes-metric-label">Key metric</div>
          <div className="ftt-regimes-metric-value">GB/s</div>
          <div className="ftt-regimes-metric-label">M4 → M5 improvement</div>
          <div
            className="ftt-regimes-improvement"
            style={{ fontSize: "1.5rem", color: tokens.textMid }}
          >
            ~12%
          </div>
          <div className="ftt-regimes-concrete">7 → 10 tok/s on 70B</div>
          <div className="ftt-regimes-frequency">Happens every token generated</div>
        </div>
      </div>

      <div
        className="ftt-regimes-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s",
        }}
      >
        The marketing leads with prefill. You feel decode.
      </div>
    </div>
  );
}
