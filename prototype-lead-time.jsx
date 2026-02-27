import { useState, useRef, useEffect, useCallback } from "react";

// ─── Design tokens (matching thbrdy.dev global.css) ───
const tokens = {
  bg: "#FAF6F0",
  bgWarm: "#F4EFE7",
  bgCard: "#EFEBE4",
  bgDark: "#1C1A17",
  bgDarkMid: "#2A2722",
  text: "#2C2416",
  textMid: "#4A3D30",
  textLight: "#6B5D4F",
  textMuted: "#9B8E80",
  textFaint: "#C4B8AA",
  accent: "#B8860B",
  accentDim: "rgba(184, 134, 11, 0.08)",
  accentGlow: "rgba(184, 134, 11, 0.15)",
  border: "rgba(44, 36, 22, 0.1)",
  borderMid: "rgba(44, 36, 22, 0.18)",
  red: "#A63D2F",
  redDim: "rgba(166, 61, 47, 0.08)",
  green: "#4A7A4A",
  greenDim: "rgba(74, 122, 74, 0.08)",
  teal: "#2A7A6A",
  tealDim: "rgba(42, 122, 106, 0.08)",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── useInView hook ───
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Data: simulated lead time trajectory over 12 weeks ───
// Gap in minutes between biometric shift and conscious snap
const weekData = [
  { week: 0, gapMinutes: 45, label: "Week 1" },
  { week: 1, gapMinutes: 42, label: "Week 2" },
  { week: 2, gapMinutes: 38, label: "Week 3" },
  { week: 3, gapMinutes: 33, label: "Week 4" },
  { week: 4, gapMinutes: 28, label: "Week 5" },
  { week: 5, gapMinutes: 25, label: "Week 6" },
  { week: 6, gapMinutes: 21, label: "Week 7" },
  { week: 7, gapMinutes: 18, label: "Week 8" },
  { week: 8, gapMinutes: 16, label: "Week 9" },
  { week: 9, gapMinutes: 14, label: "Week 10" },
  { week: 10, gapMinutes: 12, label: "Week 11" },
  { week: 11, gapMinutes: 10, label: "Week 12" },
];

const MAX_GAP = 45;
const MIN_GAP = 10;

// Interpolate between weeks for smooth slider
function getGapAtProgress(progress) {
  const idx = progress * (weekData.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, weekData.length - 1);
  const t = idx - lo;
  return weekData[lo].gapMinutes + t * (weekData[hi].gapMinutes - weekData[lo].gapMinutes);
}

function getWeekLabel(progress) {
  const idx = Math.round(progress * (weekData.length - 1));
  return weekData[idx].label;
}

// ─── Component ───
export default function InteroceptiveLeadTime() {
  const [ref, inView] = useInView(0.1);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const gap = getGapAtProgress(progress);
  const weekLabel = getWeekLabel(progress);
  const gapPct = ((gap - MIN_GAP) / (MAX_GAP - MIN_GAP)) * 100;

  // Timeline bar dimensions
  const timelineWidth = 100; // percentage
  const biometricPos = 15; // percentage from left — body shift marker
  const snapPos = biometricPos + (gapPct * 0.65); // conscious snap moves closer as gap shrinks

  return (
    <div ref={ref} className="ilt-root" style={{ background: tokens.bg, padding: "48px 24px" }}>
      <style>{`
        .ilt-root {
          margin: 0 auto;
          max-width: 720px;
        }
        .ilt-slider-track {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: ${tokens.bgCard};
          outline: none;
          cursor: pointer;
        }
        .ilt-slider-track::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${tokens.accent};
          cursor: pointer;
          border: 2px solid ${tokens.bg};
          box-shadow: 0 1px 4px rgba(44, 36, 22, 0.15);
        }
        .ilt-slider-track::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${tokens.accent};
          cursor: pointer;
          border: 2px solid ${tokens.bg};
          box-shadow: 0 1px 4px rgba(44, 36, 22, 0.15);
        }
        .ilt-slider-track:focus-visible {
          outline: 2px solid ${tokens.accent};
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ilt-root, .ilt-root * {
            transition-duration: 0.01s !important;
          }
        }
        @media (max-width: 640px) {
          .ilt-timeline-labels {
            font-size: 10px !important;
          }
          .ilt-gap-number {
            font-size: 48px !important;
          }
        }
        @media (max-width: 420px) {
          .ilt-gap-number {
            font-size: 36px !important;
          }
        }
      `}</style>

      {/* Section header */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
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
          Interoceptive Lead Time
        </div>
        <div style={{
          fontFamily: tokens.serif,
          fontSize: "26px",
          fontWeight: 400,
          color: tokens.text,
          lineHeight: 1.3,
          maxWidth: "520px",
          margin: "0 auto",
        }}>
          The gap between when your body shifts and when you notice
        </div>
      </div>

      {/* Central number — the gap */}
      <div style={{
        textAlign: "center",
        marginBottom: "12px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.2s",
      }}>
        <div className="ilt-gap-number" style={{
          fontFamily: tokens.mono,
          fontSize: "64px",
          fontWeight: 300,
          color: tokens.accent,
          lineHeight: 1,
          transition: "color 0.3s ease",
        }}>
          {Math.round(gap)}
          <span style={{ fontSize: "24px", fontWeight: 400, color: tokens.textMuted, marginLeft: "6px" }}>min</span>
        </div>
        <div style={{
          fontFamily: tokens.sans,
          fontSize: "13px",
          color: tokens.textMuted,
          marginTop: "6px",
        }}>
          average lead time · {weekLabel}
        </div>
      </div>

      {/* Timeline visualization */}
      <div style={{
        position: "relative",
        height: "120px",
        margin: "32px 0 24px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.35s",
      }}>
        {/* Timeline bar */}
        <div style={{
          position: "absolute",
          top: "50px",
          left: "8%",
          right: "8%",
          height: "2px",
          background: tokens.borderMid,
        }} />

        {/* Body shift marker */}
        <div style={{
          position: "absolute",
          left: `${biometricPos}%`,
          top: "28px",
          transform: "translateX(-50%)",
          textAlign: "center",
          transition: "left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: tokens.red,
            margin: "0 auto 0",
            boxShadow: `0 0 0 4px ${tokens.redDim}`,
          }} />
          <div style={{
            position: "absolute",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "14px",
            background: tokens.borderMid,
          }} />
          <div className="ilt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            fontWeight: 600,
            color: tokens.red,
            marginTop: "44px",
            whiteSpace: "nowrap",
          }}>
            Body shifts
          </div>
          <div className="ilt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "10px",
            color: tokens.textMuted,
            marginTop: "2px",
            whiteSpace: "nowrap",
          }}>
            HRV drops
          </div>
        </div>

        {/* Gap bracket */}
        <div style={{
          position: "absolute",
          left: `${biometricPos}%`,
          width: `${snapPos - biometricPos}%`,
          top: "46px",
          height: "10px",
          borderLeft: `1px dashed ${tokens.accent}40`,
          borderRight: `1px dashed ${tokens.accent}40`,
          borderBottom: `1px dashed ${tokens.accent}40`,
          borderRadius: "0 0 4px 4px",
          transition: "width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          <div style={{
            position: "absolute",
            bottom: "-20px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: tokens.mono,
            fontSize: "10px",
            color: tokens.accent,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: gapPct > 15 ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}>
            the gap
          </div>
        </div>

        {/* Conscious snap marker */}
        <div style={{
          position: "absolute",
          left: `${snapPos}%`,
          top: "28px",
          transform: "translateX(-50%)",
          textAlign: "center",
          transition: "left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: tokens.teal,
            margin: "0 auto 0",
            boxShadow: `0 0 0 4px ${tokens.tealDim}`,
          }} />
          <div style={{
            position: "absolute",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "14px",
            background: tokens.borderMid,
          }} />
          <div className="ilt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            fontWeight: 600,
            color: tokens.teal,
            marginTop: "44px",
            whiteSpace: "nowrap",
          }}>
            You notice
          </div>
          <div className="ilt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "10px",
            color: tokens.textMuted,
            marginTop: "2px",
            whiteSpace: "nowrap",
          }}>
            Frame Snap
          </div>
        </div>
      </div>

      {/* Scrub slider */}
      <div style={{
        maxWidth: "480px",
        margin: "40px auto 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.5s",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontFamily: tokens.sans,
          fontSize: "11px",
          color: tokens.textMuted,
        }}>
          <span>Week 1</span>
          <span style={{
            fontFamily: tokens.mono,
            fontSize: "11px",
            color: tokens.accent,
            letterSpacing: "1px",
          }}>
            drag to scrub through time →
          </span>
          <span>Week 12</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => setProgress(parseFloat(e.target.value))}
          className="ilt-slider-track"
          aria-label="Weeks of practice"
          aria-valuenow={Math.round(progress * 11) + 1}
          aria-valuemin={1}
          aria-valuemax={12}
        />
      </div>

      {/* Interpretive caption — changes with progress */}
      <div style={{
        textAlign: "center",
        marginTop: "28px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.65s",
        maxWidth: "480px",
        margin: "28px auto 0",
      }}>
        <div style={{
          fontFamily: tokens.serif,
          fontSize: "16px",
          fontStyle: "italic",
          color: tokens.textLight,
          lineHeight: 1.5,
          minHeight: "48px",
        }}>
          {progress < 0.15
            ? "Your body shifts 45 minutes before you consciously notice. That gap is your interoceptive lead time."
            : progress < 0.4
            ? "The gap is narrowing. You're starting to notice shifts sooner — not because you're monitoring harder, but because the capacity is developing."
            : progress < 0.7
            ? "Twenty minutes. The body still leads, but you're catching up. Each snap trains the recognition."
            : progress < 0.9
            ? "Fifteen minutes. The subjective read and the biometric data are converging. Your felt sense is becoming a reliable instrument."
            : "Ten minutes. You notice almost as soon as your body shifts. The scaffold has done its work."
          }
        </div>
      </div>

      {/* Research grounding */}
      <div style={{
        textAlign: "center",
        marginTop: "28px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.8s",
      }}>
        <div style={{
          fontFamily: tokens.sans,
          fontSize: "12px",
          color: tokens.textMuted,
          lineHeight: 1.5,
          maxWidth: "420px",
          margin: "0 auto",
        }}>
          No other product measures this. Notice collects both data streams — continuous biometrics and discrete conscious reports — making the temporal correlation visible for the first time at ecological scale.
        </div>
      </div>
    </div>
  );
}
