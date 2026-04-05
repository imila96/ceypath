import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import type { Destination } from '../../repositories/destinationsRepository';

interface Props {
  destination: Destination;
  compact?: boolean;
}

export default function DestinationCard({ destination, compact = false }: Props) {
  if (compact) {
    return (
      <Link
        to={`/destinations/${destination.slug}`}
        className="relative overflow-hidden rounded-lg h-24 flex items-end p-3 group"
      >
        {destination.coverImage ? (
          <>
            <img src={destination.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient}`} />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          </>
        )}
        <div className="relative z-10">
          <h4 className="text-white font-bold text-sm">{destination.name}</h4>
          <p className="text-white/80 text-xs">{destination.packageCount} packages</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className={`relative block overflow-hidden rounded-xl h-44 group cursor-pointer ${
        destination.coverImage ? '' : `bg-gradient-to-br ${destination.gradient}`
      }`}
    >
      {destination.coverImage ? (
        <>
          <img src={destination.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-all duration-300" />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-all duration-300" />
      )}

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
            <Package size={10} className="inline mr-1" />
            {destination.packageCount} packages
          </span>
        </div>

        <div>
          <h3 className="text-white font-black text-xl leading-tight">{destination.name}</h3>
          <p className="text-white/80 text-xs mt-1 line-clamp-2">{destination.tagline}</p>
          <div className="flex items-center gap-1 mt-2">
            <MapPin size={11} className="text-white/70" />
            <span className="text-white/70 text-xs">{destination.distanceFromColombo} from Colombo</span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
