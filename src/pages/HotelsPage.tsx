import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { useCatalogStore } from '../catalog/catalogStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import type { HotelTier } from '../data/hotels';
import { placeholderTaglineCard } from '../utils/hotelPlaceholders';

const TIER_LABEL: Record<HotelTier, string> = {
  budget: 'Budget',
  standard: 'Standard',
  luxury: 'Luxury',
};

const TIERS: HotelTier[] = ['budget', 'standard', 'luxury'];

function formatDestinationLabel(slug: string) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function HotelsPage() {
  const { currency } = useCurrency();
  const hotels = useCatalogStore(s => s.hotels);

  const destinations = useMemo(() => {
    const set = new Set(hotels.map(h => h.destination));
    return [...set].sort();
  }, [hotels]);

  const [destFilter, setDestFilter] = useState<string[]>([]);
  const [tierFilter, setTierFilter] = useState<HotelTier[]>([]);

  const filtered = hotels.filter(h => {
    if (destFilter.length > 0 && !destFilter.includes(h.destination)) return false;
    if (tierFilter.length > 0 && !tierFilter.includes(h.tier)) return false;
    return true;
  });

  function toggle<T extends string>(list: T[], setList: React.Dispatch<React.SetStateAction<T[]>>, val: T) {
    setList(prev => (prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]));
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-gradient-to-r from-[#003580] to-[#1a5276] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            variant="light"
            crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Hotels' },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-black mt-4 mb-2">Partner hotels</h1>
          <p className="text-blue-100 max-w-2xl text-lg">
            Handpicked stays across Sri Lanka — browse by area and tier. Prices shown per night (guide rates).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Area</p>
              <div className="flex flex-wrap gap-2">
                {destinations.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggle(destFilter, setDestFilter, d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      destFilter.includes(d)
                        ? 'bg-[#003580] text-white border-[#003580]'
                        : 'border-gray-200 text-gray-700 hover:border-[#003580]'
                    }`}
                  >
                    {formatDestinationLabel(d)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tier</p>
              <div className="flex flex-wrap gap-2">
                {TIERS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle(tierFilter, setTierFilter, t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      tierFilter.includes(t)
                        ? 'bg-[#003580] text-white border-[#003580]'
                        : 'border-gray-200 text-gray-700 hover:border-[#003580]'
                    }`}
                  >
                    {TIER_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Showing <strong>{filtered.length}</strong> of {hotels.length} hotels
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(h => (
            <Link
              key={h.id}
              to={`/hotels/${h.id}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#003580]/30 transition-all"
            >
              <div className={`relative h-40 bg-gradient-to-br ${h.gradient} overflow-hidden`}>
                {h.image ? (
                  <img src={h.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-90">🏨</div>
                )}
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-white/90 text-[#003580] px-2 py-0.5 rounded">
                  {TIER_LABEL[h.tier]}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-gray-900 group-hover:text-[#003580] transition-colors line-clamp-2">
                  {h.name}
                </h2>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {h.tagline?.trim() || placeholderTaglineCard(h)}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin size={12} className="shrink-0" />
                  {formatDestinationLabel(h.destination)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < h.rating ? 'text-[#FFB700] fill-[#FFB700]' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {formatCurrency(h.pricePerNight, currency)}
                  <span className="text-xs font-normal text-gray-500"> / night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg font-medium">No hotels match these filters.</p>
            <button
              type="button"
              onClick={() => {
                setDestFilter([]);
                setTierFilter([]);
              }}
              className="mt-3 text-[#003580] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
