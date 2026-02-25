import { useInView } from "./shared/useInView";
import { DiagramPopover, useDiagramPopover } from "./shared/DiagramPopover";

interface PopData {
  cat: "clinical" | "argument";
  label: string;
  title: string;
  body: string;
  structural: string;
}

const POP_DATA: Record<string, PopData> = {
  method1: {
    cat: "argument", label: "Foundational Crux",
    title: "Inclusion Criteria: Induced vs. Coincident",
    body: "The entire analysis hinges on one distinction: were these patients' pancreatic injuries <em>caused by</em> COVID-19, or did pancreatitis merely <em>coincide with</em> COVID-19 infection? The study defines \"induced\" by ruling out other known causes (gallstones, alcohol, medications). If that exclusion is imperfect — and the authors acknowledge it may be — some patients in the cohort may not have COVID-19-induced pancreatitis at all, contaminating every downstream finding.",
    structural: "This is the single node on which all 25 claims depend. Pull it, and both the mortality predictor chain and the symptom chronology chain collapse simultaneously.",
  },
  method2: {
    cat: "clinical", label: "Study Population",
    title: "111 Patients, 87 Case Reports",
    body: "The cohort was assembled from published case reports — individual patient stories, not a prospective study. Dual-reviewer screening per PRISMA standards adds methodological rigor, but case reports over-represent severe or unusual presentations. The 9.9% mortality rate and 7-day median time to death suggest a population skewed toward fulminant cases.",
    structural: "With only 11 deaths in 111 patients, every statistical analysis downstream operates near the minimum viable sample size. The standard rule of thumb is ~10 events per covariate in regression models.",
  },
  method3: {
    cat: "argument", label: "Methodological Crux",
    title: "Cox Regression — Limited Adjustment Scope",
    body: "Cox proportional hazards regression is the standard method for identifying mortality predictors from time-to-event data. The critical limitation: this model adjusted only for age and gender. Comorbidities, COVID-19 severity, treatment protocols, and geographic variation in care standards were not controlled. With 11 deaths, adding more covariates would risk overfitting — so the narrow adjustment is a genuine statistical constraint, not an oversight.",
    structural: "This is the second crux, but it only affects the <em>mortality predictor</em> chain. The chronology chain uses Kaplan-Meier (a different method), so it survives if this node falls. That selective invalidation pattern is the key structural insight.",
  },
  uvmv: {
    cat: "clinical", label: "Statistical Pipeline",
    title: "Univariate Screening → Multivariate Filter",
    body: "Four variables reached statistical significance in univariate analysis. Three survived after adjustment for age and gender:<br><br><strong>WBC count</strong> — HR 1.013 per unit increase. Statistically significant (p=.042) but clinically tiny.<br><br><strong>AST/ALT ratio ≥ 2</strong> — HR 11.05. The headline number. But the confidence interval spans 1.4 to 84.8 — a 60-fold range.<br><br><strong>Surgical intervention</strong> — HR 6.60, p=.010. The strongest p-value, but the most questionable interpretation due to <em>confounding by indication</em>.<br><br><strong>Hypoalbuminemia</strong> (dropped) lost significance after adjustment (p=.065).",
    structural: "All three survivors depend on method.3 (the Cox regression). If the model's limited adjustment scope is inadequate, these \"independent predictors\" may be proxies for unmeasured confounders.",
  },
  mort9: {
    cat: "argument", label: "Synthesis Claim",
    title: "Three Independent Mortality Predictors",
    body: "The paper's headline conclusion: WBC count, AST/ALT ratio ≥ 2, and surgical intervention are independent predictors of mortality in COVID-19-induced acute pancreatitis. \"Independent\" here means independent of age and gender only.",
    structural: "This is a conjunctive synthesis — it requires all three predictor findings to hold. The deeper vulnerability is upstream: if method.1 or method.3 falls, all three collapse simultaneously.",
  },
  limit1: {
    cat: "argument", label: "Limitation",
    title: "Selection and Recall Bias",
    body: "Published case reports over-represent severe or unusual presentations (selection bias), and symptom timing relies on patient memory and clinician documentation (recall bias). Both systematically affect the cohort composition and the precision of temporal data.",
    structural: "A contrastive node — it argues <em>against</em> the strength of upstream claims without defeating them.",
  },
  limit2: {
    cat: "argument", label: "Limitation",
    title: "Terminology Gap",
    body: "The field lacks standardized terminology for distinguishing \"COVID-19-induced\" from \"concurrent COVID-19 and\" pancreatitis. The authors recognize their own definition (diagnosis by exclusion) is imperfect.",
    structural: "Creates a quasi-circular structure: the analysis depends on the definition, and the analysis reveals the definition is insufficient.",
  },
  chron1: {
    cat: "clinical", label: "Descriptive Baseline",
    title: "Symptom Prevalence and Temporal Sequencing",
    body: "GI symptoms occurred in 91.9% and respiratory symptoms in 79.3% of patients. Respiratory symptoms preceded admission more frequently (52.3% vs 30.6% GI-first).",
    structural: "Descriptive groundwork that enables the temporal analysis. Not a crux itself.",
  },
  clinbal: {
    cat: "clinical", label: "Clinical Profiles",
    title: "Onset Timing Profiles & Balthazar Severity",
    body: "<strong>Clinical profiles:</strong> Patients with pre-admission AP onset were significantly younger (36 vs 50 years), had lower lymphocyte counts, and higher radiologic severity.<br><br><strong>Balthazar associations:</strong> Higher radiologic severity was associated with GI-first presentation (p=.013) and pre-admission onset (p=.042), but <em>not</em> with the duration between symptom types.",
    structural: "The Balthazar findings set up the most analytically interesting observation: timing predicts imaging severity, but imaging severity apparently doesn't predict death.",
  },
  chron5: {
    cat: "argument", label: "Negative Finding Crux",
    title: "No Survival Difference by Symptom Sequence",
    body: "Kaplan-Meier analysis found no significant difference in survival between patients whose GI symptoms came first versus respiratory symptoms first (p=.543). But with only 11 deaths split across three groups, this analysis had very low statistical power.",
    structural: "Marked as a crux because the paper's central thesis rests on this null result. But it's an epistemically fragile crux: low power, wide confidence intervals.",
  },
  chron6: {
    cat: "argument", label: "Negative Finding Crux",
    title: "No Survival Difference by Onset Timing",
    body: "Whether AP developed before or during hospitalization did not significantly predict survival (p=.228). However, the raw mortality rates tell a different story: 8.1% vs 16.7% — a twofold difference the study was underpowered to detect.",
    structural: "The second fragile crux. Together with chron.5, this supports the synthesis claim that chronology doesn't matter. But both are epistemically weak.",
  },
  chron8: {
    cat: "argument", label: "Central Thesis",
    title: "Chronology Doesn't Predict Survival",
    body: "The paper's most ambitious claim: in true COVID-19-induced AP, symptom chronology does not predict survival — unlike in \"concurrent\" AP studies where comorbid etiologies worsen outcomes.",
    structural: "A conjunctive synthesis crux — depends on both K-M negative findings and the foundational inclusion criteria.",
  },
  chron10: {
    cat: "clinical", label: "External Evidence",
    title: "Concurrent AP Studies Show Worse Outcomes",
    body: "Multiple studies of \"concurrent COVID-19 and AP\" consistently found that COVID-19 comorbidity was associated with increased AP severity and mortality.",
    structural: "A purposive dependency — these findings serve the argumentative goal of establishing that the induced/concurrent distinction matters.",
  },
  chron11: {
    cat: "argument", label: "Limitation",
    title: "Recall Bias Biases Toward the Null",
    body: "Symptom onset timing relies on patient memory and clinician documentation, both of which vary. Non-differential measurement error biases survival analysis toward the null.",
    structural: "Particularly corrosive to the chronology argument because the key finding IS the null result. In a study with 11 events, it substantially undermines the \"no effect\" interpretation.",
  },
  chron9: {
    cat: "argument", label: "Annotator-Synthesized",
    title: "Balthazar-Survival Tension",
    body: "The most analytically interesting observation in the extraction — and one the paper does not address. Symptom chronology is significantly associated with radiologic severity (Balthazar score), but chronology does not predict survival.",
    structural: "This claim was synthesized by the annotator, not asserted by the authors. Status is UNDETERMINED. It emerged from juxtaposing two sets of findings the authors present separately.",
  },
};

