import { useState, useEffect, useRef } from "react";
import { Cpu, GitBranch, Layers, Zap, ArrowRight, Target, X, Check, AlertTriangle, Maximize2, Binary, Network, Gauge, FlaskConical, ChevronRight, Minus } from "lucide-react";

// ─── Utility: Intersection Observer Hook ───
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Accent Colors ───
const C = {
  accent: "#3A7CA5",
  accentDark: "#2C6080",
  accentLight: "#3A7CA515",
  accentMid: "#3A7CA540",
  green: "#5B8A72",
  warm: "#C4713B",
  purple: "#7C6F9B",
  rust: "#8B6E5A",
  text: "#2A1F14",
  textBody: "#3A2A1A",
  textMid: "#4A3A2A",
  textLight: "#6B5A4A",
  textMuted: "#8A7A6A",
  textFaint: "#9A8A7A",
  border: "#E8DFD4",
  borderLight: "#EDE6DC",
  bgWarm: "#FFF8F0",
  bgPage: "#FEFCF9",
  bgSubtle: "#FAF6F0",
  muted: "#CBBFB0",
};

// ─── Section Divider ───
function SectionDivider({ number, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      margin: "64px 0 32px",
    }}>
      <span style={{
        fontFamily: "'Newsreader', 'Georgia', serif",
        fontSize: "12px",
        letterSpacing: "2px",
        color: C.muted,
        textTransform: "uppercase",
      }}>Section {number}</span>
      <div style={{ flex: 1, height: "1px", background: C.border }} />
    </div>
  );
}

// ─── Pull Quote ───
function PullQuote({ children }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{
      maxWidth: "720px",
      margin: "56px auto",
      padding: "40px 48px",
      textAlign: "center",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      <div style={{
        width: "40px",
        height: "2px",
        background: C.accent,
        margin: "0 auto 28px",
      }} />
      <p style={{
        fontFamily: "'Newsreader', 'Georgia', serif",
        fontSize: "24px",
        fontWeight: 400,
        lineHeight: 1.5,
        color: C.text,
        fontStyle: "italic",
      }}>{children}</p>
      <div style={{
        width: "40px",
        height: "2px",
        background: C.accent,
        margin: "28px auto 0",
      }} />
    </div>
  );
}

