export function parseIntParam(v: string | null, fallback: number, min: number, max: number): number {
  if (!v) return fallback;
  const parsed = parseInt(v, 10);
  if (isNaN(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

export function parseDir(v: string | null): 'asc' | 'desc' {
  return v === 'desc' ? 'desc' : 'asc';
}

export function parseString(v: string | null, maxLen?: number): string {
  if (!v) return '';
  const trimmed = v.trim();
  if (maxLen && trimmed.length > maxLen) {
    return trimmed.substring(0, maxLen);
  }
  return trimmed;
}
