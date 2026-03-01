import { type ReactNode, useState } from "react";
import { tokens } from "./tokens";
import { useInView } from "./useInView";

interface PullQuoteProps {
  children: ReactNode;
  slug?: string;
  quoteIndex?: number;
}

function XIcon({ hovered }: { hovered: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={hovered ? tokens.accent : tokens.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 0.2s ease" }}
    >
      <path d="M4 4l6.5 8L4 20h2.5l5-6.2L16.5 20H20l-6.5-8L20 4h-2.5l-5 6.2L7.5 4H4z" />
    </svg>
  );
}

function LinkIcon({ hovered }: { hovered: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={hovered ? tokens.accent : tokens.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 0.2s ease" }}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function LinkedInIcon({ hovered }: { hovered: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={hovered ? tokens.accent : tokens.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 0.2s ease" }}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function EmailIcon({ hovered }: { hovered: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={hovered ? tokens.accent : tokens.textMuted}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: "stroke 0.2s ease" }}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tokens.accent}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function PullQuote({ children, slug, quoteIndex }: PullQuoteProps) {
  const [ref, inView] = useInView(0.3);
  const [xHovered, setXHovered] = useState(false);
  const [linkedInHovered, setLinkedInHovered] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasShareData = slug && quoteIndex;
  const shareUrl = hasShareData
    ? `https://thbrdy.dev/writing/${slug}/quote/${quoteIndex}/`
    : '';

  function handleTweet() {
    if (!hasShareData) return;
    const el = ref.current;
    const quoteText = el?.querySelector('.pq-text')?.textContent?.trim() ?? '';
    const tweetUrl = `https://twitter.com/intent/tweet?${new URLSearchParams({
      text: `"${quoteText}"`,
      url: shareUrl,
    }).toString()}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }

  function handleLinkedIn() {
    if (!shareUrl) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: shareUrl })}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  function handleEmail() {
    if (!hasShareData) return;
    const el = ref.current;
    const quoteText = el?.querySelector('.pq-text')?.textContent?.trim() ?? '';
    window.location.href = `mailto:?subject=${encodeURIComponent(`"${quoteText}"`)}&body=${encodeURIComponent(`"${quoteText}"\n\n${shareUrl}`)}`;
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

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
        className="pq-text"
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
      {hasShareData && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={handleTweet}
            onMouseEnter={() => setXHovered(true)}
            onMouseLeave={() => setXHovered(false)}
            title="Share on X"
            aria-label="Share on X"
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            <XIcon hovered={xHovered} />
          </button>
          <span style={{ color: tokens.border, fontSize: "12px", lineHeight: 1 }}>&middot;</span>
          <button
            onClick={handleLinkedIn}
            onMouseEnter={() => setLinkedInHovered(true)}
            onMouseLeave={() => setLinkedInHovered(false)}
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            <LinkedInIcon hovered={linkedInHovered} />
          </button>
          <span style={{ color: tokens.border, fontSize: "12px", lineHeight: 1 }}>&middot;</span>
          <button
            onClick={handleEmail}
            onMouseEnter={() => setEmailHovered(true)}
            onMouseLeave={() => setEmailHovered(false)}
            title="Share via email"
            aria-label="Share via email"
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            <EmailIcon hovered={emailHovered} />
          </button>
          <span style={{ color: tokens.border, fontSize: "12px", lineHeight: 1 }}>&middot;</span>
          <button
            onClick={handleCopy}
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
            title={copied ? "Copied!" : "Copy link"}
            aria-label={copied ? "Link copied" : "Copy share link"}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            {copied ? <CheckIcon /> : <LinkIcon hovered={linkHovered} />}
          </button>
        </div>
      )}
    </div>
  );
}
