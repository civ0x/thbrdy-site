# Session Prompt: Editorial Pass — notice.mdx

## Situation

The Notice essay ("You're Already Feeling Something You Haven't Noticed Yet," 2026-02-21) describes the design hypothesis, build process, and architecture for the Notice app. Voice is strong in the middle and end sections but softer in the opening. Several hedging tics and one structural redundancy to address.

## Mission

Tighten the opening to match the directness of the later sections. Strip hedging tics. Remove process theater. Add bridge between architecture and "Honest Limits" sections.

## File

`src/content/writing/notice.mdx`

## Specific Edits

### AI Tic Removal

1. **"This isn't a failure of attention. It's the normal human condition."** — Throat-clearing after the interoception research claim. Delete both sentences. The Craig research stands alone.

2. **"This creates a gap between three existing product categories."** — Borderline marketese. Replace: "But existing products splinter what should be integrated."

3. **"For me personally, the thing that cracked this open was a jhana retreat."** — "For me personally" is redundant. "The thing that cracked this open" is soft. Tighten: "A jhana retreat cracked this open."

4. **"I want to be clear about something: I wasn't building for a market."** — Defensive phrasing. "I want to be clear" is hedging. Replace: "I built this for myself, not for a market."

5. **"The build was iterative loops of research, design, build, ship, learn, repeat."** — Process theater. Delete entirely. The three loops that follow contain all the substance.

6. **"These aren't documentation for documentation's sake."** — Defending documentation instead of asserting its instrumentality. Lead with the claim: "They were prompt engineering artifacts — more consequential than any code the agent produced."

7. **"The agent doesn't replace product thinking. It removes the bottleneck between product thinking and shipped code."** — The first sentence is defensive qualification. Lead with the strong claim (second sentence).

8. **"Over time, that feedback loop trains calibration between felt sense and physiology."** — Abstract. Simplify: "Over time, you learn to trust your own reads."

9. **"This is an instance of a deeper principle: all experience is frame-dependent..."** — "This is an instance of a deeper principle" is throat-clearing. Integrate the frame-dependency idea into the Barrett theory sentence without the meta-commentary.

10. **"The hypothesis is testable but unproven."** — "But unproven" is unnecessary hedging after "I don't know if this will work." Reorder: "The hypothesis is testable. I don't know the answer yet."

11. **"most people are surprisingly poor"** — "Surprisingly" is filler. Cut it: "most people are poor at reading their own physiological signals in real time."

### Structural Fixes

1. **Bridge between architecture and "Honest Limits"** — The transition from the architecture section to "I don't know if this will work" is abrupt. Add a bridging sentence: "The architecture is solid. What I can't know is whether the interaction trains the capacity."

2. **Barrett/frame-dependency section** — The core insight (constructed emotion theory) is buried mid-paragraph. Break it out before the NoticeInteractionFlow diagram. Lead with the theory, then show the interaction.

## Constraints

- Do not modify any React island component files
- Do not change frontmatter date
- Preserve all import statements and component placements
- Run `npm run build` after edits to verify clean build

## Verification

- [ ] All 11 tic passages above have been addressed
- [ ] Bridge sentence between architecture and "Honest Limits" added
- [ ] Barrett theory section repositioned or clarified
- [ ] Opening paragraphs match the directness of Sections 4–6
- [ ] `npm run build` passes clean
