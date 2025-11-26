
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ['Enviar Objeto', 'Escolher Cena', 'Finalizar', 'Baixar'];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300
                  ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-700 text-gray-400' : ''}
                `}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <p className={`mt-2 text-xs sm:text-sm text-center font-medium
                ${isActive ? 'text-blue-400' : 'text-gray-500'}
                ${isCompleted ? 'text-gray-300' : ''}
              `}>{step}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded
                ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}
              `}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;