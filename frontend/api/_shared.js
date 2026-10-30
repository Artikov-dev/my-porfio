// Helpers for the Vercel functions in this folder (files starting with "_" are not routes).

export const SITE_URL = 'https://artikov.dev';

// Same variable the frontend build uses; Vercel exposes project env vars to functions too
export const API_URL = (process.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// The backend may be asleep (Render cold start). Crawlers give up after a few seconds,
// so never wait long: on timeout the caller falls back to the generic page.
export const fetchJson = async (url, timeoutMs = 3500, fetchImpl = fetch) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const escapeXml = escapeHtml;

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
