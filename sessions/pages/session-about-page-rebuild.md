# Session Prompt: About Page Rebuild — Resume → Narrative Bio

## Situation

The about page (`src/pages/about.astro`) is currently a resume-formatted page with experience cards, skills grid, marks, and lineage sections. It's being replaced with a first-person narrative bio with inline photos. The resume is now a downloadable PDF.

## Mission

Replace the about page with a photo-driven narrative bio. The prose flows between documentary photos that serve as section breaks. No section dividers (01 — Path, etc.). No experience cards, skills grid, marks, or lineage sections. The page is entirely prose + photos + a resume PDF link at the bottom.

## Pre-requisites

**Before executing this session, verify that the following photos exist in `public/images/about/`:**

| Filename | Description |
|----------|-------------|
| `sfrc-staff-2001.jpg` | Senate Foreign Relations Committee group photo, 2001 |
| `dharamsala-2004.jpg` | Thomas with the Dalai Lama, Dharamsala, India, 2004 |
| `iraq-turret-2007.jpg` | Sepia-toned turret photo, Iraq, 2007 (LEAD military photo) |
| `iraq-standing-2007.jpg` | Standing in FOB, Iraq, 2007 |
| `iraq-satellite-2007.jpg` | With satellite dish/weapons, Iraq, 2007 |
| `philippines-sniper-school.jpg` | With Filipino Marines, sniper school, Philippines |
| `uw-rugby-2013.jpg` | Post-game with black eye, UW Rugby, ~2013 |
| `post-hospital-2024.jpg` | Mirror selfie post-hospitalization, November 2024 |
| `oakland-2026.jpg` | Current headshot, whiteboard + cherry blossoms, 2026 |
| `kalavajra.jpg` | Dark grey Vanagon with roof rack, Oakland street |

Also verify: `public/Thomas_Brady_CV.pdf` exists (the downloadable resume).

If any photos are missing, **stop and report** — do not proceed with placeholder images.

## Narrative Content

The complete bio prose (first person, Cormorant Garamond). Copy this verbatim — do not edit the prose:

---

**[After SFRC photo]**

I'm from a small town in North Carolina. My first real job was on the Senate Foreign Relations Committee — I was eighteen, still in college, studying Chinese and working Asia-Pacific policy for Chairman Jesse Helms. In 2000 I took a semester at Peking University and traveled to Lhasa. By twenty-two I was running foreign policy portfolios for Senator Sam Brownback, observing elections in Nigeria, and crossing Central Asia and the Middle East as his advisor.

On September 11, 2001, my apartment was across the highway from the Pentagon. It filled with smoke. A month later, my office building was the one in the anthrax attack — shuttered for six months. The world I'd been analyzing from committee hearing rooms had come home.

**[After Dharamsala photo]**

A Congressional trip to Dharamsala in 2004 put me in front of the Dalai Lama. Something about that encounter stayed — not as a practice yet, but as a question. The idea that the mind could be studied from the inside with the same rigor you'd bring to any other system. It would take fifteen years before I sat down to actually do it.

I went to the Defense Intelligence Agency after that, writing strategic assessments of Chinese military leadership. It was good work. But the world had changed, and I'd changed with it. So at twenty-five I quit and enlisted in the United States Army with the intent of joining Special Forces.

**[After Iraq turret photo]**

Basic training. Airborne school. Special Forces Assessment and Selection. Two years of pipeline — 18E, Special Forces communications sergeant: satellite systems, cryptography, a year of intensive Mandarin. Iraq in 2007. On a JCET to Nepal, I used computer modeling to simulate atmospheric conditions and bounced an HF radio signal 7,000 miles from Kathmandu to Fort Lewis — five times the equipment's rated range. Then I cross-trained to 18F, intelligence sergeant, and in 2010 spent nine months on the island of Jolo in the Philippines, which was as wild as it sounds.

**[After Philippines + Iraq 2-up photos]**

Special Forces taught me the thing I keep coming back to: systems under real pressure reveal their actual structure. The doctrine, the org chart, the plan — those are approximations. What matters is the dependency structure underneath: who needs what from whom, what breaks first. *Slow is smooth, smooth is fast* isn't a slogan. It's an epistemological claim.

**[After rugby photo]**

I left the Army at thirty-four. Back to UW — finished my degree, picked up Chinese again, played rugby, collected black eyes with my buddy Shane, a former Ranger. Then back to Washington one last time: defense policy for Senator Tom Cotton, Armed Services Committee, traveling Korea, Taiwan, and Singapore in the middle of the biggest national security debates of the mid-2010s.

After that I left the Hill for good. The technology chapter — AWS, then H2O.ai — was where the pattern became undeniable. Whether I was translating ML research into products or helping shape early LLM efforts, the hardest problem was never the technology. It was making invisible dependencies legible to the people who needed to act on them.

**[After post-hospitalization photo]**

