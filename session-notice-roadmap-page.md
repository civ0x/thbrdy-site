# Session: Notice Roadmap Page

Read `CLAUDE.md`, `STATUS.md`, and this file, then execute.

## Situation

The Notice vision essay ("The Body Knows First") at `/notice/` is a durable argument for why Notice exists. We now want a companion **roadmap page** — a living operational document at `/notice/roadmap/` that tracks what's shipped, what's next, and what's on the horizon. This is a peer document, not subordinate to the essay.

The roadmap source content lives in the uploaded file. It has been reproduced in full below under **Content Source**.

The essay's footer/CTA area (the "TRY IT" section near the bottom of `notice-vision.mdx`) needs a small link added pointing to the roadmap.

## Mission

Two deliverables:

### 1. Create `/notice/roadmap/` page

**File:** `src/pages/notice/roadmap.astro`

**Layout:** Standalone `.astro` page using `Base.astro` layout (same pattern as `now.astro` and `about.astro`). NOT an MDX content collection entry — this is operational content, not an essay.

**Content structure — three temporal sections:**

1. **What's Shipped** — the current working product. Dense prose paragraphs. This is the "evidence we're real" section.
2. **Now** — immediate priorities. Four subsections: On-Device Reflection Model, Foundation Models Integration, Beta Support and Feedback, Engineering Resilience. Each is a substantial paragraph with bold lead-ins for sub-topics.
3. **Later** — future ideas at varying levels of definition. Six subsections: Deepening the Reflection Layer, Expanding the Emotion Taxonomy, UI/UX Evolution, Measuring What Matters, System-Initiated Awareness, Anticipatory State Navigation. These should use native HTML `<details>/<summary>` elements (NOT React — no unnecessary JS). Style them to match the CollapsibleAppendix visual language from the essay (chevron rotation, DM Sans for toggle labels, same border/padding treatment).

**Typography rules (per CLAUDE.md):**
- Cormorant Garamond for all prose paragraphs
- JetBrains Mono for section markers (eyebrow labels like "WHAT'S SHIPPED", "NOW", "LATER"), the page subtitle, the "last updated" date
- DM Sans for `<details>/<summary>` toggle labels and any structural/metadata elements
- No Cinzel (that's hero name only)

**Page header:**
- Eyebrow: `NOTICE` in JetBrains Mono, small uppercase, `--accent` color, letter-spacing 0.25em
- Title: `Roadmap` in Cormorant Garamond, large (clamp ~2rem to ~3.5rem), `--text` color
- Subtitle: The tagline from the roadmap ("A biofeedback-assisted state navigation app...") in Cormorant Garamond italic, `--text-light`, max-width ~560px
- Last updated: `February 26, 2026` in JetBrains Mono, small, `--text-muted`
- Below header: a link back to the essay: `← The Body Knows First` in JetBrains Mono, small, `--accent` color, linking to `/notice/`

**Section headers pattern:**
Each of the three major sections (Shipped / Now / Later) gets a section divider matching the site pattern:
```
[section-number — JetBrains Mono, 0.65rem, uppercase, --accent] ─────── [hr, --border-mid]
```
Use numbers: `01 WHAT'S SHIPPED`, `02 NOW`, `03 LATER`

Then an `<h2>` in Cormorant Garamond below each divider.

**Scoped styles pattern:** All styles in a `<style>` block at the bottom of the `.astro` file (Astro scoped styles). Follow the `now.astro` pattern:
- `.roadmap` wrapper: `max-width: 800px`, `margin: 0 auto`, `padding: 8rem 2rem 6rem`, `position: relative`, `z-index: 1`
- Prose paragraphs: `font-family: 'Cormorant Garamond', serif`, `font-size: 1.05rem`, `line-height: 1.7`, `color: var(--text)`, `margin-bottom: 1.25rem`
- Bold lead-ins within paragraphs: `color: var(--text)`, `font-weight: 600`
- Sub-headings (h3) within Now section: `font-family: 'Cormorant Garamond', serif`, `font-size: 1.25rem`, `font-weight: 600`, `color: var(--text)`, `margin: 2.5rem 0 1rem`

**`<details>/<summary>` styling (Later section):**
```css
.roadmap-detail {
  border-top: 1px solid var(--border-mid);
}
.roadmap-detail:last-child {
  border-bottom: 1px solid var(--border-mid);
}
.roadmap-detail summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-mid);
  list-style: none; /* remove default marker */
  transition: color 0.2s ease;
}
.roadmap-detail summary:hover {
  color: var(--accent);
}
.roadmap-detail summary::-webkit-details-marker { display: none; }
.roadmap-detail summary::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background: url("data:image/svg+xml,...") no-repeat center;
  /* chevron SVG pointing right, rotates when open */
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.roadmap-detail[open] summary::before {
  transform: rotate(90deg);
}
.roadmap-detail .detail-content {
  padding: 0 0 24px 26px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-mid);
}
```

For the chevron SVG in the `::before` pseudo-element, use this inline SVG data URI (matching the CollapsibleAppendix chevron):
```
data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' fill='none' stroke='%234A3D30' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 2l5 5-5 5'/%3E%3C/svg%3E
```

Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .roadmap-detail summary::before {
    transition-duration: 0.01s;
  }
}
```

**Responsive:** Content naturally reflows at narrow widths since it's mostly prose. Ensure `padding: 8rem 1.25rem 4rem` below 640px.

**Page metadata for Base.astro:**
- `title`: "Notice — Roadmap"
- `description`: "What's shipped, what's next, and where Notice is headed. A living document."

### 2. Add roadmap link to essay CTA area

**File:** `src/content/writing/notice-vision.mdx`

In the "TRY IT" footer section (the `<div style={{ marginTop: '4rem', ... }}>` block near line 188), add a roadmap link **below** the "If this resonates..." line and **above** the APPENDICES section. Something like:

```jsx
<div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-light)', letterSpacing: '0.04em', marginTop: '1rem' }}>
  See where we're headed: <a href="/notice/roadmap/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Roadmap →</a>
