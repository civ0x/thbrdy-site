import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───
const tokens = {
  accent: "#0000FD",
  accentLight: "rgba(0, 0, 253, 0.08)",
  accentBorder: "rgba(0, 0, 253, 0.15)",
  bg: "#FAF8F5",
  text: "#1A1A1A",
  textMuted: "#6B6B6B",
  textLight: "#9A9A9A",
  border: "#E5E0DA",
  serif: "'Newsreader', 'Georgia', serif",
  sans: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

// ─── Intersection Observer Hook ───
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
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
      <p style={{
        fontFamily: tokens.sans,
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "2.5px",
        textTransform: "uppercase",
        color: tokens.accent,
        whiteSpace: "nowrap",
      }}>{number} — {label}</p>
      <div style={{
        flex: 1,
        height: "1px",
        background: tokens.border,
      }} />
    </div>
  );
}

// ─── Prose Block ───
function Prose({ children }) {
  return (
    <div style={{
      fontFamily: tokens.serif,
      fontSize: "17px",
      lineHeight: 1.8,
      color: tokens.text,
    }}>
      {children}
    </div>
  );
}

function P({ children, style }) {
  return <p style={{ marginBottom: "18px", ...style }}>{children}</p>;
}

// ─── Pull Quote ───
function PullQuote({ children }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{
      maxWidth: "720px",
      margin: "56px auto",
      padding: "48px 0",
      borderTop: `1px solid ${tokens.border}`,
      borderBottom: `1px solid ${tokens.border}`,
      textAlign: "center",
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      <p style={{
        fontFamily: tokens.serif,
        fontSize: "26px",
        fontWeight: 400,
        fontStyle: "italic",
        lineHeight: 1.5,
        color: tokens.text,
        maxWidth: "560px",
        margin: "0 auto",
      }}>{children}</p>
    </div>
  );
}

