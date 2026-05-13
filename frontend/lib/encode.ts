import type { Result } from '@/types';

export function runBase64Encode(input: string): Result<string> {
  if (input === '') {
    return { ok: false, error: 'Input is empty.' };
  }
  try {
    return { ok: true, value: btoa(input) };
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : 'Encoding failed. btoa() supports Latin1 only; use URL encode for Unicode.';
    return { ok: false, error: msg };
  }
}

export function runBase64Decode(input: string): Result<string> {
  if (input.trim() === '') {
    return { ok: false, error: 'Input is empty.' };
  }
  try {
    return { ok: true, value: atob(input.trim()) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid Base64.';
    return { ok: false, error: msg };
  }
}

export function runUrlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function runUrlDecode(input: string): Result<string> {
  if (input === '') {
    return { ok: true, value: '' };
  }
  try {
    return { ok: true, value: decodeURIComponent(input) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid URL-encoded string.';
    return { ok: false, error: msg };
  }
}

export function runHtmlEncode(input: string): string {
  if (!input) return '';
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, (s) => entities[s]);
}

export function runHtmlDecode(input: string): string {
  if (!input) return '';
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent || '';
}
