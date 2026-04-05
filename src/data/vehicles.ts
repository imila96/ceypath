export interface Vehicle {
  id: string;
  name: string;
  type: 'Sedan' | 'SUV' | 'Van' | 'Luxury' | 'Minibus';
  capacity: number;
  luggage: number;
  priceModifier: number;
  dailyRate: number;
  features: string[];
  gradient: string;
  badge?: string;
  /** Optional photo (path, URL, or data URL from admin) */
  image?: string;
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Toyota Corolla',
    type: 'Sedan',
    capacity: 3,
    luggage: 2,
    priceModifier: 0,
    dailyRate: 45,
    features: ['AC', 'USB Charging', 'Comfortable Seats', 'GPS'],
    gradient: 'from-slate-400 to-slate-600',
  },
  {
    id: 'v2',
    name: 'Toyota Premio',
    type: 'Sedan',
    capacity: 4,
    luggage: 3,
    priceModifier: 30,
    dailyRate: 55,
    features: ['AC', 'USB Charging', 'Reclining Seats', 'GPS', 'Bluetooth'],
    gradient: 'from-gray-500 to-gray-700',
    badge: 'Popular',
  },
  {
    id: 'v3',
    name: 'Toyota KDH Van',
    type: 'Van',
    capacity: 8,
    luggage: 6,
    priceModifier: 80,
    dailyRate: 75,
    features: ['AC', 'USB Charging', 'Captain Seats', 'GPS', 'TV Screen', 'Fridge'],
    gradient: 'from-blue-500 to-blue-700',
    badge: 'Best Value',
  },
  {
    id: 'v4',
    name: 'Toyota HiAce',
    type: 'Minibus',
    capacity: 12,
    luggage: 10,
    priceModifier: 120,
    dailyRate: 95,
    features: ['AC', 'USB Charging', 'Individual Seats', 'GPS', 'WiFi', 'Refrigerator', 'Entertainment System'],
    gradient: 'from-indigo-500 to-indigo-700',
  },
  {
    id: 'v5',
    name: 'Toyota Land Cruiser',
    type: 'SUV',
    capacity: 7,
    luggage: 5,
    priceModifier: 150,
    dailyRate: 110,
    features: ['AC', 'USB Charging', 'Leather Seats', 'GPS', '4WD', 'Sunroof', 'Bluetooth'],
    gradient: 'from-zinc-600 to-zinc-800',
    badge: 'Off-Road',
  },
  {
    id: 'v6',
    name: 'Mercedes V-Class',
    type: 'Luxury',
    capacity: 7,
    luggage: 7,
    priceModifier: 280,
    dailyRate: 180,
    features: ['AC', 'USB Charging', 'Premium Leather', 'GPS', 'WiFi', 'Minibar', 'Privacy Glass', 'Sound System'],
    gradient: 'from-neutral-700 to-neutral-900',
    badge: 'Luxury',
  },
  {
    id: 'v7',
    name: 'BMW 5 Series',
    type: 'Luxury',
    capacity: 4,
    luggage: 3,
    priceModifier: 320,
    dailyRate: 200,
    features: ['AC', 'Wireless Charging', 'Premium Leather', 'GPS', 'WiFi', 'Panoramic Roof', 'Harman Kardon Audio'],
    gradient: 'from-stone-700 to-stone-900',
    badge: 'Premium',
  },
  {
    id: 'v8',
    name: 'Mini Coach (14-Seater)',
    type: 'Minibus',
    capacity: 14,
    luggage: 14,
    priceModifier: 200,
    dailyRate: 150,
    features: ['AC', 'USB Charging', 'Reclining Seats', 'GPS', 'WiFi', 'PA System', 'Storage Bins'],
    gradient: 'from-teal-600 to-teal-800',
    badge: 'Groups',
  },
];
