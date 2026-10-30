// Vercel serves dist/404.html with a real 404 status for any URL that isn't a file or one of the
// SPA routes rewritten in vercel.json. It is the same app shell, so the React NotFound page still
// renders — but search engines now see a 404 instead of a "soft 404" (200 + not-found text).
// Keep the rewrites in vercel.json in sync with the routes in src/App.tsx.
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
