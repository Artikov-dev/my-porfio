import { API_URL, SITE_URL, UUID_PATTERN, escapeXml, fetchJson } from './_shared.js';

// /sitemap.xml is rewritten here (vercel.json) so that blog posts are listed too.
// If the backend is asleep, the static pages are still returned.

const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/projects', changefreq: 'weekly', priority: '0.8' },
  { path: '/blogs', changefreq: 'weekly', priority: '0.8' },
  { path: '/resume', changefreq: 'monthly', priority: '0.7' },
];

export const buildSitemap = async (fetchImpl = fetch) => {
  const body = await fetchJson(`${API_URL}/blogs`, 3500, fetchImpl);
  const posts = Array.isArray(body?.data) ? body.data.filter((p) => UUID_PATTERN.test(String(p.id))) : [];

  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: `${SITE_URL}${p.path}`, ...p })),
    ...posts.map((p) => ({
      loc: `${SITE_URL}/blogs?post=${p.id}`,
      lastmod: p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : undefined,
      changefreq: 'monthly',
      priority: '0.6',
    })),
  ];

  const entries = urls
    .map((u) => [
      '  <url>',
      `    <loc>${escapeXml(u.loc)}</loc>`,
      u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n'))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
};

export default async function handler(req, res) {
  const xml = await buildSitemap();
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
