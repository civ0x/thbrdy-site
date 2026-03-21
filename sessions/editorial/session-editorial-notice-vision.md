# Session Prompt: Editorial Pass — notice-vision.mdx (DRAFT)

## Situation

The Notice vision page ("The Body Knows First," 2026-02-27) is a draft (`draft: true`) that's 80% publication-ready. The content is honest and architecturally sound, but it has hedging tics, two redundant passages, two abrupt transitions, and timeline references that may be stale. This session should prepare it for publication.

## Mission

Strip hedging, collapse redundancy, smooth transitions, verify timeline currency, and set `draft: false` if all checks pass.

## File

`src/content/writing/notice-vision.mdx`

## Specific Edits

### AI Tic Removal

1. **Blockquote at line ~39** — "The most valuable structures in our lives — emotional patterns, somatic intelligence, relational dynamics — are invisible until something makes them navigable." This reads like repackaged wisdom. It's your thesis — own it directly in prose, not as a blockquote. Remove the blockquote formatting and integrate into the surrounding paragraph, or delete entirely (the concrete version later in the essay is stronger).

2. **"a small act of witnessing"** — Affectation. Replace with: "a brief acknowledgment" or "a confirmation that the moment was captured."

3. **"As far as I can tell, no one else is measuring it"** (re: interoceptive lead time) — Hedging. Either you know this or you don't. State it: "No one else is measuring interoceptive lead time."

4. **"This is a genuine commercial bet"** — Softens the claim that follows. Delete this sentence and lead directly with: "The value of Notice is not in the screen time it captures. It is in the capacity it builds."

5. **"Notice's trajectory follows a natural widening of the aperture of awareness — mirroring the developmental arc of contemplative practice itself."** — "Natural widening" and "mirroring the arc" are close to cliché. Replace with specifics: "The product expands from interoceptive awareness (self) → co-regulation (dyadic) → collective field awareness (group)."

### Redundancy

1. **Affect labeling explained twice** — Once in the product section ("not advice, not diagnosis, a mirror") and again in the science section with Barrett's emotional granularity. The first is better (grounded in the product). Merge: keep the product version, fold in the Barrett reference, cut the redundant second explanation.

2. **Interoceptive lead time introduced twice** — Once in the science section, then repeated near-verbatim in the timeline. Introduce once, reference as "the lead time metric" subsequently.

### Transition Gaps

1. **Section 2 → Section 3** — Hard cut with no bridge. Add: "This architecture is not theoretical. Notice is shipping now."

2. **Section 6 → Section 7** — Abrupt jump from scaffolding decay to on-device future. Add: "But the path to zero data leakage requires moving the entire reflection engine to the phone."

### Structural Compression

1. **Relational attunement research staging** — The Phase 0/1/2/3 breakdown is detailed but reads like hedging in a vision document. Compress to 3 sentences + 1 reference to the full research doc.

### Timeline Verification

**CRITICAL:** Check the operational timeline (Appendix D, Week 1/2/3+ plan from late February). What's the current status?
- If milestones are stale, add a date marker: "Operational plan from 2026-02-27"
- If milestones have shipped, reflect that
- If we're still executing, they're current — leave as-is

Also verify:
- Pricing ($80/year Core, $149–199 Full) — still current?
- "Notice is in active beta — try it now" — still accurate?

### Appendix Voice

The appendices lose the essay's directness and become checklist-heavy. Add a principle-first opening sentence to each:
- Pricing: "Pricing anchored against biometric wearables, not meditation apps."
- GTM: "The channel is the community, not the App Store."
- Technical: "The on-device path requires three architectural decisions."
- Timeline: "Three weeks, each gated by the previous."
- App Store: "ASO is the only discovery channel that doesn't require paid acquisition."

### Publication Gate

If all edits are complete and timeline is verified current:
- Change `draft: true` to `draft: false` in frontmatter
- Verify the essay appears on the `/writing` index
- Verify the `/notice/` route still works (it's a dedicated page, not under `/writing/`)

## Constraints

- Do not modify any React island component files
- Preserve all import statements and component placements
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] Five hedging passages addressed
- [ ] Two redundancies collapsed
- [ ] Two transition bridges added
- [ ] Relational attunement staging compressed
- [ ] Timeline verified and updated if needed
- [ ] Appendix opening sentences added
- [ ] `draft: false` set (if all checks pass)
- [ ] `npm run build` passes clean
- [ ] `/notice/` route renders correctly
