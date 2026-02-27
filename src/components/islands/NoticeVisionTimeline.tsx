import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const milestones = [
  {
    time: "WEEK 1",
    description: "Validate Foundation Models on hardware. Incorporate beta feedback. Deploy API proxy. Begin on-device training pipeline.",
  },
  {
    time: "WEEK 2",
    description: "Ship on-device brief reflections. Implement scaffolding decay. Measure interoceptive lead time across beta cohort.",
  },
  {
    time: "WEEK 3+",
    description: "Expand beta. Launch notice.tools. App Store submission.",
  },
];

export default function NoticeVisionTimeline() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="nvtl-root">
      <style>{`
        .nvtl-root {
          margin: 48px auto;
          max-width: 600px;
          padding: 0;
        }
        .nvtl-item {
          display: grid;
          grid-template-columns: 20px 1fr;
          gap: 20px;
          position: relative;
        }
        @media (max-width: 420px) {
          .nvtl-item {
            gap: 14px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nvtl-root, .nvtl-root * {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {milestones.map((m, i) => (
          <div
            key={m.time}
            className="nvtl-item"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateX(0)" : "translateX(-16px)",
              transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
            }}
          >
            {/* Dot + line column */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: tokens.accent,
                flexShrink: 0,
                marginTop: "4px",
              }} />
              {i < milestones.length - 1 && (
                <div style={{
                  width: "1px",
                  flex: 1,
                  background: tokens.borderMid,
                  minHeight: "24px",
                }} />
              )}
            </div>

            {/* Content column */}
            <div style={{ paddingBottom: i < milestones.length - 1 ? "28px" : "0" }}>
              <div style={{
                fontFamily: tokens.mono,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: tokens.accent,
                marginBottom: "6px",
              }}>
                {m.time}
              </div>
              <div style={{
                fontFamily: tokens.sans,
                fontSize: "14px",
                color: tokens.textMid,
                lineHeight: 1.6,
              }}>
                {m.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
