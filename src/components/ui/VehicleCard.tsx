import React from 'react';
import { Luggage, Users, Wifi, Wind, Check } from 'lucide-react';
import type { Vehicle } from '../../repositories/vehiclesRepository';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../context/CurrencyContext';

interface Props {
  vehicle: Vehicle;
  selected?: boolean;
  priceModifierDiff?: number;
  onSelect?: (id: string) => void;
  showFullDetails?: boolean;
}

export default function VehicleCard({ vehicle, selected, priceModifierDiff, onSelect, showFullDetails = false }: Props) {
  const { currency } = useCurrency();

  return (
    <div
      onClick={() => onSelect?.(vehicle.id)}
      className={`relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer
        ${selected ? 'border-[#003580] shadow-md bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[#003580] rounded-full flex items-center justify-center z-10">
          <Check size={14} className="text-white" />
        </div>
      )}

      {/* Badge */}
      {vehicle.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-xs font-bold px-2 py-1 rounded bg-[#FFB700] text-[#003580]">
            {vehicle.badge}
          </span>
        </div>
      )}

      {/* Photo or gradient + emoji */}
      <div className="relative h-32 w-full overflow-hidden bg-gray-100">
        {vehicle.image ? (
          <img src={vehicle.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${vehicle.gradient} flex items-center justify-center`}>
            <span className="text-5xl" aria-hidden>
              {vehicle.type === 'Luxury' ? '🚘' : vehicle.type === 'SUV' ? '🚙' : vehicle.type === 'Minibus' ? '🚌' : '🚐'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-bold text-gray-900 text-sm mb-1">{vehicle.name}</h4>
        <p className="text-xs text-gray-500 mb-2">{vehicle.type}</p>

        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Users size={12} className="text-[#003580]" />
            Up to {vehicle.capacity}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Luggage size={12} className="text-[#003580]" />
            {vehicle.luggage} bags
          </span>
        </div>

        {showFullDetails && (
          <div className="flex flex-wrap gap-1 mb-2">
            {vehicle.features.map(f => (
              <span key={f} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {f === 'WiFi' ? '📶' : f === 'AC' ? '❄️' : ''} {f}
              </span>
            ))}
          </div>
        )}

        {!showFullDetails && (
          <div className="flex items-center gap-2 mb-2">
            {vehicle.features.includes('AC') && <span className="text-xs text-gray-500">❄️ AC</span>}
            {vehicle.features.includes('WiFi') && <span className="text-xs text-gray-500">📶 WiFi</span>}
          </div>
        )}

        {/* Price */}
        <div className="border-t border-gray-100 pt-2 mt-2 flex items-end justify-between">
          <div>
            {priceModifierDiff !== undefined ? (
              <p className={`font-bold text-sm ${priceModifierDiff === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {priceModifierDiff === 0 ? 'Included' : `+${formatCurrency(priceModifierDiff, currency)}`}
              </p>
            ) : (
              <p className="font-bold text-sm text-gray-900">{formatCurrency(vehicle.dailyRate, currency)}<span className="text-xs font-normal text-gray-500">/day</span></p>
            )}
          </div>
          {onSelect && (
            <span className={`text-xs font-semibold px-2 py-1 rounded ${selected ? 'bg-[#003580] text-white' : 'bg-gray-100 text-gray-600'}`}>
              {selected ? 'Selected' : 'Select'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
