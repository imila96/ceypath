import { useState } from 'react';
import { useCustomizerContext } from '../context/CustomizerContext';
import { CustomizerDestination } from '../utils/priceCalculator';

const STEP_FIELDS: Record<number, string[]> = {
  1: ['arrivalDate', 'departureDate'],
  2: ['destinations'],
  3: [],
  4: ['vehicleId'],
  5: [],
};

export function useCustomizer() {
  const { state, currentStep, setCurrentStep, updateState } = useCustomizerContext();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(step: number): boolean {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!state.arrivalDate) newErrors.arrivalDate = 'Please select an arrival date';
      if (!state.departureDate) newErrors.departureDate = 'Please select a departure date';
      if (state.arrivalDate && state.departureDate && state.arrivalDate >= state.departureDate) {
        newErrors.departureDate = 'Departure must be after arrival';
      }
    }

    if (step === 2) {
      if (state.destinations.length === 0) {
        newErrors.destinations = 'Please select at least one destination';
      }
    }

    if (step === 4) {
      if (!state.vehicleId) newErrors.vehicleId = 'Please select a vehicle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validate(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, 5));
    }
  }

  function prevStep() {
    setErrors({});
    setCurrentStep(Math.max(currentStep - 1, 1));
  }

  function goToStep(step: number) {
    setErrors({});
    setCurrentStep(step);
  }

  function addDestination(destId: string, defaultNights: number) {
    const exists = state.destinations.find(d => d.id === destId);
    if (!exists) {
      updateState({
        destinations: [
          ...state.destinations,
          { id: destId, nights: defaultNights, hotelTier: 'standard' },
        ],
      });
    }
  }

  function removeDestination(destId: string) {
    updateState({ destinations: state.destinations.filter(d => d.id !== destId) });
  }

  function updateDestination(destId: string, update: Partial<CustomizerDestination>) {
    updateState({
      destinations: state.destinations.map(d =>
        d.id === destId ? { ...d, ...update } : d
      ),
    });
  }

  function moveDestination(destId: string, direction: 'up' | 'down') {
    const idx = state.destinations.findIndex(d => d.id === destId);
    if (idx === -1) return;
    const newDests = [...state.destinations];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newDests.length) return;
    [newDests[idx], newDests[swapIdx]] = [newDests[swapIdx], newDests[idx]];
    updateState({ destinations: newDests });
  }

  function toggleActivity(actId: string) {
    const exists = state.selectedActivityIds.includes(actId);
    updateState({
      selectedActivityIds: exists
        ? state.selectedActivityIds.filter(id => id !== actId)
        : [...state.selectedActivityIds, actId],
    });
  }

  const totalNights = state.destinations.reduce((sum, d) => sum + d.nights, 0);

  return {
    state,
    currentStep,
    errors,
    nextStep,
    prevStep,
    goToStep,
    addDestination,
    removeDestination,
    updateDestination,
    moveDestination,
    toggleActivity,
    totalNights,
    updateState,
  };
}
