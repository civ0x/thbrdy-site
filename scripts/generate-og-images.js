/**
 * Generate Open Graph images (1200×630) for thbrdy.dev
 *
 * - Per-essay images at public/images/og/[slug].png
 * - Per-quote card images at public/images/og/[slug]-quote-[n].png
 * - Default image at public/images/og/og-default.png
 *
 * Usage: node scripts/generate-og-images.js
 *
 * Requires: @resvg/resvg-js, js-yaml (devDependencies)
 */

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, readFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'public', 'images', 'og');
const CONTENT_DIR = resolve(ROOT, 'src', 'content', 'writing');

const WIDTH = 1200;
const HEIGHT = 630;

// Font files
const FONT_FILES = [
  resolve(__dirname, 'fonts', 'CormorantGaramond-SemiBold.ttf'),
  resolve(__dirname, 'fonts', 'CormorantGaramond-Italic.ttf'),
  resolve(__dirname, 'fonts', 'JetBrainsMono-Regular.ttf'),
];

// Design tokens
const BG = '#FAF6F0';
const TEXT = '#2C2416';
const TEXT_LIGHT = '#6B5D4F';
const TEXT_MUTED = '#9B8E80';
const ACCENT = '#B8860B';
const BORDER = 'rgba(44, 36, 22, 0.1)';
const BORDER_MID = 'rgba(44, 36, 22, 0.18)';
const TEXT_FAINT = '#C4B8AA';

// Per-project accent colors for quote cards
// glyphOpacity / mandalaOpacity tuned per-project for equal perceived contrast on #FAF6F0
const PROJECT_ACCENTS = {
  'Scholion': { accent: '#B8860B', dim: '#C4B8AA', glyphOpacity: 0.5, mandalaOpacity: 0.22 },
  'Notice':   { accent: '#2A7A6A', dim: '#5A8A80', glyphOpacity: 0.7, mandalaOpacity: 0.32 },
  'Pando':    { accent: '#2A5A8A', dim: '#A3B8CD', glyphOpacity: 0.5, mandalaOpacity: 0.22 },
  // Add future projects here
};
const DEFAULT_ACCENT = { accent: ACCENT, dim: TEXT_FAINT, glyphOpacity: 0.5, mandalaOpacity: 0.22 };

// ──────────────────────────────────────────────
// Frontmatter parsing
// ──────────────────────────────────────────────

function parseFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch {
    return null;
  }
}

function getEssays() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
  const essays = [];
  for (const file of files) {
    const filePath = resolve(CONTENT_DIR, file);
    const fm = parseFrontmatter(filePath);
    if (!fm) continue;
    const slug = file.replace(/\.mdx$/, '');
    const body = readFileSync(filePath, 'utf-8');
    essays.push({
      slug,
      title: fm.title,
      description: fm.description,
      connected_project: fm.connected_project,
      body,
    });
  }
  return essays;
}

// ──────────────────────────────────────────────
// Quote extraction from MDX
// ──────────────────────────────────────────────

