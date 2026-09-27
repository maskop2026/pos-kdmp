import React from 'react';
import { Tag, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types/palope';
import { formatRupiah } from '../utils/formatters';

interface PromoSectionProps {
  promos: Product[];
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export const PromoSection: React.FC<PromoSectionProps> = ({
  promos,
  onAddToCart,
  onViewDetail,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md mt-6 bg-gradient-to-br from-[#cc001f] to-[#8a0015] text-white">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80')",
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 sm:px-8 pt-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight drop-shadow-sm">
              Promo Bulan Ini
            </h3>
            <p className="text-[11px] text-red-100 hidden sm:block">
              Diskon spesial sembako dan produk lokal pilihan warga Pekalongan
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 flex items-center gap-1 transition-colors cursor-pointer">
          Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Product Cards Grid */}
      <div className="relative z-10 p-5 sm:p-8 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {promos.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewDetail(item)}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-gray-800 cursor-pointer group"
            >
              {/* Image box with discount badge */}
              <div className="relative h-32 sm:h-36 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.discountPercent && (
                  <span className="absolute top-2 left-0 bg-[#e60023] text-white text-[10px] font-bold px-2 py-0.5 rounded-r-md shadow">
                    -{item.discountPercent}%
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#e60023] transition-colors mb-1.5">
                    {item.name}
                  </h4>
                  {item.originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through block">
                      {formatRupiah(item.originalPrice)}
                    </span>
                  )}
                  <p className="text-sm font-extrabold text-[#e60023]">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="mt-2.5 w-full py-1.5 bg-red-50 hover:bg-[#e60023] text-[#e60023] hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
