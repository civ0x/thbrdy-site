import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Local diagram colors (not in global palette) ───
const PURPLE = "#7C6F9B";
const GREEN = "#5B8A72";
const BROWN = "#8B6E5A";

// ─── Inline SVG icons ───
function CheckIcon({ size = 14, color = GREEN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ size = 14, color = "#CBBFB0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Data ───
interface Category {
  name: string;
  examples: string;
  color: string;
  x: number;
  y: number;
}

const capabilities = [
  "Biometric sensing",
  "Emotion labeling",
  "Contemplative grounding",
  "AI reflection",
  "Subjective-first",
];

function hasCap(cap: string, catName: string): boolean {
  if (cap === "Biometric sensing") return catName === "Health Platforms";
  if (cap === "Emotion labeling") return catName === "Mood Trackers";
  if (cap === "Contemplative grounding") return catName === "Meditation Apps";
  return false;
}

// Circle centers — pushed close for ~25-30% pairwise overlap
const categories: Category[] = [
  {
    name: "Meditation Apps",
    examples: "Headspace, Calm, Waking Up",
    color: PURPLE,
    x: 33, y: 33,
  },
  {
    name: "Mood Trackers",
    examples: "How We Feel, Daylio, Bearable",
    color: GREEN,
    x: 67, y: 33,
  },
  {
    name: "Health Platforms",
    examples: "Oura, WHOOP, Apple Health",
    color: BROWN,
    x: 50, y: 64,
  },
];

// Category labels — centered in the non-overlapping solo region of each circle
const catLabelPositions = [
  { left: "28%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Meditation: nudge left from 33%
  { left: "72%", top: "24%", textAlign: "center" as const, transform: "translateX(-50%)" },  // Mood: nudge right from 67%
  { left: "50%", top: "70%", textAlign: "center" as const, transform: "translate(-50%, -50%)" },   // Health: 6% below circle center
];

export function NoticeCompetitiveGap() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="notice-gap">
      <style>{`
        .notice-gap {
          margin: 64px 0;
        }
        .notice-gap-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .notice-gap-venn {
        }
        .notice-gap-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 1px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 500px;
          margin: 48px auto 0;
        }
        @media (max-width: 640px) {
          .notice-gap-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 420px) {
          .notice-gap-venn {
            aspect-ratio: 1 / 1 !important;
          }
          .notice-gap-overlap-ext {
            display: none !important;
          }
          .notice-gap-cat-label {
            font-size: 11px !important;
          }
          .notice-gap-cat-examples {
            display: none;
          }
          .notice-gap-enso {
            width: 60px !important;
            height: 60px !important;
          }
          .notice-gap-notice-desc {
            display: none;
          }
        }
      `}</style>

      <div className="notice-gap-header">
        <p style={{
          fontFamily: tokens.mono,
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
        }}>
          Product Landscape
        </p>
        <h3 style={{
          fontFamily: tokens.serif,
          fontSize: "28px",
          fontWeight: 400,
          color: tokens.text,
          marginTop: "8px",
        }}>
          Three categories. None training the underlying capacity.
        </h3>
      </div>

      {/* Venn diagram */}
      <div className="notice-gap-venn" style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        margin: "24px auto 0",
        aspectRatio: "4 / 3",
      }}>
        {/* Circles */}
        {categories.map((cat, i) => (
          <div key={cat.name} style={{
            position: "absolute",
            left: `${cat.x}%`,
            top: `${cat.y}%`,
            transform: "translate(-50%, -50%)",
            width: "44%",
            aspectRatio: "1",
            borderRadius: "50%",
            border: `1.5px solid ${cat.color}40`,
            background: `radial-gradient(circle at center, ${cat.color}0a, ${cat.color}04)`,
            opacity: inView ? 1 : 0,
            transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.2}s`,
          }} />
        ))}

        {/* Category labels — inside solo regions */}
        {categories.map((cat, i) => (
          <div key={`label-${cat.name}`} style={{
            position: "absolute",
            ...catLabelPositions[i],
            opacity: inView ? 1 : 0,
            transition: `opacity 0.6s ease ${0.4 + i * 0.15}s`,
            maxWidth: "140px",
          }}>
            <p className="notice-gap-cat-label" style={{
              fontFamily: tokens.sans,
              fontSize: "12px",
              fontWeight: 600,
              color: cat.color,
              marginBottom: "2px",
              textAlign: catLabelPositions[i].textAlign,
            }}>{cat.name}</p>
            <p className="notice-gap-cat-examples" style={{
              fontFamily: tokens.sans,
              fontSize: "10px",
              color: tokens.textMuted,
              textAlign: catLabelPositions[i].textAlign,
            }}>{cat.examples}</p>
          </div>
        ))}

        {/* External overlap labels — positioned outside circle boundaries */}
        <div className="notice-gap-overlap-ext" style={{
          position: "absolute",
          left: "50%",
          top: "-4%",
          transform: "translateX(-50%)",
          textAlign: "center",
          fontFamily: tokens.sans,
          fontSize: "10px",
          color: tokens.textMuted,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.7s",
          whiteSpace: "nowrap",
        }}>
          Subjective focus, no biometrics
        </div>
        <div className="notice-gap-overlap-ext" style={{
          position: "absolute",
          left: "4%",
          top: "62%",
          textAlign: "left",
          fontFamily: tokens.sans,
          fontSize: "10px",
          color: tokens.textMuted,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.85s",
          maxWidth: "80px",
        }}>
          Wellness intent, no granularity
        </div>
        <div className="notice-gap-overlap-ext" style={{
          position: "absolute",
          right: "4%",
          top: "62%",
          textAlign: "right",
          fontFamily: tokens.sans,
          fontSize: "10px",
          color: tokens.textMuted,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 1s",
          maxWidth: "80px",
        }}>
          Data + labeling, no depth
        </div>

        {/* Notice ensō badge at triple intersection */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          opacity: inView ? 1 : 0,
          transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s",
          textAlign: "center",
          zIndex: 2,
        }}>
          <img
            className="notice-gap-enso"
            src="/images/enso-transparent.png"
            alt="Notice"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto 6px",
            }}
          />
          <p style={{
            fontFamily: tokens.serif,
            fontSize: "18px",
            fontWeight: 600,
            color: "#2C2416",
            margin: "0 auto 4px",
            textAlign: "center",
          }}>Notice</p>
          <p className="notice-gap-notice-desc" style={{
            fontFamily: tokens.sans,
            fontSize: "10px",
            color: tokens.textLight,
            maxWidth: "120px",
            lineHeight: 1.4,
          }}>All three — plus AI reflection</p>
        </div>
      </div>

      {/* Feature comparison grid */}
      <div className="notice-gap-grid" style={{
        background: tokens.bgCard,
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 1s",
      }}>
        {/* Header row */}
        <div style={{ background: tokens.bg, padding: "12px 16px" }}>
          <p style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            color: tokens.textMuted,
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>Capability</p>
        </div>
        {categories.map(cat => (
          <div key={`h-${cat.name}`} style={{
            background: tokens.bg,
            padding: "12px 16px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "11px",
              color: cat.color,
              fontWeight: 600,
            }}>{cat.name.split(" ")[0]}</p>
          </div>
        ))}

        {/* Capability rows */}
        {capabilities.map(cap => (
          <div key={`row-${cap}`} style={{ display: "contents" }}>
            <div style={{ background: tokens.bgWarm, padding: "10px 16px" }}>
              <p style={{
                fontFamily: tokens.sans,
                fontSize: "12px",
                color: tokens.textMid,
              }}>{cap}</p>
            </div>
            {categories.map(cat => (
              <div key={`${cap}-${cat.name}`} style={{
                background: tokens.bgWarm,
                padding: "10px 16px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {hasCap(cap, cat.name)
                  ? <CheckIcon size={14} color={GREEN} />
                  : <XIcon size={14} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
