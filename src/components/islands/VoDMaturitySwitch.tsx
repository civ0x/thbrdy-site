import { useState, useRef, useEffect, useCallback } from "react";
import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";

interface CaseStudy {
  id: string;
  name: string;
  short: string;
  position: number;
  correct: "protect" | "integrate";
  narrative: string;
}

const cases: CaseStudy[] = [
  {
    id: "ai-winter",
    name: "AI Winter",
    short: "AI Winter",
    position: 15,
    correct: "protect",
    narrative:
      "Expectations outran capability by decades. Symbolic AI couldn't deliver on promises, triggering a funding collapse that set the field back a generation. The research needed protection from premature commercial pressure — but that's obvious at this maturity level.",
  },
  {
    id: "deeplearn",
    name: "Deep Learning 2012",
    short: "Deep Learning",
    position: 35,
    correct: "integrate",
    narrative:
      "At only moderate maturity, compute costs, dataset scale, and algorithmic understanding converged enough for image classification. The domain's tolerance for error was high — a misclassified image isn't a misdiagnosed patient. Integration was correct at a maturity level where other domains would still need protection.",
  },
  {
    id: "cleantech",
    name: "Cleantech 1.0",
    short: "Cleantech 1.0",
    position: 38,
    correct: "protect",
    narrative:
      "Battery technology at $1,000/kWh was pushed to commercialize against $50/barrel oil. Despite moderate technical maturity — comparable to deep learning — the capital intensity of energy infrastructure meant failure was catastrophic. $25 billion destroyed because the domain demanded more protection than the maturity score alone would suggest.",
  },
  {
    id: "fair",
    name: "FAIR World Models",
    short: "FAIR",
    position: 48,
    correct: "integrate",
    narrative:
      "Research-grade world models with demonstrated capability but no translation pathway to Meta's product surface. The domain's integration requirements were achievable — world models don't need medical-grade reliability. Continued protection of work that was ready for structured integration.",
  },
  {
    id: "watson",
    name: "Watson Health",
    short: "Watson Health",
    position: 52,
    correct: "protect",
    narrative:
      "IBM announced a product at a maturity level comparable to FAIR's world models. But medical NLP demands extreme reliability — a wrong answer can kill. $5 billion destroyed because the domain's integration threshold was higher than the technology's maturity, even though other domains at this level were integration-ready.",
  },
  {
    id: "astrazeneca",
    name: "AstraZeneca 5R",
    short: "AstraZeneca",
    position: 55,
    correct: "integrate",
    narrative:
      "Implemented a structured 5R framework with domain-specific gates — not a single maturity metric. The framework itself is the contribution: it shows that correct switching depends on matching integration criteria to the specific domain, not hitting a universal threshold.",
  },
  {
    id: "neptune",
    name: "Neptune ML",
    short: "Neptune ML",
    position: 60,
    correct: "integrate",
    narrative:
      "AWS identified the integration window for ML infrastructure tooling — research-grade experiment tracking was mature enough for product packaging. The gap was translation, not capability. At this maturity level, integration is almost always correct.",
  },
  {
    id: "parc",
    name: "Xerox PARC GUI",
    short: "PARC \u2192 Apple",
    position: 72,
    correct: "integrate",
    narrative:
      "The graphical interface was fully functional and user-tested. Xerox's research culture couldn't translate it. Apple could. The capability crossed the maturity threshold years before the organization recognized it — classic failed transition.",
  },
  {
    id: "zombie",
    name: "Zombie Research Labs",
    short: "Zombie Labs",
    position: 82,
    correct: "integrate",
    narrative:
      "Corporate R&D labs producing publishable research disconnected from any product pathway. Mature capabilities that accumulate papers instead of products. At this maturity level, continued protection is pure organizational failure.",
  },
];

function classify(c: CaseStudy, threshold: number) {
  const zone: "protect" | "integrate" =
    c.position < threshold ? "protect" : "integrate";
  const isCorrect = zone === c.correct;
  return { zone, isCorrect };
}

function computeBestScore(): number {
  let best = 0;
  for (let t = 0; t <= 100; t++) {
    let score = 0;
    cases.forEach((c) => {
      const zone = c.position < t ? "protect" : "integrate";
      if (zone === c.correct) score++;
    });
    if (score > best) best = score;
  }
  return best;
}

const bestPossible = computeBestScore();

