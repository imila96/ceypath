export type HotelTier = 'budget' | 'standard' | 'luxury';

export interface HotelGalleryImage {
  label?: string;
  src: string;
}

export interface HotelRoomType {
  name: string;
  /** e.g. "2 single beds and 1 sofa bed" */
  beds?: string;
  maxGuests?: number;
}

export interface HotelNearbyPlace {
  name: string;
  /** e.g. "200 m", "1.2 km" */
  distance: string;
}

export interface HotelSurroundingsGroup {
  category: string;
  places: HotelNearbyPlace[];
}

export interface HotelRestaurant {
  name: string;
  cuisine?: string;
  /** e.g. "Breakfast • Lunch • Dinner" */
  openFor?: string;
  ambiance?: string;
}

export interface HotelFaq {
  question: string;
  answer: string;
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  tier: HotelTier;
  rating: number;
  pricePerNight: number;
  features: string[];
  gradient: string;
  /** Optional photo (path, URL, or data URL from admin) */
  image?: string;
  /** Full address for travellers */
  address?: string;
  /** Short badge under the title (e.g. "Rooftop pool · city & sea views") */
  tagline?: string;
  /** Longer story: distances, room notes, services — plain text, blank lines = paragraphs */
  description?: string;
  /** Bullet selling points */
  highlights?: string[];
  /** Extra photos after the hero */
  galleryImages?: HotelGalleryImage[];
  checkIn?: string;
  checkOut?: string;
  distanceToCenter?: string;
  distanceToBeach?: string;
  /** Google Maps or other map link */
  mapUrl?: string;
  roomTypes?: HotelRoomType[];
  surroundings?: HotelSurroundingsGroup[];
  restaurants?: HotelRestaurant[];
  faqs?: HotelFaq[];
  sustainabilityNote?: string;
  guestQuote?: string;
  guestQuoteAttribution?: string;
  /** Optional display score 0–10 (e.g. 8.5) */
  guestScore?: number;
  guestReviewCount?: number;
}