// ─── Coupling Diagram ───
// Shows four decision spaces with weighted coupling lines between them
function CouplingDiagram() {
  const [ref, inView] = useInView(0.15);
  const [hoveredPair, setHoveredPair] = useState(null);

  const spaces = [
    { id: "fusion", label: "Operator Fusion", icon: Layers, desc: "Which ops merge into single kernels", color: C.accent },
    { id: "remat", label: "Rematerialization", icon: GitBranch, desc: "Which activations to recompute vs. store", color: C.green },
    { id: "parallel", label: "Parallelism Strategy", icon: Network, desc: "How work partitions across devices", color: C.purple },
    { id: "precision", label: "Numerical Precision", icon: Binary, desc: "FP32, BF16, FP8 per operation", color: C.warm },
  ];

  const couplings = [
    { a: "fusion", b: "remat", strength: 0.95, evidence: "12% throughput + 1.75× batch (MLSys '23)", label: "Strong" },
    { a: "fusion", b: "parallel", strength: 0.85, evidence: "2.73× speedup from joint reasoning (ASPLOS '22)", label: "Strong" },
    { a: "parallel", b: "remat", strength: 0.75, evidence: "Memory ↔ communication tradeoff (OSDI '22)", label: "Strong" },
    { a: "fusion", b: "precision", strength: 0.5, evidence: "Cast placement interacts with kernel boundaries", label: "Moderate" },
    { a: "parallel", b: "precision", strength: 0.55, evidence: "Precision determines communication volumes", label: "Moderate" },
    { a: "remat", b: "precision", strength: 0.35, evidence: "Precision changes activation memory sizes", label: "Indirect" },
  ];

  // Position spaces in a diamond layout
  const positions = {
    fusion:    { x: 50, y: 10 },
    remat:     { x: 10, y: 50 },
    parallel:  { x: 90, y: 50 },
    precision: { x: 50, y: 90 },
  };

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>
          Decision Coupling
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: C.text, marginTop: "8px" }}>
          Four decisions. Six pairwise interactions. All handled sequentially.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
        {/* Diamond layout */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          aspectRatio: "1",
        }}>
          {/* SVG coupling lines */}
          <svg style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }} viewBox="0 0 100 100">
            {couplings.map((c, i) => {
              const pa = positions[c.a];
              const pb = positions[c.b];
              const isHovered = hoveredPair === i;
              const spaceA = spaces.find(s => s.id === c.a);
              return (
                <g key={`${c.a}-${c.b}`}>
                  <line
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke={isHovered ? spaceA.color : C.border}
                    strokeWidth={isHovered ? c.strength * 2.5 : c.strength * 1.8}
                    strokeDasharray={c.strength < 0.5 ? "3 3" : "none"}
                    style={{
                      opacity: inView ? (isHovered ? 1 : 0.5) : 0,
                      transition: `all 0.6s ease ${0.3 + i * 0.08}s`,
                    }}
                  />
                  {/* Invisible wider hitbox for hover */}
                  <line
                    x1={pa.x} y1={pa.y}
                    x2={pb.x} y2={pb.y}
                    stroke="transparent"
                    strokeWidth="8"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredPair(i)}
                    onMouseLeave={() => setHoveredPair(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Space nodes */}
          {spaces.map((space, i) => {
            const pos = positions[space.id];
            const Icon = space.icon;
            return (
              <div key={space.id} style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 2,
                opacity: inView ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`,
              }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: `${space.color}12`,
                  border: `1.5px solid ${space.color}50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Icon size={22} color={space.color} strokeWidth={1.5} />
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: space.color,
                  marginTop: "8px",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}>{space.label}</p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: C.textMuted,
                  textAlign: "center",
                  maxWidth: "130px",
                  marginTop: "2px",
                }}>{space.desc}</p>
              </div>
            );
          })}

          {/* Center label */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 1,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 0.8s",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: C.muted,
            }}>Sequential<br/>pipeline</p>
          </div>
        </div>

        {/* Coupling detail on hover */}
        <div style={{
          maxWidth: "580px",
          margin: "0 auto",
          padding: "16px 24px",
          background: hoveredPair !== null ? C.bgWarm : "transparent",
          borderLeft: hoveredPair !== null ? `3px solid ${C.accent}` : "3px solid transparent",
          borderRadius: "0 8px 8px 0",
          minHeight: "64px",
          transition: "all 0.3s ease",
        }}>
          {hoveredPair !== null ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: C.accent,
                }}>
                  {spaces.find(s => s.id === couplings[hoveredPair].a)?.label} × {spaces.find(s => s.id === couplings[hoveredPair].b)?.label}
                </p>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: couplings[hoveredPair].strength > 0.7 ? C.green : couplings[hoveredPair].strength > 0.45 ? C.warm : C.textMuted,
                  padding: "2px 8px",
                  background: couplings[hoveredPair].strength > 0.7 ? `${C.green}15` : couplings[hoveredPair].strength > 0.45 ? `${C.warm}15` : `${C.textMuted}10`,
                  borderRadius: "4px",
                }}>{couplings[hoveredPair].label}</span>
              </div>
              <p style={{
                fontFamily: "'Newsreader', 'Georgia', serif",
                fontSize: "14px",
                color: C.textBody,
                lineHeight: 1.6,
              }}>{couplings[hoveredPair].evidence}</p>
            </>
          ) : (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: C.muted,
              fontStyle: "italic",
            }}>Hover a coupling line to see the evidence</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Landscape Positioning ───
