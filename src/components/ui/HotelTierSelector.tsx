import React from 'react';
import { Check, Star } from 'lucide-react';
import { useCatalogStore } from '../../catalog/catalogStore';
import type { HotelTier } from '../../repositories/hotelsRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface Props {
  destination: string;
  selectedTier: HotelTier;
  onSelectTier: (tier: HotelTier) => void;
  selectedHotelId?: string;
  onSelectHotel?: (id: string) => void;
}

const TIER_LABELS: Record<HotelTier, string> = {
  budget: '3★ Budget',
  standard: '4★ Standard',
  luxury: '5★ Luxury',
};

const TIER_COLORS: Record<HotelTier, string> = {
  budget: 'border-gray-300 bg-gray-50',
  standard: 'border-blue-300 bg-blue-50',
  luxury: 'border-yellow-300 bg-yellow-50',
};

export default function HotelTierSelector({ destination, selectedTier, onSelectTier, selectedHotelId, onSelectHotel }: Props) {
  const { currency } = useCurrency();
  const hotels = useCatalogStore(s => s.hotels);
  const tiers: HotelTier[] = ['budget', 'standard', 'luxury'];

  const selectedHotels = hotels.filter(h => h.destination === destination && h.tier === selectedTier);
  const avgPrice = selectedHotels.reduce((s, h) => s + h.pricePerNight, 0) / (selectedHotels.length || 1);

  return (
    <div>
      {/* Tier Tabs */}
      <div className="flex gap-2 mb-3">
        {tiers.map(tier => {
          const tierHotels = hotels.filter(h => h.destination === destination && h.tier === tier);
          const avg = tierHotels.reduce((s, h) => s + h.pricePerNight, 0) / (tierHotels.length || 1);
          return (
            <button
              key={tier}
              onClick={() => onSelectTier(tier)}
              className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg border-2 transition-all
                ${selectedTier === tier
                  ? 'border-[#003580] bg-[#003580] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-blue-200'
                }`}
            >
              <div>{TIER_LABELS[tier]}</div>
              <div className="font-normal opacity-80">From {formatCurrency(avg, currency)}/night</div>
            </button>
          );
        })}
      </div>

      {/* Hotel Options */}
      <div className="space-y-2">
        {selectedHotels.map(hotel => (
          <div
            key={hotel.id}
            onClick={() => onSelectHotel?.(hotel.id)}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${selectedHotelId === hotel.id ? 'border-[#003580] bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {hotel.image ? (
                <img src={hotel.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${hotel.gradient}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{hotel.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(hotel.rating)].map((_, i) => (
                  <Star key={i} size={10} fill="#FFB700" className="text-[#FFB700]" />
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {hotel.features.slice(0, 3).map(f => (
                  <span key={f} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-sm text-gray-900">{formatCurrency(hotel.pricePerNight, currency)}</p>
              <p className="text-xs text-gray-500">per night</p>
              {selectedHotelId === hotel.id && (
                <div className="w-5 h-5 bg-[#003580] rounded-full flex items-center justify-center mt-1 ml-auto">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
