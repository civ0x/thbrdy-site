import { useState, useEffect } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Local diagram colors ───
const GOLD = "#B8860B";
const ORANGE = "#C4713B";
const BROWN = "#8B6E5A";
const PURPLE = "#7C6F9B";

// ─── Inline SVG icons ───
function FingerprintIcon({ size = 24, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
      <path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 2 0 3.7 1 4.8 2.5" />
      <path d="M10 12c0 4-1 8-3 11" />
      <path d="M14 12c0 2.5-.5 5-1.5 7.5" />
      <path d="M17.5 8.5c.3 1 .5 2.2.5 3.5 0 1.5-.2 3-.5 4.5" />
      <path d="M22 12c0 1-.3 2.5-.7 4" />
    </svg>
  );
}

function ActivityIcon({ size = 24, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function EyeIcon({ size = 24, color = BROWN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SparklesIcon({ size = 24, color = PURPLE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

// ─── Step data ───
interface Step {
  icon: (props: { size?: number; color?: string }) => JSX.Element;
  label: string;
  sublabel: string;
  detail: string;
  color: string;
}

const steps: Step[] = [
  { icon: FingerprintIcon, label: "Tap", sublabel: "Notice a shift", detail: "Watch or iPhone", color: GOLD },
  { icon: ActivityIcon, label: "Capture", sublabel: "HR, HRV, context", detail: "HealthKit + EventKit + CoreLocation", color: ORANGE },
  { icon: EyeIcon, label: "Name", sublabel: "Describe, label, intensity", detail: "Subjective before objective", color: BROWN },
  { icon: SparklesIcon, label: "Reflect", sublabel: "See data + AI reflection", detail: "Claude streams contemplative response", color: PURPLE },
];

export function NoticeInteractionFlow() {
  const [ref, inView] = useInView(0.2);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const timers = [0, 1, 2, 3].map(i =>
      setTimeout(() => setActiveStep(i), 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="notice-flow">
      <style>{`
        .notice-flow {
          margin: 64px 0;
        }
        .notice-flow-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .notice-flow-steps {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0;
          max-width: 760px;
          margin: 0 auto;
        }
        .notice-flow-step {
          display: flex;
          align-items: flex-start;
        }
        .notice-flow-step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 140px;
        }
        .notice-flow-connector {
          display: flex;
          align-items: center;
          padding-top: 20px;
          width: 40px;
          justify-content: center;
        }
        @media (max-width: 640px) {
          .notice-flow-steps {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .notice-flow-step {
            flex-direction: column;
            align-items: center;
          }
          .notice-flow-step-content {
            width: 100%;
            max-width: 240px;
            flex-direction: row;
            gap: 16px;
          }
          .notice-flow-connector {
            width: auto;
            height: 24px;
            padding-top: 0;
          }
          .notice-flow-connector-line {
            width: 1px !important;
            height: 20px !important;
          }
        }
      `}</style>

      <div className="notice-flow-header">
        <p style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
        }}>
          Core Interaction
        </p>
        <h3 style={{
          fontFamily: tokens.serif,
          fontSize: "28px",
          fontWeight: 400,
          color: tokens.text,
          marginTop: "8px",
        }}>
          The Frame Snap
        </h3>
      </div>

      <div className="notice-flow-steps">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep >= i;
          return (
            <div key={step.label} className="notice-flow-step">
              <div className="notice-flow-step-content" style={{
                opacity: isActive ? 1 : 0.2,
                transform: isActive ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: isActive ? `${step.color}15` : "transparent",
                  border: `1.5px solid ${isActive ? step.color : "#D4C8B8"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.5s ease",
                  flexShrink: 0,
                }}>
                  <Icon size={24} color={isActive ? step.color : "#D4C8B8"} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{
                    fontFamily: tokens.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isActive ? step.color : "#CBBFB0",
                    marginTop: "12px",
                    transition: "color 0.5s ease",
                  }}>{step.label}</p>
                  <p style={{
                    fontFamily: tokens.sans,
                    fontSize: "12px",
                    color: isActive ? tokens.textLight : "#CBBFB0",
                    marginTop: "2px",
                    transition: "color 0.5s ease",
                  }}>{step.sublabel}</p>
                  <p style={{
                    fontFamily: tokens.serif,
                    fontSize: "11px",
                    fontStyle: "italic",
                    color: isActive ? tokens.textMuted : "transparent",
                    marginTop: "6px",
                    transition: "color 0.5s ease 0.2s",
                  }}>{step.detail}</p>
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="notice-flow-connector">
                  <div className="notice-flow-connector-line" style={{
                    width: "32px",
                    height: "1px",
                    background: activeStep > i
                      ? `linear-gradient(to right, ${steps[i].color}, ${steps[i + 1].color})`
                      : tokens.bgCard,
                    transition: "background 0.5s ease",
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key decision callout */}
      <div style={{
        maxWidth: "580px",
        margin: "40px auto 0",
        padding: "20px 24px",
        background: tokens.bgWarm,
        borderLeft: `3px solid ${tokens.accent}`,
        borderRadius: "0 8px 8px 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 2.5s",
      }}>
        <p style={{
          fontFamily: tokens.sans,
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: tokens.accent,
          marginBottom: "6px",
        }}>Key Design Decision</p>
        <p style={{
          fontFamily: tokens.serif,
          fontSize: "15px",
          lineHeight: 1.7,
          color: tokens.text,
        }}>
          You commit your subjective assessment <em>before</em> you see the biometric data. You say "I feel tense" and then discover your HRV is 22ms below your weekly average. Over time, that feedback loop trains calibration between felt sense and physiology.
        </p>
      </div>
    </div>
  );
}
