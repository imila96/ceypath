import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function StepProgress({ steps, currentStep, onStepClick }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick && step.number < currentStep && onStepClick(step.number)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                  ${step.number < currentStep
                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                    : step.number === currentStep
                    ? 'bg-[#003580] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-default'
                  }`}
              >
                {step.number < currentStep ? <Check size={16} /> : step.number}
              </button>
              <span className={`text-xs mt-1 font-medium text-center max-w-[70px] leading-tight
                ${step.number === currentStep ? 'text-[#003580]' : step.number < currentStep ? 'text-green-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 mb-5 rounded transition-colors
                ${step.number < currentStep ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
