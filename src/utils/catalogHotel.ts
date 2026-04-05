import type { Hotel } from '../data/hotels';

export function normalizeHotelName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Match a catalog hotel by display name (case-insensitive). */
export function findCatalogHotelByName(hotels: Hotel[], name: string): Hotel | undefined {
  if (!name?.trim()) return undefined;
  const n = normalizeHotelName(name);
  return hotels.find(h => normalizeHotelName(h.name) === n);
}

/** Photo from the Hotels catalog when the package itinerary row has no embedded image. */
export function catalogHotelImageForName(hotels: Hotel[], name: string): string | undefined {
  return findCatalogHotelByName(hotels, name)?.image;
}