// ─── Convergence Diagram ───
function ConvergenceDiagram() {
  const [ref, inView] = useInView(0.1);

  const frameworks = [
    { author: "Pólya", domain: "Mathematics", year: "1945", label: "How to Solve It",
      orient: "Understand the problem", execute: "Carry out the plan", reflect: "Look back" },
    { author: "Boyd", domain: "Military strategy", year: "1961", label: "OODA Loop",
      orient: "Observe → Orient", execute: "Decide → Act", reflect: "Feedback loop" },
    { author: "U.S. Army", domain: "Training doctrine", year: "1970s", label: "Crawl-Walk-Run",
      orient: "Crawl", execute: "Walk", reflect: "Run + AAR" },
    { author: "Bloom", domain: "Education research", year: "1984", label: "Mastery Learning",
      orient: "Diagnostic assessment", execute: "Instructional unit", reflect: "Formative feedback" },
    { author: "Gee", domain: "Game design / literacy", year: "2003", label: "Learning Principles",
      orient: "Situated meaning", execute: "Probe → Hypothesize → Reprobe", reflect: "Identity principle" },
  ];

  const layers = [
    { name: "Orient", desc: "Understand before you act", color: tokens.accent },
    { name: "Execute", desc: "Small, complete, verifiable loops", color: "#2D5FD0" },
    { name: "Reflect", desc: "Ratchet understanding forward", color: "#5A3FBF" },
  ];

  return (
    <div ref={ref} style={{
      maxWidth: "720px",
      margin: "48px auto",
    }}>
      {/* Framework nodes */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "2px",
      }}>
        {frameworks.map((fw, i) => (
          <div key={fw.author} style={{
            padding: "16px 12px",
            background: inView ? tokens.accentLight : "transparent",
            borderRadius: i === 0 ? "8px 0 0 0" : i === 4 ? "0 8px 0 0" : "0",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "13px",
              fontWeight: 600,
              color: tokens.accent,
              marginBottom: "4px",
            }}>{fw.author}</p>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "10px",
              letterSpacing: "0.5px",
              color: tokens.textMuted,
              marginBottom: "2px",
            }}>{fw.domain}</p>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "10px",
              color: tokens.textLight,
            }}>{fw.year}</p>
          </div>
        ))}
      </div>

      {/* Convergence arrows */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "8px 0",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 0.5s",
      }}>
        <svg width="200" height="24" viewBox="0 0 200 24" fill="none">
          <path d="M10 2 L100 20 M50 2 L100 20 M100 2 L100 20 M150 2 L100 20 M190 2 L100 20"
            stroke={tokens.accent} strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="100" cy="20" r="3" fill={tokens.accent} fillOpacity="0.4" />
        </svg>
      </div>

      {/* Three-layer structure */}
      <div style={{
        border: `1px solid ${tokens.accentBorder}`,
        borderRadius: "8px",
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s",
      }}>
        {/* Header row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "140px repeat(5, 1fr)",
          gap: "1px",
          background: tokens.border,
        }}>
          <div style={{
            background: tokens.bg,
            padding: "12px 16px",
          }}>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: tokens.textLight,
            }}>Structure</p>
          </div>
          {frameworks.map(fw => (
            <div key={`h-${fw.author}`} style={{
              background: tokens.bg,
              padding: "12px 8px",
              textAlign: "center",
            }}>
              <p style={{
                fontFamily: tokens.sans,
                fontSize: "11px",
                fontWeight: 600,
                color: tokens.textMuted,
              }}>{fw.author}</p>
            </div>
          ))}
        </div>

        {/* Layer rows */}
        {layers.map((layer, li) => (
          <div key={layer.name} style={{
            display: "grid",
            gridTemplateColumns: "140px repeat(5, 1fr)",
            gap: "1px",
            background: tokens.border,
          }}>
            <div style={{
              background: "#FFF",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                background: layer.color,
                flexShrink: 0,
              }} />
              <div>
                <p style={{
                  fontFamily: tokens.sans,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: tokens.text,
                }}>{layer.name}</p>
                <p style={{
                  fontFamily: tokens.sans,
                  fontSize: "10px",
                  color: tokens.textLight,
                  marginTop: "2px",
                }}>{layer.desc}</p>
              </div>
            </div>
            {frameworks.map(fw => {
              const val = li === 0 ? fw.orient : li === 1 ? fw.execute : fw.reflect;
              return (
                <div key={`${layer.name}-${fw.author}`} style={{
                  background: "#FFF",
                  padding: "14px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <p style={{
                    fontFamily: tokens.serif,
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: tokens.textMuted,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}>{val}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Caption */}
      <p style={{
        fontFamily: tokens.sans,
        fontSize: "11px",
        color: tokens.textLight,
        textAlign: "center",
        marginTop: "16px",
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 1s",
      }}>
        Five frameworks, five domains, eight decades — same three-layer structure
      </p>
    </div>
  );
}

// ─── Wrong-First Process Flow ───
function WrongFirstFlow() {
  const [ref, inView] = useInView(0.15);

  const steps = [
    {
      label: "Natural mistake",
      desc: "Smart, motivated person follows default behavior",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      ),
    },
    {
      label: "Recognition",
      desc: "Reader watches the mistake from inside — and recognizes it",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
        </svg>
      ),
    },
    {
      label: "Corrective move",
      desc: "Method earns its way in — resolves the failure the reader felt",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="1.5">
          <path d="M12 3v18M3 12l9-9 9 9" />
        </svg>
      ),
    },
    {
      label: "Identity shift",
      desc: "Learner doesn't use the method — they think from inside it",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth="1.5">
          <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={ref} style={{
      maxWidth: "720px",
      margin: "48px auto",
    }}>
      {/* Flow */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "0",
        position: "relative",
      }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute",
          top: "28px",
          left: "12.5%",
          right: "12.5%",
          height: "1px",
          background: tokens.accentBorder,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }} />

        {steps.map((step, i) => (
          <div key={step.label} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 8px",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(12px)",
            transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.12}s`,
            position: "relative",
            zIndex: 1,
          }}>
            {/* Icon circle */}
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#FFF",
              border: `1.5px solid ${tokens.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
            }}>
              {step.icon}
            </div>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "12px",
              fontWeight: 600,
              color: tokens.text,
              marginBottom: "6px",
            }}>{step.label}</p>
            <p style={{
              fontFamily: tokens.sans,
              fontSize: "11px",
              color: tokens.textMuted,
              lineHeight: 1.4,
              maxWidth: "140px",
            }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div style={{
        marginTop: "28px",
        padding: "16px 20px",
        background: tokens.accentLight,
        borderRadius: "8px",
        borderLeft: `3px solid ${tokens.accent}`,
        opacity: inView ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
      }}>
        <p style={{
          fontFamily: tokens.sans,
          fontSize: "12px",
          fontWeight: 600,
          color: tokens.accent,
          marginBottom: "4px",
        }}>Design decision</p>
        <p style={{
          fontFamily: tokens.serif,
          fontSize: "14px",
          color: tokens.text,
          lineHeight: 1.6,
        }}>
          Direct instruction — "here are the five steps, now apply them" — is how most methodology books work, and why most don't change behavior. Recognition is a stronger learning signal than instruction. Wrong-first reverses the sequence so the method earns its authority from the reader's own experience.
        </p>
      </div>
    </div>
  );
}


// ─── Main Essay ───
export default function AbsoluteBeginnersEssay() {
  return (
    <div style={{
      background: tokens.bg,
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>
      {/* Hero */}
      <header style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "80px 24px 0",
      }}>
        <p style={{
          fontFamily: tokens.sans,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
          marginBottom: "16px",
        }}>Absolute Beginners++</p>
        <h1 style={{
          fontFamily: tokens.serif,
          fontSize: "38px",
          fontWeight: 400,
          lineHeight: 1.2,
          color: tokens.text,
          marginBottom: "24px",
        }}>Everyone's Teaching You About AI.<br />Nobody's Teaching You How to Think.</h1>
      </header>

      {/* Design hypothesis */}
      <div style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "0 24px",
      }}>
        <div style={{
          padding: "20px 0",
          borderTop: `1px solid ${tokens.border}`,
          borderBottom: `1px solid ${tokens.border}`,
          marginBottom: "48px",
        }}>
          <p style={{
            fontFamily: tokens.sans,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: tokens.accent,
            marginBottom: "10px",
          }}>Thesis</p>
          <p style={{
            fontFamily: tokens.serif,
            fontSize: "16px",
            lineHeight: 1.7,
            color: tokens.text,
          }}>
            Five independently-developed problem-solving frameworks — from mathematics, military strategy, institutional training, education research, and game design — converge on the same three-layer structure. That convergence reveals method as the durable layer in a world where domain expertise goes stale. In the AI era, beginners have the highest leverage — if given method.
          </p>
        </div>
      </div>

      {/* Content */}
      <article style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "0 24px 80px",
      }}>

        <SectionDivider number="01" label="The Pattern" />

        <Prose>
          <P>I spent a year watching people make decisions about AI. Not researchers or engineers — the people one layer out. Product managers evaluating vendor tools. Consultants advising clients on adoption. Founders deciding where AI fits in their stack. Team leads trying to figure out whether a new capability means they should restructure their workflow or ride out the hype cycle.</P>

          <P>The pattern was remarkably consistent. Someone encounters an AI decision — should we adopt this tool, how should we evaluate it, why isn't our deployment working, what do we do now that the tool we picked six months ago is outperformed by something released last Tuesday. And instead of slowing down to figure out what they're actually deciding, they react. The experienced people pattern-match against previous technology cycles. The enthusiastic people expand scope before they've defined scope. The cautious people wait for someone else to go first. Reaction, reaction, paralysis.</P>

          <P>What almost nobody does is orient — pause to understand the problem before trying to solve it.</P>

          <P>This isn't a criticism. It's the normal human condition. The same thing happens when a couple browses apartment listings for two weeks without realizing they're optimizing for different futures, or when a team runs a quarterly planning process that produces a plan nobody follows. People act before they understand, not because they're lazy, but because understanding feels like inaction and action feels like progress. The gap between reacting and thinking is invisible from the inside.</P>

          <P style={{ marginBottom: 0 }}>I wanted to close that gap. So I started looking for methods — and found something I wasn't expecting.</P>
        </Prose>

        <SectionDivider number="02" label="The Convergence" />

        <Prose>
          <P>I went looking for one framework and found five. Then I realized they were all the same framework.</P>

          <P>George Pólya's <em>How to Solve It</em> (1945) gave mathematics a four-step problem-solving heuristic: understand the problem, devise a plan, carry out the plan, look back. It's endured for eighty years because Pólya wasn't really describing a method for math. He was describing a method for thinking about unfamiliar problems.</P>

          <P>John Boyd's OODA loop — Observe, Orient, Decide, Act — was built for fighter pilots making decisions under lethal time pressure. Boyd's central insight wasn't the loop; it was that orientation does the real cognitive work. Everything downstream is only as good as your model of the situation.</P>

          <P>The U.S. Army's crawl-walk-run is a training doctrine applied to every capability from rifle marksmanship to combined arms operations. You don't practice the hard version until you've verified the easy version. You don't combine skills until each one is solid on its own.</P>

          <P>Benjamin Bloom's mastery learning research demonstrated that students who achieve genuine understanding before advancing outperform control groups by two standard deviations — equivalent to moving an average student to the 98th percentile. The mechanism is simple: verified foundations support load. Unverified ones don't.</P>

          <P>And James Paul Gee's learning principles from video games explain why games produce deep learning so efficiently. They drop you in over your head, give immediate feedback, let you fail cheaply, and make identity formation part of the process. You don't just learn a game's mechanics — you become someone who thinks in them.</P>

          <P>Five frameworks. Five unrelated domains. Eight decades of independent development. No shared vocabulary, no shared methods, no shared assumptions about how the world works.</P>

          <P style={{ marginBottom: 0 }}>All five describe the same three-layer structure.</P>
        </Prose>

        <ConvergenceDiagram />

        <Prose>
          <P>I didn't expect the convergence. I was reading Pólya alongside Boyd because both were relevant to a problem I was working on, and the structural mapping was so clean it stopped me. I pulled in the Army doctrine because I'd trained under it — same skeleton. Then Bloom, which I knew from a different context. Then Gee, who shouldn't map at all — video games have nothing obvious in common with military training — and maps perfectly. At some point the question flipped from "can I synthesize these?" to "why hasn't anyone noticed these are isomorphic?"</P>

          <P style={{ marginBottom: 0 }}>The answer, I think, is domain walls. Pólya lives in mathematics education. Boyd lives in military strategy and business. Bloom lives in educational psychology. Gee lives in literacy studies and game design. The Army's doctrine lives in field manuals that academics don't read. Each framework is well-known inside its discipline and nearly invisible outside it. The convergence is only visible if you happen to be reading across all five — which almost nobody does, because there's no obvious reason to.</P>
        </Prose>

        <PullQuote>Method is the durable layer. Capabilities change. Tools change. The landscape under your feet shifts. But the structure of good thinking doesn't.</PullQuote>

        <SectionDivider number="03" label="The Expertise Problem" />

        <Prose>
          <P>The convergence matters because of what it reveals about this particular moment. In stable domains, expertise is a massive advantage — your pattern library is calibrated, your intuitions track reality, your experience produces reliable shortcuts. But when the territory shifts faster than maps can update, expertise develops a structural liability: confident pattern-matching against a landscape that no longer exists. Not a character flaw. A feature of how expertise works. You get good at recognizing situations. Then the situations change.</P>

          <P>In AI, this has been visible for years. When large language models began demonstrating unexpected capabilities, the people most consistently wrong about what was possible were domain experts in NLP — not because they were less intelligent, but because they had strong priors trained on a paradigm that had just ended. The people most consistently right were often outsiders who tried the thing and observed what happened, unburdened by a model telling them it shouldn't work.</P>

          <P>This isn't an argument for ignorance over knowledge. The argument is narrower: in a fast-moving domain, the absence of stale priors is a genuine structural advantage — but only if you have a method for making sense of what you're seeing. Beginner's mind without method is confusion. Beginner's mind <em>with</em> method is openness plus traction: the willingness to admit what you don't know, combined with a systematic way to find out.</P>

          <P style={{ marginBottom: 0 }}>In the AI era, everyone is a beginner. The ten-year veteran and the new hire face structurally similar problems — neither person's intuitions are calibrated to a landscape shifting this fast. The veteran has the disadvantage of not knowing their intuitions are stale. The new hire has the disadvantage of not having intuitions at all. The argument I'm making is that this isn't a problem to solve. It's the highest-leverage position available — if you have method.</P>
        </Prose>

        <SectionDivider number="04" label="The Product Problem" />

        <Prose>
          <P>The methodology is one thing. Turning it into something people actually use is a different problem — a product problem. Research that stays in synthesis form doesn't change behavior. I needed a delivery mechanism that would survive contact with how people actually learn.</P>

          <P style={{ marginBottom: 0 }}>The key design decision was what I call wrong-first pedagogy.</P>
        </Prose>

        <WrongFirstFlow />

        <Prose>
          <P>Every chapter opens with characters making the natural mistake — not a straw-man error, but the specific failure mode a smart, motivated person falls into when relying on default behavior instead of method. Browsing apartment listings without defining what you're optimizing for. Evaluating an AI tool based on how impressive the demo is rather than whether it fits the actual problem. Measuring operational success without having defined what success means. Consuming AI content as a substitute for learning.</P>

          <P>Wrong-first works because recognition is a stronger learning signal than instruction. When you watch someone make the mistake you've made — from inside their reasoning, where it feels justified — and then see what changes when they orient first, the method earns its way in. You don't learn it as a rule imposed from outside. You learn it as the thing that would have prevented your own failure.</P>

          <P style={{ marginBottom: 0 }}>The alternative — direct instruction, "here are the five steps, now apply them" — is how most methodology books work, and it's why most methodology books don't change behavior. You read them, you nod, you agree, you never use them. The spectator failure mode. The fix isn't better frameworks. It's a better sequence.</P>
        </Prose>

        <SectionDivider number="05" label="The Open Question" />

        <Prose>
          <P>What I keep returning to — and what I can't yet prove — is whether this kind of structured methodology changes how someone approaches problems they haven't encountered yet. You can demonstrate a method. You can scaffold it with worksheets and reference cards. But the real test is whether someone who has practiced Orient → Execute → Reflect reaches for it on a novel problem, unprompted, without the book open.</P>

          <P>That's an identity shift, not a skill acquisition. The deepest learning doesn't produce someone who <em>uses</em> a method — it produces someone who thinks from inside one. The contemplative traditions have always understood this. So has every serious training culture. The question is whether a book-length intervention can catalyze it, or whether that kind of shift requires something more — practice environments, feedback loops, a community, a tool that meets you in the moment of decision.</P>

          <P style={{ marginBottom: 0 }}>I think it probably requires more. The book is the first layer. What the method actually wants to be is an environment — something that can orient alongside you in real time, surface the wrong-first you're about to make, scaffold the move you need without removing the cognitive work that makes it stick. That's an AI product, not a PDF. It's the version of this project I haven't built yet, and the version I think matters most.</P>
        </Prose>

        {/* Footer */}
        <div style={{
          marginTop: "64px",
          paddingTop: "32px",
          borderTop: `1px solid ${tokens.border}`,
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: tokens.serif,
            fontSize: "14px",
            fontStyle: "italic",
            color: tokens.textLight,
            lineHeight: 1.7,
          }}>
            Absolute Beginners++ is in development.<br />
            ~27,000 words across seven chapters and a toolkit.
          </p>
        </div>
      </article>
    </div>
  );
}
