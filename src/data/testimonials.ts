export interface Testimonial {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  rating: number;
  packageName: string;
  date: string;
  text: string;
  initials: string;
  avatarGradient: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Mitchell',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    rating: 5,
    packageName: 'Classic Sri Lanka Explorer',
    date: 'February 2025',
    text: 'Absolutely the best holiday of our lives! LankaTrips arranged everything flawlessly — from the moment we landed at Colombo airport to our final beach day in Mirissa. The driver-guide Chamara was incredibly knowledgeable and the hotels were even better than expected. The sigiriya sunrise was breathtaking. 10/10 would absolutely recommend!',
    initials: 'SM',
    avatarGradient: 'from-pink-400 to-rose-600',
  },
  {
    id: 't2',
    name: 'Klaus Weber',
    country: 'Germany',
    countryFlag: '🇩🇪',
    rating: 5,
    packageName: 'Luxury Sri Lanka Grand Tour',
    date: 'January 2025',
    text: 'Wir haben den Luxus-Rundreise gebucht und waren begeistert! The team responded to every question in English perfectly. The Water Garden Sigiriya was phenomenal. The Mercedes transfer from the airport was a premium touch. The live price calculator on the website made budgeting so transparent — I knew exactly what I was paying for.',
    initials: 'KW',
    avatarGradient: 'from-blue-400 to-indigo-600',
  },
  {
    id: 't3',
    name: 'Priya Nair',
    country: 'India',
    countryFlag: '🇮🇳',
    rating: 5,
    packageName: 'Cultural Triangle Adventure',
    date: 'December 2024',
    text: 'Traveled with my family of 6 from Chennai. LankaTrips arranged a spacious Toyota HiAce with child car seats on request — so thoughtful! The customizer tool let us add a cooking class in Galle which the kids loved. Nuwara Eliya was a revelation — the cool weather, the tea estates. We\'re already planning our second trip!',
    initials: 'PN',
    avatarGradient: 'from-orange-400 to-amber-600',
  },
  {
    id: 't4',
    name: 'James & Lisa Cooper',
    country: 'Australia',
    countryFlag: '🇦🇺',
    rating: 5,
    packageName: 'Honeymoon Sri Lanka Special',
    date: 'March 2025',
    text: 'Our honeymoon exceeded every expectation. The 98 Acres Resort in Ella with a valley-facing infinity pool at sunset... I\'m getting emotional just writing this. The whale watching in Mirissa was mind-blowing — we saw 3 blue whales from about 50 meters! The 24/7 support was real — our guide answered a message at midnight.',
    initials: 'JL',
    avatarGradient: 'from-red-400 to-pink-600',
  },
  {
    id: 't5',
    name: 'Thomas Dubois',
    country: 'France',
    countryFlag: '🇫🇷',
    rating: 4,
    packageName: 'Beach & Culture Combo',
    date: 'November 2024',
    text: 'Très bien organisé! The Beach & Culture package gave us the perfect balance of history and relaxation. Galle Fort was magnificent, and Mirissa was paradise. My only minor note — the budget hotel in Colombo was a bit dated, but when I mentioned it to LankaTrips support, they offered an immediate upgrade at a small cost. Excellent service!',
    initials: 'TD',
    avatarGradient: 'from-indigo-400 to-blue-600',
  },
  {
    id: 't6',
    name: 'Yuki Tanaka',
    country: 'Japan',
    countryFlag: '🇯🇵',
    rating: 5,
    packageName: 'Tea Country & Wildlife Safari',
    date: 'October 2024',
    text: 'The train journey through the tea country from Nuwara Eliya to Ella was like a moving dream — green hills, waterfalls, tea pickers. The Yala safari delivered a leopard sighting within the first 20 minutes! LankaTrips\' custom package builder was intuitive, and the price was transparent with no hidden surprises. Beautiful country, beautiful service.',
    initials: 'YT',
    avatarGradient: 'from-teal-400 to-emerald-600',
  },
];
