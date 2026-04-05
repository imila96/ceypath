import { getCatalogSnapshot } from '../catalog/catalogStore';
import { hotels as hotelsSeed } from '../data/hotels';
import type { Hotel, HotelTier } from '../data/hotels';

export function getAllHotels(): Hotel[] {
  return getCatalogSnapshot().hotels;
}

export function getHotelsSeed(): Hotel[] {
  return hotelsSeed;
}

export type {
  Hotel,
  HotelTier,
  HotelFaq,
  HotelGalleryImage,
  HotelNearbyPlace,
  HotelRestaurant,
  HotelRoomType,
  HotelSurroundingsGroup,
} from '../data/hotels';
