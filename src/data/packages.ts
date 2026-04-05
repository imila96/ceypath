export type PackageType = 'budget' | 'standard' | 'premium' | 'luxury';
export type PackageBadge = 'BESTSELLER' | 'NEW' | 'LIMITED' | 'HOT DEAL';

/** Suggested properties for a night — shown on the package detail itinerary (optional). */
export interface ItineraryHotelOption {
  name: string;
  summary: string;
  /** Per night, same currency as package list price (typically USD). */
  pricePerNight?: number;
  image?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  /** Short default label when no hotelOptions (legacy). */
  hotel: string;
  meals: string[];
  distance: string;
  /** Photos for this day (thumbnails in accordion). */
  gallery?: GalleryImage[];
  /** One or more hotels with blurb & price; if set, detail page prefers this over the single `hotel` line. */
  hotelOptions?: ItineraryHotelOption[];
}

export interface AddOn {
  id: string;
  name: string;
  pricePerPerson: number;
  included: boolean;
}

export interface GalleryImage {
  label: string;
  src: string;
}

export interface TourPackage {
  id: string;
  name: string;
  shortDescription: string;
  days: number;
  nights: number;
  type: PackageType;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  destinations: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  vehicle: string;
  hotelRating: number;
  gradient: string;
  badge: PackageBadge;
  spotsLeft?: number;
  itinerary: ItineraryDay[];
  addOns: AddOn[];
  featured: boolean;
  /** Hero image URL under /public (e.g. /images/tourism/sigiriya.jpg) */
  coverImage?: string;
  /** Real photos for detail gallery (falls back to gradients if omitted) */
  galleryImages?: GalleryImage[];
  /** Shown in homepage “highlighted tour” strip */
  highlighted?: boolean;
}

