import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

export default function ScholionToulminDiagram() {
  const [ref, inView] = useInView(0.1);

  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <div ref={ref} className="scholion-toulmin">
      <style>{`
        .scholion-toulmin {
          margin: 2.5rem 0;
        }
        .scholion-toulmin-inner {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 2.5rem 2rem;
        }
        .scholion-toulmin-title {
          font-family: ${tokens.mono};
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 2rem;
          text-align: center;
        }

        /* ── Claim card (dominant) ── */
        .scholion-toulmin-claim {
          background: var(--accent-dim);
          border: 2px solid var(--accent);
          border-radius: 6px;
          padding: 1.2rem 1.4rem;
        }
        .scholion-toulmin-claim-label {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 0.4rem;
        }
        .scholion-toulmin-claim-text {
          font-family: ${tokens.serif};
          font-size: 1.05rem;
          line-height: 1.5;
          color: ${tokens.text};
        }
        .scholion-toulmin-claim-rule {
          height: 1px;
          background: var(--border);
          margin: 0.8rem 0;
        }
        .scholion-toulmin-modifiers {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .scholion-toulmin-modifier {
          border-left: 2px solid;
          padding-left: 0.75rem;
        }
        .scholion-toulmin-modifier-label {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 0.15rem;
        }
        .scholion-toulmin-modifier-text {
          font-family: ${tokens.sans};
          font-size: 0.72rem;
          line-height: 1.5;
          color: ${tokens.textMid};
        }

        /* ── Vertical connectors ── */
        .scholion-toulmin-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.25rem 0;
        }
        .scholion-toulmin-connector-line {
          width: 1px;
          height: 24px;
          background: var(--border-mid);
        }
        .scholion-toulmin-connector-arrow {
          font-family: ${tokens.mono};
          font-size: 0.65rem;
          color: ${tokens.textMuted};
          line-height: 1;
        }
        .scholion-toulmin-connector-label {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${tokens.textFaint};
          margin-top: 0.15rem;
        }
        /* ── Supporting cards ── */
        .scholion-toulmin-card {
          border-radius: 6px;
          padding: 0.9rem 1.1rem;
          border: 1px solid;
        }
        .scholion-toulmin-card-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }
        .scholion-toulmin-card-text {
          font-family: ${tokens.sans};
          font-size: 0.78rem;
          line-height: 1.55;
          color: ${tokens.textMid};
        }

        /* ── Data + Warrant row ── */
        .scholion-toulmin-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* ── Backing alignment ── */
        .scholion-toulmin-backing-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .scholion-toulmin-backing-spacer {
          /* empty left column to align backing under warrant */
        }

        @media (max-width: 640px) {
          .scholion-toulmin-inner {
            padding: 1.5rem 1rem;
          }
          .scholion-toulmin-row {
            grid-template-columns: 1fr;
          }
          .scholion-toulmin-backing-wrap {
            grid-template-columns: 1fr;
          }
          .scholion-toulmin-backing-spacer {
            display: none;
          }
}
      `}</style>

      <div className="scholion-toulmin-inner">
        <div className="scholion-toulmin-title">
          Anatomy of a Toulmin argument · AI safety example
        </div>

        {/* ── Claim card with inline modifiers ── */}
        <div
          className="scholion-toulmin-claim"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.5s ${ease} 0s`,
          }}
        >
          <div className="scholion-toulmin-claim-label">Claim</div>
          <div className="scholion-toulmin-claim-text">
            "This AI system is safe to deploy at ASL-3"
          </div>
          <div className="scholion-toulmin-claim-rule" />
          <div className="scholion-toulmin-modifiers">
            <div
              className="scholion-toulmin-modifier"
              style={{ borderColor: "var(--text-muted)" }}
            >
              <div
                className="scholion-toulmin-modifier-label"
                style={{ color: "var(--text-muted)" }}
              >
                Given that
              </div>
              <div className="scholion-toulmin-modifier-text">
                Current threat models and evaluation coverage
              </div>
            </div>
            <div
              className="scholion-toulmin-modifier"
              style={{ borderColor: "var(--red)" }}
            >
              <div
                className="scholion-toulmin-modifier-label"
                style={{ color: "var(--red)" }}
              >
                Unless
              </div>
              <div className="scholion-toulmin-modifier-text">
                Capability jumps occur between evaluation cycles
              </div>
            </div>
          </div>
        </div>

        {/* ── Upper connector ── */}
        <div
          className="scholion-toulmin-connector"
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.4s ease 0.2s`,
          }}
        >
          <div className="scholion-toulmin-connector-arrow">↑</div>
          <div className="scholion-toulmin-connector-line" />
          <div className="scholion-toulmin-connector-label">supports</div>
        </div>

        {/* ── Data + Warrant row ── */}
        <div className="scholion-toulmin-row">
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s ${ease} 0.3s`,
            }}
          >
            <div
              className="scholion-toulmin-card"
              style={{
                background: "var(--blue-dim)",
                borderColor: "var(--blue)",
              }}
            >
              <div className="scholion-toulmin-card-label" style={{ color: "var(--blue)" }}>
                Data
              </div>
              <div className="scholion-toulmin-card-text">
                Capability evaluations show performance below dangerous thresholds
              </div>
            </div>
          </div>
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s ${ease} 0.3s`,
            }}
          >
            <div
              className="scholion-toulmin-card"
              style={{
                background: "var(--green-dim)",
                borderColor: "var(--green)",
              }}
            >
              <div className="scholion-toulmin-card-label" style={{ color: "var(--green)" }}>
                Warrant
              </div>
              <div className="scholion-toulmin-card-text">
                If evaluations are below threshold, deployment is safe
              </div>
            </div>
          </div>
        </div>

        {/* ── Lower connector (aligned under Warrant) ── */}
        <div className="scholion-toulmin-backing-wrap">
          <div className="scholion-toulmin-backing-spacer" />
          <div
            className="scholion-toulmin-connector"
            style={{
              opacity: inView ? 1 : 0,
              transition: `opacity 0.4s ease 0.45s`,
            }}
          >
            <div className="scholion-toulmin-connector-arrow">↑</div>
            <div className="scholion-toulmin-connector-line" />
            <div className="scholion-toulmin-connector-label">on account of</div>
          </div>
        </div>

        {/* ── Backing (aligned under Warrant) ── */}
        <div className="scholion-toulmin-backing-wrap">
          <div className="scholion-toulmin-backing-spacer" />
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s ${ease} 0.55s`,
            }}
          >
            <div
              className="scholion-toulmin-card"
              style={{
                background: "var(--teal-dim)",
                borderColor: "var(--teal)",
              }}
            >
              <div className="scholion-toulmin-card-label" style={{ color: "var(--teal)" }}>
                Backing
              </div>
              <div className="scholion-toulmin-card-text">
                Evaluation methodology validated against known dangerous capabilities
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
