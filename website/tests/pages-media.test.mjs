import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { onRequest } from '../functions/media/[[path]].js';

const video = await readFile(new URL('../public/media/customer-service-demo.mp4', import.meta.url));
const etag = '"test-recording"';
const env = { ASSETS: { async fetch(request) {
  assert.equal(request.headers.get('Range'), null);
  assert.equal(request.method, 'GET');
  if (new URL(request.url).pathname !== '/media/customer-service-demo.mp4') return new Response('missing', { status: 404 });
  return new Response(video, { headers: { 'Content-Type': 'video/mp4', ETag: etag } });
} } };
const run = (headers = {}, method = 'GET', path = '/media/customer-service-demo.mp4') => onRequest({ request: new Request(`https://example.com${path}`, { headers, method }), env });

test('real MP4 full response and HEAD provide correct media length', async () => {
  const full = await run();
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('Content-Type'), 'video/mp4');
  assert.equal(full.headers.get('Accept-Ranges'), 'bytes');
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), video);
  const head = await run({}, 'HEAD');
  assert.equal(head.headers.get('Content-Length'), String(video.length));
  assert.equal((await head.arrayBuffer()).byteLength, 0);
});

test('initial, open-ended and suffix playback ranges return exact source bytes', async () => {
  for (const [range, start, end] of [
    ['bytes=0-31', 0, 31],
    [`bytes=${video.length - 16}-`, video.length - 16, video.length - 1],
    ['bytes=-16', video.length - 16, video.length - 1],
  ]) {
    const response = await run({ Range: range });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${video.length}`);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), video.subarray(start, end + 1));
  }
});

test('invalid ranges, outdated If-Range and missing assets are handled correctly', async () => {
  for (const range of [`bytes=${video.length}-`, 'bytes=31-2', 'bytes=-0']) {
    const response = await run({ Range: range });
    assert.equal(response.status, 416);
    assert.equal(response.headers.get('Content-Range'), `bytes */${video.length}`);
  }
  const old = await run({ Range: 'bytes=0-31', 'If-Range': '"old-file"' });
  assert.equal(old.status, 200);
  assert.equal((await old.arrayBuffer()).byteLength, video.length);
  const current = await run({ Range: 'bytes=0-31', 'If-Range': etag });
  assert.equal(current.status, 206);
  assert.equal((await run({}, 'GET', '/media/missing.mp4')).status, 404);
  assert.equal((await run({}, 'POST')).status, 405);
});
