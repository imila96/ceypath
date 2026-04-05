import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Thermometer, MessageCircle, ArrowRight } from 'lucide-react';
import { useDestination } from '../hooks/useDestination';
import { usePackages } from '../hooks/usePackages';
import Breadcrumb from '../components/ui/Breadcrumb';
import PackageCard from '../components/ui/PackageCard';

export default function DestinationPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: packages = [] } = usePackages();
  const {
    destination: dest,
    data: allDestinations = [],
    isError: destError,
    error: destQueryError,
    refetch: refetchDestinations,
    isFetching,
  } = useDestination(slug);

  if (destError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">Could not load destinations</p>
          <p className="text-gray-600 text-sm mb-4">{destQueryError instanceof Error ? destQueryError.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetchDestinations()}
            className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm mr-2"
          >
            Try again
          </button>
          <Link to="/packages" className="text-[#003580] font-semibold text-sm hover:underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination not found</h2>
          <Link to="/packages" className="text-[#003580] font-semibold hover:underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  if (!dest && isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003580] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading destination…</p>
        </div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Destination not found</h2>
          <Link to="/packages" className="text-[#003580] font-semibold hover:underline">← Back to packages</Link>
        </div>
      </div>
    );
  }

  const relatedPackages = packages.filter(p =>
    p.destinations.some(d => d.toLowerCase() === dest.name.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero */}
      <div className={`relative h-72 sm:h-96 overflow-hidden ${dest.coverImage ? '' : `bg-gradient-to-br ${dest.gradient}`}`}>
        {dest.coverImage ? (
          <>
            <img src={dest.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-black/30" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <Breadcrumb crumbs={[
              { label: 'Home', to: '/' },
              { label: 'Destinations', to: '/packages' },
              { label: dest.name },
            ]} />
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-1">{dest.name}</h1>
            <p className="text-white/80 text-lg">{dest.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Quick Facts</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Clock, label: 'Best Time', value: dest.bestTime },
                  { icon: MapPin, label: 'From Colombo', value: dest.distanceFromColombo },
                  { icon: MessageCircle, label: 'Language', value: dest.language },
                  { icon: Thermometer, label: 'Avg. Temp', value: dest.avgTemp },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-3 bg-gray-50 rounded-lg">
                    <Icon size={20} className="text-[#003580] mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-3">About {dest.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-3">{dest.description}</p>
              <p className="text-gray-600 leading-relaxed">{dest.longDescription}</p>
            </div>

            {/* Top Attractions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Top Attractions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.attractions.map((att, i) => (
                  <div key={i} className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:border-blue-200 transition-colors">
                    {att.image ? (
                      <img
                        src={att.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-100"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${dest.gradient} flex items-center justify-center text-xl shrink-0`}>
                        {['🏛️', '🌿', '🏔️', '🏖️', '🦁', '🎭'][i % 6]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{att.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{att.type}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{att.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packages including this destination */}
            {relatedPackages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 text-lg">Packages Including {dest.name}</h2>
                  <Link to="/packages" className="flex items-center gap-1 text-[#003580] text-sm font-semibold hover:underline">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPackages.map(pkg => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* CTA */}
              <div className="bg-[#003580] rounded-xl p-5 text-white">
                <h3 className="font-bold text-lg mb-2">Plan Your {dest.name} Trip</h3>
                <p className="text-blue-200 text-sm mb-4">Explore {dest.packageCount} packages that include {dest.name} or build your own custom itinerary.</p>
                <Link
                  to={`/packages`}
                  className="block w-full py-3 bg-white text-[#003580] font-bold rounded-lg text-center text-sm hover:bg-gray-100 transition-colors mb-2"
                >
                  Browse Packages
                </Link>
                <Link
                  to="/customize"
                  className="block w-full py-3 bg-[#E32636] text-white font-bold rounded-lg text-center text-sm hover:bg-red-700 transition-colors"
                >
                  Build Custom Tour
                </Link>
              </div>

              {/* Other Destinations */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Other Destinations</h3>
                <div className="space-y-2">
                  {allDestinations.filter(d => d.id !== dest.id).slice(0, 5).map(d => (
                    <Link
                      key={d.id}
                      to={`/destinations/${d.slug}`}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                    >
                      {d.coverImage ? (
                        <img src={d.coverImage} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${d.gradient} shrink-0`} />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.packageCount} packages</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
