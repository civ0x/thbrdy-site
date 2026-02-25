import { useState, useEffect } from "react";
import { useInView } from "./shared/useInView";

interface Phase {
  number: number;
  title: string;
  color: "teal" | "accent" | "blue" | "red";
  active?: boolean;
  desc: string;
  success: string;
  kill: string;
  dep?: string;
}

const PHASES: Phase[] = [
  {
    number: 1, title: "Manual Annotation", color: "teal", active: true,
    desc: "Three to five papers across domains \u2014 clinical medicine (started), interpretability research, and formal verification or philosophy of science. Tests inter-annotator agreement and the novice annotator hypothesis: that non-specialists with structured method and inline contextual scaffolding can produce decompositions of comparable quality to domain experts.",
    success: "Consistent inter-annotator agreement on claim boundaries, dependency types, and crux identification across independent annotators and domains.",
    kill: "Agreement too low \u2014 the schema captures annotator idiosyncrasies, not stable structural features of arguments.",
  },
  {
    number: 2, title: "LLM Extraction Pipeline", color: "accent",
    desc: "Benchmark automated extraction against manual ground truth from Phase 1. The argument mining literature suggests LLMs can perform argument component detection at levels rivaling supervised baselines but struggle with fine-grained structural reasoning \u2014 exactly the capability Scholion requires.",
    success: "Automated extraction produces dependency graphs structurally valid enough to propagate invalidation correctly.",
    kill: "Extraction quality too low \u2014 methodology requires human-in-the-loop annotation at a level that does not scale, or fundamental advances in LLM reasoning.",
    dep: "Depends on Phase 1 ground truth corpus",
  },
  {
    number: 3, title: "Graph Infrastructure", color: "blue",
    desc: "Typed dependency storage, invalidation propagation as a graph operation, cross-document claim linking. Technical implementation depends on whether dependency types are stable, whether cross-document references are tractable, and what query patterns matter for actual use.",
    success: "Graph operations correctly propagate status changes through typed dependencies and support cross-document claim resolution.",
    kill: "Dependency types too unstable across domains \u2014 no consistent graph substrate supports the structural operations the methodology requires.",
    dep: "Depends on Phase 1\u20132 findings on type stability and extraction fidelity",
  },
  {
    number: 4, title: "Reading Interface & Validation", color: "red",
    desc: "Domain experts use the dependency graph alongside the original paper and report whether the structural representation adds value over reading the prose. This is the final and most important test: utility, not elegance.",
    success: "Domain experts report the graph surfaces structural insights \u2014 cruxes, hidden dependencies, invalidation paths \u2014 that the prose alone does not make visible.",
    kill: "Experts do not find the graph more useful than the paper. The structural advantage thesis is wrong.",
    dep: "Depends on Phase 3 graph infrastructure and validated extraction pipeline",
  },
];

