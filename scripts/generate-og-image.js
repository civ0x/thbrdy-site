/**
 * Generate default Open Graph image (1200×630) for thbrdy.dev
 *
 * Usage: node scripts/generate-og-image.js
 *
 * Requires: @resvg/resvg-js (devDependency)
 * Output:   public/images/og-default.png
 */

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#FAF6F0" />

  <!-- Subtle border -->
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none"
        stroke="rgba(44, 36, 22, 0.1)" stroke-width="1" />

  <!-- Name: THOMAS BRADY — serif, uppercase, wide tracking -->
  <text x="${WIDTH / 2}" y="250"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="64" font-weight="400"
        fill="#2C2416" text-anchor="middle"
        letter-spacing="12">THOMAS BRADY</text>

  <!-- Gold rule -->
  <line x1="${WIDTH / 2 - 50}" y1="285" x2="${WIDTH / 2 + 50}" y2="285"
        stroke="#B8860B" stroke-width="2" />

  <!-- TECHNO-VAJRAPĀṆI — monospace, small caps style -->
  <text x="${WIDTH / 2}" y="330"
        font-family="'Courier New', Courier, monospace"
        font-size="16" font-weight="400"
        fill="#B8860B" text-anchor="middle"
        letter-spacing="8">TECHNO-VAJRAPĀṆI</text>

  <!-- Tagline — serif italic -->
  <text x="${WIDTH / 2}" y="385"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="22" font-style="italic"
        fill="#6B5D4F" text-anchor="middle">Making invisible structures visible and navigable</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const outPath = resolve(__dirname, '..', 'public', 'images', 'og-default.png');
writeFileSync(outPath, pngBuffer);

const sizeKB = (pngBuffer.length / 1024).toFixed(1);
console.log(`Generated ${outPath} (${WIDTH}×${HEIGHT}, ${sizeKB} KB)`);
