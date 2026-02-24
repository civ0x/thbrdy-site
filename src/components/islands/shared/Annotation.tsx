import React, { useRef, useState, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";

type AnnotationMode = "term" | "reference" | "link";

interface TermContent {
  definition: string;
}

interface ReferenceContent {
  title: string;
  authors: string;
  year?: number | string;
  venue?: string;
  url?: string;
  summary: string;
  context?: string;
}

interface LinkContent {
  url: string;
  title: string;
  source: string;
  summary: string;
}

interface AnnotationProps {
  mode: AnnotationMode;
  term?: string;
  content: TermContent | ReferenceContent | LinkContent;
  children: React.ReactNode;
}

// Global state: only one popover open at a time
let globalCloseCallback: (() => void) | null = null;

function isMobile(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Annotation({ mode, term, content, children }: AnnotationProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; placement: "below" | "above" }>({
    top: 0,
    left: 0,
    placement: "below",
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uniqueId = useId();
  const popoverId = `annotation-popover-${uniqueId}`;

  // Only render portal after mount (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  const closePopover = useCallback(() => {
    setOpen(false);
    if (globalCloseCallback === closePopover) {
      globalCloseCallback = null;
    }
  }, []);

  const openPopover = useCallback(() => {
    if (globalCloseCallback && globalCloseCallback !== closePopover) {
      globalCloseCallback();
    }
    globalCloseCallback = closePopover;
    setOpen(true);
  }, [closePopover]);

  // Position calculation — positions popover relative to viewport using fixed positioning
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || isMobile()) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const placement = spaceBelow > 280 || spaceBelow > spaceAbove ? "below" : "above";

    const popoverWidth = Math.min(380, window.innerWidth - 32);
    let left = triggerRect.left + triggerRect.width / 2 - popoverWidth / 2;

    // Horizontal edge clamping
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) left = window.innerWidth - 8 - popoverWidth;

    const top = placement === "below" ? triggerRect.bottom + 8 : triggerRect.top - 8;

    setPopoverPos({ top, left, placement });
  }, []);

  useEffect(() => {
    if (open && !isMobile()) {
      updatePosition();
    }
  }, [open, updatePosition]);

  // Reposition on scroll/resize (desktop only)
  useEffect(() => {
    if (!open || isMobile()) return;
    const handleReposition = () => {
      requestAnimationFrame(updatePosition);
    };
    window.addEventListener("scroll", handleReposition, { passive: true });
    window.addEventListener("resize", handleReposition, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleReposition);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        closePopover();
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClick);
    };
  }, [open, closePopover]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopover();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closePopover]);

  const handleMouseEnter = () => {
    if (isMobile()) return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    openPopover();
  };

  const handleMouseLeave = () => {
    if (isMobile()) return;
    hoverTimeout.current = setTimeout(closePopover, 120);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handlePopoverMouseLeave = () => {
    if (isMobile()) return;
    hoverTimeout.current = setTimeout(closePopover, 120);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (mode === "link" && isMobile()) {
      if (!open) {
        e.preventDefault();
        openPopover();
        return;
      }
      return;
    }
    if (open) {
      closePopover();
    } else {
      openPopover();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) closePopover();
      else openPopover();
    }
  };

  const isLink = mode === "link";
  const linkUrl = isLink ? (content as LinkContent).url : undefined;
  const reduced = prefersReducedMotion();

  const triggerClass = `annotation-trigger ${isLink ? "annotation-trigger--link" : ""} ${open ? "annotation-trigger--active" : ""}`;

  const renderPopoverContent = () => {
    if (mode === "term") {
      const c = content as TermContent;
      return (
        <div className="annotation-popover-inner">
          <div className="annotation-popover-mode">
            <span className="annotation-mode-dot annotation-mode-dot--term" />
            Definition
          </div>
          <div className="annotation-popover-term-name">{term}</div>
          <div className="annotation-popover-definition">{c.definition}</div>
        </div>
      );
    }

    if (mode === "reference") {
      const c = content as ReferenceContent;
      const metaParts = [c.authors, c.venue, c.year].filter(Boolean).join(" \u00B7 ");
      return (
        <div className="annotation-popover-inner">
          <div className="annotation-popover-mode annotation-popover-mode--reference">
            <span className="annotation-mode-dot annotation-mode-dot--reference" />
            Reference
          </div>
          {c.title && <div className="annotation-popover-ref-title">{c.title}</div>}
          {metaParts && <div className="annotation-popover-ref-meta">{metaParts}</div>}
          <div className="annotation-popover-ref-summary">{c.summary}</div>
          {c.context && (
            <div className="annotation-popover-ref-context">
              <strong>In this essay:</strong> {c.context}
            </div>
          )}
          {c.url && (
            <a
              className="annotation-popover-ref-link"
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View paper <span className="annotation-arrow">&rarr;</span>
            </a>
          )}
        </div>
      );
    }

    // link mode
    const c = content as LinkContent;
    return (
      <div className="annotation-popover-inner">
        <div className="annotation-popover-mode annotation-popover-mode--link">
          <span className="annotation-mode-dot annotation-mode-dot--link" />
          External Link
        </div>
        <div className="annotation-popover-link-url">{c.url.replace(/^https?:\/\//, "")}</div>
        <div className="annotation-popover-link-title">{c.title}</div>
        <div className="annotation-popover-link-source">{c.source}</div>
        <div className="annotation-popover-link-summary">{c.summary}</div>
        <div className="annotation-popover-link-cta">
          Visit page <span className="annotation-arrow">&rarr;</span>
        </div>
      </div>
    );
  };

  // Desktop popover style: fixed positioning from calculated coords
  const desktopPopoverStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 1000,
    width: `min(380px, calc(100vw - 2rem))`,
    top: popoverPos.placement === "below" ? `${popoverPos.top}px` : undefined,
    bottom: popoverPos.placement === "above" ? `${window.innerHeight - popoverPos.top}px` : undefined,
    left: `${popoverPos.left}px`,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transform: open ? "translateY(0)" : popoverPos.placement === "below" ? "translateY(6px)" : "translateY(-6px)",
    transition: reduced ? "none" : "opacity 0.2s ease, transform 0.2s ease",
  };

  // Mobile popover style: bottom sheet
  const mobilePopoverStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 1000,
    left: "1rem",
    right: "1rem",
    bottom: "1rem",
    width: "auto",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transform: open ? "translateY(0)" : "translateY(12px)",
    transition: reduced ? "none" : "opacity 0.2s ease, transform 0.2s ease",
  };

  const triggerProps = {
    ref: triggerRef,
    className: triggerClass,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: isLink ? undefined : ("button" as const),
    "aria-describedby": popoverId,
  };

  const TriggerTag = isLink ? "a" : "span";
  const linkProps = isLink ? { href: linkUrl, target: "_blank" as const, rel: "noopener noreferrer" } : {};

  // Portal content: popover + backdrop rendered into document.body
  const portalContent = mounted
    ? createPortal(
        <>
          {isMobile() && open && (
            <div
              className="annotation-backdrop"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(44, 36, 22, 0.15)",
                zIndex: 999,
                opacity: 1,
                transition: reduced ? "none" : "opacity 0.2s ease",
              }}
              onClick={closePopover}
            />
          )}
          <div
            ref={popoverRef}
            id={popoverId}
            role="tooltip"
            className={`annotation-popover ${isMobile() ? "annotation-popover--mobile" : `annotation-popover--${popoverPos.placement}`}`}
            style={isMobile() ? mobilePopoverStyle : desktopPopoverStyle}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          >
            {renderPopoverContent()}
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <style>{annotationStyles}</style>
      <TriggerTag {...triggerProps} {...linkProps}>
        {children}
      </TriggerTag>
      {portalContent}
    </>
  );
}