function extractQuotes(essay) {
  const quotes = [];
  const regex = /<PullQuote[^>]*>([\s\S]*?)<\/PullQuote>/g;
  let match;
  let index = 1;
  while ((match = regex.exec(essay.body)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    if (text) {
      quotes.push({
        slug: essay.slug,
        title: essay.title,
        connected_project: essay.connected_project,
        index,
        text,
      });
      index++;
    }
  }
  return quotes;
}

// ──────────────────────────────────────────────
// Text wrapping (character-count heuristic)
// ──────────────────────────────────────────────

function wrapTitle(title, fontSize) {
  // Cormorant Garamond approximate character width ratios
  // At 52px: ~27px avg char width; at 44px: ~23px avg
  const charWidth = fontSize === 52 ? 27 : 23;
  const maxWidth = WIDTH - 160; // 80px margin each side
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  const words = title.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  return lines;
}

function getTitleLines(title) {
  let lines = wrapTitle(title, 52);
  let fontSize = 52;

  // If more than 2 lines at 52px, shrink to 44px
  if (lines.length > 2) {
    fontSize = 44;
    lines = wrapTitle(title, fontSize);
  }

  // Still cap at 2 lines with ellipsis
  if (lines.length > 2) {
    lines = lines.slice(0, 2);
    lines[1] = lines[1].replace(/\s+\S*$/, '') + '…';
  }

  return { lines, fontSize };
}

// ──────────────────────────────────────────────
// SVG escaping
// ──────────────────────────────────────────────

function escSvg(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ──────────────────────────────────────────────
// Essay OG image SVG
// ──────────────────────────────────────────────

function essaySvg({ title, connected_project }) {
  const { lines, fontSize } = getTitleLines(title);
  const lineHeight = fontSize * 1.2;

  // Layout: 80px top margin
  // "ESSAY" label at y=100
  // Rule at y=112
  // Title block starts at y=175 (or adjusted for centering)
  // Gold rule 24px below last title line
  // Tagline 44px below gold rule
  // "thbrdy.dev" at y=590 (60px from bottom)

  const labelY = 100;
  const ruleY = 116;

  // Title vertical start — vertically center in available space (ruleY+30 to 510)
  const availTop = ruleY + 40;
  const availBottom = 500;
  const titleBlockHeight = lines.length * lineHeight;
  const goldRuleGap = 28;
  const taglineGap = 44;
  const taglineHeight = 22;
  const totalBlock = titleBlockHeight + goldRuleGap + taglineGap + taglineHeight;
  const titleStartY = availTop + (availBottom - availTop - totalBlock) / 2 + fontSize;

  // Build label text
  const labelText = connected_project
    ? `ESSAY · ${escSvg(connected_project.toUpperCase())}`
    : 'ESSAY';

  // Title lines
  const titleEls = lines.map((line, i) =>
    `<text x="80" y="${titleStartY + i * lineHeight}"
          font-family="Cormorant Garamond" font-size="${fontSize}" font-weight="600"
          fill="${TEXT}">${escSvg(line)}</text>`
  ).join('\n  ');

  const lastTitleY = titleStartY + (lines.length - 1) * lineHeight;
  const goldRuleY = lastTitleY + goldRuleGap;
  const taglineY = goldRuleY + taglineGap;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none"
        stroke="${BORDER}" stroke-width="1" />

  <!-- ESSAY label -->
  <text x="80" y="${labelY}"
        font-family="JetBrains Mono" font-size="13" font-weight="400"
        fill="${ACCENT}" letter-spacing="3">${labelText}</text>

  <!-- Label rule -->
  <line x1="80" y1="${ruleY}" x2="${WIDTH - 80}" y2="${ruleY}"
        stroke="${BORDER_MID}" stroke-width="1" />

  <!-- Title -->
  ${titleEls}

  <!-- Gold rule -->
  <line x1="80" y1="${goldRuleY}" x2="120" y2="${goldRuleY}"
        stroke="${ACCENT}" stroke-width="2" />

  <!-- Tagline -->
  <text x="80" y="${taglineY}"
        font-family="Cormorant Garamond" font-size="22" font-style="italic"
        fill="${TEXT_LIGHT}">Making invisible structures visible and navigable</text>

  <!-- URL -->
  <text x="${WIDTH / 2}" y="590"
        font-family="JetBrains Mono" font-size="14" font-weight="400"
        fill="${TEXT_MUTED}" text-anchor="middle">thbrdy.dev</text>
</svg>`;
}

// ──────────────────────────────────────────────
// Quote card OG image SVG
// ──────────────────────────────────────────────

function wrapQuote(text, fontSize) {
  // Cormorant Garamond italic: slightly narrower than semibold
  // 36px → ~18px avg, 30px → ~15px avg, 26px → ~13px avg
  const charWidths = { 36: 18, 30: 15, 26: 13 };
  const charWidth = charWidths[fontSize] || 18;
  const maxWidth = 900; // max-w for quote text
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  return lines;
}

function getQuoteLines(text) {
  const sizes = [36, 30, 26];
  const maxLines = 5;

  for (const fontSize of sizes) {
    const lines = wrapQuote(text, fontSize);
    if (lines.length <= maxLines) {
      return { lines, fontSize };
    }
  }

  // Still too long at 26px — truncate
  const lines = wrapQuote(text, 26).slice(0, maxLines);
  lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, '') + '…';
  return { lines, fontSize: 26 };
}

function quoteCardSvg({ text, title, connected_project }) {
  const colors = PROJECT_ACCENTS[connected_project] || DEFAULT_ACCENT;
  const { lines, fontSize } = getQuoteLines(text);
  const lineHeight = fontSize * 1.45;

  // Layout: vertically centered quote with gold bars above/below
  // Bottom: essay title in mono, then "thbrdy.dev"
  const goldBarWidth = 40;
  const goldBarGap = 20;
  const titleGap = 32;
  const titleFontSize = 14;
  const urlY = 590;

  // Calculate vertical center for quote block
  const quoteBlockHeight = lines.length * lineHeight;
  const totalBlock = goldBarGap + quoteBlockHeight + goldBarGap + titleGap + titleFontSize;
  const blockStartY = (HEIGHT - totalBlock) / 2;

  const topBarY = blockStartY;
  const quoteStartY = topBarY + goldBarGap + fontSize;
  const bottomBarY = quoteStartY + (lines.length - 1) * lineHeight + goldBarGap;
  const essayTitleY = bottomBarY + titleGap;

  const quoteEls = lines.map((line, i) =>
    `<text x="${WIDTH / 2}" y="${quoteStartY + i * lineHeight}"
          font-family="Cormorant Garamond" font-size="${fontSize}" font-weight="400"
          font-style="italic" fill="${TEXT}" text-anchor="middle">${escSvg(line)}</text>`
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none"
        stroke="${BORDER}" stroke-width="1" />

  <!-- Geometric texture — bottom-right -->
  <g opacity="${colors.mandalaOpacity}" stroke="${colors.accent}" fill="none" stroke-width="1">
    <circle cx="1050" cy="500" r="60" />
    <circle cx="1050" cy="500" r="100" />
    <circle cx="1050" cy="500" r="140" />
    <line x1="1050" y1="360" x2="1050" y2="640" />
    <line x1="910" y1="500" x2="1190" y2="500" />
    <line x1="951" y1="401" x2="1149" y2="599" />
    <line x1="1149" y1="401" x2="951" y2="599" />
  </g>

  <!-- Decorative quotation mark -->
  <text x="100" y="240"
        font-family="Cormorant Garamond" font-size="200" font-weight="600"
        fill="${colors.dim}" opacity="${colors.glyphOpacity}">\u201C</text>

  <!-- Top bar -->
  <line x1="${(WIDTH - goldBarWidth) / 2}" y1="${topBarY}" x2="${(WIDTH + goldBarWidth) / 2}" y2="${topBarY}"
        stroke="${colors.accent}" stroke-width="2" />

  <!-- Quote text -->
  ${quoteEls}

  <!-- Bottom bar -->
  <line x1="${(WIDTH - goldBarWidth) / 2}" y1="${bottomBarY}" x2="${(WIDTH + goldBarWidth) / 2}" y2="${bottomBarY}"
        stroke="${colors.accent}" stroke-width="2" />

  <!-- Essay title -->
  <text x="${WIDTH / 2}" y="${essayTitleY}"
        font-family="JetBrains Mono" font-size="${titleFontSize}" font-weight="400"
        fill="${TEXT_MUTED}" text-anchor="middle">${escSvg(title)}</text>

  <!-- URL -->
  <text x="${WIDTH / 2}" y="${urlY}"
        font-family="JetBrains Mono" font-size="13" font-weight="400"
        fill="${TEXT_FAINT}" text-anchor="middle">thbrdy.dev</text>
</svg>`;
}

// ──────────────────────────────────────────────
// Default OG image SVG
// ──────────────────────────────────────────────

function defaultSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none"
        stroke="${BORDER}" stroke-width="1" />

  <text x="${WIDTH / 2}" y="250"
        font-family="Cormorant Garamond" font-size="64" font-weight="600"
        fill="${TEXT}" text-anchor="middle"
        letter-spacing="12">THOMAS BRADY</text>

  <line x1="${WIDTH / 2 - 50}" y1="285" x2="${WIDTH / 2 + 50}" y2="285"
        stroke="${ACCENT}" stroke-width="2" />

  <text x="${WIDTH / 2}" y="330"
        font-family="JetBrains Mono" font-size="16" font-weight="400"
        fill="${ACCENT}" text-anchor="middle"
        letter-spacing="8">TECHNO-VAJRAPĀṆI</text>

  <text x="${WIDTH / 2}" y="385"
        font-family="Cormorant Garamond" font-size="22" font-style="italic"
        fill="${TEXT_LIGHT}" text-anchor="middle">Making invisible structures visible and navigable</text>
</svg>`;
}

// ──────────────────────────────────────────────
// Render SVG → PNG
// ──────────────────────────────────────────────

function renderPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
    font: {
      fontFiles: FONT_FILES,
      loadSystemFonts: false,
    },
  });
  return resvg.render().asPng();
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });

// Generate default
const defaultPng = renderPng(defaultSvg());
const defaultPath = resolve(OUT_DIR, 'og-default.png');
writeFileSync(defaultPath, defaultPng);
console.log(`  ${defaultPath} (${(defaultPng.length / 1024).toFixed(1)} KB)`);

// Generate per-essay
const essays = getEssays();
for (const essay of essays) {
  const svg = essaySvg(essay);
  const png = renderPng(svg);
  const outPath = resolve(OUT_DIR, `${essay.slug}.png`);
  writeFileSync(outPath, png);
  console.log(`  ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
}

// Generate per-quote cards
let quoteCount = 0;
for (const essay of essays) {
  const quotes = extractQuotes(essay);
  for (const quote of quotes) {
    const svg = quoteCardSvg(quote);
    const png = renderPng(svg);
    const outPath = resolve(OUT_DIR, `${quote.slug}-quote-${quote.index}.png`);
    writeFileSync(outPath, png);
    console.log(`  ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
    quoteCount++;
  }
}

// ──────────────────────────────────────────────
// Diagram OG cards
// ──────────────────────────────────────────────

const DIAGRAM_DIR = resolve(ROOT, 'public', 'images', 'diagrams');

const DIAGRAM_CARDS = [
  { image: 'notice-competitive-gap.png', essay: 'notice', label: 'Competitive Gap' },
  { image: 'notice-build-timeline.png', essay: 'notice', label: 'Build Timeline' },
  { image: 'notice-interaction-flow.png', essay: 'notice', label: 'Interaction Flow' },
  { image: 'notice-architecture-diagram.png', essay: 'notice', label: 'Architecture' },
  { image: 'notice-vision-texture-grid.png', essay: 'notice-vision', label: 'Texture Grid' },
  { image: 'notice-vision-lead-time.png', essay: 'notice-vision', label: 'Lead Time' },
  { image: 'notice-vision-scaffolding-decay.png', essay: 'notice-vision', label: 'Scaffolding Decay' },
  { image: 'notice-vision-expansion-rings.png', essay: 'notice-vision', label: 'Expansion Rings' },
  { image: 'notice-vision-timeline.png', essay: 'notice-vision', label: 'Vision Timeline' },
  { image: 'coreg-evidence-map.png', essay: 'coregulation', label: 'Evidence Map' },
  { image: 'coreg-phase-gate.png', essay: 'coregulation', label: 'Phase Gate' },
  // ab-essay
  { image: 'ab-convergence-diagram.png', essay: 'ab-essay', label: 'Convergence Diagram' },
  { image: 'ab-wrong-first-flow.png', essay: 'ab-essay', label: 'Wrong-First Flow' },
  // learned-compilation
  { image: 'lc-coupling-diagram.png', essay: 'learned-compilation', label: 'Coupling Diagram' },
  { image: 'lc-landscape-quadrant.png', essay: 'learned-compilation', label: 'Landscape Quadrant' },
  { image: 'lc-nested-claims-flow.png', essay: 'learned-compilation', label: 'Nested Claims' },
  { image: 'lc-evidence-grid.png', essay: 'learned-compilation', label: 'Evidence Grid' },
  { image: 'lc-strategic-implications.png', essay: 'learned-compilation', label: 'Strategic Implications' },
  // valley-of-death
  { image: 'vod-legibility-gap.png', essay: 'valley-of-death', label: 'Legibility Gap' },
  { image: 'vod-sequential-funnel.png', essay: 'valley-of-death', label: 'Sequential Funnel' },
  { image: 'vod-maturity-switch.png', essay: 'valley-of-death', label: 'Maturity Switch' },
  { image: 'vod-coupling-mechanism.png', essay: 'valley-of-death', label: 'Coupling Mechanism' },
  { image: 'vod-case-comparison.png', essay: 'valley-of-death', label: 'Case Comparison' },
  { image: 'vod-trading-zone.png', essay: 'valley-of-death', label: 'Trading Zone' },
  // scholion
  { image: 'scholion-dependency-chain.png', essay: 'scholion', label: 'Dependency Chain' },
  { image: 'scholion-toulmin-diagram.png', essay: 'scholion', label: 'Toulmin Diagram' },
  { image: 'scholion-positioning-grid.png', essay: 'scholion', label: 'Positioning Grid' },
  { image: 'scholion-pipeline-diagram.png', essay: 'scholion', label: 'Pipeline Diagram' },
  { image: 'scholion-validation-timeline.png', essay: 'scholion', label: 'Validation Timeline' },
  { image: 'scholion-credibility-cards.png', essay: 'scholion', label: 'Credibility Cards' },
  // the-circuitry-of-science
  { image: 'scholion-decomposition-pipeline.png', essay: 'the-circuitry-of-science', label: 'Decomposition Pipeline' },
  { image: 'scholion-chen-dependency-graph.png', essay: 'the-circuitry-of-science', label: 'Chen Dependency Graph' },
  { image: 'scholion-safety-case-fragment.png', essay: 'the-circuitry-of-science', label: 'Safety Case Fragment' },
  { image: 'scholion-schema-evolution.png', essay: 'the-circuitry-of-science', label: 'Schema Evolution' },
  { image: 'scholion-competitive-gap.png', essay: 'the-circuitry-of-science', label: 'Competitive Gap' },
  { image: 'scholion-roadmap.png', essay: 'the-circuitry-of-science', label: 'Roadmap' },
];

function diagramOverlaySvg({ label, title, connected_project }) {
  const colors = PROJECT_ACCENTS[connected_project] || DEFAULT_ACCENT;
  const labelText = connected_project
    ? `DIAGRAM · ${escSvg(connected_project.toUpperCase())}`
    : 'DIAGRAM';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <!-- Label -->
  <text x="80" y="50"
        font-family="JetBrains Mono" font-size="13" font-weight="400"
        fill="${colors.accent}" letter-spacing="3">${labelText}</text>

  <!-- Label rule -->
  <line x1="80" y1="66" x2="${WIDTH - 80}" y2="66"
        stroke="${BORDER_MID}" stroke-width="1" />

  <!-- Essay title -->
  <text x="${WIDTH / 2}" y="560"
        font-family="JetBrains Mono" font-size="14" font-weight="400"
        fill="${TEXT_MUTED}" text-anchor="middle">${escSvg(title)}</text>

  <!-- URL -->
  <text x="${WIDTH / 2}" y="595"
        font-family="JetBrains Mono" font-size="13" font-weight="400"
        fill="${TEXT_FAINT}" text-anchor="middle">thbrdy.dev</text>
</svg>`;
}

async function generateDiagramCards() {
  const essayMap = {};
  for (const e of essays) {
    essayMap[e.slug] = e;
  }

  let diagramCount = 0;

  for (const card of DIAGRAM_CARDS) {
    const srcPath = resolve(DIAGRAM_DIR, card.image);
    if (!existsSync(srcPath)) {
      console.warn(`  ⚠ Skipping ${card.image} — source not found in public/images/diagrams/`);
      continue;
    }

    const essay = essayMap[card.essay];
    if (!essay) {
      console.warn(`  ⚠ Skipping ${card.image} — essay "${card.essay}" not found`);
      continue;
    }

    // Render text overlay SVG to PNG (transparent background)
    const overlaySvg = diagramOverlaySvg({
      label: card.label,
      title: essay.title,
      connected_project: essay.connected_project,
    });
    const overlayPng = renderPng(overlaySvg);

    // Resize diagram screenshot to fit within the inset box
    // Box: 1040×420, positioned at (80, 85) — below the rule, above the title
    const boxW = 1040;
    const boxH = 420;
    const boxX = 80;
    const boxY = 85;

    const diagramBuf = readFileSync(srcPath);
    const diagramMeta = await sharp(diagramBuf).metadata();
    const dw = diagramMeta.width || boxW;
    const dh = diagramMeta.height || boxH;

    // Scale to fit within box, maintaining aspect ratio
    const scale = Math.min(boxW / dw, boxH / dh);
    const fitW = Math.round(dw * scale);
    const fitH = Math.round(dh * scale);

    // Center within box
    const offsetX = boxX + Math.round((boxW - fitW) / 2);
    const offsetY = boxY + Math.round((boxH - fitH) / 2);

    // Resize the diagram
    const resizedDiagram = await sharp(diagramBuf)
      .resize(fitW, fitH, { fit: 'inside' })
      .png()
      .toBuffer();

    // Create a bordered version: 1px border around the diagram
    // Create a slightly larger canvas with the border color, then composite diagram on top
    const borderWidth = 1;
    const borderedW = fitW + borderWidth * 2;
    const borderedH = fitH + borderWidth * 2;
    const borderedDiagram = await sharp({
      create: {
        width: borderedW,
        height: borderedH,
        channels: 4,
        background: { r: 44, g: 36, b: 22, alpha: 0.1 },
      },
    })
      .composite([{
        input: resizedDiagram,
        left: borderWidth,
        top: borderWidth,
      }])
      .png()
      .toBuffer();

    // Composite everything: background → bordered diagram → text overlay
    const outName = `${card.essay}-diagram-${card.label.toLowerCase().replace(/\s+/g, '-')}.png`;
    const outPath = resolve(OUT_DIR, outName);

    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 250, g: 246, b: 240, alpha: 1 }, // #FAF6F0
      },
    })
      .composite([
        // Card border (1px inset)
        {
          input: Buffer.from(
            `<svg width="${WIDTH}" height="${HEIGHT}">
              <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}"
                    fill="none" stroke="rgba(44,36,22,0.1)" stroke-width="1" />
            </svg>`
          ),
          left: 0,
          top: 0,
        },
        // Diagram screenshot with border
        {
          input: borderedDiagram,
          left: offsetX - borderWidth,
          top: offsetY - borderWidth,
        },
        // Text overlay
        {
          input: overlayPng,
          left: 0,
          top: 0,
        },
      ])
      .png()
      .toFile(outPath);

    const stat = readFileSync(outPath);
    console.log(`  ${outPath} (${(stat.length / 1024).toFixed(1)} KB)`);
    diagramCount++;
  }

  return diagramCount;
}

const diagramCount = await generateDiagramCards();

console.log(`\nGenerated ${essays.length + 1} essay OG images + ${quoteCount} quote cards + ${diagramCount} diagram cards.`);