export default function ScholionChenDependencyGraph() {
  const [ref, inView] = useInView(0.1);
  const { openKey, triggerRef, close, getNodeProps, getPopoverMouseProps } = useDiagramPopover();
  const cls = `chen-graph${inView ? " in-view" : ""}`;
  const popContent = openKey && POP_DATA[openKey]
    ? { ...POP_DATA[openKey], dotColor: POP_DATA[openKey].cat === "clinical" ? "var(--teal)" : "var(--accent)" }
    : null;

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
      <style>{chenStyles}</style>

      <div className="chen-label">Chen et al. (2025) — Dependency Structure · 25 claims, 2 chains</div>
      <div className="chen-scroll-hint">Scroll to see full graph →</div>

      <div className="chen-scroll">
        <div className="chen-graph-inner">

          {/* Level 0: Foundational Crux */}
          <div className="chen-node chen-crux" style={{ "--d": "0.1s", maxWidth: 340 } as React.CSSProperties} {...getNodeProps("method1")}>
            <div className="chen-node-id">
              <span className="chen-dot chen-dot-in" /> method.1
              <span className="chen-crux-badge">Crux</span>
            </div>
            <div className="chen-node-label">Inclusion criteria: COVID-19-induced AP defined by exclusion of alternative etiologies</div>
            <div className="chen-node-stat">Foundational — all 25 claims depend on this</div>
          </div>

          <div className="chen-cc"><div className="chen-vert chen-vert-accent" style={{ height: 24 }} /></div>

          {/* Level 1: Study Population */}
          <div className="chen-node" style={{ "--d": "0.2s", maxWidth: 280 } as React.CSSProperties} {...getNodeProps("method2")}>
            <div className="chen-node-id"><span className="chen-dot chen-dot-in" /> method.2</div>
            <div className="chen-node-label">111 patients from 87 case reports, dual-reviewer PRISMA screening</div>
            <div className="chen-node-stat">11 deaths (9.9% mortality) · median onset→death 7d</div>
          </div>

          <div className="chen-cc"><div className="chen-vert" style={{ height: 16 }} /></div>

          {/* Branch */}
          <div style={{ width: "60%", margin: "0 auto" }}><div className="chen-branch-bar" /></div>

          {/* Two chains */}
          <div className="chen-chains">

            {/* LEFT: Mortality Predictors */}
            <div className="chen-chain">
              <div className="chen-vert" style={{ height: 12 }} />
              <div className="chen-chain-label">Mortality Predictors</div>
              <div className="chen-vert" style={{ height: 12 }} />

              {/* method.3 */}
              <div className="chen-node chen-crux" style={{ "--d": "0.3s", maxWidth: 240 } as React.CSSProperties} {...getNodeProps("method3")}>
                <div className="chen-node-id">
                  <span className="chen-dot chen-dot-in" /> method.3
                  <span className="chen-crux-badge">Crux</span>
                </div>
                <div className="chen-node-label">Cox regression, adjusted for age + gender only</div>
                <div className="chen-node-stat">n=111, 11 events · ~10 events/covariate limit</div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 16 }} /></div>
              <div className="chen-dep-type">conditional</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 12 }} /></div>

              {/* UV→MV grouped block */}
              <div className="chen-group-block" style={{ "--d": "0.45s", maxWidth: 380 } as React.CSSProperties} {...getNodeProps("uvmv")}>
                <div className="chen-group-header">Univariate screening → Multivariate filter</div>
                <div className="chen-group-items">
                  <div className="chen-gi"><div className="chen-gi-label">WBC count</div><div className="chen-gi-stat">HR 1.014 → 1.013 (adj.)</div><div className="chen-gi-stat">p = .042</div></div>
                  <div className="chen-gi"><div className="chen-gi-label">AST/ALT ≥ 2</div><div className="chen-gi-stat">HR 7.93 → 11.05 (adj.)</div><div className="chen-gi-stat">CI 1.4 – 84.8</div></div>
                  <div className="chen-gi"><div className="chen-gi-label">Surgery</div><div className="chen-gi-stat">HR 6.30 → 6.60 (adj.)</div><div className="chen-gi-stat">p = .010 · n=7</div></div>
                  <div className="chen-gi chen-gi-dropped"><div className="chen-gi-label-d">Albumin</div><div className="chen-gi-stat">Lost in MV · p = .065</div></div>
                </div>
                <div className="chen-group-arrow">4 univariate significant → 3 survive adjustment</div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 12 }} /></div>
              <div className="chen-dep-type">conjunctive</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 8 }} /></div>

              {/* Synthesis: mortality.9 */}
              <div className="chen-node chen-synthesis chen-med-conf" style={{ "--d": "0.6s", maxWidth: 260 } as React.CSSProperties} {...getNodeProps("mort9")}>
                <div className="chen-node-id"><span className="chen-dot chen-dot-in" /> mortality.9</div>
                <div className="chen-node-label">Three independent mortality predictors in COVID-19-induced AP</div>
                <div className="chen-node-stat">Synthesis · medium confidence</div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 16 }} /></div>
              <div className="chen-dep-type">contrastive</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 8 }} /></div>
              <div style={{ width: "80%", margin: "0 auto" }}><div className="chen-branch-bar" /></div>

              {/* Limitations */}
              <div className="chen-chain-row">
                <div className="chen-node chen-limitation" style={{ "--d": "0.7s", maxWidth: 150 } as React.CSSProperties} {...getNodeProps("limit1")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}><span className="chen-dot chen-dot-in" /> limit.1</div>
                  <div className="chen-node-label" style={{ fontSize: "0.65rem" }}>Selection + recall bias</div>
                </div>
                <div className="chen-node chen-limitation" style={{ "--d": "0.75s", maxWidth: 150 } as React.CSSProperties} {...getNodeProps("limit2")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}><span className="chen-dot chen-dot-in" /> limit.2</div>
                  <div className="chen-node-label" style={{ fontSize: "0.65rem" }}>Terminology gap</div>
                  <div className="chen-node-stat">Feeds back to method.1</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Symptom Chronology */}
            <div className="chen-chain">
              <div className="chen-vert" style={{ height: 12 }} />
              <div className="chen-chain-label">Symptom Chronology</div>
              <div className="chen-vert" style={{ height: 12 }} />

              <div className="chen-node" style={{ "--d": "0.3s", maxWidth: 240 } as React.CSSProperties} {...getNodeProps("chron1")}>
                <div className="chen-node-id"><span className="chen-dot chen-dot-in" /> chronology.1</div>
                <div className="chen-node-label">Symptom prevalence and temporal sequencing</div>
                <div className="chen-node-stat">91.9% GI · 79.3% respiratory · 52.3% resp-first</div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 12 }} /></div>

              {/* Clinical profiles + Balthazar */}
              <div className="chen-group-block" style={{ "--d": "0.45s", maxWidth: 300 } as React.CSSProperties} {...getNodeProps("clinbal")}>
                <div className="chen-group-header">Clinical profiles &amp; radiologic severity</div>
                <div className="chen-group-items">
                  <div className="chen-gi"><div className="chen-gi-label">Onset timing profiles</div><div className="chen-gi-stat">Age, lymphocytes, N/L ratio differ by timing</div></div>
                  <div className="chen-gi"><div className="chen-gi-label">Balthazar associations</div><div className="chen-gi-stat">GI-first → higher severity (p=.013)</div></div>
                </div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 12 }} /></div>
              <div className="chen-dep-type">conditional</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 8 }} /></div>

              {/* Two K-M negative findings */}
              <div className="chen-chain-row">
                <div className="chen-node chen-crux chen-low-conf" style={{ "--d": "0.6s", maxWidth: 160 } as React.CSSProperties} {...getNodeProps("chron5")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}>
                    <span className="chen-dot chen-dot-in" /> chron.5
                    <span className="chen-crux-badge" style={{ fontSize: "0.4rem" }}>Crux</span>
                  </div>
                  <div className="chen-node-label" style={{ fontSize: "0.65rem" }}>No survival diff by symptom sequence</div>
                  <div className="chen-node-stat">K-M p = .543 · 11 events</div>
                </div>
                <div className="chen-node chen-crux chen-low-conf" style={{ "--d": "0.65s", maxWidth: 160 } as React.CSSProperties} {...getNodeProps("chron6")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}>
                    <span className="chen-dot chen-dot-in" /> chron.6
                    <span className="chen-crux-badge" style={{ fontSize: "0.4rem" }}>Crux</span>
                  </div>
                  <div className="chen-node-label" style={{ fontSize: "0.65rem" }}>No survival diff by onset timing</div>
                  <div className="chen-node-stat">K-M p = .228 · 8.1% vs 16.7%</div>
                </div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 12 }} /></div>
              <div className="chen-dep-type">conjunctive</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 8 }} /></div>

              {/* Synthesis: chronology.8 */}
              <div className="chen-node chen-synthesis chen-crux chen-med-conf" style={{ "--d": "0.75s", maxWidth: 260 } as React.CSSProperties} {...getNodeProps("chron8")}>
                <div className="chen-node-id">
                  <span className="chen-dot chen-dot-in" /> chronology.8
                  <span className="chen-crux-badge">Crux</span>
                </div>
                <div className="chen-node-label">Chronology does not predict survival — distinguishes induced from concurrent AP</div>
                <div className="chen-node-stat">Central thesis · medium confidence</div>
              </div>

              <div className="chen-cc"><div className="chen-vert" style={{ height: 16 }} /></div>
              <div className="chen-dep-type">contrastive</div>
              <div className="chen-cc"><div className="chen-vert" style={{ height: 8 }} /></div>
              <div style={{ width: "80%", margin: "0 auto" }}><div className="chen-branch-bar" /></div>

              {/* Bottom row */}
              <div className="chen-chain-row">
                <div className="chen-node" style={{ "--d": "0.85s", maxWidth: 130 } as React.CSSProperties} {...getNodeProps("chron10")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}><span className="chen-dot chen-dot-in" /> chron.10</div>
                  <div className="chen-node-label" style={{ fontSize: "0.625rem" }}>External: concurrent AP worse outcomes</div>
                </div>
                <div className="chen-node chen-limitation" style={{ "--d": "0.9s", maxWidth: 130 } as React.CSSProperties} {...getNodeProps("chron11")}>
                  <div className="chen-node-id" style={{ fontSize: "0.5rem" }}><span className="chen-dot chen-dot-in" /> chron.11</div>
                  <div className="chen-node-label" style={{ fontSize: "0.625rem" }}>Recall bias → null</div>
                </div>
              </div>

              {/* Balthazar-survival tension */}
              <div className="chen-cc"><div className="chen-vert" style={{ height: 16 }} /></div>
              <div className="chen-node chen-annotator-synth" style={{ "--d": "1.0s", maxWidth: 240 } as React.CSSProperties} {...getNodeProps("chron9")}>
                <div className="chen-node-id" style={{ fontSize: "0.5rem" }}><span className="chen-dot chen-dot-und" /> chronology.9</div>
                <div className="chen-node-label" style={{ fontSize: "0.7rem" }}>Balthazar-survival tension: timing predicts severity but not death</div>
                <div className="chen-node-stat">Annotator-synthesized · UNDETERMINED</div>
              </div>
            </div>

          </div>
          {/* end chains */}
        </div>
      </div>

      {/* Selective invalidation annotation */}
      <div className="chen-inv-note">
        <strong>Selective invalidation:</strong> If <strong>method.1</strong> falls, all 25 claims collapse — both chains depend on the induced/coincident distinction. If <strong>method.3</strong> falls, only the mortality chain collapses; the chronology chain uses Kaplan-Meier, not Cox regression, and survives. This asymmetry is invisible in the prose but immediate in the graph.
      </div>

      {/* Legend */}
      <div className="chen-legend">
        <div className="chen-legend-item"><span className="chen-legend-swatch chen-lsw-crux" /> Crux (load-bearing)</div>
        <div className="chen-legend-item"><span className="chen-legend-swatch chen-lsw-synth" /> Synthesis / grouped</div>
        <div className="chen-legend-item"><span className="chen-legend-swatch chen-lsw-limit" /> Contrastive / limitation</div>
        <div className="chen-legend-item"><span className="chen-legend-swatch chen-lsw-std" /> Standard claim</div>
        <div className="chen-legend-item"><span className="chen-legend-dot chen-dot-in" /> IN</div>
        <div className="chen-legend-item"><span className="chen-legend-dot chen-dot-und" /> UNDETERMINED</div>
        <div className="chen-legend-item" style={{ fontStyle: "italic" }}>Reduced opacity = lower confidence · Tap any node for context</div>
      </div>

      <DiagramPopover
        content={popContent}
        triggerRef={triggerRef}
        open={!!openKey}
        onClose={close}
        {...getPopoverMouseProps()}
      />
    </div>
  );
}

