# Session Prompt: VoD Essay — MDX Conversion & Build

## Situation

Six island components for "The Valley of Death Is a Legibility Problem" are built in `src/components/islands/VoD*.tsx`. The essay draft is at `working/vod-essay/valley-of-death-v2.md` with HTML comment markers showing where each diagram, SectionDivider, and PullQuote goes.

This session converts the draft into a live MDX essay and verifies the build.

## Mission

1. Create `src/content/writing/valley-of-death.mdx` — the essay in MDX format with all island imports and inline components.
2. Run `npm run build` and fix any errors until the build is clean.
3. Verify the essay appears at `/writing/valley-of-death/` in the writing index.

## Reference: Existing MDX Pattern

Follow the exact pattern from `src/content/writing/learned-compilation.mdx`:

```mdx
---
title: "..."
description: "..."
date: 2026-02-23
tags: [...]
connected_project: "Pando"
---

import { SectionDivider } from '../../components/islands/shared/SectionDivider.tsx';
import { PullQuote } from '../../components/islands/shared/PullQuote.tsx';
import VoDLegibilityGap from '../../components/islands/VoDLegibilityGap.tsx';
...etc

Prose text here.

<SectionDivider number="01" label="The Standard Diagnosis" client:visible />

## Section heading

More prose.

<VoDLegibilityGap client:visible />

More prose.
```

Key rules:
- Frontmatter YAML block at top with `---` delimiters.
- Imports immediately after frontmatter (no blank line between frontmatter and imports is fine — match existing files).
- Components used inline with `client:visible` directive.
- **Named exports** (SectionDivider, PullQuote) use curly brace imports.
- **Default exports** (all six VoD islands) use plain imports.
- No `client:load` — all components use `client:visible`.

## Frontmatter

```yaml
---
title: "The Valley of Death Is a Legibility Problem"
description: "The gap between research and product isn't a funding problem, a talent problem, or a culture problem. It's a structural failure: coupled questions answered sequentially, through frameworks that make the most important information disappear."
date: 2026-02-23
tags: ["Technology Transfer", "Product Strategy", "Organizational Design", "AI Infrastructure"]
connected_project: "Pando"
---
```

## Imports

```mdx
import { SectionDivider } from '../../components/islands/shared/SectionDivider.tsx';
import { PullQuote } from '../../components/islands/shared/PullQuote.tsx';
import VoDLegibilityGap from '../../components/islands/VoDLegibilityGap.tsx';
import VoDSequentialFunnel from '../../components/islands/VoDSequentialFunnel.tsx';
import VoDMaturitySwitch from '../../components/islands/VoDMaturitySwitch.tsx';
import VoDCouplingMechanism from '../../components/islands/VoDCouplingMechanism.tsx';
import VoDCaseComparison from '../../components/islands/VoDCaseComparison.tsx';
import VoDTradingZone from '../../components/islands/VoDTradingZone.tsx';
```

## Conversion Instructions

Read `working/vod-essay/valley-of-death-v2.md` and convert it to MDX by:

1. **Replace HTML comment markers with actual components.** The draft has markers like:
   - `<!-- DIAGRAM: VoDLegibilityGap -->` → `<VoDLegibilityGap client:visible />`
   - `<!-- SectionDivider number="01" label="The Standard Diagnosis" -->` → `<SectionDivider number="01" label="The Standard Diagnosis" client:visible />`
   - `<!-- PullQuote: "..." -->` → `<PullQuote client:visible>...</PullQuote>`

2. **Strip HTML comment blocks** that contain diagram specs (the multi-line `<!-- ... -->` blocks describing layout). Those specs are now implemented in the `.tsx` files — the comments are no longer needed.

3. **Preserve all prose exactly.** Do not edit, rephrase, reorder, or "improve" any of the essay text. Every word stays as-is. The only changes are: adding frontmatter, adding imports, and replacing HTML comments with components.

4. **Strip the draft header.** Remove the `# The Valley of Death Is a Legibility Problem` h1 and the `**Draft v2 — February 2026**` line — the title comes from frontmatter and the layout renders it.

