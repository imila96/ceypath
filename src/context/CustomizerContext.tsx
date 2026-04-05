import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomizerState } from '../utils/priceCalculator';

interface CustomizerContextType {
  state: CustomizerState;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateState: (partial: Partial<CustomizerState>) => void;
  resetState: () => void;
}

const defaultState: CustomizerState = {
  arrivalAirport: 'CMB',
  arrivalDate: '',
  departureDate: '',
  adults: 2,
  children: 0,
  destinations: [],
  vehicleId: 'v3',
  selectedActivityIds: [],
  specialRequirements: '',
};

const CustomizerContext = createContext<CustomizerContextType | null>(null);

export function CustomizerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CustomizerState>(defaultState);
  const [currentStep, setCurrentStep] = useState(1);

  function updateState(partial: Partial<CustomizerState>) {
    setState(prev => ({ ...prev, ...partial }));
  }

  function resetState() {
    setState(defaultState);
    setCurrentStep(1);
  }

  return (
    <CustomizerContext.Provider value={{ state, currentStep, setCurrentStep, updateState, resetState }}>
      {children}
    </CustomizerContext.Provider>
  );
}

export function useCustomizerContext() {
  const ctx = useContext(CustomizerContext);
  if (!ctx) throw new Error('useCustomizerContext must be used within CustomizerProvider');
  return ctx;
}