export default function ScholionRoadmap() {
  const [ref, inView] = useInView(0.15);
  const [phasesVisible, setPhasesVisible] = useState<boolean[]>(PHASES.map(() => false));

  useEffect(() => {
    if (!inView) return;
    PHASES.forEach((_, i) => {
      setTimeout(() => {
        setPhasesVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 150);
    });
  }, [inView]);

  const colorVar = (c: string) => `var(--${c})`;

  return (
    <div
      ref={ref}
      className="scholion-roadmap"
      style={{
        margin: "48px 0",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <style>{`
        .scholion-roadmap .rm-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-muted); margin-bottom: 24px;
        }
        .scholion-roadmap .rm-timeline {
          position: relative;
          padding-left: 32px;
        }
        .scholion-roadmap .rm-timeline::before {
          content: '';
          position: absolute;
          left: 6px; top: 8px; bottom: 8px;
          width: 1px;
          background: var(--border-mid);
        }
        .scholion-roadmap .rm-phase {
          position: relative;
          margin-bottom: 40px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .scholion-roadmap .rm-phase.rm-visible {
          opacity: 1; transform: translateY(0);
        }
        .scholion-roadmap .rm-phase:last-child { margin-bottom: 0; }
        .scholion-roadmap .rm-phase::before {
          content: '';
          position: absolute;
          left: -32px; top: 10px;
          width: 13px; height: 13px;
          border-radius: 50%;
          border: 2px solid var(--border-mid);
          background: var(--bg);
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .scholion-roadmap .rm-phase-card {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 20px 24px;
        }
        .scholion-roadmap .rm-phase-header {
          display: flex; align-items: baseline;
          gap: 12px; margin-bottom: 12px;
        }
        .scholion-roadmap .rm-phase-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .scholion-roadmap .rm-phase-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem; font-weight: 600;
          color: var(--text); line-height: 1.3;
        }
        .scholion-roadmap .rm-phase-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5625rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.05em;
          padding: 2px 8px; border-radius: 3px;
          white-space: nowrap;
        }
        .scholion-roadmap .rm-status-active {
          background: var(--teal-dim); color: var(--teal);
        }
        .scholion-roadmap .rm-status-pending {
          background: var(--bg-warm); color: var(--text-light);
        }
        .scholion-roadmap .rm-phase-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8125rem; line-height: 1.55;
          color: var(--text-mid); margin-bottom: 16px;
        }
        .scholion-roadmap .rm-criteria-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .scholion-roadmap .rm-criteria-block {
          padding: 12px 14px; border-radius: 3px;
        }
        .scholion-roadmap .rm-criteria-success {
          background: var(--teal-dim); border-left: 2px solid var(--teal);
        }
        .scholion-roadmap .rm-criteria-kill {
          background: var(--red-dim); border-left: 2px solid var(--red);
        }
        .scholion-roadmap .rm-criteria-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5625rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .scholion-roadmap .rm-criteria-success .rm-criteria-label { color: var(--teal); }
        .scholion-roadmap .rm-criteria-kill .rm-criteria-label { color: var(--red); }
        .scholion-roadmap .rm-criteria-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; line-height: 1.5;
          color: var(--text-mid);
        }
        .scholion-roadmap .rm-phase-dep {
          display: flex; align-items: center;
          gap: 6px; margin-top: 12px;
          padding-top: 10px; border-top: 1px solid var(--border);
        }
        .scholion-roadmap .rm-dep-arrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.625rem; color: var(--text-light);
        }
        .scholion-roadmap .rm-dep-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem; color: var(--text-light);
        }
        .scholion-roadmap .rm-annotation {
          margin-top: 32px;
          padding: 16px 20px;
          background: var(--bg-warm);
          border-radius: 4px;
          border-left: 3px solid var(--border-mid);
        }
        .scholion-roadmap .rm-annotation div {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; line-height: 1.6;
          color: var(--text-mid);
        }
        .scholion-roadmap .rm-annotation em {
          color: var(--text); font-style: italic;
        }
        @media (max-width: 600px) {
          .scholion-roadmap .rm-timeline { padding-left: 28px; }
          .scholion-roadmap .rm-phase::before { left: -28px; }
          .scholion-roadmap .rm-phase-card { padding: 16px 18px; }
          .scholion-roadmap .rm-criteria-grid { grid-template-columns: 1fr; }
          .scholion-roadmap .rm-phase-header { flex-wrap: wrap; gap: 6px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scholion-roadmap .rm-phase {
            opacity: 1; transform: none; transition: none;
          }
          .scholion-roadmap .rm-phase::before { transition: none; }
        }
      `}</style>

      <div className="rm-label">&lt;Roadmap /&gt;</div>

      <div className="rm-timeline">
        {PHASES.map((p, i) => (
          <div
            key={p.number}
            className={`rm-phase${phasesVisible[i] ? " rm-visible" : ""}`}
            style={{
              "--phase-color": colorVar(p.color),
            } as React.CSSProperties}
          >
            <style>{`
              .scholion-roadmap .rm-phase:nth-child(${i + 1})::before {
                border-color: ${colorVar(p.color)};
                ${p.active ? `background: ${colorVar(p.color)};` : ""}
              }
              .scholion-roadmap .rm-phase:nth-child(${i + 1}) .rm-phase-card {
                border-left: 3px solid ${colorVar(p.color)};
              }
              .scholion-roadmap .rm-phase:nth-child(${i + 1}) .rm-phase-number {
                color: ${colorVar(p.color)};
              }
            `}</style>
            <div className="rm-phase-card">
              <div className="rm-phase-header">
                <span className="rm-phase-number">Phase {p.number}</span>
                <span className="rm-phase-title">{p.title}</span>
                <span className={`rm-phase-status ${p.active ? "rm-status-active" : "rm-status-pending"}`}>
                  {p.active ? "Active" : "Pending"}
                </span>
              </div>
              <div className="rm-phase-desc">{p.desc}</div>
              <div className="rm-criteria-grid">
                <div className="rm-criteria-block rm-criteria-success">
                  <div className="rm-criteria-label">Success criteria</div>
                  <div className="rm-criteria-text">{p.success}</div>
                </div>
                <div className="rm-criteria-block rm-criteria-kill">
                  <div className="rm-criteria-label">Kill condition</div>
                  <div className="rm-criteria-text">{p.kill}</div>
                </div>
              </div>
              {p.dep && (
                <div className="rm-phase-dep">
                  <span className="rm-dep-arrow">←</span>
                  <span className="rm-dep-label">{p.dep}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rm-annotation">
        <div>Each phase gates the next. The kill conditions are not hypothetical — they are the specific empirical questions the project exists to answer. <em>If the structure is not stable, do not automate it. If the automation is not faithful, do not build infrastructure on it. If the infrastructure does not help readers, stop.</em></div>
      </div>
    </div>
  );
}
