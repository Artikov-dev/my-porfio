import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, fetchJson } from '../api/_shared.js';
import { buildPage, injectMeta, summarize } from '../api/blog-share.js';
import { buildSitemap } from '../api/sitemap.js';

const POST_ID = '3f1b2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';

const SHELL = `<html><head><title>Roma Artikov | Full-Stack Engineer</title>
<link data-rh="true" rel="canonical" href="https://artikov.dev/" />
<meta data-rh="true" name="description" content="home" />
<meta data-rh="true" property="og:type" content="website" />
<meta data-rh="true" property="og:url" content="https://artikov.dev/" />
<meta data-rh="true" property="og:title" content="home" />
<meta data-rh="true" property="og:description" content="home" />
<meta data-rh="true" property="og:image" content="https://artikov.dev/og_banner.jpg" />
<meta data-rh="true" property="twitter:title" content="home" />
</head><body></body></html>`;

// Fake fetch: the app shell for index.html, the given JSON (or a failure) for API calls
const fakeFetch = (apiBody) => async (url) => {
  if (String(url).endsWith('/index.html')) return { ok: true, text: async () => SHELL };
  if (apiBody === undefined) throw new Error('backend asleep');
  return { ok: true, json: async () => apiBody };
};

test('escapeHtml escapes every HTML-significant character', () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  assert.equal(escapeHtml(null), '');
});

test('fetchJson returns null instead of throwing when the backend is down', async () => {
  assert.equal(await fetchJson('https://api.test/x', 100, fakeFetch(undefined)), null);
  assert.equal(await fetchJson('https://api.test/x', 100, async () => ({ ok: false })), null);
});

test('summarize turns Markdown into a short plain-text description', () => {
  const text = summarize('# Title\n\nSome **bold** text\n\n```js\nconst secret = 1;\n```\n' + 'x'.repeat(300));
  assert.ok(!text.includes('#') && !text.includes('*') && !text.includes('secret'));
  assert.ok(text.length <= 160);
});

test('injectMeta escapes post data so a title cannot break out of the attribute', () => {
  const html = injectMeta(SHELL, {
    title: '"><script>alert(1)</script>',
    description: 'd',
    image: 'https://img.test/a.jpg',
    url: 'https://artikov.dev/blogs?post=1',
  });
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&quot;&gt;&lt;script&gt;'));
  assert.ok(html.includes('property="og:type" content="article"'));
});

test('buildPage fills in the post title in the requested language', async () => {
  const post = { title: { en: 'Hello', uz: 'Salom' }, content: { en: 'Body', uz: 'Matn' }, image_url: 'https://img.test/p.jpg' };
  const html = await buildPage({ host: 'artikov.dev', postId: POST_ID, lang: 'uz', fetchImpl: fakeFetch({ data: post }) });
  assert.ok(html.includes('<title>Salom | Roma Artikov</title>'));
  assert.ok(html.includes('content="https://img.test/p.jpg"'));
  assert.ok(html.includes(`href="https://artikov.dev/blogs?post=${POST_ID}"`));
});

test('buildPage falls back to the plain shell for unknown ids or a sleeping backend', async () => {
  assert.equal(await buildPage({ host: 'artikov.dev', postId: 'blog-1', lang: 'en', fetchImpl: fakeFetch({}) }), SHELL);
  assert.equal(await buildPage({ host: 'artikov.dev', postId: POST_ID, lang: 'en', fetchImpl: fakeFetch(undefined) }), SHELL);
});

test('sitemap lists static pages and only real (UUID) blog posts', async () => {
  const xml = await buildSitemap(fakeFetch({ data: [{ id: POST_ID, created_at: '2026-05-01T10:00:00Z' }, { id: 'blog-1' }] }));
  assert.ok(xml.includes('<loc>https://artikov.dev/</loc>'));
  assert.ok(xml.includes('<loc>https://artikov.dev/resume</loc>'));
  assert.ok(xml.includes(`<loc>https://artikov.dev/blogs?post=${POST_ID}</loc>`));
  assert.ok(xml.includes('<lastmod>2026-05-01</lastmod>'));
  assert.ok(!xml.includes('blog-1'));
});

test('sitemap still has the static pages when the backend is asleep', async () => {
  const xml = await buildSitemap(fakeFetch(undefined));
  assert.equal((xml.match(/<url>/g) || []).length, 4);
});
