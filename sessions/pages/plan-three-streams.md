# Plan: Three-Stream Content Architecture

## The Idea

Three registers of writing, each with different editorial investment and cadence:

| Stream | Cadence | Friction | Route |
|--------|---------|----------|-------|
| **Stream** | Multiple per day | Near-zero — create file, write, push | `/` (homepage) |
| **Plans** | Daily-ish | Low — short frontmatter, plain markdown | `/plans/` |
| **Essays** | When ready | Current level — MDX, islands, annotations | `/writing/` (unchanged) |

The stream is the heartbeat of the site. Plans and essays are referenced from within it but live at their own routes.

## Stream (the homepage)

**What it is:** Short, timestamped entries in reverse chronological order. Twitter-length to a-few-paragraphs. Could be an observation, a link, a question, a status update, a pointer to a new plan or essay. All content types mixed together — the unifying property is recency, not category.

**Content format:** Plain `.md` files in `src/content/stream/`. Minimal frontmatter:

```yaml
---
date: 2026-02-26T14:30:00
tags: ["notice", "on-device-ai"]  # optional
---

Ran the first quantized Llama 3.2 3B inference on-device today.
Latency is ~800ms for a short reflection. Usable for moment-level,
too slow for anything conversational. Need to profile where the
bottleneck is — tokenization or generation.
```

That's it. No title required (stream entries don't need titles — the first line *is* the entry). No slug computation needed. Tags are optional for filtering later but not required to post.

**Filename convention:** `YYYY-MM-DD-HHMM.md` (e.g., `2026-02-26-1430.md`). The timestamp is in the filename so you can create the file and start typing immediately. Date in frontmatter is canonical for display; filename is just for uniqueness and sorting in the filesystem.

**Homepage redesign:** The current hero (Cinzel name, thesis, vajra, scroll hint, project cards) gets compressed into a compact identity header — name, one-line thesis, nav. Below it: the stream, paginated or infinite-scroll. The project cards move to `/about` or become a section at the bottom of the stream page. The mandala canvas stays as ambient texture.

**Posting workflow:** Create a `.md` file in `src/content/stream/`, write, commit, push. Cloudflare auto-deploys. If you want even less friction, a shell alias or iOS shortcut could create the timestamped file and open it in your editor. No MDX, no islands, no annotations — just markdown.

## Plans (`/plans/`)

**What it is:** Pre-registrations. You're committing to a specific technical or creative direction in public, with enough precision to be falsifiable later. Longer than stream entries, shorter than essays. Has a title, a date, usually connected to a project.

**Content format:** `.md` files in `src/content/plans/`. Slightly richer frontmatter:

```yaml
---
title: "On-Device Contemplative AI"
date: 2026-02-26
description: "The plan for replacing cloud inference with a fine-tuned 3B model running on iPhone."
project: "Notice"           # optional, for filtering
status: "active"            # active | completed | abandoned
---
```

Status field lets you come back and mark a plan as completed or abandoned — the accountability loop closes visibly.

**Route:** `/plans/` index (reverse chronological, status-filtered) + `/plans/[slug]/` for individual plan pages.

**Layout:** Same `Base.astro` shell. Plans don't need `PostLayout.astro` or interactive islands — they're prose documents. A simpler layout that shows title, date, status, project tag, and the content body. Could reuse the now-page aesthetic (Cormorant prose, JetBrains metadata).

## Essays (`/writing/` — unchanged)

No changes. MDX, interactive islands, annotation system, PullQuotes, SectionDividers, per-essay OG images. The existing seven essays stay exactly as they are.

## What Changes Architecturally

**`src/content.config.ts`** — Add two new collections:

```typescript
const stream = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stream' }),
  schema: z.object({
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

const plans = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/plans' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    project: z.string().optional(),
    status: z.enum(['active', 'completed', 'abandoned']).default('active'),
  }),
});

export const collections = { writing, stream, plans };
```

**New directories:**
- `src/content/stream/` — stream entries
- `src/content/plans/` — plan documents

**New pages:**
- `src/pages/plans/index.astro` — plans index
- `src/pages/plans/[...slug].astro` — individual plan page

**Modified pages:**
- `src/pages/index.astro` — hero compressed, stream entries below
- `src/components/Nav.astro` — add Plans link (or rethink nav: `thbrdy | Stream · Plans · Writing · About`)

**Potentially deprecated:**
- `src/pages/now.astro` — the stream replaces its function. Could keep `/now` as a redirect to `/` or remove it after a transition period. Or keep it as a curated "pinned" summary that you update weekly while the stream captures daily texture.

## What Doesn't Change

- `/writing/` collection, schema, routes, layouts, islands, annotations — all untouched
- `Base.astro`, `PostLayout.astro`, `Footer.astro`, `MandalaCanvas.astro` — untouched
- Design system (palette, typography roles, animation patterns) — untouched
- Build pipeline, OG images, quote share cards — untouched
- No new dependencies

## Open Questions

1. **Homepage identity.** How much of the current hero do you want to keep? Options range from "just the name and a nav bar" to "compact hero (name + thesis + vajra, no scroll hint, no project cards) with stream below the fold." The more you keep, the more the stream feels like a secondary section. The less you keep, the more the site feels like a living notebook.

2. **Stream pagination.** Show last N entries with a "Load more" or paginate with `/page/2/`? Astro can do either. Infinite scroll needs client JS; pagination is static and zero-JS.

3. **Cross-references.** When you publish a new plan or essay, you'd naturally write a stream entry pointing to it ("New plan: on-device contemplative AI → /plans/on-device-ai/"). That's just a markdown link — no special infrastructure needed. But do you want automatic "latest plan" or "latest essay" cards in the stream, or is manual cross-posting fine?

4. **Now page fate.** Kill it, keep it as a manually-curated pinned summary, or redirect to `/`?

5. **Stream entry rendering.** Should stream entries on the homepage show the full content inline (like a Twitter timeline), or a truncated preview with "read more"? For short entries full-inline is cleaner. For longer entries (3+ paragraphs) you'd want truncation — but that implies individual stream entry pages at `/stream/[id]/`, which adds a route.

## Implementation Order

If we proceed, I'd break this into three session prompts:

1. **Infrastructure** — new collections in `content.config.ts`, new directories, plans index + slug pages, seed with one plan entry. Build passes. `/writing/` untouched.
2. **Stream + homepage** — stream collection, homepage redesign (compressed hero + stream entries), seed with a few stream entries. Build passes.
3. **Nav + cleanup** — nav update, now-page decision, cross-link verification, OG tags for new routes.

Each prompt is independently deployable — the site works after each step.