const chenStyles = `
  .chen-graph .chen-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-muted); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .chen-graph .chen-label::before {
    content: ''; display: block; width: 12px; height: 1.5px;
    background-color: var(--accent);
  }
  .chen-graph .chen-scroll-hint {
    display: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.625rem; color: var(--text-muted);
    text-align: right; margin-bottom: 8px;
  }
  .chen-graph .chen-scroll {
    overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px;
  }
  .chen-graph .chen-graph-inner {
    display: flex; flex-direction: column; align-items: center;
  }
  /* Nodes */
  .chen-graph .chen-node {
    background: #FFFFFF;
    border: 1px solid #E8E2D8;
    border-radius: 6px; padding: 10px 12px;
    position: relative; cursor: pointer;
    transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.15s ease;
    opacity: 0; transform: translateY(8px);
  }
  .chen-graph .chen-node:hover, .chen-graph .chen-node:focus-visible {
    box-shadow: 0 2px 12px rgba(44, 36, 22, 0.08); outline: none;
  }
  .chen-graph.in-view .chen-node {
    opacity: 1; transform: translateY(0); transition-delay: var(--d, 0s);
  }
  .chen-node-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; font-weight: 500;
    color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 0.03em; margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }
  .chen-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .chen-dot-in { background-color: var(--teal); }
  .chen-dot-und { background-color: var(--accent); }
  .chen-node-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; font-weight: 500;
    color: var(--text); line-height: 1.35;
  }
  .chen-node-stat {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; color: var(--text-light); margin-top: 3px;
    line-height: 1.3;
  }
  /* Node variants — specificity must match .chen-graph .chen-node */
  .chen-graph .chen-crux {
    border-left: 3px solid var(--accent);
    background: linear-gradient(135deg, #FFFFFF, var(--accent-dim));
  }
  .chen-graph .chen-crux .chen-node-label { font-weight: 600; }
  .chen-crux-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.5rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--accent); background-color: var(--accent-dim);
    padding: 1px 5px; border-radius: 3px;
  }
  .chen-graph .chen-synthesis { background: var(--bg-warm); border-color: var(--border-mid); }
  .chen-graph .chen-limitation { border-left: 2px solid var(--red); }
  .chen-graph .chen-low-conf { opacity: 0.72; }
  .chen-graph .chen-med-conf { opacity: 0.88; }
  .chen-graph .chen-annotator-synth { opacity: 0.75; border-left: 2px dashed var(--accent); }
  /* Connectors */
  .chen-cc { display: flex; flex-direction: column; align-items: center; }
  .chen-vert { width: 1px; background-color: var(--border-mid); }
  .chen-vert-accent { width: 1.5px; background-color: var(--accent); }
  .chen-branch-bar { height: 1px; background-color: var(--border-mid); }
  .chen-dep-type {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.45rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--text-muted); background-color: var(--bg);
    padding: 0 4px; line-height: 1; z-index: 1; position: relative;
  }
  /* Chains layout */
  .chen-chains {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 32px; width: 100%;
  }
  .chen-chain {
    display: flex; flex-direction: column; align-items: center;
  }
  .chen-chain-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.625rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-light); text-align: center;
    padding: 6px 12px;
  }
  .chen-chain-row {
    display: flex; gap: 8px; justify-content: center;
    width: 100%; max-width: 340px;
  }
  /* Group blocks */
  .chen-group-block {
    background: var(--bg-warm);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 12px 14px;
    cursor: pointer;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.15s ease;
  }
  .chen-group-block:hover, .chen-group-block:focus-visible {
    box-shadow: 0 2px 12px rgba(44, 36, 22, 0.08); outline: none;
  }
  .chen-graph.in-view .chen-group-block {
    opacity: 1; transform: translateY(0); transition-delay: var(--d, 0s);
  }
  .chen-group-header {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.5rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--text-muted); margin-bottom: 8px;
  }
  .chen-group-items {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .chen-gi {
    background: #FFFFFF; border: 1px solid #E8E2D8;
    border-radius: 4px; padding: 6px 8px;
    flex: 1; min-width: 90px;
  }
  .chen-gi-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.625rem; font-weight: 500; color: var(--text);
    line-height: 1.3;
  }
  .chen-gi-stat {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.5rem; color: var(--text-light); margin-top: 2px;
  }
  .chen-gi-dropped {
    opacity: 0.5; border-style: dashed;
  }
  .chen-gi-label-d {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.625rem; font-weight: 500; color: var(--text-muted);
    line-height: 1.3;
    text-decoration: line-through;
    text-decoration-color: var(--border-mid);
  }
  .chen-group-arrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6rem; color: var(--text-muted);
    text-align: center; padding: 4px 0;
  }
  /* Annotation */
  .chen-inv-note {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6875rem; color: var(--text-light);
    line-height: 1.4; padding: 12px 16px;
    background-color: var(--bg-warm);
    border-left: 3px solid var(--accent);
    border-radius: 0 6px 6px 0; margin-top: 24px;
  }
  .chen-inv-note strong { color: var(--text-mid); font-weight: 600; }
  /* Legend */
  .chen-legend {
    display: flex; gap: 20px; flex-wrap: wrap;
    margin-top: 20px; padding-top: 16px;
    border-top: 1px solid var(--border);
  }
  .chen-legend-item {
    display: flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem; color: var(--text-mid);
  }
  .chen-legend-swatch { width: 18px; height: 13px; border-radius: 3px; flex-shrink: 0; }
  .chen-lsw-crux { border: 1px solid #E8E2D8; border-left: 3px solid var(--accent); background: linear-gradient(135deg, #FFFFFF, var(--accent-dim)); }
  .chen-lsw-synth { background: var(--bg-warm); border: 1px solid var(--border-mid); }
  .chen-lsw-limit { border: 1px solid #E8E2D8; border-left: 2px solid var(--red); background: #FFFFFF; }
  .chen-lsw-std { background: #FFFFFF; border: 1px solid #E8E2D8; }
  .chen-legend-dot { width: 7px; height: 7px; border-radius: 50%; }
  /* Reduced motion overrides for confidence opacity */
  @media (prefers-reduced-motion: reduce) {
    .chen-graph.in-view .chen-low-conf { opacity: 0.72; }
    .chen-graph.in-view .chen-med-conf { opacity: 0.88; }
    .chen-graph.in-view .chen-annotator-synth { opacity: 0.75; }
  }
  @media (max-width: 860px) {
    .chen-graph .chen-scroll-hint { display: block; }
  }
`;
