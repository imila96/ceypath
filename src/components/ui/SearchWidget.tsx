import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Plus, Minus, Calendar } from 'lucide-react';

const TRIP_TYPES = ['Full Package', 'Custom Build', 'Day Tours'];
const AIRPORTS = [
  { value: 'CMB', label: 'Bandaranaike International (CMB)' },
  { value: 'HRI', label: 'Mattala Rajapaksa (HRI)' },
];

export default function SearchWidget() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('Full Package');
  const [airport, setAirport] = useState('CMB');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showTravelers, setShowTravelers] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      airport,
      checkin: checkIn,
      checkout: checkOut,
      adults: adults.toString(),
      children: children.toString(),
      type: tripType,
    });
    if (tripType === 'Custom Build') {
      navigate(`/customize?${params}`);
    } else {
      navigate(`/packages?${params}`);
    }
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Trip Type */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Trip Type</label>
          <div className="relative">
            <select
              value={tripType}
              onChange={e => setTripType(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            >
              {TRIP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Arrival Airport */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Arrival Airport</label>
          <div className="relative">
            <select
              value={airport}
              onChange={e => setAirport(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            >
              {AIRPORTS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Arrival Date</label>
          <div className="relative">
            <input
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Departure Date</label>
          <div className="relative">
            <input
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent"
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Travelers</label>
          <button
            type="button"
            onClick={() => setShowTravelers(!showTravelers)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm font-medium text-gray-800 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#003580]"
          >
            <span>{adults} Adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} Child` : ''}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {showTravelers && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Adults</p>
                  <p className="text-xs text-gray-500">Ages 13+</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#003580] transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-bold">{adults}</span>
                  <button type="button" onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full border-2 border-[#003580] bg-[#003580] text-white flex items-center justify-center hover:bg-[#002560] transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Children</p>
                  <p className="text-xs text-gray-500">Ages 0-12</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#003580] transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-bold">{children}</span>
                  <button type="button" onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded-full border-2 border-[#003580] bg-[#003580] text-white flex items-center justify-center hover:bg-[#002560] transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => setShowTravelers(false)}
                className="w-full mt-3 py-2 bg-[#003580] text-white text-sm font-semibold rounded-lg">
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full mt-4 py-4 bg-[#E32636] text-white font-bold text-base rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
      >
        <Search size={18} />
        Search Packages
      </button>
    </form>
  );
}
