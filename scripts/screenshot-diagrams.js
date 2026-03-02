#!/usr/bin/env node

/**
 * Capture diagram screenshots from essay pages.
 *
 * Uses puppeteer-core with system Chrome. Sets prefers-reduced-motion: reduce
 * so all useInView hooks fire immediately (no scrolling needed).
 *
 * Usage:
 *   npm run screenshots
 *   CHROME_PATH=/path/to/chrome npm run screenshots
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(ROOT, 'public/images/diagrams');
const PORT = 4399;
const BASE_URL = `http://localhost:${PORT}`;

// ── Chrome path discovery ─────────────────────────────────────────────

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  throw new Error(
    'Chrome not found. Set CHROME_PATH environment variable to your Chrome/Chromium binary.'
  );
}

// ── Diagram inventory ─────────────────────────────────────────────────
// Grouped by page to minimize navigations.
// Deduplicated: components reused across pages are captured once.

const PAGES = [
  {
    url: '/writing/notice/',
    diagrams: [
      { selector: '.notice-gap', name: 'notice-competitive-gap' },
      { selector: '.notice-timeline', name: 'notice-build-timeline' },
      { selector: '.notice-flow', name: 'notice-interaction-flow' },
      { selector: '.notice-arch', name: 'notice-architecture-diagram' },
    ],
  },
  {
    url: '/notice/',
    diagrams: [
      // Reused components already captured from /writing/notice/ — skip
      { selector: '.nvtg-root', name: 'notice-vision-texture-grid' },
      { selector: '.nvlt-root', name: 'notice-vision-lead-time' },
      { selector: '.nvsd-root', name: 'notice-vision-scaffolding-decay' },
      { selector: '.nver-root', name: 'notice-vision-expansion-rings' },
      { selector: '.nvtl-root', name: 'notice-vision-timeline' },
    ],
  },
  {
    url: '/writing/coregulation/',
    diagrams: [
      { selector: '.coreg-evidence', name: 'coreg-evidence-map' },
      { selector: '.coreg-phase', name: 'coreg-phase-gate' },
    ],
  },
  {
    url: '/writing/ab-essay/',
    diagrams: [
      { selector: '.ab-convergence', name: 'ab-convergence-diagram' },
      { selector: '.ab-wrongfirst', name: 'ab-wrong-first-flow' },
    ],
  },
  {
    url: '/writing/learned-compilation/',
    diagrams: [
      { selector: '.lc-coupling', name: 'lc-coupling-diagram' },
      { selector: '.lc-landscape', name: 'lc-landscape-quadrant' },
      { selector: '.lc-claims', name: 'lc-nested-claims-flow' },
      { selector: '.lc-evidence', name: 'lc-evidence-grid' },
      { selector: '.lc-strat', name: 'lc-strategic-implications' },
    ],
  },
  {
    url: '/writing/valley-of-death/',
    diagrams: [
      { selector: '.vod-legibility-root', name: 'vod-legibility-gap' },
      { selector: '.vod-funnel-root', name: 'vod-sequential-funnel' },
      { selector: '.vod-maturity-root', name: 'vod-maturity-switch' },
      { selector: '.vod-coupling-root', name: 'vod-coupling-mechanism' },
      { selector: '.vod-case-root', name: 'vod-case-comparison' },
      { selector: '.vod-trading-root', name: 'vod-trading-zone' },
    ],
  },
  {
    url: '/writing/scholion/',
    diagrams: [
      { selector: '.scholion-chain', name: 'scholion-dependency-chain' },
      { selector: '.scholion-toulmin', name: 'scholion-toulmin-diagram' },
      { selector: '.scholion-positioning', name: 'scholion-positioning-grid' },
      { selector: '.scholion-pipeline', name: 'scholion-pipeline-diagram' },
      { selector: '.scholion-validation', name: 'scholion-validation-timeline' },
      { selector: '.scholion-credibility', name: 'scholion-credibility-cards' },
    ],
  },
  {
    url: '/writing/the-circuitry-of-science/',
    diagrams: [
      { selector: '.scholion-pipe', name: 'scholion-decomposition-pipeline' },
      { selector: '.chen-graph', name: 'scholion-chen-dependency-graph' },
      { selector: '.scf', name: 'scholion-safety-case-fragment' },
      { selector: '.scholion-evo', name: 'scholion-schema-evolution' },
      { selector: '.scholion-comp-gap', name: 'scholion-competitive-gap' },
      { selector: '.scholion-roadmap', name: 'scholion-roadmap' },
    ],
  },
];

// ── Dev server lifecycle ──────────────────────────────────────────────

function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeout = setTimeout(() => {
      server.kill();
      reject(new Error('Dev server failed to start within 30s'));
    }, 30000);

    server.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.includes('Local') || text.includes(`localhost:${PORT}`)) {
        clearTimeout(timeout);
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      const text = data.toString();
      // Astro logs some info to stderr; only fail on actual errors
      if (text.includes('error') && text.includes('Could not')) {
        clearTimeout(timeout);
        server.kill();
        reject(new Error(`Dev server error: ${text}`));
      }
    });

    server.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const chromePath = findChrome();
  console.log(`Using Chrome: ${chromePath}`);

  // Start dev server
  console.log('Starting Astro dev server...');
  const server = startDevServer();
  let serverProcess;

  try {
    serverProcess = await server;
    console.log(`Dev server ready on port ${PORT}`);

    // Launch browser
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);

    let captured = 0;
    let failed = 0;

    for (const pageSpec of PAGES) {
      const pageUrl = `${BASE_URL}${pageSpec.url}`;
      console.log(`\nNavigating to ${pageSpec.url}`);
      await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for React hydration + all staggered CSS transitions to complete.
      // Components use delays up to ~1s + durations up to ~1s after useEffect fires.
      await new Promise((r) => setTimeout(r, 3500));

      for (const diagram of pageSpec.diagrams) {
        const outPath = resolve(OUTPUT_DIR, `${diagram.name}.png`);
        try {
          const el = await page.waitForSelector(diagram.selector, { timeout: 10000 });
          if (!el) throw new Error(`Element not found: ${diagram.selector}`);
          await el.screenshot({ path: outPath });
          console.log(`  ✓ ${diagram.name}.png`);
          captured++;
        } catch (err) {
          console.error(`  ✗ ${diagram.name} — ${err.message}`);
          failed++;
        }
      }
    }

    await browser.close();

    console.log(`\nDone: ${captured} captured, ${failed} failed`);
    if (failed > 0) process.exitCode = 1;
  } finally {
    if (serverProcess) {
      serverProcess.kill();
      console.log('Dev server stopped.');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
