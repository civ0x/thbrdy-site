# Session 3a: LC Essay — Section/Diagram Alignment

## Situation

Session 3 ported five islands into `learned-compilation.mdx`. The components are correct, but the diagrams were placed at the TODO positions from Phase 3, which were set before the reference JSX reorganized the narrative. The result: diagrams don't sit with the prose they illustrate.

Read `CLAUDE.md`, `STATUS.md`, and the current `src/content/writing/learned-compilation.mdx` before making changes.

## Problem

Current section structure (post Session 3):

| Section | Label | Heading | Diagram | Prose topic |
|---------|-------|---------|---------|-------------|
| 01 | The Problem | Sizing the opportunity | CouplingDiagram | Coupling evidence | ✓ matches |
| 02 | The Landscape | What a learned planner enables | LandscapeQuadrant | Three strategic consequences | ✗ mismatch |
| — | — | — | PullQuote | — |
| 03 | Validation | Why these claims are testable now | (none) | Existing systems, learnability evidence | ✗ missing diagram |
| 04 | Evidence | The evidence gradient | EvidenceGrid | Evidence strength per claim | ✓ matches |
| 05 | Stakes | How I'm validating | NestedClaimsFlow | Three nested claims, kill criteria | ✗ label mismatch |
| 06 | Positioning | Why I'm working on this | StrategicImplications | Personal background | ✗ mismatch |

The mismatches:
- **LandscapeQuadrant** (scatter plot of where existing systems sit) is in section 02, but the prose there is about strategic consequences — not the research landscape
- **StrategicImplications** (three consequence cards) is in section 06, but the prose there is personal background — the consequences prose is in section 02
- Section 03 has no diagram, but its prose discusses existing systems (MLGO, GO, TVM, Ansor) — the LandscapeQuadrant belongs here
- Section 05 label "Stakes" doesn't match "How I'm validating" content

## Mission

Move diagrams to match the prose they illustrate. Adjust section labels accordingly. Four edits to `src/content/writing/learned-compilation.mdx`, no other files touched.

## Changes

### 1. Section 02: swap diagram, rename label

**Before:**
```mdx
<SectionDivider number="02" label="The Landscape" client:visible />

## What a learned planner enables

If a learned policy can exploit the joint decision space, three things change beyond raw throughput improvement.

<LCLandscapeQuadrant client:visible />
```

**After:**
```mdx
<SectionDivider number="02" label="If It Works" client:visible />

## What a learned planner enables

If a learned policy can exploit the joint decision space, three things change beyond raw throughput improvement.

<LCStrategicImplications client:visible />
```

Rationale: The prose below is about three strategic consequences. StrategicImplications (three consequence cards) illustrates this directly. "If It Works" as a label matches the reference's header for this diagram and frames the section correctly.

### 2. Section 03: add diagram, rename label

**Before:**
```mdx
<SectionDivider number="03" label="Validation" client:visible />

## Why these claims are testable now
```

**After:**
```mdx
<SectionDivider number="03" label="The Landscape" client:visible />

## Why these claims are testable now

<LCLandscapeQuadrant client:visible />
```

Rationale: The prose discusses existing systems (MLGO, GO, TVM, Ansor, GNN-based RL) and where the gap is. The LandscapeQuadrant shows exactly this — where systems sit on the coupled-spaces × learned-vs-heuristic axes and the empty quadrant. "The Landscape" label moves here from section 02.

### 3. Section 05: rename label

**Before:**
```mdx
<SectionDivider number="05" label="Stakes" client:visible />
```

**After:**
```mdx
<SectionDivider number="05" label="Validation" client:visible />
```

Rationale: The prose describes three nested claims with kill criteria. "Validation" fits. The label moves here from the old section 03.

### 4. Section 06: remove diagram

**Before:**
```mdx
## Why I'm working on this

<LCStrategicImplications client:visible />

I built the initial compiler pipeline...
```

**After:**
```mdx
## Why I'm working on this

I built the initial compiler pipeline...
```

Rationale: Personal background prose doesn't need a diagram. StrategicImplications moved to section 02 where it belongs.

## Result

| Section | Label | Heading | Diagram | Prose topic |
|---------|-------|---------|---------|-------------|
| 01 | The Problem | Sizing the opportunity | CouplingDiagram | Coupling evidence | ✓ |
| 02 | If It Works | What a learned planner enables | StrategicImplications | Three strategic consequences | ✓ |
| — | — | — | PullQuote | — |
| 03 | The Landscape | Why these claims are testable now | LandscapeQuadrant | Existing systems, gap analysis | ✓ |
| 04 | Evidence | The evidence gradient | EvidenceGrid | Evidence strength per claim | ✓ |
| 05 | Validation | How I'm validating | NestedClaimsFlow | Three nested claims, kill criteria | ✓ |
| 06 | Positioning | Why I'm working on this | (none) | Personal background | ✓ |

Narrative arc: Problem → What changes if solved → Where the field stands → Evidence map → How I'm testing → Why me.

## Verification

- [ ] `npm run build` passes with zero errors
- [ ] Six SectionDividers present with updated labels (01 The Problem, 02 If It Works, 03 The Landscape, 04 Evidence, 05 Validation, 06 Positioning)
- [ ] StrategicImplications renders in section 02
- [ ] LandscapeQuadrant renders in section 03
- [ ] No diagram in section 06
- [ ] No import lines added or removed (all five LC imports + SectionDivider + PullQuote still present)
- [ ] PullQuote still between sections 02 and 03
