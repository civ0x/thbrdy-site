# Session 3: Learned Compilation Essay Islands

## Situation

The Learned Compilation essay MDX has prose migrated and live at `/writing/learned-compilation/`. Five interactive component positions are marked with TODO comments. All five have reference implementations in `reference/learned-compilation-essay.jsx`.

Sessions 1–2 established the conventions. Session 1 (AB essay) set the responsive pattern: injected `<style>` tags with scoped class names (CLAUDE.md under "Island Architecture > Responsive Pattern" and DECISIONS.md #006). Session 2 (Notice essay) refined the icon replacement strategy and proved out complex interactive components (hover states, timer-driven sequencing).

Session 0 infrastructure:
- `src/components/islands/shared/` has `tokens.ts`, `useInView.ts`, `SectionDivider.tsx`, `PullQuote.tsx`
- Convention: essay-specific islands use `LC[ComponentName].tsx`
- Default hydration: `client:visible`

## Mission

Port five interactive components from `reference/learned-compilation-essay.jsx` into typed Astro islands, integrate them into the existing MDX at their correct positions, add SectionDividers and PullQuote, and verify the build.

## Project-specific accent color

The LC essay uses a **steel blue accent** (`#3A7CA5`) from the reference, NOT the site's default gold. This gives the essay its own visual identity, same way Notice uses purple for its project-specific elements. The steel blue and its derived values live as **local constants inside each component** — they do not go into `tokens.ts` or `global.css`.

Derived accent values used across the reference:
```
lcAccent: "#3A7CA5"       // Primary steel blue
lcAccentDark: "#2C6080"   // Darker variant
lcAccentLight: "#3A7CA515" // 8% opacity background tint
lcAccentMid: "#3A7CA540"  // 25% opacity
```

For the four decision-space colors in the coupling diagram and evidence grid, use the **site's semantic tokens** — they exist for exactly this purpose:
- `tokens.blue` / `var(--blue)` → Operator Fusion (was `#3A7CA5` in reference)
- `tokens.green` / `var(--green)` → Rematerialization (was `#5B8A72` in reference)
- `tokens.teal` / `var(--teal)` → Parallelism Strategy (was `#7C6F9B` purple in reference — teal is a better fit for the site palette)
- `tokens.red` / `var(--red)` → Numerical Precision (was `#C4713B` warm in reference — the red token is the closest warm/warning tone in the palette)

If these mappings feel wrong visually once implemented, flag it rather than adding new tokens. The principle: use semantic tokens where they fit, keep essay-specific accents local.

## Technical notes

**Lucide-react icons must be replaced with inline SVGs.**

The reference imports: `Cpu`, `GitBranch`, `Layers`, `Zap`, `ArrowRight`, `Target`, `X`, `Check`, `AlertTriangle`, `Maximize2`, `Binary`, `Network`, `Gauge`, `FlaskConical`, `ChevronRight`, `Minus`. Per CLAUDE.md: "No icon libraries — build icons from HTML/CSS/SVG inline."

Same strategy as Session 2: each `<IconName size={N} color={C} strokeWidth={W} />` becomes an inline `<svg>` with matching visual. Consider a local `icons` object within components that reuse the same icon. Lucide icons are 24×24 viewBox, stroke-based, `stroke-linecap="round"` and `stroke-linejoin="round"`.

**Two components use `useState` beyond scroll triggering.**

- `CouplingDiagram` has `hoveredPair` state for hover-highlighting coupling lines and showing evidence detail. Desktop interaction; inert on touch.
- `LandscapeQuadrant` has `hovered` state for system dot hover details. Same pattern.
- `NestedClaimsFlow` has timer-driven `activeStep` state (same pattern as NoticeInteractionFlow from Session 2).

**No ensō header or special project treatment for this essay.** The ensō above the title in PostLayout.astro is conditional on `connected_project === "Notice"`. LC renders with the standard PostLayout header.

## Components to port

### 1. LCCouplingDiagram.tsx
**Source:** `reference/learned-compilation-essay.jsx` lines 104–325
**What it does:** A diamond-layout SVG diagram showing four decision spaces (Fusion, Rematerialization, Parallelism, Precision) as nodes at cardinal positions, with six coupling lines between them. Line width encodes coupling strength. A center label reads "Sequential pipeline." Below the diamond: a hover-detail panel showing the evidence for whichever coupling line the user hovers.
**Interactivity:** Scroll-triggered fade-in via `useInView`. Nodes and lines stagger in. `useState(hoveredPair)` for coupling line hover → updates detail panel. Invisible wider hitbox lines for easier hover targeting.
**Porting notes:**
- Replace `Layers`, `GitBranch`, `Network`, `Binary` icons with inline SVGs inside the node squares
- The diamond layout uses absolute positioning with percentage coordinates inside an aspect-ratio: 1 container. The SVG coupling lines use a 0–100 viewBox matching those percentages. This is well-structured and should port cleanly
- At narrow widths (≤420px), the node labels may clip. Consider scaling down the node squares and font sizes, or shifting to a tighter diamond. The description text below each icon may need to be hidden on mobile
- The dashed lines for weak coupling (`strokeDasharray`) and the strength-based line widths are nice details — preserve them
- The hover detail panel below the diamond should show a "Hover a coupling line to see the evidence" placeholder when nothing is hovered

### 2. LCLandscapeQuadrant.tsx
**Source:** `reference/learned-compilation-essay.jsx` lines 328–505
**What it does:** A scatter plot on a 2D field. X-axis: "Decision spaces coupled" (1→4). Y-axis: "Optimization approach" (Heuristic→Learned). Seven system dots positioned by coordinates, each with a label and sub-label. A dashed "target zone" rectangle in the upper-right quadrant. Quadrant dividers (light lines). Hover a dot to see description in a detail panel below.
**Interactivity:** Scroll-triggered fade-in. System dots stagger in. `useState(hovered)` for dot hover → detail panel.
**Porting notes:**
- No lucide icons in the dots themselves — just colored circles. The reference doesn't use icons in this component's dots
- The field uses `aspectRatio: "4/3"` with absolute positioning for dots. Coordinates are percentages, so responsive scaling is inherent. But label overlap becomes a problem at narrow widths — some labels may need to reflow or shrink
- The "Joint Planner (Proposed)" dot is visually differentiated: larger, with a ring border and bold label. Preserve this
- Color mapping: gray dots for production compilers (XLA, torch.compile), purple for research systems (Alpa, Unity), green for learned approaches (GO, MLGO), steel blue for the proposed planner. Use the semantic tokens where they map: `tokens.teal` for the research cluster (Alpa/Unity), `tokens.green` for learned (GO/MLGO), and the local LC accent for the proposed planner
- Axis label positioning: the rotated Y-axis label is fragile on narrow screens. Consider hiding the rotated label on mobile and using a horizontal label above the chart instead

### 3. LCNestedClaimsFlow.tsx
**Source:** `reference/learned-compilation-essay.jsx` lines 508–703
**What it does:** Three sequential claim cards (Coupling → Learnability → Hardware Generalization) connected by chevron connectors. Each card has: a numbered badge, a claim label, an evidence-strength badge (Strong/Indirect/Thin with color coding), a question in serif, and a 2-column grid with "Kill if" and "Cheapest test" sub-cards.
**Interactivity:** Scroll-triggered via `useInView`, then timer-driven sequential reveal via `useState(activeStep)`. Cards animate in one at a time with 600ms intervals. Connectors fade in between activations.
**Porting notes:**
- Replace `X`, `FlaskConical`, `ChevronRight` icons with inline SVGs. The X icon appears in every "Kill if" sub-card (3×), and FlaskConical in every "Cheapest test" sub-card (3×) — define these once as local constants
- The timer pattern is identical to NoticeInteractionFlow: `useEffect` fires on `inView`, sets up 3 staggered `setTimeout` calls, cleans up on unmount. Port the same way
- The 2-column "Kill if / Cheapest test" grid should stack to 1-column on mobile (≤420px)
- Evidence badge colors: Strong uses green (`tokens.green`), Indirect uses warm/orange (the reference uses `C.warm` — map to the LC accent or `tokens.red`), Thin uses red (`#C0392B` — keep as local constant, it's a one-off semantic color for "danger/thin evidence")
- Card border color shifts to the claim's color when active — this is a subtle detail that adds visual hierarchy. Preserve it

### 4. LCEvidenceGrid.tsx
**Source:** `reference/learned-compilation-essay.jsx` lines 706–830
**What it does:** A data table with 10 papers as rows × 3 claim columns (Coupling, Learnability, HW Transfer). Evidence strength shown as colored square pips (1–3 pips). A legend row below the table. Column headers use the three claim colors.
**Interactivity:** Scroll-triggered fade-in. Rows stagger in with 50ms delay each. No hover state.
**Porting notes:**
- Replace the `Minus` icon (used for "no evidence" cells) with an inline SVG dash
- The 4-column grid (`2fr 1fr 1fr 1fr`) works at desktop but will be tight on mobile. The "Source" column has paper names + venue text that won't compress well. Options: (a) horizontal scroll on the table at narrow widths, (b) convert to a card-per-row layout on mobile, (c) truncate paper names. Option (a) is simplest and most honest — data tables are inherently wide. Wrap in an `overflow-x: auto` container with a subtle "scroll →" indicator on mobile
- The alternating row backgrounds (white/warm) are a nice touch — preserve them
- Strength pip colors: 1 pip = textMuted (indirect), 2 pips = warm (moderate), 3 pips = green (strong). Map: textMuted → `tokens.textMuted`, warm → `tokens.red` or the LC accent, green → `tokens.green`
- Column header colors: Coupling → LC accent, Learnability → teal, HW Transfer → green. Keep consistent with the NestedClaimsFlow card colors

### 5. LCStrategicImplications.tsx
**Source:** `reference/learned-compilation-essay.jsx` lines 833–929
**What it does:** A 3-column card grid. Each card has: an icon in a rounded square, a title, a description in serif, and a "Contingent on Claim 3" status tag in warm/orange.
**Interactivity:** Scroll-triggered fade-in with staggered timing per card. No hover state.
**Porting notes:**
- Replace `Maximize2`, `Cpu`, `Gauge` icons with inline SVGs
- The 3-column grid should stack to 1 column on mobile (≤640px). This is a standard responsive pattern — same as the homepage project cards
- The status tag ("Contingent on Claim 3") uses warm/orange color. Map to `tokens.red` or keep as local warm constant
- This is the simplest component of the five. Build it last as a warm-down

## Integration into MDX

Replace the five TODO comments in `learned-compilation.mdx` with the ported components. Also add:

**SectionDividers** — The reference has six sections (01 The Problem, 02 The Landscape, 03 Validation, 04 Evidence, 05 Stakes, 06 Positioning). The MDX currently has `---` horizontal rules between sections. Replace each `---` + `## heading` pair with:
```mdx
<SectionDivider number="0N" label="Label" client:visible />
```
followed by the heading as a regular `## Heading`.

**PullQuote** — The reference places a pull quote between sections 02 and 03:
> "Every organization running large-scale training is leaving 15–30% of achievable throughput unrealized due to a compiler architecture decision, not hardware limitations."

Add this as:
```mdx
<PullQuote client:visible>
Every organization running large-scale training is leaving 15–30% of achievable throughput unrealized due to a compiler architecture decision, not hardware limitations.
</PullQuote>
```

**Import block** at the top of the MDX (after frontmatter):
```mdx
import SectionDivider from '../../components/islands/shared/SectionDivider.tsx';
import PullQuote from '../../components/islands/shared/PullQuote.tsx';
import LCCouplingDiagram from '../../components/islands/LCCouplingDiagram.tsx';
import LCLandscapeQuadrant from '../../components/islands/LCLandscapeQuadrant.tsx';
import LCNestedClaimsFlow from '../../components/islands/LCNestedClaimsFlow.tsx';
import LCEvidenceGrid from '../../components/islands/LCEvidenceGrid.tsx';
import LCStrategicImplications from '../../components/islands/LCStrategicImplications.tsx';
```

## Build order

1. **LCStrategicImplications** — simplest component, validates the basic pattern is working for LC (accent color, tokens, build pipeline)
2. **LCEvidenceGrid** — data table, no interactive state beyond scroll
3. **LCNestedClaimsFlow** — timer-driven reveal, reuses the pattern from NoticeInteractionFlow
4. **LCLandscapeQuadrant** — hover state, positioned dots, axis labels
5. **LCCouplingDiagram** — most complex: SVG lines, hover hitboxes, diamond positioning

After all five, wire into the MDX with SectionDividers and PullQuote. Run `npm run build` and verify zero errors.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] All five islands render at correct positions in the essay
- [ ] SectionDividers (01–06) present with correct labels
- [ ] PullQuote between sections 02 and 03
- [ ] No lucide-react imports anywhere in the new files
- [ ] All colors use either `tokens.*` (for shared semantic) or local LC constants (for project accent)
- [ ] Hover interactions work on CouplingDiagram and LandscapeQuadrant
- [ ] Timer sequencing works on NestedClaimsFlow
- [ ] Responsive: no horizontal overflow at 375px
- [ ] All animations respect `prefers-reduced-motion`
- [ ] No new dependencies added to `package.json`

## After this session

- Update STATUS.md: mark Session 3 complete
- Session 4 (Scholion) is next — visuals TBD per STATUS.md
- Decision on whether to clean up `session-*.md` prompt files (20+ files accumulating in repo root)
