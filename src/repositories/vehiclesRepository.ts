import { getCatalogSnapshot } from '../catalog/catalogStore';
import { vehicles as vehiclesSeed } from '../data/vehicles';
import type { Vehicle } from '../data/vehicles';

export function getVehiclesFixture(): Vehicle[] {
  return getCatalogSnapshot().vehicles;
}

export async function loadVehicles(): Promise<Vehicle[]> {
  return Promise.resolve(getCatalogSnapshot().vehicles);
}

/**
 * @deprecated Prefer `useVehicles()`
 */
export function getAllVehicles(): Vehicle[] {
  return getCatalogSnapshot().vehicles;
}

export function getVehiclesSeed(): Vehicle[] {
  return vehiclesSeed;
}

export type { Vehicle } from '../data/vehicles';
