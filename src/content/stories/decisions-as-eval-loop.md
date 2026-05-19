---
project: thbrdy-dev
shape: outcome-reframe
agentRelevance: agent
tagline: "DECISIONS.md as the agent's eval loop, not documentation"
questions:
  - "How do you think about evaluation for agent workflows that don't have clean ground truth?"
  - "What's something in your engineering process other people don't do?"
  - "How do you prevent agent-mediated work from quietly contradicting itself over time?"
handles:
  - "I treat `DECISIONS.md` as the project's eval loop. Every entry is numbered, dated, grep-able. Supersession is explicit."
  - "The thing most agent workflows are missing isn't better prompts — it's a typed decision log the next prompt can quote."
  - "When an executing agent's output would contradict an earlier choice, the failure shouldn't be silent. The fix is structural: make supersession the only way to override."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"Most ADR logs get treated as documentation hygiene — future-you will thank present-you, often skipped, often rotted. On this project I started a numbered `DECISIONS.md` early. Twenty-seven entries so far, each with date, decision, rationale, constraint, and (where relevant) alternatives-considered and supersedes. I thought I was being diligent. What I noticed about a month in is that the file isn't documentation. It's the typed input surface the next agent session quotes against. When supersession is forced explicit, drift becomes a chain instead of a quiet override — and the chain is what you can actually reason about."

## Punchline

The standard framing is "keep an ADR log so you don't lose context." The actual job is to give the next agent invocation a *typed* surface to reason against — so when it would contradict an earlier decision, the supersession is forced visible.

## Arc beats

- Field framing: ADR logs are documentation hygiene. Treated as overhead. Often skipped or rotted.
- Actual outcome here: in agent-mediated work, `DECISIONS.md` is the typed input surface for the next session prompt. Twenty-seven numbered entries. Numbering and structure make it grep-able, diff-able, and *quotable* from inside a new session prompt.
- Reframe move: this is an *eval loop*, not documentation. When an executing agent ships something that contradicts an earlier decision, the supersession is forced explicit. Drift becomes visible as a chain, not a quiet override.
- Concrete chain (Story 5): #020 → #021 (per-quote OG meta-refresh → JS redirect, both 2026-02-25 — same week supersession because Twitterbot followed the meta refresh and read the wrong tags).
- Concrete graduation (Story 3): #015 (the decision) → `CLAUDE.md` Island Architecture rule (the standing instruction the agent reads on every session) → `CLAUDE.md` Corrections Log entry (the dated learning event).
- Two-tier codification: per-decision context lives in the DECISIONS entry. Reusable rules graduate into `CLAUDE.md`, the agent's standing orders. The Corrections Log is the loop's output — observed agent failure → codified rule that prevents recurrence.
- Lesson: in workflows where the executor is an agent (or future-you with cache misses), the ADR log is a load-bearing component of the harness, not paperwork. Without one, the agent reinvents — or worse, silently contradicts — earlier decisions every session.

## Verify

- [VERIFY] `DECISIONS.md` — confirmed 27 entries; numbering runs through 026 with one out-of-sequence `## 016` entry from 2026-02-24 (Diagram popover) appearing alongside the original #016 (VoDCaseComparison) — minor numbering hiccup to be ready to acknowledge if asked.
- [VERIFY] Field schema: date and rationale present on every entry; constraint and alternatives-considered present on roughly half. Honest framing if pressed: "the schema is normative, not enforced — discipline is in additions, not audit."
- [VERIFY] Supersession chain #020 → #021 — confirmed (both 2026-02-25, JS redirect replaces meta refresh).
- [VERIFY] Graduation pattern #015 → `CLAUDE.md` — confirmed: Decision #015 (2026-02-23) → Island Architecture / Rules paragraph on `<p>` vs. `<div>` → Corrections Log entry 2026-02-23.
- [CONJECTURE] that the two-tier codification is *deliberately designed* vs. emergent — phrasing in the answer should reflect: "I started doing this and noticed it was working; I'd codify it as a workflow if I were doing it again from day one."
