import { describe, it, expect } from 'vitest';
import { router } from './index';
import pkg from '../package.json';

describe('enchinito-api', () => {
  const version = pkg.version;

  it('should return JSON by default', async () => {
    const request = new Request('https://example.com/enchinito/Hello%20World');
    // @ts-ignore
    const response = await router.handle(request, { request });
    const data = await response.json();

    expect(response.headers.get('Content-Type')).toContain('application/json');
    expect(data).toEqual({
      input: 'Hello World',
      output: 'Hilli Wirld',
      version: version
    });
  });

  it('should return plain text when requested', async () => {
    const request = new Request('https://example.com/enchinito/Hello%20World', {
      headers: { 'Accept': 'text/plain' }
    });
    // @ts-ignore
    const response = await router.handle(request, { request });
    const text = await response.text();

    expect(response.headers.get('Content-Type')).toContain('text/plain');
    expect(text).toBe('Hilli Wirld\n');
  });

  it('should return XML when requested', async () => {
    const request = new Request('https://example.com/enchinito/Hello%20World', {
      headers: { 'Accept': 'application/xml' }
    });
    // @ts-ignore
    const response = await router.handle(request, { request });
    const text = await response.text();

    expect(response.headers.get('Content-Type')).toContain('application/xml');
    expect(text).toContain('<input>Hello World</input>');
    expect(text).toContain('<output>Hilli Wirld</output>');
    expect(text).toContain(`<version>${version}</version>`);
  });

  it('should return 404/info for unknown routes', async () => {
    const request = new Request('https://example.com/unknown');
    // @ts-ignore
    const response = await router.handle(request);
    const data = await response.json();

    expect(data).toEqual({
      goto: '/enchinito/:input',
      version: version
    });
  });

  it('should return favicon', async () => {
    const request = new Request('https://example.com/favicon.ico');
    // @ts-ignore
    const response = await router.handle(request);
    
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
  });

  it('should be case-insensitive for Accept headers', async () => {
    const request = new Request('https://example.com/enchinito/Test', {
      headers: { 'Accept': 'APPLICATION/XML' }
    });
    // @ts-ignore
    const response = await router.handle(request, { request });
    expect(response.headers.get('Content-Type')).toContain('application/xml');
  });

  it('should handle special characters and spaces', async () => {
    const request = new Request('https://example.com/enchinito/Hello%20%26%20Welcome%21');
    // @ts-ignore
    const response = await router.handle(request, { request });
    const data = await response.json();
    expect(data.input).toBe('Hello & Welcome!');
    expect(data.output).toBe('Hilli & Wilcimi!');
  });

  it('should handle text with no vowels', async () => {
    const request = new Request('https://example.com/enchinito/Fly%20Sky');
    // @ts-ignore
    const response = await router.handle(request, { request });
    const data = await response.json();
    expect(data.output).toBe('Fly Sky');
  });

  it('should preserve vowel casing (if library supports it)', async () => {
    const request = new Request('https://example.com/enchinito/AEIOU%20aeiou');
    // @ts-ignore
    const response = await router.handle(request, { request });
    const data = await response.json();
    // Assuming enchinito maps A->I, a->i
    expect(data.output).toBe('IIIII iiiii');
  });

  it('should work with different HTTP methods', async () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    for (const method of methods) {
      const request = new Request('https://example.com/enchinito/test', { method });
      // @ts-ignore
      const response = await router.handle(request, { request });
      expect(response.status).toBe(200);
    }
  });
});
