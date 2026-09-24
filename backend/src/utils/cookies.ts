import type { Request } from 'express';

export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) {
    return {};
  }
  return header.split(';').reduce<Record<string, string>>((acc, pair) => {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) {
      return acc;
    }
    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    if (name) {
      acc[name] = decodeURIComponent(value);
    }
    return acc;
  }, {});
}

export function buildSetCookie(
  name: string,
  value: string,
  options: { maxAgeMs?: number; secure: boolean },
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    `SameSite=${options.secure ? 'None' : 'Lax'}`,
  ];
  if (options.maxAgeMs !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAgeMs / 1000)}`);
  }
  if (options.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

export function buildClearCookie(name: string, options: { secure: boolean }): string {
  const parts = [
    `${name}=`,
    'Path=/',
    'HttpOnly',
    `SameSite=${options.secure ? 'None' : 'Lax'}`,
    'Max-Age=0',
  ];
  if (options.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}