export const packages: TourPackage[] = [
  {
    id: 'pkg-island-wonders',
    name: 'Island Wonders — Heritage, Hills & Wildlife',
    shortDescription:
      'Our signature circuit with real Sri Lanka moments: sacred Anuradhapura, cave temples at Dambulla, Sigiriya\'s lion rock, Kandy\'s Temple of the Tooth, Ella\'s Nine Arch Bridge, big-game drives in Yala & Wilpattu, and Galle\'s coast — using photos from our own tours.',
    days: 11,
    nights: 10,
    type: 'premium',
    price: 1699,
    originalPrice: 1999,
    rating: 4.9,
    reviewCount: 178,
    destinations: ['Colombo', 'Anuradhapura', 'Dambulla', 'Sigiriya', 'Kandy', 'Ella', 'Yala', 'Wilpattu', 'Galle'],
    highlights: [
      '✓ UNESCO Ancient Cities & Sigiriya',
      '✓ Kandy Cultural Capital & Ella Highlands',
      '✓ Yala & Wilpattu Jeep Safaris',
      '✓ Galle Coast & Airport Transfers',
    ],
    inclusions: [
      '10 nights handpicked hotels',
      'Private Toyota KDH Van with English-speaking driver-guide',
      'All listed park entrance & jeep safari fees (Yala & Wilpattu)',
      'Sigiriya Rock & Dambulla Cave Temple tickets',
      'Daily breakfast',
      'Airport meet & greet',
    ],
    exclusions: [
      'International flights',
      'Travel insurance',
      'Lunches & dinners unless stated',
      'Tips & personal expenses',
    ],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-teal-600 to-emerald-900',
    badge: 'BESTSELLER',
    highlighted: true,
    coverImage: '/images/tourism/sigiriya.jpg',
    galleryImages: [
      { label: 'Anuradhapura — sacred city', src: '/images/tourism/anuradhapura.jpg' },
      { label: 'Dambulla — cave temples', src: '/images/tourism/dambulla.jpg' },
      { label: 'Sigiriya — Lion Rock', src: '/images/tourism/sigiriya.jpg' },
      { label: 'Kandy — Temple of the Tooth', src: '/images/tourism/kandy-temple.jpg' },
      { label: 'Kandy — festival spirit', src: '/images/tourism/kandy-perahera.jpg' },
      { label: 'Ella — Nine Arch Bridge', src: '/images/tourism/ella-nine-arch.jpg' },
      { label: 'Southern coast near Galle', src: '/images/tourism/galle-coast.jpg' },
      { label: 'Yala & Wilpattu wildlife', src: '/images/tourism/wildlife-yala-wilpattu.jpg' },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Colombo — Welcome to Sri Lanka',
        morning: 'Airport pickup at CMB. Transfer to hotel, rest after your flight.',
        afternoon: 'Optional Colombo orientation: Galle Face Green or Gangaramaya.',
        evening: 'Welcome dinner (optional). Overnight Colombo.',
        hotel: 'Cinnamon Red Colombo',
        meals: [],
        distance: '40 km',
        gallery: [
          { label: 'Coast & city', src: '/images/tourism/galle-coast.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Cinnamon Red Colombo',
            summary: 'Contemporary hotel near dining; rooftop pool — great first night.',
            pricePerNight: 92,
            image: '/images/tourism/galle-coast.jpg',
          },
          {
            name: 'Courtyard by Marriott Colombo',
            summary: 'Alternative with sea-facing rooms and club lounge (supplement).',
            pricePerNight: 118,
          },
        ],
      },
      {
        day: 2,
        title: 'Colombo → Anuradhapura — Ancient Capitals',
        morning: 'Drive north to the Cultural Triangle.',
        afternoon: 'Explore UNESCO Anuradhapura: Ruwanwelisaya, Sri Maha Bodhi, ancient stupas.',
        evening: 'Sunset over the sacred city. Overnight Anuradhapura area.',
        hotel: 'Heritage Hotel Anuradhapura',
        meals: ['Breakfast'],
        distance: '205 km',
        gallery: [
          { label: 'Sacred city', src: '/images/tourism/anuradhapura.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Heritage Hotel Anuradhapura',
            summary: 'Quiet base near the ancient sites; pool and garden rooms.',
            pricePerNight: 78,
            image: '/images/tourism/anuradhapura.jpg',
          },
          {
            name: 'Forest-edge lodge style',
            summary: 'Boutique option amid greenery — on request.',
            pricePerNight: 95,
          },
        ],
      },
      {
        day: 3,
        title: 'Dambulla Caves → Sigiriya Base',
        morning: 'Visit Dambulla Cave Temple — golden Buddha statues and rock frescoes.',
        afternoon: 'Short drive to Sigiriya region. Village walk or optional Pidurangala viewpoint.',
        evening: 'Relax at hotel pool. Overnight Sigiriya.',
        hotel: 'Sigiriya Safari Hotel',
        meals: ['Breakfast'],
        distance: '75 km',
        gallery: [
          { label: 'Dambulla caves', src: '/images/tourism/dambulla.jpg' },
          { label: 'Sigiriya region', src: '/images/tourism/sigiriya.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Sigiriya Safari Hotel',
            summary: 'Close to Lion Rock with pool; ideal before the climb.',
            pricePerNight: 88,
            image: '/images/tourism/sigiriya.jpg',
          },
        ],
      },
      {
        day: 4,
        title: 'Sigiriya Rock Fortress',
        morning: 'Climb Sigiriya Lion Rock with guide — frescoes, mirror wall, summit views.',
        afternoon: 'Water gardens & museum. Optional Minneriya elephant gathering (seasonal).',
        evening: 'Traditional rice & curry. Overnight Sigiriya.',
        hotel: 'Sigiriya Safari Hotel',
        meals: ['Breakfast'],
        distance: '15 km',
        gallery: [
          { label: 'Lion Rock', src: '/images/tourism/sigiriya.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Sigiriya Safari Hotel',
            summary: 'Same comfortable base — extra night to rest after the climb.',
            pricePerNight: 88,
            image: '/images/tourism/sigiriya.jpg',
          },
          {
            name: 'Water Garden Sigiriya',
            summary: 'Upgrade to luxury villas with private plunge pools.',
            pricePerNight: 210,
          },
        ],
      },
      {
        day: 5,
        title: 'Sigiriya → Kandy — Hill Country Gateway',
        morning: 'Scenic drive to Kandy via spice garden or batik workshop.',
        afternoon: 'Kandy Lake walk, viewpoint cafés.',
        evening: 'Temple of the Tooth evening ceremony (puja). Cultural dance show optional.',
        hotel: 'Mahaweli Reach Hotel',
        meals: ['Breakfast'],
        distance: '95 km',
        gallery: [
          { label: 'Temple of the Tooth', src: '/images/tourism/kandy-temple.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Mahaweli Reach Hotel',
            summary: 'Resort-style stay by the river; easy reach to the temple.',
            pricePerNight: 102,
            image: '/images/tourism/kandy-temple.jpg',
          },
          {
            name: 'Earl\'s Regency',
            summary: 'Hill-view rooms with spa — popular upgrade.',
            pricePerNight: 125,
          },
        ],
      },
      {
        day: 6,
        title: 'Kandy — Culture & Gardens',
        morning: 'Peradeniya Royal Botanic Gardens.',
        afternoon: 'Gem museum, local markets, or Udawatta Kele forest walk.',
        evening: 'Free evening in Kandy town.',
        hotel: 'Mahaweli Reach Hotel',
        meals: ['Breakfast'],
        distance: '25 km',
        gallery: [
          { label: 'Kandy culture', src: '/images/tourism/kandy-perahera.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Mahaweli Reach Hotel',
            summary: 'Second night in Kandy — same hotel or swap on request.',
            pricePerNight: 102,
            image: '/images/tourism/kandy-perahera.jpg',
          },
        ],
      },
      {
        day: 7,
        title: 'Scenic Train to Ella',
        morning: 'Board the famous hill-country train (subject to seat availability).',
        afternoon: 'Arrive Ella — Nine Arch Bridge & tea-country views.',
        evening: 'Café hopping or chill at guesthouse.',
        hotel: 'Ella Flower Garden Resort',
        meals: ['Breakfast'],
        distance: 'Train',
        gallery: [
          { label: 'Nine Arch Bridge', src: '/images/tourism/ella-nine-arch.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Ella Flower Garden Resort',
            summary: 'Tea-country views; short tuk-tuk to the bridge.',
            pricePerNight: 85,
            image: '/images/tourism/ella-nine-arch.jpg',
          },
        ],
      },
      {
        day: 8,
        title: 'Ella — Highlands & Waterfalls',
        morning: 'Little Adam\'s Peak or Ella Rock hike (fitness dependent).',
        afternoon: 'Ravana Falls, tea factory visit.',
        evening: 'Overnight Ella.',
        hotel: 'Ella Flower Garden Resort',
        meals: ['Breakfast'],
        distance: '20 km',
        gallery: [
          { label: 'Hill country', src: '/images/tourism/ella-nine-arch.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Ella Flower Garden Resort',
            summary: 'Extend your stay in the highlands before heading south.',
            pricePerNight: 85,
            image: '/images/tourism/ella-nine-arch.jpg',
          },
        ],
      },
      {
        day: 9,
        title: 'Ella → Yala — Leopard Country',
        morning: 'Descend to the dry zone toward Yala.',
        afternoon: 'First Yala National Park jeep safari — leopards, elephants, coastal lagoons.',
        evening: 'Overnight near Yala / Tissamaharama.',
        hotel: 'Yala Safari Lodge',
        meals: ['Breakfast'],
        distance: '120 km',
        gallery: [
          { label: 'Wildlife', src: '/images/tourism/wildlife-yala-wilpattu.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Yala Safari Lodge',
            summary: 'Near the park gates — early jeep departures, pool after safari.',
            pricePerNight: 110,
            image: '/images/tourism/wildlife-yala-wilpattu.jpg',
          },
          {
            name: 'Chena Huts style glamping',
            summary: 'Luxury tents inside/near buffer — price on request.',
            pricePerNight: 380,
          },
        ],
      },
      {
        day: 10,
        title: 'Wilpattu — Big Lakes & Forest',
        morning: 'Drive to Wilpattu National Park.',
        afternoon: 'Full or half-day jeep safari — villus (lakes), sloth bear & leopard habitat.',
        evening: 'Overnight near Wilpattu / Puttalam route.',
        hotel: 'Wilpattu Edge Lodge',
        meals: ['Breakfast'],
        distance: '180 km',
        gallery: [
          { label: 'Wilpattu wilderness', src: '/images/tourism/wildlife-yala-wilpattu.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Wilpattu Edge Lodge',
            summary: 'Forest-edge rooms; stargazing and early park access.',
            pricePerNight: 98,
            image: '/images/tourism/wildlife-yala-wilpattu.jpg',
          },
        ],
      },
      {
        day: 11,
        title: 'Coast & Departure',
        morning: 'Drive to Galle Fort area — ramparts, lighthouse, colonial streets.',
        afternoon: 'Beach time or shopping; transfer to Colombo BIA for your flight.',
        evening: '',
        hotel: '',
        meals: ['Breakfast'],
        distance: '160 km',
        gallery: [
          { label: 'Galle coast', src: '/images/tourism/galle-coast.jpg' },
        ],
        hotelOptions: [
          {
            name: 'Day-use & departure',
            summary: 'No overnight this day — Galle time then transfer to CMB. Extend with a Fort hotel on request.',
          },
        ],
      },
    ],
    addOns: [
      { id: 'ao-iw1', name: 'Hot air balloon — Cultural Triangle', pricePerPerson: 320, included: false },
      { id: 'ao-iw2', name: 'Extra Yala safari (full day)', pricePerPerson: 85, included: false },
      { id: 'ao-iw3', name: 'Whale watching — south coast add-on', pricePerPerson: 45, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-1',
    name: 'Classic Sri Lanka Explorer',
    shortDescription: 'The quintessential Sri Lanka experience covering all the major highlights from cultural triangle to beach.',
    days: 8,
    nights: 7,
    type: 'standard',
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 142,
    destinations: ['Colombo', 'Kandy', 'Sigiriya', 'Ella', 'Galle'],
    highlights: ['✓ Airport Transfers Included', '✓ 4-Star Hotels Throughout', '✓ Daily Breakfast', '✓ English-Speaking Guide'],
    inclusions: ['7 nights hotel accommodation', 'All airport & inter-city transfers', 'English-speaking guide throughout', 'Entrance fees to all listed sites', 'Daily breakfast at hotels', 'Sigiriya Rock Fortress ticket'],
    exclusions: ['International flights', 'Travel insurance', 'Personal expenses', 'Tips & gratuities', 'Meals other than breakfast', 'Optional activities'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-emerald-500 to-teal-700',
    badge: 'BESTSELLER',
    itinerary: [
      { day: 1, title: 'Colombo Arrival & City Tour', morning: 'Airport pickup, transfer to hotel, freshen up.', afternoon: 'Colombo city tour: Galle Face Green, Dutch Hospital, Gangaramaya Temple.', evening: 'Welcome dinner at a seafood restaurant. Overnight Colombo.', hotel: 'Cinnamon Red Colombo', meals: ['Dinner'], distance: '45 km' },
      { day: 2, title: 'Colombo to Kandy — Cultural Drive', morning: 'Depart Colombo. Stop at Pinnawala Elephant Orphanage.', afternoon: 'Continue to Kandy. Check-in & rest.', evening: 'Temple of the Tooth Relic visit. Kandyan dance show. Overnight Kandy.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '120 km' },
      { day: 3, title: 'Kandy — Royal City Exploration', morning: 'Peradeniya Royal Botanic Gardens tour.', afternoon: 'Kandy Lake walk. Spice garden visit. Local market exploration.', evening: 'Free time in Kandy city center. Optional evening temple ceremony.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '20 km' },
      { day: 4, title: 'Kandy to Sigiriya — Ancient Wonders', morning: 'Depart Kandy. Arrive Sigiriya by mid-morning.', afternoon: 'Climb Sigiriya Rock Fortress. Explore water gardens and frescoes.', evening: 'Sunset at Pidurangala Rock viewpoint. Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '95 km' },
      { day: 5, title: 'Sigiriya — Safari & Village Life', morning: 'Optional Minneriya National Park safari (extra charge).', afternoon: 'Village cycle tour through paddy fields.', evening: 'Traditional village cooking demonstration. Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '30 km' },
      { day: 6, title: 'Sigiriya to Ella — Scenic Train Journey', morning: 'Drive to Kandy. Board scenic train to Ella.', afternoon: 'Arrive Ella. Walk to Nine Arch Bridge.', evening: 'Sunset from Little Adam\'s Peak trail. Overnight Ella.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '180 km' },
      { day: 7, title: 'Ella to Galle — Southern Coast', morning: 'Ravana Ella Falls visit. Tea factory tour.', afternoon: 'Drive to Galle via Mirissa beach stop.', evening: 'Galle Fort walk at sunset. Seafood dinner. Overnight Galle.', hotel: 'Jetwing Lighthouse', meals: ['Breakfast'], distance: '210 km' },
      { day: 8, title: 'Galle & Departure', morning: 'Galle Fort guided walk. Unawatuna beach visit.', afternoon: 'Transfer to Colombo airport for departure.', evening: '', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-1', name: 'Whale Watching in Mirissa', pricePerPerson: 45, included: false },
      { id: 'ao-2', name: 'Sigiriya Rock Guided Climb (premium guide)', pricePerPerson: 0, included: true },
      { id: 'ao-3', name: 'Minneriya Elephant Safari', pricePerPerson: 65, included: false },
      { id: 'ao-4', name: 'Cooking Class in Galle', pricePerPerson: 35, included: false },
      { id: 'ao-5', name: 'White Water Rafting in Kitulgala', pricePerPerson: 55, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-2',
    name: 'Luxury Sri Lanka Grand Tour',
    shortDescription: 'An ultra-premium journey through Sri Lanka\'s finest experiences, staying in 5-star resorts throughout.',
    days: 10,
    nights: 9,
    type: 'luxury',
    price: 2499,
    originalPrice: 2899,
    rating: 4.9,
    reviewCount: 87,
    destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Galle'],
    highlights: ['✓ 5-Star Resorts Throughout', '✓ Private Mercedes V-Class', '✓ All Meals Included', '✓ Private Expert Guide'],
    inclusions: ['9 nights luxury resort accommodation', 'Private Mercedes V-Class throughout', 'Personal expert guide', 'All meals (breakfast, lunch, dinner)', 'All entrance fees', 'Champagne welcome', 'Private chef\'s table dinner', 'Helicopter transfer option (bookable)'],
    exclusions: ['International flights', 'Travel insurance', 'Personal shopping', 'Helicopter transfers (bookable extra)', 'Gratuities'],
    vehicle: 'Mercedes V-Class',
    hotelRating: 5,
    gradient: 'from-amber-500 to-yellow-700',
    badge: 'BESTSELLER',
    itinerary: [
      { day: 1, title: 'VIP Colombo Arrival', morning: 'Private airport meet & greet. Limousine transfer to Shangri-La.', afternoon: 'Welcome lunch. Personal concierge briefing.', evening: 'Private dinner at The Fool restaurant. Overnight Shangri-La Colombo.', hotel: 'Shangri-La Colombo', meals: ['Lunch', 'Dinner'], distance: '35 km' },
      { day: 2, title: 'Colombo Heritage & Departure North', morning: 'Private Colombo Heritage tour with personal guide.', afternoon: 'Drive north to Sigiriya via Dambulla Cave Temple.', evening: 'Welcome cocktails at Water Garden. Gourmet dinner. Overnight Water Garden Sigiriya.', hotel: 'Water Garden Sigiriya', meals: ['Breakfast', 'Dinner'], distance: '170 km' },
      { day: 3, title: 'Sigiriya Private Sunrise Climb', morning: 'Private early access Sigiriya climb before crowds arrive.', afternoon: 'Champagne brunch at resort. Pidurangala photography session.', evening: 'Private sunset boat ride on nearby tank. Overnight Water Garden.', hotel: 'Water Garden Sigiriya', meals: ['Breakfast', 'Brunch', 'Dinner'], distance: '15 km' },
      { day: 4, title: 'Sigiriya to Kandy — Cultural Immersion', morning: 'Village tuk-tuk tour. Traditional farming experience.', afternoon: 'Drive to Kandy. Check-in at Kandy House boutique resort.', evening: 'Private Kandyan dance performance. Temple of the Tooth evening puja ceremony.', hotel: 'Kandy House', meals: ['Breakfast', 'Dinner'], distance: '100 km' },
      { day: 5, title: 'Kandy — Royal City Deep Dive', morning: 'Peradeniya Botanical Gardens private tour.', afternoon: 'Ayurvedic spa treatment (2 hours). Free exploration.', evening: 'Sunset drinks at hilltop bar. Private chef\'s dinner at resort.', hotel: 'Kandy House', meals: ['Breakfast', 'Dinner'], distance: '25 km' },
      { day: 6, title: 'Kandy to Nuwara Eliya — Tea Country', morning: 'Scenic highland drive. Pedro Tea Estate private tour.', afternoon: 'Arrive Nuwara Eliya. Check-in at Grand Hotel.', evening: 'Victorian-style high tea. Candlelit dinner. Overnight Grand Hotel.', hotel: 'Grand Hotel Nuwara Eliya', meals: ['Breakfast', 'Tea', 'Dinner'], distance: '75 km' },
      { day: 7, title: 'Nuwara Eliya to Ella — Train Journey', morning: 'Horton Plains National Park hike to World\'s End.', afternoon: 'Board first-class scenic train to Ella.', evening: 'Arrive Ella. Sunset cocktails at 98 Acres. Gourmet dinner.', hotel: '98 Acres Resort Ella', meals: ['Breakfast', 'Dinner'], distance: '50 km' },
      { day: 8, title: 'Ella — Mountain Paradise', morning: 'Private sunrise hike to Ella Rock with packed picnic breakfast.', afternoon: 'Nine Arch Bridge visit. Tea tasting. Spa treatment.', evening: 'Bonfire dinner under the stars at the resort.', hotel: '98 Acres Resort Ella', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '20 km' },
      { day: 9, title: 'Ella to Galle — Southern Riviera', morning: 'Drive to Galle via Mirissa. Private whale watching cruise.', afternoon: 'Arrive Galle. Check-in at Cape Weligama.', evening: 'Private Galle Fort sunset tour. Seafood dinner by the ocean.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Dinner'], distance: '220 km' },
      { day: 10, title: 'Galle & Departure', morning: 'Morning yoga session on the clifftop.', afternoon: 'VIP airport transfer to Colombo BIA.', evening: 'Bon voyage lounge access at airport.', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-l1', name: 'Helicopter Transfer (any leg)', pricePerPerson: 450, included: false },
      { id: 'ao-l2', name: 'Private Ayurvedic Retreat (2 nights Kandy)', pricePerPerson: 380, included: false },
      { id: 'ao-l3', name: 'Private Whale Watching (boat charter)', pricePerPerson: 200, included: false },
      { id: 'ao-l4', name: 'Hot Air Balloon over Cultural Triangle', pricePerPerson: 320, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-3',
    name: 'Budget Backpacker Sri Lanka',
    shortDescription: 'See Sri Lanka\'s best sites on a budget without compromising on authenticity or experience.',
    days: 7,
    nights: 6,
    type: 'budget',
    price: 399,
    originalPrice: 499,
    rating: 4.5,
    reviewCount: 203,
    destinations: ['Colombo', 'Kandy', 'Sigiriya', 'Ella'],
    highlights: ['✓ Airport Pickup Included', '✓ 3-Star Guesthouses', '✓ Breakfast Daily', '✓ Shared Guide'],
    inclusions: ['6 nights guesthouse accommodation', 'All transfers by shared vehicle', 'Group English-speaking guide', 'Daily breakfast', 'Entrance fees to main sites'],
    exclusions: ['International flights', 'Lunches and dinners', 'Travel insurance', 'Optional activities', 'Personal expenses'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 3,
    gradient: 'from-green-400 to-emerald-600',
    badge: 'NEW',
    itinerary: [
      { day: 1, title: 'Colombo Arrival', morning: 'Group airport pickup. Check into Colombo City Guesthouse.', afternoon: 'Colombo city walking tour: Pettah, Galle Face Green.', evening: 'Group dinner (own expense). Overnight Colombo.', hotel: 'Colombo City Guesthouse', meals: [], distance: '35 km' },
      { day: 2, title: 'Colombo to Kandy', morning: 'Early departure. Elephant orphanage Pinnawala stop.', afternoon: 'Arrive Kandy. Temple of the Tooth visit.', evening: 'Kandyan dance show. Free evening. Overnight Kandy.', hotel: 'Kandy Hillside Bungalow', meals: ['Breakfast'], distance: '120 km' },
      { day: 3, title: 'Kandy to Sigiriya', morning: 'Matale Spice Garden. Drive to Sigiriya.', afternoon: 'Sigiriya Rock Fortress climb.', evening: 'Village dinner experience. Overnight Sigiriya.', hotel: 'Rock View Guesthouse', meals: ['Breakfast'], distance: '95 km' },
      { day: 4, title: 'Sigiriya Free Day', morning: 'Optional Minneriya safari (extra charge).', afternoon: 'Village cycle tour.', evening: 'Group barbecue at guesthouse.', hotel: 'Rock View Guesthouse', meals: ['Breakfast'], distance: '30 km' },
      { day: 5, title: 'Train to Ella', morning: 'Drive to Kandy. Board scenic train.', afternoon: 'Arrive Ella. Nine Arch Bridge walk.', evening: 'Ella village exploration. Overnight Ella.', hotel: 'Nine Arch View Hostel', meals: ['Breakfast'], distance: '180 km' },
      { day: 6, title: 'Ella Hiking Day', morning: 'Little Adam\'s Peak sunrise hike.', afternoon: 'Ravana Falls. Tea factory visit (free).', evening: 'Rooftop dinner spot. Overnight Ella.', hotel: 'Nine Arch View Hostel', meals: ['Breakfast'], distance: '25 km' },
      { day: 7, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: 'Departure.', evening: '', hotel: '', meals: ['Breakfast'], distance: '230 km' },
    ],
    addOns: [
      { id: 'ao-b1', name: 'Minneriya Elephant Safari', pricePerPerson: 45, included: false },
      { id: 'ao-b2', name: 'White Water Rafting Kitulgala', pricePerPerson: 45, included: false },
      { id: 'ao-b3', name: 'Cooking Class', pricePerPerson: 25, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-4',
    name: 'Beach & Culture Combo',
    shortDescription: 'The perfect blend of ancient cultural sites and pristine southern beaches for a well-rounded holiday.',
    days: 9,
    nights: 8,
    type: 'standard',
    price: 1099,
    originalPrice: 1299,
    rating: 4.7,
    reviewCount: 118,
    destinations: ['Colombo', 'Kandy', 'Galle', 'Mirissa'],
    highlights: ['✓ Airport Transfers Included', '✓ 4-Star Hotels', '✓ Whale Watching Trip', '✓ English Guide'],
    inclusions: ['8 nights hotel accommodation', 'All transfers', 'English guide for cultural sites', 'Whale watching excursion', 'Daily breakfast', 'Galle Fort guided tour'],
    exclusions: ['International flights', 'Travel insurance', 'Lunches & dinners', 'Personal expenses'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-sky-500 to-blue-700',
    badge: 'HOT DEAL',
    spotsLeft: 3,
    itinerary: [
      { day: 1, title: 'Colombo Arrival', morning: 'Airport pickup. Hotel check-in.', afternoon: 'Colombo city tour.', evening: 'Welcome dinner. Overnight Colombo.', hotel: 'Cinnamon Red Colombo', meals: ['Dinner'], distance: '35 km' },
      { day: 2, title: 'Colombo to Kandy', morning: 'Pinnawala Elephant Orphanage.', afternoon: 'Kandy arrival. Temple visit.', evening: 'Dance show. Overnight Kandy.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '120 km' },
      { day: 3, title: 'Kandy Cultural Day', morning: 'Botanic Gardens. Spice garden.', afternoon: 'Kandy Lake. Market visit.', evening: 'Evening puja ceremony.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '20 km' },
      { day: 4, title: 'Kandy to Galle', morning: 'Scenic drive south.', afternoon: 'Arrive Galle. Fort walk.', evening: 'Sunset on the ramparts. Overnight Galle.', hotel: 'Jetwing Lighthouse', meals: ['Breakfast'], distance: '180 km' },
      { day: 5, title: 'Galle Deep Dive', morning: 'Private Galle Fort guided tour.', afternoon: 'Cooking class with local chef.', evening: 'Fort sunset drinks. Overnight Galle.', hotel: 'Jetwing Lighthouse', meals: ['Breakfast', 'Lunch'], distance: '10 km' },
      { day: 6, title: 'Galle to Mirissa', morning: 'Unawatuna beach morning.', afternoon: 'Drive to Mirissa. Beach relaxation.', evening: 'Beach seafood dinner. Overnight Mirissa.', hotel: 'Paradise Beach Club', meals: ['Breakfast'], distance: '30 km' },
      { day: 7, title: 'Mirissa Whale Watching', morning: 'Early morning whale watching cruise.', afternoon: 'Beach relaxation. Optional snorkeling.', evening: 'Sunset at Parrot Rock. Beach dinner.', hotel: 'Paradise Beach Club', meals: ['Breakfast'], distance: '10 km' },
      { day: 8, title: 'Mirissa Leisure Day', morning: 'Coconut Tree Hill visit.', afternoon: 'Free beach time. Water sports.', evening: 'Group farewell dinner.', hotel: 'Paradise Beach Club', meals: ['Breakfast', 'Dinner'], distance: '5 km' },
      { day: 9, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '150 km' },
    ],
    addOns: [
      { id: 'ao-bc1', name: 'Scuba Diving (2 dives)', pricePerPerson: 75, included: false },
      { id: 'ao-bc2', name: 'Yala National Park Safari', pricePerPerson: 65, included: false },
      { id: 'ao-bc3', name: 'Cooking Class in Galle', pricePerPerson: 35, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-5',
    name: 'Cultural Triangle Adventure',
    shortDescription: 'Dive deep into Sri Lanka\'s ancient kingdoms — Anuradhapura, Polonnaruwa, Sigiriya, and Kandy.',
    days: 6,
    nights: 5,
    type: 'premium',
    price: 749,
    originalPrice: 899,
    rating: 4.6,
    reviewCount: 94,
    destinations: ['Colombo', 'Sigiriya', 'Kandy'],
    highlights: ['✓ UNESCO Heritage Sites', '✓ Expert Archaeologist Guide', '✓ 4-Star Hotels', '✓ All Entrance Fees'],
    inclusions: ['5 nights hotel accommodation', 'Expert archaeologist guide', 'All transfers', 'All entrance fees (UNESCO sites)', 'Daily breakfast'],
    exclusions: ['International flights', 'Travel insurance', 'Most meals', 'Personal expenses'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-amber-500 to-orange-700',
    badge: 'BESTSELLER',
    itinerary: [
      { day: 1, title: 'Colombo to Cultural Triangle', morning: 'Airport pickup. Drive to Anuradhapura.', afternoon: 'Ancient city of Anuradhapura tour (UNESCO).', evening: 'Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: [], distance: '200 km' },
      { day: 2, title: 'Polonnaruwa — Medieval Kingdom', morning: 'Polonnaruwa medieval ruins tour (UNESCO).', afternoon: 'Minneriya National Park safari.', evening: 'Village dinner. Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '65 km' },
      { day: 3, title: 'Sigiriya Rock Fortress', morning: 'Sunrise Sigiriya climb with archaeologist.', afternoon: 'Dambulla Cave Temple (UNESCO).', evening: 'Cultural show. Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '20 km' },
      { day: 4, title: 'Kandy — Royal Capital', morning: 'Drive to Kandy via Matale.', afternoon: 'Temple of the Tooth, Kandy Museum.', evening: 'Kandyan dance performance.', hotel: 'Hotel Suisse Kandy', meals: ['Breakfast'], distance: '100 km' },
      { day: 5, title: 'Kandy — Royal Gardens', morning: 'Peradeniya Botanical Gardens.', afternoon: 'Royal Palace ruins, spice garden.', evening: 'Evening puja ceremony.', hotel: 'Hotel Suisse Kandy', meals: ['Breakfast'], distance: '20 km' },
      { day: 6, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-ct1', name: 'Minneriya/Kaudulla Elephant Safari', pricePerPerson: 65, included: false },
      { id: 'ao-ct2', name: 'Anuradhapura Cycling Tour', pricePerPerson: 20, included: false },
    ],
    featured: false,
  },
  {
    id: 'pkg-6',
    name: 'Honeymoon Sri Lanka Special',
    shortDescription: 'Romance at its finest — private villas, secluded beaches, and unforgettable sunset moments.',
    days: 10,
    nights: 9,
    type: 'luxury',
    price: 2199,
    originalPrice: 2599,
    rating: 4.9,
    reviewCount: 73,
    destinations: ['Colombo', 'Kandy', 'Ella', 'Mirissa', 'Galle'],
    highlights: ['✓ Private Pool Villas', '✓ Couples Spa Treatments', '✓ Candlelit Beach Dinners', '✓ All Inclusive'],
    inclusions: ['9 nights luxury villa accommodation', 'Private Mercedes V-Class', 'Personal butler service', 'All meals (romantic setups)', 'Couples spa treatments (2 sessions)', 'Sunset boat cruise', 'Rose petal turndowns nightly'],
    exclusions: ['International flights', 'Travel insurance', 'Personal shopping', 'Extra spa sessions'],
    vehicle: 'Mercedes V-Class',
    hotelRating: 5,
    gradient: 'from-rose-500 to-pink-700',
    badge: 'BESTSELLER',
    spotsLeft: 2,
    itinerary: [
      { day: 1, title: 'Romantic Colombo Arrival', morning: 'VIP airport pickup with flowers.', afternoon: 'Champagne transfer to Shangri-La.', evening: 'Romantic rooftop dinner. Rose petal room setup.', hotel: 'Shangri-La Colombo', meals: ['Dinner'], distance: '35 km' },
      { day: 2, title: 'Colombo to Kandy — Scenic Drive', morning: 'Breakfast in bed. Late checkout.', afternoon: 'Arrive Kandy. Temple visit. Sunset over Kandy Lake.', evening: 'Private dinner at Kandy House.', hotel: 'Kandy House', meals: ['Breakfast', 'Dinner'], distance: '120 km' },
      { day: 3, title: 'Kandy — Spa & Serenity', morning: 'Couples Ayurvedic spa morning.', afternoon: 'Botanic Gardens picnic.', evening: 'Candlelit dinner in the garden.', hotel: 'Kandy House', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '20 km' },
      { day: 4, title: 'Ella — Mountain Romance', morning: 'Scenic drive to Ella.', afternoon: 'Arrive 98 Acres. Infinity pool afternoon.', evening: 'Couples massage. Sunset dinner.', hotel: '98 Acres Resort Ella', meals: ['Breakfast', 'Dinner'], distance: '200 km' },
      { day: 5, title: 'Ella — Private Mountain Experiences', morning: 'Sunrise hike with private guide.', afternoon: 'Nine Arch Bridge photo session.', evening: 'Under-the-stars bonfire dinner.', hotel: '98 Acres Resort Ella', meals: ['Breakfast', 'Dinner'], distance: '15 km' },
      { day: 6, title: 'Ella to Mirissa', morning: 'Tea estate breakfast.', afternoon: 'Arrive Mirissa. Beach villa check-in.', evening: 'Seafood barbecue on private beach.', hotel: 'Mirissa Hills', meals: ['Breakfast', 'Dinner'], distance: '230 km' },
      { day: 7, title: 'Mirissa — Ocean Romance', morning: 'Private whale watching boat charter.', afternoon: 'Couples beach relaxation.', evening: 'Sunset cocktails at Coconut Tree Hill.', hotel: 'Mirissa Hills', meals: ['Breakfast', 'Dinner'], distance: '10 km' },
      { day: 8, title: 'Mirissa to Galle', morning: 'Sunrise yoga on the beach.', afternoon: 'Drive to Galle. Cape Weligama check-in.', evening: 'Cliffside dinner with ocean views.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Dinner'], distance: '40 km' },
      { day: 9, title: 'Galle — Fort & Farewell', morning: 'Private Galle Fort heritage walk.', afternoon: 'Spa treatment. Shopping.', evening: 'Farewell sunset dinner at the fort.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Dinner'], distance: '15 km' },
      { day: 10, title: 'Departure', morning: 'VIP transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-h1', name: 'Hot Air Balloon Sunrise over Sigiriya', pricePerPerson: 320, included: false },
      { id: 'ao-h2', name: 'Private Chef for One Evening', pricePerPerson: 180, included: false },
      { id: 'ao-h3', name: 'Professional Couple Photography Session', pricePerPerson: 150, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-7',
    name: 'Tea Country & Wildlife Safari',
    shortDescription: 'Discover Sri Lanka\'s legendary tea highlands and thrilling wildlife encounters in Yala National Park.',
    days: 7,
    nights: 6,
    type: 'premium',
    price: 949,
    originalPrice: 1149,
    rating: 4.7,
    reviewCount: 108,
    destinations: ['Colombo', 'Nuwara Eliya', 'Ella', 'Yala'],
    highlights: ['✓ Yala Leopard Safari', '✓ Tea Factory Tours', '✓ Scenic Train Ride', '✓ 4-Star Hotels'],
    inclusions: ['6 nights hotel accommodation', 'All transfers', 'English guide', 'Yala safari jeep & fees', 'Scenic train tickets', 'Tea factory entry', 'Daily breakfast'],
    exclusions: ['International flights', 'Travel insurance', 'Most meals', 'Personal expenses'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-purple-500 to-violet-700',
    badge: 'NEW',
    itinerary: [
      { day: 1, title: 'Colombo to Nuwara Eliya', morning: 'Airport pickup. Scenic highland drive.', afternoon: 'Pedro Tea Estate factory tour.', evening: 'High tea at Grand Hotel. Overnight NE.', hotel: 'St. Andrews Hotel', meals: ['Breakfast'], distance: '180 km' },
      { day: 2, title: 'Nuwara Eliya Tea Country', morning: 'Horton Plains National Park hike (World\'s End).', afternoon: 'Gregory Lake. Hakgala Botanical Gardens.', evening: 'Colonial dinner at hotel. Overnight NE.', hotel: 'St. Andrews Hotel', meals: ['Breakfast'], distance: '40 km' },
      { day: 3, title: 'Scenic Train to Ella', morning: 'Board Nuwara Eliya to Ella scenic train.', afternoon: 'Arrive Ella. Nine Arch Bridge visit.', evening: 'Village exploration.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '50 km' },
      { day: 4, title: 'Ella Outdoor Day', morning: 'Ella Rock hike.', afternoon: 'Ravana Falls. Zipline.', evening: 'Drive towards Yala. Overnight.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '40 km' },
      { day: 5, title: 'Yala National Park Safari', morning: 'Early morning safari (leopard territory).', afternoon: 'Noon rest. Afternoon safari.', evening: 'Bush camp fire. Overnight near Yala.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '80 km' },
      { day: 6, title: 'Yala Morning & South Coast', morning: 'Dawn safari. Drive to Mirissa.', afternoon: 'Beach afternoon. Seafood lunch.', evening: 'Overnight near Galle.', hotel: 'Jetwing Lighthouse', meals: ['Breakfast'], distance: '150 km' },
      { day: 7, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-tcs1', name: 'Additional Yala Safari (full day)', pricePerPerson: 75, included: false },
      { id: 'ao-tcs2', name: 'Whale Watching Mirissa', pricePerPerson: 45, included: false },
      { id: 'ao-tcs3', name: 'Zipline Adventure Ella', pricePerPerson: 30, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-8',
    name: 'East Coast Escape',
    shortDescription: 'Explore Sri Lanka\'s lesser-visited east coast with pristine beaches and the majestic Koneswaram Temple.',
    days: 6,
    nights: 5,
    type: 'standard',
    price: 699,
    originalPrice: 849,
    rating: 4.5,
    reviewCount: 62,
    destinations: ['Colombo', 'Sigiriya', 'Trincomalee'],
    highlights: ['✓ Pigeon Island Snorkeling', '✓ East Coast Beaches', '✓ Cultural Triangle Stop', '✓ 4-Star Hotels'],
    inclusions: ['5 nights hotel accommodation', 'All transfers', 'Pigeon Island snorkeling tour', 'Sigiriya entrance fee', 'Daily breakfast'],
    exclusions: ['International flights', 'Travel insurance', 'Most meals', 'Diving equipment (rental available)'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-orange-500 to-red-700',
    badge: 'NEW',
    itinerary: [
      { day: 1, title: 'Colombo to Sigiriya', morning: 'Airport pickup. Drive to Sigiriya.', afternoon: 'Arrive and rest.', evening: 'Village dinner. Overnight Sigiriya.', hotel: 'Sigiriya Village Inn', meals: [], distance: '170 km' },
      { day: 2, title: 'Sigiriya Rock & Minneriya', morning: 'Sigiriya sunrise climb.', afternoon: 'Minneriya elephant safari.', evening: 'Rest & overnight.', hotel: 'Sigiriya Village Inn', meals: ['Breakfast'], distance: '30 km' },
      { day: 3, title: 'Sigiriya to Trincomalee', morning: 'Drive to Trincomalee.', afternoon: 'Koneswaram Temple. Nilaveli Beach.', evening: 'Overnight Trincomalee.', hotel: 'Welcombe Hotel Trinco', meals: ['Breakfast'], distance: '110 km' },
      { day: 4, title: 'Pigeon Island Snorkeling', morning: 'Pigeon Island National Park snorkeling.', afternoon: 'Uppuveli beach relaxation.', evening: 'Seafood dinner.', hotel: 'Welcombe Hotel Trinco', meals: ['Breakfast'], distance: '15 km' },
      { day: 5, title: 'Trincomalee Exploration', morning: 'Fort Frederick. Marble Beach (boat).', afternoon: 'Turtle watching (seasonal).', evening: 'Farewell dinner.', hotel: 'Welcombe Hotel Trinco', meals: ['Breakfast', 'Dinner'], distance: '20 km' },
      { day: 6, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '257 km' },
    ],
    addOns: [
      { id: 'ao-ec1', name: 'Scuba Diving at Pigeon Island', pricePerPerson: 65, included: false },
      { id: 'ao-ec2', name: 'Whale Watching (seasonal)', pricePerPerson: 45, included: false },
    ],
    featured: false,
  },
  {
    id: 'pkg-9',
    name: 'Short Break Sri Lanka (3-Day)',
    shortDescription: 'A perfectly curated 3-day highlight reel of Sri Lanka for time-constrained travelers.',
    days: 3,
    nights: 2,
    type: 'budget',
    price: 299,
    originalPrice: 369,
    rating: 4.4,
    reviewCount: 155,
    destinations: ['Colombo', 'Kandy', 'Sigiriya'],
    highlights: ['✓ Airport Transfers', '✓ 3-Star Hotels', '✓ Sigiriya Included', '✓ Best-Value Short Tour'],
    inclusions: ['2 nights hotel', 'All transfers', 'Driver-guide', 'Sigiriya entrance', 'Daily breakfast'],
    exclusions: ['International flights', 'Most meals', 'Personal expenses'],
    vehicle: 'Toyota Corolla',
    hotelRating: 3,
    gradient: 'from-teal-400 to-cyan-600',
    badge: 'HOT DEAL',
    itinerary: [
      { day: 1, title: 'Colombo & Kandy', morning: 'Airport pickup. Drive towards Kandy.', afternoon: 'Pinnawala Elephant Orphanage. Kandy arrival.', evening: 'Temple of the Tooth. Overnight Kandy.', hotel: 'Temple View Guesthouse', meals: [], distance: '120 km' },
      { day: 2, title: 'Sigiriya Rock Fortress', morning: 'Drive to Sigiriya.', afternoon: 'Sigiriya Rock climb. Dambulla Cave Temple.', evening: 'Drive back to Colombo. Overnight.', hotel: 'Colombo City Guesthouse', meals: ['Breakfast'], distance: '230 km' },
      { day: 3, title: 'Departure', morning: 'Airport transfer.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '35 km' },
    ],
    addOns: [
      { id: 'ao-sb1', name: 'Minneriya Safari', pricePerPerson: 45, included: false },
    ],
    featured: false,
  },
  {
    id: 'pkg-10',
    name: 'Southern Coast Surf & Chill',
    shortDescription: 'Sun, surf, and serenity along Sri Lanka\'s stunning southern coastline from Galle to Trincomalee.',
    days: 8,
    nights: 7,
    type: 'standard',
    price: 849,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 89,
    destinations: ['Colombo', 'Galle', 'Mirissa', 'Trincomalee'],
    highlights: ['✓ Surf Lessons Included', '✓ Whale Watching', '✓ 4-Star Beach Hotels', '✓ East & South Coast'],
    inclusions: ['7 nights beach hotel', 'All transfers', 'Surf lessons (2 sessions)', 'Whale watching excursion', 'Daily breakfast'],
    exclusions: ['International flights', 'Travel insurance', 'Most meals', 'Surfboard rental after 2 lessons'],
    vehicle: 'Toyota KDH Van',
    hotelRating: 4,
    gradient: 'from-cyan-500 to-teal-700',
    badge: 'NEW',
    itinerary: [
      { day: 1, title: 'Colombo to Galle', morning: 'Airport pickup. Scenic coastal drive.', afternoon: 'Galle Fort arrival and walk.', evening: 'Sunset drinks on ramparts.', hotel: 'Jetwing Lighthouse', meals: [], distance: '119 km' },
      { day: 2, title: 'Galle Deep Dive', morning: 'Private Galle Fort tour.', afternoon: 'Unawatuna beach. Snorkeling.', evening: 'Overnight Galle.', hotel: 'Jetwing Lighthouse', meals: ['Breakfast'], distance: '10 km' },
      { day: 3, title: 'Galle to Mirissa — Surf Begins', morning: 'Drive to Mirissa.', afternoon: 'First surf lesson on Mirissa Beach.', evening: 'Beach bonfire.', hotel: 'Paradise Beach Club', meals: ['Breakfast'], distance: '35 km' },
      { day: 4, title: 'Mirissa Whale Watching', morning: 'Whale watching cruise.', afternoon: 'Second surf lesson.', evening: 'Seafood at Coconut Tree Hill.', hotel: 'Paradise Beach Club', meals: ['Breakfast'], distance: '10 km' },
      { day: 5, title: 'Mirissa Free Day', morning: 'Sunrise yoga.', afternoon: 'Parrot Rock snorkeling.', evening: 'Village dinner.', hotel: 'Paradise Beach Club', meals: ['Breakfast'], distance: '5 km' },
      { day: 6, title: 'Drive North to Trincomalee', morning: 'Scenic drive north.', afternoon: 'Arrive Trincomalee. Koneswaram Temple.', evening: 'Nilaveli Beach evening.', hotel: 'Welcombe Hotel Trinco', meals: ['Breakfast'], distance: '280 km' },
      { day: 7, title: 'Trincomalee Exploration', morning: 'Pigeon Island snorkeling.', afternoon: 'Uppuveli beach relaxation.', evening: 'Farewell seafood feast.', hotel: 'Welcombe Hotel Trinco', meals: ['Breakfast', 'Dinner'], distance: '15 km' },
      { day: 8, title: 'Departure', morning: 'Transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '257 km' },
    ],
    addOns: [
      { id: 'ao-sc1', name: 'Scuba Diving Certification Course', pricePerPerson: 120, included: false },
      { id: 'ao-sc2', name: 'Deep Sea Fishing', pricePerPerson: 55, included: false },
    ],
    featured: false,
  },
  {
    id: 'pkg-11',
    name: 'Family Fun Sri Lanka',
    shortDescription: 'Kid-friendly adventure through elephants, trains, beaches, and cultural treasures the whole family will love.',
    days: 9,
    nights: 8,
    type: 'premium',
    price: 1249,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 96,
    destinations: ['Colombo', 'Kandy', 'Sigiriya', 'Ella', 'Mirissa'],
    highlights: ['✓ Family-Sized Vehicle', '✓ Kid-Friendly Hotels', '✓ Elephant Experiences', '✓ Beach & Wildlife'],
    inclusions: ['8 nights family-friendly accommodation', 'Toyota HiAce family vehicle', 'Child seats provided', 'Family guide', 'Daily breakfast', 'Elephant orphanage visit', 'Whale watching'],
    exclusions: ['International flights', 'Travel insurance', 'Most meals', 'Personal expenses'],
    vehicle: 'Toyota HiAce',
    hotelRating: 4,
    gradient: 'from-yellow-500 to-orange-600',
    badge: 'BESTSELLER',
    itinerary: [
      { day: 1, title: 'Family Arrival & Colombo', morning: 'Family airport pickup. Colombo hotel.', afternoon: 'Gangaramaya Temple. National Museum (kids love!).', evening: 'Galle Face Green kite flying!', hotel: 'Cinnamon Red Colombo', meals: [], distance: '35 km' },
      { day: 2, title: 'Pinnawala Elephant Orphanage', morning: 'Drive to Pinnawala.', afternoon: 'Elephant bathing time! Elephant feeding!', evening: 'Kandy arrival. Temple visit.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '120 km' },
      { day: 3, title: 'Kandy Discovery', morning: 'Peradeniya Botanical Gardens.', afternoon: 'Temple of Tooth. Gem Museum.', evening: 'Kandyan dance & fire show.', hotel: 'Mahaweli Reach Hotel', meals: ['Breakfast'], distance: '20 km' },
      { day: 4, title: 'Sigiriya — Climb the Lion Rock!', morning: 'Drive to Sigiriya.', afternoon: 'Sigiriya Rock Fortress family climb.', evening: 'Village dinner experience.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '95 km' },
      { day: 5, title: 'Minneriya Elephant Safari!', morning: 'Minneriya National Park jeep safari.', afternoon: 'Village bicycle fun.', evening: 'Overnight Sigiriya.', hotel: 'Sigiriya Safari Hotel', meals: ['Breakfast'], distance: '30 km' },
      { day: 6, title: 'Scenic Train to Ella', morning: 'Scenic train through tea country.', afternoon: 'Arrive Ella. Nine Arch Bridge.', evening: 'Ella village exploration.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '180 km' },
      { day: 7, title: 'Ella Fun Day', morning: 'Ravana Falls waterfall swim!', afternoon: 'Tea factory (kids love the machinery!).', evening: 'Little Adam\'s Peak easy walk.', hotel: 'Ella Flower Garden Resort', meals: ['Breakfast'], distance: '25 km' },
      { day: 8, title: 'Mirissa Beach & Whales!', morning: 'Drive to Mirissa.', afternoon: 'Beach arrival. Sandcastles!', evening: 'Seafood on the beach.', hotel: 'Paradise Beach Club', meals: ['Breakfast', 'Dinner'], distance: '220 km' },
      { day: 9, title: 'Whale Watching & Departure', morning: 'WHALE WATCHING (kids will never forget!)!', afternoon: 'Transfer to Colombo airport.', evening: '', hotel: '', meals: ['Breakfast'], distance: '150 km' },
    ],
    addOns: [
      { id: 'ao-ff1', name: 'Kids Elephant Ride Experience', pricePerPerson: 25, included: false },
      { id: 'ao-ff2', name: 'ATV Ride Sigiriya', pricePerPerson: 35, included: false },
      { id: 'ao-ff3', name: 'Snorkeling Mirissa (family)', pricePerPerson: 20, included: false },
    ],
    featured: true,
  },
  {
    id: 'pkg-12',
    name: 'Wellness & Ayurveda Retreat',
    shortDescription: 'A restorative journey combining ancient Ayurvedic healing traditions with Sri Lanka\'s natural beauty.',
    days: 11,
    nights: 10,
    type: 'luxury',
    price: 2799,
    originalPrice: 3299,
    rating: 4.9,
    reviewCount: 54,
    destinations: ['Colombo', 'Kandy', 'Nuwara Eliya', 'Galle'],
    highlights: ['✓ Ayurvedic Consultations', '✓ Daily Yoga & Meditation', '✓ Healthy Organic Cuisine', '✓ 5-Star Wellness Resorts'],
    inclusions: ['10 nights wellness resort accommodation', 'Daily Ayurvedic treatment', 'Morning yoga & meditation', 'Organic all-inclusive meals', 'Private driver & guide', 'Doctor consultation', 'Herbal treatments'],
    exclusions: ['International flights', 'Travel insurance', 'Personal items'],
    vehicle: 'Mercedes V-Class',
    hotelRating: 5,
    gradient: 'from-emerald-600 to-teal-800',
    badge: 'LIMITED',
    spotsLeft: 4,
    itinerary: [
      { day: 1, title: 'Wellness Arrival', morning: 'Airport pickup. Colombo Ayurvedic center.', afternoon: 'Initial doctor consultation. Diagnosis.', evening: 'Welcome herbal dinner. Overnight Colombo.', hotel: 'Shangri-La Colombo', meals: ['Dinner'], distance: '35 km' },
      { day: 2, title: 'Colombo Wellness Day 1', morning: 'Abhyanga (oil massage). Yoga session.', afternoon: 'Meditation. Herbal bath.', evening: 'Organic dinner. Early sleep.', hotel: 'Shangri-La Colombo', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '5 km' },
      { day: 3, title: 'Colombo — Inner Journey', morning: 'Shirodhara (forehead oil treatment). Yoga.', afternoon: 'Meditation walk. Organic garden visit.', evening: 'Healing ceremony. Sound bath.', hotel: 'Shangri-La Colombo', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '10 km' },
      { day: 4, title: 'Drive to Kandy — Nature Immersion', morning: 'Morning yoga. Herbal breakfast.', afternoon: 'Drive to Kandy. Botanical Gardens.', evening: 'Kandy lake meditation walk.', hotel: 'Kandy House', meals: ['Breakfast', 'Dinner'], distance: '120 km' },
      { day: 5, title: 'Kandy Treatments', morning: 'Forest bathing in Udawatta Kele.', afternoon: 'Couples Ayurvedic treatment.', evening: 'Temple meditation.', hotel: 'Kandy House', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '15 km' },
      { day: 6, title: 'Nuwara Eliya — Highland Healing', morning: 'Drive to Nuwara Eliya through tea estates.', afternoon: 'Tea estate meditation walk.', evening: 'Fireplace herbal tea session.', hotel: 'Grand Hotel Nuwara Eliya', meals: ['Breakfast', 'Dinner'], distance: '75 km' },
      { day: 7, title: 'Nuwara Eliya Treatments', morning: 'Horton Plains sunrise yoga.', afternoon: 'Panchkarma treatment day.', evening: 'Herbal steam bath.', hotel: 'Grand Hotel Nuwara Eliya', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '30 km' },
      { day: 8, title: 'Drive to Galle — Coastal Serenity', morning: 'Morning yoga at dawn.', afternoon: 'Scenic drive to Galle.', evening: 'Ocean sunset meditation.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Dinner'], distance: '200 km' },
      { day: 9, title: 'Galle Wellness Day', morning: 'Ocean yoga at sunrise.', afternoon: 'Body scrub & ocean hydrotherapy.', evening: 'Fort walk. Healthy dinner.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Lunch', 'Dinner'], distance: '20 km' },
      { day: 10, title: 'Galle — Integration Day', morning: 'Final Ayurvedic treatment. Closing consultation.', afternoon: 'Free time. Galle shopping.', evening: 'Farewell ceremony & dinner.', hotel: 'Cape Weligama', meals: ['Breakfast', 'Dinner'], distance: '10 km' },
      { day: 11, title: 'Departure', morning: 'VIP transfer to Colombo airport.', afternoon: '', evening: '', hotel: '', meals: ['Breakfast'], distance: '120 km' },
    ],
    addOns: [
      { id: 'ao-wa1', name: 'Additional Ayurvedic Massage (per session)', pricePerPerson: 80, included: false },
      { id: 'ao-wa2', name: 'Private Yoga Instructor (per day)', pricePerPerson: 60, included: false },
      { id: 'ao-wa3', name: 'Silent Retreat Extension (2 nights)', pricePerPerson: 280, included: false },
    ],
    featured: false,
  },
];

export function getHighlightedPackage(): TourPackage | undefined {
  return packages.find(p => p.highlighted);
}
