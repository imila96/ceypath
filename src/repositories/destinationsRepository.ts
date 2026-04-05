import { getCatalogSnapshot } from '../catalog/catalogStore';
import { destinations as destinationsSeed } from '../data/destinations';
import type { Destination } from '../data/destinations';

export function getDestinationsFixture(): Destination[] {
  return getCatalogSnapshot().destinations;
}

export async function loadDestinations(): Promise<Destination[]> {
  return Promise.resolve(getCatalogSnapshot().destinations);
}

/**
 * @deprecated Prefer `useDestinations()`
 */
export function getAllDestinations(): Destination[] {
  return getCatalogSnapshot().destinations;
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return getCatalogSnapshot().destinations.find(d => d.slug === slug);
}

export function getDestinationsSeed(): Destination[] {
  return destinationsSeed;
}

export type { Destination } from '../data/destinations';
