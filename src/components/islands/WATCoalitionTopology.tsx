import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

/**
 * WATCoalitionTopology — Interactive topology diagram for "The Wrong Axis" essay.
 *
 * Two states toggled by "Visible" / "Invisible":
 * A) "Visible" — The conventional framing everyone uses. Government vs Industry.
 * B) "Invisible" — The hidden structure. Two poles: Encoded values vs Inherited values,
 *    with OpenAI and Google contested in the middle, government as terrain.
 *
 * The irony is deliberate: the "visible" framing is the one that hides the real structure.
 */

type View = "visible" | "invisible";

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ── Node data ── */

interface TopoNode {
  id: string;
  label: string;
  sublabel?: string;
  visible: { x: number; y: number; opacity: number };
  invisible: { x: number; y: number; opacity: number };
  color: "accent" | "teal" | "blue" | "red" | "muted";
  kind: "actor" | "bridge" | "terrain" | "contested";
}

const nodes: TopoNode[] = [
  // State A poles
  {
    id: "gov",
    label: "Government",
    sublabel: "Regulator / referee",
    visible: { x: 18, y: 50, opacity: 1 },
    invisible: { x: 50, y: 60, opacity: 1 },
    color: "muted",
    kind: "terrain",
  },
  {
    id: "industry",
    label: "Industry",
    sublabel: "Labs + defense tech + capital",
    visible: { x: 82, y: 50, opacity: 1 },
    invisible: { x: 50, y: 50, opacity: 0 },
    color: "muted",
    kind: "actor",
  },

  // 9 o'clock — Anthropic, far from circle (Encoded pole, anchored)
  {
    id: "anthropic",
    label: "Anthropic",
    visible: { x: 75, y: 35, opacity: 0 },
    invisible: { x: 10, y: 50, opacity: 1 },
    color: "teal",
    kind: "actor",
  },

  // 7 o'clock — OpenAI, closer to circle (contested)
  {
    id: "openai",
    label: "OpenAI",
    visible: { x: 78, y: 50, opacity: 0 },
    invisible: { x: 22, y: 76, opacity: 1 },
    color: "accent",
    kind: "contested",
  },

  // 6 o'clock — Google DeepMind, overlapping circle edge (contested)
  {
    id: "google",
    label: "Google DeepMind",
    visible: { x: 78, y: 65, opacity: 0 },
    invisible: { x: 50, y: 88, opacity: 1 },
    color: "accent",
    kind: "contested",
  },

  // 11 o'clock — Founders Fund
  {
    id: "founders",
    label: "Founders Fund",
    visible: { x: 80, y: 80, opacity: 0 },
    invisible: { x: 38, y: 14, opacity: 1 },
    color: "blue",
    kind: "bridge",
  },

  // 1 o'clock — a16z / American Dynamism
  {
    id: "a16z",
    label: "a16z",
    sublabel: "American Dynamism",
    visible: { x: 80, y: 80, opacity: 0 },
    invisible: { x: 68, y: 14, opacity: 1 },
    color: "blue",
    kind: "bridge",
  },

  // 3 o'clock — Anduril
  {
    id: "anduril",
    label: "Anduril",
    sublabel: "Autonomous weapons",
    visible: { x: 85, y: 35, opacity: 0 },
    invisible: { x: 90, y: 50, opacity: 1 },
    color: "red",
    kind: "actor",
  },

  // 4 o'clock — Palantir
  {
    id: "palantir",
    label: "Palantir",
    sublabel: "Surveillance",
    visible: { x: 85, y: 55, opacity: 0 },
    invisible: { x: 82, y: 76, opacity: 1 },
    color: "red",
    kind: "actor",
  },
];

/* ── Edge data ── */

interface TopoEdge {
  from: string;
  to: string;
  showIn: View;
  dashed?: boolean;
}

const edges: TopoEdge[] = [
  // State A: single tension line
  { from: "gov", to: "industry", showIn: "visible" },

  // State B: Inherited cluster (Thiel co-founded Palantir, invested in Anduril)
  { from: "palantir", to: "anduril", showIn: "invisible", dashed: true },

  // State B: Capital bridges (Thiel network — touches everything)
  { from: "founders", to: "anthropic", showIn: "invisible", dashed: true },
  { from: "founders", to: "openai", showIn: "invisible", dashed: true },
  { from: "founders", to: "google", showIn: "invisible", dashed: true },
  { from: "founders", to: "palantir", showIn: "invisible", dashed: true },
  { from: "founders", to: "anduril", showIn: "invisible", dashed: true },
  // State B: Capital bridges (a16z — notably excludes Anthropic)
  { from: "a16z", to: "openai", showIn: "invisible", dashed: true },
  { from: "a16z", to: "palantir", showIn: "invisible", dashed: true },
  { from: "a16z", to: "anduril", showIn: "invisible", dashed: true },
];

/* ── Color helpers ── */

function nodeColor(color: TopoNode["color"]): string {
  switch (color) {
    case "accent": return tokens.accent;
    case "teal": return tokens.teal;
    case "blue": return tokens.blue;
    case "red": return tokens.red;
    case "muted": return tokens.textMuted;
  }
}

