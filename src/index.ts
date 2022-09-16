import { Router } from 'itty-router';
import { enchinito } from '@xmarcos/enchinito';
import pkg from '../package.json';

const router = Router();

const version = pkg.version;

router.all('/enchinito/:input', (req, event: FetchEvent) => {
  const { params } = req;
  const { headers } = event.request;
  const acceptHeader = headers.get('Accept')?.toLocaleLowerCase() || '';
  const input = decodeURIComponent(params?.input || '');
  const output = enchinito(input);

  if (acceptHeader === 'text/plain') {
    return new Response(`${output}\n`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  if (acceptHeader === 'application/xml') {
    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <input>${input}</input>
  <output>${output}</output>
  <version>${version}</version>
</data>`;
    return new Response(xmlResponse, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }

  const jsonResponse = JSON.stringify({
    input,
    output,
    version,
  });
  return new Response(jsonResponse, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
});

router.all('*', (req) => {
  const reqURL = new URL(req.url);
  if (reqURL.pathname === '/favicon.ico') {
    const favicon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>👀</text></svg>`;
    const faviconResponse = new Response(favicon, {
      headers: { 'content-type': 'image/svg+xml' },
    });
    faviconResponse.headers.set('Cache-Control', 'max-age=36000');
    return faviconResponse;
  }
  const body = JSON.stringify({
    goto: '/enchinito/:input',
    version,
  });

  return new Response(body, {
    headers: { 'Content-type': 'application/json' },
  });
});

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request, event));
});
