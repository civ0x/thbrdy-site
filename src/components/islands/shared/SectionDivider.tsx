import { useState } from "react";
import { tokens } from "./tokens";

interface SectionDividerProps {
  number: string;
  label: string;
}

export function SectionDivider({ number, label }: SectionDividerProps) {
  const [copied, setCopied] = useState(false);
  const sectionId = `section-${number}`;

  const handleCopy = () => {
    const url =
      window.location.origin + window.location.pathname + "#" + sectionId;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id={sectionId} className="sd-root">
      <style>{`
        .sd-root {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 64px 0 32px;
          scroll-margin-top: 80px;
        }
        .sd-anchor {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.2s ease, color 0.2s ease;
          line-height: 0;
          flex-shrink: 0;
        }
        .sd-root:hover .sd-anchor {
          opacity: 1;
        }
        .sd-anchor:hover {
          color: var(--accent);
        }
        .sd-anchor--copied {
          opacity: 1;
          color: var(--accent);
        }
        @media (pointer: coarse) {
          .sd-anchor {
            opacity: 0.4;
          }
          .sd-anchor--copied {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sd-anchor {
            transition: none;
          }
        }
      `}</style>
      <button
        className={`sd-anchor${copied ? " sd-anchor--copied" : ""}`}
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy link to section"}
        aria-label={copied ? "Link copied" : "Copy link to section"}
      >
        {copied ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
      <span
        style={{
          fontFamily: tokens.mono,
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: tokens.accent,
          whiteSpace: "nowrap",
        }}
      >
        {number} — {label}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: tokens.borderMid,
        }}
      />
    </div>
  );
}
