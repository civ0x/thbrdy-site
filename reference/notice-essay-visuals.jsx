import { useState, useEffect, useRef } from "react";
import { Heart, Watch, Smartphone, Brain, Shield, Eye, Cloud, Lock, ArrowRight, ChevronDown, Fingerprint, Activity, Calendar, MapPin, MessageCircle, Sparkles, Check, X } from "lucide-react";

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

// ─── Competitive Positioning ───
function CompetitiveGap() {
  const [ref, inView] = useInView(0.15);
  const categories = [
    {
      name: "Meditation Apps",
      examples: "Headspace, Calm, Waking Up",
      has: ["Contemplative depth", "Guided practice"],
      missing: ["Moment-of-capture logging", "Biometric integration", "Emotional granularity"],
      color: "#7C6F9B",
      x: 15, y: 20
    },
    {
      name: "Mood Trackers",
      examples: "How We Feel, Daylio, Bearable",
      has: ["Emotion labeling", "Pattern tracking"],
      missing: ["Biometric data", "Contemplative grounding", "AI reflection"],
      color: "#5B8A72",
      x: 65, y: 20
    },
    {
      name: "Health Platforms",
      examples: "Oura, WHOOP, Apple Health",
      has: ["Biometric sensing", "Behavioral correlation"],
      missing: ["Emotional granularity", "Contemplative depth", "Subjective-first design"],
      color: "#8B6E5A",
      x: 40, y: 65
    }
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-8">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#B8860B" }}>
          Product Landscape
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: "#2A1F14", marginTop: "8px" }}>
          Three categories. None training the underlying capacity.
        </h3>
      </div>

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        aspectRatio: "4/3",
      }}>
        {/* Venn circles */}
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

        {/* Category labels */}
        {categories.map((cat, i) => {
          const labelPositions = [
            { left: "4%", top: "2%", textAlign: "left" },
            { right: "4%", top: "2%", textAlign: "right" },
            { left: "50%", bottom: "0%", textAlign: "center", transform: "translateX(-50%)" },
          ];
          return (
            <div key={`label-${cat.name}`} style={{
              position: "absolute",
              ...labelPositions[i],
              opacity: inView ? 1 : 0,
              transition: `opacity 0.6s ease ${0.4 + i * 0.15}s`,
              maxWidth: "180px",
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: cat.color,
                marginBottom: "2px",
                textAlign: labelPositions[i].textAlign,
              }}>{cat.name}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: "#8A7A6A",
                textAlign: labelPositions[i].textAlign,
              }}>{cat.examples}</p>
            </div>
          );
        })}

        {/* Notice at the center */}
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
              fontFamily: "'Newsreader', 'Georgia', serif",
              fontSize: "22px",
              fontWeight: 500,
              color: "#FFF8F0",
              letterSpacing: "0.5px",
            }}>Notice</span>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "#6B5A4A",
            maxWidth: "140px",
            lineHeight: 1.4,
          }}>Contemplative depth + biometric sensing + emotional granularity</p>
        </div>
      </div>

      {/* Feature comparison strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "1px",
        background: "#E8DFD4",
        borderRadius: "12px",
        overflow: "hidden",
        maxWidth: "720px",
        margin: "24px auto 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 1s",
      }}>
        {/* Header row */}
        <div style={{ background: "#FAF6F0", padding: "12px 16px" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8A7A6A", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Capability</p>
        </div>
        {categories.map(cat => (
          <div key={`h-${cat.name}`} style={{ background: "#FAF6F0", padding: "12px 16px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: cat.color, fontWeight: 600 }}>{cat.name.split(" ")[0]}</p>
          </div>
        ))}
        {/* Capability rows */}
        {["Biometric sensing", "Emotion labeling", "Contemplative grounding", "AI reflection", "Subjective-first"].map(cap => (
          [
            <div key={`cap-${cap}`} style={{ background: "#FFF8F0", padding: "10px 16px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#4A3A2A" }}>{cap}</p>
            </div>,
            ...categories.map(cat => {
              const hasCap = cap === "Biometric sensing" ? cat.name === "Health Platforms"
                : cap === "Emotion labeling" ? cat.name === "Mood Trackers"
                : cap === "Contemplative grounding" ? cat.name === "Meditation Apps"
                : false;
              return (
                <div key={`${cap}-${cat.name}`} style={{ background: "#FFF8F0", padding: "10px 16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {hasCap ? <Check size={14} color="#5B8A72" strokeWidth={2.5} /> : <X size={14} color="#CBBFB0" strokeWidth={1.5} />}
                </div>
              );
            })
          ]
        )).flat()}
      </div>
    </div>
  );
}

// ─── Interaction Flow ───
function InteractionFlow() {
  const [ref, inView] = useInView(0.2);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    const timers = [0, 1, 2, 3].map(i =>
      setTimeout(() => setActiveStep(i), 600 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const steps = [
    {
      icon: Fingerprint,
      label: "Tap",
      sublabel: "Notice a shift",
      detail: "Watch or iPhone",
      color: "#B8860B",
    },
    {
      icon: Activity,
      label: "Capture",
      sublabel: "HR, HRV, context",
      detail: "HealthKit + EventKit + CoreLocation",
      color: "#C4713B",
    },
    {
      icon: Eye,
      label: "Name",
      sublabel: "Describe, label, intensity",
      detail: "Subjective before objective",
      color: "#8B6E5A",
    },
    {
      icon: Sparkles,
      label: "Reflect",
      sublabel: "See data + AI reflection",
      detail: "Claude streams contemplative response",
      color: "#7C6F9B",
    }
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#B8860B" }}>
          Core Interaction
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: "#2A1F14", marginTop: "8px" }}>
          The Frame Snap
        </h3>
      </div>

      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: "0",
        maxWidth: "760px",
        margin: "0 auto",
        flexWrap: "wrap",
      }}>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep >= i;
          return (
            <div key={step.label} style={{ display: "flex", alignItems: "flex-start", flex: "0 0 auto" }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "140px",
                opacity: isActive ? 1 : 0.2,
                transform: isActive ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.1}s`,
              }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: isActive ? `${step.color}15` : "transparent",
                  border: `1.5px solid ${isActive ? step.color : '#D4C8B8'}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.5s ease",
                }}>
                  <Icon size={24} color={isActive ? step.color : "#D4C8B8"} strokeWidth={1.5} />
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: isActive ? step.color : "#CBBFB0",
                  marginTop: "12px",
                  transition: "color 0.5s ease",
                }}>{step.label}</p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: isActive ? "#6B5A4A" : "#CBBFB0",
                  marginTop: "2px",
                  textAlign: "center",
                  transition: "color 0.5s ease",
                }}>{step.sublabel}</p>
                <p style={{
                  fontFamily: "'Newsreader', 'Georgia', serif",
                  fontSize: "11px",
                  fontStyle: "italic",
                  color: isActive ? "#9A8A7A" : "transparent",
                  marginTop: "6px",
                  textAlign: "center",
                  transition: "color 0.5s ease 0.2s",
                }}>{step.detail}</p>
              </div>

              {i < steps.length - 1 && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "20px",
                  width: "40px",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: "32px",
                    height: "1px",
                    background: activeStep > i
                      ? `linear-gradient(to right, ${steps[i].color}, ${steps[i + 1].color})`
                      : "#E8DFD4",
                    transition: "background 0.5s ease",
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key decision callout */}
      <div style={{
        maxWidth: "580px",
        margin: "40px auto 0",
        padding: "20px 24px",
        background: "#FFF8F0",
        borderLeft: "3px solid #B8860B",
        borderRadius: "0 8px 8px 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 2.5s",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#B8860B",
          marginBottom: "6px",
        }}>Key Design Decision</p>
        <p style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "15px",
          lineHeight: 1.7,
          color: "#3A2A1A",
        }}>
          You commit your subjective assessment <em>before</em> you see the biometric data. You say "I feel tense" and then discover your HRV is 22ms below your weekly average. Over time, that feedback loop trains calibration between felt sense and physiology.
        </p>
      </div>
    </div>
  );
}