In 2022 I stopped. Twenty years of nonstop work — Senate, Special Forces, Iraq, the Philippines, the Senate again, AWS, H2O. I started my own thing. Then in 2024, severe acute necrotizing pancreatitis put me in the ICU for four months. Twenty-four blood transfusions. Dialysis. A hundred pounds lost.

**[After "today" photo]**

I came out lighter — in every sense.

Now I build tools. [Scholion](/writing/scholion/) maps epistemic dependencies in scientific reasoning. [Notice](/notice/) trains interoceptive awareness through the Apple Watch. Both do what I've been doing in every chapter: making invisible structures visible and navigable.

The seed from Dharamsala finally took root about five years ago. I meditate daily. I'm not a Buddhist scholar, but the practice is central to how I think and build — studying the mind from the inside turns out to be the same work as mapping dependencies in a paper or tracking states on a watch face.

I still play rugby. I live in Oakland. I'm restoring a Vanagon named Kalavajra.

**[Vanagon photo]**

**[Resume PDF link at bottom]**

---

## Page Structure (Astro)

Replace the entire content of `src/pages/about.astro`. The new structure:

```
<Base title="About — Thomas Brady" description="The long way around to making invisible structures visible.">
  <article class="about">
    <!-- Photo: SFRC staff -->
    <figure class="about__photo about__photo--full">
      <img src="/images/about/sfrc-staff-2001.jpg" alt="Senate Foreign Relations Committee staff photo, 2001" loading="eager" />
      <figcaption>Senate Foreign Relations Committee staff, 2001.</figcaption>
    </figure>

    <!-- Prose block 1: NC, Senate, 9/11 -->
    <div class="about__prose">
      <p>...</p>
      <p>...</p>
    </div>

    <!-- Photo: Dharamsala -->
    <figure class="about__photo about__photo--inset">
      <img src="/images/about/dharamsala-2004.jpg" alt="With the Dalai Lama in Dharamsala, India, 2004" loading="lazy" />
      <figcaption>Dharamsala, India, 2004.</figcaption>
    </figure>

    <!-- Prose block 2: Dharamsala, DIA, enlistment -->
    <div class="about__prose">
      <p>...</p>
      <p>...</p>
    </div>

    <!-- Photo: Iraq turret (LEAD) -->
    <figure class="about__photo about__photo--full">
      <img src="/images/about/iraq-turret-2007.jpg" alt="Iraq, 2007, 1st Special Forces Group" loading="lazy" />
      <figcaption>Iraq, 2007. 1st Special Forces Group.</figcaption>
    </figure>

    <!-- Prose block 3: SF pipeline, Nepal, Philippines -->
    <div class="about__prose">
      <p>...</p>
    </div>

    <!-- Photos: 2-up cluster -->
    <div class="about__photo-pair">
      <figure class="about__photo">
        <img src="/images/about/philippines-sniper-school.jpg" alt="Teaching sniper school, Philippines" loading="lazy" />
        <figcaption>Jolo, Philippines, 2010.</figcaption>
      </figure>
      <figure class="about__photo">
        <img src="/images/about/iraq-standing-2007.jpg" alt="Iraq, 2007" loading="lazy" />
        <figcaption>Iraq, 2007.</figcaption>
      </figure>
    </div>

    <!-- Prose block 4: SF lesson -->
    <div class="about__prose">
      <p>...</p>
    </div>

    <!-- Photo: Rugby -->
    <figure class="about__photo about__photo--inset">
      <img src="/images/about/uw-rugby-2013.jpg" alt="University of Washington Rugby, 2013" loading="lazy" />
      <figcaption>University of Washington Rugby, 2013.</figcaption>
    </figure>

    <!-- Prose block 5: UW, Cotton, tech -->
    <div class="about__prose">
      <p>...</p>
      <p>...</p>
    </div>

    <!-- Photo: Post-hospitalization (smaller) -->
    <figure class="about__photo about__photo--small">
      <img src="/images/about/post-hospital-2024.jpg" alt="November 2024" loading="lazy" />
      <figcaption>November 2024.</figcaption>
    </figure>

    <!-- Prose block 6: Stop, crisis -->
    <div class="about__prose">
      <p>...</p>
    </div>

    <!-- Photo: Today -->
    <figure class="about__photo about__photo--full">
      <img src="/images/about/oakland-2026.jpg" alt="Oakland, 2026" loading="lazy" />
      <figcaption>Oakland, 2026.</figcaption>
    </figure>

    <!-- Prose block 7: Now, meditation, close -->
    <div class="about__prose">
      <p>...</p>
      <p>...</p>
      <p>...</p>
    </div>

    <!-- Photo: Kalavajra (the van) -->
    <figure class="about__photo about__photo--full">
      <img src="/images/about/kalavajra.jpg" alt="Kalavajra, a dark grey Vanagon with roof rack, parked on an Oakland street" loading="lazy" />
      <figcaption>Kalavajra, Oakland.</figcaption>
    </figure>

    <!-- Resume link -->
    <div class="about__resume">
      <a href="/Thomas_Brady_CV.pdf" target="_blank" rel="noopener">Résumé (PDF)</a>
    </div>
  </article>
</Base>
```

