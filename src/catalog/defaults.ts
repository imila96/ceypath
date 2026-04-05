import type { TourPackage } from '../data/packages';
import type { Destination } from '../data/destinations';
import type { Vehicle } from '../data/vehicles';
import type { Hotel } from '../data/hotels';
import type { Activity } from '../data/activities';
import type { Testimonial } from '../data/testimonials';

function newId(prefix: string) {
  return `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`;
}

export function createEmptyPackage(): TourPackage {
  return {
    id: newId('pkg'),
    name: 'New package',
    shortDescription: 'Short description for listings.',
    days: 3,
    nights: 2,
    type: 'standard',
    price: 999,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 0,
    destinations: ['Colombo', 'Kandy'],
    highlights: ['✓ Your highlight'],
    inclusions: ['Breakfast'],
    exclusions: ['International flights'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-blue-600 to-indigo-800',
    badge: 'NEW',
    itinerary: [
      {
        day: 1,
        title: 'Arrival',
        morning: '',
        afternoon: '',
        evening: '',
        hotel: 'TBD',
        meals: [],
        distance: '—',
      },
    ],
    addOns: [],
    featured: false,
  };
}

export function createEmptyDestination(): Destination {
  return {
    id: newId('d'),
    name: 'New destination',
    slug: 'new-destination',
    tagline: 'A short tagline',
    description: 'One paragraph for cards.',
    longDescription: 'Longer copy for the detail page.',
    bestTime: 'Year round',
    distanceFromColombo: '—',
    language: 'Sinhala / English',
    avgTemp: '28°C',
    packageCount: 0,
    gradient: 'from-blue-600 to-indigo-800',
    attractions: [{ name: 'Attraction 1', type: 'Sight', description: 'Description' }],
  };
}

export function createEmptyVehicle(): Vehicle {
  return {
    id: newId('v'),
    name: 'New vehicle',
    type: 'Van',
    capacity: 6,
    luggage: 4,
    priceModifier: 0,
    dailyRate: 60,
    features: ['AC', 'GPS'],
    gradient: 'from-slate-500 to-slate-700',
  };
}

export function createEmptyHotel(): Hotel {
  return {
    id: newId('h'),
    name: 'New hotel',
    destination: 'colombo',
    tier: 'standard',
    rating: 4,
    pricePerNight: 80,
    features: ['AC', 'WiFi'],
    gradient: 'from-blue-500 to-indigo-600',
  };
}

export function createEmptyActivity(): Activity {
  return {
    id: newId('act'),
    destination: 'colombo',
    name: 'New activity',
    duration: '2 hours',
    pricePerPerson: 25,
    difficulty: 'Easy',
    included: false,
    description: 'Activity description',
    icon: '🎯',
  };
}

export function createEmptyTestimonial(): Testimonial {
  return {
    id: newId('t'),
    name: 'Guest name',
    country: 'Country',
    countryFlag: '🌍',
    rating: 5,
    packageName: 'Example package',
    date: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }),
    text: 'Review text…',
    initials: 'GN',
    avatarGradient: 'from-blue-400 to-indigo-600',
  };
}
