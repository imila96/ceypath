import type { TourPackage } from '../data/packages';
import type { Vehicle } from '../data/vehicles';
import { getVehiclesFixture } from '../repositories/vehiclesRepository';

export interface PackagePriceBreakdown {
  basePrice: number;
  vehicleUpgrade: number;
  addOnsTotal: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export interface HotelTierPricing {
  budget: number;
  standard: number;
  luxury: number;
}

export const HOTEL_TIER_MODIFIERS: HotelTierPricing = {
  budget: -80,
  standard: 0,
  luxury: 180,
};

export function calcPackageTotal(
  pkg: TourPackage,
  adults: number,
  children: number,
  vehicleId: string,
  selectedAddOnIds: string[],
  hotelTier: 'budget' | 'standard' | 'luxury' = 'standard',
  vehicles: Vehicle[] = getVehiclesFixture()
): PackagePriceBreakdown {
  const basePrice = pkg.price * (adults + children * 0.7);
  
  const selectedVehicle = vehicles.find(v => v.id === vehicleId);
  const defaultVehicle = vehicles.find(v => v.name === pkg.vehicle);
  const vehicleUpgrade = selectedVehicle && defaultVehicle
    ? Math.max(0, selectedVehicle.priceModifier - defaultVehicle.priceModifier) * (adults + children * 0.5)
    : 0;

  const hotelModifier = HOTEL_TIER_MODIFIERS[hotelTier] * pkg.nights;
  
  const addOnsTotal = pkg.addOns
    .filter(ao => selectedAddOnIds.includes(ao.id) && !ao.included)
    .reduce((sum, ao) => sum + ao.pricePerPerson * (adults + children * 0.5), 0);

  const subtotal = basePrice + vehicleUpgrade + hotelModifier + addOnsTotal;
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  return {
    basePrice,
    vehicleUpgrade,
    addOnsTotal: addOnsTotal + hotelModifier,
    subtotal,
    taxes,
    total,
  };
}

export interface CustomizerDestination {
  id: string;
  nights: number;
  hotelTier: 'budget' | 'standard' | 'luxury';
  hotelId?: string;
}

export interface CustomizerState {
  arrivalAirport: string;
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  destinations: CustomizerDestination[];
  vehicleId: string;
  selectedActivityIds: string[];
  specialRequirements: string;
}

export function calcCustomTotal(
  state: CustomizerState,
  hotels: Array<{ id: string; tier: string; pricePerNight: number }>,
  activitiesData: Array<{ id: string; pricePerPerson: number; included: boolean }>,
  vehicles: Vehicle[] = getVehiclesFixture()
): PackagePriceBreakdown {
  const pax = state.adults + state.children * 0.7;

  const hotelCost = state.destinations.reduce((sum, dest) => {
    const hotel = hotels.find(h => h.id === dest.hotelId);
    const nightlyRate = hotel ? hotel.pricePerNight : 
      dest.hotelTier === 'budget' ? 30 : dest.hotelTier === 'standard' ? 90 : 220;
    return sum + nightlyRate * dest.nights * pax * 0.5;
  }, 0);

  const selectedVehicle = vehicles.find(v => v.id === state.vehicleId);
  const totalNights = state.destinations.reduce((sum, d) => sum + d.nights, 0);
  const vehicleCost = selectedVehicle ? selectedVehicle.dailyRate * totalNights : 0;

  const activitiesCost = state.selectedActivityIds.reduce((sum, actId) => {
    const act = activitiesData.find(a => a.id === actId);
    if (!act || act.included) return sum;
    return sum + act.pricePerPerson * pax;
  }, 0);

  const BASE_PER_DAY = 35;
  const baseCost = BASE_PER_DAY * totalNights * pax;

  const subtotal = baseCost + hotelCost + vehicleCost + activitiesCost;
  const taxes = subtotal * 0.15;
  const total = subtotal + taxes;

  return {
    basePrice: baseCost,
    vehicleUpgrade: vehicleCost,
    addOnsTotal: activitiesCost,
    subtotal,
    taxes,
    total,
  };
}
