import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

const cards = [
  {
    label: "ML Compilation",
    text: "Drove <strong>AWS Neuron SDK</strong> from compiler research to production SDK for Trainium chips.",
  },
  {
    label: "Graph ML",
    text: "Brought <strong>Neptune ML</strong> from research to production, establishing graph machine learning on AWS.",
  },
  {
    label: "AutoML",
    text: "Product lead for AutoML at <strong>H2O.ai</strong> alongside the team that built Driverless AI.",
  },
  {
    label: "LLM Training",
    text: "Drove research strategy and commercialization for <strong>Amazon's first production LLM</strong>.",
  },
];

export default function ScholionCredibilityCards() {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="scholion-credibility">
      <style>{`
        .scholion-credibility {
          margin: 2.5rem 0;
        }
        .scholion-cred-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }
        .scholion-cred-card {
          background: var(--bg-warm);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.2rem 1.4rem;
        }
        .scholion-cred-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin-bottom: 0.4rem;
          display: block;
        }
        .scholion-cred-text {
          font-family: ${tokens.sans};
          font-size: 0.82rem;
          color: ${tokens.textMid};
          line-height: 1.55;
        }
        .scholion-cred-text strong {
          color: ${tokens.text};
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .scholion-cred-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="scholion-cred-grid">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="scholion-cred-card"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(12px)",
              transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.08}s`,
            }}
          >
            <span className="scholion-cred-label">{card.label}</span>
            <div
              className="scholion-cred-text"
              dangerouslySetInnerHTML={{ __html: card.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
