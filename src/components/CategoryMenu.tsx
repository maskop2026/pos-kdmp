import React from 'react';
import {
  Wheat,
  Store,
  Package,
  Coffee,
  Apple,
  Drumstick,
  Flame,
  Baby,
  Sparkles,
  Hammer,
  Warehouse,
  Ticket,
} from 'lucide-react';
import { CATEGORIES } from '../data/palopeData';

interface CategoryMenuProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat':
        return <Wheat className="w-5 h-5" />;
      case 'Store':
        return <Store className="w-5 h-5" />;
      case 'Box':
        return <Package className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Apple':
        return <Apple className="w-5 h-5" />;
      case 'Drumstick':
        return <Drumstick className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Baby':
        return <Baby className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5" />;
      case 'Warehouse':
        return <Warehouse className="w-5 h-5" />;
      case 'Ticket':
        return <Ticket className="w-5 h-5" />;
      default:
        return <Store className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm mt-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
          Kategori Pilihan
        </h3>
        {selectedCategory !== 'Semua' && (
          <button
            type="button"
            onClick={() => onSelectCategory('Semua')}
            className="text-xs text-[#e60023] hover:underline font-semibold"
          >
            Tampilkan Semua Kategori ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 text-center">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'Semua' : cat.name)}
              className={`group flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-red-50 text-[#e60023] ring-1 ring-[#e60023]'
                  : 'hover:bg-red-50/50 text-gray-700'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-1.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#e60023] text-white shadow-md'
                    : 'bg-red-50 text-[#e60023] group-hover:bg-[#e60023] group-hover:text-white group-hover:-translate-y-1 group-hover:shadow'
                }`}
              >
                {getIcon(cat.iconName)}
              </div>
              <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                {cat.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
