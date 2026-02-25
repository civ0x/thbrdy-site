import { useInView } from "./shared/useInView";

function Connector({ className }: { className?: string }) {
  return (
    <div className={`scholion-pipe-connector ${className || ""}`}>
      <div className="scholion-pipe-cline" />
      <div className="scholion-pipe-carrow" />
    </div>
  );
}

export default function ScholionDecompositionPipeline() {
  const [ref, inView] = useInView(0.1);
  const cls = `scholion-pipe${inView ? " in-view" : ""}`;

  return (
    <div
      ref={ref}
      className={cls}
      style={{
        margin: "48px 0",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <style>{`
        .scholion-pipe .pipe-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-muted); margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .scholion-pipe .pipe-label::before {
          content: ''; display: block; width: 12px; height: 1.5px;
          background-color: var(--accent);
        }
        .scholion-pipe .pipe-flow {
          display: flex; flex-direction: column; gap: 0;
        }
        /* Source block */
        .scholion-pipe .pipe-source {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 8px; padding: 16px 20px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .scholion-pipe.in-view .pipe-source {
          opacity: 1; transform: translateY(0); transition-delay: 0.1s;
        }
        .scholion-pipe .pipe-source-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-muted); margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .scholion-pipe .pipe-source-label .pipe-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background-color: var(--text-muted);
        }
        .scholion-pipe .pipe-source-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; font-style: italic;
          line-height: 1.55; color: var(--text);
        }
        .scholion-pipe .pipe-source-ref {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.625rem; color: var(--text-muted); margin-top: 8px;
        }
        /* Connectors */
        .scholion-pipe-connector {
          display: flex; flex-direction: column; align-items: center;
          padding: 8px 0;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .scholion-pipe.in-view .scholion-pipe-connector { opacity: 1; }
        .scholion-pipe-cline {
          width: 1px; height: 20px;
          background-color: var(--border-mid);
        }
        .scholion-pipe-carrow {
          width: 0; height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 5px solid var(--border-mid);
        }
        /* Stages */
        .scholion-pipe .pipe-stage {
          border-radius: 8px; overflow: hidden;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .scholion-pipe.in-view .pipe-stage { opacity: 1; transform: translateY(0); }
        .scholion-pipe.in-view .pipe-stage-1 { transition-delay: 0.25s; }
        .scholion-pipe.in-view .pipe-sc-1 { transition-delay: 0.2s; }
        .scholion-pipe.in-view .pipe-stage-2 { transition-delay: 0.5s; }
        .scholion-pipe.in-view .pipe-sc-2 { transition-delay: 0.45s; }
        .scholion-pipe.in-view .pipe-stage-3 { transition-delay: 0.75s; }
        .scholion-pipe.in-view .pipe-sc-3 { transition-delay: 0.7s; }
        .scholion-pipe .pipe-stage-header {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
        }
        .scholion-pipe .pipe-stage-number {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; font-weight: 600;
          color: var(--bg);
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          background-color: rgba(255,255,255,0.2);
        }
        .scholion-pipe .pipe-stage-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8125rem; font-weight: 600; color: var(--bg);
        }
        .scholion-pipe .pipe-stage-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem; font-weight: 400;
          color: var(--bg); opacity: 0.75; margin-left: auto;
        }
        .scholion-pipe .pipe-stage-body {
          padding: 16px 20px;
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        .scholion-pipe .pipe-s1-header { background-color: var(--accent); }
        .scholion-pipe .pipe-s2-header { background-color: var(--teal); }
        .scholion-pipe .pipe-s3-header { background-color: var(--blue); }
        /* Atomic cards */
        .scholion-pipe .pipe-atomic-cards {
          display: flex; flex-direction: column; gap: 8px;
        }
        .scholion-pipe .pipe-atomic-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px; padding: 10px 12px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .scholion-pipe .pipe-atomic-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; font-weight: 500;
          color: var(--accent); background-color: var(--accent-dim);
          padding: 2px 6px; border-radius: 3px;
          white-space: nowrap; flex-shrink: 0; margin-top: 1px;
        }
        .scholion-pipe .pipe-atomic-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; color: var(--text); line-height: 1.4;
        }
        .scholion-pipe .pipe-atomic-stat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem; color: var(--text-light); margin-top: 3px;
        }
        .scholion-pipe .pipe-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.625rem; color: var(--text-light);
          font-style: italic; margin-top: 10px;
          padding-top: 8px; border-top: 1px solid var(--border);
        }
        /* Toulmin card */
        .scholion-pipe .pipe-toulmin {
          background: var(--bg);
          border: 1px solid var(--border);
          border-left: 3px solid var(--teal);
          border-radius: 6px; padding: 12px 14px;
        }
        .scholion-pipe .pipe-toulmin-claim {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          color: var(--text); line-height: 1.4; margin-bottom: 10px;
        }
        .scholion-pipe .pipe-toulmin-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; font-weight: 500;
          color: var(--teal); margin-right: 6px;
        }
        .scholion-pipe .pipe-toulmin-fields {
          display: grid; grid-template-columns: auto 1fr;
          gap: 4px 10px; align-items: baseline;
        }
        .scholion-pipe .pipe-tf-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--text-muted); white-space: nowrap;
        }
        .scholion-pipe .pipe-tf-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6875rem; color: var(--text-mid); line-height: 1.4;
        }
        .scholion-pipe .pipe-tf-value em {
          color: var(--teal); font-style: normal; font-weight: 500;
        }
        .scholion-pipe .pipe-implicit-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--teal); background-color: var(--teal-dim);
          padding: 1px 4px; border-radius: 2px; margin-left: 4px;
        }
        /* Dep graph mini */
        .scholion-pipe .pipe-dep-graph {
          display: flex; flex-direction: column; align-items: center; gap: 0;
        }
        .scholion-pipe .pipe-dep-node {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 5px; padding: 8px 12px;
          text-align: center; min-width: 100px;
        }
        .scholion-pipe .pipe-dep-node.pipe-crux-node {
          border-left: 3px solid var(--accent);
          background: linear-gradient(135deg, var(--bg), var(--accent-dim));
        }
        .scholion-pipe .pipe-dep-node .pipe-dn-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; color: var(--text-muted);
        }
        .scholion-pipe .pipe-dep-node .pipe-dn-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem; font-weight: 500;
          color: var(--text); line-height: 1.3;
        }
        .scholion-pipe .pipe-dep-node .pipe-dn-stat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.5rem; color: var(--text-light); margin-top: 2px;
        }
        .scholion-pipe .pipe-dep-edge {
          display: flex; flex-direction: column; align-items: center; padding: 2px 0;
        }
        .scholion-pipe .pipe-de-line { width: 1px; height: 14px; background-color: var(--border-mid); }
        .scholion-pipe .pipe-de-type {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.45rem; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--text-muted); background-color: var(--bg-warm);
          padding: 0 4px;
        }
        .scholion-pipe .pipe-de-line-2 { width: 1px; height: 10px; background-color: var(--border-mid); }
        .scholion-pipe .pipe-de-arrow {
          width: 0; height: 0;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 4px solid var(--border-mid);
        }
        .scholion-pipe .pipe-dep-row {
          display: flex; gap: 8px; justify-content: center; width: 100%;
          position: relative;
        }
        .scholion-pipe .pipe-dep-row .pipe-dep-branch {
          position: absolute; top: 0;
          left: calc(100% / 6); right: calc(100% / 6);
          height: 1px; background: var(--border-mid);
        }
        @media (max-width: 640px) {
          .scholion-pipe .pipe-stage-subtitle { display: none; }
          .scholion-pipe .pipe-stage-header { padding: 8px 12px; }
          .scholion-pipe .pipe-stage-body { padding: 12px 14px; }
          .scholion-pipe .pipe-toulmin-fields { grid-template-columns: 1fr; gap: 6px 0; }
          .scholion-pipe .pipe-tf-label { margin-bottom: -4px; }
        }
      `}</style>

      <div className="pipe-label">Decomposition Pipeline · prose → typed dependency graph</div>

      <div className="pipe-flow">

        {/* Source text */}
        <div className="pipe-source">
          <div className="pipe-source-label"><span className="pipe-dot" /> Source text</div>
          <div className="pipe-source-text">"Multivariate analysis demonstrated that WBC count, AST-to-ALT ratio, and surgical intervention remained independently correlated with survival."</div>
          <div className="pipe-source-ref">— Chen et al. (2025), Results Discussion</div>
        </div>

        <Connector className="pipe-sc-1" />

        {/* Stage 1: Atomic Decomposition */}
        <div className="pipe-stage pipe-stage-1">
          <div className="pipe-stage-header pipe-s1-header">
            <div className="pipe-stage-number">1</div>
            <div className="pipe-stage-title">Atomic Decomposition</div>
            <div className="pipe-stage-subtitle">One assertion per claim</div>
          </div>
          <div className="pipe-stage-body">
            <div className="pipe-atomic-cards">
              {[
                { id: "mort.6", text: "Elevated WBC count is an independent predictor of mortality after adjustment for age and gender", stat: "HR 1.013 · CI 1.000–1.025 · p = .042" },
                { id: "mort.7", text: "AST-to-ALT ratio ≥ 2 is an independent predictor of mortality after adjustment for age and gender", stat: "HR 11.052 · CI 1.441–84.770 · p = .021" },
                { id: "mort.8", text: "Surgical intervention is an independent predictor of mortality after adjustment for age and gender", stat: "HR 6.604 · CI 1.581–27.593 · p = .010" },
              ].map((c) => (
                <div className="pipe-atomic-card" key={c.id}>
                  <div className="pipe-atomic-id">{c.id}</div>
                  <div>
                    <div className="pipe-atomic-text">{c.text}</div>
                    <div className="pipe-atomic-stat">{c.stat}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pipe-note">One sentence → three individually falsifiable claims, each with its own statistical evidence</div>
          </div>
        </div>

        <Connector className="pipe-sc-2" />

        {/* Stage 2: Toulmin Reveal */}
        <div className="pipe-stage pipe-stage-2">
          <div className="pipe-stage-header pipe-s2-header">
            <div className="pipe-stage-number">2</div>
            <div className="pipe-stage-title">Toulmin Reveal</div>
            <div className="pipe-stage-subtitle">Surface the unstated reasoning</div>
          </div>
          <div className="pipe-stage-body">
            <div className="pipe-toulmin">
              <div className="pipe-toulmin-claim">
                <span className="pipe-toulmin-id">mort.8</span>
                Surgical intervention is an independent predictor of mortality
              </div>
              <div className="pipe-toulmin-fields">
                <div className="pipe-tf-label">Warrant</div>
                <div className="pipe-tf-value"><em>Patients requiring surgery represent the most physiologically compromised subgroup</em> <span className="pipe-implicit-tag">Implicit</span></div>
                <div className="pipe-tf-label">Qualifier</div>
                <div className="pipe-tf-value">Based on 7 surgical patients (3 deaths). Adjusted for age and gender only — not disease severity.</div>
                <div className="pipe-tf-label">Rebuttal</div>
                <div className="pipe-tf-value">Confounding by indication: surgery is performed on the sickest patients, so the association reflects severity, not a causal effect of surgery on death.</div>
              </div>
            </div>
            <div className="pipe-note">The paper calls surgery an "independent predictor" without discussing confounding by indication. The warrant field surfaces this gap — the implicit reasoning the author expects readers to fill in, and the point where the argument is most structurally vulnerable.</div>
          </div>
        </div>

        <Connector className="pipe-sc-3" />

        {/* Stage 3: Dependency Typing */}
        <div className="pipe-stage pipe-stage-3">
          <div className="pipe-stage-header pipe-s3-header">
            <div className="pipe-stage-number">3</div>
            <div className="pipe-stage-title">Dependency Typing</div>
            <div className="pipe-stage-subtitle">Wire claims into a directed graph</div>
          </div>
          <div className="pipe-stage-body">
            <div className="pipe-dep-graph">
              {/* method.3 (crux) at top */}
              <div className="pipe-dep-node pipe-crux-node">
                <div className="pipe-dn-id">method.3 · CRUX</div>
                <div className="pipe-dn-label">Cox regression, age + gender only</div>
              </div>
              <div className="pipe-dep-edge">
                <div className="pipe-de-line" />
                <div className="pipe-de-type">conditional</div>
                <div className="pipe-de-line-2" />
                <div className="pipe-de-arrow" />
              </div>
              {/* three mortality claims in a row */}
              <div className="pipe-dep-row">
                <div className="pipe-dep-branch" />
                <div className="pipe-dep-node">
                  <div className="pipe-dn-id">mort.6</div>
                  <div className="pipe-dn-label">WBC</div>
                  <div className="pipe-dn-stat">HR 1.013</div>
                </div>
                <div className="pipe-dep-node">
                  <div className="pipe-dn-id">mort.7</div>
                  <div className="pipe-dn-label">AST/ALT ≥ 2</div>
                  <div className="pipe-dn-stat">HR 11.05</div>
                </div>
                <div className="pipe-dep-node">
                  <div className="pipe-dn-id">mort.8</div>
                  <div className="pipe-dn-label">Surgery</div>
                  <div className="pipe-dn-stat">HR 6.60</div>
                </div>
              </div>
              <div className="pipe-dep-edge">
                <div className="pipe-de-line" />
                <div className="pipe-de-type">conjunctive</div>
                <div className="pipe-de-line-2" />
                <div className="pipe-de-arrow" />
              </div>
              {/* synthesis */}
              <div className="pipe-dep-node" style={{ background: "var(--bg-warm)", borderColor: "var(--border-mid)" }}>
                <div className="pipe-dn-id">mortality.9</div>
                <div className="pipe-dn-label">Three independent mortality predictors</div>
              </div>
            </div>
            <div className="pipe-note">Each relationship is classified by type. The graph makes structural properties computable: if method.3 (the Cox regression) is overturned, all three predictor claims collapse simultaneously — but findings from the chronology chain, which uses a different statistical method, survive.</div>
          </div>
        </div>

      </div>
    </div>
  );
}
