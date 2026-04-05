import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  Truck,
  ImageIcon,
  ArrowRight,
  Building2,
  Sparkles,
  MessageSquareQuote,
} from 'lucide-react';
import { usePackages } from '../../hooks/usePackages';
import { useDestinations } from '../../hooks/useDestinations';
import { useVehicles } from '../../hooks/useVehicles';
import { useCatalogStore } from '../../catalog/catalogStore';
import { invalidateCatalogQueries } from '../../catalog/catalogInvalidate';
import { queryClient } from '../../lib/queryClient';

export default function AdminDashboardPage() {
  const { data: packages = [], isFetching: pkgLoading } = usePackages();
  const { data: destinations = [], isFetching: destLoading } = useDestinations();
  const { data: vehicles = [], isFetching: vehLoading } = useVehicles();
  const hotelCount = useCatalogStore(s => s.hotels.length);
  const activityCount = useCatalogStore(s => s.activities.length);
  const testimonialCount = useCatalogStore(s => s.testimonials.length);

  const cards = [
    {
      to: '/admin/packages',
      label: 'Packages',
      count: packages.length,
      loading: pkgLoading,
      icon: Package,
      hint: 'Add / edit / delete — full JSON editor',
    },
    {
      to: '/admin/destinations',
      label: 'Destinations',
      count: destinations.length,
      loading: destLoading,
      icon: MapPin,
      hint: 'Destination pages & slugs',
    },
    {
      to: '/admin/vehicles',
      label: 'Vehicles',
      count: vehicles.length,
      loading: vehLoading,
      icon: Truck,
      hint: 'Fleet & daily rates',
    },
    {
      to: '/admin/hotels',
      label: 'Hotels',
      count: hotelCount,
      loading: false,
      icon: Building2,
      hint: 'Customizer hotel lists',
    },
    {
      to: '/admin/activities',
      label: 'Activities',
      count: activityCount,
      loading: false,
      icon: Sparkles,
      hint: 'Optional tour add-ons',
    },
    {
      to: '/admin/testimonials',
      label: 'Testimonials',
      count: testimonialCount,
      loading: false,
      icon: MessageSquareQuote,
      hint: 'Homepage reviews carousel',
    },
    {
      to: '/admin/media',
      label: 'Images & media',
      count: null,
      loading: false,
      icon: ImageIcon,
      hint: 'coverImage & galleryImages on packages',
    },
  ];

  function handleResetDefaults() {
    if (
      !window.confirm(
        'Reset ALL catalog data to the built-in defaults? Your edits in this browser (localStorage) will be lost.'
      )
    ) {
      return;
    }
    useCatalogStore.getState().resetCatalogToSeed();
    invalidateCatalogQueries();
    void queryClient.invalidateQueries();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Everything below is editable: use <strong className="text-gray-800">Add</strong> /{' '}
          <strong className="text-gray-800">Edit</strong> / <strong className="text-gray-800">Delete</strong> in each
          section. Changes save in this browser only until you connect a real API.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ to, label, count, loading, icon: Icon, hint }) => (
          <Link
            key={to}
            to={to}
            className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-[#003580] hover:shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003580] focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-[#003580]/10 flex items-center justify-center text-[#003580] shrink-0">
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{label}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">{hint}</p>
                </div>
              </div>
              <ArrowRight
                size={18}
                className="text-[#003580]/50 group-hover:text-[#003580] shrink-0 mt-1 transition-colors"
              />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline gap-2">
              {count !== null && (
                <span className="text-3xl font-black text-[#003580]">{loading ? '…' : count}</span>
              )}
              {count !== null && <span className="text-sm text-gray-500">records</span>}
              {count === null && <span className="text-sm text-gray-600">Notes</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between bg-white rounded-xl border border-gray-200 p-4">
        <div>
          <p className="font-semibold text-gray-900">Reset catalog</p>
          <p className="text-sm text-gray-600">Restore the original bundled data from the codebase (clears local edits).</p>
        </div>
        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-4 py-2.5 rounded-lg border border-red-300 text-red-700 font-semibold text-sm hover:bg-red-50 shrink-0"
        >
          Reset to defaults
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">Demo login</p>
        <p>
          Admin password is only for demos. For production, use server-side auth. Catalog is stored in{' '}
          <code className="bg-white/80 px-1 rounded">localStorage</code> — not synced between devices or users.
        </p>
      </div>
    </div>
  );
}
