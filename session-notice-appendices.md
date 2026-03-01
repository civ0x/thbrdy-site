# Session Prompt: Notice Vision Document — Collapsible Appendices

## Situation

The Notice vision document ("The Body Knows First") is live at `/notice/` as an investor-facing page. The main document ends with an emotional close: *"The app gets quieter as you get better. That is the design."* Investor-audience readers who want operational detail — pricing, GTM, technical architecture, timeline — need supplementary material available without breaking the document's narrative arc.

## Mission

Add a `CollapsibleAppendix` shared island component and five collapsible appendix sections **after** the emotional close of the vision document. The appendices provide operational depth for diligent investors while preserving the document's contemplative tone.

## What to Build

### 1. CollapsibleAppendix.tsx — Shared Island Component

**Location:** `src/components/islands/shared/CollapsibleAppendix.tsx`

A disclosure component: collapsed by default, click to expand. Used in MDX like:

```mdx
<CollapsibleAppendix client:visible id="pricing" title="Pricing & Unit Economics">
  <div>Content here...</div>
</CollapsibleAppendix>
```

**Spec:**

```tsx
import { useState, type ReactNode } from "react";
import { tokens } from "./tokens";
import { useInView } from "./useInView";

interface CollapsibleAppendixProps {
  id: string;
  title: string;
  children: ReactNode;
}
```

**Visual design:**
- Each appendix is a horizontal band separated by `borderMid` (1px) top borders. The last appendix also gets a bottom border.
- Toggle button: full-width row with a right-pointing chevron (SVG, 14×14) that rotates 90° on open, plus the title in DM Sans 14px weight 500.
- Hover: text color transitions to `accent`.
- Expand/collapse: `max-height` transition (0 → 2000px) with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, opacity fade.
- Body content: padded left 26px (past the chevron column), DM Sans 14px for all text, `textMid` color. `<strong>` in `text` color weight 600.
- Tables inside body: `mono` 10px uppercase headers, `sans` 13px cells, `borderMid` header underline, `border` row underlines.
- Scroll animation: the toggle row fades in via `useInView(0.1)` with translateX(-12px → 0).
- `aria-expanded`, `aria-controls`, and `role="region"` for accessibility.
- Reduced motion: all transitions collapse to 0.01s.
- Class prefix: `nv-appendix-*` to avoid collisions.

**IMPORTANT: Use `<div>` not `<p>` for content paragraphs inside the body.** PostLayout's `.post__content :global(p)` will override island margins. This is a known issue (see Corrections Log in CLAUDE.md).

**Full prototype at:** `/prototype-collapsible-appendix.tsx` in the repo root. Use this as the starting point — it implements the full spec above.

### 2. Five Appendix Sections in the MDX

Add these **after** the final italic line (`*The app gets quieter as you get better. That is the design.*`) in `notice-vision.mdx`. Precede them with a small visual separator and eyebrow label:

```mdx
import { CollapsibleAppendix } from '../../components/islands/shared/CollapsibleAppendix.tsx'

{/* Add to imports at top of file */}

{/* Place after the emotional close */}

<div style={{ marginTop: '64px' }}>
  <div style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '24px',
  }}>
    APPENDICES
  </div>

  {/* Five CollapsibleAppendix components here */}
</div>
```

---

## Appendix Content

All content below uses `<div>` elements, not `<p>`, to avoid the PostLayout margin override. Tables use standard HTML `<table>` markup.

### Appendix A: Pricing & Unit Economics

**id:** `pricing`
**title:** `Pricing & Unit Economics`

**Content (write as JSX with `<div>` paragraphs):**

Tiered model anchored against biometric wearables, not meditation apps.

**Table:**

| | Core | Full |
|---|---|---|
| Price | ~$80/year | $149–199/year |
| Reflection tiers | Brief (on-device) | Brief + Exploratory + Daily + Weekly synthesis |
| AI runtime | On-device model (zero marginal cost) | Claude API (cloud) |
| Biometric context | Basic | Full enrichment via Foundation Models |
| Anchor comparison | Oura ($70/yr + $300 hardware) | WHOOP ($239/yr) |

The economic logic: once the on-device model ships brief reflections, the Core tier costs nothing to serve at scale. The premium tier gates longitudinal pattern analysis — daily and weekly synthesis reflections that require Claude's reasoning capacity — not the core snap-debrief loop. A 7-day free trial with full features is the conversion mechanism. Gate nothing during the aha window.

Willingness-to-pay research suggests 2–4% conversion at the premium tier from a qualified audience. This is viable if the funnel delivers contemplative practitioners and serious quantified-self trackers, not casual meditation-curious downloaders.

### Appendix B: Go-to-Market

**id:** `gtm`
**title:** `Go-to-Market Strategy`

