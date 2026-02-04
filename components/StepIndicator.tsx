import React from 'react';

interface Step {
  id: number;
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick && index < currentStep && onStepClick(step.id)}
                disabled={index >= currentStep}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300 ease-out
                  ${index < currentStep 
                    ? 'bg-black text-white cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0' 
                    : index === currentStep 
                      ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-xl ring-4 ring-gray-200' 
                      : 'bg-white/50 backdrop-blur-sm text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </button>
              <div className="mt-3 text-center">
                <p className={`text-sm font-semibold transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                <p className={`text-xs mt-1 max-w-[100px] transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mb-12">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-black transition-all duration-500 ease-out rounded-full ${
                      index < currentStep ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
