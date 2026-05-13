import type { Result } from '../types';

const EPOCH_MS_MAX = 1e12;

export function parseTimestampInput(input: string): Result<Date> {
  const trimmed = input.trim();
  if (trimmed === '') {
    return { ok: false, error: 'Enter an epoch timestamp or a date string.' };
  }

  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed !== '') {
    const ms = num < EPOCH_MS_MAX ? num * 1000 : num;
    const date = new Date(ms);
    if (Number.isNaN(date.getTime())) {
      return { ok: false, error: 'Invalid epoch value.' };
    }
    return { ok: true, value: date };
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      error:
        'Could not parse date. Try epoch (e.g. 1699900000) or ISO (e.g. 2023-11-14).',
    };
  }
  return { ok: true, value: date };
}

export function formatTimestampResult(date: Date) {
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    epochMs: date.getTime(),
    epochSec: Math.floor(date.getTime() / 1000),
  };
}
