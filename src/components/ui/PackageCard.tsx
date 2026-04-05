import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ChevronRight } from 'lucide-react';
import type { TourPackage } from '../../repositories/packagesRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface Props {
  pkg: TourPackage;
}

const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: 'bg-[#E32636] text-white',
  NEW: 'bg-emerald-500 text-white',
  LIMITED: 'bg-amber-500 text-white',
  'HOT DEAL': 'bg-orange-500 text-white',
};

export default function PackageCard({ pkg }: Props) {
  const { currency } = useCurrency();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      {/* Image */}
      <div className={`relative h-48 bg-gradient-to-br ${pkg.gradient} flex items-end overflow-hidden`}>
        {pkg.coverImage ? (
          <img src={pkg.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-black/20" />
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded ${BADGE_STYLES[pkg.badge] || 'bg-gray-700 text-white'}`}>
          {pkg.badge}
        </span>
        {/* Spots left */}
        {pkg.spotsLeft && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
            Only {pkg.spotsLeft} spots left!
          </span>
        )}
        {/* Duration */}
        <div className="relative z-10 p-3 w-full flex justify-between items-end">
          <span className="bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm">
            <Clock size={11} className="inline mr-1" />
            {pkg.days} Days / {pkg.nights} Nights
          </span>
          <div className="flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            <Star size={11} fill="currentColor" className="text-[#FFB700]" />
            <span className="font-semibold">{pkg.rating}</span>
            <span className="text-gray-300">({pkg.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{pkg.name}</h3>

        {/* Destinations */}
        <div className="flex flex-wrap gap-1 mb-2">
          {pkg.destinations.map(dest => (
            <button
              key={dest}
              onClick={() => navigate(`/destinations/${dest.toLowerCase().replace(' ', '-')}`)}
              className="text-xs bg-blue-50 text-[#003580] px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors font-medium"
            >
              {dest}
            </button>
          ))}
        </div>

        {/* Highlights */}
        <ul className="space-y-1 mb-3 flex-1">
          {pkg.highlights.slice(0, 4).map((h, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{h.replace('✓ ', '')}</span>
            </li>
          ))}
        </ul>

        {/* Vehicle */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <span>🚐</span>
          <span>{pkg.vehicle}</span>
          <span className="mx-1">•</span>
          <span>{'⭐'.repeat(pkg.hotelRating)} Hotels</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 line-through">{formatCurrency(pkg.originalPrice, currency)}</p>
            <p className="text-xl font-black text-gray-900">{formatCurrency(pkg.price, currency)}</p>
            <p className="text-xs text-gray-500">per person</p>
            <p className="text-xs text-green-600 font-medium">Free cancellation</p>
          </div>
          <Link
            to={`/packages/${pkg.id}`}
            className="px-4 py-2 bg-[#003580] text-white text-sm font-semibold rounded hover:bg-[#002560] transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
