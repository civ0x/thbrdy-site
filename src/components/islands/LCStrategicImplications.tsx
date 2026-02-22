import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

// ─── LC essay accent (local, not in global tokens) ───
const LC = {
  accent: "#3A7CA5",
  accentBg: "#3A7CA512",
  accentBorder: "#3A7CA530",
};

// ─── Inline SVG icons ───
function Maximize2Icon({ size = 20, color = LC.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function CpuIcon({ size = 20, color = LC.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

function GaugeIcon({ size = 20, color = LC.accent }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m14.7 10.7-3 3" />
      <path d="M12 6v2" />
      <path d="M6 12h2" />
      <path d="M18 12h-2" />
    </svg>
  );
}

const implications = [
  {
    icon: Maximize2Icon,
    title: "Heterogeneous Training",
    desc: "Convert stranded mixed-SKU capacity into usable compute. Change the supply curve for ML training.",
    status: "Contingent on Claim 3",
  },
  {
    icon: CpuIcon,
    title: "Chip Co-Design Tool",
    desc: "Evaluate compilation strategies for hypothetical accelerator specs — before fabrication.",
    status: "Contingent on Claim 3",
  },
  {
    icon: GaugeIcon,
    title: "Decoupled Release Cycles",
    desc: "Planner adapts to new hardware instead of requiring months of manual heuristic development per target.",
    status: "Contingent on Claim 3",
  },
];

export default function LCStrategicImplications() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="lc-strat">
      <style>{`
        .lc-strat {
          margin: 3rem 0;
        }
        .lc-strat-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .lc-strat-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${LC.accent};
          margin-bottom: 0.5rem;
        }
        .lc-strat-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .lc-strat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .lc-strat-grid {
            grid-template-columns: 1fr;
          }
        }
        .lc-strat-card {
          padding: 1.5rem 1.25rem;
          background: ${tokens.bgWarm};
          border-radius: 12px;
          border: 1px solid ${tokens.border};
        }
        .lc-strat-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: ${LC.accentBg};
          border: 1.5px solid ${LC.accentBorder};
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .lc-strat-card-title {
          font-family: ${tokens.sans};
          font-size: 0.875rem;
          font-weight: 600;
          color: ${tokens.text};
          margin-bottom: 0.5rem;
        }
        .lc-strat-card-desc {
          font-family: ${tokens.serif};
          font-size: 0.875rem;
          line-height: 1.6;
          color: ${tokens.textLight};
          margin-bottom: 0.75rem;
        }
        .lc-strat-status {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.red};
        }
      `}</style>

      <div className="lc-strat-header">
        <p className="lc-strat-eyebrow">If It Works</p>
        <h3 className="lc-strat-title">Three consequences beyond raw throughput.</h3>
      </div>

      <div className="lc-strat-grid">
        {implications.map((imp, i) => {
          const Icon = imp.icon;
          return (
            <div
              key={imp.title}
              className="lc-strat-card"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`,
              }}
            >
              <div className="lc-strat-icon-box">
                <Icon />
              </div>
              <p className="lc-strat-card-title">{imp.title}</p>
              <p className="lc-strat-card-desc">{imp.desc}</p>
              <p className="lc-strat-status">{imp.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
