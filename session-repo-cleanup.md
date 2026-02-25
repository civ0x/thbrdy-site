# Session: Repository Cleanup — Consolidate Working Files

**Date created:** 2026-02-25
**Kickoff:** Read `CLAUDE.md` and this file, then execute.

## Situation

The repo has accumulated working files in scattered locations: 50+ session prompts loose at root, essay drafts in orphaned directories (`coregulation-essay/`, `scholion/`), prototypes across multiple locations, and loose files at root. The deployed content in `src/content/writing/` is canonical — the copies elsewhere are older drafts.

A partial `git mv` left a stale `.git/index.lock`. That must be removed first, then the partial moves undone before running the full cleanup.

## Mission

Reorganize all non-source working files into a clean directory structure. Do NOT touch anything under `src/`, `public/`, or the build pipeline. This is purely a file-management operation on working/session/reference files.

## Pre-flight: Fix Stale Git State

```bash
# 1. Remove stale lock file
rm .git/index.lock

# 2. Undo partial moves (some session prompts were partially moved to sessions/)
git checkout -- .
rm -rf sessions/

# 3. Verify clean state — should show only the scholion/ modifications
git status
```

## Phase 1: Create Directory Structure

```bash
mkdir -p sessions/{ab,notice,lc,scholion,vod,coregulation,site-infra,pages}
mkdir -p prototypes/scholion
mkdir -p prototypes/vod
```

## Phase 2: Move Session Prompts (Root Level)

Tracked files use `git mv`. Untracked files use plain `mv`.

**AB essay:**
```bash
git mv session-1-ab-essay-islands.md sessions/ab/
```

**Notice essay:**
```bash
git mv session-2-notice-islands.md sessions/notice/
git mv session-2a-venn-fix.md sessions/notice/
git mv session-2b-venn-positions.md sessions/notice/
git mv session-2c-venn-legend.md sessions/notice/
git mv session-2d-venn-final.md sessions/notice/
git mv session-2e-venn-spacing.md sessions/notice/
git mv session-2f-venn-exact.md sessions/notice/
git mv session-2g-venn-shrink.md sessions/notice/
git mv session-2h-venn-labels.md sessions/notice/
git mv session-2i-venn-flanks.md sessions/notice/
git mv session-2j-venn-flanks-in.md sessions/notice/
git mv session-2k-venn-catlabels.md sessions/notice/
git mv session-2l-venn-center.md sessions/notice/
git mv session-2m-venn-nudge.md sessions/notice/
git mv session-2n-health-center.md sessions/notice/
git mv session-2o-notice-label.md sessions/notice/
git mv session-2p-enso-header.md sessions/notice/
git mv session-2q-enso-above-title.md sessions/notice/
git mv session-2r-enso-size.md sessions/notice/
```

**LC essay:**
```bash
git mv session-3-lc-islands.md sessions/lc/
git mv session-3a-lc-section-alignment.md sessions/lc/
git mv session-3b-lc-quadrant-fix.md sessions/lc/
git mv session-3c-lc-quadrant-inset.md sessions/lc/
git mv session-3d-claims-border.md sessions/lc/
git mv session-3e-quadrant-mobile.md sessions/lc/
git mv session-3f-pullquote-bottom-bar.md sessions/lc/
```

**Scholion essay:**
```bash
git mv session-4-scholion-islands.md sessions/scholion/
git mv session-4a-toulmin-redesign.md sessions/scholion/
git mv session-4b-toulmin-backing-align.md sessions/scholion/
git mv session-4c-credibility-cards-text.md sessions/scholion/
git mv session-scholion-essay-v2.md sessions/scholion/
git mv session-scholion-phase0-extraction.md sessions/scholion/
# Untracked files — use plain mv:
mv session-circuitry-pullquotes.md sessions/scholion/
```

