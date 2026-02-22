import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const claims = [
  {
    num: "Claim 01",
    title: "Toulmin extraction is reliable enough to be useful",
    body: "Annotate 20–50 AI safety papers using a formalized Toulmin schema with typed dependency edges. Measure inter-annotator agreement, iterate on guidelines. Produces a publishable dataset regardless of downstream results.",
    validated: "Validated if multi-pass LLM pipeline achieves >70% F1 on claims, >50% F1 on dependencies",
    killed: "Killed if inter-annotator agreement below κ = 0.4 — schema doesn't carve at the joints",
    active: true,
  },
  {
    num: "Claim 02",
    title: "Cross-document dependency matching works",
    body: "Take a known dependency chain spanning 3–5 papers. Extract claims independently, evaluate whether automated matching recovers the chain.",
    validated: "Validated if >60% precision at >40% recall on cross-document claim matching",
    killed: "Killed if false positive rate makes the graph too noisy — every claim appears to depend on everything",
    active: false,
  },
  {
    num: "Claim 03",
    title: "The system is useful for safety case maintenance",
    body: "A safety researcher reviewing a dependency graph identifies a non-obvious vulnerability faster than reviewing the same material in prose.",
    validated: "Validated if domain experts find graph representation faster / more complete than prose review",
    killed: "Killed if structural overhead consistently exceeds structural benefit",
    active: false,
  },
];

export default function ScholionValidationTimeline() {
  const [ref, inView] = useInView(0.1);

  return (
    <div ref={ref} className="scholion-validation">
      <style>{`
        .scholion-validation {
          margin: 2.5rem 0;
        }
        .scholion-validation-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
        }
        .scholion-validation-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2rem;
        }
        .scholion-val-claims {
          position: relative;
          padding-left: 1.8rem;
        }
        .scholion-val-claims::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: var(--border-mid);
        }
        .scholion-val-claim {
          position: relative;
          margin-bottom: 2rem;
          padding-left: 1.2rem;
        }
        .scholion-val-claim:last-child {
          margin-bottom: 0;
        }
        .scholion-val-claim::before {
          content: '';
          position: absolute;
          left: -1.8rem;
          top: 10px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          border: 2px solid var(--accent);
          background: var(--bg-warm);
          z-index: 1;
        }
        .scholion-val-claim--active::before {
          background: var(--accent);
        }
        .scholion-val-header {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
          margin-bottom: 0.4rem;
        }
        .scholion-val-num {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: ${tokens.accent};
          font-weight: 500;
        }
        .scholion-val-claim-title {
          font-family: ${tokens.sans};
          font-size: 0.88rem;
          font-weight: 600;
          color: ${tokens.text};
        }
        .scholion-val-body {
          font-family: ${tokens.sans};
          font-size: 0.78rem;
          color: ${tokens.textLight};
          line-height: 1.65;
          margin-bottom: 0.6rem;
        }
        .scholion-val-criteria {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .scholion-val-criterion {
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          line-height: 1.5;
        }
        .scholion-val-criterion--validated {
          background: var(--green-dim);
          color: var(--green);
          border: 1px solid rgba(74, 122, 74, 0.15);
        }
        .scholion-val-criterion--killed {
          background: var(--red-dim);
          color: var(--red);
          border: 1px solid rgba(166, 61, 47, 0.15);
        }
        .scholion-val-criterion strong {
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .scholion-validation-inner {
            padding: 1.5rem 1rem;
          }
          .scholion-val-criteria {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="scholion-validation-inner">
        <div className="scholion-validation-title">
          Validation program · nested claims with kill criteria
        </div>
        <div className="scholion-val-claims">
          {claims.map((claim, i) => (
            <div
              key={claim.num}
              className={`scholion-val-claim${claim.active ? " scholion-val-claim--active" : ""}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`,
              }}
            >
              <div className="scholion-val-header">
                <span className="scholion-val-num">{claim.num}</span>
                <span className="scholion-val-claim-title">{claim.title}</span>
              </div>
              <div className="scholion-val-body">{claim.body}</div>
              <div className="scholion-val-criteria">
                <div className="scholion-val-criterion scholion-val-criterion--validated">
                  <strong>Validated if</strong> {claim.validated.replace("Validated if ", "")}
                </div>
                <div className="scholion-val-criterion scholion-val-criterion--killed">
                  <strong>Killed if</strong> {claim.killed.replace("Killed if ", "")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
