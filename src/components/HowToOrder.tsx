import React from 'react';
import { Search, ShoppingBag, CreditCard, PackageCheck, ListChecks } from 'lucide-react';
import { ORDER_STEPS } from '../data/palopeData';

export const HowToOrder: React.FC = () => {
  const getStepIcon = (name: string) => {
    switch (name) {
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Cart':
        return <ShoppingBag className="w-6 h-6" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'Package':
        return <PackageCheck className="w-6 h-6" />;
      default:
        return <Search className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm mt-6">
      <div className="text-center mb-8">
        <h4 className="text-base sm:text-lg font-black text-gray-900 flex items-center justify-center gap-2">
          <ListChecks className="w-5 h-5 text-[#e60023]" />
          <span>Cara Order di PALOPE</span>
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Mudah, transparan, dan mendukung perputaran ekonomi pasar lokal
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connecting line on desktop */}
        <div className="hidden lg:block absolute top-7 left-16 right-16 h-0.5 bg-gray-200 -z-0" />

        {ORDER_STEPS.map((step) => (
          <div
            key={step.stepNumber}
            className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2 relative z-10 group"
          >
            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#e60023] text-[#e60023] group-hover:bg-[#e60023] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 group-hover:-translate-y-1">
              {getStepIcon(step.iconName)}
            </div>

            <div>
              <h5 className="text-xs sm:text-sm font-bold text-gray-800">
                {step.title}
              </h5>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-snug">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