**Content:**

Three-phase channel sequence, ordered by community-product fit and cost per qualified user.

**Phase 1 — Community validation (now).** Jhourney contemplative community: 1,000–3,000 practitioners, high philosophical alignment, produces testimonial quality needed to seed other channels. Simultaneously: r/quantifiedself and r/ouraring — technically literate, wearable-native, actively seeking what Notice does in different vocabulary ("HRV-correlated emotional pattern tracking"). Highest ROI per post of any channel.

**Phase 2 — Niche amplification (post-launch).** Podcasts: Buddhist Geeks, Technology for Mindfulness, Quantified Self podcast, Ten Percent Happier. Contemplative press: Tricycle Magazine. Communities: r/biohackers, Oura partner program, QS local meetups. Beta-listing sites (Product Hunt, BetaList) timed to App Store launch.

**Phase 3 — Adjacent expansion (months 3–6).** Insight Timer community, Waking Up / Sam Harris community, r/meditation. Each community requires segment-specific vocabulary: contemplative practitioners hear "noticing practice," biohackers hear "biometric-emotional correlation," the QS audience hears "interoceptive accuracy training." The product doesn't change; the framing does.

Key insight from competitive analysis: the QS/biohacker audience may be the faster growth channel, not just the later one. They're already tracking HRV, already frustrated by the numbers-without-meaning problem, and already primed for exactly the layer Notice adds.

### Appendix C: On-Device Technical Path

**id:** `on-device`
**title:** `On-Device Technical Path`

**Content:**

The north star is every reflection tier running locally — no API dependency, no data disclosure, no marginal cost per reflection.

**Runtime reality.** MLX is blocked for 3B models on iPhone. MLX's memory overhead (~15 GB for Llama 3.2 3B 4-bit vs. llama.cpp's ~3.67 GB) stems from three architectural decisions: no memory-mapped weight loading, an aggressive buffer cache that never returns memory to the OS, and per-operation Metal buffer allocation for intermediates. The theoretical minimum for Llama 3.2 3B at 4-bit with 1K context is ~1.95 GB; llama.cpp gets within 25–50% of this floor. Two viable paths: llama.cpp for 3B models (4–8 second generation, higher quality) or MLX for 1B–1.7B models (under 2 seconds, lower ceiling).

**Model candidates.** SmolLM3-3B is the leading candidate — purpose-built for on-device, strong instruction-following, Apache 2.0. Llama 3.2 3B is the safe default. Qwen3 1.7B for the MLX/small-model path. Recommendation: benchmark SmolLM3-3B via llama.cpp against Qwen3 1.7B via MLX on target hardware. Let quality evaluation decide.

**Training pipeline.** Teacher-student distillation from Claude API. Target: 1,200 reflection examples covering diverse snap sequences plus 150 correction examples that demonstrate constraint boundaries — what the model should not say. The correction examples are critical: LoRA fine-tuning on domain-specific output degrades general instruction-following if training data doesn't include instruction-following examples alongside contemplative reflections.

**Hybrid routing.** `.brief` reflections: on-device primary, cloud fallback. `.exploratory`: cloud primary for now, on-device plausible for 3B models as training data accumulates. `.daily` and `.weekly` synthesis: always cloud — requires analytical reasoning over variable-length sequences that exceeds small model capability. On-device `.brief` covers ~80% of API calls.

**Three-tier evaluation before shipping.** Tier 1: automated constraint gate (no diagnostic language, no raw biometric values, no prescriptive framing). Tier 2: LLM-as-judge scoring relational orientation, phenomenological precision, novelty, tone. Tier 3: blind A/B with experienced practitioners. Ship threshold: Tier 1 >99% pass, Tier 2 within 15% of Claude baseline, Tier 3 preference >40%.

**Long-term differentiator.** On-device LoRA adaptation: the model learns your phenomenological vocabulary, your somatic patterns, your ways of relating to experience. The personalized weights never leave the phone. This is architecturally impossible with a cloud API and represents a genuine moat — the value increases monotonically with use, tied to your specific device and practice history.

### Appendix D: Operational Timeline

**id:** `timeline`
**title:** `Operational Timeline`

**Content:**

**Table:**

| Week | Milestone | Key deliverables |
|---|---|---|
| 1 | Foundation & Feedback | Validate Foundation Models on physical hardware (interpreter <1s, context assembly <3s). Incorporate beta taxonomy feedback. Deploy Cloudflare Worker proxy with App Attest. Push new TestFlight build (sessions 11–15). Begin synthetic training corpus generation. |
| 2 | On-Device & Measurement | Ship on-device brief reflections via llama.cpp or MLX (runtime fork resolved by benchmark). Implement scaffolding decay phase 1 triggers. Begin measuring interoceptive lead time across beta cohort. Fix keyboard drawer default on debrief screen. |
| 3+ | Launch Preparation | Expand beta beyond Jhourney (QS/Reddit channels). Launch notice.tools landing page. Finalize App Store metadata and screenshots (FDA-compliant language). Privacy settings view. App Store submission. |