// Quadrant diagram: # of coupled spaces × optimization approach
function LandscapeQuadrant() {
  const [ref, inView] = useInView(0.15);
  const [hovered, setHovered] = useState(null);

  const systems = [
    { id: "xla", label: "XLA", sub: "Google", x: 12, y: 24, color: C.textMuted, desc: "Sequential heuristic passes, single-space optimization per pass" },
    { id: "torchc", label: "torch.compile", sub: "Meta", x: 18, y: 34, color: C.textMuted, desc: "Min-cut partitioner implicitly couples fusion + remat, but still sequential" },
    { id: "alpa", label: "Alpa", sub: "Berkeley", x: 55, y: 40, color: C.purple, desc: "Joint inter/intra-op parallelism via hierarchical ILP + DP (OSDI '22)" },
    { id: "unity", label: "Unity", sub: "CMU/Stanford", x: 52, y: 52, color: C.purple, desc: "Joint algebraic transforms + parallelism via PCG representation (OSDI '22)" },
    { id: "go", label: "GO", sub: "NeurIPS '20", x: 52, y: 78, color: C.green, desc: "GNN policy for joint device placement + fusion — closest prior art" },
    { id: "mlgo", label: "MLGO", sub: "Google", x: 15, y: 82, color: C.green, desc: "Learned inlining in LLVM, production-deployed — single pass, but learned" },
    { id: "planner", label: "Joint Planner", sub: "Proposed", x: 85, y: 85, color: C.accent, desc: "Learned GNN policy across all four decision spaces, hardware-conditioned" },
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>
          Research Landscape
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: C.text, marginTop: "8px" }}>
          The quadrant no one occupies.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Quadrant field */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          background: C.bgWarm,
          overflow: "hidden",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          {/* Axis labels */}
          <div style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: C.muted,
          }}>Decision spaces coupled →</div>
          <div style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: C.muted,
            whiteSpace: "nowrap",
          }}>Optimization approach →</div>

          {/* Y-axis ticks */}
          <div style={{ position: "absolute", left: "32px", top: "16%", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.muted }}>Heuristic</div>
          <div style={{ position: "absolute", left: "32px", top: "82%", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.muted }}>Learned</div>

          {/* X-axis ticks */}
          <div style={{ position: "absolute", bottom: "28px", left: "14%", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.muted }}>1</div>
          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.muted }}>2</div>
          <div style={{ position: "absolute", bottom: "28px", right: "10%", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.muted }}>4</div>

          {/* Quadrant dividers */}
          <div style={{ position: "absolute", left: "38%", top: 0, bottom: "40px", width: "1px", background: `${C.border}80` }} />
          <div style={{ position: "absolute", top: "55%", left: "32px", right: 0, height: "1px", background: `${C.border}80` }} />

          {/* Target zone */}
          <div style={{
            position: "absolute",
            right: "2%",
            bottom: "40px",
            width: "28%",
            height: "40%",
            borderRadius: "12px",
            border: `2px dashed ${C.accent}30`,
            background: `${C.accent}06`,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }} />

          {/* System dots */}
          {systems.map((sys, i) => {
            const isTarget = sys.id === "planner";
            const isHov = hovered === sys.id;
            return (
              <div
                key={sys.id}
                onMouseEnter={() => setHovered(sys.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: `${sys.x}%`,
                  top: `${100 - sys.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isHov ? 10 : 2,
                  cursor: "pointer",
                  opacity: inView ? 1 : 0,
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + i * 0.1}s`,
                }}
              >
                <div style={{
                  width: isTarget ? "14px" : "10px",
                  height: isTarget ? "14px" : "10px",
                  borderRadius: "50%",
                  background: sys.color,
                  border: isTarget ? `3px solid ${C.accent}40` : "2px solid #FFF8F0",
                  boxShadow: isHov ? `0 0 0 4px ${sys.color}25` : "none",
                  transition: "box-shadow 0.2s ease",
                }} />
                <div style={{
                  position: "absolute",
                  top: isTarget ? "-6px" : "0",
                  left: "calc(100% + 8px)",
                  whiteSpace: "nowrap",
                }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: isTarget ? "13px" : "11px",
                    fontWeight: isTarget ? 700 : 600,
                    color: sys.color,
                  }}>{sys.label}</p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    color: C.textFaint,
                  }}>{sys.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover detail */}
        <div style={{
          maxWidth: "580px",
          margin: "16px auto 0",
          padding: "12px 20px",
          minHeight: "44px",
          background: hovered ? C.bgWarm : "transparent",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}>
          {hovered ? (
            <p style={{
              fontFamily: "'Newsreader', 'Georgia', serif",
              fontSize: "14px",
              color: C.textBody,
              lineHeight: 1.6,
            }}>
              <strong style={{ color: systems.find(s => s.id === hovered)?.color }}>{systems.find(s => s.id === hovered)?.label}:</strong>{" "}
              {systems.find(s => s.id === hovered)?.desc}
            </p>
          ) : (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: C.muted, fontStyle: "italic", textAlign: "center" }}>
              Hover a system to see details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nested Claims Flow ───
function NestedClaimsFlow() {
  const [ref, inView] = useInView(0.15);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const timers = [0, 1, 2].map(i =>
      setTimeout(() => setActiveStep(i), 600 + i * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const claims = [
    {
      num: "1",
      label: "Coupling",
      question: "Is it strong enough to matter?",
      evidence: "Strong",
      evidenceColor: C.green,
      kill: "< 5% throughput gap",
      test: "GPT-2 124M, single A100, ~$200",
      color: C.accent,
    },
    {
      num: "2",
      label: "Learnability",
      question: "Can a GNN policy exploit the joint space?",
      evidence: "Indirect",
      evidenceColor: C.warm,
      kill: "Can't beat sequential on training data",
      test: "GNN on fusion × remat, transformer family",
      color: C.purple,
    },
    {
      num: "3",
      label: "Hardware Generalization",
      question: "Can the planner generalize across targets?",
      evidence: "Thin",
      evidenceColor: "#C0392B",
      kill: "Fine-tuning with 100 samples always wins",
      test: "Hardware-conditioned model, 3–4 GPU types",
      color: C.green,
    },
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>
          Validation Structure
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: C.text, marginTop: "8px" }}>
          Three nested claims. Each depends on the previous.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}>
        {claims.map((claim, i) => {
          const isActive = activeStep >= i;
          const isLast = i === claims.length - 1;
          return (
            <div key={claim.num}>
              {/* Claim card */}
              <div style={{
                display: "flex",
                gap: "20px",
                padding: "24px 28px",
                background: isActive ? C.bgWarm : "#FEFCF9",
                border: `1px solid ${isActive ? `${claim.color}30` : C.border}`,
                borderRadius: "12px",
                opacity: isActive ? 1 : 0.3,
                transform: isActive ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              }}>
                {/* Number */}
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: isActive ? `${claim.color}15` : "transparent",
                  border: `1.5px solid ${isActive ? claim.color : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.5s ease",
                }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: isActive ? claim.color : C.muted,
                    transition: "color 0.5s ease",
                  }}>{claim.num}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: isActive ? claim.color : C.muted,
                      transition: "color 0.5s ease",
                    }}>{claim.label}</p>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      color: isActive ? claim.evidenceColor : C.muted,
                      background: isActive ? `${claim.evidenceColor}12` : "transparent",
                      transition: "all 0.5s ease",
                    }}>Evidence: {claim.evidence}</span>
                  </div>
                  <p style={{
                    fontFamily: "'Newsreader', 'Georgia', serif",
                    fontSize: "15px",
                    color: isActive ? C.textBody : C.muted,
                    marginBottom: "12px",
                    transition: "color 0.5s ease",
                  }}>{claim.question}</p>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      padding: "8px 12px",
                      background: isActive ? "#FFF" : "transparent",
                      borderRadius: "6px",
                      border: isActive ? `1px solid ${C.borderLight}` : "1px solid transparent",
                      transition: "all 0.4s ease 0.2s",
                    }}>
                      <X size={13} color="#C0392B" strokeWidth={2.5} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: C.textMuted, marginBottom: "2px" }}>Kill if</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: C.textLight }}>{claim.kill}</p>
                      </div>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      padding: "8px 12px",
                      background: isActive ? "#FFF" : "transparent",
                      borderRadius: "6px",
                      border: isActive ? `1px solid ${C.borderLight}` : "1px solid transparent",
                      transition: "all 0.4s ease 0.3s",
                    }}>
                      <FlaskConical size={13} color={C.accent} strokeWidth={2} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: C.textMuted, marginBottom: "2px" }}>Cheapest test</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: C.textLight }}>{claim.test}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "4px 0",
                  opacity: activeStep > i ? 1 : 0.2,
                  transition: "opacity 0.5s ease",
                }}>
                  <div style={{ width: "1px", height: "20px", background: C.border }} />
                  <ChevronRight size={14} color={C.muted} style={{ transform: "rotate(90deg)" }} />
                  <div style={{ width: "1px", height: "4px", background: C.border }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Evidence Grid ───
function EvidenceGrid() {
  const [ref, inView] = useInView(0.15);

  const papers = [
    { name: "Fusion-aware checkpointing", venue: "MLSys '23", claims: [3, 0, 0], type: "Direct" },
    { name: "AStitch", venue: "ASPLOS '22", claims: [3, 0, 0], type: "Direct" },
    { name: "Alpa", venue: "OSDI '22", claims: [3, 1, 0], type: "Direct" },
    { name: "Unity", venue: "OSDI '22", claims: [2, 1, 0], type: "Direct" },
    { name: "GO", venue: "NeurIPS '20", claims: [1, 3, 0], type: "Direct" },
    { name: "MLGO", venue: "Google '21", claims: [0, 2, 0], type: "Adjacent" },
    { name: "TVM / Ansor", venue: "OSDI '20", claims: [0, 2, 1], type: "Adjacent" },
    { name: "TenSet", venue: "NeurIPS '21", claims: [0, 1, 2], type: "Adjacent" },
    { name: "Fasor", venue: "ICS '24", claims: [0, 0, 2], type: "Adjacent" },
    { name: "GNN+RL JSSP", venue: "Various", claims: [0, 2, 0], type: "Analogous" },
  ];

  // 0 = none, 1 = indirect, 2 = moderate, 3 = strong
  const strengthLabel = ["", "Indirect", "Moderate", "Strong"];
  const strengthColor = ["transparent", C.textMuted, C.warm, C.green];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-8">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>
          Evidence Map
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: C.text, marginTop: "8px" }}>
          Where the evidence is strong. Where it's thin.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          background: C.bgSubtle,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ padding: "12px 20px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: C.textMuted }}>Source</p>
          </div>
          {["Coupling", "Learnability", "HW Transfer"].map((h, i) => (
            <div key={h} style={{ padding: "12px 16px", textAlign: "center", borderLeft: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.5px", color: [C.accent, C.purple, C.green][i] }}>{h}</p>
            </div>
          ))}
        </div>

        {/* Rows */}
        {papers.map((paper, i) => (
          <div key={paper.name} style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            borderBottom: i < papers.length - 1 ? `1px solid ${C.border}` : "none",
            background: i % 2 === 0 ? "#FFF" : C.bgWarm,
            opacity: inView ? 1 : 0,
            transition: `opacity 0.3s ease ${0.2 + i * 0.05}s`,
          }}>
            <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: C.textMid }}>{paper.name}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: C.textFaint }}>{paper.venue}</p>
            </div>
            {paper.claims.map((level, j) => (
              <div key={j} style={{
                padding: "10px 16px",
                textAlign: "center",
                borderLeft: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {level > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {[...Array(level)].map((_, k) => (
                      <div key={k} style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "2px",
                        background: strengthColor[level],
                      }} />
                    ))}
                  </div>
                ) : (
                  <Minus size={14} color={C.muted} strokeWidth={1} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        maxWidth: "720px",
        margin: "12px auto 0",
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
      }}>
        {[1, 2, 3].map(level => (
          <div key={level} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(level)].map((_, k) => (
                <div key={k} style={{ width: "8px", height: "8px", borderRadius: "2px", background: strengthColor[level] }} />
              ))}
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: C.textMuted }}>{strengthLabel[level]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Strategic Implications ───
function StrategicImplications() {
  const [ref, inView] = useInView(0.15);

  const implications = [
    {
      icon: Maximize2,
      title: "Heterogeneous Training",
      desc: "Convert stranded mixed-SKU capacity into usable compute. Change the supply curve for ML training.",
      status: "Contingent on Claim 3",
    },
    {
      icon: Cpu,
      title: "Chip Co-Design Tool",
      desc: "Evaluate compilation strategies for hypothetical accelerator specs — before fabrication.",
      status: "Contingent on Claim 3",
    },
    {
      icon: Gauge,
      title: "Decoupled Release Cycles",
      desc: "Planner adapts to new hardware instead of requiring months of manual heuristic development per target.",
      status: "Contingent on Claim 3",
    },
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-8">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>
          If It Works
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: C.text, marginTop: "8px" }}>
          Three consequences beyond raw throughput.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
      }}>
        {implications.map((imp, i) => {
          const Icon = imp.icon;
          return (
            <div key={imp.title} style={{
              padding: "24px 20px",
              background: C.bgWarm,
              borderRadius: "12px",
              border: `1px solid ${C.border}`,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.15}s`,
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: `${C.accent}12`,
                border: `1.5px solid ${C.accent}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}>
                <Icon size={20} color={C.accent} strokeWidth={1.5} />
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: C.text,
                marginBottom: "8px",
              }}>{imp.title}</p>
              <p style={{
                fontFamily: "'Newsreader', 'Georgia', serif",
                fontSize: "14px",
                lineHeight: 1.6,
                color: C.textLight,
                marginBottom: "12px",
              }}>{imp.desc}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: C.warm,
              }}>{imp.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Essay Page ───
export default function LearnedCompilationEssay() {
  return (
    <div style={{ minHeight: "100vh", background: C.bgPage }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: ${C.accent}30; }
      `}</style>

      {/* Hero */}
      <header style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "80px 24px 40px",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "14px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: C.accent,
          marginBottom: "24px",
        }}>Learned Compilation</p>

        <h1 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: C.text,
          maxWidth: "640px",
          margin: "0 auto",
        }}>
          ML Compilers Are Leaving 15–30% of Training Throughput on the Table
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: C.textMuted,
          marginTop: "24px",
          lineHeight: 1.6,
        }}>
          On compiler pass coupling, learned optimization,<br />
          and why no one has challenged the sequential pipeline.
        </p>

        <div style={{
          width: "1px",
          height: "48px",
          background: `linear-gradient(to bottom, ${C.border}, transparent)`,
          margin: "40px auto 0",
        }} />
      </header>

      {/* Hypothesis block */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 64px",
        padding: "24px 32px",
        background: C.bgWarm,
        borderRadius: "12px",
        border: `1px solid ${C.border}`,
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: C.accent,
          marginBottom: "10px",
        }}>Research Hypothesis</p>
        <p style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "16px",
          lineHeight: 1.7,
          color: C.textBody,
        }}>
          A learned planner — a graph neural network trained to jointly decide fusion, rematerialization, parallelism, and precision — can outperform the sequential heuristic pipelines used by every production ML compiler, and generalize across hardware targets.
        </p>
      </div>

      {/* Content */}
      <article style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "0 24px 80px",
      }}>
        <SectionDivider number="01" label="The Problem" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>The Sequential Pipeline and Its Costs</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p style={{ marginBottom: "16px" }}>
            Every major ML compiler — XLA, TorchInductor, Triton, AWS Neuron — faces the same constrained optimization problem: maximize training throughput subject to memory limits, numerical correctness, and hardware topology. The solution requires four tightly coupled decisions: which operations to fuse into single kernels, which activations to recompute rather than store, how to partition work across devices, and what numerical precision each operation should use.
          </p>
          <p style={{ marginBottom: "16px" }}>
            Every production compiler makes these decisions sequentially. Optimize fusion, then checkpointing, then parallelism, then precision — each pass treating the others' outputs as fixed. This is the standard approach in compiler engineering. It's also an architectural choice that no one has seriously challenged, despite mounting evidence that the interaction effects between these passes are large enough to matter at scale.
          </p>
          <p>
            The evidence comes from production systems and peer-reviewed results. A 2023 MLSys paper demonstrated that making checkpointing decisions <em>aware of</em> downstream fusion opportunities improves throughput by 12% and enables up to 1.75× larger batch sizes. Alpa showed that jointly optimizing parallelism strategies matches hand-tuned Megatron-LM. AStitch found up to 2.73× speedup from reasoning about parallelism during fusion. No system addresses all four at once — but the pairwise coupling is consistent, material, and currently unaddressed.
          </p>
        </div>

        <CouplingDiagram />

        <SectionDivider number="02" label="The Landscape" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>The Quadrant No One Occupies</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p style={{ marginBottom: "16px" }}>
            Map existing systems along two axes — how many decision spaces they couple, and whether they use hand-crafted heuristics or learned policies — and a clear gap emerges. Production compilers sit in the bottom-left: single-space heuristics. Research systems cluster in the middle: two spaces, sometimes learned. No system occupies the top-right corner: a learned policy across all four decision spaces.
          </p>
          <p>
            This might be because the problem is intractable — which would explain why so few groups work on it. Or it might be pre-paradigmatic: a real opportunity in an underexplored space. The research program is designed to distinguish between these possibilities.
          </p>
        </div>

        <LandscapeQuadrant />

        <PullQuote>
          Every organization running large-scale training is leaving 15–30% of achievable throughput unrealized due to a compiler architecture decision, not hardware limitations.
        </PullQuote>

        <SectionDivider number="03" label="Validation" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>Three Claims, Each With a Kill Switch</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p style={{ marginBottom: "16px" }}>
            The investigation is structured as three nested claims, ordered so that each depends on the previous one holding. This isn't academic caution — it's resource allocation. If coupling turns out to be below 5%, the entire project terminates before spending GPU-days on learnability experiments. If the learned policy can't beat sequential optimization on the easiest subproblem, there's no point testing hardware generalization.
          </p>
          <p>
            Each claim has an explicit falsification criterion and a cheapest-possible first test.
          </p>
        </div>

        <NestedClaimsFlow />

        <SectionDivider number="04" label="Evidence" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>The Evidence Gradient</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p style={{ marginBottom: "16px" }}>
            The evidence strength drops sharply across the three claims. Coupling has strong, direct, peer-reviewed support from multiple production systems. Learnability has encouraging but indirect evidence from adjacent domains — learned compiler passes, GNN-based scheduling, transfer learning for cost models. Hardware generalization has the thinnest evidence and the most strategic value: within-family transfer works, but cross-family generalization is unproven.
          </p>
          <p>
            The community working on learned compiler optimization is exceptionally small — perhaps a dozen groups worldwide. Direct conversations with key researchers may be more valuable than further literature review.
          </p>
        </div>

        <EvidenceGrid />

        <SectionDivider number="05" label="Stakes" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>What Changes If It Works</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p>
            Raw throughput improvement is the obvious payoff, but the strategic consequences of hardware generalization — the hardest claim — are larger. If a planner conditioned on a hardware profile vector can produce good optimization plans for targets it hasn't seen, three things change beyond compilation quality.
          </p>
        </div>

        <StrategicImplications />

        <SectionDivider number="06" label="Positioning" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: C.text,
          marginBottom: "20px",
        }}>Why I'm Working on This</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: C.textBody }}>
          <p style={{ marginBottom: "16px" }}>
            I built the initial compiler pipeline for AWS Neuron SDK, the compilation stack for Trainium chips. Before that I built Neptune ML (graph ML on AWS), worked on AutoML at H2O.ai, and most recently led training for Amazon's first production LLM. The thread across these roles has been the same: identifying where research capabilities are mature enough to become production systems, then building the bridge.
          </p>
          <p style={{ marginBottom: "16px" }}>
            The coupling effects I'm investigating aren't theoretical concerns. They're engineering problems I've watched compiler teams work around with manual tuning and architecture-specific heuristics. I know from direct experience how sequential pass optimization works in production and where it breaks down — and "breaks down" means "requires a team of experts to hand-tune for each new model and hardware target," which is a product problem, not just a research problem.
          </p>
          <p>
            This investigation is part of a broader research thread on AI acceleration infrastructure — the growing gap between how fast ML capabilities advance and how quickly the tooling adapts. The compilation problem is a concrete, measurable instance of a general pattern: sequential processes designed for a slower pace of change failing to keep up. A compiler that learns to jointly optimize for new hardware and architectures, rather than requiring manual heuristic updates for each, is one piece of what adapted infrastructure looks like.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "64px",
          paddingTop: "32px",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Newsreader', 'Georgia', serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: C.textFaint,
            lineHeight: 1.7,
          }}>
            Phase 0 research. Building calibrated technical judgment<br />
            before committing to experiments.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: C.accent,
            marginTop: "12px",
          }}>
            thomas@thbrdy.dev
          </p>
        </div>
      </article>
    </div>
  );
}
