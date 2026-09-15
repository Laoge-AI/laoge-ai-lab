import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};
// Apply the current wildcard Pages headers locally too, including CSP.
const securityHeaders = Object.fromEntries((await readFile(resolve(root, '_headers'), 'utf8'))
  .split(/\r?\n/).filter(line => /^\s+[^:]+:/.test(line)).map(line => {
    const split = line.indexOf(':');
    return [line.slice(0, split).trim(), line.slice(split + 1).trim()];
  }));

function byteRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]) || size === 0) return null;
  let start;
  let end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix < 1) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) return null;
    end = Math.min(end, size - 1);
  }
  return { start, end };
}

const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { ...securityHeaders, Allow: 'GET, HEAD', 'Content-Length': '0' }).end();
    return;
  }
  let path;
  let info;
  try {
    const url = new URL(req.url, 'http://localhost');
    path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403, securityHeaders).end();
      return;
    }
    info = await stat(path);
    if (info.isDirectory()) {
      path = resolve(path, 'index.html');
      info = await stat(path);
    }
    if (!info.isFile()) throw new Error('Not a file');
  } catch {
    const page = await readFile(resolve(root, '404.html')).catch(() => Buffer.from('Run npm run build first.'));
    res.writeHead(404, { ...securityHeaders, 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': page.length });
    res.end(req.method === 'HEAD' ? undefined : page);
    return;
  }

  const headers = {
    ...securityHeaders, 'Content-Type': types[extname(path)] || 'application/octet-stream',
    'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes', 'Content-Length': info.size,
  };
  let range;
  if (req.headers.range) {
    range = byteRange(req.headers.range, info.size);
    if (!range) {
      res.writeHead(416, { ...headers, 'Content-Range': `bytes */${info.size}`, 'Content-Length': '0' }).end();
      return;
    }
    headers['Content-Range'] = `bytes ${range.start}-${range.end}/${info.size}`;
    headers['Content-Length'] = range.end - range.start + 1;
  }
  res.writeHead(range ? 206 : 200, headers);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  const stream = createReadStream(path, range);
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
});
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${server.address().port}`));
