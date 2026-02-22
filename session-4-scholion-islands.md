# Session 4: Scholion Essay Islands

## Kickoff

Read `CLAUDE.md`, `STATUS.md`, and this file, then execute.

## Situation

Phase 4 (Interactive Islands) — final essay. Three essays already have islands: AB (2), Notice (4), LC (5). Scholion has none. A reference HTML page exists at `reference/scholion-essay.html` with five fully designed visual components. The MDX (`src/content/writing/scholion.mdx`) has two TODO markers but needs six islands total plus structural elements.

The Scholion essay uses the site's default gold accent (`--accent: #B8860B`). No project-specific accent color needed — gold is Scholion's color.

## Mission

Build six React island components for the Scholion essay, add SectionDividers and PullQuotes, and integrate everything into the MDX.

## Components to Build

### 1. `ScholionDependencyChain.tsx` — RSP Dependency Chain
**Position in MDX:** Replace TODO at line 25 (`{/* TODO: Interactive — Claim dependency diagram showing the RSP dependency chain */}`)

**What it does:** Visualizes the 4-level implicit dependency chain in a Responsible Scaling Policy. Vertical stack of nodes connected by upward arrows. The bottom node ("Informal forecasts") is the foundation — highlighted in red with an "Acknowledged open question" label. An annotation below summarizes the vulnerability.

**Reference:** `reference/scholion-essay.html` lines 758–786. Port the HTML/CSS structure directly.

**Key design details:**
- Warm background container (`--bg-warm`) with subtle border
- Title: "Implicit dependency chain in a responsible scaling policy" (mono, uppercase, muted)
- 4 nodes stacked vertically, each with a layer label (mono, uppercase) and description text (serif)
- Arrows between nodes with "depends on" labels (positioned to the right, hidden on mobile)
- Bottom node: red border, red-dim background, red text — the acknowledged open question
- Annotation below the chain with italic emphasis on "open research questions" in red
- Staggered reveal animation on scroll (each node fades in sequentially)
- Mobile: hide arrow labels, nodes stack full-width

### 2. `ScholionToulminDiagram.tsx` — Toulmin Structure Anatomy ⭐ Design from scratch
**Position in MDX:** Replace TODO at line 37 (`{/* TODO: Interactive — Toulmin structure diagram showing claim/warrant/backing/qualifier/rebuttal */}`)

**What it does:** Teaches the reader Toulmin's argument structure by decomposing one concrete example claim from AI safety into its six components. This is pedagogical — the audience (safety researchers, AI people) likely isn't fluent in Toulmin vocabulary. The diagram should make the structure immediately graspable before the essay explains how Scholion extracts it computationally.

**Design direction:**
- Use a concrete example from the essay's own domain. Suggested example: the RSP forecasting claim from Section 1.
  - **Claim:** "This AI system is safe to deploy at ASL-3"
  - **Data/Evidence:** "Capability evaluations show performance below dangerous thresholds"
  - **Warrant:** "If evaluations are below threshold, deployment is safe"
  - **Backing:** "Evaluation methodology validated against known dangerous capabilities"
  - **Qualifier:** "Given current threat models and evaluation coverage"
  - **Rebuttal:** "Unless capability jumps occur between evaluation cycles"

- Layout: Central claim node at top. Data and Warrant feed into it from below (the "so" and "since" connections). Backing supports the Warrant from below. Qualifier and Rebuttal attach to the Claim from the sides. Each element is a card with a typed label (mono, uppercase, colored) and the content text (sans).

- Visual language:
  - Warm background container like other Scholion diagrams
  - Title: "Anatomy of a Toulmin argument · AI safety example" (mono, uppercase, muted)
  - Each Toulmin role gets a distinct semantic color from the token palette:
    - Claim → `--accent` (gold) — it's the central assertion
    - Data → `--blue` — empirical evidence
    - Warrant → `--green` — the inferential bridge
    - Backing → `--teal` — support for the warrant
    - Qualifier → `--text-muted` — hedging, scope limitation
    - Rebuttal → `--red` — the exception condition
  - Connection lines between cards: 1px solid in the color of the target node, with small labels on the lines ("so", "since", "on account of", "unless", "given that")
  - Staggered reveal: Claim appears first, then Data + Warrant, then Backing, then Qualifier + Rebuttal

