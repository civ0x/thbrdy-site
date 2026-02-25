# Session Prompt: Add PullQuotes to The Circuitry of Science

## Situation

The Circuitry of Science essay (`src/content/writing/the-circuitry-of-science.mdx`) has no PullQuote components. The PullQuote share infrastructure (Tier 1 + Tier 2) is fully operational — per-quote OG images generate at build time, share target pages at `/writing/[slug]/quote/[n]/` redirect to the parent essay, and the PullQuote component renders 𝕏 + copy-link share buttons when `slug` and `quoteIndex` props are provided.

This session adds four PullQuotes to the essay with share props, and regenerates OG images.

## Mission

Add four PullQuote components to `the-circuitry-of-science.mdx` at structurally appropriate positions. Regenerate OG images so quote card PNGs are created. Verify build passes.

## The Four Quotes

### Quote 1 — Between Section II and Section III
**Text:** "The absence of domain priors may be a structural advantage for the decomposition task."

**Placement:** After the final paragraph of Section II (which ends with "The gap itself is the finding.") and before the `## III. The Medical Demonstration` heading.

**Rationale:** The essay's most counterintuitive claim. Inverts the assumption that expertise is always better. Sits at the pivot from methodology description to empirical demonstration — the reader carries this provocation into the evidence.

### Quote 2 — Between Section III and Section IV
**Text:** "A dependency graph is immune to rhetorical fluency in a way that prose evaluation is not."

**Placement:** After the `<ScholionChenDependencyGraph>` island and before the `## IV. The Safety Case Application` heading.

**Rationale:** Clean formulation of Scholion's core value proposition. Bridges from the medical demonstration to the safety case argument. Stands alone perfectly for social sharing.

### Quote 3 — Mid-Section IV (after the scalable oversight paragraph)
**Text:** "The overseer does not need to reconstruct the entire argument. They need to audit the joints."

**Placement:** After the paragraph that ends with "The substantive layer is where domain expertise remains necessary but is scoped to a specific, bounded task: reviewing warrants and cruxes that the structural layer has already identified as load-bearing. The overseer does not need to reconstruct the entire argument. They need to audit the joints." and before the paragraph that begins with "This is the project's meta-crux."

**Note:** This quote is the final two sentences of that paragraph. The PullQuote repeats them as a visual callout — this is the same pattern used in other essays where the pull quote echoes a key passage from the surrounding prose for emphasis.

### Quote 4 — Between Section IV and Section V
**Text:** "A structurally competent verifier can oversee a substantively stronger researcher — not by matching their domain expertise, but by auditing the logical scaffolding their arguments rest on."

**Placement:** After the `<ScholionSafetyCaseFragment>` island and before the `## V. What the Extraction Revealed About the Schema` heading.

**Rationale:** The essay's boldest claim and the thesis of the entire Scholion project. Closing the safety case section with this gives it maximum weight before the essay shifts to self-critique.

## Implementation

### 1. Edit `src/content/writing/the-circuitry-of-science.mdx`

Add the PullQuote import alongside the existing island imports:

```mdx
import { PullQuote } from '../../components/islands/shared/PullQuote.tsx'
```

Insert each PullQuote at its specified location with explicit props:

```mdx
<PullQuote client:visible slug="the-circuitry-of-science" quoteIndex={1}>The absence of domain priors may be a structural advantage for the decomposition task.</PullQuote>
```

```mdx
<PullQuote client:visible slug="the-circuitry-of-science" quoteIndex={2}>A dependency graph is immune to rhetorical fluency in a way that prose evaluation is not.</PullQuote>
```

```mdx
<PullQuote client:visible slug="the-circuitry-of-science" quoteIndex={3}>The overseer does not need to reconstruct the entire argument. They need to audit the joints.</PullQuote>
```

```mdx
<PullQuote client:visible slug="the-circuitry-of-science" quoteIndex={4}>A structurally competent verifier can oversee a substantively stronger researcher — not by matching their domain expertise, but by auditing the logical scaffolding their arguments rest on.</PullQuote>
```

### 2. Regenerate OG images

Run `npm run generate:og` (or let `prebuild` handle it). This should produce four new files:

- `public/images/og/the-circuitry-of-science-quote-1.png`
- `public/images/og/the-circuitry-of-science-quote-2.png`
- `public/images/og/the-circuitry-of-science-quote-3.png`
- `public/images/og/the-circuitry-of-science-quote-4.png`

The per-essay image (`the-circuitry-of-science.png`) should already exist.

### 3. No other changes needed

The quote share pages at `/writing/the-circuitry-of-science/quote/[1-4]/` are generated automatically by the existing `[slug]/quote/[n].astro` dynamic route — it scans MDX for `<PullQuote>` tags at build time.

## Verification Checklist

- [ ] PullQuote import added to the-circuitry-of-science.mdx
- [ ] Four PullQuotes inserted at correct positions with `slug="the-circuitry-of-science"` and `quoteIndex={1}` through `{4}`
- [ ] `npm run build` succeeds with zero errors
- [ ] Four quote card PNGs exist in `public/images/og/`
- [ ] Quote 4 (the longest) wraps correctly in the OG image without overflow
- [ ] Each quote renders on the page with the gold accent bar, italic text, and share buttons (𝕏 + link icon)
- [ ] Share target pages resolve: `/writing/the-circuitry-of-science/quote/1/` through `/quote/4/`
- [ ] Share target pages redirect to `/writing/the-circuitry-of-science/`
- [ ] Total page count increases (11 base pages + new quote pages)
