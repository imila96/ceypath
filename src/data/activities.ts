export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';

export interface Activity {
  id: string;
  destination: string;
  name: string;
  duration: string;
  pricePerPerson: number;
  difficulty: Difficulty;
  included: boolean;
  description: string;
  icon: string;
  /** Optional photo (path, URL, or data URL); shown in customize when set */
  image?: string;
}

export const activities: Activity[] = [
  // Colombo
  {
    id: 'act-col-1',
    destination: 'colombo',
    name: 'Colombo City Heritage Walk',
    duration: '3 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Guided walking tour through Pettah Bazaar, Dutch Hospital, and colonial landmarks.',
    icon: '🚶',
  },
  {
    id: 'act-col-2',
    destination: 'colombo',
    name: 'Colombo Food Tour',
    duration: '4 hours',
    pricePerPerson: 35,
    difficulty: 'Easy',
    included: false,
    description: 'Taste your way through authentic Sri Lankan street food, curries, and desserts.',
    icon: '🍛',
  },

  // Kandy
  {
    id: 'act-kan-1',
    destination: 'kandy',
    name: 'Kandyan Cultural Dance Show',
    duration: '1.5 hours',
    pricePerPerson: 15,
    difficulty: 'Easy',
    included: false,
    description: 'Traditional Kandyan dance, fire-walking, and drumming performed by local artists.',
    icon: '💃',
  },
  {
    id: 'act-kan-2',
    destination: 'kandy',
    name: 'Peradeniya Botanical Gardens Tour',
    duration: '2 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Guided tour of Asia\'s finest botanical gardens with 4,000 species of plants.',
    icon: '🌿',
  },

  // Sigiriya
  {
    id: 'act-sig-1',
    destination: 'sigiriya',
    name: 'Sigiriya Rock Fortress Guided Climb',
    duration: '3 hours',
    pricePerPerson: 0,
    difficulty: 'Moderate',
    included: true,
    description: 'Guided ascent of the UNESCO-listed 5th century lion rock fortress with expert commentary.',
    icon: '🏔️',
  },
  {
    id: 'act-sig-2',
    destination: 'sigiriya',
    name: 'Minneriya Elephant Safari',
    duration: '4 hours',
    pricePerPerson: 65,
    difficulty: 'Easy',
    included: false,
    description: 'Jeep safari to witness "The Gathering" — the largest elephant congregation in Asia.',
    icon: '🐘',
  },
  {
    id: 'act-sig-3',
    destination: 'sigiriya',
    name: 'Village Cycle Tour',
    duration: '3 hours',
    pricePerPerson: 25,
    difficulty: 'Easy',
    included: false,
    description: 'Cycle through paddy fields and traditional villages around Sigiriya.',
    icon: '🚴',
  },

  // Galle
  {
    id: 'act-gal-1',
    destination: 'galle',
    name: 'Galle Fort Walking Tour',
    duration: '2 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Guided walk through the UNESCO-listed Dutch fort exploring ramparts and colonial streets.',
    icon: '🏰',
  },
  {
    id: 'act-gal-2',
    destination: 'galle',
    name: 'Cooking Class in Galle',
    duration: '3 hours',
    pricePerPerson: 35,
    difficulty: 'Easy',
    included: false,
    description: 'Learn to cook authentic Sri Lankan curries, sambols, and desserts with a local chef.',
    icon: '👨‍🍳',
  },
  {
    id: 'act-gal-3',
    destination: 'galle',
    name: 'Whale Watching in Mirissa',
    duration: '5 hours',
    pricePerPerson: 45,
    difficulty: 'Easy',
    included: false,
    description: 'Morning boat excursion to spot blue whales, sperm whales, and spinner dolphins.',
    icon: '🐋',
  },

  // Ella
  {
    id: 'act-ell-1',
    destination: 'ella',
    name: 'Nine Arch Bridge & Tea Walk',
    duration: '2 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Guided walk to the iconic Nine Arch Bridge through tea plantations.',
    icon: '🌉',
  },
  {
    id: 'act-ell-2',
    destination: 'ella',
    name: 'Little Adam\'s Peak Sunrise Hike',
    duration: '2.5 hours',
    pricePerPerson: 20,
    difficulty: 'Moderate',
    included: false,
    description: 'Early morning hike to catch the sunrise over the Ella valley.',
    icon: '🌄',
  },
  {
    id: 'act-ell-3',
    destination: 'ella',
    name: 'White Water Rafting in Kitulgala',
    duration: '4 hours',
    pricePerPerson: 55,
    difficulty: 'Challenging',
    included: false,
    description: 'Thrilling white-water rafting on the Kelani River through rainforest gorges.',
    icon: '🚣',
  },
  {
    id: 'act-ell-4',
    destination: 'ella',
    name: 'Tea Factory Visit',
    duration: '2 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Tour of a working tea factory to learn about the entire Ceylon Tea production process.',
    icon: '🍃',
  },

  // Mirissa
  {
    id: 'act-mir-1',
    destination: 'mirissa',
    name: 'Whale & Dolphin Watching',
    duration: '5 hours',
    pricePerPerson: 45,
    difficulty: 'Easy',
    included: false,
    description: 'Premier whale watching experience — best from November to April.',
    icon: '🐬',
  },
  {
    id: 'act-mir-2',
    destination: 'mirissa',
    name: 'Snorkeling at Coral Reef',
    duration: '2 hours',
    pricePerPerson: 25,
    difficulty: 'Easy',
    included: false,
    description: 'Explore colorful coral gardens teeming with tropical fish.',
    icon: '🤿',
  },

  // Nuwara Eliya
  {
    id: 'act-nuw-1',
    destination: 'nuwara-eliya',
    name: 'Tea Plantation Trekking',
    duration: '3 hours',
    pricePerPerson: 0,
    difficulty: 'Easy',
    included: true,
    description: 'Scenic walk through pristine tea estates with tea tasting at a colonial bungalow.',
    icon: '🌱',
  },
  {
    id: 'act-nuw-2',
    destination: 'nuwara-eliya',
    name: 'Horton Plains & World\'s End Hike',
    duration: '5 hours',
    pricePerPerson: 30,
    difficulty: 'Moderate',
    included: false,
    description: 'Hike across the misty plateau to the dramatic 880-meter World\'s End precipice.',
    icon: '🥾',
  },

  // Trincomalee
  {
    id: 'act-tri-1',
    destination: 'trincomalee',
    name: 'Pigeon Island Snorkeling',
    duration: '4 hours',
    pricePerPerson: 35,
    difficulty: 'Easy',
    included: false,
    description: 'Boat trip to Pigeon Island National Park with pristine coral reefs.',
    icon: '🏝️',
  },
  {
    id: 'act-tri-2',
    destination: 'trincomalee',
    name: 'Yala National Park Safari',
    duration: '6 hours',
    pricePerPerson: 65,
    difficulty: 'Easy',
    included: false,
    description: 'Full-day jeep safari in Yala National Park — Sri Lanka\'s leopard capital.',
    icon: '🐆',
  },
];
