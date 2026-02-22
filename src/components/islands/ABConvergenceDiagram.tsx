import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Framework {
  author: string;
  domain: string;
  year: string;
  label: string;
  orient: string;
  execute: string;
  reflect: string;
}

interface Layer {
  name: string;
  desc: string;
  color: string;
}

const frameworks: Framework[] = [
  {
    author: "Pólya",
    domain: "Mathematics",
    year: "1945",
    label: "How to Solve It",
    orient: "Understand the problem",
    execute: "Carry out the plan",
    reflect: "Look back",
  },
  {
    author: "Boyd",
    domain: "Military strategy",
    year: "1961",
    label: "OODA Loop",
    orient: "Observe → Orient",
    execute: "Decide → Act",
    reflect: "Feedback loop",
  },
  {
    author: "U.S. Army",
    domain: "Training doctrine",
    year: "1970s",
    label: "Crawl-Walk-Run",
    orient: "Crawl",
    execute: "Walk",
    reflect: "Run + AAR",
  },
  {
    author: "Bloom",
    domain: "Education research",
    year: "1984",
    label: "Mastery Learning",
    orient: "Diagnostic assessment",
    execute: "Instructional unit",
    reflect: "Formative feedback",
  },
  {
    author: "Gee",
    domain: "Game design / literacy",
    year: "2003",
    label: "Learning Principles",
    orient: "Situated meaning",
    execute: "Probe → Hypothesize → Reprobe",
    reflect: "Identity principle",
  },
];

// Diagram-internal semantic colors (not part of global palette)
const EXECUTE_COLOR = "#2A5A8A";
const REFLECT_COLOR = "#6B5D8A";

const layers: Layer[] = [
  { name: "Orient", desc: "Understand before you act", color: tokens.accent },
  { name: "Execute", desc: "Small, complete, verifiable loops", color: EXECUTE_COLOR },
  { name: "Reflect", desc: "Ratchet understanding forward", color: REFLECT_COLOR },
];

export function ABConvergenceDiagram() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="ab-convergence" style={{ maxWidth: "720px", margin: "48px auto" }}>
      <style>{`
        .ab-convergence-fw-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2px;
        }
        .ab-convergence-table {
          display: grid;
          grid-template-columns: 140px repeat(5, 1fr);
          gap: 1px;
        }
        .ab-convergence-table-label-inner { display: flex; }
        .ab-convergence-mobile-cards { display: none; }
        @media (max-width: 640px) {
          .ab-convergence-fw-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .ab-convergence-table {
            display: none;
          }
          .ab-convergence-mobile-cards {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
        @media (max-width: 420px) {
          .ab-convergence-fw-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Framework nodes */}
      <div className="ab-convergence-fw-grid">
        {frameworks.map((fw, i) => (
          <div
            key={fw.author}
            style={{
              padding: "16px 12px",
              background: inView ? tokens.accentDim : "transparent",
              borderRadius:
                i === 0 ? "8px 0 0 0" : i === 4 ? "0 8px 0 0" : "0",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "13px",
                fontWeight: 600,
                color: tokens.accent,
                marginBottom: "4px",
              }}
            >
              {fw.author}
            </p>
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "10px",
                letterSpacing: "0.5px",
                color: tokens.textMuted,
                marginBottom: "2px",
              }}
            >
              {fw.domain}
            </p>
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "10px",
                color: tokens.textFaint,
              }}
            >
              {fw.year}
            </p>
          </div>
        ))}
      </div>

      {/* Convergence arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "8px 0",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}
      >
        <svg width="200" height="24" viewBox="0 0 200 24" fill="none">
          <path
            d="M10 2 L100 20 M50 2 L100 20 M100 2 L100 20 M150 2 L100 20 M190 2 L100 20"
            stroke={tokens.accent}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
          <circle cx="100" cy="20" r="3" fill={tokens.accent} fillOpacity="0.4" />
        </svg>
      </div>

      {/* Three-layer structure — desktop table */}
      <div
        className="ab-convergence-table-wrap"
        style={{
          border: `1px solid ${tokens.accentGlow}`,
          borderRadius: "8px",
          overflow: "hidden",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s",
        }}
      >
        {/* Header row */}
        <div className="ab-convergence-table" style={{ background: tokens.border }}>
          <div style={{ background: tokens.bg, padding: "12px 16px" }}>
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: tokens.textLight,
              }}
            >
              Structure
            </p>
          </div>
          {frameworks.map((fw) => (
            <div
              key={`h-${fw.author}`}
              style={{
                background: tokens.bg,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: tokens.sans,
                  fontSize: "11px",
                  fontWeight: 600,
                  color: tokens.textMuted,
                }}
              >
                {fw.author}
              </p>
            </div>
          ))}
        </div>

        {/* Layer rows */}
        {layers.map((layer, li) => (
          <div
            key={layer.name}
            className="ab-convergence-table"
            style={{ background: tokens.border }}
          >
            <div
              style={{
                background: tokens.bg,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: layer.color,
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: tokens.sans,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: tokens.text,
                  }}
                >
                  {layer.name}
                </p>
                <p
                  style={{
                    fontFamily: tokens.sans,
                    fontSize: "10px",
                    color: tokens.textLight,
                    marginTop: "2px",
                  }}
                >
                  {layer.desc}
                </p>
              </div>
            </div>
            {frameworks.map((fw) => {
              const val = li === 0 ? fw.orient : li === 1 ? fw.execute : fw.reflect;
              return (
                <div
                  key={`${layer.name}-${fw.author}`}
                  style={{
                    background: tokens.bg,
                    padding: "14px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: tokens.serif,
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: tokens.textMuted,
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {val}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile cards — shown when table is hidden */}
      <div
        className="ab-convergence-mobile-cards"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s",
        }}
      >
        {layers.map((layer) => (
          <div
            key={layer.name}
            style={{
              border: `1px solid ${tokens.accentGlow}`,
              borderRadius: "8px",
              padding: "16px",
              background: tokens.bg,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: layer.color,
                  flexShrink: 0,
                }}
              />
              <p style={{ fontFamily: tokens.sans, fontSize: "13px", fontWeight: 600, color: tokens.text }}>
                {layer.name}
              </p>
              <p style={{ fontFamily: tokens.sans, fontSize: "10px", color: tokens.textLight }}>
                — {layer.desc}
              </p>
            </div>
            {frameworks.map((fw) => {
              const li = layers.indexOf(layer);
              const val = li === 0 ? fw.orient : li === 1 ? fw.execute : fw.reflect;
              return (
                <div
                  key={fw.author}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "6px 0",
                    borderBottom: `1px solid ${tokens.border}`,
                  }}
                >
                  <span style={{ fontFamily: tokens.sans, fontSize: "11px", fontWeight: 600, color: tokens.textMuted }}>
                    {fw.author}
                  </span>
                  <span style={{ fontFamily: tokens.serif, fontSize: "12px", fontStyle: "italic", color: tokens.textMuted, textAlign: "right" }}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: tokens.sans,
          fontSize: "11px",
          color: tokens.textLight,
          textAlign: "center",
          marginTop: "16px",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 1s",
        }}
      >
        Five frameworks, five domains, eight decades — same three-layer structure
      </p>
    </div>
  );
}