Each week's deliverables are gated by the previous week's outcomes. If Foundation Models latency exceeds budget, the fallback to direct framework calls is straightforward. If the on-device model doesn't meet the three-tier evaluation threshold, cloud reflections remain the primary path with no user-visible degradation.

### Appendix E: App Store Discovery

**id:** `discovery`
**title:** `App Store Discovery`

**Content:**

Keyword strategy targets low-competition, high-fit terms that no major competitor owns.

**Primary keywords:** "interoception," "somatic awareness," "HRV journal," "biofeedback journal," "felt sense." These are high-intent, low-competition — the contemplative-tech and quantified-self audiences search for them, but Calm and Headspace don't target them.

**Secondary keywords:** "body awareness," "emotional awareness," "mindful HRV."

**Avoid:** "mindfulness" and "meditation" — saturated, dominated by competitors with 8-figure marketing budgets.

**App Store subtitle (30 chars):** "Body Awareness & HRV Journal" or "Somatic Awareness Training."

**Screenshot story:** Lead with wisdom, not dashboard. First screenshot: a reflection that names something the user didn't consciously know. Second: the emotion picker with biometric context. Third: the privacy architecture diagram. The aha moment sells; the data display supports.

**Category:** Health & Fitness (primary), Lifestyle (secondary).

**Critical constraint:** No disease-specific language anywhere in metadata, descriptions, or screenshots. The FDA General Wellness Guidance classification depends on what the app says, not just what it measures.

---

## MDX Integration

In `notice-vision.mdx`, add the import at the top with the other imports:

```
import { CollapsibleAppendix } from '../../components/islands/shared/CollapsibleAppendix.tsx'
```

Then after line 185 (`*The app gets quieter as you get better. That is the design.*`), add:

```mdx
<div style={{ marginTop: '64px' }}>
  <div style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: '24px',
  }}>
    APPENDICES
  </div>

  <CollapsibleAppendix client:visible id="pricing" title="Pricing & Unit Economics">
    {/* Content from Appendix A above, written as JSX with <div> paragraphs */}
  </CollapsibleAppendix>

  <CollapsibleAppendix client:visible id="gtm" title="Go-to-Market Strategy">
    {/* Content from Appendix B above */}
  </CollapsibleAppendix>

  <CollapsibleAppendix client:visible id="on-device" title="On-Device Technical Path">
    {/* Content from Appendix C above */}
  </CollapsibleAppendix>

  <CollapsibleAppendix client:visible id="timeline" title="Operational Timeline">
    {/* Content from Appendix D above */}
  </CollapsibleAppendix>

  <CollapsibleAppendix client:visible id="discovery" title="App Store Discovery">
    {/* Content from Appendix E above */}
  </CollapsibleAppendix>
</div>
```

**Each appendix's content must be written as JSX** — `<div>` for paragraphs, `<strong>` for bold, standard `<table>/<thead>/<tbody>/<tr>/<th>/<td>` for tables. No Markdown inside the JSX children.

## Technical Constraints

- **`<div>` not `<p>`** for all paragraph-like content inside CollapsibleAppendix. PostLayout's `.post__content :global(p)` overrides island margins.
- **DM Sans** (`tokens.sans`) for all appendix text — these are structural/operational, not prose.
- **JetBrains Mono** for table headers and the "APPENDICES" eyebrow label.
- **No Cormorant Garamond** inside appendices — that's the author's prose voice. Appendices are data.
- **No external dependencies.** SVG chevron, CSS transitions, IntersectionObserver.
- **Class prefix `nv-appendix-*`** to avoid style collisions.
- **Respect `prefers-reduced-motion`** — all transitions to 0.01s.
- **Responsive:** content reads well at all breakpoints. Tables may need horizontal scroll on mobile — wrap in `overflow-x: auto` container if needed.

## Verification Checklist

- [ ] `npm run build` succeeds
- [ ] All five appendices render collapsed by default
- [ ] Clicking each toggle expands smoothly with chevron rotation
- [ ] Expanded content uses DM Sans, not Cormorant Garamond
- [ ] Tables render with mono headers and sans body text
- [ ] The emotional close ("The app gets quieter...") is visually separated from appendices
- [ ] Appendices work on mobile (420px) — no horizontal overflow on main content
- [ ] `prefers-reduced-motion` respected
- [ ] No new dependencies in package.json
- [ ] Accessibility: keyboard navigation works, aria attributes present
