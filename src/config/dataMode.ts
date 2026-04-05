/**
 * Data sourcing strategy (see docs/BACKEND-PHASES.md).
 *
 * - dummy: local fixtures only (current demo default).
 * - real: API-only when wired; until Phase B, repositories still serve fixtures in dev with a console hint.
 * - hybrid: try API first, then fixtures (implemented in Phase B+).
 */
export type DataMode = 'dummy' | 'real' | 'hybrid';

export function getDataMode(): DataMode {
  const raw = (import.meta.env.VITE_DATA_MODE || 'dummy').toLowerCase().trim();
  if (raw === 'real' || raw === 'hybrid') return raw;
  return 'dummy';
}

/** Normalized API origin, no trailing slash, or undefined if unset. */
export function getApiBaseUrl(): string | undefined {
  const u = import.meta.env.VITE_API_BASE_URL;
  if (!u || !String(u).trim()) return undefined;
  return String(u).replace(/\/+$/, '');
}

export function isApiConfigured(): boolean {
  return Boolean(getApiBaseUrl());
}
