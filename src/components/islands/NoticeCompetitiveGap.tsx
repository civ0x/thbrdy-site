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
  has: string[];
  missing: string[];
  color: string;
  x: number;
  y: number;
}

const categories: Category[] = [
  {
    name: "Meditation Apps",
    examples: "Headspace, Calm, Waking Up",
    has: ["Contemplative depth", "Guided practice"],
    missing: ["Moment-of-capture logging", "Biometric integration", "Emotional granularity"],
    color: PURPLE,
    x: 15, y: 20,
  },
  {
    name: "Mood Trackers",
    examples: "How We Feel, Daylio, Bearable",
    has: ["Emotion labeling", "Pattern tracking"],
    missing: ["Biometric data", "Contemplative grounding", "AI reflection"],
    color: GREEN,
    x: 65, y: 20,
  },
  {
    name: "Health Platforms",
    examples: "Oura, WHOOP, Apple Health",
    has: ["Biometric sensing", "Behavioral correlation"],
    missing: ["Emotional granularity", "Contemplative depth", "Subjective-first design"],
    color: BROWN,
    x: 40, y: 65,
  },
];

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

// ─── Label positions ───
const labelPositions: Array<Record<string, string>> = [
  { left: "4%", top: "2%", textAlign: "left" },
  { right: "4%", top: "2%", textAlign: "right" },
  { left: "50%", bottom: "0%", textAlign: "center", transform: "translateX(-50%)" },
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
        .notice-gap-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 1px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 720px;
          margin: 24px auto 0;
        }
        @media (max-width: 640px) {
          .notice-gap-grid {
            grid-template-columns: 1fr 1fr;
          }
          .notice-gap-grid-header-cap {
            display: none;
          }
        }
        @media (max-width: 420px) {
          .notice-gap-grid {
            grid-template-columns: 1fr 1fr;
          }
          .notice-gap-venn {
            aspect-ratio: 1 / 1 !important;
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
        maxWidth: "720px",
        margin: "0 auto",
        aspectRatio: "4 / 3",
      }}>
        {/* Circles */}
        {categories.map((cat, i) => (
          <div key={cat.name} style={{
            position: "absolute",
            left: `${cat.x}%`,
            top: `${cat.y}%`,
            transform: "translate(-50%, -50%)",
            width: "52%",
            aspectRatio: "1",
            borderRadius: "50%",
            border: `1.5px solid ${cat.color}40`,
            background: `radial-gradient(circle at center, ${cat.color}08, ${cat.color}03)`,
            opacity: inView ? 1 : 0,
            transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.2}s`,
          }} />
        ))}

        {/* Labels */}
        {categories.map((cat, i) => (
          <div key={`label-${cat.name}`} style={{
            position: "absolute",
            ...labelPositions[i],
            opacity: inView ? 1 : 0,
            transition: `opacity 0.6s ease ${0.4 + i * 0.15}s`,
            maxWidth: "180px",
          }}>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "14px",
              fontWeight: 600,
              color: cat.color,
              marginBottom: "2px",
              textAlign: labelPositions[i].textAlign as any,
            }}>{cat.name}</p>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "11px",
              color: tokens.textMuted,
              textAlign: labelPositions[i].textAlign as any,
            }}>{cat.examples}</p>
          </div>
        ))}

        {/* Notice badge at center */}
        <div style={{
          position: "absolute",
          left: "40%",
          top: "42%",
          transform: "translate(-50%, -50%)",
          opacity: inView ? 1 : 0,
          transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s",
          textAlign: "center",
          zIndex: 2,
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #D4A043, #B8860B)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 8px",
            boxShadow: "0 4px 24px rgba(184, 134, 11, 0.3)",
          }}>
            <span style={{
              fontFamily: tokens.serif,
              fontSize: "22px",
              fontWeight: 500,
              color: "#FFF8F0",
              letterSpacing: "0.5px",
            }}>Notice</span>
          </div>
          <p style={{
            fontFamily: tokens.sans,
            fontSize: "11px",
            color: tokens.textLight,
            maxWidth: "140px",
            lineHeight: 1.4,
          }}>Contemplative depth + biometric sensing + emotional granularity</p>
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
