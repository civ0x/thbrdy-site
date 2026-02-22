import type { ReactNode } from "react";
import { tokens } from "./tokens";
import { useInView } from "./useInView";

interface PullQuoteProps {
  children: ReactNode;
}

export function PullQuote({ children }: PullQuoteProps) {
  const [ref, inView] = useInView(0.3);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: "720px",
        margin: "56px auto 24px",
        padding: "0",
        textAlign: "center",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "2px",
          background: tokens.accent,
          margin: "0 auto 28px",
        }}
      />
      <p
        style={{
          fontFamily: tokens.serif,
          fontSize: "26px",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.5,
          color: tokens.text,
          maxWidth: "560px",
          margin: "0 auto",
          paddingBottom: "8px",
        }}
      >
        {children}
      </p>
    </div>
  );
}
