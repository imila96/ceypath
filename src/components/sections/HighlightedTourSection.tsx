import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { usePackages } from '../../hooks/usePackages';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

export default function HighlightedTourSection() {
  const { currency } = useCurrency();
  const { data: packages = [], isLoading } = usePackages();
  const tour = packages.find(p => p.highlighted);

  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-[#003580] to-[#001a4d] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 h-64 rounded-2xl bg-white/5 animate-pulse" />
      </section>
    );
  }
  if (!tour) return null;

  const thumbs = tour.galleryImages?.slice(0, 4) ?? [];

  return (
    <section className="bg-gradient-to-b from-[#003580] to-[#001a4d] text-white py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
          {/* Copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#FFB700]/20 border border-[#FFB700]/40 rounded-full px-3 py-1.5 w-fit mb-4">
              <Sparkles size={14} className="text-[#FFB700]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFB700]">Featured tour · Real photos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">{tour.name}</h2>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed mb-4 max-w-xl">
              {tour.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {tour.destinations.slice(0, 6).map(d => (
                <span
                  key={d}
                  className="text-xs font-medium bg-white/10 border border-white/20 rounded-full px-2.5 py-1"
                >
                  {d}
                </span>
              ))}
              {tour.destinations.length > 6 && (
                <span className="text-xs text-blue-200 self-center">+{tour.destinations.length - 6} more</span>
              )}
            </div>
            <div className="flex flex-wrap items-end gap-4 mb-5">
              <div>
                <p className="text-xs text-blue-200 line-through">{formatCurrency(tour.originalPrice, currency)}</p>
                <p className="text-3xl font-black text-white">{formatCurrency(tour.price, currency)}</p>
                <p className="text-xs text-blue-200">per person · {tour.days} days / {tour.nights} nights</p>
              </div>
              <Link
                to={`/packages/${tour.id}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E32636] hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                View this package
                <ArrowRight size={18} />
              </Link>
            </div>
            <p className="text-xs text-blue-300/80 flex items-center gap-1">
              <MapPin size={12} />
              Covers Anuradhapura, Dambulla, Sigiriya, Kandy, Ella, Yala, Wilpattu &amp; Galle — with your own Sri Lanka photo set
            </p>
          </div>

          {/* Photo mosaic */}
          <div className="lg:w-[min(100%,480px)] shrink-0">
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
              <div className="col-span-2 relative aspect-[2/1] bg-black/20">
                {tour.coverImage ? (
                  <img src={tour.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-bold drop-shadow-md">Sigiriya &amp; the Cultural Triangle</span>
              </div>
              {thumbs.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] bg-black/20">
                  <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25" />
                  <span className="absolute bottom-2 left-2 right-2 text-[10px] sm:text-xs font-semibold leading-tight drop-shadow-md line-clamp-2">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
