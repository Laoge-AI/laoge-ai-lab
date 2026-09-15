// Pages' asset endpoint may ignore Range. Serve explicit single-byte ranges for video playback.
// Only /media/* reaches this function; HTML, CSS and images remain static assets.
export async function onRequest({ request, env }) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  const assetHeaders = new Headers(request.headers);
  for (const name of ['Range', 'If-Range', 'If-None-Match', 'If-Modified-Since']) assetHeaders.delete(name);
  assetHeaders.set('Accept-Encoding', 'identity');
  const asset = await env.ASSETS.fetch(new Request(request.url, { method: 'GET', headers: assetHeaders }));
  if (asset.status !== 200 || !asset.headers.get('Content-Type')?.startsWith('video/mp4')) {
    return request.method === 'HEAD'
      ? new Response(null, { status: asset.status, headers: asset.headers })
      : asset;
  }

  // Current recording is approximately 1 MiB. Assets are local to the Pages deployment.
  const data = await asset.arrayBuffer();
  const size = data.byteLength;
  const headers = new Headers(asset.headers);
  headers.delete('Content-Encoding');
  headers.delete('Transfer-Encoding');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(size));

  let range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  if (ifRange && (ifRange.startsWith('W/') || ifRange !== headers.get('ETag'))) range = null;
  if (!range) return new Response(request.method === 'HEAD' ? null : data, { headers });

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  let start = 0;
  let end = size - 1;
  let valid = Boolean(match && (match[1] || match[2]) && size > 0);
  if (valid && !match[1]) {
    const suffix = Number(match[2]);
    valid = Number.isSafeInteger(suffix) && suffix > 0;
    start = Math.max(0, size - suffix);
  } else if (valid) {
    start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : end;
    valid = Number.isSafeInteger(start) && Number.isSafeInteger(requestedEnd) && start < size && requestedEnd >= start;
    end = Math.min(requestedEnd, end);
  }
  if (!valid) {
    headers.set('Content-Range', `bytes */${size}`);
    headers.set('Content-Length', '0');
    return new Response(null, { status: 416, headers });
  }
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(request.method === 'HEAD' ? null : data.slice(start, end + 1), { status: 206, headers });
}
