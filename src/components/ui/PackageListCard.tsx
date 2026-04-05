import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Check } from 'lucide-react';
import type { TourPackage } from '../../repositories/packagesRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';
import RatingBadge from './RatingBadge';

interface Props {
  pkg: TourPackage;
}

const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: 'bg-[#E32636] text-white',
  NEW: 'bg-emerald-500 text-white',
  LIMITED: 'bg-amber-500 text-white',
  'HOT DEAL': 'bg-orange-500 text-white',
};

export default function PackageListCard({ pkg }: Props) {
  const { currency } = useCurrency();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col sm:flex-row">
      {/* Image */}
      <div className={`relative sm:w-48 lg:w-56 h-48 sm:min-h-[180px] shrink-0 bg-gradient-to-br ${pkg.gradient} overflow-hidden`}>
        {pkg.coverImage ? (
          <img src={pkg.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover sm:min-h-[180px]" />
        ) : null}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2 py-1 rounded ${BADGE_STYLES[pkg.badge] || 'bg-gray-700 text-white'}`}>
            {pkg.badge}
          </span>
        </div>
        {pkg.spotsLeft && (
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
              Only {pkg.spotsLeft} left!
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">
            <Clock size={10} className="inline mr-1" />
            {pkg.days}D/{pkg.nights}N
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col sm:flex-row">
        {/* Left: Details */}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight flex-1">{pkg.name}</h3>
          </div>

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
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            {pkg.highlights.slice(0, 4).map((h, i) => (
              <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                <Check size={12} className="text-green-500 shrink-0" />
                <span>{h.replace('✓ ', '')}</span>
              </div>
            ))}
          </div>

          {/* Inclusions Icons */}
          <div className="flex items-center gap-3 text-sm">
            <span title="Hotel included" className="flex items-center gap-1 text-gray-500 text-xs">🏨 {pkg.hotelRating}★</span>
            <span title="Vehicle included" className="flex items-center gap-1 text-gray-500 text-xs">🚐 {pkg.vehicle.split(' ').slice(0,2).join(' ')}</span>
            <span title="Breakfast" className="text-gray-500 text-xs">🍳 Breakfast</span>
            <span title="Airport transfers" className="text-gray-500 text-xs">✈️ Transfers</span>
          </div>
        </div>

        {/* Right: Price + CTA */}
        <div className="sm:w-44 lg:w-52 sm:pl-4 sm:border-l border-gray-100 flex flex-col justify-between mt-4 sm:mt-0">
          <div className="sm:text-right">
            <div className="flex sm:justify-end mb-2">
              <RatingBadge rating={pkg.rating} reviewCount={pkg.reviewCount} isStarRating={true} size="sm" />
            </div>
            <p className="text-xs text-gray-400 line-through">{formatCurrency(pkg.originalPrice, currency)}</p>
            <p className="text-2xl font-black text-gray-900">{formatCurrency(pkg.price, currency)}</p>
            <p className="text-xs text-gray-500 mb-1">per person</p>
            <p className="text-xs text-green-600 font-medium mb-3">✓ Free cancellation</p>
          </div>
          <div className="space-y-2">
            <Link
              to={`/packages/${pkg.id}`}
              className="block w-full py-2.5 bg-[#E32636] text-white text-sm font-bold rounded text-center hover:bg-red-700 transition-colors"
            >
              See Package →
            </Link>
            <Link
              to={`/customize?base=${pkg.id}`}
              className="block w-full py-2 border border-[#003580] text-[#003580] text-sm font-semibold rounded text-center hover:bg-blue-50 transition-colors"
            >
              Customize
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
