import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import site from '../site.config.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : join(dir, entry.name)))).flat();
}
const files = await walk(dist);
const pages = files.filter(file => file.endsWith('.html'));
const pageMap = new Map(await Promise.all(pages.map(async file => [file, await readFile(file, 'utf8')])));
for (const [file, html] of pageMap) {
  assert.match(html, /<html lang="zh-CN"/);
  assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, `${file}: exactly one h1`);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.doesNotMatch(html, /undefined|\[object Object\]|href="#"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate IDs`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const match of schemas) assert.equal(JSON.parse(match[1])['@context'], 'https://schema.org');
  for (const match of html.matchAll(/<(?:a|link|script|img|source|video)\b[^>]*?\b(?:href|src|poster)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(target)) continue;
    const [path, anchor] = target.split('#');
    let asset = path ? resolve(dist, `.${path}`) : file;
    if ((await stat(asset)).isDirectory()) asset = join(asset, 'index.html');
    await stat(asset);
    if (anchor) assert.match(await readFile(asset, 'utf8'), new RegExp(`id="${anchor}"`), `${file}: missing anchor ${target}`);
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) assert.match(match[0], /\balt="[^"]*"/);
}
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
if (robots.includes('Sitemap:')) {
  const origin = new URL(site.url).origin;
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 3);
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expectedLocations = [];
  for (const [file, html] of pageMap) {
    if (!file.endsWith('404.html')) {
      const path = '/' + relative(dist, file).split(sep).join('/').replace(/index\.html$/, '');
      const expected = origin + path;
      expectedLocations.push(expected);
      assert.ok(html.includes(`rel="canonical" href="${expected}"`), `${file}: wrong canonical URL`);
      assert.ok(html.includes(`property="og:url" content="${expected}"`), `${file}: wrong social URL`);
      assert.match(html, /content="index, follow"/);
      const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.ok(data['@graph'].some(entry => entry.url === expected && ['Article', 'WebSite'].includes(entry['@type'])), `${file}: missing structured page URL`);
    }
  }
  assert.deepEqual(locations.sort(), expectedLocations.sort());
} else {
  assert.ok(!files.includes(join(dist, 'sitemap.xml')), 'Preview build must remove stale production sitemap');
  for (const html of pageMap.values()) {
    assert.match(html, /content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"/);
  }
}
console.log(`Static check passed: ${pages.length} pages, local links, anchors, assets, metadata and schema.`);

// Smoke test actual HTTP routes so missing pages do not silently fall back to the homepage.
const server = spawn(process.execPath, ['scripts/preview.mjs'], { cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
try {
  const base = await new Promise((resolveReady, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview server timed out')), 10000);
    server.stdout.on('data', data => {
      const found = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (found) { clearTimeout(timer); resolveReady(found[0]); }
    });
    server.on('error', error => { clearTimeout(timer); reject(error); });
    server.on('exit', code => { clearTimeout(timer); reject(new Error(`Preview exited: ${code}`)); });
  });
  for (const path of ['/', '/experiments/ai-customer-service/', '/experiments/ai-website/', '/assets/styles.css', '/assets/site.js', '/robots.txt', '/llms.txt', '/images/customer-service-test.png']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
  }
  const missing = await fetch(`${base}/does-not-exist/`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /这条路还没铺好/);
  const mediaUrl = `${base}/media/customer-service-demo.mp4`;
  const head = await fetch(mediaUrl, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-type'), 'video/mp4');
  const mediaSize = Number(head.headers.get('content-length'));
  assert.ok(mediaSize > 0 && mediaSize < 25 * 1024 * 1024);
  const firstBytes = await fetch(mediaUrl, { headers: { Range: 'bytes=0-31' } });
  assert.equal(firstBytes.status, 206);
  assert.equal(firstBytes.headers.get('content-range'), `bytes 0-31/${mediaSize}`);
  assert.equal((await firstBytes.arrayBuffer()).byteLength, 32);
  const suffix = await fetch(mediaUrl, { headers: { Range: 'bytes=-16' } });
  assert.equal(suffix.status, 206);
  assert.equal((await suffix.arrayBuffer()).byteLength, 16);
  const invalid = await fetch(mediaUrl, { headers: { Range: `bytes=${mediaSize}-` } });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('content-range'), `bytes */${mediaSize}`);
  console.log('HTTP check passed: pages, assets and custom 404.');
  console.log('Media check passed: MP4 MIME, HEAD, byte ranges and invalid-range response.');
} finally {
  const stopped = once(server, 'exit');
  server.kill();
  await stopped;
}
