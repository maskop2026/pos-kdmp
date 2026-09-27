import React from 'react';
import { Star, MapPin, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../types/palope';
import { formatRupiah } from '../utils/formatters';

interface FeaturedProductsProps {
  products: Product[];
  wishlistIds: string[];
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  wishlistIds,
  onAddToCart,
  onViewDetail,
  onToggleWishlist,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm mt-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Produk Unggulan
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#e60023] hover:underline cursor-pointer">
          Lihat Semua →
        </span>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Tidak ada produk dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {products.map((item) => {
            const isWishlisted = wishlistIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onViewDetail(item)}
                className="group bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-36 sm:h-44 bg-gray-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Location badge */}
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#e60023]" />
                    <span>{item.location}</span>
                  </span>

                  {/* Wishlist quick toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(item.id);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                      isWishlisted
                        ? 'bg-[#e60023] text-white'
                        : 'bg-white/80 hover:bg-white text-gray-500 hover:text-[#e60023]'
                    }`}
                    title="Tambah ke Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#e60023] transition-colors mb-1.5">
                      {item.name}
                    </h4>

                    <div className="text-sm font-extrabold text-[#e60023] mb-1">
                      {formatRupiah(item.price)}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-3">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-semibold text-gray-700">{item.rating}</span>
                      <span>·</span>
                      <span>{item.soldCount}</span>
                    </div>
                  </div>

                  {/* Button Group (Detail & Cart) matching HTML */}
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(item);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg border border-gray-200 hover:border-[#e60023] hover:text-[#e60023] text-gray-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      className="w-9 h-8 rounded-lg bg-[#e60023] hover:bg-[#cc001f] text-white flex items-center justify-center transition-colors shadow-xs"
                      title="Tambah ke Keranjang"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
