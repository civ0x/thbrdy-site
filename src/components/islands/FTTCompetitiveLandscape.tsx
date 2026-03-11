import { tokens } from "./shared/tokens";
import { useInView } from "./shared/useInView";
import { DiagramPopover, useDiagramPopover } from "./shared/DiagramPopover";

type CellStatus = "best" | "good" | "limited";

interface CellData {
  value: string;
  status: CellStatus;
  popoverKey?: string;
}

interface PopoverData {
  label: string;
  title: string;
  body: string;
  structural: string;
}

const devices = ["M5 Max", "RTX 5090", "DGX Spark", "Strix Halo"];

const rows: { label: string; cells: CellData[] }[] = [
  {
    label: "Memory",
    cells: [
      { value: "128 GB", status: "best" },
      { value: "32 GB", status: "limited", popoverKey: "rtx-mem" },
      { value: "128 GB", status: "best" },
      { value: "128 GB", status: "best" },
    ],
  },
  {
    label: "Bandwidth",
    cells: [
      { value: "614 GB/s", status: "good" },
      { value: "1,790 GB/s", status: "best" },
      { value: "273 GB/s", status: "limited" },
      { value: "~256 GB/s", status: "limited" },
    ],
  },
  {
    label: "70B Q4 decode",
    cells: [
      { value: "~10–15 tok/s", status: "best" },
      { value: "Cannot load", status: "limited", popoverKey: "rtx-70b" },
      { value: "~5–7 tok/s", status: "limited" },
      { value: "~6–8 tok/s", status: "limited" },
    ],
  },
];

const rows2: { label: string; cells: CellData[] }[] = [
  {
    label: "8B Q4 decode",
    cells: [
      { value: "~90 tok/s", status: "good" },
      { value: "~200+ tok/s", status: "best" },
      { value: "~40 tok/s", status: "limited" },
      { value: "~35 tok/s", status: "limited" },
    ],
  },
  {
    label: "Power",
    cells: [
      { value: "50W", status: "best" },
      { value: "575W", status: "limited" },
      { value: "200W", status: "good" },
      { value: "120W", status: "good" },
    ],
  },
  {
    label: "Price",
    cells: [
      { value: "~$5,000", status: "limited" },
      { value: "~$2,000", status: "best" },
      { value: "$4,699", status: "limited" },
      { value: "$2,348", status: "best", popoverKey: "strix-price" },
    ],
  },
  {
    label: "Form factor",
    cells: [
      { value: "Laptop", status: "best" },
      { value: "Desktop GPU", status: "limited" },
      { value: "Small desktop", status: "good" },
      { value: "Laptop", status: "best" },
    ],
  },
];

const popovers: Record<string, PopoverData> = {
  "rtx-mem": {
    label: "RTX 5090",
    title: "32GB VRAM limit",
    body: "Discrete GPUs cannot share system RAM for inference. 32GB VRAM caps the maximum model size regardless of host memory.",
    structural: "This hard ceiling is why the competitive picture inverts at ~30B parameters.",
  },
  "rtx-70b": {
    label: "RTX 5090",
    title: "Cannot load 70B Q4",
    body: "70B at Q4 quantization requires ~38GB. With 32GB VRAM, the model simply does not fit — no amount of optimization changes this.",
    structural: "Unified memory architectures avoid this cliff entirely. 128GB is 128GB.",
  },
  "strix-price": {
    label: "Strix Halo",
    title: "Price-performance dark horse",
    body: "Same 128GB memory, half the bandwidth, one-third the M5 Max price. For budget-constrained 70B inference, the strongest value proposition.",
    structural: "Bandwidth-bound decode makes the ~256 GB/s a real constraint — roughly 40% of M5 Max's generation speed.",
  },
};

const statusIcon: Record<CellStatus, string> = {
  best: "●",
  good: "◐",
  limited: "○",
};

function renderRows(
  data: typeof rows,
  inView: boolean,
  startIdx: number,
  getNodeProps: ReturnType<typeof useDiagramPopover>["getNodeProps"],
) {
  return data.map((row, i) => (
    <div key={row.label} style={{ display: "contents" }}>
      <div
        className="ftt-cl-label"
        style={{
          opacity: inView ? 1 : 0,
          transition: `opacity 0.4s ease ${0.15 + (startIdx + i) * 0.07}s`,
        }}
      >
        {row.label}
      </div>
      {row.cells.map((cell, j) => (
        <div
          key={j}
          className={`ftt-cl-cell ftt-cl-cell--${cell.status}${cell.popoverKey ? " ftt-cl-cell--pop" : ""}`}
          style={{
            opacity: inView ? 1 : 0,
            transition: `opacity 0.4s ease ${0.15 + (startIdx + i) * 0.07}s`,
          }}
          {...(cell.popoverKey ? getNodeProps(cell.popoverKey) : {})}
        >
          <span className="ftt-cl-icon">{statusIcon[cell.status]}</span>
          {cell.value}
        </div>
      ))}
    </div>
  ));
}

