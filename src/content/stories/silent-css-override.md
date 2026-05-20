---
project: thbrdy-dev
shape: failure-mode
agentRelevance: agent
tagline: Silent CSS override that codified into a standing rule
questions:
  - "Tell me about a bug that didn't surface as an error."
  - "What's an example of an agent failing in a way you didn't see coming?"
  - "How does your feedback loop with agents actually close?"
handles:
  - "An agent-shipped change passed the build, looked correct in source, and had zero effect on the page. The diagnosis was at the CSS specificity layer; the fix included a Corrections Log entry."
  - "My feedback loop has a specific failure mode I care about: silent overrides. Loud errors get caught. Silent ones rot."
  - "I treat 'observed failure → codified rule' as the only way to keep the standing system prompt honest. If I learn something at session N, the agent at session N+1 has to be told."
---

## Project orientation

thbrdy.dev is my personal site — a static Astro app with React islands for the interactive essay diagrams. It deploys on Cloudflare Pages and auto-builds on push to main. The whole thing is built through an agent-driven workflow: I plan changes in one Cowork session, and an executing agent (a separate Claude Code session) reads three files and runs the change autonomously.

## Opener

"This is a small one but it taught me how the feedback loop with the agent actually closes. The agent shipped a change to an island called `VoDLegibilityGap` — a margin tweak on an annotation row, the kind of edit it had done correctly a dozen times. Build passed. DevTools showed the rule applied. Nothing changed on the page. No error. No warning. I dropped into specificity-debugging mode and found that `PostLayout.astro` applies a `:global(p)` selector to every paragraph inside essay content, and that selector outranks a bare class selector inside the island's injected `<style>` block. The island's margin was silently overridden by the layout's cross-cutting prose styling."

## Punchline

The agent-failure modes that codify well aren't the loud ones — they're the silent overrides where everything *looks* right and the system still misbehaves; the fix has to be technical *and* structural, so the next agent invocation can't make the same move.

## Arc beats

- Hypothesis: `VoDLegibilityGap`'s annotation row needed a custom bottom margin set via a class selector inside an injected `<style>` block — standard pattern across the island library.
- Outcome diverged: the margin had zero visible effect. DevTools showed both rules. The build passed. No error, no warning, no test caught it.
- Mechanism: `PostLayout.astro` applies `.post__content :global(p) { margin: 0 0 1.25rem }` to all paragraphs in essay content. Descendant + element selector outranks a bare class selector inside the island's injected `<style>`. The island's margin was silently overridden by the layout's cross-cutting prose styling.
- Adjustment, layer 1 (the fix): change the element from `<p>` to `<div>`. The `:global(p)` rule no longer matches. Specificity collision dissolved.
- Adjustment, layer 2 (the codification): `DECISIONS.md` #015 (decision-grade entry with rationale, 2026-02-23), `CLAUDE.md` Island Architecture / Rules paragraph (the standing instruction the agent reads inline with the rest of the island conventions on every session), `CLAUDE.md` Corrections Log entry dated 2026-02-23 (the dated learning event). Three places, three audiences — DECISIONS for context recovery, Island Architecture for the standing rule, Corrections Log for the dated learning event.
- Cost of three-place codification: every learning event has to land in three places, and the three audiences need different framings. If any one of the three falls behind, the codification rots and the same agent failure recurs the next time it has the latitude. The ceremony is real — three writes per learning — and the discipline is non-negotiable. Cheaper than the silent-override bug recurring; only because I keep the three in sync.
- Lesson: cross-cutting styles in an MDX render pipeline leak into hydrated islands invisibly. More generally, the agent failures that compound into codified rules aren't the loud ones — they're the silent ones where everything looks right and the system still misbehaves. The loop closes when the rule enters the standing system prompt.

## Verify

- [VERIFY] `DECISIONS.md` #015 — confirmed: dated 2026-02-23; rationale explicitly names `.post__content :global(p)` ... silently overriding component margins ... discovered when `VoDLegibilityGap`'s annotation margin had no visible effect despite correct CSS.
- [VERIFY] `CLAUDE.md` Island Architecture / Rules section — confirmed: the standing rule lives there, not in the "Common Mistakes — Do Not Repeat" list. "Three places, three audiences" framing reflects this.
- [VERIFY] `CLAUDE.md` "Corrections Log" — confirmed: single dated entry 2026-02-23 referencing `VoDLegibilityGap`, with the `<div>`-vs-`<p>` rule.
- [VERIFY] `src/components/islands/VoDLegibilityGap.tsx` — confirmed: the `vod-legibility-annotation` element at line ~348 is a `<div>`, consistent with the codified fix.
- [CONJECTURE] that the three-audience framing is post-hoc rationalization vs. designed — be ready to walk it back to "I noticed the structure after I did it" if pressed.