const annotationStyles = `
  .annotation-trigger {
    position: relative;
    border-bottom: 1.5px dashed var(--accent);
    cursor: pointer;
    padding-bottom: 1px;
    transition: border-color 0.2s ease, background 0.2s ease;
    text-decoration: none;
    color: inherit;
  }
  .annotation-trigger:hover,
  .annotation-trigger--active {
    background: var(--accent-dim);
    border-bottom-color: var(--accent);
  }
  .annotation-trigger--link {
    color: var(--teal);
    border-bottom-color: var(--teal);
  }
  .annotation-trigger--link:hover,
  .annotation-trigger--link.annotation-trigger--active {
    background: var(--teal-dim);
    border-bottom-color: var(--teal);
  }

  .annotation-popover {
    background: var(--bg-warm);
    border: 1px solid var(--border-mid);
    border-radius: 6px;
    box-shadow:
      0 4px 12px rgba(44, 36, 22, 0.08),
      0 1px 3px rgba(44, 36, 22, 0.06);
  }
  .annotation-popover--mobile {
    border-radius: 10px;
    box-shadow:
      0 -4px 24px rgba(44, 36, 22, 0.12),
      0 0 0 1px var(--border-mid);
  }

  .annotation-popover-inner {
    padding: 1.25rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    .annotation-popover--mobile .annotation-popover-inner {
      padding: 1.35rem 1.5rem;
    }
  }

  .annotation-popover-mode {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .annotation-mode-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .annotation-mode-dot--term { background: var(--accent); }
  .annotation-mode-dot--reference { background: var(--text-muted); }
  .annotation-mode-dot--link { background: var(--teal); }

  .annotation-popover-term-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.4rem;
  }
  .annotation-popover-definition {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.45;
  }

  .annotation-popover-ref-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    font-style: italic;
    margin-bottom: 0.15rem;
    line-height: 1.35;
  }
  .annotation-popover-ref-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--text-muted);
    letter-spacing: 0.03em;
    margin-bottom: 0.6rem;
  }
  .annotation-popover-ref-summary {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.45;
    margin-bottom: 0.5rem;
  }
  .annotation-popover-ref-context {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--text-light);
    line-height: 1.4;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
    font-style: italic;
  }
  .annotation-popover-ref-context strong {
    font-weight: 500;
    font-style: normal;
    color: var(--text-muted);
  }
  .annotation-popover-ref-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    margin-top: 0.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
  }
  .annotation-popover-ref-link:hover {
    color: var(--text);
  }
  .annotation-arrow {
    font-size: 0.8rem;
    transition: transform 0.15s ease;
    display: inline-block;
  }
  .annotation-popover-ref-link:hover .annotation-arrow {
    transform: translateX(2px);
  }

  .annotation-popover-link-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    color: var(--text-faint);
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .annotation-popover-link-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.15rem;
    line-height: 1.35;
  }
  .annotation-popover-link-source {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.6rem;
    color: var(--teal);
    letter-spacing: 0.03em;
    margin-bottom: 0.5rem;
  }
  .annotation-popover-link-summary {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--text-mid);
    line-height: 1.45;
  }
  .annotation-popover-link-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--teal);
    margin-top: 0.6rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
  }

  @media (prefers-reduced-motion: reduce) {
    .annotation-trigger {
      transition: none;
    }
    .annotation-arrow {
      transition: none;
    }
  }
`;
