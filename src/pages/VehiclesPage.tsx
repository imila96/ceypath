import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import Breadcrumb from '../components/ui/Breadcrumb';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';

const CAPACITY_FILTERS = [
  { value: '2-4', label: '2-4 Passengers' },
  { value: '5-8', label: '5-8 Passengers' },
  { value: '9-14', label: '9-14 Passengers' },
  { value: '15+', label: '15+ Passengers' },
];

const TYPE_FILTERS = ['Sedan', 'SUV', 'Van', 'Luxury', 'Minibus'];

const ALL_FEATURES = ['AC', 'WiFi', 'GPS', 'Bluetooth', 'Leather Seats', 'Fridge', 'TV Screen', 'Entertainment System', 'PA System', 'Panoramic Roof'];

export default function VehiclesPage() {
  const { currency } = useCurrency();
  const { data: vehicles = [], isError, error, refetch } = useVehicles();
  const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const filtered = vehicles.filter(v => {
    if (typeFilter.length > 0 && !typeFilter.includes(v.type)) return false;
    if (capacityFilter.length > 0) {
      const inRange = capacityFilter.some(r => {
        if (r === '2-4') return v.capacity <= 4;
        if (r === '5-8') return v.capacity >= 5 && v.capacity <= 8;
        if (r === '9-14') return v.capacity >= 9 && v.capacity <= 14;
        if (r === '15+') return v.capacity >= 15;
        return false;
      });
      if (!inRange) return false;
    }
    return true;
  });

  function toggleFilter(_list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">Could not load vehicles</p>
          <p className="text-gray-600 text-sm mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#003580] text-white rounded-lg font-semibold text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#003580] to-[#1a5276] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Fleet' }]} />
          <div className="mt-4">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">Travel in Comfort</h1>
            <h2 className="text-2xl sm:text-3xl font-black text-[#FFB700] mb-3">Our Premium Fleet</h2>
            <p className="text-blue-200 max-w-xl text-lg">
              Every vehicle in our fleet is air-conditioned, GPS-equipped, and comes with a professional, English-speaking driver.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { value: '8+', label: 'Vehicle Types' },
              { value: '50+', label: 'Active Vehicles' },
              { value: '100%', label: 'Insured & Licensed' },
              { value: '4.9★', label: 'Driver Rating' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-[#FFB700]">{s.value}</p>
                <p className="text-blue-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Capacity</p>
              <div className="flex flex-wrap gap-2">
                {CAPACITY_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => toggleFilter(capacityFilter, setCapacityFilter, f.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                      ${capacityFilter.includes(f.value) ? 'bg-[#003580] text-white border-[#003580]' : 'border-gray-200 text-gray-700 hover:border-[#003580]'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
              <div className="flex flex-wrap gap-2">
                {TYPE_FILTERS.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleFilter(typeFilter, setTypeFilter, t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                      ${typeFilter.includes(t) ? 'bg-[#003580] text-white border-[#003580]' : 'border-gray-200 text-gray-700 hover:border-[#003580]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              {v.badge && (
                <div className="px-4 pt-3">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-[#FFB700] text-[#003580]">{v.badge}</span>
                </div>
              )}
              <div className="relative mx-4 mt-3 h-36 overflow-hidden rounded-xl bg-gray-100">
                {v.image ? (
                  <img src={v.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} flex items-center justify-center text-5xl`}>
                    {v.type === 'Luxury' ? '🚘' : v.type === 'SUV' ? '🚙' : v.type === 'Minibus' ? '🚌' : '🚐'}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{v.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 mb-2">
                  <span>👥 {v.capacity} pax</span>
                  <span>•</span>
                  <span>🧳 {v.luggage} bags</span>
                  <span>•</span>
                  <span>{v.type}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {v.features.slice(0, 4).map(f => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="font-bold text-gray-900">{formatCurrency(v.dailyRate, currency)}<span className="text-xs font-normal text-gray-500">/day</span></p>
                    <p className="text-xs text-green-600 font-medium">Driver included</p>
                  </div>
                  <Link to="/customize" className="px-3 py-1.5 bg-[#003580] text-white text-xs font-bold rounded hover:bg-[#002560] transition-colors">
                    Add to Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Fleet Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 sticky left-0 bg-gray-50 min-w-[140px]">Feature</th>
                  {vehicles.map(v => (
                    <th key={v.id} className="text-center px-4 py-3 font-semibold text-gray-700 min-w-[120px]">{v.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-gray-700 sticky left-0 bg-white">Capacity</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-2.5 text-center text-gray-700">{v.capacity} pax</td>
                  ))}
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-700 sticky left-0 bg-gray-50/50">Luggage</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-2.5 text-center text-gray-700">{v.luggage} bags</td>
                  ))}
                </tr>
                {ALL_FEATURES.map((feat, fi) => (
                  <tr key={feat} className={fi % 2 === 0 ? '' : 'bg-gray-50/50'}>
                    <td className="px-4 py-2.5 font-medium text-gray-700 sticky left-0" style={{ background: fi % 2 === 0 ? 'white' : 'rgba(249,250,251,0.5)' }}>{feat}</td>
                    {vehicles.map(v => (
                      <td key={v.id} className="px-4 py-2.5 text-center">
                        {v.features.includes(feat) ? (
                          <Check size={16} className="text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-blue-50">
                  <td className="px-4 py-2.5 font-bold text-gray-800 sticky left-0 bg-blue-50">Daily Rate</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-2.5 text-center font-bold text-[#003580]">{formatCurrency(v.dailyRate, currency)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