// ─── Two-Tier Architecture ───
function ArchitectureDiagram() {
  const [ref, inView] = useInView(0.15);
  const [hoveredTier, setHoveredTier] = useState(null);

  const onDeviceTools = [
    { icon: Heart, label: "HealthKit", desc: "HR, HRV, 7-day trends" },
    { icon: Calendar, label: "EventKit", desc: "Calendar context ±2h" },
    { icon: MapPin, label: "CoreLocation", desc: "Semantic location" },
    { icon: Activity, label: "SwiftData", desc: "Recent snap patterns" },
  ];

  const cloudCapabilities = [
    "Longitudinal pattern analysis",
    "Contemplative reframing",
    "Scaffolding-aware reflection",
    "Dam Model vocabulary",
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#B8860B" }}>
          Architecture
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: "#2A1F14", marginTop: "8px" }}>
          Privacy by design. AI at two scales.
        </h3>
      </div>

      <div style={{
        maxWidth: "720px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}>
        {/* On-Device Tier */}
        <div
          onMouseEnter={() => setHoveredTier("device")}
          onMouseLeave={() => setHoveredTier(null)}
          style={{
            padding: "28px 32px",
            background: hoveredTier === "device" ? "#FDFAF5" : "#FFF8F0",
            borderRadius: "16px 16px 0 0",
            border: "1px solid #E8DFD4",
            borderBottom: "none",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #2A1F14, #4A3A2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Smartphone size={18} color="#D4A043" strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#2A1F14" }}>
                On-Device — The Read
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8A7A6A" }}>
                Apple Foundation Models · ~3B parameters · Free, offline, no API keys
              </p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}>
            {onDeviceTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <div key={tool.label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "#FFF",
                  borderRadius: "8px",
                  border: "1px solid #EDE6DC",
                  opacity: inView ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
                }}>
                  <Icon size={16} color="#8B6E5A" strokeWidth={1.5} />
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: "#4A3A2A" }}>
                      {tool.label}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A8A7A" }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: "14px",
            padding: "10px 14px",
            background: "#FFF",
            borderRadius: "8px",
            border: "1px solid #EDE6DC",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 0.7s",
          }}>
            <Brain size={16} color="#7C6F9B" strokeWidth={1.5} />
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: "#4A3A2A" }}>
                Felt-Sense Interpreter
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9A8A7A" }}>
                "Tight jaw, buzzy" → suggests <em>Stirred</em> texture group → matching labels
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Boundary */}
        <div style={{
          position: "relative",
          padding: "0",
          zIndex: 2,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "16px 0",
            background: "linear-gradient(to right, #FFF8F0, #FDF5E8, #FFF8F0)",
            borderLeft: "1px solid #E8DFD4",
            borderRight: "1px solid #E8DFD4",
          }}>
            <div style={{ flex: 1, height: "1px", background: "repeating-linear-gradient(to right, #C4713B, #C4713B 6px, transparent 6px, transparent 12px)" }} />
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "#FFF",
              borderRadius: "20px",
              border: "1.5px solid #C4713B",
              flexShrink: 0,
            }}>
              <Lock size={13} color="#C4713B" strokeWidth={2} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#C4713B",
              }}>Privacy Boundary</span>
              <Shield size={13} color="#C4713B" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, height: "1px", background: "repeating-linear-gradient(to right, #C4713B, #C4713B 6px, transparent 6px, transparent 12px)" }} />
          </div>

          {/* What crosses the line */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            padding: "8px 20px 12px",
            background: "linear-gradient(to right, #FFF8F0, #FDF5E8, #FFF8F0)",
            borderLeft: "1px solid #E8DFD4",
            borderRight: "1px solid #E8DFD4",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <X size={12} color="#C4713B" strokeWidth={2.5} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8A7A6A" }}>
                Raw health data, calendar, contacts, location
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Check size={12} color="#5B8A72" strokeWidth={2.5} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8A7A6A" }}>
                De-identified structured summary only
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Tier */}
        <div
          onMouseEnter={() => setHoveredTier("cloud")}
          onMouseLeave={() => setHoveredTier(null)}
          style={{
            padding: "28px 32px",
            background: hoveredTier === "cloud" ? "#FDFAF5" : "#FFF8F0",
            borderRadius: "0 0 16px 16px",
            border: "1px solid #E8DFD4",
            borderTop: "none",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #7C6F9B, #5A4E7A)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cloud size={18} color="#E8DFD4" strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, color: "#2A1F14" }}>
                Cloud — The Reflection
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8A7A6A" }}>
                Claude API (Sonnet) · Streaming SSE · Contemplative system prompt
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {cloudCapabilities.map((cap, i) => (
              <div key={cap} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                opacity: inView ? 1 : 0,
                transition: `opacity 0.4s ease ${0.8 + i * 0.1}s`,
              }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#7C6F9B", flexShrink: 0 }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#4A3A2A" }}>{cap}</p>
              </div>
            ))}
          </div>

          {/* Example of what Claude sees */}
          <div style={{
            marginTop: "16px",
            padding: "14px 16px",
            background: "#2A1F14",
            borderRadius: "8px",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.4s ease 1.2s",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "#8A7A6A",
              marginBottom: "6px",
            }}>What Claude receives</p>
            <p style={{
              fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "#D4C8B8",
            }}>
              <span style={{ color: "#D4A043" }}>emotion:</span> "tense" · <span style={{ color: "#D4A043" }}>intensity:</span> 0.7 · <span style={{ color: "#D4A043" }}>description:</span> "tight jaw, shoulders up"<br/>
              <span style={{ color: "#D4A043" }}>biometric:</span> HR elevated, HRV 22ms below weekly avg<br/>
              <span style={{ color: "#D4A043" }}>context:</span> "before a work meeting, third similar pattern this week"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Build Timeline ───
function BuildTimeline() {
  const [ref, inView] = useInView(0.15);

  const sessions = [
    { week: "Days 1–2", label: "Design", desc: "Foundation doc, CLAUDE.md, DECISIONS.md — before any code", highlight: true },
    { week: "Day 3 AM", label: "Core", desc: "Scaffold, SwiftData, HealthKit, WatchConnectivity, emotion picker", highlight: false },
    { week: "Day 3 Mid", label: "AI Layer", desc: "Claude API, streaming SSE, contemplative system prompt, reflections", highlight: true },
    { week: "Day 3 PM", label: "Watch + Polish", desc: "Watch app, ensō tap, haptic feedback, visual identity, onboarding", highlight: false },
    { week: "Day 4", label: "Ship", desc: "Hardware smoke test, TestFlight submission, external beta live", highlight: true },
    { week: "Day 5", label: "Expand", desc: "Phone snap FAB, voice/Siri intent, taxonomy → 18 labels + felt-sense textures", highlight: false },
    { week: "Day 5+", label: "On-device AI", desc: "Foundation Models integration, felt-sense interpreter, context assembly tools", highlight: true },
  ];

  return (
    <div ref={ref} className="my-16">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#B8860B" }}>
          Development
        </p>
        <h3 style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "28px", fontWeight: 400, color: "#2A1F14", marginTop: "8px" }}>
          Zero Swift experience to TestFlight beta. Three days.
        </h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8A7A6A", marginTop: "6px" }}>
          Built with Claude Agent in Xcode 26.3 · Design-first methodology · 14 session-scoped goals
        </p>
      </div>

      <div style={{
        maxWidth: "640px",
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "79px",
          top: "8px",
          bottom: "8px",
          width: "1px",
          background: inView ? "linear-gradient(to bottom, #D4A043, #7C6F9B)" : "#E8DFD4",
          transition: "background 1s ease 0.3s",
        }} />

        {sessions.map((s, i) => (
          <div key={s.label} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "20px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-12px)",
            transition: `all 0.4s ease ${0.2 + i * 0.08}s`,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              color: "#9A8A7A",
              width: "64px",
              textAlign: "right",
              paddingTop: "4px",
              flexShrink: 0,
            }}>{s.week}</p>

            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: s.highlight ? "#B8860B" : "#E8DFD4",
              border: s.highlight ? "2px solid #D4A04340" : "2px solid #FFF8F0",
              flexShrink: 0,
              marginTop: "4px",
              zIndex: 1,
            }} />

            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: s.highlight ? "#B8860B" : "#4A3A2A",
              }}>{s.label}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "#8A7A6A",
                marginTop: "2px",
              }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
        color: "#CBBFB0",
        textTransform: "uppercase",
      }}>Section {number}</span>
      <div style={{ flex: 1, height: "1px", background: "#E8DFD4" }} />
    </div>
  );
}

