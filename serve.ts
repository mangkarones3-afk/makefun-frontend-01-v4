// serve.ts — a small static file server for previewing Lightboard
// locally (Node 22, standard library only). It serves app/ at the
// root, exactly as any static host would; the app reads
// https://make.fun/api from the browser itself, so no proxying is
// needed or wanted here.
//
//   node serve.ts [--port 8094]     then open http://localhost:8094

import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(fileURLToPath(new URL('.', import.meta.url)), 'app');
const flagAt = process.argv.indexOf('--port');
const port = flagAt > -1 ? Number(process.argv[flagAt + 1]) : 8094;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url ?? '/', 'http://serve.local');
    const rel = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
    const target = join(appDir, rel === '' ? 'index.html' : rel);
    if (!target.startsWith(appDir)) { res.writeHead(403).end('Forbidden'); return; }
    const bytes = await readFile(target);
    res.writeHead(200, {
      'content-type': MIME[extname(target).toLowerCase()] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(bytes);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});
server.listen(port, () => console.log(`Lightboard preview at http://localhost:${port}`));
