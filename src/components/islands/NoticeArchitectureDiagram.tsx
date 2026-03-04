import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";
import { icons } from "./shared/device-icons";

// ─── Local diagram colors ───
const PURPLE = "#7C6F9B";
const GREEN = "#5B8A72";
const BROWN = "#8B6E5A";
const ORANGE = "#C4713B";

// ─── Data ───
interface ToolItem {
  icon: keyof typeof icons;
  label: string;
  desc: string;
}

const onDeviceTools: ToolItem[] = [
  { icon: "heart", label: "HealthKit", desc: "HR, HRV, 7-day trends" },
  { icon: "calendar", label: "EventKit", desc: "Calendar context ±2h" },
  { icon: "mapPin", label: "CoreLocation", desc: "Semantic location" },
  { icon: "activity", label: "SwiftData", desc: "Recent snap patterns" },
];

const cloudCapabilities = [
  "Longitudinal pattern analysis",
  "Contemplative reframing",
  "Scaffolding-aware reflection",
  "Dam Model vocabulary",
];

export function NoticeArchitectureDiagram() {
  const [ref, inView] = useInView(0.15);
  const [hoveredTier, setHoveredTier] = useState<"device" | "cloud" | null>(null);

  return (
    <div ref={ref} className="notice-arch">
      <style>{`
        .notice-arch {
          margin: 64px 0;
        }
        .notice-arch-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .notice-arch-tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .notice-arch-cloud-caps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .notice-arch-boundary-info {
          display: flex;
          justify-content: center;
          gap: 32px;
          padding: 8px 20px 12px;
        }
        @media (max-width: 640px) {
          .notice-arch-tools-grid {
            grid-template-columns: 1fr;
          }
          .notice-arch-cloud-caps {
            grid-template-columns: 1fr;
          }
          .notice-arch-boundary-info {
            flex-direction: column;
            gap: 8px;
            align-items: center;
          }
        }
      `}</style>

      <div className="notice-arch-header">
        <p style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
        }}>
          Architecture
        </p>
        <h3 style={{
          fontFamily: tokens.serif,
          fontSize: "28px",
          fontWeight: 400,
          color: tokens.text,
          marginTop: "8px",
        }}>
          Privacy by design. AI at two scales.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}>
        {/* On-Device Tier */}
        <div
          onMouseEnter={() => setHoveredTier("device")}
          onMouseLeave={() => setHoveredTier(null)}
          style={{
            padding: "28px 32px",
            background: hoveredTier === "device" ? tokens.bg : tokens.bgWarm,
            borderRadius: "16px 16px 0 0",
            border: `1px solid ${tokens.bgCard}`,
            borderBottom: "none",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${tokens.text}, ${tokens.textMid})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {icons.smartphone({ size: 18, color: "#D4A043" })}
            </div>
            <div>
              <p style={{ fontFamily: tokens.sans, fontSize: "15px", fontWeight: 600, color: tokens.text }}>
                On-Device — The Read
              </p>
              <p style={{ fontFamily: tokens.sans, fontSize: "12px", color: tokens.textMuted }}>
                Apple Foundation Models · ~3B parameters · Free, offline, no API keys
              </p>
            </div>
          </div>

          <div className="notice-arch-tools-grid">
            {onDeviceTools.map((tool, i) => (
              <div key={tool.label} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                background: tokens.bg,
                borderRadius: "8px",
                border: `1px solid ${tokens.bgCard}`,
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
              }}>
                {icons[tool.icon]({ size: 16, color: BROWN })}
                <div>
                  <p style={{ fontFamily: tokens.sans, fontSize: "12px", fontWeight: 600, color: tokens.textMid }}>
                    {tool.label}
                  </p>
                  <p style={{ fontFamily: tokens.sans, fontSize: "11px", color: tokens.textMuted }}>
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Felt-Sense Interpreter */}
          <div style={{
            marginTop: "14px",
            padding: "10px 14px",
            background: tokens.bg,
            borderRadius: "8px",
            border: `1px solid ${tokens.bgCard}`,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 0.7s",
          }}>
            {icons.brain({ size: 16, color: PURPLE })}
            <div>
              <p style={{ fontFamily: tokens.sans, fontSize: "12px", fontWeight: 600, color: tokens.textMid }}>
                Felt-Sense Interpreter
              </p>
              <p style={{ fontFamily: tokens.sans, fontSize: "11px", color: tokens.textMuted }}>
                "Tight jaw, buzzy" → suggests <em>Stirred</em> texture group → matching labels
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Boundary */}
        <div style={{
          position: "relative",
          padding: "0",
          zIndex: 2,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "16px 0",
            background: tokens.bgWarm,
            borderLeft: `1px solid ${tokens.bgCard}`,
            borderRight: `1px solid ${tokens.bgCard}`,
          }}>
            <div style={{
              flex: 1,
              height: "1px",
              background: `repeating-linear-gradient(to right, ${ORANGE}, ${ORANGE} 6px, transparent 6px, transparent 12px)`,
            }} />
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: tokens.bg,
              borderRadius: "20px",
              border: `1.5px solid ${ORANGE}`,
              flexShrink: 0,
            }}>
              {icons.lock({ size: 13, color: ORANGE })}
              <span style={{
                fontFamily: tokens.sans,
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: ORANGE,
              }}>Privacy Boundary</span>
              {icons.shield({ size: 13, color: ORANGE })}
            </div>
            <div style={{
              flex: 1,
              height: "1px",
              background: `repeating-linear-gradient(to right, ${ORANGE}, ${ORANGE} 6px, transparent 6px, transparent 12px)`,
            }} />
          </div>

          {/* What crosses / what doesn't */}
          <div className="notice-arch-boundary-info" style={{
            background: tokens.bgWarm,
            borderLeft: `1px solid ${tokens.bgCard}`,
            borderRight: `1px solid ${tokens.bgCard}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {icons.x({ size: 12, color: ORANGE })}
              <span style={{ fontFamily: tokens.sans, fontSize: "11px", color: tokens.textMuted }}>
                Raw health data, calendar, contacts, location
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {icons.check({ size: 12, color: GREEN })}
              <span style={{ fontFamily: tokens.sans, fontSize: "11px", color: tokens.textMuted }}>
                De-identified structured summary only
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Tier */}
        <div
          onMouseEnter={() => setHoveredTier("cloud")}
          onMouseLeave={() => setHoveredTier(null)}
          style={{
            padding: "28px 32px",
            background: hoveredTier === "cloud" ? tokens.bg : tokens.bgWarm,
            borderRadius: "0 0 16px 16px",
            border: `1px solid ${tokens.bgCard}`,
            borderTop: "none",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${PURPLE}, #5A4E7A)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {icons.cloud({ size: 18, color: "#E8DFD4" })}
            </div>
            <div>
              <p style={{ fontFamily: tokens.sans, fontSize: "15px", fontWeight: 600, color: tokens.text }}>
                Cloud — The Reflection
              </p>
              <p style={{ fontFamily: tokens.sans, fontSize: "12px", color: tokens.textMuted }}>
                Claude API (Sonnet) · Streaming SSE · Contemplative system prompt
              </p>
            </div>
          </div>

          <div className="notice-arch-cloud-caps">
            {cloudCapabilities.map((cap, i) => (
              <div key={cap} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease ${0.8 + i * 0.1}s`,
              }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: PURPLE, flexShrink: 0 }} />
                <p style={{ fontFamily: tokens.sans, fontSize: "12px", color: tokens.textMid }}>{cap}</p>
              </div>
            ))}
          </div>

          {/* What Claude receives — dark code block */}
          <div style={{
            marginTop: "16px",
            padding: "14px 16px",
            background: tokens.bgDark,
            borderRadius: "8px",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 1.2s",
          }}>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: tokens.textMuted,
              marginBottom: "6px",
            }}>What Claude receives</p>
            <p style={{
              fontFamily: tokens.mono,
              fontSize: "12px",
              lineHeight: 1.6,
              color: tokens.textFaint,
            }}>
              <span style={{ color: "#D4A043" }}>emotion:</span> "tense" · <span style={{ color: "#D4A043" }}>intensity:</span> 0.7 · <span style={{ color: "#D4A043" }}>description:</span> "tight jaw, shoulders up"<br/>
              <span style={{ color: "#D4A043" }}>biometric:</span> HR elevated, HRV 22ms below weekly avg<br/>
              <span style={{ color: "#D4A043" }}>context:</span> "before a work meeting, third similar pattern this week"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
