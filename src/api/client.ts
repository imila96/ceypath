import { getApiBaseUrl } from '../config/dataMode';

/**
 * Phase B: shared fetch wrapper (auth headers, JSON, errors).
 * Not used for catalog data until Phase B wires GET /packages etc.
 */
export async function apiGetJson<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error('[api] VITE_API_BASE_URL is not set');
  }
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`[api] ${res.status} ${res.statusText} ${url}`);
  }
  return res.json() as Promise<T>;
}
