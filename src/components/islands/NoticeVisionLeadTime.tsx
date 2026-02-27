import { useState } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Data: simulated lead time trajectory over 12 weeks ───
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

function getGapAtProgress(progress: number): number {
  const idx = progress * (weekData.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, weekData.length - 1);
  const t = idx - lo;
  return weekData[lo].gapMinutes + t * (weekData[hi].gapMinutes - weekData[lo].gapMinutes);
}

function getWeekLabel(progress: number): string {
  const idx = Math.round(progress * (weekData.length - 1));
  return weekData[idx].label;
}

function getCaption(progress: number): string {
  if (progress < 0.15)
    return "Your body shifts 45 minutes before you consciously notice. That gap is your interoceptive lead time.";
  if (progress < 0.4)
    return "The gap is narrowing. You\u2019re starting to notice shifts sooner \u2014 not because you\u2019re monitoring harder, but because the capacity is developing.";
  if (progress < 0.7)
    return "Twenty minutes. The body still leads, but you\u2019re catching up. Each snap trains the recognition.";
  if (progress < 0.9)
    return "Fifteen minutes. The subjective read and the biometric data are converging. Your felt sense is becoming a reliable instrument.";
  return "Ten minutes. You notice almost as soon as your body shifts. The scaffold has done its work.";
}

export default function NoticeVisionLeadTime() {
  const [ref, inView] = useInView(0.1);
  const [progress, setProgress] = useState(0);

  const gap = getGapAtProgress(progress);
  const weekLabel = getWeekLabel(progress);
  const gapPct = ((gap - MIN_GAP) / (MAX_GAP - MIN_GAP)) * 100;

  const biometricPos = 15;
  const snapPos = biometricPos + (gapPct * 0.65);

  return (
    <div ref={ref} className="nvlt-root">
      <style>{`
        .nvlt-root {
          margin: 48px auto;
          max-width: 720px;
          padding: 0;
        }
        .nvlt-slider-track {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: ${tokens.bgCard};
          outline: none;
          cursor: pointer;
        }
        .nvlt-slider-track::-webkit-slider-thumb {
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
        .nvlt-slider-track::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${tokens.accent};
          cursor: pointer;
          border: 2px solid ${tokens.bg};
          box-shadow: 0 1px 4px rgba(44, 36, 22, 0.15);
        }
        .nvlt-slider-track:focus-visible {
          outline: 2px solid ${tokens.accent};
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          .nvlt-root, .nvlt-root * {
            transition-duration: 0.01s !important;
          }
        }
        @media (max-width: 640px) {
          .nvlt-timeline-labels {
            font-size: 10px !important;
          }
          .nvlt-gap-number {
            font-size: 48px !important;
          }
        }
        @media (max-width: 420px) {
          .nvlt-gap-number {
            font-size: 36px !important;
          }
        }
      `}</style>

      {/* Header */}
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

      {/* Central number */}
      <div style={{
        textAlign: "center",
        marginBottom: "12px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.2s",
      }}>
        <div className="nvlt-gap-number" style={{
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
          average lead time &middot; {weekLabel}
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
          <div className="nvlt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            fontWeight: 600,
            color: tokens.red,
            marginTop: "44px",
            whiteSpace: "nowrap",
          }}>
            Body shifts
          </div>
          <div className="nvlt-timeline-labels" style={{
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
          borderLeft: `1px dashed rgba(184, 134, 11, 0.25)`,
          borderRight: `1px dashed rgba(184, 134, 11, 0.25)`,
          borderBottom: `1px dashed rgba(184, 134, 11, 0.25)`,
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
          <div className="nvlt-timeline-labels" style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            fontWeight: 600,
            color: tokens.teal,
            marginTop: "44px",
            whiteSpace: "nowrap",
          }}>
            You notice
          </div>
          <div className="nvlt-timeline-labels" style={{
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
            drag to scrub through time &rarr;
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
          className="nvlt-slider-track"
          aria-label="Weeks of practice"
          aria-valuenow={Math.round(progress * 11) + 1}
          aria-valuemin={1}
          aria-valuemax={12}
        />
      </div>

      {/* Interpretive caption */}
      <div style={{
        textAlign: "center",
        maxWidth: "480px",
        margin: "28px auto 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.65s",
      }}>
        <div style={{
          fontFamily: tokens.serif,
          fontSize: "16px",
          fontStyle: "italic",
          color: tokens.textLight,
          lineHeight: 1.5,
          minHeight: "48px",
        }}>
          {getCaption(progress)}
        </div>
      </div>

      {/* Research grounding */}
      <div style={{
        textAlign: "center",
        margin: "28px auto 0",
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
