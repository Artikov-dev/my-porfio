import { API_URL, SITE_URL, UUID_PATTERN, escapeHtml, fetchJson } from './_shared.js';

// /blogs?post=<id> is rewritten here (vercel.json). The site is a client-rendered SPA, so link
// previews (Telegram, LinkedIn, X…) only ever saw the home page's title and image. This serves
// the same app shell with the post's own title / description / image in the meta tags; the
// React app then loads exactly as before.

const LANGS = ['en', 'uz', 'ru'];

const pick = (localized, lang) =>
  (localized && (localized[lang] || localized.en || Object.values(localized)[0])) || '';

// First ~160 characters of the Markdown body as plain text
export const summarize = (markdown) =>
  String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`>\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

const setMeta = (html, attr, key, value) => {
  const pattern = new RegExp(`(<meta[^>]*${attr}="${key}"[^>]*content=")[^"]*(")`, 'i');
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
};

export const injectMeta = (html, { title, description, image, url }) => {
  let out = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  out = out.replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/i, `$1${escapeHtml(url)}$2`);
  out = setMeta(out, 'name', 'description', description);
  for (const prefix of ['og', 'twitter']) {
    out = setMeta(out, 'property', `${prefix}:title`, title);
    out = setMeta(out, 'property', `${prefix}:description`, description);
    out = setMeta(out, 'property', `${prefix}:image`, image);
    out = setMeta(out, 'property', `${prefix}:url`, url);
  }
  out = setMeta(out, 'property', 'og:type', 'article');
  return out;
};

export const buildPage = async ({ host, postId, lang, fetchImpl = fetch }) => {
  const shellRes = await fetchImpl(`https://${host}/index.html`);
  const shell = await shellRes.text();

  if (!UUID_PATTERN.test(postId || '')) return shell; // built-in sample posts aren't in the API

  const body = await fetchJson(`${API_URL}/blogs/${postId}`, 3500, fetchImpl);
  const post = body?.data;
  if (!post?.title) return shell;

  const language = LANGS.includes(lang) ? lang : 'en';
  return injectMeta(shell, {
    title: `${pick(post.title, language)} | Roma Artikov`,
    description: summarize(pick(post.content, language)),
    image: post.image_url || `${SITE_URL}/og_banner.jpg`,
    url: `${SITE_URL}/blogs?post=${encodeURIComponent(postId)}`,
  });
};

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try {
    const html = await buildPage({ host, postId: String(req.query.post || ''), lang: String(req.query.lang || 'en') });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Previews rarely change; let the CDN serve repeats without waking the backend
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch {
    // Never break the page itself: send the visitor to the plain SPA. `np=1` makes vercel.json
    // skip this function on the retry, so it can't loop.
    const post = encodeURIComponent(String(req.query.post || ''));
    res.setHeader('Cache-Control', 'no-store');
    res.redirect(302, `/blogs?post=${post}&np=1`);
  }
}
