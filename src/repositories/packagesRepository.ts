import { getCatalogSnapshot } from '../catalog/catalogStore';
import type { TourPackage } from '../data/packages';

/** Bundled seed (import only) — runtime data lives in the catalog store (admin CRUD + localStorage). */
import { packages as packagesSeed } from '../data/packages';

export function getPackagesFixture(): TourPackage[] {
  return getCatalogSnapshot().packages;
}

/**
 * Catalog is edited in Admin and persisted locally. Remote `GET /packages` is not used while the
 * store is the source of truth (re-enable in repository if you add a sync layer).
 */
export async function loadPackages(): Promise<TourPackage[]> {
  return Promise.resolve(getCatalogSnapshot().packages);
}

/**
 * @deprecated Prefer `usePackages()` — returns current catalog snapshot.
 */
export function getAllPackages(): TourPackage[] {
  return getCatalogSnapshot().packages;
}

export function getPackageById(id: string): TourPackage | undefined {
  return getCatalogSnapshot().packages.find(p => p.id === id);
}

export function getHighlightedPackage(): TourPackage | undefined {
  return getCatalogSnapshot().packages.find(p => p.highlighted);
}

/** Original seed from source files (for “reset to defaults” in admin). */
export function getPackagesSeed(): TourPackage[] {
  return packagesSeed;
}

export type {
  TourPackage,
  PackageType,
  PackageBadge,
  GalleryImage,
  ItineraryDay,
  ItineraryHotelOption,
} from '../data/packages';
