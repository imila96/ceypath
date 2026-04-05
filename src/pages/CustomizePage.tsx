import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown, Plus, Minus, X, Info } from 'lucide-react';
import { CustomizerProvider } from '../context/CustomizerContext';
import { useCustomizer } from '../hooks/useCustomizer';
import StepProgress from '../components/ui/StepProgress';
import VehicleCard from '../components/ui/VehicleCard';
import ActivityCard from '../components/ui/ActivityCard';
import PriceSummary from '../components/ui/PriceSummary';
import HotelTierSelector from '../components/ui/HotelTierSelector';
import { useDestinations } from '../hooks/useDestinations';
import { useVehicles } from '../hooks/useVehicles';
import { useCatalogStore } from '../catalog/catalogStore';
import { calcCustomTotal } from '../utils/priceCalculator';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/formatters';

const STEPS = [
  { number: 1, label: 'Trip Details' },
  { number: 2, label: 'Destinations' },
  { number: 3, label: 'Hotels' },
  { number: 4, label: 'Vehicle' },
  { number: 5, label: 'Activities' },
];

const AIRPORTS = [
  { value: 'CMB', label: 'Bandaranaike International (CMB)' },
  { value: 'HRI', label: 'Mattala Rajapaksa (HRI)' },
];

const DEST_DEFAULT_NIGHTS: Record<string, number> = {
  'd1': 1, 'd2': 2, 'd3': 2, 'd4': 2, 'd5': 2, 'd6': 2, 'd7': 2, 'd8': 3,
};

