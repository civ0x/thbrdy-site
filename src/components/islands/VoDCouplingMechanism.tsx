import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const readings = [
  { role: "Researcher", text: "Translation of my capability into language others can evaluate", color: "var(--teal)", bg: "rgba(42, 122, 106, 0.06)", bgHover: "rgba(42, 122, 106, 0.12)", cls: "researcher" },
  { role: "Product Lead", text: "Feature proposal with customer need and competitive positioning", color: "var(--green)", bg: "rgba(74, 122, 74, 0.06)", bgHover: "rgba(74, 122, 74, 0.12)", cls: "product" },
  { role: "Engineer", text: "System spec with architecture constraints and build cost", color: "var(--blue)", bg: "rgba(42, 90, 138, 0.06)", bgHover: "rgba(42, 90, 138, 0.12)", cls: "engineer" },
  { role: "Executive", text: "Investment case with risk profile and expected return", color: "var(--accent)", bg: "rgba(184, 134, 11, 0.06)", bgHover: "rgba(184, 134, 11, 0.12)", cls: "executive" },
];

const constraints = [
  { pair: "Research ↔ Customer", text: "Technical capability determines what problems become solvable" },
  { pair: "Research ↔ Engineering", text: "Research approach constrains implementation architecture" },
  { pair: "Research ↔ Business", text: "Novelty determines competitive positioning" },
  { pair: "Customer ↔ Engineering", text: "Customer requirements set performance targets" },
  { pair: "Customer ↔ Business", text: "Market size justifies investment" },
  { pair: "Engineering ↔ Business", text: "Build complexity determines timeline and cost" },
];

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDCouplingMechanism() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="vod-coupling-root">
      <style>{`
        .vod-coupling-root {
          max-width: 680px;
          margin: 2.5rem auto;
        }
        .vod-coupling-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .vod-coupling-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-coupling-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }

        /* ─── Document card ─── */
        .vod-coupling-doc-container {
          max-width: 520px;
          margin: 0 auto 0;
        }
        .vod-coupling-doc {
          background: ${tokens.bg};
          border: 1px solid ${tokens.borderMid};
          border-radius: 10px;
          padding: 28px 32px 24px;
          box-shadow: 0 2px 16px rgba(44, 36, 22, 0.06);
        }
        .vod-coupling-doc-label {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          color: ${tokens.text};
          margin: 0 0 2px;
        }
        .vod-coupling-doc-sublabel {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin: 0 0 20px;
        }
        .vod-coupling-doc-lines {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .vod-coupling-doc-line {
          height: 2px;
          border-radius: 1px;
          background: ${tokens.border};
        }

        /* ─── Lens grid ─── */
        .vod-coupling-lenses {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          margin-top: 16px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid ${tokens.border};
        }
        .vod-coupling-lens {
          padding: 16px 18px;
          cursor: default;
          transition: background 0.3s ease;
        }
        .vod-coupling-lens-role {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0 0 4px;
        }
        .vod-coupling-lens-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          font-style: italic;
          line-height: 1.4;
          margin: 0;
        }
        .vod-coupling-lens--researcher { background: rgba(42, 122, 106, 0.06); }
        .vod-coupling-lens--researcher .vod-coupling-lens-role { color: var(--teal); }
        .vod-coupling-lens--researcher:hover { background: rgba(42, 122, 106, 0.12); }

        .vod-coupling-lens--product { background: rgba(74, 122, 74, 0.06); }
        .vod-coupling-lens--product .vod-coupling-lens-role { color: var(--green); }
        .vod-coupling-lens--product:hover { background: rgba(74, 122, 74, 0.12); }

        .vod-coupling-lens--engineer { background: rgba(42, 90, 138, 0.06); }
        .vod-coupling-lens--engineer .vod-coupling-lens-role { color: var(--blue); }
        .vod-coupling-lens--engineer:hover { background: rgba(42, 90, 138, 0.12); }

        .vod-coupling-lens--executive { background: rgba(184, 134, 11, 0.06); }
        .vod-coupling-lens--executive .vod-coupling-lens-role { color: var(--accent); }
        .vod-coupling-lens--executive:hover { background: rgba(184, 134, 11, 0.12); }

        /* ─── Constraint grid ─── */
        .vod-coupling-constraint-section {
          margin-top: 2rem;
        }
        .vod-coupling-constraint-label {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          text-align: center;
          margin: 0 0 12px;
        }
        .vod-coupling-constraints {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .vod-coupling-constraint {
          padding: 10px 14px;
          border-radius: 6px;
          background: ${tokens.bgWarm};
          border-left: 3px solid transparent;
          transition: border-left-color 0.25s ease, background 0.25s ease;
        }
        .vod-coupling-constraint:hover {
          border-left-color: ${tokens.accent};
          background: ${tokens.bgCard};
        }
        .vod-coupling-constraint-pair {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 600;
          color: ${tokens.text};
          margin: 0 0 2px;
        }
        .vod-coupling-constraint-text {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          color: ${tokens.textMuted};
          line-height: 1.4;
          margin: 0;
        }

        /* ─── Callout ─── */
        .vod-coupling-callout {
          margin-top: 2rem;
          padding: 14px 18px;
          background: ${tokens.accentDim};
          border-left: 3px solid ${tokens.accent};
          border-radius: 0 6px 6px 0;
        }
        .vod-coupling-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          margin: 0;
          line-height: 1.6;
        }

        /* ─── Responsive ─── */
        @media (max-width: 640px) {
          .vod-coupling-lenses {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 420px) {
          .vod-coupling-lenses {
            grid-template-columns: 1fr;
          }
          .vod-coupling-constraints {
            grid-template-columns: 1fr;
          }
          .vod-coupling-doc {
            padding: 20px 20px 18px;
          }
        }
      `}</style>

      <div className="vod-coupling-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="vod-coupling-eyebrow">Boundary Object</div>
        <h3 className="vod-coupling-title">One document. Four readings.</h3>
      </div>

      {/* Document card + lens grid */}
      <div className="vod-coupling-doc-container">
        <div className="vod-coupling-doc"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 0.5s ${ease} 0s, transform 0.5s ${ease} 0s`,
          }}
        >
          <div className="vod-coupling-doc-label">PR/FAQ</div>
          <div className="vod-coupling-doc-sublabel">Coupling Device</div>
          <div className="vod-coupling-doc-lines">
            <div className="vod-coupling-doc-line" style={{ width: "92%" }} />
            <div className="vod-coupling-doc-line" style={{ width: "78%" }} />
            <div className="vod-coupling-doc-line" style={{ width: "85%" }} />
            <div className="vod-coupling-doc-line" style={{ width: "65%" }} />
            <div className="vod-coupling-doc-line" style={{ width: "88%" }} />
            <div className="vod-coupling-doc-line" style={{ width: "55%" }} />
          </div>
        </div>

        <div className="vod-coupling-lenses"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.5s ${ease} 0.3s`,
          }}
        >
          {readings.map((r, i) => (
            <div
              key={r.role}
              className={`vod-coupling-lens vod-coupling-lens--${r.cls}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.4s ${ease} ${0.3 + i * 0.1}s, transform 0.4s ${ease} ${0.3 + i * 0.1}s, background 0.3s ease`,
              }}
            >
              <div className="vod-coupling-lens-role">{r.role}</div>
              <div className="vod-coupling-lens-text">&ldquo;{r.text}&rdquo;</div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraint grid */}
      <div className="vod-coupling-constraint-section"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.5s ${ease} 0.8s, transform 0.5s ${ease} 0.8s`,
        }}
      >
        <div className="vod-coupling-constraint-label">Bidirectional Constraints</div>
        <div className="vod-coupling-constraints">
          {constraints.map((c) => (
            <div key={c.pair} className="vod-coupling-constraint">
              <div className="vod-coupling-constraint-pair">{c.pair}</div>
              <div className="vod-coupling-constraint-text">{c.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Callout */}
      <div className="vod-coupling-callout"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 0.6s ${ease} 1.2s, transform 0.6s ${ease} 1.2s`,
        }}
      >
        <div className="vod-coupling-callout-text">
          The narrative forces joint articulation. Changing any constraint changes all others.
          The PR/FAQ isn&rsquo;t a communication device — it&rsquo;s a <em>coupling</em> device.
        </div>
      </div>
    </div>
  );
}
