import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PackageCard from '../ui/PackageCard';
import { usePackages } from '../../hooks/usePackages';
import type { TourPackage } from '../../repositories/packagesRepository';

const FILTER_TABS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'budget', label: 'Budget' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

export default function FeaturedPackages() {
  const [activeTab, setActiveTab] = useState('all');
  const { data: packages = [], isLoading } = usePackages();

  const sortFeatured = (list: TourPackage[]) =>
    [...list].sort((a, b) => Number(!!b.highlighted) - Number(!!a.highlighted));

  const filtered = activeTab === 'all'
    ? sortFeatured(packages.filter(p => p.featured)).slice(0, 6)
    : sortFeatured(packages.filter(p => p.type === activeTab)).slice(0, 6);

  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Most Popular Sri Lanka Packages</h2>
            <p className="text-gray-500 mt-1">Handpicked tours loved by thousands of travelers</p>
          </div>
          <Link to="/packages" className="flex items-center gap-1 text-[#003580] font-semibold text-sm hover:underline shrink-0">
            View All Packages <ArrowRight size={14} />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                ${activeTab === tab.value
                  ? 'bg-[#003580] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#003580] hover:text-[#003580]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Package Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium mb-2">No featured packages in this category yet</p>
            <Link to="/packages" className="text-[#003580] font-semibold hover:underline">
              Browse all packages →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
