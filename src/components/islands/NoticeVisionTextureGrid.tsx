import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── Texture group data (local colors, not in global palette) ───
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

export default function NoticeVisionTextureGrid() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="nvtg-root">
      <style>{`
        .nvtg-root {
          margin: 48px auto;
          max-width: 720px;
          padding: 0;
        }
        .nvtg-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .nvtg-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 420px) {
          .nvtg-cards {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

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

      <div className="nvtg-cards">
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

      <div style={{
        textAlign: "center",
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
