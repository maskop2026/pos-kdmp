import React, { useState } from 'react';
import { X, Star, MapPin, ShoppingCart, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types/palope';
import { formatRupiah } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Detail Produk
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="relative h-56 rounded-xl overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-gray-800 text-xs font-semibold px-2.5 py-1 rounded shadow flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#e60023]" />
              <span>{product.location}</span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs">
              <span className="bg-red-50 text-[#e60023] font-bold px-2 py-0.5 rounded">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-gray-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-700">{product.rating}</span>
                <span>·</span>
                <span>{product.soldCount}</span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug">
              {product.name}
            </h2>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#e60023]">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl space-y-1 leading-relaxed">
            <p className="font-semibold text-gray-800">Deskripsi Produk:</p>
            <p>{product.description || 'Produk sembako dan UMKM pilihan bermutu tinggi, siap diantar atau diambil di Posko PALOPE.'}</p>
            {product.weight && (
              <p className="text-gray-500 text-[11px] pt-1">
                Berat Satuan: <strong>{product.weight}</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Jaminan Kualitas 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Bisa Ambil di Posko</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-white p-0.5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-gray-800">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-2.5 px-4 bg-[#e60023] hover:bg-[#cc001f] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Masukkan Keranjang ({formatRupiah(product.price * qty)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
