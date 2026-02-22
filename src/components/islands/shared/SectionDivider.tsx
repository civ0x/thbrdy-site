import { tokens } from "./tokens";

interface SectionDividerProps {
  number: string;
  label: string;
}

export function SectionDivider({ number, label }: SectionDividerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        margin: "64px 0 32px",
      }}
    >
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