function nodeBg(color: TopoNode["color"]): string {
  switch (color) {
    case "accent": return tokens.accentDim;
    case "teal": return tokens.tealDim;
    case "blue": return tokens.blueDim;
    case "red": return tokens.redDim;
    case "muted": return tokens.bgWarm;
  }
}

function nodeBorder(color: TopoNode["color"]): string {
  switch (color) {
    case "accent": return "rgba(184, 134, 11, 0.3)";
    case "teal": return "rgba(42, 122, 106, 0.3)";
    case "blue": return "rgba(42, 90, 138, 0.3)";
    case "red": return "rgba(166, 61, 47, 0.3)";
    case "muted": return "rgba(44, 36, 22, 0.1)";
  }
}

/* ── Component ── */

export default function WATCoalitionTopology() {
  const [ref, inView] = useInView(0.15);
  const [view, setView] = useState<View>("visible");
  const [hasToggled, setHasToggled] = useState(false);

  const isInvisible = view === "invisible";

  const handleToggle = (v: View) => {
    setView(v);
    if (!hasToggled) setHasToggled(true);
  };

  return (
    <div ref={ref} className="wat-topo-root">
      <style>{`
        .wat-topo-root {
          max-width: 720px;
          margin: 2.5rem auto;
        }
        .wat-topo-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .wat-topo-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin: 0 0 0.5rem;
        }
        .wat-topo-title {
          font-family: ${tokens.serif};
          font-size: 1.4rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }

        /* Toggle */
        .wat-topo-toggle {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 1.5rem;
        }
        .wat-topo-toggle-btn {
          font-family: ${tokens.mono};
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 20px;
          border: 1px solid ${tokens.borderMid};
          background: ${tokens.bgWarm};
          color: ${tokens.textMuted};
          cursor: pointer;
          transition: background 0.3s ${ease}, color 0.3s ${ease}, border-color 0.3s ${ease};
        }
        .wat-topo-toggle-btn:first-child {
          border-radius: 4px 0 0 4px;
          border-right: none;
        }
        .wat-topo-toggle-btn:last-child {
          border-radius: 0 4px 4px 0;
        }
        .wat-topo-toggle-btn--active {
          background: ${tokens.accentDim};
          color: ${tokens.accent};
          border-color: rgba(184, 134, 11, 0.3);
        }
        .wat-topo-toggle-btn:hover:not(.wat-topo-toggle-btn--active) {
          background: ${tokens.bgCard};
        }

        /* Interaction hint */
        .wat-topo-hint {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: ${tokens.textMuted};
          text-align: center;
          margin: -0.75rem 0 0.75rem;
        }

        /* Canvas */
        .wat-topo-canvas {
          position: relative;
          width: 100%;
          height: 340px;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          overflow: hidden;
        }

        /* Terrain zone (State B) */
        .wat-topo-terrain {
          position: absolute;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1.5px dashed ${tokens.textFaint};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.7s ${ease}, width 0.7s ${ease}, height 0.7s ${ease};
        }
        .wat-topo-terrain-label {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          font-weight: 500;
          color: ${tokens.textFaint};
          text-transform: uppercase;
          letter-spacing: 0.15em;
          text-align: center;
        }

        /* Cluster labels */
        .wat-topo-cluster-label {
          position: absolute;
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: opacity 0.5s ${ease};
        }

        /* Node */
        .wat-topo-node {
          position: absolute;
          transform: translate(-50%, -50%);
          padding: 6px 12px;
          border-radius: 5px;
          text-align: center;
          min-width: 80px;
          transition: left 0.7s ${ease}, top 0.7s ${ease}, opacity 0.7s ${ease}, transform 0.7s ${ease};
        }
        .wat-topo-node-label {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.3;
        }
        .wat-topo-node-sub {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          margin: 1px 0 0;
          line-height: 1.3;
        }

        /* Edge label (State A) */
        .wat-topo-edge-label {
          position: absolute;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          font-family: ${tokens.sans};
          font-size: 0.65rem;
          font-style: italic;
          color: ${tokens.textMuted};
          white-space: nowrap;
          transition: opacity 0.5s ${ease};
        }

        /* Annotation */
        .wat-topo-annotation {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          color: ${tokens.textLight};
          font-style: italic;
          text-align: center;
          max-width: 480px;
          margin: 1.5rem auto 0;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .wat-topo-canvas {
            height: 300px;
          }
          .wat-topo-node {
            min-width: 64px;
            padding: 5px 8px;
          }
          .wat-topo-node-label {
            font-size: 0.65rem;
          }
          .wat-topo-node-sub {
            font-size: 0.55rem;
          }
        }
        @media (max-width: 420px) {
          .wat-topo-canvas {
            height: 340px;
          }
          .wat-topo-node {
            min-width: 56px;
            padding: 4px 6px;
          }
          .wat-topo-node-label {
            font-size: 0.6rem;
          }
          .wat-topo-node-sub {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wat-topo-node,
          .wat-topo-terrain,
          .wat-topo-toggle-btn,
          .wat-topo-cluster-label,
          .wat-topo-edge-label {
            transition: none;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="wat-topo-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="wat-topo-eyebrow">Power Topology</div>
        <h3 className="wat-topo-title">
          {isInvisible
            ? "Encoded values vs. inherited power."
            : "Government regulates. Industry innovates."}
        </h3>
      </div>

      {/* Toggle */}
      <div
        className="wat-topo-toggle"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.5s ${ease} 0.2s`,
        }}
      >
        <button
          className={`wat-topo-toggle-btn${!isInvisible ? " wat-topo-toggle-btn--active" : ""}`}
          onClick={() => handleToggle("visible")}
        >
          Visible
        </button>
        <button
          className={`wat-topo-toggle-btn${isInvisible ? " wat-topo-toggle-btn--active" : ""}`}
          onClick={() => handleToggle("invisible")}
        >
          Invisible
        </button>
      </div>

      {/* Interaction hint — fades out after first toggle */}
      <div
        className="wat-topo-hint"
        style={{
          opacity: inView && !hasToggled ? 0.6 : 0,
          transition: `opacity 0.5s ${ease}`,
        }}
      >
        Toggle to reveal the hidden structure
      </div>

      {/* Canvas */}
      <div
        className="wat-topo-canvas"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.3s`,
        }}
      >
        {/* SVG edge layer */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!;
            const toNode = nodes.find((n) => n.id === edge.to)!;
            const pos = isInvisible ? "invisible" : "visible";
            const show = edge.showIn === view;
            const x1 = fromNode[pos].x;
            const y1 = fromNode[pos].y;
            const x2 = toNode[pos].x;
            const y2 = toNode[pos].y;

            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={show ? "rgba(44, 36, 22, 0.15)" : "rgba(44, 36, 22, 0)"}
                strokeWidth={edge.showIn === "visible" ? 2 : 1}
                strokeDasharray={edge.dashed ? "4 4" : "none"}
                style={{
                  transition: `all 0.7s ${ease}`,
                }}
              />
            );
          })}
        </svg>

        {/* Contested terrain zone (State B) — Gov node sits inside */}
        <div
          className="wat-topo-terrain"
          style={{
            opacity: isInvisible ? 0.5 : 0,
            width: isInvisible ? "36%" : "0%",
            height: isInvisible ? "52%" : "0%",
          }}
        >
        </div>
        {/* "Contested terrain" unboxed label above Gov node */}
        <div
          className="wat-topo-terrain-label"
          style={{
            position: "absolute",
            left: "50%",
            top: "38%",
            transform: "translate(-50%, -50%)",
            opacity: isInvisible ? 0.6 : 0,
            transition: `opacity 0.7s ${ease}`,
          }}
        >
          Contested terrain
        </div>

        {/* Edge label for State A */}
        <div
          className="wat-topo-edge-label"
          style={{ opacity: !isInvisible ? 0.8 : 0 }}
        >
          regulation vs. innovation
        </div>

        {/* Pole labels (State B) */}
        <div
          className="wat-topo-cluster-label"
          style={{
            left: "4%",
            top: "6%",
            color: tokens.teal,
            opacity: isInvisible ? 0.7 : 0,
          }}
        >
          Encoded
        </div>
        <div
          className="wat-topo-cluster-label"
          style={{
            right: "4%",
            top: "6%",
            color: tokens.red,
            opacity: isInvisible ? 0.7 : 0,
            textAlign: "right",
          }}
        >
          Inherited
        </div>

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = isInvisible ? node.invisible : node.visible;
          const isVisible = pos.opacity > 0;
          const isTerrain = node.kind === "terrain" && isInvisible;
          const isContested = node.kind === "contested";

          return (
            <div
              key={node.id}
              className="wat-topo-node"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                opacity: isVisible ? 1 : 0,
                background: nodeBg(node.color),
                border: isContested && isInvisible
                  ? `1px dashed ${nodeBorder(node.color)}`
                  : `1px solid ${nodeBorder(node.color)}`,
                pointerEvents: isVisible ? "auto" : "none",
              }}
            >
              <div
                className="wat-topo-node-label"
                style={{ color: nodeColor(node.color) }}
              >
                {node.label}
              </div>
              {isTerrain ? (
                <div
                  className="wat-topo-node-sub"
                  style={{ color: tokens.textFaint }}
                >
                  Not an actor
                </div>
              ) : node.sublabel ? (
                <div
                  className="wat-topo-node-sub"
                  style={{ color: tokens.textMuted }}
                >
                  {node.sublabel}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Annotation */}
      <div
        className="wat-topo-annotation"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 0.6s, transform 0.6s ${ease} 0.6s`,
        }}
      >
        {isInvisible
          ? "The same capital funds both sides. The divide is governance philosophy, not economics."
          : "The map everyone uses. Government on one side, industry on the other."}
      </div>
    </div>
  );
}