**VoD essay:**
```bash
git mv session-5a-funnel-transform.md sessions/vod/
git mv session-5b-maturity-slider.md sessions/vod/
git mv session-annotation-system.md sessions/vod/
git mv session-vod-redesign-a.md sessions/vod/
git mv session-vod-redesign-b.md sessions/vod/
git mv session-vod-revision-patronage.md sessions/vod/
```

**Coregulation essay:**
```bash
git mv session-coregulation-islands.md sessions/coregulation/
```

**Site infrastructure:**
```bash
git mv session-favicon-dorje.md sessions/site-infra/
git mv session-favicon-vishvavajra.md sessions/site-infra/
git mv session-og-meta.md sessions/site-infra/
# Untracked:
mv session-og-tier1.md sessions/site-infra/
mv session-og-tier2.md sessions/site-infra/
mv session-fix-quote-og.md sessions/site-infra/
mv session-twitter-handle.md sessions/site-infra/
```

**Pages (now/about):**
```bash
git mv session-now-page-learning.md sessions/pages/
git mv session-now-page-what-is-code.md sessions/pages/
```

## Phase 3: Move Session Prompts (From Subdirectories)

**From `scholion/`:**
```bash
mv scholion/session-annotation-wiring.md sessions/scholion/
mv scholion/session-circuitry-v4-rsp-integration.md sessions/scholion/
mv scholion/session-diagram-port.md sessions/scholion/
mv scholion/session-schema-v0.2-reconciliation.md sessions/scholion/
mv scholion/session-scholion-essay-v2-diagrams.md sessions/scholion/
mv scholion/session-scholion-essay-v2-prose.md sessions/scholion/
# scholion/ also has session-scholion-essay-v2.md — this is the newer version.
# The root copy was already moved in Phase 2. Replace it with the scholion/ copy:
mv scholion/session-scholion-essay-v2.md sessions/scholion/session-scholion-essay-v2.md
```

**From `working/vod-essay/`:**
```bash
mv working/vod-essay/session-fix-legibility-gap.md sessions/vod/
mv working/vod-essay/session-vod-islands.md sessions/vod/
mv working/vod-essay/session-vod-mdx.md sessions/vod/
```

**From `prototypes/`:**
```bash
mv prototypes/SESSION-HANDOFF-VOD-VISUALIZATIONS.md sessions/vod/
```

## Phase 4: Consolidate Scholion Working Materials

The `scholion/` directory has its own sub-project structure (CLAUDE.md, STATUS.md, DECISIONS.md, research PDFs, extractions, prototypes). Move non-duplicate, non-session content into `working/scholion/`.

**Delete confirmed duplicates first:**
```bash
# Older draft — src/content/writing/the-circuitry-of-science.mdx is canonical
rm scholion/the-circuitry-of-science.mdx
# Older annotations — src/content/writing/ version is canonical
rm scholion/circuitry-of-science.annotations.yaml
# Duplicate of docs/interaction-patterns.md (identical)
rm scholion/interaction-patterns.md
# macOS artifact
rm -f scholion/.DS_Store
```

**Move remaining scholion files to `working/scholion/`:**
```bash
# Sub-project docs
mv scholion/CLAUDE.md working/scholion/CLAUDE.md
mv scholion/STATUS.md working/scholion/STATUS.md
mv scholion/DECISIONS.md working/scholion/DECISIONS.md

# Research materials
mv scholion/schema.yaml working/scholion/
mv scholion/literature-scan-feb2026.md working/scholion/
mv scholion/the-circuitry-of-science-review-notes.md working/scholion/
mv scholion/handoff-diagrams.md working/scholion/

# PDFs (research references)
mv scholion/thesis.pdf working/scholion/
mv "scholion/Anthropic's Responsible Scaling Policy (version 3.0).pdf" working/scholion/
mv "scholion/Redacted Risk Report Feb 2026.pdf" working/scholion/
mv "scholion/Sabotage Risk Report Claude Opus 4.6 (1).pdf" working/scholion/

# Extractions subdirectory
mv scholion/extractions working/scholion/
```

