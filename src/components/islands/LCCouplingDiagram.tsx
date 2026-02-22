import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── LC essay accent (local) ───
const LC = {
  accent: "#3A7CA5",
  accentBg: "#3A7CA512",
  accentBorder: "#3A7CA550",
};

// ─── Inline SVG icons for decision space nodes ───
function LayersIcon({ size = 22, color = LC.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function GitBranchIcon({ size = 22, color = "var(--green)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function NetworkIcon({ size = 22, color = "var(--teal)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <line x1="12" y1="12" x2="12" y2="8" />
    </svg>
  );
}

function BinaryIcon({ size = 22, color = "var(--red)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="14" width="4" height="6" rx="2" />
      <rect x="6" y="4" width="4" height="6" rx="2" />
      <path d="M6 20v-4h4" />
      <path d="M14 10V4h4" />
    </svg>
  );
}

// ─── Data ───
type SpaceId = "fusion" | "remat" | "parallel" | "precision";

interface Space {
  id: SpaceId;
  label: string;
  icon: typeof LayersIcon;
  desc: string;
  color: string;
}

const spaces: Space[] = [
  { id: "fusion", label: "Operator Fusion", icon: LayersIcon, desc: "Which ops merge into single kernels", color: LC.accent },
  { id: "remat", label: "Rematerialization", icon: GitBranchIcon, desc: "Which activations to recompute vs. store", color: "var(--green)" },
  { id: "parallel", label: "Parallelism Strategy", icon: NetworkIcon, desc: "How work partitions across devices", color: "var(--teal)" },
  { id: "precision", label: "Numerical Precision", icon: BinaryIcon, desc: "FP32, BF16, FP8 per operation", color: "var(--red)" },
];

const couplings = [
  { a: "fusion" as SpaceId, b: "remat" as SpaceId, strength: 0.95, evidence: "12% throughput + 1.75× batch (MLSys '23)", label: "Strong" },
  { a: "fusion" as SpaceId, b: "parallel" as SpaceId, strength: 0.85, evidence: "2.73× speedup from joint reasoning (ASPLOS '22)", label: "Strong" },
  { a: "parallel" as SpaceId, b: "remat" as SpaceId, strength: 0.75, evidence: "Memory ↔ communication tradeoff (OSDI '22)", label: "Strong" },
  { a: "fusion" as SpaceId, b: "precision" as SpaceId, strength: 0.5, evidence: "Cast placement interacts with kernel boundaries", label: "Moderate" },
  { a: "parallel" as SpaceId, b: "precision" as SpaceId, strength: 0.55, evidence: "Precision determines communication volumes", label: "Moderate" },
  { a: "remat" as SpaceId, b: "precision" as SpaceId, strength: 0.35, evidence: "Precision changes activation memory sizes", label: "Indirect" },
];

const positions: Record<SpaceId, { x: number; y: number }> = {
  fusion: { x: 50, y: 10 },
  remat: { x: 10, y: 50 },
  parallel: { x: 90, y: 50 },
  precision: { x: 50, y: 90 },
};

export default function LCCouplingDiagram() {
  const [ref, inView] = useInView(0.15);
  const [hoveredPair, setHoveredPair] = useState<number | null>(null);

  const hoveredCoupling = hoveredPair !== null ? couplings[hoveredPair] : null;
  const hoveredSpaceA = hoveredCoupling ? spaces.find((s) => s.id === hoveredCoupling.a) : null;
  const hoveredSpaceB = hoveredCoupling ? spaces.find((s) => s.id === hoveredCoupling.b) : null;

  return (
    <div ref={ref} className="lc-coupling">
      <style>{`
        .lc-coupling {
          margin: 3rem 0;
        }
        .lc-coupling-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .lc-coupling-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${LC.accent};
          margin-bottom: 0.5rem;
        }
        .lc-coupling-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .lc-coupling-body {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .lc-coupling-diamond {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          aspect-ratio: 1;
        }
        .lc-coupling-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .lc-coupling-node {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }
        .lc-coupling-node-box {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 420px) {
          .lc-coupling-node-box {
            width: 44px;
            height: 44px;
            border-radius: 10px;
          }
          .lc-coupling-node-label {
            font-size: 0.6875rem !important;
          }
          .lc-coupling-node-desc {
            display: none;
          }
        }
        .lc-coupling-node-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 600;
          margin-top: 0.5rem;
          text-align: center;
          white-space: nowrap;
        }
        .lc-coupling-node-desc {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
          text-align: center;
          max-width: 130px;
          margin-top: 2px;
        }
        .lc-coupling-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 1;
        }
        .lc-coupling-center-text {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
        }
        .lc-coupling-detail {
          max-width: 580px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          border-radius: 0 8px 8px 0;
          min-height: 64px;
          transition: all 0.3s ease;
        }
        .lc-coupling-detail-names {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          color: ${LC.accent};
        }
        .lc-coupling-detail-badge {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .lc-coupling-detail-evidence {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        .lc-coupling-detail-placeholder {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          color: ${tokens.textFaint};
          font-style: italic;
        }
      `}</style>

      <div className="lc-coupling-header">
        <p className="lc-coupling-eyebrow">Decision Coupling</p>
        <h3 className="lc-coupling-title">
          Four decisions. Six pairwise interactions. All handled sequentially.
        </h3>
      </div>

      <div className="lc-coupling-body">
        {/* Diamond layout */}
        <div className="lc-coupling-diamond">
          {/* SVG coupling lines */}
          <svg className="lc-coupling-svg" viewBox="0 0 100 100">
            {couplings.map((c, i) => {
              const pa = positions[c.a];
              const pb = positions[c.b];
              const isHovered = hoveredPair === i;
              return (
                <g key={`${c.a}-${c.b}`}>
                  <line
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke={isHovered ? LC.accent : "var(--border-mid)"}
                    strokeWidth={isHovered ? c.strength * 2.5 : c.strength * 1.8}
                    strokeDasharray={c.strength < 0.5 ? "3 3" : "none"}
                    style={{
                      opacity: inView ? (isHovered ? 1 : 0.5) : 0,
                      transition: `all 0.6s ease ${0.3 + i * 0.08}s`,
                    }}
                  />
                  {/* Invisible wider hitbox */}
                  <line
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke="transparent"
                    strokeWidth="8"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredPair(i)}
                    onMouseLeave={() => setHoveredPair(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Space nodes */}
          {spaces.map((space, i) => {
            const pos = positions[space.id];
            const Icon = space.icon;
            return (
              <div
                key={space.id}
                className="lc-coupling-node"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: inView ? 1 : 0,
                  transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`,
                }}
              >
                <div
                  className="lc-coupling-node-box"
                  style={{
                    background: `${space.color}12`,
                    border: `1.5px solid ${space.color}50`,
                  }}
                >
                  <Icon color={space.color} />
                </div>
                <p className="lc-coupling-node-label" style={{ color: space.color }}>
                  {space.label}
                </p>
                <p className="lc-coupling-node-desc">{space.desc}</p>
              </div>
            );
          })}

          {/* Center label */}
          <div
            className="lc-coupling-center"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.6s ease 0.8s",
            }}
          >
            <p className="lc-coupling-center-text">
              Sequential<br />pipeline
            </p>
          </div>
        </div>

        {/* Coupling detail on hover */}
        <div
          className="lc-coupling-detail"
          style={{
            background: hoveredPair !== null ? tokens.bgWarm : "transparent",
            borderLeft: hoveredPair !== null ? `3px solid ${LC.accent}` : "3px solid transparent",
          }}
        >
          {hoveredCoupling && hoveredSpaceA && hoveredSpaceB ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="lc-coupling-detail-names">
                  {hoveredSpaceA.label} × {hoveredSpaceB.label}
                </span>
                <span
                  className="lc-coupling-detail-badge"
                  style={{
                    color: hoveredCoupling.strength > 0.7
                      ? "var(--green)"
                      : hoveredCoupling.strength > 0.45
                      ? LC.accent
                      : tokens.textMuted,
                    background: hoveredCoupling.strength > 0.7
                      ? "var(--green-dim)"
                      : hoveredCoupling.strength > 0.45
                      ? `${LC.accent}15`
                      : `${tokens.textMuted}10`,
                  }}
                >
                  {hoveredCoupling.label}
                </span>
              </div>
              <p className="lc-coupling-detail-evidence">{hoveredCoupling.evidence}</p>
            </>
          ) : (
            <p className="lc-coupling-detail-placeholder">
              Hover a coupling line to see the evidence
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