function CustomizerInner() {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { data: destinations = [] } = useDestinations();
  const { data: vehicles = [] } = useVehicles();
  const activities = useCatalogStore(s => s.activities);
  const hotels = useCatalogStore(s => s.hotels);
  const {
    state, currentStep, errors, nextStep, prevStep, goToStep,
    addDestination, removeDestination, updateDestination, moveDestination,
    toggleActivity, totalNights, updateState,
  } = useCustomizer();

  const breakdown = useMemo(
    () => calcCustomTotal(state, hotels, activities, vehicles),
    [state, hotels, activities, vehicles]
  );

  const selectedDestinationIds = state.destinations.map(d => d.id);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-black text-gray-900 mb-4">Build Your Custom Sri Lanka Tour</h1>
          <StepProgress steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Step Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 animate-fade-in">

              {/* Step 1: Trip Details */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Step 1: Trip Details</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arrival Airport</label>
                      <select
                        value={state.arrivalAirport}
                        onChange={e => updateState({ arrivalAirport: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580]"
                      >
                        {AIRPORTS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Arrival Date</label>
                        <input
                          type="date"
                          value={state.arrivalDate}
                          onChange={e => updateState({ arrivalDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580] ${errors.arrivalDate ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.arrivalDate && <p className="text-red-500 text-xs mt-1">{errors.arrivalDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Departure Date</label>
                        <input
                          type="date"
                          value={state.departureDate}
                          onChange={e => updateState({ departureDate: e.target.value })}
                          min={state.arrivalDate || new Date().toISOString().split('T')[0]}
                          className={`w-full border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580] ${errors.departureDate ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Adults', sub: 'Ages 13+', key: 'adults' as const, min: 1 },
                        { label: 'Children', sub: 'Ages 0-12', key: 'children' as const, min: 0 },
                      ].map(({ label, sub, key, min }) => (
                        <div key={key} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800">{label}</p>
                              <p className="text-xs text-gray-500">{sub}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateState({ [key]: Math.max(min, state[key] - 1) })}
                                className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#003580] transition-colors">
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center font-bold">{state[key]}</span>
                              <button onClick={() => updateState({ [key]: state[key] + 1 })}
                                className="w-8 h-8 rounded-full border-2 border-[#003580] bg-[#003580] text-white flex items-center justify-center hover:bg-[#002560] transition-colors">
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Special Requirements (optional)</label>
                      <textarea
                        value={state.specialRequirements}
                        onChange={e => updateState({ specialRequirements: e.target.value })}
                        placeholder="Dietary requirements, mobility needs, special occasions, etc."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#003580] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Destinations */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 2: Choose Destinations</h2>
                  <p className="text-gray-500 text-sm mb-5">Select and arrange your destinations. Drag or use arrows to reorder.</p>

                  {errors.destinations && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 text-sm">
                      {errors.destinations}
                    </div>
                  )}

                  {/* Destination Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {destinations.map(dest => {
                      const isSelected = selectedDestinationIds.includes(dest.id);
                      return (
                        <div
                          key={dest.id}
                          onClick={() => isSelected ? removeDestination(dest.id) : addDestination(dest.id, DEST_DEFAULT_NIGHTS[dest.id] || 2)}
                          className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all
                            ${isSelected ? 'border-[#003580] shadow-md' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <div className={`h-20 bg-gradient-to-br ${dest.gradient}`} />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#003580] rounded-full flex items-center justify-center">
                              <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </div>
                          )}
                          <div className="p-3">
                            <p className="font-bold text-gray-900 text-sm">{dest.name}</p>
                            <p className="text-xs text-gray-500">{dest.tagline}</p>
                            <p className="text-xs text-blue-600 mt-1">Recommended: {DEST_DEFAULT_NIGHTS[dest.id] || 2} nights</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Order */}
                  {state.destinations.length > 0 && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Your Itinerary Order ({totalNights} nights total)</h3>
                      <div className="space-y-2">
                        {state.destinations.map((dest, i) => {
                          const destInfo = destinations.find(d => d.id === dest.id);
                          if (!destInfo) return null;
                          return (
                            <div key={dest.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex flex-col gap-0.5">
                                <button onClick={() => moveDestination(dest.id, 'up')} disabled={i === 0}
                                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20">
                                  <ChevronUp size={14} />
                                </button>
                                <button onClick={() => moveDestination(dest.id, 'down')} disabled={i === state.destinations.length - 1}
                                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20">
                                  <ChevronDown size={14} />
                                </button>
                              </div>
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${destInfo.gradient} shrink-0`} />
                              <span className="font-medium text-gray-900 text-sm flex-1">{destInfo.name}</span>
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => updateDestination(dest.id, { nights: Math.max(1, dest.nights - 1) })}
                                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:border-[#003580] text-gray-600">
                                  <Minus size={10} />
                                </button>
                                <span className="text-sm font-bold w-8 text-center">{dest.nights}N</span>
                                <button onClick={() => updateDestination(dest.id, { nights: dest.nights + 1 })}
                                  className="w-6 h-6 border border-[#003580] bg-[#003580] text-white rounded flex items-center justify-center">
                                  <Plus size={10} />
                                </button>
                              </div>
                              <button onClick={() => removeDestination(dest.id)} className="text-gray-400 hover:text-red-500 ml-1">
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Hotels */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 3: Choose Hotels</h2>
                  <p className="text-gray-500 text-sm mb-5">Select accommodation tier for each destination</p>
                  {state.destinations.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No destinations selected. Go back to Step 2 to add destinations.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {state.destinations.map(dest => {
                        const destInfo = destinations.find(d => d.id === dest.id);
                        if (!destInfo) return null;
                        return (
                          <div key={dest.id} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${destInfo.gradient}`} />
                              <div>
                                <h3 className="font-bold text-gray-900">{destInfo.name}</h3>
                                <p className="text-xs text-gray-500">{dest.nights} night{dest.nights !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <HotelTierSelector
                              destination={destInfo.slug}
                              selectedTier={dest.hotelTier}
                              onSelectTier={(tier) => updateDestination(dest.id, { hotelTier: tier })}
                              selectedHotelId={dest.hotelId}
                              onSelectHotel={(hotelId) => updateDestination(dest.id, { hotelId })}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Vehicle */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 4: Choose Your Vehicle</h2>
                  <p className="text-gray-500 text-sm mb-2">All vehicles include professional driver, fuel, and tolls</p>
                  <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 mb-5 text-sm text-blue-800">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <span>Your group: {state.adults} adult{state.adults !== 1 ? 's' : ''}{state.children > 0 ? ` + ${state.children} child${state.children !== 1 ? 'ren' : ''}` : ''}.
                      Driver is always included. Choose a vehicle with sufficient capacity.</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {vehicles.map(v => (
                      <VehicleCard
                        key={v.id}
                        vehicle={v}
                        selected={state.vehicleId === v.id}
                        onSelect={(id) => updateState({ vehicleId: id })}
                        showFullDetails
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Activities */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Step 5: Activities & Add-ons</h2>
                  <p className="text-gray-500 text-sm mb-5">Enhance your trip with experiences tailored to your destinations</p>
                  <div className="space-y-6">
                    {state.destinations.map(dest => {
                      const destInfo = destinations.find(d => d.id === dest.id);
                      if (!destInfo) return null;
                      const destActivities = activities.filter(a => a.destination === destInfo.slug);
                      if (destActivities.length === 0) return null;
                      return (
                        <div key={dest.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${destInfo.gradient}`} />
                            <h3 className="font-bold text-gray-800">{destInfo.name}</h3>
                          </div>
                          <div className="space-y-2">
                            {destActivities.map(act => (
                              <ActivityCard
                                key={act.id}
                                activity={act}
                                selected={state.selectedActivityIds.includes(act.id)}
                                onToggle={toggleActivity}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {state.destinations.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No destinations selected. Go back to Step 2 to add destinations.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                {currentStep < 5 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#003580] text-white rounded-lg text-sm font-bold hover:bg-[#002560] transition-colors"
                  >
                    Next Step
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/confirmation', { state: { isCustom: true, breakdown, state } })}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#E32636] text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                  >
                    Get Final Quote →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Price Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-36">
              <PriceSummary
                breakdown={breakdown}
                adults={state.adults}
                children={state.children}
                mode="customizer"
                onReserve={() => navigate('/confirmation', { state: { isCustom: true, breakdown } })}
              />

              {/* Trip Overview */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 mt-4">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Trip Overview</h3>
                <div className="space-y-1.5 text-xs text-gray-600">
                  {state.arrivalDate && <div className="flex justify-between"><span>Arrival:</span><span className="font-medium">{state.arrivalDate}</span></div>}
                  {state.departureDate && <div className="flex justify-between"><span>Departure:</span><span className="font-medium">{state.departureDate}</span></div>}
                  <div className="flex justify-between"><span>Travelers:</span><span className="font-medium">{state.adults + state.children} ({state.adults}A {state.children}C)</span></div>
                  <div className="flex justify-between"><span>Total nights:</span><span className="font-medium">{totalNights}</span></div>
                  {state.destinations.length > 0 && (
                    <div>
                      <span className="block mb-1">Destinations:</span>
                      <div className="flex flex-wrap gap-1">
                        {state.destinations.map(d => {
                          const info = destinations.find(dest => dest.id === d.id);
                          return info ? (
                            <span key={d.id} className="bg-blue-50 text-[#003580] px-1.5 py-0.5 rounded text-xs font-medium">
                              {info.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <CustomizerProvider>
      <CustomizerInner />
    </CustomizerProvider>
  );
}
