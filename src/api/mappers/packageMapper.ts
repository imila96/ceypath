import type { TourPackage } from '../../data/packages';

/**
 * Maps a JSON object from `GET /packages` into `TourPackage`.
 * Expects the API to return the same shape as the frontend model (or extend this mapper for snake_case / partial DTOs).
 */
export function mapPackageDto(raw: unknown, index: number): TourPackage {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`Invalid package at index ${index}`);
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.name !== 'string') {
    throw new Error(`Package at index ${index} missing id or name`);
  }
  return raw as TourPackage;
}
