import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Node 24 runs these TypeScript modules directly (type stripping); they have no "@/" imports
import { optimizeImage } from '../src/lib/utils.ts';
import { EXPERIENCE, formatPeriod } from '../src/lib/experience.ts';
import { getResume } from '../src/lib/resume.ts';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

test('optimizeImage resizes Unsplash images and leaves other URLs alone', () => {
  const url = optimizeImage('https://images.unsplash.com/photo-1?q=80&w=2072&auto=format&fit=crop', 640);
  const params = new URL(url).searchParams;
  assert.equal(params.get('w'), '640');
  assert.equal(params.get('q'), '75');
  assert.equal(optimizeImage('https://example.com/a.png', 640), 'https://example.com/a.png');
  assert.equal(optimizeImage('not a url', 640), 'not a url');
  assert.equal(optimizeImage(undefined, 640), '');
});

test('formatPeriod handles ongoing, finished and single-year roles', () => {
  assert.equal(formatPeriod({ start: '2026', end: undefined }, 'en', 'Present'), '2026');
  assert.equal(formatPeriod({ start: '2025-07', end: null }, 'en', 'Present'), 'Jul 2025 – Present');
  assert.equal(formatPeriod({ start: '2025-07', end: '2025-09' }, 'en', 'Present'), 'Jul 2025 – Sep 2025');
});

test('experience is listed newest first', () => {
  const starts = EXPERIENCE.map((item) => item.start.slice(0, 7));
  assert.deepEqual(starts, [...starts].sort().reverse());
});

test('every language has a CV file that actually exists in /public', () => {
  for (const language of ['en', 'uz', 'ru']) {
    const { fileName, url } = getResume(language);
    assert.ok(existsSync(publicDir + fileName), `missing ${fileName}`);
    assert.equal(url, `/${encodeURIComponent(fileName)}`);
  }
  assert.deepEqual(getResume('de'), getResume('en'));
});
