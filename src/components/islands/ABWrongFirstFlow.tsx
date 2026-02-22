import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface Step {
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
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

export function ABWrongFirstFlow() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="ab-wrongfirst" style={{ maxWidth: "720px", margin: "48px auto" }}>
      <style>{`
        .ab-wrongfirst-flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          position: relative;
        }
        .ab-wrongfirst-line {
          position: absolute;
          top: 28px;
          left: 12.5%;
          right: 12.5%;
          height: 1px;
        }
        @media (max-width: 640px) {
          .ab-wrongfirst-flow {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 0;
          }
          .ab-wrongfirst-line {
            display: none;
          }
        }
        @media (max-width: 420px) {
          .ab-wrongfirst-flow {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>

      {/* Flow */}
      <div className="ab-wrongfirst-flow">
        {/* Connecting line */}
        <div
          className="ab-wrongfirst-line"
          style={{
            background: tokens.accentGlow,
            opacity: inView ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}
        />

        {steps.map((step, i) => (
          <div
            key={step.label}
            style={{
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
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: tokens.bg,
                border: `1.5px solid ${tokens.accentGlow}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "14px",
              }}
            >
              {step.icon}
            </div>
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "12px",
                fontWeight: 600,
                color: tokens.text,
                marginBottom: "6px",
              }}
            >
              {step.label}
            </p>
            <p
              style={{
                fontFamily: tokens.sans,
                fontSize: "11px",
                color: tokens.textMuted,
                lineHeight: 1.4,
                maxWidth: "140px",
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div
        style={{
          marginTop: "28px",
          padding: "16px 20px",
          background: tokens.accentDim,
          borderRadius: "8px",
          borderLeft: `3px solid ${tokens.accent}`,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.8s",
        }}
      >
        <p
          style={{
            fontFamily: tokens.sans,
            fontSize: "12px",
            fontWeight: 600,
            color: tokens.accent,
            marginBottom: "4px",
          }}
        >
          Design decision
        </p>
        <p
          style={{
            fontFamily: tokens.serif,
            fontSize: "14px",
            color: tokens.text,
            lineHeight: 1.6,
          }}
        >
          Direct instruction — "here are the five steps, now apply them" — is how most methodology
          books work, and why most don't change behavior. Recognition is a stronger learning signal
          than instruction. Wrong-first reverses the sequence so the method earns its authority from
          the reader's own experience.
        </p>
      </div>
    </div>
  );
}