5. **Strip the frontmatter-like block** at the top of the draft (the `---` delimited block with title/description/tags that's currently inside the markdown body). Replace with the proper YAML frontmatter above.

6. **Keep the `## Sources and Evidence Notes` section** at the bottom. It should remain as regular markdown, no component wrapping.

7. **Horizontal rules** (`---`) between sections in the draft should be removed — the SectionDividers handle visual separation.

## Component Placement Map

Here's exactly where each component goes, keyed to the draft's HTML comments:

| Draft Marker | Component | Placement |
|---|---|---|
| `<!-- DIAGRAM: VoDLegibilityGap -->` (after intro paragraphs) | `<VoDLegibilityGap client:visible />` | After "The frameworks that make the portfolio manageable..." paragraph, before Section 01 |
| `<!-- SectionDivider number="01" ... -->` | `<SectionDivider number="01" label="The Standard Diagnosis" client:visible />` | Before "## Why the standard fixes don't work" |
| `<!-- DIAGRAM: VoDSequentialFunnel -->` | `<VoDSequentialFunnel client:visible />` | After "Cooper himself acknowledged..." paragraph, end of Section 01 |
| `<!-- SectionDivider number="02" ... -->` | `<SectionDivider number="02" label="Coupled Questions" client:visible />` | Before "## Sequential answers to coupled questions" |
| First `<!-- PullQuote -->` | `<PullQuote client:visible>The valley of death is not a gap between two stable entities. It's the information loss that occurs when coupled questions are answered sequentially.</PullQuote>` | After Chatterjee paragraph, end of Section 02 |
| `<!-- SectionDivider number="03" ... -->` | `<SectionDivider number="03" label="Two Failure Modes" client:visible />` | Before "## Premature legibility and the maturity problem" |
| `<!-- DIAGRAM: VoDMaturitySwitch -->` | `<VoDMaturitySwitch client:visible />` | After "The honest frame..." paragraph, before transition to Section 04 |
| `<!-- SectionDivider number="04" ... -->` | `<SectionDivider number="04" label="The Mechanism" client:visible />` | Before "## Trading zones and boundary objects" |
| `<!-- DIAGRAM: VoDCouplingMechanism -->` | `<VoDCouplingMechanism client:visible />` | After "Same document, different interpretations, productive coordination" paragraph |
| `<!-- SectionDivider number="05" ... -->` | `<SectionDivider number="05" label="Evidence" client:visible />` | Before "## Two cases, two domains, the same 6×" |
| Second `<!-- PullQuote -->` | `<PullQuote client:visible>The research, the engineers, and the budget were the same. What changed was the legibility of research value to the people who made product decisions.</PullQuote>` | After "What organizational design can't overcome..." paragraph |
| `<!-- DIAGRAM: VoDCaseComparison -->` | `<VoDCaseComparison client:visible />` | After the second PullQuote, before Section 06 |
| `<!-- SectionDivider number="06" ... -->` | `<SectionDivider number="06" label="The AI Lab Experiment" client:visible />` | Before "## What the current AI labs are testing" |
| `<!-- DIAGRAM: VoDTradingZone -->` | `<VoDTradingZone client:visible />` | After the Pasteur's Quadrant paragraph, end of Section 06 |
| `<!-- SectionDivider number="07" ... -->` | `<SectionDivider number="07" label="The Switching Point" client:visible />` | Before "## The hardest open question" |

## Verification Checklist

- [ ] `npm run build` — zero errors
- [ ] File is at `src/content/writing/valley-of-death.mdx`
- [ ] Frontmatter has all required fields (title, description, date, tags, connected_project)
- [ ] All 8 imports present (2 shared + 6 islands)
- [ ] All 6 diagram components placed with `client:visible`
- [ ] All 7 SectionDividers placed with correct numbers and labels
- [ ] Both PullQuotes placed with correct text
- [ ] No HTML comment markers remain in the file
- [ ] No `---` horizontal rules remain (SectionDividers replace them)
- [ ] All essay prose is preserved verbatim — no edits, no reordering
- [ ] The `## Sources and Evidence Notes` section is intact at the bottom
- [ ] The `## A note on what this is and isn't` section is intact
- [ ] No draft header (`# The Valley of Death...`, `**Draft v2**`) remains
