import type { Result } from '@/types';

export function tryParseJson(str: string): Result<unknown> {
  if (str.trim() === '') {
    return { ok: false, error: 'Input is empty.' };
  }
  try {
    const value = JSON.parse(str);
    return { ok: true, value };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';
    return { ok: false, error: message };
  }
}
