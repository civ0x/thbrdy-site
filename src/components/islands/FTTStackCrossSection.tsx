import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Layer {
  num: number;
  name: string;
  presented: string;
  actual: string;
}

interface Boundary {
  label: string;
}

const layers: Layer[] = [
  { num: 0, name: "Silicon", presented: "38 TOPS", actual: "ANE: 19 TFLOPS, 2.8W, convolution engine" },
  { num: 1, name: "Framework", presented: "Optimized for Apple Silicon", actual: "MLX / CoreML / llama.cpp — 2–3× spread on identical hardware" },
  { num: 2, name: "System", presented: "4× faster AI", actual: "M5 Max: 614 GB/s, 128GB, Fusion Architecture, 40 Neural Accelerators" },
  { num: 3, name: "Model", presented: "Designed for on-device", actual: "Qwen 3.5: Gated DeltaNet, 3:1 hybrid, MoE 17B/397B active" },
  { num: 4, name: "Application", presented: "AI-powered workflows", actual: "Autoresearch ratchet, Hermes persistent agent" },
];

const boundaries: Boundary[] = [
  { label: "CoreML overhead: 2–4×, or private API risk" },
  { label: "Prefill vs. Decode: 4× vs. 12%" },
  { label: "Convergent optimization, not co-design" },
  { label: "program.md / skill documents" },
];

export default function FTTStackCrossSection() {
  const [ref, inView] = useInView(0.1);

  // Build interleaved list: layer, boundary, layer, boundary, ...
  const elements: { type: "layer" | "boundary"; index: number }[] = [];
  for (let i = 0; i < layers.length; i++) {
    elements.push({ type: "layer", index: i });
    if (i < boundaries.length) {
      elements.push({ type: "boundary", index: i });
    }
  }

  return (
    <div ref={ref} className="ftt-stack">
      <style>{`
        .ftt-stack {
          margin: 2.5rem 0;
        }
        .ftt-stack-inner {
          background: ${tokens.bgDark};
          border-radius: 8px;
          padding: 1.5rem;
          overflow: hidden;
        }
        .ftt-stack-header {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(250, 246, 240, 0.4);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .ftt-stack-layers {
          display: flex;
          flex-direction: column-reverse;
          gap: 0;
        }
        .ftt-stack-layer {
          display: grid;
          grid-template-columns: 1fr 85px 1.4fr;
          gap: 0.75rem;
          align-items: center;
          padding: 1rem 1rem;
          border: 1px solid rgba(250, 246, 240, 0.08);
          border-radius: 6px;
          background: ${tokens.bgDarkMid};
        }
        .ftt-stack-presented {
          font-family: ${tokens.sans};
          font-size: 0.68rem;
          color: rgba(250, 246, 240, 0.35);
          text-align: right;
          line-height: 1.3;
        }
        .ftt-stack-presented-label {
          font-family: ${tokens.mono};
          font-size: 0.45rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250, 246, 240, 0.2);
          display: block;
          margin-bottom: 0.2rem;
        }
        .ftt-stack-name {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.accent};
          text-align: center;
          line-height: 1;
        }
        .ftt-stack-name-num {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.15rem;
          color: rgba(250, 246, 240, 0.5);
        }
        .ftt-stack-actual {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          color: rgba(250, 246, 240, 0.85);
          line-height: 1.35;
        }
        .ftt-stack-actual-label {
          font-family: ${tokens.mono};
          font-size: 0.45rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250, 246, 240, 0.3);
          display: block;
          margin-bottom: 0.2rem;
        }
        .ftt-stack-boundary {
          padding: 0.5rem 1rem;
          text-align: center;
        }
        .ftt-stack-boundary-line {
          width: 1px;
          height: 8px;
          background: rgba(184, 134, 11, 0.3);
          margin: 0 auto 0.25rem;
        }
        .ftt-stack-boundary-text {
          font-family: ${tokens.mono};
          font-size: 0.52rem;
          letter-spacing: 0.04em;
          color: ${tokens.accent};
          opacity: 0.7;
          line-height: 1.4;
        }
        .ftt-stack-boundary-line2 {
          width: 1px;
          height: 8px;
          background: rgba(184, 134, 11, 0.3);
          margin: 0.25rem auto 0;
        }
        @media (max-width: 640px) {
          .ftt-stack-inner {
            padding: 1rem;
          }
          .ftt-stack-layer {
            grid-template-columns: 1fr;
            gap: 0.4rem;
            text-align: center;
            padding: 0.75rem;
          }
          .ftt-stack-presented {
            text-align: center;
            order: 2;
          }
          .ftt-stack-name {
            order: 0;
          }
          .ftt-stack-actual {
            order: 1;
            text-align: center;
          }
          .ftt-stack-presented-label,
          .ftt-stack-actual-label {
            display: inline;
          }
        }
        @media (max-width: 420px) {
          .ftt-stack-layer {
            padding: 0.6rem;
          }
          .ftt-stack-actual {
            font-size: 0.62rem;
          }
          .ftt-stack-presented {
            font-size: 0.58rem;
          }
        }
      `}</style>

      <div
        className="ftt-stack-inner"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div className="ftt-stack-header">The inference stack — presented vs. actual</div>

        <div className="ftt-stack-layers">
          {elements.map((el, i) => {
            const delay = i * 0.1;

            if (el.type === "layer") {
              const layer = layers[el.index];
              return (
                <div
                  key={`layer-${layer.num}`}
                  className="ftt-stack-layer"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
                  }}
                >
                  <div className="ftt-stack-presented">
                    <span className="ftt-stack-presented-label">Presented as</span>
                    {layer.presented}
                  </div>
                  <div className="ftt-stack-name">
                    <span className="ftt-stack-name-num">{layer.num}</span>
                    {layer.name}
                  </div>
                  <div className="ftt-stack-actual">
                    <span className="ftt-stack-actual-label">Actually is</span>
                    {layer.actual}
                  </div>
                </div>
              );
            }

            const boundary = boundaries[el.index];
            return (
              <div
                key={`boundary-${el.index}`}
                className="ftt-stack-boundary"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.4s ease ${delay}s`,
                }}
              >
                <div className="ftt-stack-boundary-line" />
                <div className="ftt-stack-boundary-text">{boundary.label}</div>
                <div className="ftt-stack-boundary-line2" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
