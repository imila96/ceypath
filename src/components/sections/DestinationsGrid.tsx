import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDestinations } from '../../hooks/useDestinations';
import DestinationCard from '../ui/DestinationCard';

export default function DestinationsGrid() {
  const { data: destinations = [], isError, error, refetch } = useDestinations();

  if (isError) {
    return (
      <section className="py-12 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-600 font-semibold mb-2">Could not load destinations</p>
          <p className="text-gray-600 text-sm mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Explore Destinations</h2>
            <p className="text-gray-500 mt-1">From ancient kingdoms to pristine beaches — all in one island</p>
          </div>
          <Link to="/packages" className="flex items-center gap-1 text-[#003580] font-semibold text-sm hover:underline shrink-0">
            Browse by destination <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </div>
    </section>
  );
}
