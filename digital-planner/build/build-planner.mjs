// ─────────────────────────────────────────────
// Mi Planner · Build script
// ─────────────────────────────────────────────
import { createRequire as __cr } from 'module';
const require = __cr(import.meta.url);

import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC  = path.join(ROOT, 'src');
const OUT  = path.join(ROOT, 'out');
const ASSETS = path.join(ROOT, 'assets', 'fonts');

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(ASSETS, { recursive: true });

// ── Orden de carga igual al host ──
const JSX_ORDER = [
  'brand.jsx', 'primitives.jsx',
  'view_daily.jsx', 'view_agenda.jsx', 'view_weekly.jsx', 'view_monthly.jsx',
  'view_yearly.jsx', 'view_habits.jsx', 'view_wellness.jsx',
  'app.jsx',
];

// ── 1. Concatenar JSX ──
const preamble = `
import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
globalThis.React = React;
globalThis.ReactDOM = { createRoot: ReactDOMClient.createRoot };
`;

const body = JSX_ORDER.map(f => fs.readFileSync(path.join(SRC, f), 'utf8')).join('\n\n');
const entry = preamble + '\n' + body;

const ENTRY_PATH = path.join(__dirname, '_entry.jsx');
fs.writeFileSync(ENTRY_PATH, entry);

// ── 2. esbuild ──
console.log('⚙  Bundling…');
await esbuild.build({
  entryPoints: [ENTRY_PATH],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  loader: { '.jsx': 'jsx' },
  outfile: path.join(__dirname, '_bundle.js'),
  banner: {
    js: `/* Mi Planner · build ${new Date().toISOString().slice(0,10)} */`,
  },
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
});
fs.unlinkSync(ENTRY_PATH);

const bundleJS = fs.readFileSync(path.join(__dirname, '_bundle.js'), 'utf8');
fs.unlinkSync(path.join(__dirname, '_bundle.js'));
console.log(`✓  Bundle: ${(bundleJS.length / 1024).toFixed(0)} KB`);

// ── 3. Fuentes ──
const FONTS_CACHE = path.join(ASSETS, 'fonts-inline.css');
let fontsCSS = '';

if (fs.existsSync(FONTS_CACHE)) {
  console.log('✓  Fonts (cache)');
  fontsCSS = fs.readFileSync(FONTS_CACHE, 'utf8');
} else {
  console.log('⬇  Downloading fonts…');
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  const GF_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

  function fetchText(url, ua) {
    return new Promise((resolve, reject) => {
      const opts = new URL(url);
      const req = https.get({ hostname: opts.hostname, path: opts.pathname + opts.search, headers: ua ? { 'User-Agent': ua } : {} }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchText(res.headers.location, ua).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
    });
  }

  function fetchBuf(url) {
    return new Promise((resolve, reject) => {
      const opts = new URL(url);
      const req = https.get({ hostname: opts.hostname, path: opts.pathname + opts.search }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchBuf(res.headers.location).then(resolve).catch(reject);
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });
      req.on('error', reject);
    });
  }

  try {
    const css = await fetchText(GF_URL, UA);
    // Extraer URLs de fuentes
    const urlRe = /url\((https:\/\/[^)]+)\) format\('woff2'\)/g;
    const urls = [];
    let m;
    while ((m = urlRe.exec(css)) !== null) urls.push(m[1]);
    // Descargar y convertir a base64
    let result = css;
    for (const url of urls) {
      try {
        const buf = await fetchBuf(url);
        const b64 = `data:font/woff2;base64,${buf.toString('base64')}`;
        result = result.replace(url, b64);
      } catch (e) {
        console.warn(`  ⚠ Could not download ${url}: ${e.message}`);
      }
    }
    fontsCSS = result;
    fs.writeFileSync(FONTS_CACHE, fontsCSS);
    console.log('✓  Fonts downloaded and cached');
  } catch (e) {
    console.warn('⚠  Font download failed, using system fallbacks:', e.message);
    fontsCSS = `/* Font download failed — using system fallbacks */`;
  }
}

// ── 4. HTML base ──
const globalCSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: #F5EFE6;
  color: #2B2622;
  font-family: 'Manrope', sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: radial-gradient(#2B2622 0.6px, transparent 0.6px);
  background-size: 4px 4px;
}
::selection { background: rgba(43,38,34,0.12); }
input, textarea, button { font-family: inherit; color: inherit; }
input:focus, textarea:focus { outline: none; }
textarea { resize: none; }
button { cursor: pointer; border: none; background: none; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-thumb { background: #D8CFC0; border-radius: 10px; border: 3px solid #F5EFE6; }
::-webkit-scrollbar-track { background: transparent; }
@keyframes viewIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.view-anim { animation: viewIn 200ms ease-out; }
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  body::before { display: none; }
  nav { display: none !important; }
}
`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
  <title>PLANNERFY</title>
  <style>
${fontsCSS}
${globalCSS}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
${bundleJS}
  </script>
</body>
</html>`;

const outFile = path.join(OUT, 'plannerfy.html');
fs.writeFileSync(outFile, html);

const sizeMB = (fs.statSync(outFile).size / (1024 * 1024)).toFixed(2);
console.log(`\n✅  mi-planner.html → out/ (${sizeMB} MB)`);
if (parseFloat(sizeMB) > 25) console.warn('⚠  Archivo supera 25 MB');
