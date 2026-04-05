import type { Vehicle } from '../../data/vehicles';

export function mapVehicleDto(raw: unknown, index: number): Vehicle {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`Invalid vehicle at index ${index}`);
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.name !== 'string') {
    throw new Error(`Vehicle at index ${index} missing id or name`);
  }
  return raw as Vehicle;
}
