import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Star, ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Quote } from 'lucide-react';
import { useCatalogStore } from '../catalog/catalogStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import {
  hotelUsesDescriptionPlaceholder,
  placeholderCheckIn,
  placeholderCheckOut,
  placeholderDescription,
  placeholderFaqs,
  placeholderGuestQuote,
  placeholderHighlights,
  placeholderRestaurants,
  placeholderRoomTypes,
  placeholderSurroundings,
  placeholderSustainability,
  placeholderTagline,
  placeholderAddress,
} from '../utils/hotelPlaceholders';

const TIER_LABEL: Record<string, string> = {
  budget: 'Budget',
  standard: 'Standard',
  luxury: 'Luxury',
};

export default function HotelPage() {
  const { id } = useParams<{ id: string }>();
  const { currency } = useCurrency();
  const hotels = useCatalogStore(s => s.hotels);
  const hotel = id ? hotels.find(h => h.id === id) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!id || !hotel) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-5xl mb-4">🏨</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Hotel not found</h1>
          <p className="text-gray-600 text-sm mb-6">It may have been removed or the link is outdated.</p>
          <Link to="/hotels" className="inline-flex items-center gap-2 text-[#003580] font-semibold hover:underline">
            <ArrowLeft size={16} /> Back to hotels
          </Link>
        </div>
      </div>
    );
  }

  const destSlug = hotel.destination;
  const destLabel = destSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const hasRealDescription = !!hotel.description?.trim();
  const tagline = hotel.tagline?.trim() || placeholderTagline(hotel);
  const descriptionSource = hasRealDescription ? hotel.description! : placeholderDescription(hotel);
  const descriptionParagraphs = descriptionSource
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
  const highlights = hotel.highlights?.length ? hotel.highlights : placeholderHighlights(hotel);
  const address = hotel.address?.trim() || placeholderAddress(hotel);
  const checkIn = hotel.checkIn?.trim() || placeholderCheckIn();
  const checkOut = hotel.checkOut?.trim() || placeholderCheckOut();
  const roomTypes = hotel.roomTypes?.length ? hotel.roomTypes : placeholderRoomTypes(hotel);
  const restaurants = hotel.restaurants?.length ? hotel.restaurants : placeholderRestaurants(hotel);
  const surroundings = hotel.surroundings?.length ? hotel.surroundings : placeholderSurroundings(hotel);
  const faqs = hotel.faqs?.length ? hotel.faqs : placeholderFaqs(hotel);
  const sustainabilityNote = hotel.sustainabilityNote?.trim() || placeholderSustainability();
  const guestQuoteResolved = hotel.guestQuote?.trim()
    ? { quote: hotel.guestQuote, attribution: hotel.guestQuoteAttribution }
    : placeholderGuestQuote(hotel);

  const showSampleBanner = hotelUsesDescriptionPlaceholder(hotel);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Breadcrumb
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Hotels', to: '/hotels' },
            { label: hotel.name },
          ]}
        />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {showSampleBanner && (
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 text-amber-950 text-sm">
              <strong>Sample details</strong> — this property has no full write-up yet. Text below is generated for layout;
              replace everything with real information in <strong>Admin → Hotels</strong>.
            </div>
          )}

          <div
            className={`relative h-52 sm:h-64 bg-gradient-to-br ${hotel.gradient} ${hotel.image ? '' : 'flex items-center justify-center text-6xl'}`}
          >
            {hotel.image ? (
              <img src={hotel.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span aria-hidden>🏨</span>
            )}
          </div>

          {hotel.galleryImages && hotel.galleryImages.length > 0 && (
            <div className="px-3 pt-3 flex gap-2 overflow-x-auto pb-1">
              {hotel.galleryImages.map((g, gi) => (
                <figure key={gi} className="shrink-0 w-28">
                  {g.src && (
                    <img src={g.src} alt={g.label ?? ''} className="w-full h-20 object-cover rounded-lg border border-gray-100" />
                  )}
                  {g.label && <figcaption className="text-[10px] text-gray-500 mt-1 truncate">{g.label}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#003580] mb-1">
                {TIER_LABEL[hotel.tier] ?? hotel.tier} · {hotel.rating}★
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{hotel.name}</h1>
              <p className="text-sm text-gray-600 mt-2">{tagline}</p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  to={`/destinations/${destSlug}`}
                  className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#003580] font-medium"
                >
                  <MapPin size={16} className="shrink-0 text-[#003580]" />
                  {destLabel}
                </Link>
                {hotel.mapUrl && (
                  <a
                    href={hotel.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#003580] font-semibold hover:underline"
                  >
                    Show on map
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{address}</p>
            </div>

            <div className="rounded-xl bg-blue-50/80 border border-blue-100 p-4 space-y-3">
              {(hotel.guestScore != null || hotel.guestReviewCount != null) && (
                <div className="flex flex-wrap items-baseline gap-2">
                  {hotel.guestScore != null && (
                    <span className="text-2xl font-black text-[#003580]">{hotel.guestScore.toFixed(1)}</span>
                  )}
                  {hotel.guestReviewCount != null && (
                    <span className="text-sm text-gray-600">
                      · {hotel.guestReviewCount.toLocaleString()} guest reviews
                    </span>
                  )}
                </div>
              )}
              <blockquote className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                <Quote size={18} className="shrink-0 text-[#003580] opacity-60" aria-hidden />
                <span>
                  “{guestQuoteResolved.quote}”
                  {guestQuoteResolved.attribution && (
                    <span className="block text-xs text-gray-500 mt-1">— {guestQuoteResolved.attribution}</span>
                  )}
                </span>
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < hotel.rating ? 'text-[#FFB700] fill-[#FFB700]' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(hotel.pricePerNight, currency)}
                <span className="text-sm font-normal text-gray-500"> / night</span>
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Check-in</p>
                <p className="text-gray-900 font-medium">{checkIn}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Check-out</p>
                <p className="text-gray-900 font-medium">{checkOut}</p>
              </div>
              {hotel.distanceToCenter?.trim() && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Centre</p>
                  <p className="text-gray-800">{hotel.distanceToCenter}</p>
                </div>
              )}
              {hotel.distanceToBeach?.trim() && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Beach</p>
                  <p className="text-gray-800">{hotel.distanceToBeach}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900">About this property</h2>
              {descriptionParagraphs.map((p, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Good to know</h2>
              <ul className="space-y-1.5">
                {highlights.map((line, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-[#003580] font-bold">✓</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {hotel.features.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h2 className="text-sm font-bold text-gray-900 mb-2">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.features.map(f => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Room types</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Beds</th>
                      <th className="px-3 py-2 text-right">Guests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roomTypes.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2.5 font-medium text-gray-900">{r.name}</td>
                        <td className="px-3 py-2.5 text-gray-600">{r.beds ?? '—'}</td>
                        <td className="px-3 py-2.5 text-right text-gray-700">{r.maxGuests ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Restaurants</h2>
              <div className="space-y-3">
                {restaurants.map((r, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="font-semibold text-gray-900">{r.name}</p>
                    {r.cuisine && <p className="text-sm text-gray-600 mt-1">{r.cuisine}</p>}
                    {r.openFor && <p className="text-xs text-gray-500 mt-1">{r.openFor}</p>}
                    {r.ambiance && <p className="text-xs text-gray-600 mt-2 italic">{r.ambiance}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Nearby</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {surroundings.map((grp, gi) => (
                  <div key={gi}>
                    <p className="text-xs font-semibold text-[#003580] uppercase tracking-wide mb-2">{grp.category}</p>
                    <ul className="space-y-1.5">
                      {(grp.places ?? []).map((pl, pi) => (
                        <li key={pi} className="flex justify-between gap-3 text-sm text-gray-700">
                          <span className="min-w-0">{pl.name}</span>
                          <span className="text-gray-500 shrink-0">{pl.distance}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-3">Distances are indicative — verify before you travel.</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Sustainability</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{sustainabilityNote}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">FAQs</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {faq.question}
                        {open ? <ChevronUp size={18} className="shrink-0 text-gray-400" /> : <ChevronDown size={18} className="shrink-0 text-gray-400" />}
                      </button>
                      {open && faq.answer && (
                        <div className="px-4 pb-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
