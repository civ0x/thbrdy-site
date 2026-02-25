import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";

interface PopoverContent {
  label: string;
  title: string;
  body: string;
  structural: string;
  dotColor?: string;
}

interface DiagramPopoverProps {
  content: PopoverContent | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
}

function isMobile(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 860px)").matches;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DiagramPopover({ content, triggerRef, open, onClose }: DiagramPopoverProps) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; placement: "above" | "below" }>({ top: 0, left: 0, placement: "above" });
  const popRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();
  const reduced = prefersReducedMotion();

  useEffect(() => { setMounted(true); }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popRef.current || isMobile()) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popW = 300;
    const popH = popRef.current.getBoundingClientRect().height || 200;

    let top = rect.top - popH - 12;
    let placement: "above" | "below" = "above";
    if (top < 12) {
      top = rect.bottom + 12;
      placement = "below";
    }
    if (top + popH > window.innerHeight - 12) {
      top = rect.top - popH - 12;
      placement = "above";
    }

    let left = rect.left + (rect.width - popW) / 2;
    left = Math.max(12, Math.min(window.innerWidth - popW - 12, left));

    setPos({ top, left, placement });
  }, [triggerRef]);

  useEffect(() => {
    if (open && !isMobile()) {
      requestAnimationFrame(updatePosition);
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handle = () => requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle, { passive: true });
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => { clearTimeout(timer); document.removeEventListener("click", handleClick); };
  }, [open, onClose, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!mounted || !content) return null;

  const mobile = isMobile();

  const desktopStyle: React.CSSProperties = {
    position: "fixed", zIndex: 1000,
    maxWidth: 300,
    top: `${pos.top}px`, left: `${pos.left}px`,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transform: open ? "translateY(0)" : pos.placement === "above" ? "translateY(6px)" : "translateY(-6px)",
    transition: reduced ? "none" : "opacity 0.2s ease, transform 0.2s ease",
  };

  const mobileStyle: React.CSSProperties = {
    position: "fixed", zIndex: 1000,
    bottom: 0, left: 0, right: 0,
    maxWidth: "none",
    width: "calc(100% - 32px)", margin: "0 16px",
    borderRadius: "12px 12px 0 0",
    maxHeight: "80vh", overflowY: "auto",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transform: open ? "translateY(0)" : "translateY(12px)",
    transition: reduced ? "none" : "opacity 0.2s ease, transform 0.2s ease",
  };

  return createPortal(
    <>
      {mobile && open && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
          }}
          onClick={onClose}
        />
      )}
      <div
        ref={popRef}
        id={`diagram-pop-${uniqueId}`}
        role="tooltip"
        className="diagram-popover"
        style={mobile ? mobileStyle : desktopStyle}
      >
        <style>{diagramPopoverStyles}</style>
        {mobile && (
          <button
            className="diagram-pop-close"
            aria-label="Close popover"
            onClick={onClose}
          >×</button>
        )}
        <div className="diagram-pop-label">
          {content.dotColor && (
            <span className="diagram-pop-dot" style={{ backgroundColor: content.dotColor }} />
          )}
          {content.label}
        </div>
        <div className="diagram-pop-title">{content.title}</div>
        <div className="diagram-pop-body" dangerouslySetInnerHTML={{ __html: content.body }} />
        <div className="diagram-pop-body diagram-pop-structural">
          <div className="diagram-pop-sub">Structural significance</div>
          <span dangerouslySetInnerHTML={{ __html: content.structural }} />
        </div>
      </div>
    </>,
    document.body,
  );
}

// Hook to manage popover state for diagram nodes
export function useDiagramPopover() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoverOpen = useRef(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Sync triggerRef
  useEffect(() => { triggerRef.current = triggerEl; }, [triggerEl]);

  const close = useCallback(() => {
    setOpenKey(null);
    setTriggerEl(null);
    isHoverOpen.current = false;
  }, []);

  const open = useCallback((key: string, el: HTMLElement) => {
    setOpenKey(key);
    setTriggerEl(el);
  }, []);

  const clearHover = useCallback(() => {
    if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null; }
  }, []);

  const getNodeProps = useCallback((key: string) => ({
    tabIndex: 0,
    role: "button" as const,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (isMobile()) return;
      clearHover();
      const target = e.currentTarget;
      hoverTimeout.current = setTimeout(() => {
        close();
        open(key, target);
        isHoverOpen.current = true;
      }, 120);
    },
    onMouseLeave: () => {
      if (isMobile() || !isHoverOpen.current) return;
      clearHover();
      hoverTimeout.current = setTimeout(() => {
        if (isHoverOpen.current) close();
      }, 150);
    },
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      clearHover();
      isHoverOpen.current = false;
      if (openKey === key) {
        close();
      } else {
        close();
        open(key, e.currentTarget);
      }
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      } else if (e.key === "Escape") {
        close();
      }
    },
  }), [openKey, open, close, clearHover]);

  const getPopoverMouseProps = useCallback(() => ({
    onMouseEnter: () => {
      if (!isMobile()) clearHover();
    },
    onMouseLeave: () => {
      if (isMobile() || !isHoverOpen.current) return;
      clearHover();
      hoverTimeout.current = setTimeout(() => {
        if (isHoverOpen.current) close();
      }, 200);
    },
  }), [clearHover, close]);

  return { openKey, triggerRef, close, getNodeProps, getPopoverMouseProps };
}

const diagramPopoverStyles = `
  .diagram-popover {
    background-color: var(--bg-warm);
    border: 1px solid var(--border-mid);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(44, 36, 22, 0.08);
    padding: 12px 14px;
  }
  .diagram-pop-close {
    display: none;
    position: absolute;
    top: 8px; right: 8px;
    background: none; border: none;
    font-size: 1.5rem; color: var(--text-light);
    cursor: pointer; padding: 0;
    width: 24px; height: 24px; line-height: 1;
  }
  .diagram-pop-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--text-muted); margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .diagram-pop-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  }
  .diagram-pop-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem; font-weight: 600;
    color: var(--text); margin-bottom: 6px;
  }
  .diagram-pop-body {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem; color: var(--text-mid);
    line-height: 1.45;
  }
  .diagram-pop-body em {
    color: var(--text); font-style: italic;
  }
  .diagram-pop-structural {
    margin-top: 8px; padding-top: 8px;
    border-top: 1px solid var(--border);
  }
  .diagram-pop-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.04em;
    color: var(--text-muted); margin-bottom: 3px;
  }
  @media (max-width: 860px) {
    .diagram-pop-close { display: block; }
  }
`;
