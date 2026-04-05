import type { Destination } from '../../data/destinations';

export function mapDestinationDto(raw: unknown, index: number): Destination {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`Invalid destination at index ${index}`);
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.slug !== 'string' || typeof o.name !== 'string') {
    throw new Error(`Destination at index ${index} missing id, slug, or name`);
  }
  return raw as Destination;
}