export const hotels: Hotel[] = [
  // Colombo
  { id: 'h-col-b1', name: 'Colombo City Guesthouse', destination: 'colombo', tier: 'budget', rating: 3, pricePerNight: 35, features: ['AC', 'WiFi', 'Breakfast'], gradient: 'from-blue-300 to-blue-500' },
  { id: 'h-col-b2', name: 'Lotus Hostel Colombo', destination: 'colombo', tier: 'budget', rating: 3, pricePerNight: 30, features: ['AC', 'WiFi', 'Shared Lounge'], gradient: 'from-blue-400 to-blue-600' },
  {
    id: 'h-col-s1',
    name: 'Cinnamon Red Colombo',
    destination: 'colombo',
    tier: 'standard',
    rating: 4,
    pricePerNight: 95,
    features: ['AC', 'WiFi', 'Pool', 'Restaurant', 'Gym', 'Airport shuttle', 'Parking'],
    gradient: 'from-blue-500 to-indigo-600',
    address: '59 Ananda Coomaraswamy Mawatha, Colombo 00300, Sri Lanka',
    tagline: 'Modern high-rise · rooftop infinity pool · great for couples',
    description:
      'Cinnamon Red sits near Colombo’s dining and nightlife, with a rooftop infinity pool overlooking the city and ocean.\n\nRooms feature carpet or wood-style flooring, air conditioning, wardrobe, safe, flat-screen TV, and tea/coffee facilities. The 24-hour front desk can help with currency exchange and local tips.\n\nBreakfast includes continental and American options; the on-site restaurant and bar serve local and international dishes.',
    highlights: [
      'Top location for exploring Colombo',
      'Rooftop pool with sea & city views',
      'Walking distance to parks, museums, and dining',
      'Free private parking on site',
    ],
    checkIn: 'From 14:00',
    checkOut: 'Until 12:00',
    distanceToCenter: 'Approx. 2.5 km from central Colombo',
    distanceToBeach: 'Approx. 500 m to nearest city beaches',
    mapUrl: 'https://maps.google.com/?q=Cinnamon+Red+Colombo',
    guestScore: 8.5,
    guestReviewCount: 4026,
    guestQuote:
      'Loved the rooftop pool and the staff — perfect first stop after a long flight.',
    guestQuoteAttribution: 'Guest from Australia',
    sustainabilityNote: 'This example property supports responsible travel practices; ask us for details.',
    roomTypes: [
      { name: 'Standard Twin Room', beds: '2 single beds + 1 sofa bed', maxGuests: 3 },
      { name: 'Standard King Room', beds: '1 extra-large double + sofa bed', maxGuests: 3 },
      { name: 'Suite with Lake View', beds: '1 extra-large double bed', maxGuests: 2 },
    ],
    restaurants: [
      {
        name: 'Flavoured',
        cuisine: 'International',
        openFor: 'Breakfast · Lunch · Dinner',
        ambiance: 'Modern dining with city views',
      },
    ],
    surroundings: [
      {
        category: 'Top attractions',
        places: [
          { name: 'Viharamahadevi Park', distance: '1 km' },
          { name: 'National Art Gallery', distance: '1.1 km' },
        ],
      },
      {
        category: 'Public transport',
        places: [
          { name: 'Kollupitiya Railway Station', distance: '650 m' },
          { name: 'Colombo Fort Railway Station', distance: '3 km' },
        ],
      },
      {
        category: 'Airports',
        places: [{ name: 'Bandaranaike International (CMB)', distance: '33 km' }],
      },
    ],
    faqs: [
      {
        question: 'What kind of breakfast is served?',
        answer: 'Continental and American breakfast options are available; guest scores for breakfast are typically high.',
      },
      {
        question: 'Does the hotel have a pool?',
        answer: 'Yes — a rooftop outdoor infinity pool with views.',
      },
      {
        question: 'What are the check-in and check-out times?',
        answer: 'Check-in from 14:00. Check-out until 12:00.',
      },
    ],
  },
  { id: 'h-col-s2', name: 'Galadari Hotel', destination: 'colombo', tier: 'standard', rating: 4, pricePerNight: 105, features: ['AC', 'WiFi', 'Pool', 'Restaurant', 'Spa'], gradient: 'from-indigo-400 to-indigo-600' },
  { id: 'h-col-l1', name: 'Shangri-La Colombo', destination: 'colombo', tier: 'luxury', rating: 5, pricePerNight: 280, features: ['AC', 'WiFi', 'Infinity Pool', 'Multiple Restaurants', 'Spa', 'Butler Service'], gradient: 'from-indigo-600 to-purple-800' },
  { id: 'h-col-l2', name: 'Taj Samudra Colombo', destination: 'colombo', tier: 'luxury', rating: 5, pricePerNight: 260, features: ['AC', 'WiFi', 'Oceanfront Pool', 'Fine Dining', 'Spa', 'Club Lounge'], gradient: 'from-blue-700 to-indigo-900' },

  // Kandy
  { id: 'h-kan-b1', name: 'Kandy Hillside Bungalow', destination: 'kandy', tier: 'budget', rating: 3, pricePerNight: 28, features: ['AC', 'WiFi', 'Garden View'], gradient: 'from-emerald-300 to-green-500' },
  { id: 'h-kan-b2', name: 'Temple View Guesthouse', destination: 'kandy', tier: 'budget', rating: 3, pricePerNight: 32, features: ['AC', 'WiFi', 'Breakfast', 'Temple View'], gradient: 'from-green-300 to-teal-500' },
  { id: 'h-kan-s1', name: 'Mahaweli Reach Hotel', destination: 'kandy', tier: 'standard', rating: 4, pricePerNight: 88, features: ['AC', 'WiFi', 'Pool', 'Restaurant', 'River View'], gradient: 'from-emerald-500 to-teal-700' },
  { id: 'h-kan-s2', name: 'Hotel Suisse Kandy', destination: 'kandy', tier: 'standard', rating: 4, pricePerNight: 80, features: ['AC', 'WiFi', 'Restaurant', 'Garden', 'Heritage Building'], gradient: 'from-teal-400 to-cyan-600' },
  { id: 'h-kan-l1', name: 'Kandy House', destination: 'kandy', tier: 'luxury', rating: 5, pricePerNight: 320, features: ['AC', 'WiFi', 'Pool', 'Fine Dining', 'Spa', 'Boutique Experience'], gradient: 'from-teal-600 to-emerald-800' },
  { id: 'h-kan-l2', name: 'Amaya Hills Kandy', destination: 'kandy', tier: 'luxury', rating: 5, pricePerNight: 295, features: ['AC', 'WiFi', 'Hilltop Pool', 'Multiple Restaurants', 'Spa', 'Panoramic Views'], gradient: 'from-emerald-600 to-green-900' },

  // Sigiriya
  { id: 'h-sig-b1', name: 'Rock View Guesthouse', destination: 'sigiriya', tier: 'budget', rating: 3, pricePerNight: 25, features: ['AC', 'WiFi', 'Rock View'], gradient: 'from-amber-300 to-yellow-500' },
  { id: 'h-sig-b2', name: 'Sigiriya Village Inn', destination: 'sigiriya', tier: 'budget', rating: 3, pricePerNight: 30, features: ['AC', 'WiFi', 'Local Food', 'Cycling'], gradient: 'from-orange-300 to-amber-500' },
  { id: 'h-sig-s1', name: 'Sigiriya Safari Hotel', destination: 'sigiriya', tier: 'standard', rating: 4, pricePerNight: 75, features: ['AC', 'WiFi', 'Pool', 'Restaurant', 'Wildlife Safaris'], gradient: 'from-amber-500 to-orange-700' },
  { id: 'h-sig-s2', name: 'Jetwing Vil Uyana', destination: 'sigiriya', tier: 'standard', rating: 4, pricePerNight: 185, features: ['AC', 'WiFi', 'Lake Views', 'Eco Resort', 'Wildlife Walks'], gradient: 'from-orange-400 to-red-600' },
  { id: 'h-sig-l1', name: 'Water Garden Sigiriya', destination: 'sigiriya', tier: 'luxury', rating: 5, pricePerNight: 350, features: ['AC', 'WiFi', 'Private Pool Villas', 'Fine Dining', 'Spa', 'Rock Views'], gradient: 'from-orange-600 to-amber-900' },
  { id: 'h-sig-l2', name: 'Aliya Resort & Spa', destination: 'sigiriya', tier: 'luxury', rating: 5, pricePerNight: 290, features: ['AC', 'WiFi', 'Elephant Encounters', 'Infinity Pool', 'Spa'], gradient: 'from-amber-700 to-orange-900' },

  // Galle
  { id: 'h-gal-b1', name: 'Galle Fort Hostel', destination: 'galle', tier: 'budget', rating: 3, pricePerNight: 30, features: ['AC', 'WiFi', 'Fort Location', 'Common Kitchen'], gradient: 'from-sky-300 to-blue-500' },
  { id: 'h-gal-b2', name: 'Unawatuna Bungalow', destination: 'galle', tier: 'budget', rating: 3, pricePerNight: 28, features: ['AC', 'WiFi', 'Beach Proximity'], gradient: 'from-cyan-300 to-sky-500' },
  { id: 'h-gal-s1', name: 'Jetwing Lighthouse', destination: 'galle', tier: 'standard', rating: 4, pricePerNight: 145, features: ['AC', 'WiFi', 'Ocean View', 'Pool', 'Restaurant'], gradient: 'from-sky-500 to-cyan-700' },
  { id: 'h-gal-s2', name: 'Amangalla', destination: 'galle', tier: 'standard', rating: 4, pricePerNight: 220, features: ['AC', 'WiFi', 'Heritage Boutique', 'Pool', 'Spa', 'Fort Location'], gradient: 'from-blue-400 to-sky-600' },
  { id: 'h-gal-l1', name: 'Cape Weligama', destination: 'galle', tier: 'luxury', rating: 5, pricePerNight: 480, features: ['AC', 'WiFi', 'Clifftop Infinity Pool', 'Private Villas', 'Fine Dining', 'Spa'], gradient: 'from-sky-700 to-blue-900' },
  { id: 'h-gal-l2', name: 'The Fortress Resort', destination: 'galle', tier: 'luxury', rating: 5, pricePerNight: 420, features: ['AC', 'WiFi', 'Beachfront', 'Multiple Pools', 'Spa', 'Dive Center'], gradient: 'from-cyan-600 to-sky-900' },

  // Ella
  { id: 'h-ell-b1', name: 'Ella Gap Tourist Inn', destination: 'ella', tier: 'budget', rating: 3, pricePerNight: 22, features: ['Fan', 'WiFi', 'Valley View', 'Breakfast'], gradient: 'from-green-300 to-lime-500' },
  { id: 'h-ell-b2', name: 'Nine Arch View Hostel', destination: 'ella', tier: 'budget', rating: 3, pricePerNight: 20, features: ['AC', 'WiFi', 'Bridge View', 'Rooftop'], gradient: 'from-lime-300 to-green-500' },
  { id: 'h-ell-s1', name: 'Ella Flower Garden Resort', destination: 'ella', tier: 'standard', rating: 4, pricePerNight: 65, features: ['AC', 'WiFi', 'Restaurant', 'Mountain Views', 'Garden'], gradient: 'from-green-500 to-lime-700' },
  { id: 'h-ell-s2', name: 'Zion View Ella', destination: 'ella', tier: 'standard', rating: 4, pricePerNight: 75, features: ['AC', 'WiFi', 'Infinity Pool', 'Restaurant', 'Tea Views'], gradient: 'from-lime-500 to-green-700' },
  { id: 'h-ell-l1', name: '98 Acres Resort Ella', destination: 'ella', tier: 'luxury', rating: 5, pricePerNight: 220, features: ['AC', 'WiFi', 'Infinity Pool', 'Tea Plantation', 'Fine Dining', 'Spa', 'Valley Views'], gradient: 'from-green-700 to-lime-900' },
  { id: 'h-ell-l2', name: 'Amba Estate', destination: 'ella', tier: 'luxury', rating: 5, pricePerNight: 240, features: ['AC', 'WiFi', 'Treehouse Villas', 'Organic Farm', 'Fine Dining', 'Hiking'], gradient: 'from-lime-700 to-green-900' },

  // Mirissa
  { id: 'h-mir-b1', name: 'Mirissa Bay Inn', destination: 'mirissa', tier: 'budget', rating: 3, pricePerNight: 25, features: ['Fan', 'WiFi', 'Beach Access', 'Hammocks'], gradient: 'from-teal-300 to-cyan-500' },
  { id: 'h-mir-b2', name: 'Secret Beach Huts', destination: 'mirissa', tier: 'budget', rating: 3, pricePerNight: 30, features: ['Fan', 'WiFi', 'Beachfront', 'Restaurant'], gradient: 'from-cyan-300 to-teal-500' },
  { id: 'h-mir-s1', name: 'Paradise Beach Club', destination: 'mirissa', tier: 'standard', rating: 4, pricePerNight: 80, features: ['AC', 'WiFi', 'Beachfront', 'Pool', 'Restaurant', 'Bar'], gradient: 'from-teal-500 to-blue-700' },
  { id: 'h-mir-s2', name: 'Banana Garden Mirissa', destination: 'mirissa', tier: 'standard', rating: 4, pricePerNight: 70, features: ['AC', 'WiFi', 'Pool', 'Restaurant', 'Whale Watching Tours'], gradient: 'from-blue-400 to-teal-600' },
  { id: 'h-mir-l1', name: 'Mirissa Hills', destination: 'mirissa', tier: 'luxury', rating: 5, pricePerNight: 280, features: ['AC', 'WiFi', 'Ocean View Villas', 'Infinity Pool', 'Fine Dining', 'Spa'], gradient: 'from-teal-700 to-blue-900' },
  { id: 'h-mir-l2', name: 'The Sun Beach Hotel', destination: 'mirissa', tier: 'luxury', rating: 5, pricePerNight: 250, features: ['AC', 'WiFi', 'Beachfront Villas', 'Pool', 'Spa', 'Water Sports'], gradient: 'from-blue-600 to-teal-900' },

  // Nuwara Eliya
  { id: 'h-nuw-b1', name: 'Ramboda Tea Bungalow', destination: 'nuwara-eliya', tier: 'budget', rating: 3, pricePerNight: 25, features: ['Heater', 'WiFi', 'Tea Views', 'Fireplace'], gradient: 'from-purple-300 to-violet-500' },
  { id: 'h-nuw-b2', name: 'Nuwara Budget Inn', destination: 'nuwara-eliya', tier: 'budget', rating: 3, pricePerNight: 22, features: ['Heater', 'WiFi', 'Breakfast', 'City Center'], gradient: 'from-violet-300 to-purple-500' },
  { id: 'h-nuw-s1', name: 'St. Andrews Hotel', destination: 'nuwara-eliya', tier: 'standard', rating: 4, pricePerNight: 95, features: ['Heater', 'WiFi', 'Colonial Heritage', 'Restaurant', 'Golf Nearby'], gradient: 'from-purple-500 to-violet-700' },
  { id: 'h-nuw-s2', name: 'Heritance Tea Factory', destination: 'nuwara-eliya', tier: 'standard', rating: 4, pricePerNight: 155, features: ['Heater', 'WiFi', 'Converted Tea Factory', 'Restaurant', 'Tea Museum'], gradient: 'from-violet-400 to-purple-700' },
  { id: 'h-nuw-l1', name: 'The Blackpool Hotel', destination: 'nuwara-eliya', tier: 'luxury', rating: 5, pricePerNight: 250, features: ['Heater', 'WiFi', 'Lake Views', 'Fine Dining', 'Spa', 'Victorian Architecture'], gradient: 'from-purple-700 to-violet-900' },
  { id: 'h-nuw-l2', name: 'Grand Hotel Nuwara Eliya', destination: 'nuwara-eliya', tier: 'luxury', rating: 5, pricePerNight: 220, features: ['Heater', 'WiFi', 'Golf Course', 'Multiple Restaurants', 'Spa', 'Heritage Property'], gradient: 'from-violet-600 to-purple-900' },

  // Trincomalee
  { id: 'h-tri-b1', name: 'Trinco Beach Huts', destination: 'trincomalee', tier: 'budget', rating: 3, pricePerNight: 20, features: ['Fan', 'WiFi', 'Beach Access', 'Hammocks'], gradient: 'from-orange-300 to-red-500' },
  { id: 'h-tri-b2', name: 'Uppuveli Budget Stay', destination: 'trincomalee', tier: 'budget', rating: 3, pricePerNight: 22, features: ['Fan', 'WiFi', 'Sea View', 'Diving Nearby'], gradient: 'from-red-300 to-orange-500' },
  { id: 'h-tri-s1', name: 'Jungle Beach by Uga', destination: 'trincomalee', tier: 'standard', rating: 4, pricePerNight: 185, features: ['AC', 'WiFi', 'Private Beach', 'Pool', 'Restaurant', 'Snorkeling'], gradient: 'from-orange-500 to-red-700' },
  { id: 'h-tri-s2', name: 'Welcombe Hotel Trinco', destination: 'trincomalee', tier: 'standard', rating: 4, pricePerNight: 75, features: ['AC', 'WiFi', 'Sea View', 'Restaurant', 'Whale Watching Tours'], gradient: 'from-red-400 to-orange-700' },
  { id: 'h-tri-l1', name: 'Pigeon Island Beach Resort', destination: 'trincomalee', tier: 'luxury', rating: 5, pricePerNight: 310, features: ['AC', 'WiFi', 'Beachfront', 'Infinity Pool', 'Fine Dining', 'Dive Center'], gradient: 'from-red-600 to-orange-900' },
  { id: 'h-tri-l2', name: 'Club Oceanic Trinco', destination: 'trincomalee', tier: 'luxury', rating: 5, pricePerNight: 280, features: ['AC', 'WiFi', 'Ocean Villas', 'Pool', 'Spa', 'Water Sports'], gradient: 'from-orange-700 to-red-900' },
];
