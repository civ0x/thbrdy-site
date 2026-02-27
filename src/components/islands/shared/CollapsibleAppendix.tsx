import { useState, useRef, type ReactNode } from "react";
import { tokens } from "./tokens";
import { useInView } from "./useInView";

interface CollapsibleAppendixProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function CollapsibleAppendix({ id, title, children }: CollapsibleAppendixProps) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView(0.1);
  const bodyId = `nv-appendix-body-${id}`;

  return (
    <div ref={ref} className="nv-appendix-root">
      <style>{`
        .nv-appendix-root {
          border-top: 1px solid ${tokens.borderMid};
        }
        .nv-appendix-root:last-child {
          border-bottom: 1px solid ${tokens.borderMid};
        }
        .nv-appendix-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 16px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: ${tokens.sans};
          font-size: 14px;
          font-weight: 500;
          color: ${tokens.textMid};
          text-align: left;
          transition: color 0.2s ease;
        }
        .nv-appendix-toggle:hover {
          color: ${tokens.accent};
        }
        .nv-appendix-chevron {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .nv-appendix-chevron--open {
          transform: rotate(90deg);
        }
        .nv-appendix-body {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.3s ease;
        }
        .nv-appendix-body--open {
          max-height: 2000px;
          opacity: 1;
        }
        .nv-appendix-content {
          padding: 0 0 24px 26px;
          font-family: ${tokens.sans};
          font-size: 14px;
          line-height: 1.65;
          color: ${tokens.textMid};
        }
        .nv-appendix-content strong {
          color: ${tokens.text};
          font-weight: 600;
        }
        .nv-appendix-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 13px;
        }
        .nv-appendix-content thead th {
          font-family: ${tokens.mono};
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: ${tokens.textMuted};
          text-align: left;
          padding: 8px 12px 8px 0;
          border-bottom: 1px solid ${tokens.borderMid};
        }
        .nv-appendix-content tbody td {
          font-family: ${tokens.sans};
          font-size: 13px;
          color: ${tokens.textMid};
          padding: 8px 12px 8px 0;
          border-bottom: 1px solid ${tokens.border};
          vertical-align: top;
        }
        .nv-appendix-content tbody td:first-child {
          font-weight: 500;
          color: ${tokens.text};
        }
        .nv-appendix-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (prefers-reduced-motion: reduce) {
          .nv-appendix-toggle,
          .nv-appendix-chevron,
          .nv-appendix-body {
            transition-duration: 0.01s;
          }
        }
      `}</style>
      <button
        className="nv-appendix-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={bodyId}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(-12px)",
          transition: "opacity 0.5s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), color 0.2s ease",
        }}
      >
        <svg
          className={`nv-appendix-chevron${open ? " nv-appendix-chevron--open" : ""}`}
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 2l5 5-5 5" />
        </svg>
        {title}
      </button>
      <div
        id={bodyId}
        className={`nv-appendix-body${open ? " nv-appendix-body--open" : ""}`}
        role="region"
        aria-labelledby={`nv-appendix-toggle-${id}`}
      >
        <div className="nv-appendix-content">
          {children}
        </div>
      </div>
    </div>
  );
}