**Move scholion prototypes:**
```bash
mv scholion/prototypes/* prototypes/scholion/
rmdir scholion/prototypes
```

**Remove now-empty scholion directory:**
```bash
rmdir scholion
```

## Phase 5: Consolidate VoD Prototypes

```bash
mv prototypes/vod-funnel-transform.html prototypes/vod/
mv prototypes/vod-legibility-gap.html prototypes/vod/
mv prototypes/vod-maturity-slider.html prototypes/vod/
# Also move working/vod-essay prototypes:
mv working/vod-essay/prototype-case-comparison.html prototypes/vod/
mv working/vod-essay/prototype-coupling-mechanism.html prototypes/vod/
mv working/vod-essay/prototype-trading-zone.html prototypes/vod/
```

## Phase 6: Move Loose Root Files

```bash
# Annotation system design doc → docs/
git mv design-annotation-system.md docs/
# Annotations HTML prototype → prototypes/vod/
git mv prototype-annotations.html prototypes/vod/
# Scholion roadmap → working/scholion/
git mv scholion-roadmap.md working/scholion/
```

## Phase 7: Clean Up Orphaned Directories

```bash
# coregulation-essay/ contains only a duplicate of src/content/writing/coregulation.mdx
rm coregulation-essay/coregulation.mdx
rmdir coregulation-essay

# Clean up .DS_Store files
rm -f working/.DS_Store docs/.DS_Store

# prototypes/ directory should now only have subdirs
rmdir prototypes/SESSION-HANDOFF-VOD-VISUALIZATIONS.md 2>/dev/null || true
```

## Phase 8: Update scholion-roadmap.md Reference

The `scholion/CLAUDE.md` (now at `working/scholion/CLAUDE.md`) references `../scholion-roadmap.md`. Update the path reference since the roadmap is now at `working/scholion/scholion-roadmap.md`:

In `working/scholion/CLAUDE.md`, change:
```
The roadmap lives at `../scholion-roadmap.md` in the parent repo.
```
to:
```
The roadmap lives at `scholion-roadmap.md` in this directory.
```

## Phase 9: Stage and Verify

```bash
git add -A
git status
```

**Expected final structure (non-source, non-node_modules):**

```
sessions/
  ab/          (1 session prompt)
  notice/      (19 session prompts)
  lc/          (7 session prompts)
  scholion/    (14 session prompts)
  vod/         (12 session prompts)
  coregulation/ (1 session prompt)
  site-infra/  (7 session prompts)
  pages/       (2 session prompts)

working/
  scholion/    (CLAUDE.md, STATUS.md, DECISIONS.md, schema.yaml, PDFs, extractions/, etc.)
  vod-essay/   (design docs, research, handoff notes — prototypes moved out)
  coregulation-essay/ (PDF, research doc)

prototypes/
  scholion/    (7 HTML prototypes)
  vod/         (7 HTML prototypes including annotations)

reference/     (unchanged — essay drafts, JSX references, vod-revision/)
docs/          (interaction-patterns.md, design-annotation-system.md)
scripts/       (unchanged — OG image generation)
```

Verify no session-*.md files remain at root:
```bash
ls session-*.md 2>/dev/null && echo "ERROR: session prompts still at root" || echo "OK: root clean"
ls scholion/ 2>/dev/null && echo "ERROR: scholion/ still exists" || echo "OK: scholion/ removed"
ls coregulation-essay/ 2>/dev/null && echo "ERROR: coregulation-essay/ still exists" || echo "OK: removed"
```

## Commit

Stage everything and commit with message:

```
Reorganize repo: consolidate session prompts, dedupe working files

- Move 50+ session prompts into sessions/ organized by essay
- Consolidate scholion/ sub-project into working/scholion/
- Delete duplicate MDX/YAML files (src/content/writing/ is canonical)
- Organize prototypes into prototypes/{scholion,vod}/
- Move loose root files to docs/ and working/
- Remove orphaned coregulation-essay/ directory
```