## CSS Specification

### Layout

```css
.about {
  position: relative;
  z-index: 1;
  max-width: 720px;        /* Slightly narrower than 800px for better prose measure */
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
}
```

### Prose blocks

```css
.about__prose {
  margin: 2.5rem 0;
}

.about__prose p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text);
  margin-bottom: 1.25rem;
}

.about__prose p:last-child {
  margin-bottom: 0;
}

.about__prose em {
  font-style: italic;
}
```

### Photo treatments

```css
/* Shared photo styles */
.about__photo {
  margin: 2.5rem 0;
}

.about__photo img {
  width: 100%;
  height: auto;
  display: block;
  filter: sepia(0.08) saturate(0.9);   /* Subtle warm unification across 25 years of cameras */
}

.about__photo figcaption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-top: 0.75rem;
  text-align: center;
}

/* Full-width photos (SFRC, Iraq turret, Today) */
.about__photo--full {
  margin: 3rem -2rem;      /* Break out of prose column slightly */
}

.about__photo--full img {
  width: calc(100% + 4rem);
  max-width: none;
}

/* Inset photos (Dharamsala, Rugby) — centered, not full width */
.about__photo--inset {
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* Small photos (hospitalization) — intimate scale */
.about__photo--small {
  max-width: 320px;
  margin-left: 0;          /* Left-aligned, not centered */
}

/* 2-up photo cluster (Philippines + Iraq) */
.about__photo-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2.5rem 0;
}

.about__photo-pair .about__photo {
  margin: 0;
}
```

### Resume link

```css
.about__resume {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.about__resume a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-glow);
  padding-bottom: 2px;
}

.about__resume a:hover {
  border-bottom-color: var(--accent);
}
```

### Scroll animation

Apply the existing `.reveal` pattern from `global.css` to each `about__photo` and `about__prose` block. Photos and prose blocks fade in on scroll, same as the rest of the site.

### Responsive

```css
@media (max-width: 640px) {
  .about {
    padding: 6rem 1.5rem 4rem;
  }

  .about__photo--full {
    margin: 2rem -1.5rem;
  }

  .about__photo--full img {
    width: calc(100% + 3rem);
  }

  .about__photo--inset {
    max-width: 100%;
  }

  .about__photo--small {
    max-width: 260px;
  }

  .about__photo-pair {
    grid-template-columns: 1fr;
  }
}
```

## Technical Constraints

- No new dependencies. No image processing libraries.
- Photos are served as static assets from `public/images/about/`. No build-time processing.
- Use `loading="eager"` on the first photo (SFRC), `loading="lazy"` on all others.
- `<img>` tags must have descriptive `alt` attributes.
- The `filter: sepia(0.08) saturate(0.9)` on images is a subtle unification — photos span 25 years of camera quality. If it looks wrong on any specific photo, it can be removed.
- The Scholion and Notice links in the prose are standard `<a>` tags, not Astro components.
- The `about__photo--full` negative margin approach assumes padding on `.about` — verify the math works. If the full-bleed photos cause horizontal scroll, constrain with `overflow: hidden` on `.about` or switch to `width: 100%` without negative margins.
- Respect `prefers-reduced-motion`: if scroll animations are disabled, elements should be visible by default.

## What's Removed

The entire existing about page content:
- All `.exp-card` experience cards (7 total)
- `.skills-grid` (Instruments section)
- `.marks` section
- `.lineage` section
- All section dividers (01 — Path, 02 — Instruments, 03 — Marks, 04 — Lineage)
- All associated CSS for the above components

## Verification Checklist

- [ ] `npm run build` passes with zero errors
- [ ] Page renders with `--bg: #FAF6F0` background (no white)
- [ ] All 10 photos load (check network tab — no 404s)
- [ ] Photos have warm unification filter applied
- [ ] Prose renders in Cormorant Garamond, not sans/mono
- [ ] Captions render in JetBrains Mono, `--text-muted` color
- [ ] Photo-pair displays as 2-column grid on desktop, stacks on mobile
- [ ] Hospitalization photo is smaller/left-aligned, not full width
- [ ] Full-width photos break out of prose column properly (no horizontal scroll)
- [ ] Resume PDF link works and opens in new tab
- [ ] Scholion link → `/writing/scholion/`, Notice link → `/notice/`
- [ ] Scroll animations work (reveal pattern)
- [ ] `prefers-reduced-motion` respected
- [ ] Mobile: all photos stack, no horizontal scroll, readable prose
- [ ] Nav links still work, About link still active