</div>
```

Place it after the "reach out" div (line ~202) and before the APPENDICES div (line ~205).

## Content Source

The full roadmap content to be transformed into the page follows. Convert markdown formatting to HTML: bold text becomes `<strong>`, paragraphs become `<p>` tags (inside the main prose sections) or `<div>` tags (inside `<details>` content, to avoid PostLayout margin conflicts — though this page doesn't use PostLayout, staying consistent is fine). Code references become `<code>`.

Note: The roadmap has an "API proxy and key management (decided)" subsection under Engineering Resilience. Include it but mark it as resolved — perhaps with a subtle "(resolved)" label or lighter text treatment.

---

### What's Shipped

Notice is in closed beta via TestFlight with 8+ testers from the Jhourney contemplative community. The core loop works end-to-end: tap your Watch (or phone) when you notice a shift → the app captures biometric context → you debrief with a felt-sense emotion picker → Claude generates a contemplative reflection grounded in your patterns.

Fifteen development sessions have produced:

**The core snap-debrief-reflection loop.** Watch tap or phone floating action button captures a Frame Snap with heart rate and HRV from HealthKit. The phone FAB (iOS 26 liquid glass) means you don't need a Watch to use Notice — it's a full-loop experience on iPhone alone. Debrief screen features a description-first layout and a two-layer felt-sense picker organized by somatic texture (Alive, Settled, Open, Heavy, Stirred, Tight — six groups × three emotion labels each, grounded in Gendlin's Focusing). Claude streams a contemplative reflection using a system prompt built on Jhourney pedagogy — orienting toward how you're relating to experience, never prescribing what to feel.

**Three tiers of AI reflection.** Brief reflections at snap time (one sentence, oriented toward conductivity). Exploratory reflections during debrief (a paragraph, oriented toward curiosity). Daily and weekly synthesis reflections that surface longitudinal patterns across snaps — built hierarchically so weekly reflections consume daily syntheses rather than re-aggregating raw data.

**On-device intelligence via Apple Foundation Models.** A two-tier AI architecture: Tier 1 (Apple Foundation Models, on-device) handles context assembly — reading HealthKit trends, calendar, location, recent snaps, and producing a structured summary that strips all absolute values and identifying details. Tier 2 (Claude via cloud) sees only those summaries. The on-device interpreter runs in under a second. Context assembly completes in under three seconds. Nothing raw leaves the phone.

**Voice-initiated snaps.** Siri and AirPods integration for hands-free capture. "Hey Siri, I noticed something" triggers a Frame Snap without looking at a screen — critical for capturing shifts during activities where pulling out a phone breaks the moment.

**Stateless API proxy.** A Cloudflare Worker sits between the app and the Claude API, holding the API key server-side and validating device identity via Apple's App Attest before forwarding any request. No on-device key storage, rotation without app updates, per-device rate limiting.

**Privacy architecture as compliance strategy.** Raw health data stays on-device. Only structured summaries transit through the proxy. This isn't just a privacy choice — it's a regulatory strategy that keeps Notice within the FDA's General Wellness Guidance and limits FTC Health Breach Notification Rule exposure.

---

### Now

#### On-Device Reflection Model

The highest-leverage technical milestone. Moving `.brief` reflections on-device eliminates the largest cost center (~80% of API calls), makes the Core pricing tier viable at zero marginal cost, and delivers the privacy promise in its fullest form.

**Runtime reality.** MLX is currently blocked for 3B models on iPhone due to memory overhead (~15 GB for Llama 3.2 3B 4-bit vs. llama.cpp's ~3.67 GB). Two viable paths: llama.cpp for 3B models (4–8 second generation, higher quality) or MLX for 1B–1.7B models (under 2 seconds, lower ceiling).

**Model candidates.** SmolLM3-3B is the leading candidate — purpose-built for on-device, strong instruction-following, Apache 2.0. Llama 3.2 3B is the safe default. Qwen3 1.7B for the MLX/small-model path. Recommendation: benchmark SmolLM3-3B via llama.cpp against Qwen3 1.7B via MLX on target hardware.

**Training pipeline.** Teacher-student distillation from Claude API. Target: 1,200 reflection examples plus 150 correction examples that demonstrate constraint boundaries. The correction examples are critical — LoRA fine-tuning on domain-specific output degrades general instruction-following without them.

**Hybrid routing.** `.brief` reflections: on-device primary, cloud fallback. `.exploratory`: cloud primary for now. `.daily` and `.weekly` synthesis: always cloud. On-device `.brief` covers ~80% of API calls.

**Three-tier evaluation.** Tier 1: automated constraint gate (no diagnostic language, no raw biometric values, no prescriptive framing). Tier 2: LLM-as-judge scoring relational orientation, phenomenological precision, novelty, tone. Tier 3: blind A/B with experienced practitioners. Ship threshold: Tier 1 >99% pass, Tier 2 within 15% of Claude baseline, Tier 3 preference >40%.

#### Foundation Models Integration

Apple's on-device Foundation Models need hardware validation. The interpreter should complete in under one second, context assembly in under three seconds — on physical devices, not simulators. If latency exceeds budget, fallback to direct framework calls is straightforward. Adapted Tool infrastructure exists for HealthKit, Calendar, Location, and recent snap retrieval. The key unknown: how the interpreter performs with complex multi-source assembly instructions on A17/A18 silicon under real memory pressure from HealthKit background delivery.

#### Beta Support and Feedback

**Structured feedback capture.** TestFlight's built-in mechanism loses context. A lightweight in-app mechanism (shake to report, or a prompt after the 5th snap) captures context-rich feedback at the moment of use. The taxonomy resonance question — "which words do you actually reach for?" — is both a research question and an explicit feedback prompt.

**Tester segmentation.** Not all testers are the same. Experienced meditators push the felt-sense vocabulary hard; newer practitioners surface onboarding friction. A simple tracking table (practice background, device/Watch pairing, Apple Intelligence availability) lets you interpret feedback correctly.

**Lapsed tester outreach.** The most valuable beta data isn't what active users do — it's why people stop. A simple email (not push notification) to lapsed testers surfaces the mundane friction that kills adoption. One lapsed-tester interview is worth twenty active-user feature requests.

**Bug reproduction context.** A lightweight diagnostic log (stored locally, shared only on user-initiated report) capturing app state transitions and error codes — never snap content, emotion labels, or biometric data.

#### Engineering Resilience

**Degraded and offline behavior.** What happens when the Claude API is unreachable? When HealthKit returns no recent samples? When the Watch disconnects mid-snap? Snaps must capture and persist regardless. Each failure mode needs an explicit design: no-network (queue reflections), no-HealthKit-data (snap without biometrics), Watch-disconnect (phone-side snap still works), API-error (retry with backoff).

**API cost control.** Per-user usage budgets, a soft daily cap on exploratory reflections, batching daily synthesis to a single API call, and monitoring token usage per user during beta to establish the cost curve before setting prices.

**Crash reporting under privacy constraints.** Most third-party crash reporting SDKs are risky under the FTC Health Breach Notification Rule. Apple's built-in crash reports via Xcode Organizer are the path of least resistance — no third-party SDK, data stays within Apple's ecosystem. MetricKit for performance diagnostics. No third-party analytics or crash reporting SDKs unless they can be proven to never exfiltrate health-adjacent data.

**SwiftData schema migration planning.** Document the expected schema evolution now — future features will require new model fields and relationships. SwiftData lightweight migrations handle additive changes, but anything more complex needs explicit migration plans.

**API proxy and key management (resolved).** Cloudflare Worker proxy with App Attest attestation. Eliminates all on-device key storage, enables rotation without app updates, provides per-device rate limiting and abuse detection, adds a server-side kill switch.

---

### Later — Deepening the Reflection Layer

**Scaffolding decay.** The central design challenge beyond the MVP. Three phases: Full support (reflections after every snap, active suggestions, full biometric context), Reduced (reflections on-demand, simplified biometric display, suggestions fade), Minimal (no automatic reflections, the app becomes a quiet archive). Phase transitions triggered by behavioral signals — snap count thresholds, label diversity ceiling, biometric-label convergence — and confirmed by the user. The app never decides for you that you're ready.

**Snap depth calibration.** Claude adapts reflection depth based on accumulated data density. Three tiers: Sparse (1–3 snaps, no pattern claims), Thin (4–15 snaps, tentative pattern observations), Rich (20+, full vocabulary). Prevents the most common failure mode: making confident claims about patterns that don't exist in the data.

**Biometric-label divergence detection.** When the user's subjective label diverges from biometric data, the gap itself is information. Claude treats the user's felt sense as primary and frames the biometric data as a mirror. Over time, divergence patterns may reveal interoceptive blind spots or growing precision.

**Dam Model pattern detection.** Claude's system prompt includes vocabulary for suppression-explosion oscillation, narrow emotional range, absence patterns, and rigidity. The deeper work is calibrating sensitivity.

**Memory reconsolidation support.** Notice shouldn't guide active reconsolidation — that's clinical work. But the app may quietly build prerequisite capacities: mapping dams, developing relational stance, training felt-sense precision.

**View interventions.** Beyond frame-spotting, Claude can surface the meta-level view users bring to the practice itself. Detection signals: asymmetric emotion distribution, fix/solve/manage language in notes, absence of snaps during neutral states.

### Later — Expanding the Emotion Taxonomy

**Custom emotion labels.** The 18-word taxonomy is scaffolding designed to eventually feel inadequate. When users start adding notes that contradict their label, that's the decay signal. Custom labels let advanced practitioners add their own vocabulary — contemplative-specific terms like pīti, vedanā, somatic descriptors. Tagged as user-generated in the data model so Claude can handle them.

### Later — UI/UX Evolution

**Floating emotion labels — the lazy river.** The current grid treats emotion labeling as a selection task. The contemplative reframe: labeling is a noticing task. Labels float across the screen in a gentle drift. The user watches and taps when one resonates. Based on Shinzen Young's See Hear Feel noting system. The philosophical difference: the grid says "what are you feeling? choose one." The lazy river says "what do you notice passing through?"

**Buttons as first-class interaction.** The debrief screen should lead with tappable elements, not text entry. Emotion picker as hero, note field secondary.

**Design language.** Warm, reflective, unhurried. Type scale with serif for reflections (contemplative voice) and sans for labels (instrument voice). Dark mode that feels like candlelight, not a dashboard.

**Debrief screen evolution.** Three horizons: near-term (fix keyboard default, make emotion picker hero), mid-term (lazy river, subtle texture-group animations), long-term (debrief as contemplative micro-ritual).

### Later — Measuring What Matters

**Interoceptive lead time.** The single most innovative metric Notice could surface. The temporal gap between biometric shift and conscious noticing is measurable and trainable. Shrinking that gap is interoceptive development. This gives Notice: a training outcome that isn't a score, a scaffolding decay signal grounded in what the app actually trains, a data moat no competitor can replicate, and a research contribution validatable against MAIA-2 assessments.

**Outcome measurement.** Behavioral proxies already implicit in the data: emotion label diversity, snap frequency patterns, biometric-label convergence. Formal validated assessments (MAIA-2, FFMQ-15) as optional periodic check-ins.

### Later — System-Initiated Awareness

**Passive biometric anomaly detection.** When background HRV monitoring detects a significant shift, surface a Smart Stack widget: "Your body shifted — did you notice something?" Philosophically delicate — the app trains self-initiated noticing, not dependency on prompts.

### Later — Anticipatory State Navigation

**Bidirectional awareness.** Longitudinal snap data combined with calendar context enables a prospective mode. Pattern-informed prompts based on the user's own snap history — not generic calendar-triggered wellness reminders. The user learns to read their own anticipatory body states. Scaffolding decay applies with particular force here: if the user develops the capacity to feel upcoming shifts independently, the prompts should reduce and stop.

---

## Verification Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] `/notice/roadmap/` renders with `--bg: #FAF6F0` background
- [ ] Page header: eyebrow in JetBrains Mono, title in Cormorant Garamond, subtitle in Cormorant Garamond italic
- [ ] Section dividers match site pattern (JetBrains Mono number + hr)
- [ ] Prose renders in Cormorant Garamond, not sans or mono
- [ ] `<details>/<summary>` elements in Later section styled with chevron, DM Sans toggle labels
- [ ] All `<details>` expand/collapse correctly
- [ ] Chevron rotates on open (CSS `transform: rotate(90deg)`)
- [ ] `prefers-reduced-motion` respected on chevron transition
- [ ] Back-link to `/notice/` present and working
- [ ] Essay CTA area has roadmap link before APPENDICES section
- [ ] `/notice/` still renders correctly (no routing conflict with `/notice/roadmap/`)
- [ ] Mobile: padding adjusts, no horizontal scroll, details elements usable
- [ ] No new JS dependencies added
- [ ] No React hydration needed on this page (vanilla HTML/CSS only)