export default function FTTCompetitiveLandscape() {
  const [ref, inView] = useInView(0.1);
  const { openKey, triggerRef, close, getNodeProps, getPopoverMouseProps } = useDiagramPopover();

  const activePopover = openKey && popovers[openKey] ? popovers[openKey] : null;

  return (
    <div ref={ref} className="ftt-cl">
      <style>{`
        .ftt-cl {
          margin: 2.5rem 0;
        }
        .ftt-cl-inner {
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.border};
          border-radius: 8px;
          overflow: hidden;
        }
        .ftt-cl-header {
          padding: 1.25rem 1.5rem 0.75rem;
          border-bottom: 1px solid ${tokens.border};
        }
        .ftt-cl-header h4 {
          font-family: ${tokens.mono};
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${tokens.textMuted};
          margin: 0;
        }
        .ftt-cl-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .ftt-cl-grid {
          display: grid;
          grid-template-columns: 1.4fr repeat(4, 1fr);
          font-family: ${tokens.sans};
          font-size: 0.7rem;
          min-width: 560px;
        }
        .ftt-cl-dev-hdr {
          padding: 0.65rem 0.6rem;
          font-weight: 600;
          color: ${tokens.textMid};
          letter-spacing: 0.01em;
          border-bottom: 1px solid ${tokens.border};
          background: ${tokens.bgCard};
          text-align: center;
        }
        .ftt-cl-dev-hdr:first-child {
          text-align: left;
          color: ${tokens.textMuted};
          font-weight: 400;
        }
        .ftt-cl-label {
          padding: 0.6rem 0.7rem;
          font-weight: 500;
          color: ${tokens.textMid};
          border-bottom: 1px solid ${tokens.border};
          display: flex;
          align-items: center;
        }
        .ftt-cl-cell {
          padding: 0.6rem 0.5rem;
          border-bottom: 1px solid ${tokens.border};
          border-left: 1px solid ${tokens.border};
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          color: ${tokens.textMid};
        }
        .ftt-cl-cell--pop {
          cursor: pointer;
        }
        .ftt-cl-cell--pop:hover {
          background: ${tokens.accentDim};
        }
        .ftt-cl-icon {
          font-size: 0.55rem;
          flex-shrink: 0;
        }
        .ftt-cl-cell--best .ftt-cl-icon {
          color: ${tokens.accent};
        }
        .ftt-cl-cell--good .ftt-cl-icon {
          color: ${tokens.textMid};
        }
        .ftt-cl-cell--limited .ftt-cl-icon {
          color: ${tokens.textFaint};
        }
        .ftt-cl-cell--limited {
          color: ${tokens.textMuted};
        }
        .ftt-cl-divider {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.7rem;
          background: ${tokens.bgCard};
          border-bottom: 1px solid ${tokens.border};
        }
        .ftt-cl-divider-line {
          flex: 1;
          height: 1px;
          background: ${tokens.borderMid};
        }
        .ftt-cl-divider-text {
          font-family: ${tokens.mono};
          font-size: 0.5rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${tokens.accent};
          white-space: nowrap;
        }
        .ftt-cl-footer {
          padding: 0.75rem 1.5rem;
          border-top: 1px solid ${tokens.border};
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .ftt-cl-legend {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          color: ${tokens.textMuted};
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        @media (max-width: 640px) {
          .ftt-cl-grid {
            font-size: 0.6rem;
          }
          .ftt-cl-header {
            padding: 1rem 1rem 0.6rem;
          }
          .ftt-cl-footer {
            padding: 0.6rem 1rem;
            gap: 0.75rem;
          }
        }
        @media (max-width: 420px) {
          .ftt-cl-grid {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <div
        className="ftt-cl-inner"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="ftt-cl-header">
          <h4>Competitive landscape by model size</h4>
        </div>
        <div className="ftt-cl-scroll">
          <div className="ftt-cl-grid">
            {/* Header */}
            <div className="ftt-cl-dev-hdr" />
            {devices.map((d) => (
              <div key={d} className="ftt-cl-dev-hdr">{d}</div>
            ))}

            {/* Rows above 30B */}
            {renderRows(rows, inView, 0, getNodeProps)}

            {/* Divider */}
            <div
              className="ftt-cl-divider"
              style={{
                opacity: inView ? 1 : 0,
                transition: "opacity 0.4s ease 0.45s",
              }}
            >
              <div className="ftt-cl-divider-line" />
              <div className="ftt-cl-divider-text">The picture flips at ~30B parameters</div>
              <div className="ftt-cl-divider-line" />
            </div>

            {/* Rows below 30B */}
            {renderRows(rows2, inView, rows.length, getNodeProps)}
          </div>
        </div>
        <div
          className="ftt-cl-footer"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.5s ease 0.7s",
          }}
        >
          <div className="ftt-cl-legend">
            <span style={{ color: tokens.accent }}>●</span> Best in row
          </div>
          <div className="ftt-cl-legend">
            <span style={{ color: tokens.textMid }}>◐</span> Competitive
          </div>
          <div className="ftt-cl-legend">
            <span style={{ color: tokens.textFaint }}>○</span> Limited
          </div>
        </div>
      </div>

      {activePopover && (
        <DiagramPopover
          content={activePopover}
          triggerRef={triggerRef}
          open={!!openKey}
          onClose={close}
          {...getPopoverMouseProps()}
        />
      )}
    </div>
  );
}