// ─── Main Essay Page ───
export default function NoticeEssay() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FEFCF9",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: #D4A04340; }
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
          color: "#B8860B",
          marginBottom: "24px",
        }}>Notice</p>

        <h1 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "#2A1F14",
          maxWidth: "640px",
          margin: "0 auto",
        }}>
          You're Already Feeling Something You Haven't <em>Noticed</em> Yet
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: "#8A7A6A",
          marginTop: "24px",
          lineHeight: 1.6,
        }}>
          On interoception, contemplative practice, biometric feedback,<br />
          and building a tool that tries to become unnecessary.
        </p>

        <div style={{
          width: "1px",
          height: "48px",
          background: "linear-gradient(to bottom, #E8DFD4, transparent)",
          margin: "40px auto 0",
        }} />
      </header>

      {/* Hypothesis */}
      <div style={{
        maxWidth: "600px",
        margin: "0 auto 64px",
        padding: "24px 32px",
        background: "#FFF8F0",
        borderRadius: "12px",
        border: "1px solid #E8DFD4",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#B8860B",
          marginBottom: "10px",
        }}>Design Hypothesis</p>
        <p style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "16px",
          lineHeight: 1.7,
          color: "#3A2A1A",
        }}>
          Structured self-report plus biometric feedback plus contextually intelligent AI reflection can train interoceptive awareness outside retreat conditions — helping you notice what your body already knows, in the middle of a life.
        </p>
      </div>

      {/* Content */}
      <article style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "0 24px 80px",
      }}>
        <SectionDivider number="01" label="The Gap" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>The Gap — What the Body Knows Before You Do</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A" }}>
          <p style={{ marginBottom: "16px" }}>
            Your body knows things before you do. Right now, as you read this, your heart rate carries information about how you're meeting this moment. Your HRV encodes something about your autonomic state. Your gut is doing something. You're probably not aware of any of it.
          </p>
          <p style={{ marginBottom: "16px" }}>
            This isn't a failure of attention. It's the normal human condition. Research on <strong>interoception</strong> — the felt sense of your own body — shows that most people are surprisingly poor at reading their own physiological signals in real time. Neuroscientist Bud Craig's work on the insular cortex explains the mechanism: conscious awareness genuinely lags behind physiological reality. You're stressed before you know you're stressed.
          </p>
          <p>
            This creates a product opportunity that sits in a gap between three existing categories — and none of them train the underlying capacity.
          </p>
        </div>

        <CompetitiveGap />

        <SectionDivider number="02" label="The Traditions" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>The Traditions — Different Paths to the Same Capacity</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A" }}>
          <p style={{ marginBottom: "16px" }}>
            Contemplative traditions have been training this capacity for millennia. They are genuinely different methods, but they converge on a shared capacity: noticing what's arising in your experience, in real time, without collapsing into reactivity.
          </p>
          <p style={{ marginBottom: "16px" }}>
            For me, the thing that cracked this open was a Jhourney jhana retreat. Emmett Shear and the Jhourney community taught me to feel things I'd been walking around with my whole life but couldn't name — to notice the felt sense of an emotion in my body, to distinguish between what was arising and how I was relating to it. Their framework of recursive self-acceptance, the window of tolerance, the insight that you can't anxiously monitor your way to wellbeing — these became the design foundations.
          </p>
          <p>
            The problem that stayed with me after retreat: these capacities are trainable, but the training conditions don't scale into daily life. You can't carry a facilitator into your Tuesday afternoon.
          </p>
        </div>

        <SectionDivider number="03" label="The Design" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>What I Built</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A" }}>
          <p style={{ marginBottom: "16px" }}>
            Notice is live on TestFlight with beta testers from the Jhourney community. I built it in roughly six weeks, as a first iOS app, with zero prior Swift experience. The primary development tool was Claude Code.
          </p>
          <p style={{ marginBottom: "16px" }}>
            I spent two full days before writing any code. The output: a 6,000-word foundation document translating the research into design constraints, a CLAUDE.md with architectural guidelines, and a DECISIONS.md logging every open question with evidence and options. Then I built in session-scoped increments — fourteen sessions total, each with a clear deliverable.
          </p>
          <p>
            Not a wellness dashboard. Not another app that tells you your stress score and makes you anxious about being anxious. Something closer to <strong>training wheels for interoception</strong> — a system that helps you develop the capacity to read your own states, and then gradually becomes unnecessary.
          </p>
        </div>

        <InteractionFlow />

        <SectionDivider number="04" label="Architecture" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>The Architecture</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A", marginBottom: "8px" }}>
          <p>
            The AI architecture has two tiers that mirror a contemplative structure. The system that knows the most about you never talks to the internet. The system that talks to the internet only receives what a trusted friend might know from conversation.
          </p>
        </div>

        <ArchitectureDiagram />

        <SectionDivider number="05" label="Process" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>Building With Agents</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A" }}>
          <p style={{ marginBottom: "16px" }}>
            The development process demonstrated something about how AI tools change what's possible: with sufficiently clear design constraints and architectural documentation, the gap between "I understand this problem deeply" and "I can ship a working solution in an unfamiliar stack" collapses to weeks.
          </p>
          <p>
            The system prompt I wrote for the Claude reflection layer was more consequential than any single Swift file. The CLAUDE.md that guided the coding agent was more important than the code it produced. The highest-leverage artifacts in AI-integrated products aren't code — they're the documents that shape how AI systems behave.
          </p>
        </div>

        <BuildTimeline />

        <SectionDivider number="06" label="Honest Limits" />

        <h2 style={{
          fontFamily: "'Newsreader', 'Georgia', serif",
          fontSize: "28px",
          fontWeight: 400,
          color: "#2A1F14",
          marginBottom: "20px",
        }}>Honest Limits</h2>

        <div style={{ fontFamily: "'Newsreader', 'Georgia', serif", fontSize: "16px", lineHeight: 1.8, color: "#3A2A1A" }}>
          <p style={{ marginBottom: "16px" }}>
            I don't know if this will work. The contemplative traditions are unanimous that you can't strive your way to awareness. The hardest design problem might be building a tool that embodies non-striving.
          </p>
          <p style={{ marginBottom: "16px" }}>
            What I'm watching: Do users snap less over time (scaffolding working) or more (dependency)? Does emotion label diversity increase (granularity developing) or narrow (habit)? Do users start qualifying their labels in notes — "picked anxious but it's more like anticipation" — signaling their felt sense outgrowing the taxonomy?
          </p>
          <p>
            Most of us walk through our days only partially aware of the states that drive our decisions, our reactions, our relationships. The body is always signaling. The contemplative traditions have known this forever. Maybe there's a way to meet that ancient insight with modern sensing and thoughtful AI, and help people learn to listen — not on a cushion in silence, but in the middle of a life.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "64px",
          paddingTop: "32px",
          borderTop: "1px solid #E8DFD4",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Newsreader', 'Georgia', serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: "#9A8A7A",
            lineHeight: 1.7,
          }}>
            Notice is in beta on TestFlight. Built with Claude Code.<br />
            Reflections powered by Claude.
          </p>
        </div>
      </article>
    </div>
  );
}
