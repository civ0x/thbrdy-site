import { useState, useRef, useEffect } from "react";

// ─── Design tokens ───
const tokens = {
  bg: "#FAF6F0",
  bgWarm: "#F4EFE7",
  bgCard: "#EFEBE4",
  text: "#2C2416",
  textMid: "#4A3D30",
  textLight: "#6B5D4F",
  textMuted: "#9B8E80",
  textFaint: "#C4B8AA",
  accent: "#B8860B",
  accentDim: "rgba(184, 134, 11, 0.08)",
  border: "rgba(44, 36, 22, 0.1)",
  borderMid: "rgba(44, 36, 22, 0.18)",
  green: "#4A7A4A",
  greenDim: "rgba(74, 122, 74, 0.06)",
  blue: "#2A5A8A",
  blueDim: "rgba(42, 90, 138, 0.06)",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── useInView ───
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

// ─── Ring data (innermost first) ───
const rings = [
  {
    label: "Individual Interoception",
    timing: "now",
    color: tokens.accent,
    dimBg: tokens.accentDim,
    borderColor: "rgba(184, 134, 11, 0.25)",
    radiusPct: 20,
    description: "You learn to read your own internal states: noticing shifts, labeling felt sense, seeing patterns.",
  },
  {
    label: "Relational Attunement",
    timing: "later",
    color: tokens.green,
    dimBg: tokens.greenDim,
    borderColor: "rgba(74, 122, 74, 0.2)",
    radiusPct: 38,
    description: "Co-regulation extends the mirror to the space between two people. Staged with kill criteria at each phase.",
  },
  {
    label: "Collective Field Awareness",
    timing: "speculative",
    color: tokens.blue,
    dimBg: tokens.blueDim,
    borderColor: "rgba(42, 90, 138, 0.15)",
    radiusPct: 56,
    description: "If dyadic co-regulation works, the same architecture extends to small groups — a sangha, a therapy group, a team.",
  },
];

// ─── Component ───
export default function CategoryExpansionRings() {
  const [ref, inView] = useInView(0.1);
  const [hoveredRing, setHoveredRing] = useState(null);

  return (
    <div ref={ref} className="cer-root" style={{ background: tokens.bg, padding: "48px 24px" }}>
      <style>{`
        .cer-root {
          margin: 0 auto;
          max-width: 720px;
        }
        .cer-ring-area {
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          aspect-ratio: 1 / 1;
        }
        .cer-detail-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 32px;
        }
        @media (max-width: 640px) {
          .cer-ring-area {
            max-width: 300px;
          }
          .cer-detail-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .cer-ring-label {
            font-size: 11px !important;
          }
        }
        @media (max-width: 420px) {
          .cer-ring-area {
            max-width: 240px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cer-root, .cer-root * {
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
          Category Expansion
        </div>
        <div style={{
          fontFamily: tokens.serif,
          fontSize: "26px",
          fontWeight: 400,
          color: tokens.text,
          lineHeight: 1.3,
          maxWidth: "480px",
          margin: "0 auto",
        }}>
          Each ring is gated by the one inside it
        </div>
      </div>

      {/* Concentric rings */}
      <div className="cer-ring-area">
        {/* Render outermost first so inner rings paint on top */}
        {[...rings].reverse().map((ring, reverseIdx) => {
          const i = rings.length - 1 - reverseIdx; // actual index (0=inner)
          const size = ring.radiusPct * 2;
          const isHovered = hoveredRing === i;

          return (
            <div
              key={ring.label}
              onMouseEnter={() => setHoveredRing(i)}
              onMouseLeave={() => setHoveredRing(null)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${size}%`,
                aspectRatio: "1",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                background: ring.dimBg,
                border: `1.5px solid ${ring.borderColor}`,
                opacity: inView ? 1 : 0,
                transition: `all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.25}s`,
                cursor: "default",
                boxShadow: isHovered ? `0 0 0 3px ${ring.borderColor}` : "none",
              }}
            />
          );
        })}

        {/* Labels on rings */}
        {rings.map((ring, i) => {
          // Inner ring: centered in circle. Outer rings: near top of their ring.
          const isInner = i === 0;
          const topPos = isInner ? "50%" : `${50 - ring.radiusPct + 6}%`;
          const yTransform = isInner ? "translate(-50%, -50%)" : "translateX(-50%)";
          return (
            <div
              key={`label-${ring.label}`}
              onMouseEnter={() => setHoveredRing(i)}
              onMouseLeave={() => setHoveredRing(null)}
              style={{
                position: "absolute",
                left: "50%",
                top: topPos,
                transform: yTransform,
                textAlign: "center",
                opacity: inView ? 1 : 0,
                transition: `opacity 0.5s ease ${0.5 + i * 0.2}s`,
                zIndex: 10,
                pointerEvents: "auto",
              }}
            >
              <div className="cer-ring-label" style={{
                fontFamily: tokens.sans,
                fontSize: "12px",
                fontWeight: 600,
                color: ring.color,
                whiteSpace: "nowrap",
              }}>
                {ring.label}
              </div>
              <div style={{
                fontFamily: tokens.mono,
                fontSize: "10px",
                color: tokens.textMuted,
                letterSpacing: "1px",
                marginTop: "2px",
              }}>
                {ring.timing}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail cards below */}
      <div className="cer-detail-row" style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.5s ease 0.9s",
      }}>
        {rings.map((ring, i) => (
          <div
            key={`detail-${ring.label}`}
            onMouseEnter={() => setHoveredRing(i)}
            onMouseLeave={() => setHoveredRing(null)}
            style={{
              padding: "16px 18px",
              background: hoveredRing === i ? tokens.bgWarm : tokens.bg,
              border: `1px solid ${hoveredRing === i ? tokens.borderMid : tokens.border}`,
              borderRadius: "8px",
              borderTop: `3px solid ${ring.color}`,
              transition: "all 0.25s ease",
            }}
          >
            <div style={{
              fontFamily: tokens.mono,
              fontSize: "10px",
              color: ring.color,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}>
              {ring.timing}
            </div>
            <div style={{
              fontFamily: tokens.sans,
              fontSize: "13px",
              fontWeight: 600,
              color: tokens.textMid,
              marginBottom: "6px",
            }}>
              {ring.label}
            </div>
            <div style={{
              fontFamily: tokens.sans,
              fontSize: "12px",
              color: tokens.textMuted,
              lineHeight: 1.5,
            }}>
              {ring.description}
            </div>
          </div>
        ))}
      </div>

      {/* Closing note */}
      <div style={{
        textAlign: "center",
        marginTop: "28px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 1.1s",
        maxWidth: "460px",
        margin: "28px auto 0",
      }}>
        <div style={{
          fontFamily: tokens.sans,
          fontSize: "12px",
          color: tokens.textMuted,
          lineHeight: 1.5,
        }}>
          At the individual level, Notice competes with mood trackers and meditation apps. At the relational level, there are no competitors. At the collective level, the field does not exist yet.
        </div>
      </div>
    </div>
  );
}
