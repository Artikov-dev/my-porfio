// Fails the build if the JS/CSS needed to render the home page grows past the budget,
// or if heavy libraries (three.js, recharts) leak into the initial load again.
// Usage: node scripts/check-bundle-size.mjs   (after `vite build`)
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB || 300); // gzip, entry + Home route
const DIST = join(import.meta.dirname, '..', 'dist');
const ASSETS = join(DIST, 'assets');

const FORBIDDEN = [
  { name: 'three.js', marker: 'THREE.WebGLRenderer' },
  { name: 'recharts', marker: 'recharts-wrapper' },
  { name: 'react-youtube', marker: 'youtube.com/iframe_api' },
];

const read = (file) => readFileSync(join(ASSETS, file), 'utf8');

// Follow static imports only — dynamic import() chunks are lazy by definition
const collect = (file, seen) => {
  if (seen.has(file)) return;
  seen.add(file);
  const src = read(file);
  for (const m of src.matchAll(/(?:from|import)\s*["']\.\/([^"']+\.js)["']/g)) {
    collect(m[1], seen);
  }
};

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const entry = html.match(/<script[^>]+src="\/assets\/([^"]+\.js)"/)?.[1];
const homeChunk = readdirSync(ASSETS).find((f) => /^Home-[\w-]+\.js$/.test(f));
if (!entry || !homeChunk) {
  console.error('Could not find entry or Home chunk in dist/');
  process.exit(1);
}

const files = new Set();
collect(entry, files);
collect(homeChunk, files);
for (const m of html.matchAll(/href="\/assets\/([^"]+\.css)"/g)) files.add(m[1]);

let total = 0;
const rows = [...files].map((f) => {
  const gz = gzipSync(readFileSync(join(ASSETS, f))).length;
  total += gz;
  return { f, kb: gz / 1024 };
});
rows.sort((a, b) => b.kb - a.kb);
for (const r of rows) console.log(`${r.kb.toFixed(1).padStart(8)} KB  ${r.f}`);
console.log(`${(total / 1024).toFixed(1).padStart(8)} KB  TOTAL (gzip) — budget ${BUDGET_KB} KB`);

let failed = false;
for (const { name, marker } of FORBIDDEN) {
  const hit = [...files].find((f) => f.endsWith('.js') && read(f).includes(marker));
  if (hit) {
    console.error(`✗ ${name} is in the initial home-page bundle (${hit}). Load it with React.lazy.`);
    failed = true;
  }
}
if (total / 1024 > BUDGET_KB) {
  console.error(`✗ Home page bundle ${(total / 1024).toFixed(1)} KB exceeds budget ${BUDGET_KB} KB`);
  failed = true;
}
if (failed) process.exit(1);
console.log('✓ Bundle size OK');
