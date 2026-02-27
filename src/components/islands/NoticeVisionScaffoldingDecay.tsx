import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Phase data ───
const phases = [
  {
    label: "Full Support",
    widthPct: 35,
    opacity: 0.22,
    description: "Reflections after every snap. Active felt-sense suggestions. Full biometric context.",
    mono: "Weeks 1\u20138",
  },
  {
    label: "Reduced",
    widthPct: 35,
    opacity: 0.12,
    description: "Reflections shift to on-demand. Suggestions fade. Biometrics simplify to trend arrows.",
    mono: "Months 3\u20136",
  },
  {
    label: "Minimal",
    widthPct: 30,
    opacity: 0.05,
    description: "No automatic reflections. The app becomes a quiet archive you consult when you choose.",
    mono: "Month 6+",
  },
];

export default function NoticeVisionScaffoldingDecay() {
  const [ref, inView] = useInView(0.1);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  return (
    <div ref={ref} className="nvsd-root">
      <style>{`
        .nvsd-root {
          margin: 48px auto;
          max-width: 720px;
          padding: 0;
        }
        .nvsd-phases {
          display: flex;
          gap: 2px;
          border-radius: 8px;
          overflow: hidden;
        }
        .nvsd-detail-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }
        @media (max-width: 640px) {
          .nvsd-detail-cards {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nvsd-root, .nvsd-root * {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "36px",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
          marginBottom: "10px",
        }}>
          Scaffolding Decay
        </div>
        <div style={{
          fontFamily: tokens.serif,
          fontSize: "26px",
          fontWeight: 400,
          color: tokens.text,
          lineHeight: 1.3,
          maxWidth: "460px",
          margin: "0 auto",
        }}>
          The app gets quieter as you get better
        </div>
      </div>

      {/* Decay gradient bar */}
      <div style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.2s",
      }}>
        <div className="nvsd-phases" style={{ height: "56px" }}>
          {phases.map((phase, i) => (
            <div
              key={phase.label}
              onMouseEnter={() => setHoveredPhase(i)}
              onMouseLeave={() => setHoveredPhase(null)}
              style={{
                width: `${phase.widthPct}%`,
                background: `rgba(184, 134, 11, ${phase.opacity})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                position: "relative",
                opacity: inView ? 1 : 0,
                transform: inView ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left center",
                transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + i * 0.15}s`,
                outline: hoveredPhase === i ? `2px solid ${tokens.accent}` : "2px solid transparent",
                outlineOffset: "-2px",
                borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : "0",
              }}
            >
              <div style={{
                fontFamily: tokens.sans,
                fontSize: "12px",
                fontWeight: 600,
                color: i === 2 ? tokens.textFaint : tokens.textMid,
                letterSpacing: "0.5px",
              }}>
                {phase.label}
              </div>
            </div>
          ))}
        </div>

        {/* Axis labels */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "12px",
          padding: "0 4px",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease 0.7s",
        }}>
          <div style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            color: tokens.textMuted,
          }}>
            &larr; App presence
          </div>
          <div style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            color: tokens.textMuted,
          }}>
            User capacity &rarr;
          </div>
        </div>
      </div>

      {/* Phase detail cards */}
      <div className="nvsd-detail-cards" style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.6s",
      }}>
        {phases.map((phase, i) => (
          <div
            key={`card-${phase.label}`}
            onMouseEnter={() => setHoveredPhase(i)}
            onMouseLeave={() => setHoveredPhase(null)}
            style={{
              padding: "16px 18px",
              background: hoveredPhase === i ? tokens.bgWarm : tokens.bg,
              border: `1px solid ${hoveredPhase === i ? tokens.borderMid : tokens.border}`,
              borderRadius: "8px",
              transition: "all 0.25s ease",
            }}
          >
            <div style={{
              fontFamily: tokens.mono,
              fontSize: "10px",
              color: tokens.accent,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}>
              {phase.mono}
            </div>
            <div style={{
              fontFamily: tokens.sans,
              fontSize: "13px",
              fontWeight: 600,
              color: tokens.textMid,
              marginBottom: "6px",
            }}>
              {phase.label}
            </div>
            <div style={{
              fontFamily: tokens.sans,
              fontSize: "12px",
              color: tokens.textMuted,
              lineHeight: 1.5,
            }}>
              {phase.description}
            </div>
          </div>
        ))}
      </div>

      {/* Closing insight */}
      <div style={{
        textAlign: "center",
        fontFamily: tokens.serif,
        fontSize: "15px",
        fontStyle: "italic",
        color: tokens.textLight,
        lineHeight: 1.5,
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
        maxWidth: "420px",
        margin: "28px auto 0",
      }}>
        Phase transitions are triggered by behavioral signals and confirmed by the user. The app never decides for you that you are ready. It notices, and invites.
      </div>
    </div>
  );
}
