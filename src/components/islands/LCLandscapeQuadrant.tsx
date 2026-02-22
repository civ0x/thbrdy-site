import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── LC essay accent (local) ───
const LC = {
  accent: "#3A7CA5",
  accentFaint: "#3A7CA530",
  accentBg: "#3A7CA506",
};

const systems = [
  { id: "xla", label: "XLA", sub: "Google", x: 12, y: 76, color: tokens.textMuted, desc: "Sequential heuristic passes, single-space optimization per pass" },
  { id: "torchc", label: "torch.compile", sub: "Meta", x: 18, y: 66, color: tokens.textMuted, desc: "Min-cut partitioner implicitly couples fusion + remat, but still sequential" },
  { id: "alpa", label: "Alpa", sub: "Berkeley", x: 55, y: 60, color: "var(--teal)", desc: "Joint inter/intra-op parallelism via hierarchical ILP + DP (OSDI '22)" },
  { id: "unity", label: "Unity", sub: "CMU/Stanford", x: 52, y: 48, color: "var(--teal)", desc: "Joint algebraic transforms + parallelism via PCG representation (OSDI '22)" },
  { id: "go", label: "GO", sub: "NeurIPS '20", x: 52, y: 22, color: "var(--green)", desc: "GNN policy for joint device placement + fusion — closest prior art" },
  { id: "mlgo", label: "MLGO", sub: "Google", x: 18, y: 18, color: "var(--green)", desc: "Learned inlining in LLVM, production-deployed — single pass, but learned" },
  { id: "planner", label: "Joint Planner", sub: "Proposed", x: 85, y: 15, color: LC.accent, desc: "Learned GNN policy across all four decision spaces, hardware-conditioned" },
];

export default function LCLandscapeQuadrant() {
  const [ref, inView] = useInView(0.15);
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredSys = hovered ? systems.find((s) => s.id === hovered) : null;

  return (
    <div ref={ref} className="lc-landscape">
      <style>{`
        .lc-landscape {
          margin: 3rem 0;
        }
        .lc-landscape-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .lc-landscape-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${LC.accent};
          margin-bottom: 0.5rem;
        }
        .lc-landscape-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .lc-landscape-field {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border: 1px solid ${tokens.border};
          border-radius: 12px;
          background: ${tokens.bgWarm};
          overflow: hidden;
        }
        .lc-landscape-axis-x {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
        }
        .lc-landscape-axis-y {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
          white-space: nowrap;
        }
        @media (max-width: 420px) {
          .lc-landscape-axis-y {
            display: none;
          }
          .lc-landscape-axis-y-mobile {
            display: block;
            position: absolute;
            left: 8px;
            top: 8px;
            font-family: ${tokens.sans};
            font-size: 0.5625rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: ${tokens.textFaint};
          }
        }
        @media (min-width: 421px) {
          .lc-landscape-axis-y-mobile {
            display: none;
          }
        }
        .lc-landscape-tick {
          position: absolute;
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
        }
        .lc-landscape-target {
          position: absolute;
          right: 4%;
          top: 4%;
          width: 28%;
          height: 38%;
          border-radius: 12px;
          border: 1.5px dashed ${LC.accentFaint};
          background: transparent;
        }
        .lc-landscape-dot-wrap {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }
        .lc-landscape-dot {
          border-radius: 50%;
          transition: box-shadow 0.2s ease;
        }
        .lc-landscape-dot-label {
          position: absolute;
          top: -6px;
          left: calc(100% + 8px);
          white-space: nowrap;
        }
        .lc-landscape-dot-name {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
        }
        .lc-landscape-dot-sub {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
        }
        .lc-landscape-detail {
          max-width: 580px;
          margin: 1rem auto 0;
          padding: 0.75rem 1.25rem;
          min-height: 44px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .lc-landscape-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        .lc-landscape-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          font-style: italic;
          text-align: center;
        }
        .lc-landscape-divider-v {
          position: absolute;
          left: 38%;
          top: 0;
          bottom: 40px;
          width: 1px;
          background: ${tokens.border};
          opacity: 0.5;
        }
        .lc-landscape-divider-h {
          position: absolute;
          top: 45%;
          left: 32px;
          right: 0;
          height: 1px;
          background: ${tokens.border};
          opacity: 0.5;
        }
      `}</style>

      <div className="lc-landscape-header">
        <p className="lc-landscape-eyebrow">Research Landscape</p>
        <h3 className="lc-landscape-title">The quadrant no one occupies.</h3>
      </div>

      <div
        className="lc-landscape-field"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Axis labels */}
        <div className="lc-landscape-axis-x">Decision spaces coupled →</div>
        <div className="lc-landscape-axis-y">Optimization approach →</div>
        <div className="lc-landscape-axis-y-mobile">Approach ↓</div>

        {/* Y-axis ticks */}
        <div className="lc-landscape-tick" style={{ left: 32, top: "16%" }}>Learned</div>
        <div className="lc-landscape-tick" style={{ left: 32, top: "82%" }}>Heuristic</div>

        {/* X-axis ticks */}
        <div className="lc-landscape-tick" style={{ bottom: 28, left: "14%" }}>1</div>
        <div className="lc-landscape-tick" style={{ bottom: 28, left: "50%", transform: "translateX(-50%)" }}>2</div>
        <div className="lc-landscape-tick" style={{ bottom: 28, right: "10%" }}>4</div>

        {/* Quadrant dividers */}
        <div className="lc-landscape-divider-v" />
        <div className="lc-landscape-divider-h" />

        {/* Target zone */}
        <div
          className="lc-landscape-target"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        />

        {/* System dots */}
        {systems.map((sys, i) => {
          const isTarget = sys.id === "planner";
          const isHov = hovered === sys.id;
          const dotSize = isTarget ? 14 : 10;
          return (
            <div
              key={sys.id}
              className="lc-landscape-dot-wrap"
              style={{
                left: `${sys.x}%`,
                top: `${sys.y}%`,
                zIndex: isHov ? 10 : 2,
                opacity: inView ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + i * 0.1}s`,
              }}
              onMouseEnter={() => setHovered(sys.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="lc-landscape-dot"
                style={{
                  width: dotSize,
                  height: dotSize,
                  background: sys.color,
                  border: isTarget ? `3px solid ${LC.accentFaint}` : `2px solid ${tokens.bgWarm}`,
                  boxShadow: isHov ? `0 0 0 4px ${sys.color}25` : "none",
                }}
              />
              <div className="lc-landscape-dot-label">
                <p
                  className="lc-landscape-dot-name"
                  style={{
                    fontSize: isTarget ? "0.8125rem" : undefined,
                    fontWeight: isTarget ? 700 : undefined,
                    color: sys.color,
                  }}
                >
                  {sys.label}
                </p>
                <p className="lc-landscape-dot-sub">{sys.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover detail */}
      <div
        className="lc-landscape-detail"
        style={{
          background: hovered ? tokens.bgWarm : "transparent",
        }}
      >
        {hoveredSys ? (
          <p className="lc-landscape-detail-text">
            <strong style={{ color: hoveredSys.color }}>{hoveredSys.label}:</strong>{" "}
            {hoveredSys.desc}
          </p>
        ) : (
          <p className="lc-landscape-detail-placeholder">Hover a system to see details</p>
        )}
      </div>
    </div>
  );
}
