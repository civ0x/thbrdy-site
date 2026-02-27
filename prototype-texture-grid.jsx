import { useState, useRef, useEffect } from "react";

// ─── Design tokens (matching thbrdy.dev global.css) ───
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
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── Texture group data ───
const groups = [
  {
    name: "Alive",
    labels: ["energized", "excited", "vibrant"],
    color: "#C47A2A",
    dimBg: "rgba(196, 122, 42, 0.06)",
    borderTint: "rgba(196, 122, 42, 0.18)",
  },
  {
    name: "Settled",
    labels: ["calm", "grounded", "peaceful"],
    color: "#6B8E6B",
    dimBg: "rgba(107, 142, 107, 0.06)",
    borderTint: "rgba(107, 142, 107, 0.18)",
  },
  {
    name: "Open",
    labels: ["curious", "tender", "receptive"],
    color: "#5B7FA5",
    dimBg: "rgba(91, 127, 165, 0.06)",
    borderTint: "rgba(91, 127, 165, 0.18)",
  },
  {
    name: "Heavy",
    labels: ["weary", "sad", "numb"],
    color: "#7A6B8A",
    dimBg: "rgba(122, 107, 138, 0.06)",
    borderTint: "rgba(122, 107, 138, 0.18)",
  },
  {
    name: "Stirred",
    labels: ["restless", "anxious", "agitated"],
    color: "#B85C4A",
    dimBg: "rgba(184, 92, 74, 0.06)",
    borderTint: "rgba(184, 92, 74, 0.18)",
  },
  {
    name: "Tight",
    labels: ["frustrated", "guarded", "constricted"],
    color: "#8A7A6A",
    dimBg: "rgba(138, 122, 106, 0.06)",
    borderTint: "rgba(138, 122, 106, 0.18)",
  },
];

// ─── useInView hook (fire-once, reduced-motion aware) ───
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

// ─── Component ───
export default function NoticeTextureGrid() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="notice-texture-grid" style={{ background: tokens.bg, padding: "48px 24px" }}>
      <style>{`
        .notice-texture-grid {
          margin: 0 auto;
          max-width: 720px;
        }
        .ntg-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .ntg-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 420px) {
          .ntg-cards {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
          marginBottom: "10px",
        }}>
          Felt-Sense Taxonomy
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
          Eighteen labels, organized by where you feel them in your body
        </div>
      </div>

      {/* Card grid */}
      <div className="ntg-cards">
        {groups.map((group, i) => (
          <div
            key={group.name}
            style={{
              background: group.dimBg,
              border: `1px solid ${group.borderTint}`,
              borderRadius: "10px",
              padding: "20px 20px 18px",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(14px)",
              transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
            }}
          >
            {/* Group name */}
            <div style={{
              fontFamily: tokens.sans,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: group.color,
              marginBottom: "10px",
            }}>
              {group.name}
            </div>

            {/* Emotion labels */}
            <div style={{
              fontFamily: tokens.serif,
              fontSize: "17px",
              fontStyle: "italic",
              color: tokens.textMid,
              lineHeight: 1.6,
            }}>
              {group.labels.map((label, j) => (
                <span key={label}>
                  {label}{j < group.labels.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div style={{
        textAlign: "center",
        marginTop: "24px",
        fontFamily: tokens.serif,
        fontSize: "15px",
        fontStyle: "italic",
        color: tokens.textLight,
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 0.7s",
        maxWidth: "420px",
        margin: "24px auto 0",
        lineHeight: 1.5,
      }}>
        Grouped by somatic texture, not valence. Every snap is a micro-dose of affect labeling.
      </div>
    </div>
  );
}
