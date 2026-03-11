import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const bars = [
  { label: "M4 ANE", value: 6.6, unit: "TFLOPS/W", pct: 100, color: tokens.accent },
  { label: "M4 GPU", value: 1.0, unit: "TFLOPS/W", pct: 15.2, color: tokens.textMid },
  { label: "H100 GPU", value: 0.13, unit: "TFLOPS/W", pct: 2, color: tokens.textMuted },
  { label: "A100 GPU", value: 0.08, unit: "TFLOPS/W", pct: 1.2, color: tokens.textMuted },
];

export default function FTTTopsReality() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="ftt-tops">
      <style>{`
        .ftt-tops {
          margin: 2.5rem 0;
        }
        .ftt-tops-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: ${tokens.borderMid};
          border: 1px solid ${tokens.borderMid};
          border-radius: 8px;
          overflow: hidden;
        }
        .ftt-tops-panel {
          padding: 1.75rem 1.5rem;
          background: ${tokens.bgWarm};
          text-align: center;
        }
        .ftt-tops-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 0.75rem;
        }
        .ftt-tops-number {
          font-family: ${tokens.sans};
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }
        .ftt-tops-badge {
          display: inline-block;
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          margin-top: 0.5rem;
        }
        .ftt-tops-annotation {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          color: ${tokens.textLight};
          margin-top: 0.75rem;
          line-height: 1.4;
        }
        .ftt-tops-bars {
          margin-top: 1.5rem;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
        }
        .ftt-tops-bars-header {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 1rem;
        }
        .ftt-tops-bar-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.6rem;
        }
        .ftt-tops-bar-label {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          color: ${tokens.textMid};
          min-width: 70px;
          text-align: right;
          flex-shrink: 0;
        }
        .ftt-tops-bar-track {
          flex: 1;
          height: 14px;
          background: ${tokens.bgCard};
          border-radius: 3px;
          overflow: hidden;
        }
        .ftt-tops-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .ftt-tops-bar-value {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: ${tokens.textLight};
          min-width: 58px;
          flex-shrink: 0;
        }
        .ftt-tops-caption {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          color: ${tokens.textLight};
          line-height: 1.5;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid ${tokens.border};
        }
        @media (max-width: 640px) {
          .ftt-tops-panels {
            grid-template-columns: 1fr;
          }
          .ftt-tops-number {
            font-size: 1.75rem;
          }
          .ftt-tops-bar-label {
            min-width: 55px;
            font-size: 0.6rem;
          }
          .ftt-tops-bars {
            padding: 1rem;
          }
        }
        @media (max-width: 420px) {
          .ftt-tops-panel {
            padding: 1.25rem 1rem;
          }
        }
      `}</style>

      <div
        className="ftt-tops-panels"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="ftt-tops-panel">
          <div className="ftt-tops-eyebrow">What Apple says</div>
          <div className="ftt-tops-number" style={{ color: tokens.textMid }}>38</div>
          <div style={{ fontFamily: tokens.sans, fontSize: "0.85rem", color: tokens.textLight }}>TOPS</div>
          <div
            className="ftt-tops-badge"
            style={{ background: tokens.accentDim, color: tokens.accent }}
          >
            INT8
          </div>
        </div>
        <div className="ftt-tops-panel">
          <div className="ftt-tops-eyebrow">What the hardware does</div>
          <div className="ftt-tops-number" style={{ color: tokens.text }}>19</div>
          <div style={{ fontFamily: tokens.sans, fontSize: "0.85rem", color: tokens.textLight }}>TFLOPS</div>
          <div
            className="ftt-tops-badge"
            style={{ background: tokens.blueDim, color: tokens.blue }}
          >
            FP16
          </div>
          <div className="ftt-tops-annotation">
            INT8 inputs are dequantized to FP16 before compute. The 2× is notational.
          </div>
        </div>
      </div>

      <div
        className="ftt-tops-bars"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
        }}
      >
        <div className="ftt-tops-bars-header">Compute efficiency (TFLOPS/W)</div>
        {bars.map((bar, i) => (
          <div className="ftt-tops-bar-row" key={bar.label}>
            <div className="ftt-tops-bar-label">{bar.label}</div>
            <div className="ftt-tops-bar-track">
              <div
                className="ftt-tops-bar-fill"
                style={{
                  width: inView ? `${bar.pct}%` : "0%",
                  background: bar.color,
                  transitionDelay: `${0.3 + i * 0.1}s`,
                }}
              />
            </div>
            <div className="ftt-tops-bar-value">{bar.value}</div>
          </div>
        ))}
        <div className="ftt-tops-caption">
          The ANE is 50–80× more efficient per FLOP than datacenter GPUs. But CoreML's 2–4× overhead means developers access only a fraction of it.
        </div>
      </div>
    </div>
  );
}
