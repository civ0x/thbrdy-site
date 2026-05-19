---
project: thbrdy-dev
shape: failure-mode
agentRelevance: agent
tagline: Same-week supersession at the Twitterbot boundary
questions:
  - "Tell me about a bug at the boundary of a system you don't control."
  - "Have you ever shipped a fix that worked locally and broke in production for a reason you didn't expect?"
  - "How do you debug something when the failure happens inside a third party's pipeline?"
handles:
  - "The bug was at a system I can't see — Twitterbot's HTML parser. Local checks passed. The card was wrong."
  - "The fix exploited the exact behavior that broke the original: crawlers don't execute JS. So a JS redirect serves crawlers the right OG tags and redirects humans cleanly."
  - "Same-week supersession in `DECISIONS.md`. #021 replaces #020. The chain is the artifact — the next agent session reading the file sees both, not just the working state."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"I built a per-essay OG image pipeline — every essay gets its own social card, and pull quotes get their own share cards too. Quote shares route through a lightweight static page at `/writing/[slug]/quote/[n]/` whose only job is to carry the quote-specific OG meta tags and then redirect to the parent essay. First version used `<meta http-equiv='refresh' content='0;url=...'>` — clean, no JS, semantic. It worked perfectly when I tested locally. When I posted a quote share to Twitter, the card showed the *parent essay's* OG image, not the quote's. Twitterbot was following the meta refresh, landing on the essay, and reading the essay's OG tags instead of stopping at the quote page."

## Punchline

Same-week supersession is a feature, not a failure — the fix design follows from how the failing system actually behaves, which often means inverting the assumption that helped you ship the first version.

## Arc beats

- Setup: `DECISIONS.md` #020 (2026-02-25). Pipeline extends a single default OG image to per-essay and per-pull-quote images, generated at build time via SVG templates → `@resvg/resvg-js`. Quote shares get static pages with quote-specific OG meta + redirect to the parent essay. Build-time generation rather than Cloudflare Workers (Workers had WASM/font-format friction; static site has stable content).
- Hypothesis: `<meta http-equiv='refresh' content='0;url=...'>` was the right redirect mechanism — no JS, crawler-readable HTML, fast for humans.
- Outcome diverged: Twitterbot followed the meta refresh and read the parent essay's OG tags instead of the quote page's. Real browsers got the right redirect behavior; the crawler got the wrong card.
- Mechanism: Twitterbot honors meta refresh as a navigation hint. It does *not* execute JavaScript. The two behaviors diverge cleanly: a JS redirect serves OG tags to the crawler (which doesn't run the JS) and redirects the human (whose browser does run the JS).
- Adjustment, same week: `DECISIONS.md` #021 (2026-02-25) — replace `<meta http-equiv='refresh'>` with `<script define:vars>window.location.replace(redirectUrl)</script>`. Use `replace()` not `.href` to avoid creating a history entry, matching the original meta refresh UX. Add `<meta name="twitter:site" content="@thbrdy" />` to `Base.astro` to associate all cards with the account.
- Alternatives considered, recorded in #021: Cloudflare Workers redirect (adds runtime infrastructure to a static site); canonical URL hints (Twitter doesn't reliably respect canonical for OG resolution); removing the redirect (breaks the UX — users would land on a sparse quote page instead of the essay).
- Lesson: at third-party boundaries, the right primitive is whatever inverts the assumption your local tests confirmed. The supersession entry (#021 supersedes #020's redirect mechanism in the same week) is the artifact that lets the next agent session see the chain instead of seeing only the working state.

## Verify

- [VERIFY] `DECISIONS.md` #020 — confirmed: per-essay OG and pull-quote share cards, dated 2026-02-25; key choice "Separate static pages for quote share URLs (/writing/[slug]/quote/[n]/) over query params."
- [VERIFY] `DECISIONS.md` #021 — confirmed: dated 2026-02-25, supersession of the meta-refresh design from #020. Rationale names Twitterbot's meta-refresh-following behavior explicitly.
- [VERIFY] The JS redirect implementation — `<script define:vars>window.location.replace(redirectUrl)</script>` — confirmed in #021 text.
- [VERIFY] `<meta name="twitter:site" content="@thbrdy" />` in `Base.astro` — confirmed at line 51.
- [VERIFY] Quote share page route — confirmed: `src/pages/writing/[slug]/quote/[n].astro` exists; it contains the `define:vars` JS redirect.