- Responsive:
  - Desktop: structured spatial layout (Claim centered top, supporting elements arranged below/beside)
  - Tablet (≤640px): linearize to vertical stack with connection labels inline
  - Phone (≤420px): simple vertical card stack with role labels as eyebrows

- Implementation: Use positioned divs with CSS for connections (pseudo-elements or border tricks), not SVG. Keep it consistent with how other essays handle structural diagrams. The `<style>` tag pattern with scoped class names per CLAUDE.md conventions.

### 3. `ScholionPositioningGrid.tsx` — Capability Comparison Table
**Position in MDX:** After the "What exists and what doesn't" prose, before the paragraph starting "The hardest problem in safety case maintenance..."

**What it does:** 6-row × 5-column comparison grid showing what existing systems do and don't do, with Scholion filling all gaps. Makes the positioning argument visual and scannable.

**Reference:** `reference/scholion-essay.html` lines 806–868. Port the HTML/CSS structure.

**Key design details:**
- Systems: Citation graphs, Scite.ai, Argument mining, TMS/ATMS, Knowledge graphs, Scholion
- Capabilities: Paper-level, Claim-level, Cross-doc, Crux ID, Propagation
- Cell states: yes (green ●), no (muted —), partial (accent ◐), gap (red background — Scholion's contribution)
- Scholion row highlighted: bold gold label, all cells in red-dim background with red text
- Each system row has a colored dot indicator
- Footer legend: Exists / Partial / Missing / Scholion's contribution
- Mobile: horizontal scroll, smaller font
- Staggered reveal: header first, then rows cascade

### 4. `ScholionPipelineDiagram.tsx` — Extraction Pipeline
**Position in MDX:** In the "Why these claims are testable now" section, after the three capability paragraphs, before the paragraph about "The gap that matters most."

**What it does:** Dark-background 4-stage horizontal pipeline showing the Toulmin extraction process. Makes the technical approach concrete.

**Reference:** `reference/scholion-essay.html` lines 910–944. Port the HTML/CSS structure.

**Key design details:**
- Dark background (`--bg-dark`) container with rounded corners
- Title: "Toulmin extraction pipeline · 4 stages per paper" (mono, muted white)
- 4 stage cards on dark-mid background:
  1. Passage Extraction → passage, section, type
  2. Atomic Decomposition → claim, warrant, backing, qualifier, rebuttal
  3. Dependency Mapping → source, target, direction, type
  4. Crux Detection → edge_type, is_crux, reasoning
- Each card: stage number (mono, accent), name (sans, white), description (sans, dim white), schema output (mono, accent, dimmed)
- Callout box below: gold-tinted border, "Critical gap" label, note about no validated dataset
- Desktop: 4-column grid
- Tablet (≤768px): 2×2 grid
- Phone (≤480px): single column
- Staggered reveal: stages cascade left to right

### 5. `ScholionValidationTimeline.tsx` — Nested Claims with Kill Criteria
**Position in MDX:** In the "How I'm validating" section, after the opening paragraph about three nested claims.

**What it does:** Vertical timeline showing 3 validation claims, each with "validated if" (green) and "killed if" (red) criteria cards. Makes the nested dependency and kill-criteria structure navigable.

**Reference:** `reference/scholion-essay.html` lines 960–1004. Port the HTML/CSS structure.

**Key design details:**
- Warm background container
- Title: "Validation program · nested claims with kill criteria" (mono, uppercase, muted)
- Vertical progress line (1px, `--border-mid`) on the left
- 3 claim nodes, each with:
  - Circle indicator on the timeline (first is filled/active, others are outline only)
  - Claim number (mono, accent) + title (sans, bold)
  - Description paragraph (sans, light text)
  - 2-column criteria grid: "Validated if" (green-dim bg, green border, green text) and "Killed if" (red-dim bg, red border, red text)
- Claims:
  1. Toulmin extraction reliability (>70% F1 claims, >50% F1 deps / κ < 0.4 kills)
  2. Cross-document matching (>60% precision @ >40% recall / too noisy kills)
  3. Useful for safety case maintenance (faster than prose / overhead exceeds benefit kills)
- Mobile (≤768px): criteria stack to single column
- Staggered reveal: claims cascade top to bottom

### 6. `ScholionCredibilityCards.tsx` — Career Highlights
**Position in MDX:** In the "Why I'm working on this" section, after the opening paragraph about the career thread.

**What it does:** 2×2 grid of compact cards showing relevant career experience. Establishes credibility concisely.

**Reference:** `reference/scholion-essay.html` lines 1020–1040. Port the HTML/CSS structure.

**Key design details:**
- 4 cards in a 2×2 grid:
  1. ML Compilation — "Built the initial compiler pipeline for AWS Neuron SDK"
  2. Graph ML — "Built Neptune ML, bringing graph ML to production on AWS"
  3. AutoML — "Worked on AutoML at H2O.ai with the Driverless AI team"
  4. LLM Training — "Led training for Amazon's first production LLM"
- Each card: warm background, subtle border, label (mono, uppercase, muted), description text (sans) with bold on key terms
- Mobile (≤768px): single column
- Staggered reveal: cards cascade

## MDX Integration

Update `src/content/writing/scholion.mdx` to:

1. **Add imports** for all 6 islands plus SectionDivider and PullQuote from shared
2. **Add SectionDividers** matching the reference's 6 sections:
   - 01 · The Structure of Safety Reasoning
   - 02 · What Exists and What Doesn't
   - 03 · What Scholion Enables
   - 04 · Why These Claims Are Testable Now
   - 05 · How I'm Validating
   - 06 · Why I'm Working on This
3. **Add PullQuotes** at two positions from the reference:
   - After Section 01 intro, before the Weick paragraph: "The dependency structure exists — it has to, because the safety argument has logical structure — but it lives in researchers' heads, in prose documents, and in slide decks."
   - Between Sections 03 and 04: "A structurally competent judge can oversee a substantively stronger researcher — not by competing on knowledge, but on structural integrity." (attribution: "The scalable oversight thesis")
4. **Place islands** at the positions specified above for each component
5. **Remove both TODO comments** — they're replaced by actual islands

## Technical Constraints

- All components use TypeScript (`.tsx`)
- Import shared utilities: `tokens` from `./shared/tokens`, `useInView` from `./shared/useInView`
- Naming: `Scholion[ComponentName].tsx`
- Scoped class names: `scholion-chain-*`, `scholion-toulmin-*`, `scholion-positioning-*`, `scholion-pipeline-*`, `scholion-validation-*`, `scholion-credibility-*`
- Injected `<style>` tags for responsive handling (per CLAUDE.md pattern)
- No animation libraries — CSS transitions triggered by `inView` state
- No icon libraries — inline SVG for any icons
- All animations respect `prefers-reduced-motion` (handled by `useInView` hook)
- Hydration directive: `client:visible` for all islands
- `>` in MDX must be escaped as `&gt;` to avoid JSX parsing issues

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] All 6 islands render at correct positions in the essay
- [ ] SectionDividers show correct numbers and labels (01–06)
- [ ] Both PullQuotes render with accent bar design
- [ ] Dependency chain: foundation node is red, arrow labels visible on desktop
- [ ] Toulmin diagram: all 6 roles visible, connections labeled, colors match token palette
- [ ] Positioning grid: Scholion row highlighted, legend present
- [ ] Pipeline: dark background, 4 stages, callout box visible
- [ ] Validation timeline: progress line visible, criteria cards colored correctly
- [ ] Credibility cards: 2×2 on desktop, 1-column on mobile
- [ ] All scroll animations fire once and respect reduced motion
- [ ] No horizontal scroll on mobile (320px viewport)
- [ ] No new dependencies added to `package.json`
- [ ] No TODO comments remain in `scholion.mdx`
- [ ] Background is `#FAF6F0` everywhere — no pure white, no dark page backgrounds
