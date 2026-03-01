# Session Prompt: Add CTA to Notice Vision Page

## Situation

The Notice vision essay (`src/content/writing/notice-vision.mdx`) ends with collapsible appendices but has no call-to-action. Readers who finish the page — especially those who read through the appendices — have no next step.

## Mission

Add a closing CTA section after the final `</CollapsibleAppendix>` (after line 304's closing tag) and before the closing `</div>` on line 305. The CTA has two elements:

1. **TestFlight link** — invite readers to try the beta
2. **Contact line** — open the door for conversation (investment, collaboration, feedback) without being salesy

## Content

After the last `</CollapsibleAppendix>` and before the final `</div>`, add:

```mdx
<div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-mid)', textAlign: 'center' }}>
  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem' }}>
    TRY IT
  </div>
  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: 'var(--text-mid)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
    Notice is in active beta on Apple Watch + iPhone.
  </div>
  <div style={{ marginBottom: '2rem' }}>
    <a href="https://testflight.apple.com/join/2AR4qQYp" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.08em', color: 'var(--accent)', textDecoration: 'none', padding: '0.6rem 1.5rem', border: '1px solid var(--accent)', borderRadius: '4px', transition: 'background 0.2s ease, color 0.2s ease' }}>
      Join the TestFlight →
    </a>
  </div>
  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
    If this resonates — as a user, investor, or collaborator — <a href="mailto:jthomasbrady@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>reach out</a>.
  </div>
</div>
```

## Design Rationale

- **Placement after appendices:** The most engaged readers reach here. The essay's poetic closing ("*The app gets quieter as you get better. That is the design.*") stays undisturbed.
- **"TRY IT" eyebrow label:** JetBrains Mono uppercase, matches the site's section label convention.
- **TestFlight as bordered link, not a button:** Matches the site's understated tone. No splashy CTA energy.
- **Contact line:** Uses "resonates" — an invitation, not a solicitation. Covers all audiences (user, investor, collaborator) without making any one feel targeted.
- **Email:** jthomasbrady@gmail.com
- **Typography:** Follows the strict font role separation — Mono for labels/metadata, Cormorant for the prose line.

## Technical Constraints

- No new dependencies or components
- All styling inline (consistent with how the appendix section is styled)
- Uses existing CSS custom properties from the design system
- No dark backgrounds, no pure white, no electric blue

## Verification

- [ ] `npm run build` succeeds
- [ ] CTA renders after the last appendix, before page end
- [ ] TestFlight link opens correctly: `https://testflight.apple.com/join/2AR4qQYp`
- [ ] Email link works: `mailto:jthomasbrady@gmail.com`
- [ ] Font roles correct: Mono for "TRY IT" label and contact line, Cormorant for the description
- [ ] Colors use only `--accent`, `--text-mid`, `--text-light`, `--border-mid` — no off-palette values
- [ ] Mobile: CTA is readable and centered, link is tappable
