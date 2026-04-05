import type { Hotel, HotelFaq, HotelRoomType, HotelSurroundingsGroup } from '../data/hotels';

/** Short line for listing cards when `tagline` is empty. */
export function placeholderTaglineCard(hotel: Hotel): string {
  return `${destLabel(hotel.destination)} · ${hotel.tier} · guide rate`;
}

function destLabel(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Public copy when admin has not set a tagline yet. */
export function placeholderTagline(hotel: Hotel): string {
  const area = destLabel(hotel.destination);
  return `${hotel.tier === 'luxury' ? 'Premium' : hotel.tier === 'budget' ? 'Great-value' : 'Comfortable'} stay in ${area} · amenities include ${hotel.features.slice(0, 3).join(', ')}`;
}

export function placeholderDescription(hotel: Hotel): string {
  const area = destLabel(hotel.destination);
  const feat = hotel.features.length ? hotel.features.join(', ') : 'standard comforts';
  return (
    `${hotel.name} is a ${hotel.tier}-tier pick in ${area}, suited for travellers who want a reliable base while exploring the region.\n\n` +
    `Typical services include ${feat}. Exact room layout and services can vary — add your full property story in Admin to replace this sample text.\n\n` +
    `Rates shown are guide prices in USD per night; seasonal changes and taxes may apply.`
  );
}

export function placeholderHighlights(hotel: Hotel): string[] {
  return [
    `Handpicked ${hotel.tier} option in ${destLabel(hotel.destination)}`,
    `From ${hotel.pricePerNight} USD/night (guide rate in catalog)`,
    ...hotel.features.slice(0, 4).map(f => `${f}`),
  ];
}

export function placeholderAddress(hotel: Hotel): string {
  return `Located in ${destLabel(hotel.destination)} — add the full street address in Admin for maps and transfers.`;
}

export function placeholderCheckIn(): string {
  return 'From 14:00 (typical — confirm with property)';
}

export function placeholderCheckOut(): string {
  return 'Until 12:00 (typical — confirm with property)';
}

export function placeholderGuestQuote(hotel: Hotel): { quote: string; attribution: string } {
  return {
    quote: `Travellers booking through LankaTrips often choose ${hotel.name} for its balance of comfort and value in ${destLabel(hotel.destination)}.`,
    attribution: 'Sample summary (replace with real guest quotes in Admin)',
  };
}

export function placeholderRoomTypes(hotel: Hotel): HotelRoomType[] {
  return [
    {
      name: 'Standard / deluxe rooms',
      beds: 'Varies by room — request bed configuration when booking',
      maxGuests: 2,
    },
  ];
}

export function placeholderSurroundings(hotel: Hotel): HotelSurroundingsGroup[] {
  const area = destLabel(hotel.destination);
  return [
    {
      category: 'Area',
      places: [
        { name: `${area} town centre`, distance: 'See map / ask locally' },
        { name: 'Local dining & transport', distance: 'Nearby' },
      ],
    },
  ];
}

export function placeholderRestaurants(hotel: Hotel): { name: string; cuisine?: string; openFor?: string; ambiance?: string }[] {
  return [
    {
      name: 'On-site or nearby dining',
      cuisine: 'Local & international',
      openFor: 'Varies by property',
      ambiance: 'Add restaurant names in Admin when confirmed.',
    },
  ];
}

export function placeholderFaqs(hotel: Hotel): HotelFaq[] {
  const area = destLabel(hotel.destination);
  return [
    {
      question: 'Is breakfast included?',
      answer: 'Depends on your package and season. Your consultant will confirm. Add your hotel’s real policy in Admin.',
    },
    {
      question: 'How do I get there from the airport?',
      answer: `Private transfers can be arranged for stays in ${area}. Add exact directions or shuttle notes in Admin.`,
    },
    {
      question: 'Can I change or cancel later?',
      answer: 'Policies vary by rate. Your booking confirmation will state the rules — replace this text with your property policy in Admin.',
    },
  ];
}

export function placeholderSustainability(): string {
  return 'We encourage low-impact travel where possible. Add a real sustainability statement for this property in Admin when available.';
}

/** True when the long description is still sample copy (admin should replace). */
export function hotelUsesDescriptionPlaceholder(hotel: Hotel): boolean {
  return !hotel.description?.trim();
}
