import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Local diagram colors ───
const PURPLE = "#7C6F9B";

// ─── Data ───
interface Session {
  week: string;
  label: string;
  desc: string;
  highlight: boolean;
}

const sessions: Session[] = [
  { week: "Days 1–2", label: "Design", desc: "Foundation doc, CLAUDE.md, DECISIONS.md — before any code", highlight: true },
  { week: "Day 3 AM", label: "Core", desc: "Scaffold, SwiftData, HealthKit, WatchConnectivity, emotion picker", highlight: false },
  { week: "Day 3 Mid", label: "AI Layer", desc: "Claude API, streaming SSE, contemplative system prompt, reflections", highlight: true },
  { week: "Day 3 PM", label: "Watch + Polish", desc: "Watch app, ensō tap, haptic feedback, visual identity, onboarding", highlight: false },
  { week: "Day 4", label: "Ship", desc: "Hardware smoke test, TestFlight submission, external beta live", highlight: true },
  { week: "Day 5", label: "Expand", desc: "Phone snap FAB, voice/Siri intent, taxonomy → 18 labels + felt-sense textures", highlight: false },
  { week: "Day 5+", label: "On-device AI", desc: "Foundation Models integration, felt-sense interpreter, context assembly tools", highlight: true },
];

export function NoticeBuildTimeline() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="notice-timeline">
      <style>{`
        .notice-timeline {
          margin: 64px 0;
        }
        .notice-timeline-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .notice-timeline-body {
          max-width: 640px;
          margin: 0 auto;
          position: relative;
        }
        .notice-timeline-line {
          position: absolute;
          left: 79px;
          top: 8px;
          bottom: 8px;
          width: 1px;
        }
        .notice-timeline-entry {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }
        .notice-timeline-week {
          width: 64px;
          text-align: right;
          padding-top: 4px;
          flex-shrink: 0;
        }
        .notice-timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
          z-index: 1;
        }
        @media (max-width: 420px) {
          .notice-timeline-line {
            left: 59px;
          }
          .notice-timeline-week {
            width: 44px;
            font-size: 10px !important;
          }
          .notice-timeline-entry {
            gap: 12px;
          }
        }
      `}</style>

      <div className="notice-timeline-header">
        <p style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
        }}>
          Development
        </p>
        <h3 style={{
          fontFamily: tokens.serif,
          fontSize: "28px",
          fontWeight: 400,
          color: tokens.text,
          marginTop: "8px",
        }}>
          Zero Swift experience to TestFlight beta. Three days.
        </h3>
        <p style={{
          fontFamily: tokens.sans,
          fontSize: "13px",
          color: tokens.textMuted,
          marginTop: "6px",
        }}>
          Built with Claude Agent in Xcode 26.3 · Design-first methodology · 14 session-scoped goals
        </p>
      </div>

      <div className="notice-timeline-body">
        {/* Vertical line */}
        <div className="notice-timeline-line" style={{
          background: inView
            ? `linear-gradient(to bottom, #D4A043, ${PURPLE})`
            : tokens.bgCard,
          transition: "background 1s ease 0.3s",
        }} />

        {sessions.map((s, i) => (
          <div key={s.label} className="notice-timeline-entry" style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-12px)",
            transition: `all 0.4s ease ${0.2 + i * 0.08}s`,
          }}>
            <p className="notice-timeline-week" style={{
              fontFamily: tokens.sans,
              fontSize: "11px",
              color: tokens.textMuted,
            }}>{s.week}</p>

            <div className="notice-timeline-dot" style={{
              background: s.highlight ? tokens.accent : tokens.bgCard,
              border: s.highlight
                ? "2px solid rgba(212, 160, 67, 0.25)"
                : `2px solid ${tokens.bgWarm}`,
            }} />

            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: tokens.sans,
                fontSize: "13px",
                fontWeight: 600,
                color: s.highlight ? tokens.accent : tokens.textMid,
              }}>{s.label}</p>
              <p style={{
                fontFamily: tokens.sans,
                fontSize: "12px",
                color: tokens.textMuted,
                marginTop: "2px",
              }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
