import { type ReactNode } from "react";
import { tokens } from "./tokens";
import { useInView } from "./useInView";

interface TweetCardProps {
  author: string;
  handle: string;
  date: string;
  url: string;
  verified?: boolean;
  orgBadge?: string;
  children: ReactNode;
}

function VerifiedIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={tokens.blue}
      style={{ marginLeft: "4px", flexShrink: 0 }}
    >
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75S9.33 2.63 8.66 3.94c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}

export function TweetCard({
  author,
  handle,
  date,
  url,
  verified = false,
  orgBadge,
  children,
}: TweetCardProps) {
  const [ref, inView] = useInView(0.15);

  return (
    <div ref={ref} className="tweet-card-root">
      <style>{`
        .tweet-card-container {
          max-width: 540px;
          margin: 2rem auto;
          padding: 1.5rem 1.75rem;
          background: ${tokens.bgWarm};
          border: 1px solid ${tokens.borderMid};
          border-left: 3px solid ${tokens.borderMid};
          border-radius: 6px;
        }
        .tweet-card-body {
          font-family: ${tokens.serif};
          font-size: 1.05rem;
          line-height: 1.55;
          color: ${tokens.text};
          margin: 0;
        }
        .tweet-card-attribution {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 1rem;
          line-height: 1;
        }
        .tweet-card-author {
          font-family: ${tokens.sans};
          font-size: 0.8rem;
          font-weight: 600;
          color: ${tokens.textMid};
        }
        .tweet-card-badge {
          font-family: ${tokens.sans};
          font-size: 0.6rem;
          font-weight: 500;
          padding: 1px 6px;
          border-radius: 3px;
          background: ${tokens.accentDim};
          color: ${tokens.accent};
          margin-left: 6px;
        }
        .tweet-card-sep {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
          margin: 0 6px;
        }
        .tweet-card-handle,
        .tweet-card-date {
          font-family: ${tokens.mono};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
        }
        .tweet-card-link {
          font-family: ${tokens.mono};
          font-size: 0.6rem;
          color: ${tokens.textMuted};
          text-decoration: none;
          margin-left: auto;
          padding-left: 12px;
          white-space: nowrap;
        }
        .tweet-card-link:hover {
          color: ${tokens.accent};
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .tweet-card-container {
            padding: 1.25rem 1.5rem;
          }
        }
        @media (max-width: 420px) {
          .tweet-card-container {
            padding: 1rem 1.25rem;
          }
          .tweet-card-body {
            font-size: 0.95rem;
          }
          .tweet-card-link {
            margin-left: 0;
            padding-left: 0;
            margin-top: 6px;
            width: 100%;
          }
        }
      `}</style>
      <div
        className="tweet-card-container"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="tweet-card-body">{children}</div>
        <div className="tweet-card-attribution">
          <span className="tweet-card-author">{author}</span>
          {verified && <VerifiedIcon />}
          {orgBadge && <span className="tweet-card-badge">{orgBadge}</span>}
          <span className="tweet-card-sep">&middot;</span>
          <span className="tweet-card-handle">@{handle}</span>
          <span className="tweet-card-sep">&middot;</span>
          <span className="tweet-card-date">{date}</span>
          <a
            className="tweet-card-link"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View original
          </a>
        </div>
      </div>
    </div>
  );
}
