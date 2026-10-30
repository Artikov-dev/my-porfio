// The theme script in index.html is allowed in the CSP by its sha256 hash (vercel.json).
// Editing the script without updating the hash would block it once the CSP is enforced,
// so the build fails instead.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync('dist/index.html', 'utf8');
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const csp = vercel.headers
  .flatMap((rule) => rule.headers)
  .filter((h) => h.key.startsWith('Content-Security-Policy'))
  .map((h) => h.value)
  .join(' ');

const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const missing = inlineScripts
  .map((code) => `sha256-${createHash('sha256').update(code).digest('base64')}`)
  .filter((hash) => !csp.includes(hash));

if (missing.length > 0) {
  console.error(`✗ Inline script hash not in the CSP (vercel.json): ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`✓ CSP covers ${inlineScripts.length} inline script(s)`);