function computeRowAssignments(): Record<string, number> {
  const sorted = [...cases].sort((a, b) => a.position - b.position);
  const rows: number[][] = [];
  const assignments: Record<string, number> = {};

  sorted.forEach((c) => {
    let row = 0;
    for (let r = 0; r < rows.length; r++) {
      const conflict = rows[r].some(
        (pos) => Math.abs(pos - c.position) < 11
      );
      if (!conflict) {
        row = r;
        break;
      }
      row = r + 1;
    }
    if (!rows[row]) rows[row] = [];
    rows[row].push(c.position);
    assignments[c.id] = row;
  });

  return assignments;
}

const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function VoDMaturitySwitch() {
  const [ref, inView] = useInView(0.15);
  const [thresholdPct, setThresholdPct] = useState(46);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const thresholdRef = useRef(46);

  const rowAssignments = useRef(computeRowAssignments()).current;
  const maxRow = Math.max(...Object.values(rowAssignments));

  const pctFromEvent = useCallback(
    (evt: MouseEvent | TouchEvent): number => {
      if (!barRef.current) return thresholdRef.current;
      const barRect = barRef.current.getBoundingClientRect();
      let clientX: number;
      if ("touches" in evt && evt.touches.length > 0) {
        clientX = evt.touches[0].clientX;
      } else if ("clientX" in evt) {
        clientX = evt.clientX;
      } else {
        return thresholdRef.current;
      }
      const pct = ((clientX - barRect.left) / barRect.width) * 100;
      return Math.max(5, Math.min(95, pct));
    },
    []
  );

  useEffect(() => {
    const onMove = (evt: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      evt.preventDefault();
      const pct = pctFromEvent(evt);
      thresholdRef.current = pct;
      setThresholdPct(pct);
    };
    const onEnd = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [pctFromEvent]);

  // Clear selection on outside click
  useEffect(() => {
    const handler = () => {
      setSelectedCaseId(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const startDrag = useCallback(
    (evt: React.MouseEvent | React.TouchEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      draggingRef.current = true;
      setIsDragging(true);
      const nativeEvt = evt.nativeEvent as MouseEvent | TouchEvent;
      const pct = pctFromEvent(nativeEvt);
      thresholdRef.current = pct;
      setThresholdPct(pct);
    },
    [pctFromEvent]
  );

  const onBarDown = useCallback(
    (evt: React.MouseEvent | React.TouchEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      draggingRef.current = true;
      setIsDragging(true);
      const nativeEvt = evt.nativeEvent as MouseEvent | TouchEvent;
      const pct = pctFromEvent(nativeEvt);
      thresholdRef.current = pct;
      setThresholdPct(pct);
    },
    [pctFromEvent]
  );

  const onKeyDown = useCallback((evt: React.KeyboardEvent) => {
    if (evt.key === "ArrowRight" || evt.key === "ArrowUp") {
      evt.preventDefault();
      setThresholdPct((prev) => {
        const next = Math.min(95, prev + 2);
        thresholdRef.current = next;
        return next;
      });
    } else if (evt.key === "ArrowLeft" || evt.key === "ArrowDown") {
      evt.preventDefault();
      setThresholdPct((prev) => {
        const next = Math.max(5, prev - 2);
        thresholdRef.current = next;
        return next;
      });
    }
  }, []);

  // Compute score and zone lists
  let score = 0;
  const protectCases: { case_: CaseStudy; isCorrect: boolean }[] = [];
  const integrateCases: { case_: CaseStudy; isCorrect: boolean }[] = [];

  cases.forEach((c) => {
    const { zone, isCorrect } = classify(c, thresholdPct);
    if (isCorrect) score++;
    if (zone === "protect") {
      protectCases.push({ case_: c, isCorrect });
    } else {
      integrateCases.push({ case_: c, isCorrect });
    }
  });

  protectCases.sort((a, b) => a.case_.position - b.case_.position);
  integrateCases.sort((a, b) => a.case_.position - b.case_.position);

  // Score color class
  const scoreColor =
    score >= 9
      ? "var(--green)"
      : score >= bestPossible
        ? "var(--accent)"
        : "var(--red)";

  // Score subtitle
  let scoreSub = "";
  let scoreSubColor = "";
  if (score === bestPossible) {
    scoreSub =
      "That's the best possible. Two cases always end up in the wrong zone \u2014 click them to see why.";
    scoreSubColor = "var(--green)";
  } else if (score >= bestPossible - 1) {
    scoreSub = "Close \u2014 you can still get one more right.";
  } else if (score >= bestPossible - 2) {
    scoreSub =
      "Getting warmer. Where does the threshold best separate protect from integrate?";
  } else {
    scoreSub =
      "Keep adjusting \u2014 the threshold separates protect (left) from integrate (right).";
  }

  // Detail panel
  const selectedCase = selectedCaseId
    ? cases.find((c) => c.id === selectedCaseId) || null
    : null;
  const selectedClassification = selectedCase
    ? classify(selectedCase, thresholdPct)
    : null;

  // Callout
  let calloutHtml = "";
  if (score === bestPossible) {
    calloutHtml =
      "The best possible score is <strong>" +
      bestPossible +
      " out of 9</strong>. " +
      "Deep learning integrated successfully at maturity 35 while cleantech at 38 was destroyed by premature integration. " +
      "FAIR\u2019s world models at 48 needed integration while Watson Health at 52 needed more protection. " +
      "The switching point depends on domain-specific factors \u2014 reliability requirements, capital intensity, market tolerance \u2014 " +
      "that a maturity metric alone cannot capture.";
  } else {
    calloutHtml =
      "You\u2019re at <strong>" +
      score +
      " out of 9</strong>. " +
      "The maximum achievable is <strong>" +
      bestPossible +
      "</strong> \u2014 " +
      "try to reach it, then ask why two cases remain stubbornly misclassified.";
  }

  const rowHeight = 38;
  const dotAreaHeight = (maxRow + 1) * rowHeight + 8;

  return (
    <div
      ref={ref}
      className="vod-maturity-root"
      onClick={(e) => e.stopPropagation()}
    >
      <style>{`
        .vod-maturity-root {
          max-width: 720px;
          margin: 2.5rem auto;
        }
        .vod-maturity-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .vod-maturity-eyebrow {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${tokens.accent};
          margin-bottom: 0.5rem;
        }
        .vod-maturity-title {
          font-family: ${tokens.serif};
          font-size: 1.5rem;
          font-weight: 400;
          color: ${tokens.text};
          margin: 0;
        }
        .vod-maturity-subtitle {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textLight};
          font-style: italic;
          margin-top: 6px;
        }
        .vod-maturity-instruction {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .vod-maturity-instruction-text {
          font-family: ${tokens.sans};
          font-size: 0.75rem;
          font-weight: 500;
          color: ${tokens.textMuted};
        }
        .vod-maturity-instruction-text em {
          color: ${tokens.accent};
          font-style: normal;
          font-weight: 600;
        }
        .vod-maturity-slider-area {
          position: relative;
          margin-bottom: 2rem;
        }
        .vod-maturity-bar {
          position: relative;
          width: 100%;
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(
            to right,
            rgba(42, 122, 106, 0.08) 0%,
            rgba(42, 122, 106, 0.04) 45%,
            rgba(184, 134, 11, 0.04) 55%,
            rgba(184, 134, 11, 0.08) 100%
          );
          border: 1px solid ${tokens.border};
          cursor: pointer;
        }
        .vod-maturity-bar-zone-labels {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          pointer-events: none;
        }
        .vod-maturity-bar-zone-label {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: opacity 0.2s ease;
        }
        .vod-maturity-bar-zone-label--left { color: var(--teal); }
        .vod-maturity-bar-zone-label--right { color: var(--accent); }
        .vod-maturity-threshold {
          position: absolute;
          top: -8px;
          width: 3px;
          height: calc(100% + 16px);
          background: var(--accent);
          transform: translateX(-50%);
          cursor: ew-resize;
          z-index: 10;
          transition: box-shadow 0.2s ease;
          border-radius: 2px;
        }
        .vod-maturity-threshold:hover,
        .vod-maturity-threshold--dragging {
          box-shadow: 0 0 12px rgba(184, 134, 11, 0.3);
        }
        .vod-maturity-diamond {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: var(--accent);
          border: 2px solid var(--bg);
          transform: translate(-50%, -50%) rotate(45deg);
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(184, 134, 11, 0.2);
          cursor: ew-resize;
        }
        .vod-maturity-diamond::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          transform: translate(-50%, -50%);
          border-left: 2px solid var(--bg);
          border-right: 2px solid var(--bg);
          opacity: 0.8;
        }
        .vod-maturity-axis-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }
        .vod-maturity-axis-label {
          font-family: ${tokens.sans};
          font-size: 0.625rem;
          color: ${tokens.textFaint};
        }
        .vod-maturity-case-dot {
          position: absolute;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateX(-50%);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .vod-maturity-case-dot:hover {
          transform: translateX(-50%) scale(1.08);
        }
        .vod-maturity-dot-circle {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid;
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .vod-maturity-dot-circle--correct {
          background: var(--green-dim);
          border-color: var(--green);
          box-shadow: 0 0 6px rgba(74, 122, 74, 0.2);
        }
        .vod-maturity-dot-circle--wrong {
          background: var(--red-dim);
          border-color: var(--red);
          box-shadow: 0 0 6px rgba(166, 61, 47, 0.2);
        }
        .vod-maturity-dot-label {
          font-family: ${tokens.sans};
          font-size: 0.5625rem;
          font-weight: 600;
          color: ${tokens.textMuted};
          white-space: nowrap;
          margin-bottom: 4px;
          transition: color 0.3s ease;
          text-align: center;
          max-width: 80px;
          line-height: 1.2;
        }
        .vod-maturity-dot-label--correct { color: var(--green); }
        .vod-maturity-dot-label--wrong { color: var(--red); }
        .vod-maturity-score-area {
          text-align: center;
          margin-bottom: 2rem;
        }
        .vod-maturity-score-row {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
        }
        .vod-maturity-score-number {
          font-family: ${tokens.sans};
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          transition: color 0.3s ease;
        }
        .vod-maturity-score-total {
          font-family: ${tokens.sans};
          font-size: 1.2rem;
          font-weight: 400;
          color: ${tokens.textMuted};
        }
        .vod-maturity-score-label {
          font-family: ${tokens.sans};
          font-size: 0.875rem;
          font-weight: 500;
          color: ${tokens.textMuted};
          margin-left: 4px;
        }
        .vod-maturity-score-sub {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textLight};
          font-style: italic;
          margin-top: 4px;
          transition: opacity 0.3s ease;
        }
        .vod-maturity-zone-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 2rem;
        }
        .vod-maturity-zone-card {
          padding: 10px 14px;
          border-radius: 8px;
          min-height: 0;
          transition: border-color 0.3s ease;
        }
        .vod-maturity-zone-card--protect {
          background: var(--teal-dim);
          border: 1px solid rgba(42, 122, 106, 0.2);
        }
        .vod-maturity-zone-card--integrate {
          background: var(--accent-dim);
          border: 1px solid rgba(184, 134, 11, 0.2);
        }
        .vod-maturity-zone-header {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .vod-maturity-zone-header--protect { color: var(--teal); }
        .vod-maturity-zone-header--integrate { color: var(--accent); }
        .vod-maturity-zone-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .vod-maturity-zone-item {
          font-family: ${tokens.sans};
          font-size: 0.6875rem;
          font-weight: 500;
          padding: 3px 0;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .vod-maturity-zone-item:hover {
          opacity: 0.8;
        }
        .vod-maturity-zone-icon {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .vod-maturity-zone-icon--correct { background: var(--green); }
        .vod-maturity-zone-icon--wrong { background: var(--red); }
        .vod-maturity-zone-name { color: ${tokens.textMid}; }
        .vod-maturity-zone-verdict {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-left: auto;
        }
        .vod-maturity-zone-verdict--correct { color: var(--green); }
        .vod-maturity-zone-verdict--wrong { color: var(--red); }
        .vod-maturity-detail {
          padding: 14px 18px;
          border-radius: 8px;
          background: var(--bg-warm);
          border-left: 3px solid var(--accent);
          margin-bottom: 1.5rem;
          transition: opacity 0.3s ease, max-height 0.4s ease;
          overflow: hidden;
        }
        .vod-maturity-detail--hidden {
          opacity: 0;
          max-height: 0;
          padding: 0 18px;
          margin-bottom: 0;
          border-left-color: transparent;
        }
        .vod-maturity-detail--visible {
          opacity: 1;
          max-height: 300px;
        }
        .vod-maturity-detail-header {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .vod-maturity-detail-name {
          font-family: ${tokens.sans};
          font-size: 0.8125rem;
          font-weight: 700;
          color: ${tokens.text};
        }
        .vod-maturity-detail-badge {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 3px;
        }
        .vod-maturity-detail-badge--correct {
          color: var(--green);
          background: var(--green-dim);
        }
        .vod-maturity-detail-badge--wrong {
          color: var(--red);
          background: var(--red-dim);
        }
        .vod-maturity-detail-text {
          font-family: ${tokens.serif};
          font-size: 0.9rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        .vod-maturity-callout {
          padding: 16px 20px;
          background: var(--accent-dim);
          border-left: 3px solid var(--accent);
          border-radius: 0 8px 8px 0;
        }
        .vod-maturity-callout-text {
          font-family: ${tokens.serif};
          font-size: 0.95rem;
          color: ${tokens.textMid};
          line-height: 1.6;
        }
        @media (max-width: 640px) {
          .vod-maturity-zone-cards { grid-template-columns: 1fr; }
          .vod-maturity-dot-label { font-size: 0.5rem; max-width: 60px; }
          .vod-maturity-score-number { font-size: 2rem; }
        }
        @media (max-width: 420px) {
          .vod-maturity-bar { height: 40px; }
          .vod-maturity-bar-zone-label { display: none; }
          .vod-maturity-dot-label { font-size: 0.45rem; max-width: 50px; }
          .vod-maturity-diamond { width: 16px; height: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vod-maturity-case-dot,
          .vod-maturity-dot-circle,
          .vod-maturity-dot-label,
          .vod-maturity-score-number,
          .vod-maturity-threshold,
          .vod-maturity-zone-item,
          .vod-maturity-detail {
            transition-duration: 0.01s !important;
          }
        }
      `}</style>

      <div
        className="vod-maturity-header"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.6s ${ease}, transform 0.6s ${ease}`,
        }}
      >
        <div className="vod-maturity-eyebrow">Maturity Threshold</div>
        <h3 className="vod-maturity-title">
          When to protect. When to integrate.
        </h3>
        <div className="vod-maturity-subtitle">
          Drag the threshold to find the switching point. Try to get all nine
          right.
        </div>
      </div>

      <div
        className="vod-maturity-instruction"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.3s`,
        }}
      >
        <span className="vod-maturity-instruction-text">
          Drag the <em>gold diamond</em> along the bar — or click anywhere on
          the bar
        </span>
      </div>

      <div
        className="vod-maturity-slider-area"
        style={{
          paddingTop: dotAreaHeight + "px",
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.2s`,
        }}
      >
        {/* Case dots */}
        {cases.map((c) => {
          const { isCorrect } = classify(c, thresholdPct);
          const row = rowAssignments[c.id];
          const topPx = dotAreaHeight - (row + 1) * rowHeight;
          return (
            <div
              key={c.id}
              className="vod-maturity-case-dot"
              style={{ left: c.position + "%", top: topPx + "px" }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCaseId((prev) =>
                  prev === c.id ? null : c.id
                );
              }}
            >
              <div
                className={
                  "vod-maturity-dot-label" +
                  (isCorrect
                    ? " vod-maturity-dot-label--correct"
                    : " vod-maturity-dot-label--wrong")
                }
              >
                {c.short}
              </div>
              <div
                className={
                  "vod-maturity-dot-circle" +
                  (isCorrect
                    ? " vod-maturity-dot-circle--correct"
                    : " vod-maturity-dot-circle--wrong")
                }
              />
            </div>
          );
        })}

        {/* Bar */}
        <div
          ref={barRef}
          className="vod-maturity-bar"
          onMouseDown={onBarDown}
          onTouchStart={onBarDown}
        >
          <div className="vod-maturity-bar-zone-labels">
            <span className="vod-maturity-bar-zone-label vod-maturity-bar-zone-label--left">
              Protect
            </span>
            <span className="vod-maturity-bar-zone-label vod-maturity-bar-zone-label--right">
              Integrate
            </span>
          </div>
          <div
            className={
              "vod-maturity-threshold" +
              (isDragging ? " vod-maturity-threshold--dragging" : "")
            }
            style={{ left: thresholdPct + "%" }}
            role="slider"
            aria-label="Maturity threshold"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={Math.round(thresholdPct)}
            tabIndex={0}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            onKeyDown={onKeyDown}
          >
            <div className="vod-maturity-diamond" />
          </div>
        </div>

        <div className="vod-maturity-axis-labels">
          <span className="vod-maturity-axis-label">Low Maturity</span>
          <span className="vod-maturity-axis-label">High Maturity</span>
        </div>
      </div>

      {/* Score */}
      <div
        className="vod-maturity-score-area"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.4s`,
        }}
      >
        <div className="vod-maturity-score-row">
          <span
            className="vod-maturity-score-number"
            style={{ color: scoreColor }}
          >
            {score}
          </span>
          <span className="vod-maturity-score-total">/ 9</span>
          <span className="vod-maturity-score-label">
            correctly classified
          </span>
        </div>
        <div
          className="vod-maturity-score-sub"
          style={scoreSubColor ? { color: scoreSubColor } : undefined}
        >
          {scoreSub}
        </div>
      </div>

      {/* Zone cards */}
      <div
        className="vod-maturity-zone-cards"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.5s`,
        }}
      >
        <div className="vod-maturity-zone-card vod-maturity-zone-card--protect">
          <div className="vod-maturity-zone-header vod-maturity-zone-header--protect">
            ← Protected exploration
          </div>
          <ul className="vod-maturity-zone-list">
            {protectCases.map((item) => (
              <li
                key={item.case_.id}
                className="vod-maturity-zone-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCaseId(item.case_.id);
                }}
              >
                <span
                  className={
                    "vod-maturity-zone-icon" +
                    (item.isCorrect
                      ? " vod-maturity-zone-icon--correct"
                      : " vod-maturity-zone-icon--wrong")
                  }
                />
                <span className="vod-maturity-zone-name">
                  {item.case_.short}
                </span>
                <span
                  className={
                    "vod-maturity-zone-verdict" +
                    (item.isCorrect
                      ? " vod-maturity-zone-verdict--correct"
                      : " vod-maturity-zone-verdict--wrong")
                  }
                >
                  {item.isCorrect ? "\u2713 correct" : "\u2717 wrong zone"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="vod-maturity-zone-card vod-maturity-zone-card--integrate">
          <div className="vod-maturity-zone-header vod-maturity-zone-header--integrate">
            Structured translation →
          </div>
          <ul className="vod-maturity-zone-list">
            {integrateCases.map((item) => (
              <li
                key={item.case_.id}
                className="vod-maturity-zone-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCaseId(item.case_.id);
                }}
              >
                <span
                  className={
                    "vod-maturity-zone-icon" +
                    (item.isCorrect
                      ? " vod-maturity-zone-icon--correct"
                      : " vod-maturity-zone-icon--wrong")
                  }
                />
                <span className="vod-maturity-zone-name">
                  {item.case_.short}
                </span>
                <span
                  className={
                    "vod-maturity-zone-verdict" +
                    (item.isCorrect
                      ? " vod-maturity-zone-verdict--correct"
                      : " vod-maturity-zone-verdict--wrong")
                  }
                >
                  {item.isCorrect ? "\u2713 correct" : "\u2717 wrong zone"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={
          "vod-maturity-detail" +
          (selectedCase
            ? " vod-maturity-detail--visible"
            : " vod-maturity-detail--hidden")
        }
      >
        {selectedCase && selectedClassification && (
          <>
            <div className="vod-maturity-detail-header">
              <span className="vod-maturity-detail-name">
                {selectedCase.name}
              </span>
              <span
                className={
                  "vod-maturity-detail-badge" +
                  (selectedClassification.isCorrect
                    ? " vod-maturity-detail-badge--correct"
                    : " vod-maturity-detail-badge--wrong")
                }
              >
                {selectedClassification.isCorrect
                  ? "Correctly " +
                    (selectedClassification.zone === "protect"
                      ? "protected"
                      : "integrated")
                  : "Should " +
                    (selectedCase.correct === "protect"
                      ? "be protected"
                      : "be integrated")}
              </span>
            </div>
            <div className="vod-maturity-detail-text">
              {selectedCase.narrative}
            </div>
          </>
        )}
      </div>

      {/* Callout */}
      <div
        className="vod-maturity-callout"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.6s ${ease} 0.6s`,
        }}
      >
        <div
          className="vod-maturity-callout-text"
          dangerouslySetInnerHTML={{ __html: calloutHtml }}
        />
      </div>
    </div>
  );
}
